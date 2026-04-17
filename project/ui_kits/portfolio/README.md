# Portfolio UI Kit — La Plante Web Development

Hi-fi recreation of `michaellaplante.com` (the Astro portfolio homepage). Sourced from `mlaplante/resumesite` — specifically `blog-src/src/pages/index.astro` + `blog-src/public/css/style.css`.

## Screens

- **Hero + navigation** — fixed hamburger, dark-mode toggle, circular portrait, indigo block with inset shadow, big intro name, mono tagline, "Schedule a Consultation" CTA.
- **About + social** — muted body copy, uppercase social link row.
- **By the numbers** — 4-up big-number funfacts.
- **Consulting Services** — 2×2 grid with monoline icons + UPPERCASE titles.
- **Experience timeline** — vertical rule with circular nodes, current role filled indigo.
- **Contact form** — floating-label Material-style inputs, indigo CTA.

## Components

`Nav.jsx`, `Hero.jsx`, `Section.jsx` (shared eyebrow), `Funfact.jsx`, `Service.jsx`, `Timeline.jsx`, `MaterialInput.jsx`, `Button.jsx`, `Footer.jsx`.

## Notes

- Linea icon glyphs are drawn as small inline SVG approximations (shield, cloud, lock, bulb). Swap to the real Linea font for production.
- Uses `colors_and_type.css` tokens from project root.
