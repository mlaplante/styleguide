---
name: styleguide-failure-archaeology
description: Use when asked "why is this the way it is", "has this broken before", "what happened during the Astro upgrade", "why does the README disagree with package.json", "who added the weekly deps workflow and why", "is this a known issue" or "has anyone hit this before" about the styleguide Astro repo. Use before repeating a past investigation from scratch, before assuming a commit message's stated version is current, or when auditing dependency-bump/security-patch/refactor history for this repo. Symptoms this retrieves history for: Astro major-version bumps (4→6→7), CVE/advisory patches (16 vulnerabilities, devalue advisory), a Node-engine mismatch that broke CI, README/package.json version disagreement, silent doc drift after a font-loading change, and the provenance of the weekly dependency-update workflow. Third-person chronicle/reference lookup, not a live triage guide and not a forward-looking upgrade plan.
---

# Styleguide failure archaeology

The chronicle of this repo's git history: every dependency bump, security patch, refactor, and
doc-drift incident, as symptom → root cause → evidence (commit hash) → status. Retrieval tool, not
a workflow — read a row, then go verify it yourself with the commands given.

## When NOT to use this skill

| You need...                                                                      | Use instead                                                                   |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| A live bug happening right now (build red, CSP blocking something, font missing) | `styleguide-debugging-playbook`                                               |
| The forward-looking plan for the NEXT Astro upgrade                              | `styleguide-astro-upgrade-campaign`                                           |
| Whether a change is allowed / how to gate and ship it                            | `styleguide-change-control` (this skill never authorizes a change on its own) |
| WHY the architecture is shaped this way (not history — current rationale)        | `styleguide-architecture-contract`                                            |
| Current resolved dependency versions / config file anatomy                       | `styleguide-build-and-env`                                                    |
| Fixing the README drift documented below                                         | `styleguide-docs-and-writing`                                                 |

## The chronicle

All hashes verified against `git log --oneline -60` and `git show <hash>` on 2026-07-05. Ordered
oldest → newest. Re-run `git log --oneline -60` yourself before citing a hash — this table does not
survive a history rewrite.

| Date       | Commit    | Symptom / trigger                                                                                                                                                     | Root cause                                                                                                                                                                      | Status                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-04 | `c2645a5` | 16 known vulnerabilities in the dependency tree                                                                                                                       | Astro pinned at `4.16.19`, several majors behind                                                                                                                                | **Settled** — bumped straight to `6.2.2` (subject: "Upgrade astro 4.16.19 -> 6.2.2 to patch 16 vulnerabilities")                                                                                                                                                                                                                                               |
| 2026-05-09 | `cf7addd` | routine drift                                                                                                                                                         | minor/patch versions behind ranges                                                                                                                                              | Settled — "update dependencies to latest minor versions"                                                                                                                                                                                                                                                                                                       |
| 2026-05-15 | `8c52860` | transitive `devalue` security advisory                                                                                                                                | `devalue` pulled in via astro                                                                                                                                                   | Settled — "update astro to 6.3.3 and patch devalue advisory"                                                                                                                                                                                                                                                                                                   |
| 2026-05-17 | `cb5c0e3` | ad-hoc page structure, no single nav registry, missing motion/badges/callouts pages                                                                                   | pre-refactor codebase had grown organically                                                                                                                                     | Settled (foundational) — PR #1 "Audit and refactor the entire styleguide"; introduced `src/data/nav.ts`, `motion.astro`, `components/badges.astro`, `components/callouts.astro`; 32 files touched                                                                                                                                                              |
| 2026-05-19 | `adea307` | routine drift                                                                                                                                                         | deps behind within existing ranges                                                                                                                                              | Settled                                                                                                                                                                                                                                                                                                                                                        |
| 2026-06-06 | `be0a6e3` | astro patch release available                                                                                                                                         | routine bump                                                                                                                                                                    | Settled — PR #2 "Update astro to 6.4.4"                                                                                                                                                                                                                                                                                                                        |
| 2026-06-11 | `77efdff` | security patch release                                                                                                                                                | routine security bump                                                                                                                                                           | Settled — PR #3 "chore(security): update astro to 6.4.6"                                                                                                                                                                                                                                                                                                       |
| 2026-06-12 | `f6424a5` | manual deps upkeep was ad hoc                                                                                                                                         | no scheduled automation existed                                                                                                                                                 | Settled (new capability) — PR #4 adds `.github/workflows/update-dependencies.yml` (weekly `npm-check-updates --upgrade && npm install`, verifies with `npm run build`, opens PR on `deps/weekly-update`); this is the automation that the "never merge on a red build" rule in `styleguide-change-control` governs                                             |
| 2026-06-22 | `c511b8d` | the new weekly workflow above was silently broken: it pinned Node 20 while Astro 6.x requires `>=22.12.0`                                                             | CI Node version and Astro's floor had drifted apart                                                                                                                             | **Settled (stall resolved)** — "fix(ci): require Node >=22.12.0 for Astro 6"; aligned `.nvmrc` (`20`→`22`), `package.json` `engines.node` (`>=20`→`>=22.12.0`), and the workflow's `setup-node` in one 4-file commit                                                                                                                                           |
| 2026-06-22 | `be4d2c9` | none reported — merged as routine                                                                                                                                     | **the actual Astro 6→7 MAJOR bump** (`astro` `^6.4.6` → `^7.0.0`) landed inside a generically-titled "chore(deps): update all packages to latest" commit, same day as `c511b8d` | **Live / unreconciled** — see "The live doc-drift" below; this is a real instance of the exact trap in `dependabot-major-bump-package-json-only-clean-merge-hides-stale-lock-and-peer-cap`: `npm-check-updates --upgrade` does not distinguish a major bump from a minor one, and the commit subject gave no signal that a major version line had been crossed |
| 2026-06-27 | `6165281` | perf/security push                                                                                                                                                    | font loading via `@import url('https://fonts.googleapis.com/...')` was a render-blocking external request; no static security headers existed yet                               | Settled — "perf: tune font loading and static security headers"; replaced the Google Fonts `@import` with 9 local `@font-face` rules pointing at `@fontsource` woff2 files, and added `public/_headers` (CSP + `nosniff` + `Referrer-Policy` + `Permissions-Policy` + immutable cache-control for `/_astro/*` and `/assets/*`)                                 |
| 2026-06-29 | `9432bab` | routine weekly-workflow run                                                                                                                                           | lockfile-only prune, no `package.json` change                                                                                                                                   | Settled — PR #5, bot-authored (`github-actions[bot]`), touches only `package-lock.json` (54 deletions)                                                                                                                                                                                                                                                         |
| 2026-07-03 | `201ae85` | component styling duplicated between specimen pages and UI kits; README still said fonts "loaded via Google Fonts" 6 days after `6165281` had switched to self-hosted | no shared component layer existed yet; README wasn't updated in step with the font change                                                                                       | Settled — PR #6 "feat: extract shared brand component library with code snippets"; added `src/components/brand/*` (7 components), `CodeSnippet.astro`, `404.astro`, `.prettierrc`/`.prettierignore`, and **corrected** the README's font-loading line to "self-hosted via `@fontsource`"                                                                       |

**No revert commits exist in this repo's history** (verified: `git log --all --oneline \| grep -i revert` returns nothing). If one ever lands, add it as a row here rather than treating it as a one-off.

## The live doc-drift: unreconciled Astro major-version silence

Verified state as of 2026-07-05:

- `package.json` declares `"astro": "^7.0.3"`; `package-lock.json` resolves `"version": "7.0.3"` for
  `node_modules/astro` — re-verify: `grep -A2 '"node_modules/astro"' package-lock.json \| grep version`.
- The 6→7 major crossing happened in `be4d2c9` ("chore(deps): update all packages to latest") whose
  **body** says "Bump astro ^6.4.6 -> ^7.0.0 via npm-check-updates" but whose **subject line** is
  identical in style to routine minor bumps (`9432bab`, `adea307`, `cf7addd`) — you cannot tell a
  major crossed from `git log --oneline` alone, only by reading the body or diffing `package.json`.
- No commit after `be4d2c9`, and no line in the current `README.md`, ever announces "now on Astro 7."
  Correction to a common assumption: the current `README.md` does **not** contain the literal string
  "Astro 6" anywhere (verified: `grep -n -i "astro 6" README.md` is empty, and
  `git log -p --all -- README.md \| grep -i "astro 6"` across all history is also empty) — it never
  states an Astro major version at all. The drift is a **silence**, not a false claim: three commit
  subjects (`be0a6e3`, `77efdff`, `c511b8d`) reference "Astro 6" as recent history, and nothing in
  prose ever supersedes that impression with "Astro 7."
- Reconciling this is a docs change, not a code change: file it as work for
  `styleguide-docs-and-writing` (README maintenance owner) and gate any accompanying behavior change
  through `styleguide-change-control`. Forward-looking major-upgrade process lives in
  `styleguide-astro-upgrade-campaign`.

## Secondary drift already caught and fixed (don't re-open)

- **Font loading vs. README** (2026-06-27 → 2026-07-03 window): `6165281` switched
  `src/styles/global.css` from a Google Fonts `@import` to self-hosted `@fontsource` `@font-face`
  rules, but `README.md`'s "Design tokens" section still said "loaded via Google Fonts" until
  `201ae85` corrected it six days later. Already resolved — do not re-introduce the `@import`, and
  do not "fix" `src/` to match `project/README.md`/`project/SKILL.md`, which still describe the
  pre-`6165281` Google-Fonts state as a historical artifact of the original design bundle (see
  `styleguide-architecture-contract` for the three-layer lineage that explains why `project/` is
  allowed to lag `src/`).
- **CI stall from Node/Astro engine mismatch** (resolved 2026-06-22, `c511b8d`): the weekly deps
  workflow (`f6424a5`) was pinned to Node 20 while Astro 6.x needs `>=22.12.0`, so its build
  verification step was silently failing before `c511b8d` aligned `.nvmrc`, `package.json.engines`,
  and the workflow's `setup-node` step to Node 22 in one commit.

## Cross-references

- `styleguide-astro-upgrade-campaign` — the executable, decision-gated playbook for the _next_
  Astro upgrade; use this chronicle to know what's already been tried.
- `dependabot-major-bump-package-json-only-clean-merge-hides-stale-lock-and-peer-cap` — the general
  pattern behind the `be4d2c9` incident above; read it before trusting any future green
  "update all packages to latest" PR.
- `styleguide-change-control` — governs whether/how the doc-drift above gets fixed and whether the
  weekly deps PR (`deps/weekly-update` branch) may be merged.
- `styleguide-architecture-contract` — the three-layer (`resumesite` / `project/` / `src/`) lineage
  that explains why `project/`'s docs are allowed to lag `src/`.

## Provenance and maintenance

All hashes, dates, diffs, and file counts above verified directly against this repo's git history
on **2026-07-05**. Nothing here is inferred from commit subjects alone — every "root cause" line was
checked against `git show <hash>` output, not guessed from the title.

Re-verify commands (run all before trusting this skill after any new commits land):

```bash
# full commit list this chronicle is built from — re-run before assuming no new incidents exist
git log --oneline -60

# re-check the exact Astro version currently resolved
grep -A2 '"node_modules/astro"' package-lock.json | grep version

# confirm the major-bump commit's body still reads as described
git show be4d2c9 --stat
git show be4d2c9 -- package.json

# confirm README still doesn't literally say "Astro 6" (if it now does, someone added it — flag it)
grep -n -i "astro 6" README.md

# confirm no revert commits have landed since this was written
git log --all --oneline | grep -i revert

# confirm the font @font-face vs @import state hasn't regressed
grep -n "@font-face\|@import" src/styles/global.css | head
```

If any of these disagree with a row above, the row is stale — correct it here rather than trusting
memory, and do not use a stale row to justify skipping verification on a live task.
