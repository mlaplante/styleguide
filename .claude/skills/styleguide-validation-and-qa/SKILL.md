---
name: styleguide-validation-and-qa
description: Use when deciding whether a styleguide change is ready/done, what counts as evidence before merging, or how to QA a page/component/token edit in this Astro static site. Symptoms/keywords: acceptance criteria, is this tested, no test suite, no vitest/playwright/jest, manual QA, visual review checklist, golden page inventory, 24 pages, pre-merge checklist, how do I add tests, regression testing, visual regression, accessibility testing, link check, build-smoke test, "does this need a test", proving a change didn't break anything.
---

# Styleguide: Validation and QA

Defines what counts as **evidence** that a change is safe, for a repo that has **no automated
test suite**. Read this before claiming a change is "done," before merging, or before someone
proposes adding tests.

## When NOT to use this skill

| If you need... | Use instead |
|---|---|
| The actual diagnostic/lint scripts (raw-hex grep, `is:global` grep, external-URL grep) | `styleguide-diagnostics-and-tooling` |
| Command anatomy for `dev`/`build`/`preview`, `dist/` layout, CF Pages deploy | `styleguide-run-and-operate` |
| The merge/deploy gate, change taxonomy, non-negotiables-with-rationale, deps-PR rule | `styleguide-change-control` — **this skill never makes the merge call itself**, it only defines the evidence you bring to that gate |
| Triaging a live/deployed failure | `styleguide-debugging-playbook` |
| The broader automation roadmap beyond the first candidate test layer | `styleguide-raising-the-bar` |
| Keyboard/screen-reader a11y technique itself | `accessibility-keyboard-navigation` |

## The brutal truth: there is no test suite

Verified 2026-07-05: no `vitest`, `playwright`, or `jest` anywhere in `package.json`/
`package-lock.json`; no `*.test.*` or `*.spec.*` files in the repo. There is also **no
`scripts/` directory** at repo root as of this date — the diagnostic checks referenced below
are owned and defined by `styleguide-diagnostics-and-tooling`, not by a committed script file
here. Do not claim otherwise, and do not invent a script path.

## The current acceptance gate (4 items — all must be green)

| # | Check | Command | What "pass" means |
|---|---|---|---|
| 1 | Build succeeds | `npm run build` | Output includes **"24 page(s) built"** — the golden count (§ below). Fewer/more pages means a route broke or a stray file leaked in. |
| 2 | Format check | `npm run format:check` | Prettier (`prettier-plugin-astro`) exits clean, no `[warn]` lines. |
| 3 | Manual visual review | `npm run dev` (http://localhost:4321) or `npm run build && npm run preview` | Human eyes on every page your change could touch — see the golden-inventory checklist below. Command anatomy owned by `styleguide-run-and-operate`. |
| 4 | Diagnostics clean | (owned by `styleguide-diagnostics-and-tooling`) | That sibling skill's checks report no violations. Don't re-derive or copy its specific greps here — cross-reference it. |

**Known current state (verified 2026-07-05, branch `skills`, clean working tree):** running
`npm run format:check` on this checkout reports style issues — currently red (re-run
`npm run format:check` for the exact file count; it drifts across the multi-agent authoring
session and has already moved since the last check). Gate item 2 is **currently red**
on this branch. Do not assume "it built" means "it's clean" — check both independently, and
re-run this before trusting the number (formatting state changes as commits land).

**Known current state for item 4 (verified 2026-07-05):** on this repo's own clean committed
tree, 3 of `styleguide-diagnostics-and-tooling`'s 6 scripts — `check-hardcoded-colors.sh`,
`check-isglobal.sh`, `check-single-gradient.sh` — already exit 1 today, due to known/intentional
`ui-kits/` exceptions (hi-fi reproduction pages with one-off dark-mode values and an
`is:global` body-class toggle) and `index.astro`'s color-preview swatches. This is documented
in `styleguide-diagnostics-and-tooling` itself. "Clean" for this gate item means **no NEW hits
beyond that documented baseline**, not a literal zero exit code across all six scripts — do not
treat a regression check as passing just because these three are red, and do not habitually
ignore diagnostics failures as "always red anyway" without confirming the hits are still
confined to the documented ui-kits/index baseline.

Passing all four is evidence, not a decision. **The merge/sign-off call itself is
`styleguide-change-control`'s** — bring it green evidence, don't self-approve here.

## The golden inventory — manual-review checklist (24 pages)

Source of truth for the list: `src/data/nav.ts` (sidebar + landing grid) cross-checked against
`npm run build` output. When your change touches shared chrome (`DocsLayout.astro`,
`Sidebar.astro`, `global.css`, `components.css`), review **all 24**; when it touches one page or
one `lp-*` component, review that page plus any `ui-kits/` page that reuses the same component.

| Group | Routes to check | Watch for |
|---|---|---|
| Root | `/`, `/404` | Landing card grid matches `nav.ts` `landing[]`; 404 renders instead of erroring |
| Foundations — misc | `/logo`, `/motion` | Logo renders on both light/dark tiles; duration/easing specimens unchanged |
| Foundations — colors | `/colors/primary`, `/colors/accent-palette`, `/colors/neutrals` | Click-to-copy still copies the right `--lp-*` token string |
| Foundations — type | `/type/hero`, `/type/headings`, `/type/body`, `/type/eyebrow` | Poppins/Roboto Mono render (no fallback-font flash — self-hosted, no external font requests) |
| Foundations — spacing | `/spacing/scale`, `/spacing/radii`, `/spacing/shadows` | Values match the token, not a hardcoded px |
| Components | `/components/buttons`, `/input`, `/blog-nav`, `/post-card`, `/service`, `/timeline`, `/badges`, `/callouts` | `CodeSnippet` markup matches the live rendered markup (they drift independently — see `styleguide-architecture-contract`) |
| UI Kits | `/ui-kits/blog`, `/ui-kits/portfolio` | Same `lp-*` classes as the component pages — a UI-kit-only visual difference means `components.css` and the kit disagree |
| Cross-cutting | any page | Dark-mode toggle still shows only ☀️/🌙; no new gradient/card/blur appeared; open browser devtools console and confirm no CSP violation (why CSP matters: `styleguide-change-control`) |

## Pre-merge acceptance checklist (copy-paste into a PR description)

```
[ ] npm run build reports "24 page(s) built"
[ ] npm run format:check is clean (no [warn] lines)
[ ] npm run dev (or build+preview) — manually reviewed every page this change could touch
    (golden inventory table above)
[ ] styleguide-diagnostics-and-tooling checks reported clean
[ ] Browser console checked for CSP violations if any external URL/asset was touched
[ ] If this touches a non-negotiable (gradient/blur/card/emoji/palette/voice/CSP) — flagged
    for explicit sign-off, not just a green build (see styleguide-change-control)
[ ] Merge/deploy decision made via styleguide-change-control, not assumed from the above
```

## How to add tests — CANDIDATE (not implemented; routes through change-control)

None of the below exists today. Treat every line as a proposal, not a plan already underway.
Adding any of these is a **behavior change to CI/tooling** and must be classified and gated
through `styleguide-change-control` before it lands — this skill only sketches the shape a
first layer could take.

| Candidate layer | What it would catch | Rough shape |
|---|---|---|
| 1. Build-smoke assertion | Silent route loss/duplication | Wrap `npm run build`, assert the page count in its output equals 24 (or the then-current golden count) instead of eyeballing the log |
| 2. Link-check | Broken internal `href`s (e.g. `nav.ts` pointing at a route that no longer exists) | Crawl `dist/` after build, verify every internal link resolves to a real emitted file |
| 3. Visual regression | Unintended pixel/layout drift on a specimen page | Screenshot-diff the 24 golden pages pre/post change; needs a baseline-image strategy decision (open) |
| 4. Accessibility scan | Contrast, focus order, ARIA gaps | See `accessibility-keyboard-navigation` for technique; would run per golden page |

Full "how far should this system's automation go" roadmap (token pipeline, enforcement
tooling, the evidence-bar philosophy) is owned by `styleguide-raising-the-bar` — this section
is only the near-term first layer, not the destination.

## Provenance and maintenance

Facts below verified 2026-07-05 against branch `skills`, clean working tree.

- Re-verify no test framework exists: `grep -iE "vitest|playwright|jest" package.json package-lock.json`
- Re-verify no test files exist: `find . -maxdepth 4 \( -iname "*.test.*" -o -iname "*.spec.*" \) -not -path "*/node_modules/*"`
- Re-verify no `scripts/` dir yet: `ls scripts 2>&1` (expect "No such file or directory" — if it now exists, update this skill and `styleguide-diagnostics-and-tooling`)
- Re-verify golden page count: `npm run build` (expect "24 page(s) built")
- Re-verify the golden route list still matches `nav.ts`: `cat src/data/nav.ts` (12 Foundations + 8 Components + 2 UI Kits + index + 404 = 24)
- Re-verify format:check current state (may have changed since 2026-07-05): `npm run format:check`
- Re-verify dev port: `npm run dev` and read the printed URL (currently `4321`, per `styleguide-run-and-operate`)
