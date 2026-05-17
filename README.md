# La Plante Web Dev — Style Guide

Live site: **https://brand.michaellaplante.com**

The design system for La Plante Web Dev, built as an Astro static site and deployed on Cloudflare Pages. Covers the brand foundations (logo, colors, type, spacing), reusable components, and full UI kits.

## What's in the repo

- `src/pages/` — every styleguide page, one `.astro` file per preview
  - `index.astro` — landing page with preview-tile cards
  - `logo.astro` — brand mark on light and dark tiles
  - `colors/`, `type/`, `spacing/` — foundation specimens
  - `motion.astro` — duration and easing specimens
  - `components/` — buttons, input, blog nav, post card, service, timeline, badges, callouts
  - `ui-kits/` — full blog and portfolio compositions
- `src/layouts/DocsLayout.astro` — shared chrome (topbar, sidebar, content frame)
- `src/components/Sidebar.astro` — grouped navigation, driven by `src/data/nav.ts`
- `src/data/nav.ts` — single source of truth for sidebar groups and the landing-page section grid
- `src/styles/global.css` — design tokens (colors, typography, spacing, radii, shadows, motion) plus shared `sg-*` preview-scaffolding utilities
- `public/assets/` — logo PNGs and other static assets
- `project/` — original design bundle from Claude Design (kept as the source of truth for the prototypes that each page was ported from)

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve the built site
```

Requires Node 20.

## Deployment

Pushes to `main` deploy automatically to Cloudflare Pages. Other branches get preview URLs.

**Build config (Cloudflare Pages):**
- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Env var: `NODE_VERSION=20`

## Adding a page

1. Create `src/pages/<group>/<name>.astro`:
   ```astro
   ---
   import DocsLayout from '../../layouts/DocsLayout.astro';
   ---
   <DocsLayout title="My Page" description="What this shows.">
     <!-- content -->
   </DocsLayout>

   <style>
     /* Use scoped <style> — not `is:global` — so selectors don't leak. */
   </style>
   ```
2. Add an entry in `src/data/nav.ts` under the appropriate group. The Sidebar and the landing-page card grid both consume that registry, so a single edit picks them both up.
3. Use tokens from `src/styles/global.css` (`var(--lp-*)`) rather than hard-coded values — that's the whole point of the styleguide. Shared preview-scaffolding utilities are available via `sg-*` classes (e.g. `sg-row`, `sg-meta`, `sg-stack`, `sg-swatch`).

## Design tokens

All tokens live in `src/styles/global.css` as CSS custom properties on `:root`. Typography uses Poppins (display/body) and Roboto Mono (labels/meta), loaded via Google Fonts. Colors center on an indigo primary (`--lp-indigo-500: #3F51B5`) with a blog-blue secondary, Material-style accents, and a full neutral scale.
