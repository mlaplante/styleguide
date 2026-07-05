---
name: styleguide-build-and-env
description: Use when setting up a fresh clone of the styleguide repo, when `npm install` or `astro dev`/`astro build` fails with a Node version or engine error, when deciding which Node version to install or which nvm/.nvmrc to use, when auditing or changing astro.config.mjs, tsconfig.json, .prettierrc, package.json engines, or public/_headers, when asked "what config files does this project have" or "what are the resolved dependency versions", when prettier or format:check disagrees with committed formatting, when two copies of Vite show up in npm ls and builds break, or when onboarding someone new to this Astro static site. Symptoms include ERR_ENGINE_NODE, "Astro requires Node", peer-dependency warnings on install, prettier plugin errors, or unexplained build/dev-server failures right after a fresh clone or dependency bump.
---

# Styleguide build and env

Runbook for recreating the build environment for this Astro static site (`skills/` repo root)
and for the config catalog — the closest thing this project has to "feature flags." **There are
no runtime feature flags in this repo.** Config here means build/env/deploy config only:
`astro.config.mjs`, `tsconfig.json`, `.prettierrc`, `package.json` `engines` + `.nvmrc`, and
`public/_headers`.

## When NOT to use this skill

| If you need... | Use instead |
|---|---|
| `npm run dev`/`build`/`preview` command anatomy, CF Pages deploy steps, `dist/` artifact shape | `styleguide-run-and-operate` |
| Whether a change is allowed / how it's gated / the deps-PR merge rule | `styleguide-change-control` (this skill defers to it — see below) |
| Design-token names/values, `lp-*`/`sg-*` classes | `styleguide-design-tokens-reference` |
| Brand palette/type/voice doctrine | `laplante-brand-reference` |
| Why CSP/architecture decisions were made | `styleguide-architecture-contract` |
| A specific Astro-major/Vite upgrade decision | `styleguide-astro-upgrade-campaign` |

Any config change you make with this skill still has to pass through `styleguide-change-control`
before it ships — this skill tells you *how* to change a config axis, not whether you're allowed to.

## 1. Recreate the environment from scratch

```bash
git clone <repo-url> styleguide && cd styleguide/skills   # repo root is the `skills/` dir
cat .nvmrc                       # -> "22"
nvm install && nvm use           # or: nvm install 22 && nvm use 22
node --version                   # must satisfy >=22.12.0 (package.json "engines")
npm install                      # verified 2026-07-05: added 223 packages, 0 vulnerabilities
```

- `package.json` `"engines": { "node": ">=22.12.0" }` is the hard floor — declaring it does not
  enforce it at install time by default (no `engine-strict=true` in an `.npmrc` was found in this
  repo), but Astro 7 itself will refuse to run on a too-old Node (see Traps below).
- `.nvmrc` contains exactly `22` — `nvm use` resolves that to the latest installed Node 22.x, which
  satisfies the `>=22.12.0` floor as long as your installed 22.x is `>=22.12.0`.
- CI (`.github/workflows/update-dependencies.yml`) pins `node-version: 22` via `actions/setup-node@v4`.

## 2. npm scripts (package.json, verified)

| Script | Command | What it does |
|---|---|---|
| `dev` | `astro dev` | Local dev server, http://localhost:4321 |
| `build` | `astro build` | Static build to `dist/` |
| `preview` | `astro preview` | Serves the built `dist/` locally |
| `astro` | `astro` | Raw Astro CLI passthrough (e.g. `npm run astro -- check`) |
| `format` | `prettier --write .` | Reformat repo (astro-aware, see §4) |
| `format:check` | `prettier --check .` | CI-style check, no writes |

Full command anatomy, build output, and deploy flow are owned by `styleguide-run-and-operate` — don't
duplicate that here.

## 3. Resolved dependency versions (source of truth: `package-lock.json`, re-verified 2026-07-05)

| Package | package.json range | Resolved (lock) |
|---|---|---|
| astro | `^7.0.3` | **7.0.3** |
| @astrojs/sitemap | `^3.7.3` | 3.7.3 |
| @fontsource/poppins | `^5.2.7` | 5.2.7 |
| @fontsource/roboto-mono | `^5.2.9` | 5.2.9 |
| vite (transitive, via astro) | — | **8.0.16** |
| prettier (devDep) | `^3.9.4` | 3.9.4 |
| prettier-plugin-astro (devDep) | `^0.14.1` | 0.14.1 |

Re-verify any single version: `grep -A2 '"node_modules/<pkg>"' package-lock.json | grep version`
(e.g. `grep -A2 '"node_modules/astro"' package-lock.json | grep version`).

Note: some historical commit messages (e.g. "fix(ci): require Node >=22.12.0 for Astro 6") refer to
"Astro 6" — that's stale; the resolved version is Astro 7.0.3. (Checked 2026-07-05: the current
`README.md` text itself does not contain "Astro 6" — don't assume it does without re-grepping.)
Don't propagate the stale number.

## 4. Config catalog — each axis, its file, and how to change it safely

| Axis | File | Current content (verified) | Re-verify |
|---|---|---|---|
| Site URL + integrations | `astro.config.mjs` | 7 lines total: `site: 'https://brand.michaellaplante.com'`, `integrations: [sitemap()]` — nothing else (no adapter, no SSR) | `cat astro.config.mjs` |
| TypeScript strictness | `tsconfig.json` | `{ "extends": "astro/tsconfigs/strict" }` — no local overrides | `cat tsconfig.json` |
| Formatting | `.prettierrc` | `plugins: ["prettier-plugin-astro"]`, `singleQuote: true`, `printWidth: 100`, `.astro` files parsed with `"astro"` parser via `overrides` | `cat .prettierrc` |
| Node floor | `package.json` `engines` + `.nvmrc` | `>=22.12.0` / `22` | `grep -A2 '"engines"' package.json; cat .nvmrc` |
| Deploy headers (CSP, cache-control, security headers) | `public/_headers` | Cloudflare Pages headers file — CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, plus long-cache immutable rules for `/_astro/*` and `/assets/*` | `cat public/_headers` |

To change any axis:
1. Edit the file directly (it's a small, flat config — no env-var indirection, no `.env` driving
   these values).
2. Run `npm run build` locally to confirm nothing breaks (there is no test suite — build success +
   `format:check` are the only automated gates, owned in detail by `styleguide-validation-and-qa`).
3. Route the change through `styleguide-change-control` before merging — this is true even for
   "just a config file," because `_headers` changes are CSP-relevant (a broken CSP silently breaks
   production) and `astro.config.mjs`/engines changes affect every build.
4. If the change touches `public/_headers` specifically, the CSP *rationale* (why each directive
   exists) lives in `styleguide-architecture-contract` — read that before loosening anything.

`.gitignore` (verified) excludes `node_modules/`, `dist/`, `.astro/`, `.DS_Store`, `.env`, `.env.*`
(with `!.env.example` un-ignored) — there is no committed `.env` in this repo and no runtime env
vars are read by the site code itself; `NODE_VERSION=22` is a Cloudflare Pages *build-environment*
setting, not a repo file (see `styleguide-run-and-operate` for the CF Pages build config).

## 5. Known env traps

| Trap | Symptom | Fix |
|---|---|---|
| Node too old | `astro dev`/`astro build` errors or refuses to start; npm may warn on `engines` mismatch | `nvm use` (reads `.nvmrc`=22), confirm `node --version` is `>=22.12.0` |
| Two Vite copies from a transitive dependency | Build/dev crashes with a require/ESM interop error sourced from `node_modules/.vite` or a duplicated Vite in `npm ls vite` | Run `npm ls vite` — this repo's lock resolves a single Vite **8.0.16** as of 2026-07-05 (transitive via `astro`), so this project is not currently exposed. See `astro6-cloudflare-require-dist-vite-duplication` for the failure mode itself — **caveat: that skill's exact trigger (`@tailwindcss/vite` + CF SSR adapter pulling a second Vite) does not apply here.** This site has no Tailwind Vite plugin and no `@astrojs/cloudflare` adapter (static build, git-integration deploy) — treat that skill as background pattern-matching only, not a direct match, unless a future dependency reintroduces a second Vite copy. Re-check with `npm ls vite` after any dependency bump. |
| Stale `package.json`-only diff from the weekly deps PR | Green PR check that still hides a stale lockfile or peer-cap problem | See `dependabot-major-bump-package-json-only-clean-merge-hides-stale-lock-and-peer-cap` (cross-ref only — the merge/gate rule itself lives in `styleguide-change-control`) |
| `npm install` peer-dependency noise | Warnings on install that look scary but build still succeeds | Confirm with `npm install` output line — as of 2026-07-05 it reports 223 packages added, 0 vulnerabilities, no unresolved peer errors |

## Provenance and maintenance

All facts in this skill were verified against the repo on **2026-07-05**. Re-verify with:

- Node floor: `grep -A2 '"engines"' package.json && cat .nvmrc`
- Package count / vuln count: `npm install` (reads the final summary line)
- Astro/Vite/sitemap/fontsource/prettier resolved versions: `grep -A2 '"node_modules/astro"' package-lock.json | grep version` (swap the package path per row in §3)
- Vite duplication check: `npm ls vite`
- Scripts list: `grep -A8 '"scripts"' package.json`
- Config file contents: `cat astro.config.mjs tsconfig.json .prettierrc`
- `_headers` content/order: `cat public/_headers`
- CI Node pin: `grep node-version .github/workflows/update-dependencies.yml`
