---
name: styleguide-diagnostics-and-tooling
description: Use when someone asks to "check", "audit", "lint", "scan", or "measure" this styleguide repo for rule violations instead of eyeballing a diff — raw hex/rgb() colors that should be var(--lp-*) tokens, is:global in src/pages, a second/new linear-gradient or radial-gradient beyond the one blog-nav gradient, backdrop-filter or blur(), a sidebar/landing link in src/data/nav.ts with no matching src/pages file (or vice versa, an orphan page unreachable from the sidebar), or a dist/ build that has grown unexpectedly large. Use before approving a PR, after a big refactor, or when asked "did this change break a non-negotiable" or "prove it, don't just tell me." Symptoms/keywords: hardcoded color, raw hex in styles, is:global, second gradient, gradient creep, backdrop-filter, blur, dead nav link, orphan page, unreachable page, dist size regression, enforcement script, lint script, diagnostic script.
---

# Styleguide Diagnostics and Tooling

Six small, runnable POSIX shell scripts in `scripts/` (this skill's directory) that each
mechanically check ONE non-negotiable from the discipline rules, instead of relying on a human
to eyeball a diff. Run any of them from the repo root. All verified against the repo on
2026-07-05 (branch `skills`) — see "Provenance and maintenance" for re-verify commands.

## When NOT to use this skill

| If you need... | Use instead |
|---|---|
| The non-negotiables list WITH rationale, or to classify/gate a change | `styleguide-change-control` |
| To decide these scripts are "good enough" evidence for a merge, or the golden 24-page inventory | `styleguide-validation-and-qa` |
| To wire any of these scripts into CI (there is currently no PR-triggered CI at all) | `styleguide-raising-the-bar` |
| The token/class catalog itself (every `--lp-*`/`--sg-*`, `lp-*`/`sg-*`) | `styleguide-design-tokens-reference` |
| Why a rule exists (3-layer lineage, CSP posture, components.css-as-portable-layer) | `styleguide-architecture-contract` |
| Live-failure triage (build red, CSP console error, font not loading) | `styleguide-debugging-playbook` |

These scripts are diagnostic/enforcement tools, not policy. **None of them may be used to
bypass `styleguide-change-control`** — a script exiting non-zero (or zero) is evidence to bring
to that gate, not a substitute for it. Promoting any script into an actual CI job is itself a
change-control-gated decision.

## Running all six

```bash
cd /path/to/styleguide-repo   # repo root — where package.json lives
for s in .claude/skills/styleguide-diagnostics-and-tooling/scripts/*.sh; do
  echo "=== $s ==="; sh "$s"; echo "exit=$?"; echo
done
```

Every script: exit `0` = clean, exit `1` = violations found (see stdout), exit `2` = usage/setup
error (wrong cwd, missing directory/file). None of them mutate the repo except
`check-build-size.sh`, which runs `npm run build` and so regenerates the gitignored `dist/`.

## The six scripts

| Script | Checks | Result on this repo as of 2026-07-05 |
|---|---|---|
| `check-hardcoded-colors.sh` | Raw `#hex` / `rgb()`/`rgba()` used as a CSS value (inside `<style>` or `style="..."`) in `src/pages/` and `src/components/`. Skips hex sitting in plain JS/TS data (e.g. the swatch-catalog arrays in `src/pages/colors/*.astro`) so it doesn't flag pages whose whole job is documenting hex values as content. | **Exit 1.** Real hits in `src/pages/index.astro` (6 inline `style="background:#..."` swatches), `src/pages/type/hero.astro`, `src/pages/type/eyebrow.astro`, and heavily in `src/pages/ui-kits/blog.astro` / `ui-kits/portfolio.astro` (ported composition-level demo CSS). |
| `check-isglobal.sh` | `is:global` anywhere in `src/pages/**/*.astro`. | **Exit 1.** Two real hits: `src/pages/ui-kits/portfolio.astro:257` and `src/pages/ui-kits/blog.astro:128`. Both are commented as intentional — `body.p-dark`/`body.b-dark` selectors need global scope because Astro's scoped-style hashing would otherwise prevent a body-class combinator from matching. Still a rule exception, not a free pass — take it to `styleguide-change-control`. |
| `check-single-gradient.sh` | Every `linear-gradient()`/`radial-gradient()` under `src/`, minus the one canonical declaration (`src/styles/components.css` `.lp-blog-nav`, `135deg, var(--lp-blog-blue-500) 0%, var(--lp-blog-blue-600) 100%`). | **Exit 1.** Three leftover hits: `index.astro:267` and `ui-kits/blog.astro:223` reuse `--lp-blog-blue-*` tokens for the same component in another context (lower risk); `ui-kits/portfolio.astro:537` builds a *new* gradient from raw neutral hex (`#1a1a1a → #2d2d2d`) — a real "one gradient only" violation candidate. |
| `check-no-blur.sh` | `backdrop-filter` or `blur(` anywhere under `src/`. | **Exit 0.** Clean. |
| `check-nav-links.sh` | Both directions between `src/data/nav.ts`'s `nav` array and `src/pages/`: every `href` resolves to a `.astro` file, and every page (except `index.astro`/`404.astro`, which aren't sidebar entries by design) has a matching `href`. | **Exit 0.** Clean — 22 nav hrefs, 22 non-index/404 pages, 1:1. |
| `check-build-size.sh` | Runs `npm run build`, then asserts `dist/` (via `du -sk`) is at or under a 1024K threshold. | **Exit 0.** Build succeeds ("24 page(s) built"), `dist/` measured 492K — well under threshold. |

## Reading the output

Each script prints `file:line: <matched text>` for every hit, then an interpretation hint, then
exits. A non-zero exit is not automatically "go fix it now" — for `check-isglobal.sh` and
`check-single-gradient.sh` specifically, the repo currently has known, arguably-intentional hits
in the `ui-kits/` composition pages; the script's job is to surface them honestly so a human (via
`styleguide-change-control`) decides whether they're an accepted exception or a regression to
fix, not to silently allowlist them into false-cleanliness.

## Provenance and maintenance

All counts/sizes/paths above verified 2026-07-05 by running each script against this repo's
`skills` branch with a clean working tree. Re-verify:

- Script correctness after any repo change: rerun the loop under "Running all six" above.
- Golden page/nav count still 22 nav hrefs / 24 built pages: `npm run build` (expect "24 page(s)
  built") and `grep -oE "href: '[^']+'" src/data/nav.ts | wc -l` (expect 22).
- Build-size baseline (492K) still sane, before assuming the 1024K threshold is right:
  `rm -rf dist && npm run build && du -sk dist`.
- The single canonical gradient string hasn't moved: `grep -n 'linear-gradient' src/styles/components.css`.
- The two known `is:global` exceptions haven't multiplied: `grep -rn 'is:global' src/pages`.
- Scripts are POSIX `sh`, no bashisms verified deliberately — if you add a new script here, run
  it with `sh`, not just under an interactive bash shell, before trusting it.
