# La Plante Web Development — Design System

A design system for **La Plante Web Development** / **Michael LaPlante** — a security-executive & software-engineering consulting practice. Serves all client technology needs, from information security strategy to full-stack web development.

> "Copyright LaPlante Web Development 2006-2026."
> Live site: [michaellaplante.com](https://michaellaplante.com)

---

## Sources

This system was derived from:

- **Logo assets:** `uploads/laplantelogo_v2.png`, `uploads/laplantelogo_v2-white.png` (also `.ai`/`.eps` in the original ask but only PNGs were uploaded). The mark pairs a stylized American football with a bold sans-serif stacked wordmark "LA PLANTE / WEB DEVELOPMENT".
- **Codebase:** GitHub `mlaplante/resumesite` (Astro 6, deployed to michaellaplante.com via Netlify + Cloudflare). Source files read remotely via GitHub, not fully imported. Key files:
  - `blog-src/public/css/style.css` — portfolio stylesheet (material-style, indigo #3F51B5)
  - `blog-src/public/css/fonts.css` — self-hosted Poppins + Roboto Mono
  - `blog-src/public/css/linea.css` — Linea icon font declarations
  - `blog-src/src/styles/blog.css` — blog-specific (cooler blue #2980b9, lighter paper)
  - `blog-src/src/pages/index.astro` — canonical homepage composition
  - `blog-src/src/content/posts/*.md` — 30+ blog posts; tone/copy examples

## Products represented

1. **Personal portfolio + consulting site** (`michaellaplante.com`) — hero, about, services, expertise, experience timeline, latest posts, contact. Indigo accent, warm paper neutral.
2. **Blog** (`michaellaplante.com/blog`) — long-form dev-session + thought-leadership posts. Cooler blue accent, reading-optimised typography, sticky gradient nav, dark-mode.

Both ship as a single Astro build.

---

## Index

| File / folder | Purpose |
|---|---|
| `README.md` | This file — brand context, content + visual foundations, iconography, index |
| `SKILL.md` | Agent skill manifest — drop-in for Claude Code / Agent Skills |
| `colors_and_type.css` | CSS variables for colors, type, spacing, radii, shadows + semantic type classes |
| `assets/` | Logos (primary + white/reverse) |
| `preview/` | Card specimens rendered in the Design System tab |
| `ui_kits/portfolio/` | Hi-fi recreation of the main portfolio site |
| `ui_kits/blog/` | Hi-fi recreation of the blog reading experience |

---

## Content Fundamentals

**Voice.** First-person ("I architect…", "I'm an accomplished…"), confident but not swaggering. Written from the operator's desk, not marketing copy. Blog posts use the plural "we" when describing engineering practice, but author bio and site copy are first-person singular.

**Audience.** CTOs, VPs of Engineering, security-conscious founders. Assumes familiarity with SOC 2, zero trust, DevSecOps, cloud primitives. Jargon is earned — not watered down.

**Casing.**
- **Section eyebrows** — lowercase, letter-spaced, underlined with a 40%-opacity indigo wash (e.g. `about me`, `by the numbers`).
- **Service titles & labels** — UPPERCASE, letter-spaced (2px).
- **Headings** — Title Case, never all-caps.
- **Button labels** — UPPERCASE (e.g. `DISCUSS YOUR NEEDS`, `SCHEDULE A CONSULTATION`).

**Tone examples (verbatim):**

> "I architect and implement secure, scalable enterprise-grade technology solutions while cultivating high-performing teams that consistently exceed objectives and drive meaningful organizational change."

> "Navigate SOC 2, ISO 27001, HIPAA, and PCI-DSS with practical frameworks that satisfy auditors without slowing your teams down."

> "Scale engineering organizations, establish DevSecOps practices, and build the security culture that keeps your company out of the headlines."

Notice the pattern: **concrete outcomes + named frameworks + a wry aside**. Avoid generic "leverage synergies" language — the site is explicit about what's actually delivered.

**Numbers are used for proof** — "$800M company secured", "15+ years in enterprise security", "70+ speaking engagements", "500+ clients served". Keep these big, Poppins-bold, with a monospaced caption below.

**Emoji.** Used sparingly and only in one place on the live site: ☀️ / 🌙 on the dark-mode toggle. Avoid emoji in copy, headings, or marketing. Don't introduce new ones.

**Category slugs** (blog):
- `dev-session` — development session recaps and technical walkthroughs
- `thought-leadership` — industry trends, opinions, and insights

---

## Visual Foundations

### Palette

Two related but distinct accents split the brand:

- **Portfolio indigo `#3F51B5`** — Material 500. Hero background, CTA fills, section-eyebrow underline, active timeline nodes. Feels structured, corporate-adjacent, confident.
- **Blog blue `#2980b9` → `#1a6da3`** — cooler, used as a 135° linear gradient on the sticky blog nav. Softer than the indigo — reading-friendly.

Material secondaries (blue-grey / teal / pink / blue / green / purple) ship as an opt-in "color switch" side-rail on the portfolio — users can retheme the accent live. They are available tokens, not the default.

Neutrals are warm: `#F1F1F1` portfolio paper, `#f8f9fa` blog paper, `#202020` near-black. Not true grey. Dark-mode flips to `#1a1a1a` / `#0f172a` with `#e0e0e0` / `#cbd5e1` text.

### Typography

- **Poppins** (300 / 400 / 500 / 600 / 700) — display + body. Self-hosted woff2 via `fonts.css`.
- **Roboto Mono** (300 / 400 / 500 / 700) — section eyebrows, intro tagline, meta, footer copyright, nav labels, inline code.

The split is strict: Poppins carries structure, Roboto Mono adds "engineering" texture. No other typefaces are used.

Hero name is 68px / weight 300 / letter-spacing 2px — a light-weight contrast against the heavy indigo hero block. Blog article body is 17px / line-height 1.8 / color `#374151` — tuned for long reads.

### Spacing

Sections pad `90px` top; hero pads `120px` top / `100px` bottom. Max content width `1024px` (portfolio) or `1080px` (blog). Gap between form fields is `20px`. Timeline items are `45px` apart.

### Backgrounds

- **Hero** is full-bleed solid indigo with an inset `0 0 40px rgba(0,0,0,0.45)` shadow that gives the block a subtle "pressed" feel.
- **Blog nav** is a 135° gradient `#2980b9 → #1a6da3` (dark-mode `#1a5276 → #154360`). This is the *only* gradient in the system — resist adding more.
- Everything else is flat paper (`#F1F1F1` or `#f8f9fa`). No repeating patterns, no textures, no full-bleed imagery.
- Blog quote blocks have a 4%-opacity indigo-blue left-tint.

### Animation

Motion is restrained and functional.

- **Scroll-in entrance** — `[data-aos="fade-up"]` fades + translates 30px up on intersection. `zoom-out-up` variant adds a 1.1× scale for the hero portrait. Duration `0.6s ease`. Respects `prefers-reduced-motion`.
- **Menu** — radial reveal: a white circle scales from 0 to 1 (1200px) over `0.6s ease` from the hamburger corner; nav items stagger in at 0.1s intervals.
- **Reading progress bar** — scroll-driven `animation-timeline: scroll(y)` CSS-only.
- **Ripple** — CSS keyframe `ripple-effect` 0.6s ease-out on buttons (`.ripple-target`), replaces the old Waves.js.
- Transitions are `ease` not `ease-in-out`; durations cluster at `0.2s` / `0.3s` / `0.6s`.

### States

- **Hover (button)** — CTA flips to transparent fill with a `translateY(-3px)` lift and a larger indigo shadow (`0 10px 30px rgba(63,81,181,0.5)`).
- **Hover (menu item)** — 4%-black wash + color deepens from `#808080` to `#202020`.
- **Hover (post card)** — 2px lift, border darkens from `#e5e7eb` → `#d1d5db`, soft `0 4px 16px rgba(0,0,0,0.06)` shadow.
- **Focus** — `2px solid #3F51B5` outline with 2px offset. Skip-to-content link uses the same indigo on focus.
- **Press** — no explicit shrink; relies on ripple for tactile feedback.

### Borders & lines

- Card borders are `1px solid #e5e7eb` (light) / `#334155` (dark). Radius `10px`.
- Form inputs use a **bottom-border only** (`1px #ddd` → indigo on focus). This is the Material-style floating-label pattern.
- Timeline uses a 1px vertical rule `#E0E0E0` with 12px circular nodes; the current node fills indigo.

### Shadows

The system has four shadow tiers, not a smooth elevation ramp:

1. **Image rim** — `0 0 25px rgba(0,0,0,.15)` (person portrait, soft glow)
2. **Card hover** — `0 4px 16px rgba(0,0,0,.06)` (blog cards)
3. **Hero block** — `0 0 40px rgba(0,0,0,.45)` (hero section only)
4. **Button indigo** — `0 4px 15px rgba(63,81,181,0.4)` → `0 10px 30px rgba(63,81,181,0.5)` on hover

Nav sticky shadow: `0 2px 8px rgba(0,0,0,.15)`.

### Transparency & blur

Transparency carries **intent**, not decoration:
- Section eyebrow underline is `40%` indigo (a highlighter, not a solid rule).
- Body paragraphs use `rgba(0,0,0,.6)` / `.8` over paper rather than new grey hex values.
- Blog category pill: `8%` indigo-blue fill + indigo-blue text.
- No backdrop-filter / blur anywhere. Don't introduce it.

### Corner radii

Button `6px` (portfolio CTA) / `4px` (default). Post cards `10px`. Code blocks / article images `8px`. Alerts `3px`. Person portrait and timeline nodes are perfect circles (`50%`). Category pills are full pill `100px`.

### Cards

Portfolio has *no* card layer — services are iconography + title + text on paper. The **only** card pattern is on the blog's "Latest from the Blog" teaser: white fill, `1px #e5e7eb` border, `10px` radius, `20px 24px` padding, subtle hover lift. Don't invent new card styles.

### Layout rules

- Top nav is `position: fixed; top: 0` with a hamburger top-right and a circular dark-mode toggle beside it.
- On the blog, the nav switches to `position: sticky` so it scrolls with the reader.
- Timeline splits 50/50 (date left, content right) on desktop and stacks on mobile < 620px.
- Sections are flow-layout (no grid beyond Bootstrap's 12-col).
- Container max-width 1024px (portfolio) / 1080px (blog).

### Imagery

Portrait is a 220px circle with `object-fit: cover`. Article images are 100% width with `8px` radius and a soft `0 2px 12px` shadow. No grain, no duotone, no washes — the aesthetic is clean and professional, not moody.

---

## Iconography

Two icon systems live in the codebase:

1. **Linea** — a free monoline icon font (`blog-src/public/fonts/linea.woff` + `blog-src/public/css/linea.css`). Referenced via class names like `.icon-basic-shield`, `.icon-basic-cloud`, `.icon-basic-lock`, `.icon-basic-lightbulb`. Four sub-collections: `basic`, `ecommerce`, `music`, and a compact set of duplicated basic glyphs. Used on the homepage services section at `68px` / `line-height: 1`.
2. **Ionicons** (mentioned in the site's README but not loaded on the homepage) — backup set for generic UI glyphs.

The Linea font is **not binary-imported** into this design system (we can't read binary through the GitHub reader). For prototyping, substitute a matching monoline set from CDN:

- **Linea lookalike:** [Tabler Icons](https://tabler-icons.io/) (via `https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/`) — matches Linea's 1.5px monoline feel closely.
- Or [Heroicons outline](https://heroicons.com/) — slightly thicker, still consistent.

⚠️ **Flagged substitution:** If you're producing production-quality artifacts, pull the original Linea woff from the repo and drop it in `assets/fonts/linea.woff`; fall back to Tabler in mockups.

**SVGs.** The favicon is the only first-party SVG — a rounded-rect indigo tile with a white "ML" monogram. The football-in-logo is raster (PNG). Don't draw a new football SVG — use the raster logo or ask the user for the `.ai`/`.eps` sources.

**Emoji.** Used once (☀️ 🌙 for the dark-mode toggle). Don't expand this — emoji is not a brand pattern.

**Unicode chars.** `·` middle-dot separator between date + read-time on blog post cards. `©` in the footer. That's it.

---

## Notes on fidelity

- The original Linea icon font is a binary `.woff` file we couldn't inline into this repo; UI-kit prototypes use Tabler icons in its place. Swap to the real Linea font for production work.
- The original `uploads/laplantelogo_v2.ai` and `.eps` were listed but only the PNG rasters were actually uploaded — vector editing will need the source files re-attached.
- The self-hosted Poppins + Roboto Mono woff2 files live in the original repo under `blog-src/public/fonts/`; we load them via Google Fonts `@import` in `colors_and_type.css` for portability. Swap to self-hosted in production.
