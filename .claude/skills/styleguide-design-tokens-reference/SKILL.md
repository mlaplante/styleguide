---
name: styleguide-design-tokens-reference
description: Use when looking up a specific --lp-* or --sg-* CSS custom property, an sg-* scaffolding class, or an lp-* component/typography class in the La Plante styleguide repo (src/styles/global.css, src/styles/components.css) — resolving a token to its hex/px/ms value, finding which class renders a button/pill/status/callout/pullquote/post-card/service/timeline/blog-nav/field, checking a component's modifier or state-hook suffix (--ghost, --sm, --info, .is-sticky, .is-lifted, .active, .current, .focus, .filled), confirming a token exists before using it, or adding a brand-new design token. Symptoms: "what does --lp-... resolve to", "which lp- class do I use for X", "is there a token for this color/spacing/radius/shadow/duration", "list all design tokens", "sg- vs lp- class", "how do I add a new token", "@font-face url path", "token count / class count".
---

# Styleguide design-tokens-reference

Retrieval-optimized catalog of every design token and CSS class in the styleguide. This skill
is the CATALOG (names + resolved values), not the rationale. Read the source files yourself for
anything not listed here — this is a curated subset, not a full dump.

**Source of truth**: `src/styles/global.css` (tokens, chrome theme, scaffolding) and
`src/styles/components.css` (component classes). Everything below is verified against those two
files as of 2026-07-05.

## When NOT to use this skill

| You need... | Use instead |
|---|---|
| WHY a value was chosen, brand voice/casing doctrine, the full type/spacing/shadow rationale | `laplante-brand-reference` |
| Whether a token/class CHANGE is safe to ship, how to classify it, deps-PR merge rule | `styleguide-change-control` — **all token/class edits gate through this skill** |
| Why `components.css` is "the portable layer", 3-layer lineage, CSP rationale | `styleguide-architecture-contract` |
| Resolved package versions, Node/engines, config files | `styleguide-build-and-env` |
| Running dev/build/preview, dist/ output, CF Pages deploy | `styleguide-run-and-operate` |
| A live bug (token renders as literal `var(--lp-...)`, style leak, missing sidebar entry) | `styleguide-debugging-playbook` |

---

## 1. `--lp-*` design tokens (120 total, `:root` in `global.css`)

Not all 120 rows are reproduced — one representative row per family with its **resolved value**.
Grep the file for the full family (commands in Provenance).

| Family | Representative token(s) | Resolved value | Notes |
|---|---|---|---|
| Indigo (primary) | `--lp-indigo-500` | `#3F51B5` | portfolio accent + buttons; `-600`/`-700` are hover/darker; `-100`/`-200` are rgba tints |
| Blog blue | `--lp-blog-blue-500` → `-600` | `#2980b9` → `#1a6da3` | the ONE sanctioned gradient (135°, sticky blog nav); `-700`/`-900` are dark-mode nav shades |
| Link (dark mode) | `--lp-link-dark` | `#60a5fa` | dark-mode link color, also used as blog progress-bar fill |
| Material accents | `--lp-accent-blue-grey/teal/pink/blue/green/purple` | `#607D8B` / `#009688` / `#FF4081` / `#2196F3` / `#4CAF50` / `#9C27B0` | opt-in theme-switcher accents, not defaults |
| Ink scale (neutrals) | `--lp-ink-900` … `--lp-ink-100` | `#111827` (900, strongest text) → `#9ca3af` (100) | 9 steps; also `--lp-line`/`--lp-line-2` (borders), `--lp-paper`/`-2`/`-3` (backgrounds), `--lp-white` |
| bg/fg semantic aliases | `--lp-fg-1`, `--lp-bg-2` | `var(--lp-ink-900)` → `#111827`; `var(--lp-paper-2)` → `#f8f9fa` | these are `var()` aliases onto the ink/paper scale, not new hex values — resolve one hop |
| Dark mode | `--lp-dark-bg`, `--lp-dark-surface`, `--lp-dark-text` | `#0f172a`, `#1e293b`, `#e0e0e0` | 8 tokens total: `-bg`, `-bg-2`, `-surface`, `-surface-2`, `-border`, `-text`, `-text-2`, `-muted` |
| Code/inline | `--lp-code-bg`, `--lp-code-accent` | `#0d1117` (dark code block bg), `#c7254e` (inline-code pink) | plus `-bg-light` (`#f0f1f3`) and `-accent-dark` (`#e879a0`) |
| Font families | `--lp-font-display`, `--lp-font-body`, `--lp-font-mono` | `'Poppins', system-ui, ...` (display/body identical); `'Roboto Mono', 'SF Mono', ...` | both display and body currently resolve to Poppins |
| Font weights | `--lp-w-light` … `--lp-w-bold` | `300 / 400 / 500 / 600 / 700` | 5 steps, named not numbered |
| Type scale | `--lp-t-hero` … `--lp-t-micro` | `68px` (hero) down to `12px` (micro) | 10 steps: hero/xl/lg/md/sm/base/ui/meta/caption/micro |
| Letter-spacing | `--lp-ls-tight` … `--lp-ls-widest` | `-0.5px` → `3px` | 6 steps: tight/snug/normal/wide/wider/widest |
| Line height | `--lp-lh-tight` … `--lp-lh-loose` | `1em` → `2em` | 5 steps: tight/snug/normal/body(1.8)/loose |
| Spacing scale | `--lp-space-1` … `--lp-space-30` | `4px` → `120px` | 13 steps (1,2,3,4,5,6,8,10,12,14,18,22,30 — non-contiguous numbering) |
| Radii | `--lp-radius-sm` … `--lp-radius-full` | `3px` → `50%` | sm/base(4px)/md(6px)/lg(8px)/xl(10px)/pill(100px)/full(50%) |
| Shadows | `--lp-shadow-hero`, `--lp-shadow-btn` | `0 0 40px 0 rgba(0,0,0,.45)`; `0 4px 15px rgba(63,81,181,.4)` | 9 shadow tokens, several component-specific (btn/btn-hover/card/menu/img/blog-nav/img-article(-dark)) |
| Motion | `--lp-dur-fast/`, `--lp-dur`, `--lp-dur-slow`; `--lp-ease`, `--lp-ease-out` | `0.2s / 0.3s / 0.6s`; `ease` / `ease-out` | |
| Container/layout | `--lp-container`, `--lp-container-blog`, `--lp-nav-h` | `1024px` (portfolio), `1080px` (blog), `64px` | |
| Border (semantic) | `--lp-border`, `--lp-border-subtle` | `var(--lp-line)` → `#E0E0E0`; `var(--lp-line-2)` → `#e5e7eb` | |

**@font-face detail**: all 9 `@font-face` rules in `global.css` (Poppins 300/400/500/600/700,
Roboto Mono 300/400/500/700) point `src: url(...)` at
`../../node_modules/@fontsource/poppins/files/...woff2` — a path relative to `src/styles/`,
reaching **into `node_modules`**, not a `src/assets` copy. Astro's bundler resolves and copies
these at build time (see `styleguide-build-and-env` / `styleguide-run-and-operate` for the
resulting `dist/_astro/*.woff2` output). Do not "fix" this path to point somewhere else without
checking the build still finds the files — it is intentional, not a bug.

**Unresolved-reference gotcha**: `components.css`'s `.lp-blog-nav-inner` uses
`max-width: var(--lp-blog-nav-w, none)`. `--lp-blog-nav-w` is **not declared anywhere** in
`global.css` — the rule relies entirely on its `none` fallback. If you ever see this var used
without the fallback resolving to `none`, that's expected: there is no token to find.

---

## 2. `--sg-*` docs-chrome tokens (10 total, light | dark)

These style the styleguide's OWN chrome (topbar, sidebar, page background) — never the brand
specimens inside preview panels, which stay in light brand rendering regardless of chrome theme.

| Token | Light (`:root`) | Dark (`:root[data-theme='dark']`) |
|---|---|---|
| `--sg-bg` | `var(--lp-bg-1)` → `#FFFFFF` | `var(--lp-dark-bg)` → `#0f172a` |
| `--sg-surface` | `var(--lp-white)` → `#FFFFFF` | `var(--lp-dark-surface)` → `#1e293b` |
| `--sg-surface-2` | `var(--lp-paper-2)` → `#f8f9fa` | `#14203a` (raw hex, not a token alias) |
| `--sg-border` | `var(--lp-border-subtle)` → `#e5e7eb` | `var(--lp-dark-border)` → `#334155` |
| `--sg-fg` | `var(--lp-ink-900)` → `#111827` | `var(--lp-dark-text)` → `#e0e0e0` |
| `--sg-fg-muted` | `var(--lp-ink-400)` → `#4b5563` | `var(--lp-dark-text-2)` → `#cbd5e1` |
| `--sg-fg-soft` | `var(--lp-ink-300)` → `#6b7280` | `var(--lp-dark-muted)` → `#94a3b8` |
| `--sg-nav-link` | `var(--lp-ink-500)` → `#374151` | `var(--lp-dark-text-2)` → `#cbd5e1` |
| `--sg-nav-hover-bg` | `var(--lp-indigo-100)` → `rgba(63,81,181,.1)` | `rgba(99, 102, 241, 0.18)` (raw, **not** brand indigo — Tailwind-family `#6366f1`) |
| `--sg-nav-hover-fg` | `var(--lp-indigo-700)` → `#303f8c` | `#a5b4fc` (raw, same Tailwind-indigo family) |

**Drift note**: the two dark `--sg-nav-hover-*` values are hardcoded RGB/hex that do NOT trace
back to any `--lp-indigo-*` token (`63,81,181`). They're a different indigo (`99,102,241` /
`#6366f1` family). This is a real inconsistency in the source, not a transcription error —
report it as-is if asked to audit token discipline; don't silently "fix" it by inventing a
token alias that doesn't exist.

Two more chrome-layout custom properties live in the same `:root` block but are **not** `--sg-*`
prefixed: `--sidebar-w: 260px` and `--topbar-h: 64px`.

---

## 3. `sg-*` scaffolding utility classes (22 total, `global.css`) — PREVIEW-ONLY

These lay out specimen pages (rows, swatch grids, code blocks). **They are not brand classes.**
Never copy them into production/portfolio/blog code — they exist only so styleguide pages can
present specimens consistently.

| Class | Purpose |
|---|---|
| `.sg-frame` (+ `--center`/`--stack`/`--row`/`--paper`/`--ink`) | preview container: padding + layout mode + optional paper/ink background |
| `.sg-row` | two-column spec row (130px label cell + specimen cell), bottom-ruled |
| `.sg-stack` | vertical centered stack (spacing/radii/shadow tile lists) |
| `.sg-meta` (+ nested `small`) | mono uppercase label/caption cell |
| `.sg-swatches` / `.sg-swatch` (+ `--outline`) / `.sg-swatch-name` / `.sg-swatch-role` / `.sg-swatch-hex` / `.sg-swatch-tokens` | color swatch grid + its internal label parts |
| `.sg-copy` (+ `.copied` state) | click-to-copy token chip; copy behavior comes from `DocsLayout`'s delegated click handler |
| `.sg-code` / `.sg-code-body` / `.sg-code-copy` | `CodeSnippet.astro`'s collapsible `<details>` code block + its copy button |
| `.sg-light-only` / `.sg-dark-only` | show/hide an element by chrome theme (e.g. light vs dark logo) |
| `.skip-link` | not `sg-`-prefixed but lives in this same scaffolding section — visually-hidden skip-to-content link |

---

## 4. `lp-t-*` typography classes (9, `global.css`) — element-level defaults

These are `lp-` classes but live in `global.css` (semantic typography), separate from the 41
`components.css` component classes in §5. List them here so a grep for `lp-t-` finds something:

| Class | Renders | Key tokens |
|---|---|---|
| `.lp-t-hero` | huge light-weight hero name/title | `--lp-t-hero` (68px), `--lp-w-light`, `--lp-lh-tight` |
| `.lp-t-h1` | blog post H1 | `--lp-t-lg` (36px), `--lp-w-bold`, `--lp-ink-800` |
| `.lp-t-h2` | article H2 | `--lp-t-md` (26px), `--lp-w-bold` |
| `.lp-t-h3` | article H3 | `--lp-t-sm` (21px), `--lp-w-semibold` |
| `.lp-t-eyebrow` | lowercase mono eyebrow w/ indigo underline wash | mono font, `--lp-ls-wider`, `::after` indigo wash |
| `.lp-t-label` | UPPERCASE service-title label | `--lp-font-display`, `--lp-ls-wider` |
| `.lp-t-meta` | mono meta/tagline text | `--lp-font-mono`, `--lp-fg-3` |
| `.lp-t-body` | article body paragraph | `--lp-t-base` (17px), `--lp-lh-body` (1.8) |
| `.lp-t-code` | inline code span | `--lp-font-mono`, `--lp-code-bg-light`/`--lp-code-accent` |

For the rationale behind these specific tiers (why hero is 68px, why eyebrows are lowercase),
see `laplante-brand-reference`.

---

## 5. `lp-*` component classes (41 total, `components.css`) — by component

`components.css` is the canonical, portable component layer (see `styleguide-architecture-contract`
for why). Grouped below with modifiers and state hooks (state hooks are plain classes toggled at
runtime/markup, not BEM modifiers — don't confuse the two).

| Component | Base class(es) | Modifiers (`--x`) | State hooks |
|---|---|---|---|
| Button | `.lp-btn` | `--ghost`, `--sm` | `.is-lifted` (forces hover look) |
| Category pill | `.lp-pill` | `--blog`, `--indigo`, `--teal`, `--purple` | — |
| Status badge | `.lp-status` | `--ok`, `--warn`, `--err`, `--info` | — |
| Callout | `.lp-callout` | `--info`, `--success`, `--warn`, `--error` | — |
| Pullquote | `.lp-pullquote` | — | — |
| Post card | `.lp-post-card`, `.lp-post-meta`, `.lp-post-title`, `.lp-post-excerpt`, `.lp-post-date`, `.lp-post-read`, `.lp-post-sep` | — | — |
| Service card | `.lp-service`, `.lp-service-glyph`, `.lp-service-title`, `.lp-service-copy` | — | — |
| Timeline | `.lp-timeline`, `.lp-tl-date`, `.lp-tl-body`, `.lp-tl-org`, `.lp-tl-role` | — | `li.current` (marks active entry, fills the dot) |
| Blog nav | `.lp-blog-nav`, `.lp-blog-nav-inner`, `.lp-blog-brand`, `.lp-blog-links`, `.lp-blog-progress` | — | `.is-sticky` (nav), `a.active` (current link, in `.lp-blog-links`) |
| Floating-label field | `.lp-field` | — | `.focus`, `.filled` (label float state; also native `:focus-within`) |

Total distinct `.lp-*` selectors in `components.css`: **41** (verified by grep, see Provenance).
This count does NOT include the 9 `.lp-t-*` classes in §4 (those live in `global.css`).

---

## 6. How to add a new token — checklist

Adding or changing a token is a **behavior/brand change** — it must be classified and gated
through `styleguide-change-control` before you merge. This checklist is the mechanical steps;
`styleguide-change-control` owns the gate/classification and the "tokens not hardcodes" rationale.

1. Add the new `--lp-*` (or `--sg-*`) declaration inside the appropriate `:root` block in
   `src/styles/global.css` — do not invent a new `:root` block or scatter tokens elsewhere.
2. If the token is themed (has a different value in dark chrome), add the matching override in
   `:root[data-theme='dark']` in the same file (this block currently only carries `--sg-*`
   overrides — confirm before assuming `--lp-*` tokens get dark overrides the same way).
3. **Dogfood it**: use the new token on at least one real specimen page/component before
   committing — an unused token is dead weight and a review red flag.
4. Re-verify: `npm run build` (must still emit 24 pages, no errors) and
   `npm run format:check` (prettier must be clean). See `styleguide-build-and-env` /
   `styleguide-run-and-operate` for exact command anatomy.
5. Route the change through `styleguide-change-control` for classification before merge —
   do not merge a new/changed token directly on the strength of a green build alone.

Never hardcode a raw hex/px value for anything themed — that is the one non-negotiable this
whole catalog exists to make unnecessary. See `styleguide-change-control` for the rule + incident
history.

---

## Provenance and maintenance

All facts in this skill were verified against `src/styles/global.css` and `src/styles/components.css`
as of **2026-07-05**. Re-verify if either file has changed since:

```bash
# --lp-* token count (expect 120)
grep -oE '\-\-lp-[a-zA-Z0-9_-]+' src/styles/global.css | sort -u | wc -l

# --sg-* token count (expect 10) + list
grep -oE '\-\-sg-[a-zA-Z0-9_-]+' src/styles/global.css | sort -u

# sg-* scaffolding class count (expect 22)
grep -oE '\.sg-[a-zA-Z0-9_-]+' src/styles/global.css | sort -u | wc -l

# lp-* component class count in components.css (expect 41)
grep -oE '\.lp-[a-zA-Z0-9_-]+' src/styles/components.css | sort -u | wc -l

# lp-t-* typography classes in global.css (expect 9)
grep -oE '\.lp-t-[a-zA-Z0-9_-]+' src/styles/global.css | sort -u

# confirm the node_modules-relative @font-face path is still intact
grep -n "node_modules/@fontsource" src/styles/global.css
```

If any count drifts, re-derive the affected table section from the file rather than patching a
single row — families are added/removed together more often than one at a time.
