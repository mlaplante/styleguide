---
name: styleguide-change-control
description: Use when classifying or gating any change to the styleguide repo (design-token add/edit, component or lp-* class change, new page, dependency bump, the weekly auto-deps PR on branch deps/weekly-update, astro.config.mjs/tsconfig.json/.prettierrc/engines/public/_headers edits, or any brand/palette/gradient/card/emoji/voice change). Use before merging any PR to main or answering "is this safe to merge / can I merge this", since main is production with no staging and this repo has no pull_request-triggered CI. Also use when deciding whether a change needs sign-off versus a routine build-and-format check, or when another skill's proposed change needs a gate before it lands. Symptoms/keywords: change classification, merge gate, deploy gate, weekly dependency PR, npm-check-updates, red build, non-negotiables, brand-sacred, CSP change, external CDN/font added, new gradient, new card style.
---

# Styleguide Change Control

This is the HUB skill. Every change to this repo — token, component, page, dependency,
config, or brand — routes through the classification and gate below before it reaches
`main`. No sibling skill may bypass this gate; if a sibling skill's runbook ends in "now
commit/merge/deploy," come back here first.

## When NOT to use this skill

| If you need...                                                 | Use instead                          |
| -------------------------------------------------------------- | ------------------------------------ |
| Brand doctrine values (exact palette, type scale, voice rules) | `laplante-brand-reference`           |
| Full incident chronicle (symptom → root cause → evidence)      | `styleguide-failure-archaeology`     |
| Token/class catalog (every `--lp-*`/`--sg-*`, `lp-*`/`sg-*`)   | `styleguide-design-tokens-reference` |
| The Astro-major-version decision campaign itself               | `styleguide-astro-upgrade-campaign`  |
| Triage of a live/deployed failure                              | `styleguide-debugging-playbook`      |
| Env/version/config recreation details                          | `styleguide-build-and-env`           |
| Adding a page/component template mechanics                     | `styleguide-docs-and-writing`        |

## The gate: there is no PR-triggered CI

Verified fact (2026-07-05): this repo has exactly one GitHub Actions workflow,
`.github/workflows/update-dependencies.yml`. Its triggers are `schedule` (Mondays 09:00
UTC) and `workflow_dispatch` — **not** `pull_request`. Nothing automated checks a normal
PR before merge. Cloudflare Pages (git-integration, static build, no `@astrojs/cloudflare`
adapter) builds every push — `main` → production at https://brand.michaellaplante.com,
other branches → preview URLs — but that build happens on push, after merge, not as a
merge gate.

**Consequence: before merging any PR to `main`, run the checks yourself:**

```bash
npm run build         # must emit "24 page(s) built" — README/ground-truth golden count
npm run format:check   # prettier --check . (prettier-plugin-astro, singleQuote, printWidth 100)
```

`main` is sacred: a merge is a production deploy, immediately, with no staging step.

## Change taxonomy — classify before you touch anything

| Change type                                                                                                        | Gate before merge                                                                                                                                                 | Owning skill for mechanics                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Token change (`--lp-*` / `--sg-*` add or edit in `src/styles/global.css`)                                          | No raw hex/px left behind elsewhere; `npm run build` + `format:check`                                                                                             | `styleguide-design-tokens-reference`                                                                                                                                  |
| Component change (`lp-*` class in `src/styles/components.css`, or a `src/components/brand/*` wrapper)              | Edit `components.css` in the ONE place; update the matching `CodeSnippet` on that component's specimen page; re-check every `ui-kits/` page that reuses the class | `styleguide-architecture-contract`                                                                                                                                    |
| Page add                                                                                                           | Register in `src/data/nav.ts` (sidebar + landing grid both read this one file); scoped `<style>` in the page, never `is:global`                                   | `styleguide-docs-and-writing`                                                                                                                                         |
| Dependency bump (manual or the weekly PR)                                                                          | See "weekly auto-deps PR" below — never merge on red `npm run build`                                                                                              | `styleguide-astro-upgrade-campaign` (for Astro majors), `dependabot-major-bump-package-json-only-clean-merge-hides-stale-lock-and-peer-cap` (for the stale-lock trap) |
| Brand change (palette / gradient / blur / card style / emoji / voice)                                              | SACRED — treat as requiring explicit maintainer sign-off, not a routine build-passes merge (see non-negotiables below)                                            | `laplante-brand-reference`                                                                                                                                            |
| Config change (`astro.config.mjs`, `tsconfig.json`, `.prettierrc`, `engines` in `package.json`, `public/_headers`) | `npm run build` still emits 24 pages; `_headers` edits get extra scrutiny — see below                                                                             | `styleguide-build-and-env`                                                                                                                                            |

## The weekly auto-deps PR — the sharpest edge

- `.github/workflows/update-dependencies.yml`: cron `"0 9 * * 1"` (Mondays 09:00 UTC) +
  `workflow_dispatch`, on `node-version: 22`. Runs `npx npm-check-updates --upgrade &&
npm install`, then `npm run build` as its own verification step, then opens a PR via
  `peter-evans/create-pull-request@v7` on branch `deps/weekly-update`, commit message
  `chore(deps): update all packages to latest`, labeled `dependencies`.
- **Never merge that PR if its `npm run build` step is red.**
- Green is not sufficient either: a `package.json`-only diff in the PR can still hide a
  stale `package-lock.json` or a peer-dependency cap the build step never exercises —
  cross-ref `dependabot-major-bump-package-json-only-clean-merge-hides-stale-lock-and-peer-cap`.
- Real incident, commit `c511b8d` ("fix(ci): require Node >=22.12.0 for Astro 6"): the
  workflow's `setup-node` was pinned to Node 20 while the already-installed Astro 6.x
  required `>=22.12.0`, so the workflow's own build-verify step failed until `.nvmrc`,
  `package.json` `engines`, and the workflow were all realigned to Node 22. Node floor is
  now `>=22.12.0` everywhere (`.nvmrc`, `package.json` engines, workflow, CF Pages
  `NODE_VERSION`). Full chronicle: `styleguide-failure-archaeology`.
- Astro major bumps are not routine deps-PR material: this repo jumped `4.16.19 → 6.2.2`
  in one commit (`c2645a5`, "to patch 16 vulnerabilities"), then `6.4.4` (`be0a6e3`) and
  `6.4.6` (`77efdff`) as security follow-ups, later reaching `7.0.3`. Route an Astro major
  through `styleguide-astro-upgrade-campaign` instead of letting the weekly PR auto-merge it.
- For scale: the entire "Audit and refactor" pass (`cb5c0e3`, #1) touched 32 files across
  every page and `nav.ts`; the brand-library extraction (`201ae85`, #6) touched 38 files
  including new `src/components/brand/*` wrappers, `CodeSnippet.astro`, and `.prettierrc`.
  Changes of that size still gate through the same rule: `npm run build` and
  `format:check` clean, brand rows reviewed by a human, before `main`.

## The non-negotiables — gated brand/config changes (rationale in one line; full doctrine in `laplante-brand-reference`)

None of these are caught by `npm run build`. They are a human-review gate, not a tooling gate.

- **One gradient only** (blog sticky-nav 135°, `#2980b9 → #1a6da3`). Rationale: stops
  gradient creep diluting the brand toward generic SaaS. Reject a second gradient at
  review — build cannot detect it.
- **No `backdrop-filter`/blur anywhere.** Same rationale: trend-chasing vs. brand
  discipline.
- **Dark-mode toggle emoji is `☀️`/`🌙` only**, no emoji elsewhere in copy/headings/UI.
- **No new card styles** — the only card is the blog teaser card; portfolio has no card
  layer. Prevents component sprawl.
- **Self-hosted fonts only** (Poppins + Roboto Mono via `@fontsource`). This one IS
  partly enforced by tooling: `public/_headers` sets `font-src 'self'`, so an external
  font request doesn't just violate style, it is blocked by the browser in production.
  Known drift: `project/README.md` and `project/SKILL.md` (the layer-2 design bundle)
  still describe Google Fonts `@import`; the live site (`src/styles/global.css`) moved to
  `@fontsource` — don't let that stale doc get copied into a PR.
- **Palette discipline**: indigo `#3F51B5` primary; the blog-blue gradient is the only
  secondary-accent gradient; Material-style accents are opt-in tokens, never defaults;
  warm neutrals, not true grey.
- **CSP is load-bearing** (`public/_headers`, verified 2026-07-05): `default-src 'self';
base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src
'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'
'unsafe-inline'; connect-src 'self'; upgrade-insecure-requests`. Adding any external
  host (CDN script, font, stylesheet, image, analytics) **silently breaks production** —
  the browser blocks the request client-side; `npm run build` will still succeed because
  it never fetches it. Treat any PR that adds an external URL as a config-change row
  above, gated on manually loading the built preview and checking the browser console for
  CSP violations, not just on a green build.

## Provenance and maintenance

(All facts below verified against the repo on 2026-07-05.)

- Re-verify this is still the only workflow (no PR-triggered CI added since):
  `ls .github/workflows/`
- Re-verify the weekly workflow's trigger/schedule/steps: `cat .github/workflows/update-dependencies.yml`
- Re-verify Node floor and Astro version: `grep -A1 '"engines"' package.json` and
  `grep -A2 '"node_modules/astro"' package-lock.json | grep version`
- Re-verify the CSP directives: `cat public/_headers`
- Re-verify `nav.ts` is still the single sidebar+landing source: `head -5 src/data/nav.ts`
- Re-verify golden page count: `npm run build` (expect "24 page(s) built")
- Re-verify cited commits still exist and their messages: `git log --oneline -40`,
  `git show -s <hash> --format='%B'` for `c511b8d`, `c2645a5`, `be0a6e3`, `77efdff`,
  `cb5c0e3`, `201ae85`, `f6424a5`.
