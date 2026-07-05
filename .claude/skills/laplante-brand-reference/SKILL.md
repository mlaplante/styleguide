---
name: laplante-brand-reference
description: Use when writing or reviewing copy, choosing colors/type/spacing/shadows/motion/states, or judging whether a new UI decision "feels on-brand" for La Plante Web Development (Michael LaPlante's security-executive + software-engineering consulting site and blog) — for questions like "what accent color do I use here", "is this gradient allowed", "how should this button hover", "what casing does this heading need", "does this copy sound right", "why is the hero type so light-weight", "how many shadow levels are there", "can I add a card style", "can I use backdrop-filter/blur", "what emoji are allowed". Symptoms include: unsure which of the two accents (indigo vs blog-blue) applies, tempted to add a new gradient/blur/card/emoji, unsure why hero name is 68px/300, unsure how many elevation tiers exist, drafting marketing copy that needs the site's voice, or reviewing a PR for brand consistency. NOT for exact token names/values/how-to-add-a-token (see styleguide-design-tokens-reference) and NOT for generic UI/UX craft unrelated to this specific brand (see frontend-design, web-design-guidelines).
---

# La Plante brand doctrine

This is the **why**, not the **what**. For every exact `--lp-*` token name/value and every `lp-*`/`sg-*`
class, see sibling skill `styleguide-design-tokens-reference` — that is the catalog. This skill teaches
the design reasoning so a mid-level engineer (or a model) can make a *new* on-brand decision, not just
copy an existing one.

Brand doctrine facts below are marked **SACRED** where straying is a real failure per the maintainer,
not a nitpick. Everything else is guidance for extending the system in spirit.

## Two accents, one meaning each

- **Portfolio indigo `#3F51B5`** (Material 500) — the *only* primary accent on the portfolio surface
  (hero fill, CTA buttons, section-eyebrow underline wash, active timeline node, focus ring). It reads
  structured and corporate-adjacent — deliberately, because the audience is CTOs/VPs/security-conscious
  founders who read "flashy" as "not enterprise-ready."
- **Blog blue `#2980b9 → #1a6da3`** — cooler and softer, used **only** as the 135° gradient on the blog's
  sticky nav. It signals "you're in reading mode now," distinct from the portfolio's pitch mode.
- **This is the one gradient in the whole system (SACRED).** Do not add a second gradient anywhere,
  even a subtle one — the system uses exactly one gradient as a section-mode signal, not a decoration.
  Any new gradient is a brand violation, not a style choice.
- **Material secondaries** (blue-grey `#607D8B`, teal `#009688`, pink `#FF4081`, blue `#2196F3`, green
  `#4CAF50`, purple `#9C27B0`) exist as an **opt-in** live color-switcher on the portfolio, not as
  defaults. If you're asked to "pick an accent," default to indigo unless the surface is explicitly
  the color-switcher rail or a blog-only context.
- **Neutrals are warm, never true grey** (`#F1F1F1` portfolio paper, `#f8f9fa` blog paper, `#202020`
  near-black). This is why you never introduce `#000`/`#fff`/`#808080`-style neutral grey — it reads
  cold against the warm paper.

## Typography: two families, one job each

- **Poppins** (300/400/500/600/700) carries *structure* — headings, hero, body, buttons, labels.
- **Roboto Mono** (300/400/500/700) adds *"engineering" texture* — section eyebrows, meta/timestamps,
  footer copyright, nav labels, inline code, numeric proof captions. The split is strict: never use mono
  for a heading, never use Poppins for an eyebrow.
- **Fonts are self-hosted via `@font-face`/`@fontsource` woff2 (latin subset), full stop.** Do not
  reference "Google Fonts `@import`" — that describes an older bundle and is stale for the live system;
  the CSP (`font-src 'self'`) makes an external font request a silent production break, not just a
  style deviation. See `styleguide-change-control` for the CSP non-negotiable.
- **Hero name is 68px / weight 300 / 2px tracking** — deliberately *light-weight* against the heavy solid
  indigo hero block, so the name reads as elegant contrast rather than competing with the fill for
  visual weight. This pairing (huge + light) is the signature hero move; don't default to a bold hero
  numeral just because it's big.
- **Blog article body is 17px / line-height 1.8**, tuned for long-form reading comfort — noticeably more
  generous than the UI base (16px/1.5). If you're building more long-read surfaces, inherit the 1.8
  rhythm, not the tighter UI line-height.
- **No other typefaces.** Adding a third family (even for "just this one badge") breaks the two-role
  contract above.

## Casing rules (apply per role, not blanket)

| Role | Casing | Notes |
|---|---|---|
| Section eyebrows | lowercase, mono, letter-spaced | underlined with a 40%-opacity indigo wash — a highlighter, not a solid rule |
| Service titles / labels | UPPERCASE, 2px tracking | structural labels, not body copy |
| Headings | Title Case | never all-caps, ever |
| Button labels | UPPERCASE, ~1.5px tracking | e.g. "DISCUSS YOUR NEEDS" — slightly tighter tracking than eyebrows/labels, don't conflate the two |

## The voice (this is the part most often under-served)

**First-person, confident, operator-not-marketer.** Author bio and site copy are first-person singular
("I architect…"); blog engineering-practice copy may use plural "we." Audience is CTOs/VPs of
Engineering/security-conscious founders who know SOC 2, zero trust, DevSecOps, cloud primitives —
jargon is earned, not explained down to a general audience.

**The formula: concrete outcome + named framework + a wry aside.** Verbatim examples (use these as the
calibration reference, don't paraphrase away the pattern):

> "I architect and implement secure, scalable enterprise-grade technology solutions while cultivating
> high-performing teams that consistently exceed objectives and drive meaningful organizational change."

> "Navigate SOC 2, ISO 27001, HIPAA, and PCI-DSS with practical frameworks that satisfy auditors without
> slowing your teams down."

> "Scale engineering organizations, establish DevSecOps practices, and build the security culture that
> keeps your company out of the headlines."

Avoid generic "leverage synergies" marketing language — every claim names a framework, a number, or a
concrete deliverable. If a sentence could appear on any consulting site verbatim, rewrite it.

**Numbers are proof, not decoration.** "$800M company secured", "15+ years in enterprise security",
"70+ speaking engagements", "500+ clients served" — rendered big and Poppins-bold with a monospaced
caption underneath. This is why the numeric-proof pattern always pairs a bold display number with a
small mono label, mirroring the hero's "big display + mono texture" split above.

**Emoji: exactly ☀️ / 🌙 on the dark-mode toggle, nowhere else (SACRED).** Do not add emoji to copy,
headings, or UI to seem friendlier — it is not a brand pattern and reads as off-brand immediately.

## Spacing rhythm

Sections pad `90px` top; the hero pads `120px` top / `100px` bottom — the hero gets almost 1.3x the
rhythm of a normal section because it's the one full-bleed "stage" moment. Content maxes at `1024px`
(portfolio) or `1080px` (blog) — the blog is marginally wider because reading measure tolerates it and
body copy is narrower per line via padding. Form-field gap is `20px`; timeline items sit `45px` apart —
tighter than section rhythm because they're a single continuous list, not discrete blocks.

## Shadows: four semantic roles, not a smooth elevation ramp

Don't reach for a generic "elevation 1/2/3" mental model — this system assigns each shadow a specific
*meaning*, not a stacking height:

1. **Image rim** — soft, wide, very low opacity glow around the portrait. Reads as "presence," not depth.
2. **Card hover** — tight, low-opacity, appears only on interaction (blog teaser cards). Reads as "this
   is clickable," not ambient elevation.
3. **Hero block** — a large *inset-feeling* dark shadow that makes the solid indigo hero read as
   "pressed"/recessed rather than floating. This is the odd one out — it's the only shadow that reads
   as depth-into-the-page rather than lift-off-the-page.
4. **Button indigo** — a colored (not neutral) shadow tinted to the button's own hue, intensifying on
   hover. Reads as "this button is charged," reinforcing the CTA's importance.

There are more shadow *tokens* than four (nav-sticky, article-image, dark-mode variants) — those are
refinements of these four roles for different surfaces, not a fifth+ tier. If you need an exact value,
that's `styleguide-design-tokens-reference`, not this skill.

## Motion doctrine

Confirmed in the live styleguide CSS: transitions use `ease` (never `ease-in-out`), durations cluster at
three steps — `0.2s` (fast, e.g. card hover), `0.3s` (default, e.g. button/field transitions), `0.6s`
(slow, e.g. the blog reading-progress bar's scroll-driven CSS animation) — and `prefers-reduced-motion`
is globally respected (all animation/transition durations collapse to `0.01ms`). Motion is restrained
and functional: it confirms state changes, it doesn't perform.

The brand's richer motion moves — scroll-triggered fade-up entrances, the radial hamburger-menu reveal,
the button ripple — are documented as brand-origin doctrine (from the live resumesite this system
documents) rather than things implemented in this repo's `components.css`. Treat them as "how the real
site behaves," useful context if you're asked to reproduce portfolio/blog behavior elsewhere, but don't
expect to find their keyframes in this styleguide's CSS.

## States: hover / focus / press

- **Button hover** — flips to transparent fill, lifts `translateY(-3px)`, and the shadow both grows and
  intensifies (see shadow role 4 above). The color *inverts* rather than just darkening — a deliberate
  "reveal" rather than a shade shift.
- **Menu-item hover** — a faint wash plus a color deepen (mid-grey → near-black). Subtle, UI-chrome-level
  feedback, not a brand statement.
- **Post-card hover** — small lift (2px) + border darkens + a soft shadow appears. Calmer than the button
  hover because it's a passive "you can click this," not a primary CTA.
- **Focus** — a solid indigo outline with offset, used identically for the skip-link and all interactive
  elements. One focus treatment system-wide — don't invent a second focus style for "special" components.
- **Press** — no explicit shrink/scale on press; tactile feedback comes from the ripple/hover motion
  instead. Don't add a `:active { transform: scale(...) }` — it's not part of the system's vocabulary.

## Corner-radius logic (radius signals a role, not a size preference)

Radius scales with how "soft"/human a shape should read: small (~3-4px) for structural UI (buttons,
alerts, menus) that should stay crisp; medium (~6-8px) for CTAs and content surfaces (code blocks,
article images) that want a touch more warmth; larger (~10px) for the one card pattern, which is the
most "friendly" surface in the system; full circle for anything literally circular (portrait, timeline
nodes); full pill for category tags, because a pill reads as a removable/scannable label, not a container.

## Cards and blur — the two easiest ways to go off-brand

- **No new card styles (SACRED).** Portfolio has no card layer at all — services are icon + title + text
  directly on paper. The *only* card in the whole system is the blog's "Latest from the Blog" teaser
  card. If you're tempted to wrap something in a card because "it needs visual separation," that's a
  signal to use whitespace/borders instead, not a new card.
- **No `backdrop-filter`/blur anywhere (SACRED).** Transparency in this system always carries semantic
  intent (an eyebrow's highlighter wash, a body paragraph's `rgba` fade, a category pill's tint) — never
  decorative glassmorphism. If a design calls for "frosted glass," that's off-brand; use a flat tint.

## When NOT to use this skill

- Need an exact token name, hex, or px value, or how to add a new `--lp-*`/`lp-*` entry →
  `styleguide-design-tokens-reference`.
- Need to know whether a change is allowed to ship, how it's classified, or the non-negotiables list
  with incident history → `styleguide-change-control`. **This skill never authorizes a change** — any
  brand-rule deviation, even one that seems reasoned here, must gate through change-control before it
  ships.
- Need load-bearing architecture (3-layer lineage, `components.css` as the portable layer, CSP
  rationale) → `styleguide-architecture-contract`.
- Need general UI/UX craft not specific to this brand (contrast ratios, generic layout heuristics) →
  `frontend-design`, `web-design-guidelines`.

## Provenance and maintenance

Facts verified against the repo on 2026-07-05 (repo root: `/Users/mlaplante/.supacode/repos/styleguide/skills`).

- **Known drift, worked example:** `project/README.md` (the original design-bundle doc this doctrine is
  distilled from) states fonts load via "Google Fonts `@import`." This is stale — the live
  `src/styles/global.css` self-hosts Poppins + Roboto Mono via `@font-face`/`@fontsource` woff2. Trust
  the live CSS, not the bundle doc, for delivery mechanism; the bundle doc is still the best source for
  the *doctrine* (voice, casing, palette meaning) captured in this skill.
- Re-verify palette/type-scale doctrine values: `grep -E "lp-t-hero|lp-t-base|lp-lh-body|lp-indigo-500|lp-blog-blue" src/styles/global.css`
- Re-verify the one-gradient rule still holds (no new `linear-gradient`/`radial-gradient` introduced):
  `grep -rn "gradient(" src/styles/`
- Re-verify no blur/backdrop-filter crept in: `grep -rn "backdrop-filter" src/styles/ src/`
- Re-verify button/eyebrow/label tracking values: `grep -n "letter-spacing" src/styles/components.css src/styles/global.css`
- Re-verify motion durations/easing: `grep -n "lp-dur\|lp-ease" src/styles/global.css`
- Full brand-doctrine source (voice examples, casing, iconography notes): `project/README.md`
