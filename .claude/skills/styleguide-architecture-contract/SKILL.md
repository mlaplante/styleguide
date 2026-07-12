---
name: styleguide-architecture-contract
description: Use when working out WHY this Astro styleguide repo is structured the way it is, before changing it — questions about the resumesite/project//src three-layer relationship, whether project/ or src/ is authoritative, where component CSS canonically lives (components.css vs brand/*.astro wrappers), why DocsLayout+nav.ts is the single source of truth for sidebar and landing page, why the CSP has script-src/style-src 'unsafe-inline', why fonts are self-hosted instead of Google Fonts @import, why there is no Cloudflare adapter/SSR/wrangler config, or what the known architectural weak points are (no test suite, README drift, unsafe-inline CSP, node_modules-relative @font-face url()). Also applies before adding any new build tool, adapter, external CDN reference, or server-side feature, to check it against the static-only invariant. Symptoms/triggers: "which layer owns this fact", "can I add is:global", "why does the CSP allow unsafe-inline", "why self-hosted fonts", "why no SSR/adapter here", "is this repo statically built".
---

# Styleguide architecture contract

Explains the load-bearing structural decisions of this repo and why they exist, so you don't
"fix" something that is actually intentional. This is a **contract**, not a catalog — for token
values/class names see `styleguide-design-tokens-reference`; for brand voice/palette doctrine see
`laplante-brand-reference`; for the rationale-backed non-negotiables list and the PR/deploy gate
see `styleguide-change-control` (nothing here overrides that gate).

## When NOT to use this skill

| You need...                                                    | Use instead                          |
| -------------------------------------------------------------- | ------------------------------------ |
| Exact `--lp-*`/`--sg-*` token values, `lp-*`/`sg-*` class list | `styleguide-design-tokens-reference` |
| Brand palette/type/spacing/motion/voice doctrine               | `laplante-brand-reference`           |
| Whether a change is allowed and how to gate/ship it            | `styleguide-change-control`          |
| Chronicle of past incidents/upgrades                           | `styleguide-failure-archaeology`     |
| Live symptom → fix triage                                      | `styleguide-debugging-playbook`      |
| Local env setup, config file anatomy                           | `styleguide-build-and-env`           |
| Command anatomy, CF Pages deploy mechanics                     | `styleguide-run-and-operate`         |

## 1. The three-layer lineage (do not confuse these)

| Layer                                           | What                                                                                                                                       | Role                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `resumesite` (`mlaplante/resumesite` on GitHub) | The REAL product: michaellaplante.com portfolio + blog                                                                                     | Source of the brand. NOT in this repo.                                                                                             |
| `project/` (this repo)                          | Original "Claude Design" bundle extracted from resumesite: its own `SKILL.md` + `README.md` + static HTML previews + `colors_and_type.css` | Historical source-of-truth for which prototype each `src/` page was ported from. Read-only reference — do not treat it as current. |
| `src/` (this repo)                              | The live Astro styleguide site                                                                                                             | Documents layer 1, using tokens distilled from layer 2. This is what deploys.                                                      |

**Why it matters:** the layers drift, and that's expected, not a bug to silently "fix" by copying
one into another. Verified drift as of 2026-07-05: `project/README.md` (line ~202) says fonts load
via Google Fonts `@import` ("we load them via Google Fonts `@import`... swap to self-hosted in
production") — but the live site already made that swap: `src/styles/global.css` self-hosts via
`@fontsource` `@font-face` (§5). `project/` describes an earlier state; don't "correct" `src/` to
match it. Similarly, top-level `README.md` never states any Astro major version at all — verified:
`grep -n -i "astro 6" README.md` and `git log -p -- README.md | grep -i "astro 6"` are both empty.
Commit subjects (`be0a6e3`, `77efdff`, `c511b8d`) reference "Astro 6" as recent history, the 6→7
major bump landed silently in `be4d2c9` ("chore(deps): update all packages to latest"), and no
commit or doc ever announced "now on Astro 7". The drift is **silence**, not a stale README
statement — resolved version is Astro 7.x per `package-lock.json` (exact pin owned by
`styleguide-build-and-env`). Rule: if layers conflict, `src/` (what's deployed) wins for behavior;
`project/` is provenance only.

## 2. components.css is the single canonical PORTABLE layer

- All component styling lives ONCE in `src/styles/components.css` (369 lines, `lp-*` classes only —
  verify: `wc -l src/styles/components.css`).
- `src/components/brand/*.astro` (Button, PostCard, ServiceCard, Timeline, BlogNav, FloatingField,
  Callout — 7 components) are **thin wrappers**: they render canonical `lp-*` markup and hold no
  component-specific CSS of their own.
- Both the `src/pages/components/*.astro` specimen pages and the `src/pages/ui-kits/*.astro`
  compositions consume the same wrapper components — one rendering path, so a specimen and a
  UI-kit usage cannot visually drift from each other.
- **Why "portable":** `components.css` is designed to be copied, with a page's `CodeSnippet`
  markup, into an unrelated project to reuse a component elsewhere. That's why it must stay
  self-contained — only `var(--lp-*)` references, no dependency on `sg-*` chrome classes.
- Corollary invariant: change a component's markup → also update the matching `CodeSnippet`
  (`src/components/CodeSnippet.astro`, 19 lines) on that page, or the copyable snippet goes stale.
  That's a behavior change and gates through `styleguide-change-control`.

## 3. DocsLayout + nav.ts: one chrome, one source of truth

- `src/layouts/DocsLayout.astro` (200 lines) is the shared chrome for every page: topbar (logo +
  dark-mode toggle), `<Sidebar />`, page head (`title`/`description` props), and the `.preview`
  content frame. It imports `../styles/global.css` and `../styles/components.css` as ordinary
  (non-scoped) module imports — deliberate, since those two files ARE the shared tokens/utility/
  component layer, not one page's styling. The non-negotiable "scoped `<style>`, never `is:global`"
  (see `styleguide-change-control`) applies to **page-level** `<style>` blocks, not these two
  intentionally-global stylesheets.
- `src/data/nav.ts` (74 lines) exports two arrays: `nav: NavGroup[]` (Foundations / Components / UI
  Kits groups, consumed by `src/components/Sidebar.astro`) and `landing: LandingSection[]`
  (consumed by `src/pages/index.astro`'s card grid — verify: `grep -n "from '../data/nav'"
src/pages/index.astro`). **One file drives both surfaces**: add a page → add one entry to `nav`
  (and usually `landing`) → Sidebar and the landing grid both pick it up. No second registration
  point exists.
- `Sidebar.astro` (129 lines) computes the active link via `Astro.url.pathname`; an inline
  `<script is:inline>` toggles a mobile `.open` class — no client framework, no router.

## 4. CSP / security-headers posture — and why `unsafe-inline` is required

Verified CSP line from `public/_headers` (2026-07-05; full header anatomy including the other
security headers and cache-control rules is owned by `styleguide-build-and-env`):

```
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none';
frame-ancestors 'none'; form-action 'self'; img-src 'self' data:; font-src 'self';
style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self';
upgrade-insecure-requests
```

**Why `'unsafe-inline'` is on `script-src` and `style-src`, currently:**

- Astro's scoped `<style>` blocks (used throughout `src/pages/**` and `src/components/**`) compile
  to inline `<style>` tags with scoped attribute selectors — without `style-src 'unsafe-inline'`
  those are blocked.
- `DocsLayout.astro` ships two `<script is:inline>` blocks (theme-preload-before-paint; dark-mode
  toggle + click-to-copy delegated handler) and `Sidebar.astro` ships one (mobile nav toggle) —
  without `script-src 'unsafe-inline'` those are blocked.
- **Real weak point, not a shrug.** Nonces/hashes would remove the need for `'unsafe-inline'` but
  aren't implemented. Tightening this is `candidate` work — a security-posture change, so it gates
  through `styleguide-change-control`; tooling angle belongs in `styleguide-raising-the-bar`.
- Upside: any external script/font/style/image CDN reference is _silently blocked in production_
  (browser-level, not a build error) since `default-src 'self'` allowlists no external host. That's
  why "just add a CDN" is a production-breaking anti-pattern — see `styleguide-change-control`.

## 5. Self-hosted fonts (decision, not accident)

`src/styles/global.css` declares 9 `@font-face` rules (Poppins 300/400/500/600/700, Roboto Mono
300/400/500/700, `latin` subset only) with `src: url('../../node_modules/@fontsource/...woff2')`,
backed by the `@fontsource/poppins` and `@fontsource/roboto-mono` npm packages. Astro's build
resolves and copies these into `dist/_astro/*.woff2`. Required by the CSP (`font-src 'self'` — no
external font host allowlisted) and matches brand doctrine (`laplante-brand-reference`). Do not
swap to a Google Fonts `@import`/CDN link — it would violate both the CSP and the self-hosting
decision; `project/README.md`'s older description of Google Fonts `@import` is stale (§1), not a
spec to restore.

**Known weak point:** the `url()` paths are `node_modules`-relative, not package-export imports.
This works only because Astro's Vite pipeline resolves relative CSS `url()`s at build time against
the file's location on disk — coupled to `@fontsource`'s internal file layout, and would break
silently if that package restructures its `files/` directory in a future major version. Re-verify:
`grep -n "node_modules/@fontsource" src/styles/global.css`.

## 6. Static-only: no CF adapter, no SSR

`astro.config.mjs` is minimal (7 lines): `site` + `@astrojs/sitemap` integration only — no
`@astrojs/cloudflare` adapter, no `output: 'server'`, no `wrangler.toml`/`wrangler.jsonc` in the
repo. This is a static specimen/documentation site: no database, no auth, no forms that submit, no
runtime server. Cloudflare Pages deploys it via git-integration static build (`npm run build` →
`dist`), not Workers/wrangler. Do not add server-rendered routes, API routes, or the Cloudflare
adapter without going through `styleguide-change-control` first — that's a category change. Sibling
skills `astro6-cloudflare-locals-runtime-env-removed`, `astro-csrf-origin-header-403-on-post`, and
`astro6-cloudflare-require-dist-vite-duplication` document gotchas that only apply once an SSR
adapter exists — not relevant here; consult them only "if you ever add SSR/the adapter."

## 7. Known weak points (stated plainly, not hidden)

| Weak point                                 | Where                                                                                                                                                                                                                                                                                      | Status                                                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| No test suite (no vitest/playwright/jest)  | whole repo                                                                                                                                                                                                                                                                                 | `npm run build` succeeding + `npm run format:check` is the only automated gate; candidate work tracked in `styleguide-validation-and-qa` |
| README drift                               | top-level `README.md` never states an Astro major version at all (drift is silence — commit subjects `c511b8d`, `be0a6e3`, `77efdff` say "Astro 6" as history but no doc/commit ever announced the 6→7 crossing); `project/README.md` (says Google Fonts `@import`; actual is self-hosted) | See §1; maintaining docs is owned by `styleguide-docs-and-writing`                                                                       |
| `unsafe-inline` in CSP                     | `public/_headers`                                                                                                                                                                                                                                                                          | Required by current architecture (§4); tightening is `candidate`, gates through `styleguide-change-control`                              |
| `node_modules`-relative `@font-face url()` | `src/styles/global.css`                                                                                                                                                                                                                                                                    | Works today, coupled to `@fontsource` internal layout (§5)                                                                               |

## Provenance and maintenance

All facts above verified against the repo on **2026-07-05**. Re-verify if this skill feels stale:

```bash
# components.css size / class-count sanity check
wc -l src/styles/components.css

# confirm nav.ts still drives both Sidebar and the landing grid
grep -n "from '../data/nav'" src/pages/index.astro src/components/Sidebar.astro

# confirm the CSP text verbatim (don't trust this skill's quoted block if it changed)
grep -n "Content-Security-Policy" -A1 public/_headers

# confirm fonts are still self-hosted via @fontsource, not an @import
grep -n "@font-face\|@import" src/styles/global.css | head

# confirm no CF adapter / SSR output has been added
cat astro.config.mjs

# confirm the project/ layer's own doc drift hasn't been "fixed" by copying into src/
grep -n "Google Fonts" project/README.md
```

If any of these disagree with the text above, treat this skill as stale and correct it — but do
not silently change repo behavior to match a stale skill; that's what `styleguide-change-control`
is for.
