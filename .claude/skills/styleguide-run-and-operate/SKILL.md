---
name: styleguide-run-and-operate
description: Use when running the styleguide Astro site locally (dev/build/preview), when a build produces an unexpected page count/asset layout in dist/, when diagnosing a Cloudflare Pages deploy (production vs preview URL, build failing/succeeding but site stale, wrong output directory), when _headers/CSP/cache-control/robots.txt/sitemap behavior needs explaining, when asked "how do I run/build/deploy this" or "why didn't my change show up on brand.michaellaplante.com", or when someone proposes adding wrangler/the Cloudflare adapter/SSR to this static site.
---

# Styleguide: Run and Operate

Runbook for executing and deploying the styleguide Astro site. Covers command anatomy, the
`dist/` artifact layout, and the Cloudflare Pages deploy model. Does NOT cover environment setup,
config file contents, or dependency versions — see `styleguide-build-and-env` for those.

## When NOT to use this skill

| Situation                                                                                                              | Use instead                                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setting up the dev environment, reading `astro.config.mjs`/`tsconfig.json`/`.prettierrc`/`engines`, resolving versions | `styleguide-build-and-env`                                                                                                                                 |
| Deciding whether a change is safe to merge/deploy, the weekly deps-PR rule, non-negotiables rationale                  | `styleguide-change-control`                                                                                                                                |
| Measuring performance (Lighthouse, bundle size budgets, Core Web Vitals)                                               | `web-perf` / `cloudflare:web-perf` (general perf tools — this repo has no perf-scripts of its own; see `styleguide-diagnostics-and-tooling`)               |
| robots.txt policy re: AI crawlers/training bots                                                                        | `robots-txt-ai-bots-training-vs-retrieval`                                                                                                                 |
| Adding automated tests / defining the acceptance gate                                                                  | `styleguide-validation-and-qa`                                                                                                                             |
| You're about to add `@astrojs/cloudflare`, `wrangler.toml`, or SSR                                                     | Stop — this is a **static** build, not Workers/adapter-based. Read the caveat below first, and any change still gates through `styleguide-change-control`. |

## Command anatomy

All commands run from repo root (`skills/`). Scripts are declared in `package.json`:

| Command                | Runs                 | Result                                                     |
| ---------------------- | -------------------- | ---------------------------------------------------------- |
| `npm run dev`          | `astro dev`          | Dev server at `http://localhost:4321`                      |
| `npm run build`        | `astro build`        | Static output written to `dist/`                           |
| `npm run preview`      | `astro preview`      | Serves the already-built `dist/` locally                   |
| `npm run format`       | `prettier --write .` | Formats in place (astro-aware via `prettier-plugin-astro`) |
| `npm run format:check` | `prettier --check .` | CI-safe check, no writes                                   |

There is **no test suite** in this repo (no vitest/playwright/jest). The only automated gates are
`npm run build` succeeding and `npm run format:check`. Everything else is manual visual review —
see `styleguide-validation-and-qa` for what counts as evidence.

## Build output (verified 2026-07-05 by running `npm run build`)

- **24 pages built**, in ~400ms, total `dist/` size **~492K**.
- 24 pages = 23 directory-style routes (`dist/**/index.html`) + one flat `dist/404.html` (Astro
  emits the special 404 route as a top-level file, not `404/index.html` — don't expect a `404/` dir).

### `dist/` artifact layout

```
dist/
  index.html                  # landing page
  404.html                    # NOT a directory — flat file at root
  _headers                    # copied verbatim from public/_headers
  robots.txt                  # copied verbatim from public/robots.txt
  sitemap-index.xml           # generated by @astrojs/sitemap
  sitemap-0.xml               # generated by @astrojs/sitemap
  _astro/                     # bundled, content-hashed assets
    *.css                     # per-layout/page bundled CSS (e.g. DocsLayout ~23.5K, index ~6.4K, portfolio ~5.7K)
    *.woff2                   # 9 self-hosted font files (Poppins 300/400/500/600/700,
                               #   Roboto Mono 300/400/500/700 — latin subset only, no 600 for mono)
  assets/                     # copied verbatim from public/assets/ (logo PNGs)
  colors/  type/  spacing/  components/  ui-kits/  logo/  motion/
                               # one index.html per route, directory-style URLs
```

Every route is prerendered HTML at build time — there is no server, no API routes, no `.mjs`
server bundle. If you see a `server/` or `_worker.js` directory in `dist/`, something changed the
build mode (e.g. an SSR adapter was added) — that is a `styleguide-change-control`-gated change,
not something to patch around here.

## Cloudflare Pages deploy model

Deploy is **git-integration, static build** — NOT wrangler, NOT the `@astrojs/cloudflare` adapter.
There is no `wrangler.toml` and no adapter entry in `astro.config.mjs` in this repo. Confirm with:
`grep -c adapter astro.config.mjs` → should be `0`.

| Trigger                  | Result                                                |
| ------------------------ | ----------------------------------------------------- |
| Push to `main`           | Production deploy → https://brand.michaellaplante.com |
| Push to any other branch | Preview deploy, unique preview URL                    |

**CF Pages build configuration** (set in the Cloudflare dashboard, not in-repo — there is no
`wrangler.toml`/`wrangler.jsonc` here):

| Setting          | Value             |
| ---------------- | ----------------- |
| Framework preset | Astro             |
| Build command    | `npm run build`   |
| Output directory | `dist`            |
| Env var          | `NODE_VERSION=22` |

Because this is a static build, `dist/` is uploaded as-is and served from CF's edge — no CF
Worker runtime, so bindings/`wrangler dev`/`_worker.js`/Durable Objects/KV don't apply. Treat
`wrangler`, `cloudflare-workers-builds-astro-adapter`, `wrangler-pages-config-no-account-id`, and
the `cloudflare`/`durable-objects` skills as **general CF background only** — they assume a
Workers/adapter deploy this repo does not have. Same caution for
`astro6-cloudflare-require-dist-vite-duplication`, `astro6-cloudflare-locals-runtime-env-removed`,
and `astro-csrf-origin-header-403-on-post`: real Astro+CF gotchas, but for the SSR adapter path —
relevant only "if you ever add SSR/the adapter" (a `styleguide-change-control`-gated decision,
tracked as a candidate in `styleguide-astro-upgrade-campaign`).

## How `public/_headers` takes effect

`public/_headers` is Astro's static-passthrough convention: anything in `public/` is copied
verbatim to `dist/` at build time, and Cloudflare Pages natively recognizes a `_headers` file at
the site root to attach response headers per path-glob — no build step or plugin needed. Effective
rules (verified against `public/_headers`):

| Path glob        | Headers                                                                                                                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/*` (all paths) | `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; a locked-down `Permissions-Policy` (every listed feature `=()`, i.e. denied, except `fullscreen=(self)`); the CSP (see below) |
| `/_astro/*`      | `Cache-Control: public, max-age=31536000, immutable`                                                                                                                                                                 |
| `/assets/*`      | `Cache-Control: public, max-age=31536000, immutable`                                                                                                                                                                 |

The CSP string itself (`default-src 'self'`, `script-src 'self' 'unsafe-inline'`, etc.) and _why_
it's shaped that way (why `unsafe-inline` is required, why external CDNs silently break prod) is
owned by `styleguide-change-control` — don't restate the rationale here, just know that editing
`public/_headers` is a behavior change and must gate through that skill. The immutable long-cache
on `/_astro/*` is safe only because Astro content-hashes those filenames — a same-named-file
change is impossible, not just unlikely.

## robots.txt + sitemap behavior

`public/robots.txt` (copied verbatim to `dist/robots.txt`):

```
User-agent: *
Allow: /

Sitemap: https://brand.michaellaplante.com/sitemap-index.xml
```

Allows all crawlers, all paths — this is a public documentation site, not a private app. The
sitemap is generated by the `@astrojs/sitemap` integration declared in `astro.config.mjs`
(`site: 'https://brand.michaellaplante.com'` + `integrations: [sitemap()]`), which emits
`sitemap-index.xml` (pointer file) and `sitemap-0.xml` (the actual URL list) from the prerendered
route list at build time — there's no manual sitemap maintenance. If the policy question is about
AI-training vs. retrieval crawlers specifically (should we `Disallow` GPTBot/CCBot/etc.), that
decision and its tradeoffs are owned by `robots-txt-ai-bots-training-vs-retrieval` — read that
skill before changing this file, and any resulting change is still `styleguide-change-control`-gated.

## Provenance and maintenance

Facts below were verified 2026-07-05 by reading `package.json`, `README.md`, `public/_headers`,
`public/robots.txt`, `astro.config.mjs`, and running `npm run build` against this repo. Re-verify
with:

| Fact                                                       | Re-verify with                                                                                                                                                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dev port (4321)                                            | `npm run dev` and read the printed local URL — Astro's default port can change across major versions                                                                                                    |
| Page count (24) / build time (~400ms) / dist size (~492K)  | `npm run build` (prints page count + duration); `du -sh dist`                                                                                                                                           |
| index.html count per route type                            | `find dist -name "index.html" \| wc -l` (expect 23) plus `dist/404.html` flat = 24                                                                                                                      |
| woff2 font file count (9)                                  | `find dist -name "*.woff2" \| wc -l`                                                                                                                                                                    |
| No adapter present                                         | `grep -c adapter astro.config.mjs` (expect `0`)                                                                                                                                                         |
| `_headers` rules unchanged                                 | `cat public/_headers` and diff against the table above                                                                                                                                                  |
| `robots.txt` unchanged                                     | `cat public/robots.txt`                                                                                                                                                                                 |
| CF Pages build config (preset/command/output/NODE_VERSION) | Cloudflare dashboard → this Pages project → Settings → Builds (not stored in-repo; README.md "Deployment" section is the fallback source, currently matches dashboard as of this writing but can drift) |
