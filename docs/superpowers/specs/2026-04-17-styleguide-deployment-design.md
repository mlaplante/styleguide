# Styleguide Deployment — Design Spec

**Date:** 2026-04-17
**Target:** `styleguide.michaellaplante.com`
**Repo:** https://github.com/mlaplante/styleguide.git

## Goal

Deploy the La Plante Web Dev Design System bundle as a curated, public docs-style
site at `styleguide.michaellaplante.com`, hosted on Cloudflare Pages.

## Decisions

| Decision | Choice |
|----------|--------|
| Audience | Public, indexable |
| Site style | Curated docs site with grouped sidebar navigation |
| Framework | Astro (static output) |
| Hosting | Cloudflare Pages, Git integration |
| Preview integration | Each preview ported to a native `.astro` page |
| DNS | Cloudflare-managed (one-click custom domain) |

## Architecture

Astro static site built from the existing `project/` bundle. The original
bundle stays intact as the design source of truth; `src/` is the rendered site.

```
/
├── src/
│   ├── layouts/
│   │   └── DocsLayout.astro        # sidebar + topbar + content slot
│   ├── components/
│   │   └── Sidebar.astro           # grouped nav
│   ├── pages/
│   │   ├── index.astro             # landing
│   │   ├── colors/
│   │   │   ├── primary.astro
│   │   │   ├── accent-palette.astro
│   │   │   └── neutrals.astro
│   │   ├── type/
│   │   │   ├── hero.astro
│   │   │   ├── headings.astro
│   │   │   ├── body.astro
│   │   │   └── eyebrow.astro
│   │   ├── spacing/
│   │   │   ├── scale.astro
│   │   │   ├── radii.astro
│   │   │   └── shadows.astro
│   │   ├── components/
│   │   │   ├── buttons.astro
│   │   │   ├── input.astro
│   │   │   ├── blog-nav.astro
│   │   │   ├── post-card.astro
│   │   │   ├── service.astro
│   │   │   └── timeline.astro
│   │   └── ui-kits/
│   │       ├── blog.astro
│   │       └── portfolio.astro
│   └── styles/
│       └── global.css              # adapted from project/colors_and_type.css
├── public/
│   └── assets/                     # from project/assets + project/uploads
├── project/                        # original bundle, source of truth
├── astro.config.mjs
└── package.json
```

## Layout & Navigation

**DocsLayout.astro** — two-column shell:

- **Left sidebar (~260px, fixed):** grouped navigation.
  - *Foundations:* Colors (Primary, Accent Palette, Neutrals), Type (Hero,
    Headings, Body, Eyebrow), Spacing (Scale, Radii, Shadows)
  - *Components:* Buttons, Input, Blog Nav, Post Card, Service, Timeline
  - *UI Kits:* Blog, Portfolio
  - Active link highlighted based on current URL.
- **Top bar (slim):** "La Plante Web Dev — Style Guide" title + link back to
  michaellaplante.com.
- **Main content:** page title, optional description, then the ported preview
  markup inside a max-width container.

**Landing page (`/`):** logo hero, one-sentence description, grid of cards
linking to each top-level section.

**Styling:** global tokens from `colors_and_type.css` load in the layout.
Sidebar/topbar styles are scoped in `DocsLayout.astro` so they don't collide
with preview content. Preview pages render inside `<main class="preview">`.

**Responsive:** sidebar collapses to a top hamburger below 768px.

## Deployment (Cloudflare Pages)

1. Push repo to `https://github.com/mlaplante/styleguide.git`.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build config:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Env var: `NODE_VERSION=20`
4. Deploy → receive `*.pages.dev` URL.
5. Custom domain → add `styleguide.michaellaplante.com`. Since
   `michaellaplante.com` is on Cloudflare DNS, the CNAME is created
   automatically. HTTPS issued automatically.

**Per-push flow:**
- `main` → production deploy to `styleguide.michaellaplante.com`
- any other branch → preview URL under `*.pages.dev`

## Build Sequence

1. Scaffold Astro at repo root (`npm create astro@latest`, minimal template).
2. Keep `project/` as-is.
3. Port `project/colors_and_type.css` → `src/styles/global.css`, imported by
   `DocsLayout.astro`.
4. Copy `project/assets/` + `project/uploads/` → `public/assets/`.
5. Build `DocsLayout.astro` and `Sidebar.astro` per the grouping above.
6. Port each preview file (18 in `project/preview/` plus 2 UI kits) into
   `.astro` pages wrapping the content in `DocsLayout` with title + description.
7. Build landing page `src/pages/index.astro`.
8. Verify locally with `npm run dev` — click every sidebar link, check responsive.
9. Commit + push to `main`.
10. Cloudflare Pages setup per above, then add custom domain.

## Out of Scope (YAGNI)

- Site search
- Dark mode toggle
- Code-copy buttons
- Versioning
- MDX support
- Automated testing — visual review is the acceptance test for a styleguide.
