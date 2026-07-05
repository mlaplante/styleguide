---
name: styleguide-astro-upgrade-campaign
description: Use when planning or executing an Astro major-version bump (or a transitive Vite major bump that rides in with it) on the styleguide repo — e.g. astro 7.x to 8.x, or any jump that crosses a major version line. Use when the weekly deps/weekly-update PR (npm-check-updates --upgrade) turns out to have crossed an astro or vite major and needs a deliberate campaign instead of a routine merge. Symptoms/triggers: "upgrade astro", "bump astro major", "astro build fails after upgrade", "require_dist is not a function", "Astro requires Node", npm EBADENGINE, peer-dependency errors on astro/vite/@astrojs/sitemap after a bump, two copies of vite in npm ls, deciding whether a red build after a dependency bump is safe to force through, or reconciling a stale "Astro 6" reference after landing 7.x. Not for routine patch/minor dependency bumps (no major crossed) and not for diagnosing an unrelated live production failure.
---

# Styleguide Astro upgrade campaign

The decision-gated runbook for bumping Astro (and the Vite version that rides along
transitively) across a major version line on this repo. This is harder than the routine
weekly deps PR because Astro majors have broken this project before (see Phase 1 and
`styleguide-failure-archaeology`) and this repo has **no PR-triggered CI** — you are the gate.

## When NOT to use this skill

| Situation | Use instead |
|---|---|
| Routine minor/patch bump, no major crossed, weekly PR build is green | Just verify via `styleguide-change-control`'s merge checklist — this whole campaign is overkill |
| Deciding whether ANY change (not just a version bump) is safe to merge | `styleguide-change-control` — this skill's Phase 7 routes there, it does not replace it |
| A live/deployed failure with no upgrade in progress | `styleguide-debugging-playbook` |
| Recreating the env / reading config file anatomy (astro.config.mjs, tsconfig.json, engines) | `styleguide-build-and-env` |
| Command anatomy for `dev`/`build`/`preview`, CF Pages deploy mechanics | `styleguide-run-and-operate` |
| What already happened in past upgrades (4→6→7 history, commit hashes) | `styleguide-failure-archaeology` |
| Running the enforcement/lint scripts themselves | `styleguide-diagnostics-and-tooling` |
| You're about to add `@astrojs/cloudflare`, `wrangler`, or SSR "to fix" an upgrade error | Stop — wrong axis. This repo is a **static** build (`astro.config.mjs` has no adapter). See the fence below. |

---

## Phase 0 — Pre-flight: record the baseline

Run all of these before touching anything. If any gate here fails, stop — fix the
pre-existing problem first; it is not an upgrade problem.

```bash
git status --short                                              # expect: clean (or only your own untracked work)
grep -A2 '"node_modules/astro"' package-lock.json | grep version # record CURRENT astro (e.g. "7.0.3")
grep -A2 '"node_modules/vite"'  package-lock.json | grep version # record CURRENT vite  (e.g. "8.0.16", transitive via astro)
grep -A2 '"node"' package.json                                   # record Node floor (e.g. ">=22.12.0")
npm run build                                                    # GATE: expect "24 page(s) built"
npm audit                                                        # GATE: expect "found 0 vulnerabilities"
```

Write these five numbers down somewhere durable — they are the rollback target and the
"did this campaign actually change anything unexpected" diff base.

---

## Phase 1 — Read the breaking-change notes BEFORE bumping

Do this before running any install command.

1. Identify current vs. target major: `npm outdated` (shows Current/Wanted/Latest) or
   `npm view astro versions --json`.
2. Read Astro's official upgrade guide for the target major
   (`docs.astro.build/en/guides/upgrade-to/vN/`) and the changelog
   (`github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md`) — use WebFetch/WebSearch.
   Do this even if the version jump "looks like" a minor per `npm-check-updates`; majors have
   shipped inside routine-looking commits before (`be4d2c9`, see `styleguide-failure-archaeology`).
3. Skip / discount any breaking-change section about the `@astrojs/cloudflare` adapter, SSR
   `locals`/runtime env, or CSRF `Origin` header checks — **this repo has no adapter**. Those
   sections target a different deployment shape; see the Phase 3 branch table for the full
   rationale and verification command.
4. Since Vite has historically bumped a major alongside Astro (astro 6→7 brought vite→8), also
   skim Vite's release notes for the version astro's new `package.json` will pull in.
5. Check `@astrojs/sitemap`'s peer range against the target astro major — it's the only integration
   in `astro.config.mjs` and can lag behind a fresh astro major.

---

## Phase 2 — Bump in isolation

Isolate the major bump from routine minor/patch noise so a failure is attributable.

```bash
# targeted major bump only — do NOT run a blanket `npm-check-updates --upgrade` for this step
npm i astro@<target-major>
npm install
```

Or, if you want `npm-check-updates` to help pick the version:
```bash
npx npm-check-updates --target major --filter astro
npm install
```

After install, **read the diff**, don't just glance at `package.json`:
```bash
git diff package.json package-lock.json | grep -E '"(astro|vite|@astrojs/sitemap)"' -A1
```
A clean-looking `package.json` diff can still hide a stale-lockfile or peer-range problem —
cross-ref `dependabot-major-bump-package-json-only-clean-merge-hides-stale-lock-and-peer-cap`.

---

## Phase 3 — GATE: build

```bash
npm run build
npm audit
```

**Expected:** `24 page(s) built` and `found 0 vulnerabilities`, matching Phase 0's baseline page
count (vuln count may legitimately change with new transitive deps — investigate any increase,
don't wave it through).

If it does NOT match, branch here — do not force through, do not add flags to suppress errors:

| Observation | Root cause | Action |
|---|---|---|
| `require_dist is not a function` (or similar Vite pre-bundling/CJS-ESM error) | Two copies of Vite resolved in the tree (typically from a second package with its own nested Vite, e.g. a Tailwind Vite plugin) | Run `npm ls vite` to confirm duplication before assuming this applies. Cross-ref `astro6-cloudflare-require-dist-vite-duplication` — note that skill's repro is a Cloudflare **adapter** project; the underlying Vite-duplication mechanism can still apply here even without the adapter, so verify with `npm ls vite`, don't skip it just because we're static. |
| `npm EBADENGINE` / "Astro requires Node ..." / engine mismatch | The new astro major raised its Node floor | Bump the floor in lockstep: `package.json` `engines.node`, `.nvmrc`, and `.github/workflows/update-dependencies.yml`'s `setup-node` `node-version`. Historical precedent: commit `c511b8d` did exactly this (`>=20` → `>=22.12.0`) when Astro 6 raised its floor — see `styleguide-failure-archaeology`. |
| Error mentioning `@astrojs/cloudflare`, SSR adapter config, `locals`, or Cloudflare runtime env | **Known wrong path for this repo** — N/A here | We ship a static build with no adapter configured (verify: `astro.config.mjs` is 7 lines — `site` + `sitemap()` only, no `adapter` key). Do NOT add the adapter to make an error go away. If someone is deliberately introducing SSR alongside the upgrade, that is a separate architectural decision requiring its own `styleguide-change-control` review, not a fix folded into this campaign. |
| `@astrojs/sitemap` peer-dependency warning or error | Integration hasn't caught up to astro's new peer range | Bump `@astrojs/sitemap` to the version satisfying the new range, re-run Phase 3. |
| Prettier / `prettier-plugin-astro` warnings only, build still green | Cosmetic, not a build blocker | `npm run format`, then `npm run format:check` to confirm clean. |
| Anything else / unclear | Unknown — do not guess | Stop. Use `styleguide-debugging-playbook` for live triage. Once resolved, the incident belongs in `styleguide-failure-archaeology`. |

---

## Phase 4 — Verify the Node floor still holds on Cloudflare Pages

CF Pages build config (per README's Deployment section) sets `NODE_VERSION=22`. If Phase 3 forced
you to raise `engines.node` past what Node 22.x can satisfy, that's a hard deploy blocker on CF
Pages, not just a local dev inconvenience — the `NODE_VERSION` env var in the CF Pages project
settings would need to move in lockstep with `.nvmrc`/`package.json`. Changing that env var is
itself a change-controlled action (see Phase 7); this repo skill cannot flip it for you.

---

## Phase 5 — Run the diagnostic scripts

Cross-ref `styleguide-diagnostics-and-tooling` for the enforcement scripts (hardcoded-color scan,
`is:global` scan, no-blur scan, single-gradient scan). Run them after the bump to confirm the
upgrade — or any auto-formatting it triggered — didn't regress a non-negotiable from `styleguide-change-control`.

---

## Phase 6 — Manual visual spot-check of all 24 pages

```bash
npm run preview   # serves the just-built dist/
```
Load every route and eyeball it in both light and dark chrome mode: `/`, `/404`, `/logo`, `/motion`,
`/colors/{primary,accent-palette,neutrals}`, `/type/{hero,headings,body,eyebrow}`,
`/spacing/{scale,radii,shadows}`,
`/components/{buttons,input,blog-nav,post-card,service,timeline,badges,callouts}`,
`/ui-kits/{blog,portfolio}`. Open devtools while doing it and confirm: no CSP violations logged
(the `public/_headers` policy blocks anything not `'self'`), and no failed font network requests
(fonts are self-hosted `@fontsource` woff2 — an upgrade that changes the font pipeline would show
up here first).

---

## Phase 7 — Validation and promotion (routes through change control)

This campaign does **not** end in a merge. It ends by handing off to `styleguide-change-control`,
whose gate you must pass before anything touches `main`:

- Success is measured by: Phase 3 build gate green + Phase 5 scripts pass + Phase 6 visual
  spot-check pass. **Never** by "the build looks fine" alone — this repo has no PR-triggered CI,
  so this checklist IS the CI.
- As part of promotion, reconcile any stale version prose your bump exposes — e.g. this repo's
  commit history refers to "Astro 6" (`c511b8d`) from when that was current; if you land a new
  major, sweep `README.md` and commit messages for any hardcoded major-version claims and fix them
  (cross-ref `styleguide-docs-and-writing`).
- Record the new baseline (astro/vite versions, Node floor, page count, vuln count) somewhere
  durable — it's Phase 0 for the *next* campaign.

---

## Known wrong paths — do NOT do these

- **Merging the weekly `deps/weekly-update` PR because the build shows green**, without diffing
  what actually moved. `npm-check-updates --upgrade` does not distinguish a major bump from a
  minor one, and a major has landed under a routine-sounding commit subject before (`be4d2c9`,
  "chore(deps): update all packages to latest" — actually an astro 6→7 major). Always check
  `npm ls astro` / diff the lockfile before trusting a green weekly PR that touches astro or vite.
- **Assuming a Cloudflare-adapter/SSR-runtime breaking-change skill applies here.** This repo has
  no `@astrojs/cloudflare` adapter (verify: `astro.config.mjs` is 7 lines, integrations is just
  `[sitemap()]`). Skills like `astro6-cloudflare-locals-runtime-env-removed` and
  `astro-csrf-origin-header-403-on-post` target that different setup — read them for background
  only if this repo ever adds the adapter, which is its own change-controlled decision.
- **Adding `wrangler.toml` or the CF adapter to make a Node/runtime error go away.** Wrong axis for
  a static site; see the Phase 3 branch table row for adapter-shaped errors.
- **Blanket `npm-check-updates --upgrade` as the major-bump mechanism.** That command is fine for
  the weekly routine-minors workflow; a deliberate major campaign should isolate the astro/vite
  bump (Phase 2) so a failure is attributable to it alone.

---

## Cross-references

| Topic | Skill |
|---|---|
| Merge/deploy gate, non-negotiables, deps-PR merge rule | `styleguide-change-control` |
| Full incident chronicle (the 4→6→7 history, exact commit hashes) | `styleguide-failure-archaeology` |
| Package.json-only-diff-hides-lockfile-drift trap | `dependabot-major-bump-package-json-only-clean-merge-hides-stale-lock-and-peer-cap` |
| Live triage of a red build / unclear failure | `styleguide-debugging-playbook` |
| Config file anatomy, env recreation, resolved versions | `styleguide-build-and-env` |
| Command anatomy, CF Pages deploy mechanics, `dist/` shape | `styleguide-run-and-operate` |
| Enforcement/lint scripts to run post-bump | `styleguide-diagnostics-and-tooling` |
| README/doc drift fixes after promotion | `styleguide-docs-and-writing` |
| Vite-duplication error pattern (assumes CF adapter — verify applicability with `npm ls vite`) | `astro6-cloudflare-require-dist-vite-duplication` |

---

## Provenance and maintenance

Facts below verified 2026-07-05 by reading `package.json`, `package-lock.json`,
`astro.config.mjs`, `.github/workflows/update-dependencies.yml`, and by running `npm run build`
and `npm audit` in this repo:

| Fact (as of 2026-07-05) | Value | Re-verify with |
|---|---|---|
| Resolved astro version | 7.0.3 | `grep -A2 '"node_modules/astro"' package-lock.json \| grep version` |
| Resolved vite version (transitive) | 8.0.16 | `grep -A2 '"node_modules/vite"' package-lock.json \| grep version` |
| Node engine floor | `>=22.12.0` | `grep -A2 '"node"' package.json` |
| Golden page count | 24 | `npm run build` → look for "N page(s) built" |
| Vulnerabilities | 0 | `npm audit` |
| Only integration in `astro.config.mjs` | `@astrojs/sitemap` | `cat astro.config.mjs` |
| Weekly deps workflow mechanism | `npx npm-check-updates --upgrade && npm install`, verified with `npm run build`, PR to `deps/weekly-update` | `cat .github/workflows/update-dependencies.yml` |
| CF Pages Node env var | `NODE_VERSION=22` | `grep -A1 'NODE_VERSION' README.md` |

Next check to run before starting any future campaign: `npm outdated` — as of 2026-07-05 it shows
astro `7.0.6` available (patch only, no major yet); re-run it to see if a major has since appeared.
