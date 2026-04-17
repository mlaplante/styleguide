---
name: laplante-design
description: Use this skill to generate well-branded interfaces and assets for La Plante Web Development (Michael LaPlante — security executive & software engineering consulting), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping the portfolio site and blog.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quickstart

- **Primary accent:** Indigo `#3F51B5` (portfolio). Cooler blue `#2980b9 → #1a6da3` gradient for the blog sticky nav only.
- **Type:** Poppins (display/body, weights 300/400/500/600/700) + Roboto Mono (eyebrows, meta, inline code).
- **Section eyebrows** are lowercase + mono + underlined with a 40%-opacity indigo wash. Service titles are UPPERCASE with 2px letter-spacing.
- **Voice:** first-person, confident, named frameworks (SOC 2, zero trust, DevSecOps). Avoid generic marketing language.
- **Emoji:** only ☀️ / 🌙 for dark-mode. Don't introduce more.
- **Logos:** `assets/laplante-logo.png` (on light) + `assets/laplante-logo-white.png` (on dark).
- **Tokens:** import `colors_and_type.css` — all tokens live there as `--lp-*` CSS vars.

## Files

- `colors_and_type.css` — design tokens + semantic type classes
- `assets/` — logo rasters
- `preview/` — swatches + specimens (used by the Design System tab)
- `ui_kits/portfolio/` — homepage + services + timeline + contact (hi-fi)
- `ui_kits/blog/` — blog listing + article reader (hi-fi)
