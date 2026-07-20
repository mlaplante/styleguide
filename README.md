# La Plante Web Dev — Style Guide

Live site: **https://brand.michaellaplante.com**

The design system for La Plante Web Dev, built as an Astro static site and deployed on Cloudflare Pages. Covers the brand foundations (logo, colors, type, spacing), reusable components, and full UI kits.

## What's in the repo

- `src/pages/` — every styleguide page, one `.astro` file per preview
  - `index.astro` — landing page with preview-tile cards
  - `logo.astro` — brand mark on light and dark tiles
  - `colors/`, `type/`, `spacing/` — foundation specimens with click-to-copy tokens
  - `motion.astro` — duration and easing specimens
  - `components/` — buttons, input, blog nav, post card, service, timeline, badges, callouts — each with a collapsible code snippet
  - `ui-kits/` — full blog and portfolio compositions
  - `404.astro` — not-found page
- `src/layouts/DocsLayout.astro` — shared chrome (topbar, sidebar, content frame, dark-mode toggle, copy-to-clipboard handler)
- `src/components/Sidebar.astro` — grouped navigation (collapsible on mobile), driven by `src/data/nav.ts`
- `src/components/brand/` — the reusable brand components (Button, PostCard, ServiceCard, Timeline, BlogNav, FloatingField, Callout), consumed by both the component pages and the UI kits
- `src/components/CodeSnippet.astro` — collapsible copyable code block used on component pages
- `src/data/nav.ts` — single source of truth for sidebar groups and the landing-page section grid
- `src/styles/global.css` — design tokens (colors, typography, spacing, radii, shadows, motion), docs-chrome theme tokens, plus shared `sg-*` preview-scaffolding utilities
- `src/styles/components.css` — canonical component CSS (`lp-*` classes). This is the portable layer: copy it together with the markup from a component page's code snippet to reuse a component outside this repo
- `public/assets/` — logo PNGs and other static assets
- `project/` — original design bundle from Claude Design (kept as the source of truth for the prototypes that each page was ported from)

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve the built site
npm run format     # prettier --write (astro-aware)
```

Requires Node ≥ 22.12 (see `engines` in `package.json`).

## Deployment

Pushes to `main` deploy automatically to Cloudflare Pages. Other branches get preview URLs.

**Build config (Cloudflare Pages):**

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Env var: `NODE_VERSION=22`

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

## Adding or changing a component

Component styles live once, in `src/styles/components.css` (`lp-*` classes); thin Astro wrappers in `src/components/brand/` render the canonical markup. Both the `components/` specimen pages and the `ui-kits/` compositions consume the same classes, so a change there updates every rendering at once. When you change markup, update the `CodeSnippet` on the matching component page too.

## Design tokens

All tokens live in `src/styles/global.css` as CSS custom properties on `:root`. Typography uses **Space Grotesk** (display — hero, headings, stat numerals, card titles), **Poppins** (running body copy), and **Roboto Mono** (eyebrows, meta, nav, labels, code), all self-hosted via `@fontsource` (woff2 subsets bundled at build time — no external font requests). Colors follow the **executive-brief** identity: a deep-navy ink authority (`--lp-ink: #0A1528`) paired with a single warm amber signal accent (`--lp-signal: #E2A33C`, deepened to `--lp-signal-deep: #B57A1E` for links/hover), over cool paper and white surfaces with a slate body tone. The former indigo/blog-blue Material palette is retained as retiring `--lp-indigo-*` / `--lp-blog-blue-*` legacy tokens. Every color, spacing, radius, shadow, and motion token can be copied straight from its specimen page.

The styleguide chrome (topbar, sidebar, page background) supports light and dark themes via the toggle in the topbar (`--sg-*` tokens); specimens inside the preview panel always render on the brand's light surfaces.
