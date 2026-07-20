---
name: laplante-brand-reference
description: Use when writing or reviewing copy, choosing colors/type/spacing/shadows/motion/states, or judging whether a new UI decision "feels on-brand" for La Plante Web Development (Michael LaPlante's security-executive + software-engineering consulting site and blog) — for questions like "what accent color do I use here", "is this gradient allowed", "how should this button hover", "what casing does this heading need", "does this copy sound right", "why is the hero Space Grotesk", "how many shadow levels are there", "can I add a card style", "can I use backdrop-filter/blur", "what emoji are allowed". Symptoms include: unsure whether to reach for ink or the amber signal, tempted to add a second gradient/blur/emoji, unsure why the hero uses Space Grotesk medium, unsure how elevation works, drafting marketing copy that needs the site's voice, or reviewing a PR for brand consistency. NOT for exact token names/values/how-to-add-a-token (see styleguide-design-tokens-reference) and NOT for generic UI/UX craft unrelated to this specific brand (see frontend-design, web-design-guidelines).
---

# La Plante brand doctrine

This is the **why**, not the **what**. For every exact `--lp-*` token name/value and every `lp-*`/`sg-*`
class, see sibling skill `styleguide-design-tokens-reference` — that is the catalog. This skill teaches
the design reasoning so a mid-level engineer (or a model) can make a _new_ on-brand decision, not just
copy an existing one.

Brand doctrine facts below are marked **SACRED** where straying is a real failure per the maintainer,
not a nitpick. Everything else is guidance for extending the system in spirit.

> **The identity is the "executive security brief."** Deep-navy authority + one warm amber "signal",
> set in a confident geometric display face. It reads like a briefing document, not a marketing splash —
> deliberately, because the audience is CTOs/VPs/security-conscious founders who read "flashy" as "not
> enterprise-ready." This refresh replaced the earlier Material-indigo system; the indigo/blog-blue
> tokens still exist only as retiring legacy.

## One authority, one signal

- **Ink `#0A1528`** (`--lp-ink`) — the deep-navy authority color. It fills the hero, the footer, active
  nav, and carries primary text on paper. `--lp-ink-2 #122240` is the elevated navy for dark-mode card
  surfaces. Ink is the "voice of record"; use it for anything that should read as structural and serious.
- **Signal `#E2A33C`** (`--lp-signal`) — a single warm amber accent. It is the _only_ accent in the
  system: CTAs, active timeline nodes, the focus ring, hover edges on cards, the leading rule on section
  eyebrows. `--lp-signal-deep #B57A1E` is the deeper amber for links, hover fills, section-header rules,
  and glyph icons (it earns its contrast on light paper). One accent, used with intent — if you're
  reaching for a second accent color, stop; the answer is almost always signal, ink, or slate.
- **Slate `#46566E`** (`--lp-slate`) carries body copy and meta — never true grey, so it stays warm
  against the cool paper.
- **Neutrals: cool paper, white surface, never true black.** `--lp-paper #F4F6F9` is the page ground;
  `--lp-surface #FFFFFF` is the card/panel; text bottoms out at navy ink, not `#000`. Don't introduce
  `#000`/`#808080`-style neutrals — they read cold and off-system.
- **One gradient, and only one (SACRED).** The whole system uses exactly one gradient: the blog's sticky
  "reading mode" nav bar (`.lp-blog-nav`, an ink→blue 135° sweep). Everything else — hero, buttons,
  cards, footer — is a **flat fill**. The live site's portfolio hero carries a faint blueprint-grid and a
  slow radar-sweep as brand texture; those are intentionally **not** reproduced in this styleguide, and
  you must not add a second gradient (grid, glow, or otherwise) to any specimen. A new gradient is a
  brand violation, not a style choice.
- **Legacy accents (retiring).** Material indigo (`#3F51B5`) and blog-blue (`#2980b9→#1a5276`) survive
  only as `--lp-indigo-*` / `--lp-blog-blue-*` tokens for the not-yet-restyled accent-switcher rail and
  the one blog-nav gradient. Never reach for them in new work — default to signal/ink.

## Typography: three families, one job each

- **Space Grotesk** (variable 300–700) is the **display** face — hero, headings, stat numerals, service
  and post-card titles. It carries _structure and confidence_; its tight geometry is why headings set
  with `letter-spacing: -0.02em` (`--lp-ls-display`) and read dense rather than airy.
- **Poppins** (300–700) carries **running body copy** — article paragraphs, lead-ins, form text. It is
  the reading voice, not the headline voice.
- **Roboto Mono** (300/400/500/700) adds **"engineering" texture** — section eyebrows, meta/timestamps,
  footer copyright, nav labels, inline code, numeric-proof captions. The split is strict: never set a
  heading in mono or Poppins, never set an eyebrow in anything but mono, never set an article paragraph
  in Space Grotesk.
- **Fonts are self-hosted via `@font-face`/`@fontsource` woff2 (latin subset), full stop.** Do not
  reference "Google Fonts `@import`"; the CSP (`font-src 'self'`) makes an external font request a silent
  production break. See `styleguide-change-control` for the CSP non-negotiable.
- **The hero is Space Grotesk, medium weight (500), tight tracking, line-height ~0.96** — a dense,
  confident briefing headline where the surname sits on its own line at bold (700). This _replaced_ the
  old "huge + light 300 Poppins, +2px tracking" hero; do not reintroduce a thin, wide-tracked hero — the
  current move is weight and tightness, not delicacy.
- **Blog article body is 17px / line-height 1.8** (Poppins), tuned for long-form reading — more generous
  than the 16px/1.5 UI base. Inherit the 1.8 rhythm for any new long-read surface.
- **No fourth typeface.** Three families, three roles. Adding another (even for "just one badge") breaks
  the contract.

## Casing rules (apply per role, not blanket)

| Role                   | Casing                             | Notes                                                                                                     |
| ---------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Section eyebrows       | UPPERCASE, mono, letter-spaced     | prefixed with a short 24px signal rule (`::before`) — the "briefing label" motif, not an underline        |
| Headings / card titles | Title/sentence case, Space Grotesk | never all-caps; the rebrand dropped the old UPPERCASE service title in favour of a calm editorial heading |
| Meta / captions / nav  | UPPERCASE, mono, letter-spaced     | timestamps, stat captions, nav links — structural texture                                                 |
| Button labels          | Sentence case, Space Grotesk       | e.g. "Discuss Your Needs" — the flat amber CTA reads as a confident label, not a shouted one              |

The signature eyebrow change: it is now an **UPPERCASE mono label with a short leading signal rule**
(a 24px hairline in `currentColor`), _not_ the old lowercase word with a 40%-opacity highlighter wash.
If you see the highlighter-underline eyebrow, it's stale.

## The voice (the part most often under-served)

**First-person, confident, operator-not-marketer.** Author bio and site copy are first-person singular
("I architect…"); blog engineering-practice copy may use plural "we." Audience is CTOs/VPs of
Engineering/security-conscious founders who know SOC 2, zero trust, DevSecOps, cloud primitives —
jargon is earned, not explained down.

**The formula: concrete outcome + named framework + a wry aside.** Verbatim calibration examples (don't
paraphrase away the pattern):

> "I architect and implement secure, scalable enterprise-grade technology solutions while cultivating
> high-performing teams that consistently exceed objectives and drive meaningful organizational change."

> "Navigate SOC 2, ISO 27001, HIPAA, and PCI-DSS with practical frameworks that satisfy auditors without
> slowing your teams down."

> "Scale engineering organizations, establish DevSecOps practices, and build the security culture that
> keeps your company out of the headlines."

Avoid generic "leverage synergies" language — every claim names a framework, a number, or a concrete
deliverable. If a sentence could appear on any consulting site verbatim, rewrite it.

**Numbers are proof, not decoration.** "$800M company secured", "15+ years in enterprise security",
"70+ speaking engagements", "500+ clients served" — rendered big in Space Grotesk bold with a monospaced
caption underneath. The stat-readout pattern always pairs a bold display numeral with a small mono label,
mirroring the hero's "big display + mono texture" split.

**Emoji: exactly ☀️ / 🌙 on the dark-mode toggle, nowhere else (SACRED).** Do not add emoji to copy,
headings, or UI to seem friendlier — it reads as off-brand immediately.

## Spacing rhythm

Sections pad `90px` top; the hero gets the most generous rhythm because it's the one full-bleed "briefing
cover." Content maxes at `1024px` (portfolio) or `1080px` (blog) — the blog is marginally wider because
reading measure tolerates it. Form-field gap is `20px`; timeline items sit tighter than section rhythm
because they're a single continuous list, not discrete blocks.

## Elevation: a resting lift, not a decorative stack

The rebrand simplified shadows into **one honest elevation that lifts on interaction**, plus a couple of
role shadows:

1. **Resting elevation** — `--lp-shadow-elevated` (`0 14px 36px rgba(10,21,40,.10)`): the ambient depth
   the one card layer (services, post cards) sits at. Tinted to ink, not neutral black, so it reads warm.
2. **Hover lift** — `--lp-shadow-elevated-hover`: the same shadow, deeper, paired with a 2px `translateY`
   and a signal top-edge revealing on the card. Reads as "this is interactive."
3. **Image rim** — a soft wide glow around a portrait. Reads as "presence," not depth.

The old indigo-tinted button glow is retired — **buttons are now flat** (no shadow). Don't reach for a
generic "elevation 1/2/3" ramp, and don't tint a shadow any color but ink.

## Motion doctrine

Transitions use `ease` (never `ease-in-out`); durations cluster at `0.2s` (fast — card/button hover,
link color), `0.3s` (default — field label rise), `0.6s` (slow — the blog reading-progress bar and the
radial menu reveal). `prefers-reduced-motion` is globally respected (durations collapse to `0.01ms`).
Motion is restrained and functional: it confirms state, it doesn't perform. The live site's richer moves
(scroll-fade entrances, the radar-sweep hero texture, the button ripple) are brand-origin doctrine from
resumesite, not things implemented in this repo's `components.css`.

## States: hover / focus / press

- **Button hover** — the amber deepens to `--lp-signal-deep`, text flips to paper, and it lifts
  `translateY(-1px)`. A confident _deepen_, not the old invert-to-transparent reveal. Ghost buttons fill
  ink on hover.
- **Card hover** (services, post cards) — a 2px lift, the resting shadow deepens, and a **signal top-edge**
  fades in. Calmer than the button because it's a passive "you can click this."
- **Focus** — a solid **signal** outline with offset, identical for the skip-link and every interactive
  element, in both light and dark chrome. One focus treatment system-wide — don't invent a second.
- **Press** — no explicit shrink; the button's `-1px` hover settles back to `0` on `:active`. Don't add a
  `:active { transform: scale(...) }`.

## Corner-radius logic (radius signals a role)

Small (~3–4px) for structural UI (menus, alerts) that should stay crisp; medium (~6px) for CTAs;
`8px` (`--lp-radius-lg`) for the content surfaces and the card layer (services, post cards, code, images)
— the workhorse radius of the refresh; full circle for anything literally circular (portrait, timeline
nodes); full pill for category tags, because a pill reads as a scannable label, not a container.

## Cards and blur — the two easiest ways to go off-brand

- **Two card patterns, and only two (SACRED).** The system has exactly one card _style_ — an elevated
  white `--lp-surface` panel with a resting shadow and a signal top-edge on hover — used in two places:
  the portfolio **service cards** and the blog **post cards**. (The earlier system had no portfolio card
  layer at all; the refresh promoted services into this shared card.) Do not invent a _third_ card style
  or a differently-styled card; if something "needs separation," reuse this card, whitespace, or a
  hairline rule — not a new card treatment.
- **No `backdrop-filter`/blur anywhere (SACRED).** Transparency here always carries semantic intent (a
  signal tint on a pill/callout, a body-copy fade) — never decorative glassmorphism. If a design calls
  for "frosted glass," it's off-brand; use a flat tint.

## When NOT to use this skill

- Need an exact token name, hex, or px value, or how to add a new `--lp-*`/`lp-*` entry →
  `styleguide-design-tokens-reference`.
- Need to know whether a change is allowed to ship, how it's classified, or the non-negotiables list with
  incident history → `styleguide-change-control`. **This skill never authorizes a change** — any
  brand-rule deviation, even one that seems reasoned here, must gate through change-control before it ships.
- Need load-bearing architecture (3-layer lineage, `components.css` as the portable layer, CSP rationale)
  → `styleguide-architecture-contract`.
- Need general UI/UX craft not specific to this brand → `frontend-design`, `web-design-guidelines`.

## Provenance and maintenance

Facts distilled from the live `mlaplante/resumesite` (`blog-src/public/css/style.css` +
`blog-src/src/styles/blog.css`, the shared `:root` "executive brief" system) and this repo's
`src/styles/global.css` / `components.css` after the 2026 brand refresh.

- **Superseded doctrine:** the earlier version of this skill taught a Material-indigo system (indigo vs
  blog-blue accents, a Poppins 68px/300 light hero, "no portfolio card layer"). Those are historical.
  Trust the live CSS: ink + signal, Space Grotesk display, a shared elevated card.
- Re-verify palette/type doctrine: `grep -E "lp-ink:|lp-signal|lp-font-display|lp-ls-display|lp-shadow-elevated" src/styles/global.css`
- Re-verify the one-gradient rule still holds: `grep -rn "gradient(" src/styles/` (only `.lp-blog-nav`)
- Re-verify no blur/backdrop-filter crept in: `grep -rn "backdrop-filter\|blur(" src/styles/ src/`
- Re-verify eyebrow/label/button casing + tracking: `grep -n "letter-spacing\|text-transform" src/styles/components.css src/styles/global.css`
- Full brand-doctrine origin (voice examples, casing, iconography): `project/README.md` (note: the bundle
  doc predates this refresh for palette/type mechanics; trust the live CSS there).
