---
name: styleguide-raising-the-bar
description: Use when asked to advance, mature, level-up, or push the styleguide repo "beyond state of the art," to propose a roadmap/frontier/vision for the design system, to decide what to build next, to justify a design/token decision with evidence instead of a gut call, to compute or check a WCAG contrast ratio, to set up visual regression or accessibility (a11y) test automation, to build a design-token pipeline / Style Dictionary style multi-target token build, or to add CI enforcement for the repo's non-negotiables (hardcoded colors, is:global, backdrop-filter/blur, second gradient). Symptoms/keywords: "next-level", "world-class", "prove it", "measure not eyeball", contrast ratio, axe, accessibility automation, visual regression, snapshot testing, style-dictionary, token pipeline, design-token build, CI gate, enforcement script, roadmap, frontier, what should we improve.
---

# Styleguide: Raising the Bar

This is a **candidate/open** skill: an honest "what would actually advance this system"
brief, not a changelog of things already built. This is a brand documentation site with no
users, no runtime, no test suite (verified 2026-07-05: no vitest/playwright/jest in
`package.json`). "Beyond state of the art" here does NOT mean invented research — it means
making the discipline this repo already claims (§ non-negotiables) **mechanically
enforced** instead of merely documented, and making the system **genuinely reusable**
outside this repo. Nothing below is built. Every line item is labeled `candidate` and any
adopted change gates through `styleguide-change-control` — this skill has no authority to
merge anything itself.

## When NOT to use this skill

| If you need... | Use instead |
|---|---|
| The actual enforcement scripts and how to run them today | `styleguide-diagnostics-and-tooling` |
| The non-negotiables list with rationale + merge gate | `styleguide-change-control` |
| The token/class catalog (every `--lp-*`/`--sg-*` name) | `styleguide-design-tokens-reference` |
| Brand doctrine (palette, type scale, voice) | `laplante-brand-reference` |
| General a11y keyboard-nav patterns (not styleguide-specific) | `accessibility-keyboard-navigation` |
| General perf measurement technique (not styleguide-specific) | `web-perf` / `cloudflare:web-perf` |
| To actually merge one of these candidates | `styleguide-change-control` first, always |

## The maintainer's three frontier directions

Each is real, scoped to *this repo's* actual assets — not generic advice. As of 2026-07-05,
none has a line of code in the repo.

### 1. Enforcement tooling — rules described, not enforced

- **Why it falls short today:** the non-negotiables (no hardcoded colors, no `is:global`,
  no `backdrop-filter`, one gradient only) are prose in skills and `README.md`. This repo
  has exactly one GitHub Actions workflow, `.github/workflows/update-dependencies.yml`
  (triggers: `schedule` Mondays 09:00 UTC + `workflow_dispatch` only — **no
  `pull_request` trigger exists**). Nothing blocks a violating PR before merge; a human has
  to remember to check.
- **This repo's asset that makes it tractable:** the checks are already mechanical and
  already written — `styleguide-diagnostics-and-tooling/scripts/check-hardcoded-colors.sh`,
  `check-no-blur.sh`, `check-single-gradient.sh`, `check-isglobal.sh` share a consistent exit
  contract (`0` clean / `1` violation / `2` usage error). Wiring them into CI is integration
  work, not invention — but see the prerequisite below before doing so.
- **Prerequisite — not CI-ready as-is:** verified by running all four against the current
  committed tree, `check-hardcoded-colors.sh`, `check-single-gradient.sh`, and
  `check-isglobal.sh` all **exit 1 today** (see `styleguide-diagnostics-and-tooling` for the
  full baseline table), because of intentional, reviewed exceptions: the `src/pages/ui-kits/`
  pages (`blog.astro`, `portfolio.astro`) are deliberate hi-fi reproductions of the real site
  including its dark mode (raw one-off colors, a body-class `is:global` toggle, a dark-mode
  nav gradient), and `index.astro` uses raw hex in inline preview-swatch tiles that exist to
  *show* those colors. Wiring these scripts into CI unmodified would put a red X on every PR
  from day one, not just on real regressions. Before wiring into CI: agree and implement an
  allowlist (the `ui-kits/` pages plus the `index.astro` preview swatches) per
  `styleguide-diagnostics-and-tooling`'s C6 interpretation, routed through
  `styleguide-change-control` like any other non-negotiable-affecting change.
- **First 3 concrete steps in this repo:**
  1. Add a new workflow, e.g. `.github/workflows/ci.yml`, triggered on `pull_request`
     (there is none today), running `npm ci`, `npm run build`, `npm run format:check`.
  2. Once an allowlist is in place (the prerequisite above), in the same job run all four
     scripts in `styleguide-diagnostics-and-tooling/scripts/` and let their exit codes fail
     the job.
  3. Take the new workflow itself through `styleguide-change-control` as a config change
     before merging it (it changes what blocks a PR).
- **You have a result when:** a PR that reintroduces a raw hex color, `is:global`, a
  `backdrop-filter`, or a second gradient gets a red X on GitHub from CI, before any human
  opens the diff.

### 2. Visual + a11y automation — no test suite at all

- **Why it falls short today:** verified — no vitest, no Playwright, no jest anywhere in
  `package.json`/lockfile. The only gate is `npm run build` succeeding (emits "24 page(s)
  built") plus `npm run format:check`. Everything about how a page actually *renders* —
  layout, contrast, dark mode — is manual eyeball review.
- **This repo's asset:** a fully static `dist/` (~492K, no auth, no dynamic state to
  fight), a stable 24-page golden route set (§ the golden inventory — index, 404, logo,
  motion, `colors/*`, `type/*`, `spacing/*`, `components/*`, `ui-kits/*`), and a known,
  closed token palette (120 `--lp-*` tokens). Static + finite + known-palette is close to
  the ideal case for both screenshot diffing and automated contrast/a11y scanning.
- **First 3 concrete steps in this repo:**
  1. Add a browser-automation devDependency (e.g. Playwright) and one spec that iterates
     the 24 routes (source the list from `src/data/nav.ts`, the single source of truth for
     every registered page) and captures a full-page screenshot per route, per theme
     (light/dark, using the existing dark-mode toggle in `DocsLayout.astro`).
  2. Commit those as baseline snapshots; a second script/CI run diffs future screenshots
     against them.
  3. Add an automated a11y scan (e.g. axe-core) over the same 24 routes for contrast/
     landmark/alt-text violations, reporting rule ID + node, not just pass/fail.
  Cross-ref `accessibility-keyboard-navigation` for general a11y patterns and `web-perf` for
  measurement-harness habits — both assume a different host app; adapt, don't copy.
- **You have a result when:** there is a committed baseline screenshot for all 24 pages ×
  2 themes, and CI has failed at least once on a real, visible, non-flaky pixel diff or a
  real axe violation with a rule ID.

### 3. Token pipeline — one source, one target

- **Why it falls short today:** the 120 `--lp-*` tokens are well-centralized (real
  strength — see asset below) but CSS custom properties in `src/styles/global.css` are the
  *only* output. Reusing this palette anywhere else (a JSON design-token file, a future
  non-CSS target) today means hand-copying values out of a stylesheet.
- **This repo's asset:** the tokens are already centralized in exactly one place — the
  `:root` block in `src/styles/global.css` — with a consistent `--lp-<family>-<step>`
  naming convention (`--lp-indigo-*`, `--lp-ink-*`, `--lp-accent-*`, etc.). "One canonical
  source, consistent naming" is the precondition a Style-Dictionary-style build needs
  before it can fan out to multiple targets; this repo already has that precondition.
- **First 3 concrete steps in this repo:**
  1. Write a small parser (no new npm dependency yet) that regex-extracts every
     `--lp-*: value;` line from the `:root` block of `src/styles/global.css` into a flat
     `name → value` JSON — proves "one source, multiple emits" cheaply.
  2. Round-trip it: emit a second CSS block from that JSON and diff it against the current
     `:root` custom properties to prove no token was dropped or mistranscribed.
  3. Only once that trivial JSON emit is solid, evaluate whether adding the real
     `style-dictionary` npm package earns its keep — that's a new dependency, so it is a
     dependency-bump change per `styleguide-change-control`, not a drive-by add.
- **You have a result when:** one script produces `tokens.json` from `global.css` with all
  120 `--lp-*` names and literal values, and a CSS file re-emitted from that JSON is
  semantically identical to the current `:root` block.

## Methodology: the evidence bar — MEASURE, don't eyeball

Any change proposed under this skill (or reviewed against it) needs a **number**, not an
impression. "Looks fine" / "reads clearly enough" is not evidence.

### Worked "prove it" example: is indigo-on-white actually accessible?

Question: is `--lp-indigo-500` (`#3F51B5`, the primary brand/button color) an accessible
text color on white, and how does it compare to the neutral text tokens the site actually
uses for body copy? WCAG 2.x contrast ratio, computed (not eyeballed) via the standard
relative-luminance formula (`L = 0.2126R + 0.7152G + 0.0722B` in linearized sRGB;
`ratio = (L_lighter + 0.05) / (L_darker + 0.05)`), against white `#FFFFFF`:

| Token | Hex | Used for | Ratio vs white | AA normal text (≥4.5:1) | AAA normal text (≥7:1) |
|---|---|---|---|---|---|
| `--lp-indigo-500` | `#3F51B5` | primary/button accent | **6.87:1** | pass | fail (short by 0.13) |
| `--lp-fg-1` (`--lp-ink-900`) | `#111827` | strongest text | **17.74:1** | pass | pass |
| `--lp-fg-2` (`--lp-ink-500`) | `#374151` | article body | **10.31:1** | pass | pass |
| `--lp-fg-3` (`--lp-ink-300`) | `#6B7280` | meta text | **4.83:1** | pass | fail |
| `--lp-fg-mute` (`--lp-ink-200`) | `#808080` | form labels | **3.95:1** | **fail** | fail |

The last row is a genuine, computed finding, not hypothetical: `--lp-fg-mute` /
`--lp-ink-200` is used as the actual text color of `.lp-field label` in
`src/styles/components.css` (the FloatingField label, set in `--lp-t-meta` = `14px`,
weight 300 — ordinary small body text, not WCAG's "large text" exemption which needs
≥18.66px bold or ≥24px). At `14px`/weight 300 it needs the 4.5:1 normal-text threshold and
only reaches 3.95:1 — **an actual WCAG AA contrast failure**, found by computing a ratio,
not by eyeballing a floating label. (`--lp-ink-200` is also used for the decorative arrow
glyph in `src/pages/index.astro`'s landing cards — that use is lower-stakes since it's
iconographic, not the finding above.)

This is `candidate`-labeled evidence, not a fix: changing `--lp-ink-200` or `.lp-field
label`'s color is a token/component edit and gates through `styleguide-change-control`
exactly like any other. The point of the example is the method — compute the ratio,
compare against the WCAG threshold for that text's actual size/weight, cite the specific
selector — and reuse that method (not this specific verdict) for every future "is this
legible/accessible enough" question instead of eyeballing it.

## Provenance and maintenance

All facts verified against the repo on 2026-07-05.

- Re-verify no `pull_request`-triggered CI exists yet: `cat .github/workflows/*.yml | grep -A3 '^on:'`
  and `ls .github/workflows/` (expect only `update-dependencies.yml` until direction 1 lands).
- Re-verify the four enforcement scripts still exist and their exit-code contract:
  `ls .claude/skills/styleguide-diagnostics-and-tooling/scripts/` and read each script's header comment.
- Re-verify no test-automation deps exist yet: `grep -iE 'playwright|vitest|jest|axe' package.json`
  (expect no match until direction 2 lands).
- Re-verify token count and location: `grep -c '^\s*--lp-' src/styles/global.css` (expect ~120,
  inside the `:root` block) and confirm no `style-dictionary` dependency yet:
  `grep -i style-dictionary package.json` (expect no match until direction 3 lands).
- Re-verify the contrast numbers above (values are hex-exact, math is deterministic):
  recompute with any WCAG contrast calculator using `#3F51B5`, `#111827`, `#374151`,
  `#6B7280`, `#808080` against `#FFFFFF`; confirm `--lp-ink-200`'s current use sites with
  `grep -rn "lp-ink-200\|lp-fg-mute" src/`.
- Re-verify golden page count for the visual-regression baseline size: `npm run build`
  (expect "24 page(s) built").
