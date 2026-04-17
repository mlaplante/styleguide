# Styleguide Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the La Plante Web Dev Design System bundle as a curated Astro docs site at `styleguide.michaellaplante.com` on Cloudflare Pages.

**Architecture:** Astro static site generated at repo root. Original `project/` bundle preserved as the design source of truth. Each preview HTML ported to a native `.astro` page wrapped in a shared `DocsLayout` with grouped sidebar navigation. Deployed via Cloudflare Pages Git integration.

**Tech Stack:** Astro (static output), Node 20, Cloudflare Pages, GitHub (`mlaplante/styleguide`).

**Testing note:** Per the spec, visual review is the acceptance test for this styleguide — no unit tests. Each task's verification step is `npm run build` + a local dev-server visual check.

---

## File Structure

**Created at repo root:**

- `package.json`, `astro.config.mjs`, `tsconfig.json` — Astro scaffolding
- `.gitignore` — Astro defaults (`node_modules/`, `dist/`, `.astro/`)
- `src/styles/global.css` — global tokens adapted from `project/colors_and_type.css`
- `src/layouts/DocsLayout.astro` — two-column shell (sidebar + topbar + slot)
- `src/components/Sidebar.astro` — grouped navigation
- `src/pages/index.astro` — landing page
- `src/pages/colors/{primary,accent-palette,neutrals}.astro`
- `src/pages/type/{hero,headings,body,eyebrow}.astro`
- `src/pages/spacing/{scale,radii,shadows}.astro`
- `src/pages/components/{buttons,input,blog-nav,post-card,service,timeline}.astro`
- `src/pages/ui-kits/{blog,portfolio}.astro`
- `public/assets/**` — copied from `project/assets/` and `project/uploads/`
- `README.md` — project-level overview (replaces current handoff README content; keep handoff note inside a section)

**Preserved untouched:** `project/` (original bundle)

---

## Task 1: Scaffold Astro at repo root

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/pages/index.astro` (minimal placeholder)
- Create: `src/env.d.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "styleguide",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^4.16.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://styleguide.michaellaplante.com',
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.DS_Store
.env
.env.*
!.env.example
```

- [ ] **Step 5: Create `src/env.d.ts`**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 6: Create placeholder `src/pages/index.astro`**

```astro
---
---
<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Styleguide</title></head>
  <body><h1>Scaffold OK</h1></body>
</html>
```

- [ ] **Step 7: Install and verify build**

Run: `npm install && npm run build`
Expected: Exits 0. `dist/index.html` exists.

- [ ] **Step 8: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json .gitignore src/env.d.ts src/pages/index.astro
git commit -m "Scaffold Astro project"
```

---

## Task 2: Copy assets into `public/`

**Files:**
- Create: `public/assets/**` (mirrors `project/assets/` and `project/uploads/`)

- [ ] **Step 1: Copy assets**

Run:
```bash
mkdir -p public/assets
cp -R project/assets/. public/assets/
cp -R project/uploads/. public/assets/
```

- [ ] **Step 2: Verify**

Run: `ls public/assets | head`
Expected: lists asset files.

- [ ] **Step 3: Commit**

```bash
git add public/assets
git commit -m "Copy design bundle assets into public/"
```

---

## Task 3: Port global tokens to `src/styles/global.css`

**Files:**
- Create: `src/styles/global.css`

The source `project/colors_and_type.css` defines CSS custom properties (`--lp-*`) used by every preview. The previews reference it via `<link rel="stylesheet" href="../colors_and_type.css">`; in Astro we load it once in `DocsLayout.astro` (Task 4).

- [ ] **Step 1: Copy tokens file verbatim**

Run:
```bash
cp project/colors_and_type.css src/styles/global.css
```

- [ ] **Step 2: Verify no asset-path rewrites are needed**

Run: `grep -n 'url(' src/styles/global.css || echo "no url() references"`
Expected: either no results, or any `url(...)` references point to files now available under `/assets/...`. If any reference uses a relative path like `./assets/...` or `../assets/...`, edit the file to use absolute `/assets/...` (Astro serves `public/` at root).

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "Import design tokens as global stylesheet"
```

---

## Task 4: Build `DocsLayout.astro`

**Files:**
- Create: `src/layouts/DocsLayout.astro`

- [ ] **Step 1: Create the layout**

```astro
---
import '../styles/global.css';
import Sidebar from '../components/Sidebar.astro';

export interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
const pageTitle = `${title} — La Plante Web Dev Style Guide`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    {description && <meta name="description" content={description} />}
    <link rel="icon" href="/assets/favicon.ico" />
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="/">La Plante Web Dev — Style Guide</a>
      <a class="home" href="https://michaellaplante.com" rel="noopener">michaellaplante.com ↗</a>
    </header>
    <div class="shell">
      <Sidebar />
      <main class="content">
        <header class="page-head">
          <h1>{title}</h1>
          {description && <p class="lede">{description}</p>}
        </header>
        <section class="preview">
          <slot />
        </section>
      </main>
    </div>

    <style>
      :root { --sidebar-w: 260px; --topbar-h: 56px; }
      * { box-sizing: border-box; }
      body { margin: 0; background: #fff; color: var(--lp-fg-1, #111); font-family: var(--lp-font-display, system-ui, sans-serif); }
      .topbar {
        position: sticky; top: 0; z-index: 10;
        display: flex; align-items: center; justify-content: space-between;
        height: var(--topbar-h); padding: 0 20px;
        background: #fff; border-bottom: 1px solid #e5e7eb;
      }
      .brand { font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; color: inherit; text-decoration: none; }
      .home { font-size: 12px; color: #6b7280; text-decoration: none; }
      .shell { display: grid; grid-template-columns: var(--sidebar-w) 1fr; min-height: calc(100vh - var(--topbar-h)); }
      .content { padding: 32px 40px 80px; max-width: 1100px; }
      .page-head h1 { font-size: 28px; margin: 0 0 8px; }
      .lede { color: #6b7280; margin: 0 0 32px; font-size: 15px; }
      .preview { border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px; background: #fff; }

      @media (max-width: 768px) {
        .shell { grid-template-columns: 1fr; }
      }
    </style>
  </body>
</html>
```

- [ ] **Step 2: Build (will fail — Sidebar doesn't exist yet)**

Run: `npm run build`
Expected: Error about missing `Sidebar` import. Continue to Task 5.

---

## Task 5: Build `Sidebar.astro`

**Files:**
- Create: `src/components/Sidebar.astro`

- [ ] **Step 1: Create the sidebar**

```astro
---
const groups = [
  {
    title: 'Foundations',
    items: [
      { href: '/colors/primary', label: 'Colors — Primary' },
      { href: '/colors/accent-palette', label: 'Colors — Accent Palette' },
      { href: '/colors/neutrals', label: 'Colors — Neutrals' },
      { href: '/type/hero', label: 'Type — Hero' },
      { href: '/type/headings', label: 'Type — Headings' },
      { href: '/type/body', label: 'Type — Body' },
      { href: '/type/eyebrow', label: 'Type — Eyebrow' },
      { href: '/spacing/scale', label: 'Spacing — Scale' },
      { href: '/spacing/radii', label: 'Spacing — Radii' },
      { href: '/spacing/shadows', label: 'Spacing — Shadows' },
    ],
  },
  {
    title: 'Components',
    items: [
      { href: '/components/buttons', label: 'Buttons' },
      { href: '/components/input', label: 'Input' },
      { href: '/components/blog-nav', label: 'Blog Nav' },
      { href: '/components/post-card', label: 'Post Card' },
      { href: '/components/service', label: 'Service' },
      { href: '/components/timeline', label: 'Timeline' },
    ],
  },
  {
    title: 'UI Kits',
    items: [
      { href: '/ui-kits/blog', label: 'Blog' },
      { href: '/ui-kits/portfolio', label: 'Portfolio' },
    ],
  },
];

const current = Astro.url.pathname.replace(/\/$/, '');
---
<aside class="sidebar">
  <nav>
    {groups.map((g) => (
      <section>
        <h2>{g.title}</h2>
        <ul>
          {g.items.map((it) => {
            const active = current === it.href;
            return (
              <li>
                <a href={it.href} class={active ? 'active' : ''}>{it.label}</a>
              </li>
            );
          })}
        </ul>
      </section>
    ))}
  </nav>
</aside>

<style>
  .sidebar {
    border-right: 1px solid #e5e7eb;
    padding: 24px 16px;
    background: #fafafa;
    position: sticky;
    top: var(--topbar-h);
    align-self: start;
    max-height: calc(100vh - var(--topbar-h));
    overflow-y: auto;
  }
  nav section + section { margin-top: 24px; }
  h2 {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #9ca3af;
    margin: 0 0 8px 8px;
    font-weight: 700;
  }
  ul { list-style: none; margin: 0; padding: 0; }
  li { margin: 0; }
  a {
    display: block;
    padding: 6px 8px;
    border-radius: 6px;
    color: #374151;
    text-decoration: none;
    font-size: 13px;
  }
  a:hover { background: #f0f0f0; }
  a.active { background: #111; color: #fff; }

  @media (max-width: 768px) {
    .sidebar { position: static; max-height: none; border-right: none; border-bottom: 1px solid #e5e7eb; }
  }
</style>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Exits 0. Sidebar renders (but pages don't exist yet — they'll 404 on click, that's fine).

- [ ] **Step 3: Commit**

```bash
git add src/layouts/DocsLayout.astro src/components/Sidebar.astro
git commit -m "Add DocsLayout and Sidebar"
```

---

## Task 6: Landing page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace placeholder with landing page**

```astro
---
import DocsLayout from '../layouts/DocsLayout.astro';

const sections = [
  { href: '/colors/primary', title: 'Colors', blurb: 'Primary, accent, and neutral palettes.' },
  { href: '/type/hero', title: 'Type', blurb: 'Hero, headings, body, and eyebrow specimens.' },
  { href: '/spacing/scale', title: 'Spacing', blurb: 'Scale, radii, and elevation tokens.' },
  { href: '/components/buttons', title: 'Components', blurb: 'Buttons, inputs, cards, and more.' },
  { href: '/ui-kits/blog', title: 'UI Kits', blurb: 'Full blog and portfolio compositions.' },
];
---
<DocsLayout title="Style Guide" description="The La Plante Web Dev design system.">
  <div class="grid">
    {sections.map((s) => (
      <a class="card" href={s.href}>
        <h3>{s.title}</h3>
        <p>{s.blurb}</p>
      </a>
    ))}
  </div>
</DocsLayout>

<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .card {
    display: block;
    padding: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    text-decoration: none;
    color: inherit;
    background: #fff;
  }
  .card:hover { border-color: #111; }
  .card h3 { margin: 0 0 6px; font-size: 18px; }
  .card p { margin: 0; color: #6b7280; font-size: 14px; }
</style>
```

- [ ] **Step 2: Build + dev-server visual check**

Run: `npm run build && npm run dev`
Visit: http://localhost:4321/
Expected: Topbar, sidebar on left, card grid with 5 cards. Clicking cards navigates to unfound routes (expected — they'll be built next).

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Build landing page"
```

---

## Task 7: Port Colors pages

**Source files:** `project/preview/colors-{primary,accent-palette,neutrals}.html`

**Files:**
- Create: `src/pages/colors/primary.astro`
- Create: `src/pages/colors/accent-palette.astro`
- Create: `src/pages/colors/neutrals.astro`

**Porting recipe (apply to every ported page in Tasks 7–12):**

1. Open the source `.html` file under `project/preview/`.
2. Copy everything inside `<body>...</body>` — that becomes the Astro page slot content.
3. Copy the page-specific `<style>...</style>` block from inside `<head>` — paste as a scoped `<style>` block at the bottom of the `.astro` file.
4. Skip the `<link rel="stylesheet" href="../colors_and_type.css">` — the layout loads it.
5. Rewrite any `src="../assets/..."` or `src="../uploads/..."` image paths to `/assets/...`.
6. Wrap the body content in `<DocsLayout title="..." description="...">`.

- [ ] **Step 1: Create `src/pages/colors/primary.astro`**

Apply the porting recipe to `project/preview/colors-primary.html`.

Skeleton:
```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro';
---
<DocsLayout title="Colors — Primary" description="Primary brand palette.">
  <!-- paste body content from project/preview/colors-primary.html here -->
</DocsLayout>

<style>
  /* paste the per-page <style> block from colors-primary.html here */
</style>
```

- [ ] **Step 2: Create `src/pages/colors/accent-palette.astro`**

Same recipe, source `project/preview/colors-accent-palette.html`, `title="Colors — Accent Palette"`.

- [ ] **Step 3: Create `src/pages/colors/neutrals.astro`**

Same recipe, source `project/preview/colors-neutrals.html`, `title="Colors — Neutrals"`.

- [ ] **Step 4: Build + visual check**

Run: `npm run build && npm run dev`
Visit each of:
- http://localhost:4321/colors/primary
- http://localhost:4321/colors/accent-palette
- http://localhost:4321/colors/neutrals

Expected: Each shows the swatch grid from the source file, wrapped in the sidebar/topbar chrome.

- [ ] **Step 5: Commit**

```bash
git add src/pages/colors
git commit -m "Port Colors preview pages"
```

---

## Task 8: Port Type pages

**Source files:** `project/preview/type-{hero,headings,body,eyebrow}.html`

**Files:**
- Create: `src/pages/type/hero.astro`
- Create: `src/pages/type/headings.astro`
- Create: `src/pages/type/body.astro`
- Create: `src/pages/type/eyebrow.astro`

- [ ] **Step 1: Create each page** using the porting recipe from Task 7.

Titles:
- `hero.astro` → "Type — Hero"
- `headings.astro` → "Type — Headings"
- `body.astro` → "Type — Body"
- `eyebrow.astro` → "Type — Eyebrow"

Import path: `import DocsLayout from '../../layouts/DocsLayout.astro';`

- [ ] **Step 2: Build + visual check**

Run: `npm run build && npm run dev`
Visit `/type/hero`, `/type/headings`, `/type/body`, `/type/eyebrow`.
Expected: Type specimens render, sidebar item highlighted.

- [ ] **Step 3: Commit**

```bash
git add src/pages/type
git commit -m "Port Type preview pages"
```

---

## Task 9: Port Spacing pages

**Source files:** `project/preview/spacing-{scale,radii,shadows}.html`

**Files:**
- Create: `src/pages/spacing/scale.astro`
- Create: `src/pages/spacing/radii.astro`
- Create: `src/pages/spacing/shadows.astro`

- [ ] **Step 1: Create each page** using the porting recipe from Task 7.

Titles: "Spacing — Scale", "Spacing — Radii", "Spacing — Shadows".

- [ ] **Step 2: Build + visual check**

Run: `npm run build && npm run dev`
Visit `/spacing/scale`, `/spacing/radii`, `/spacing/shadows`.
Expected: Spacing/radii/shadow specimens render.

- [ ] **Step 3: Commit**

```bash
git add src/pages/spacing
git commit -m "Port Spacing preview pages"
```

---

## Task 10: Port Components pages

**Source files:** `project/preview/components-{buttons,input,blog-nav,post-card,service,timeline}.html`

**Files:**
- Create: `src/pages/components/buttons.astro`
- Create: `src/pages/components/input.astro`
- Create: `src/pages/components/blog-nav.astro`
- Create: `src/pages/components/post-card.astro`
- Create: `src/pages/components/service.astro`
- Create: `src/pages/components/timeline.astro`

- [ ] **Step 1: Create each page** using the porting recipe from Task 7.

Titles: "Buttons", "Input", "Blog Nav", "Post Card", "Service", "Timeline".

- [ ] **Step 2: Build + visual check**

Run: `npm run build && npm run dev`
Visit each `/components/*` route.
Expected: Component previews render correctly.

- [ ] **Step 3: Commit**

```bash
git add src/pages/components
git commit -m "Port Components preview pages"
```

---

## Task 11: Port UI Kits

**Source files:**
- `project/ui_kits/blog/index.html` + `project/ui_kits/blog/blog.css`
- `project/ui_kits/portfolio/index.html` + `project/ui_kits/portfolio/portfolio.css`

These are larger than the previews. Same porting approach, but:
- Copy the per-kit CSS file into `public/assets/` as `blog.css` / `portfolio.css`, then reference via `<link rel="stylesheet" href="/assets/blog.css">` inside the Astro page's frontmatter-rendered `<slot>` head snippet. Simpler: inline the CSS file contents into the page's `<style>` block.
- The kits may have inline `src="./..."` image paths — rewrite to `/assets/...`.

**Files:**
- Create: `src/pages/ui-kits/blog.astro`
- Create: `src/pages/ui-kits/portfolio.astro`

- [ ] **Step 1: Create `src/pages/ui-kits/blog.astro`**

Recipe:
1. Copy `<body>` content from `project/ui_kits/blog/index.html`.
2. Inline the contents of `project/ui_kits/blog/blog.css` into the page's `<style>` block.
3. Rewrite any relative asset paths to `/assets/...` (ensure referenced images are in `public/assets/`; copy them in if missing).

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro';
---
<DocsLayout title="UI Kit — Blog" description="Full blog composition.">
  <!-- paste body content -->
</DocsLayout>

<style is:global>
  /* paste contents of project/ui_kits/blog/blog.css here */
</style>
```

Note: `is:global` because these kit styles are written as plain class selectors expected to apply to the kit markup.

- [ ] **Step 2: Create `src/pages/ui-kits/portfolio.astro`**

Same recipe, source `project/ui_kits/portfolio/index.html` + `portfolio.css`, `title="UI Kit — Portfolio"`.

- [ ] **Step 3: Build + visual check**

Run: `npm run build && npm run dev`
Visit `/ui-kits/blog` and `/ui-kits/portfolio`.
Expected: Full-page kits render. Compare against opening the original `project/ui_kits/*/index.html` directly in the browser — layout should match.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ui-kits public/assets
git commit -m "Port UI Kits"
```

---

## Task 12: Full pre-flight verification

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: Exits 0. No warnings about missing pages or broken imports.

- [ ] **Step 2: Preview the production build**

Run: `npm run preview`
Visit: http://localhost:4321/

Checklist:
- [ ] Landing page loads, 5 cards visible
- [ ] Click every sidebar item — each loads, active state highlights correctly
- [ ] No console errors in devtools
- [ ] Resize to < 768px — sidebar moves to top
- [ ] All assets (images, fonts) load (no 404s in Network tab)

- [ ] **Step 3: Fix anything that breaks**, re-run Step 1–2 until clean.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "Fix preflight issues" # only if changes
```

---

## Task 13: Push to GitHub

- [ ] **Step 1: Add remote (if not already set)**

Run:
```bash
git remote -v
```

If no `origin` pointing at `https://github.com/mlaplante/styleguide.git`, run:
```bash
git remote add origin https://github.com/mlaplante/styleguide.git
```

- [ ] **Step 2: Push**

Run: `git push -u origin main`
Expected: Successful push. Branch tracks `origin/main`.

---

## Task 14: Cloudflare Pages setup (user-driven, guided)

This task is performed by the user in the Cloudflare dashboard. The agent should pause here and walk the user through each step, waiting for confirmation before moving on.

- [ ] **Step 1:** User goes to Cloudflare dashboard → Workers & Pages → Create application → Pages → Connect to Git.

- [ ] **Step 2:** User authorizes Cloudflare's GitHub app for the `mlaplante/styleguide` repo.

- [ ] **Step 3:** User configures build settings:
  - Production branch: `main`
  - Framework preset: **Astro**
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Root directory: (blank)
  - Environment variables: `NODE_VERSION=20`

- [ ] **Step 4:** User clicks *Save and Deploy*. Wait for build to complete. Confirm the `*.pages.dev` URL loads and the site looks correct.

- [ ] **Step 5:** User adds custom domain — Pages project → Custom domains → Add `styleguide.michaellaplante.com`. Since `michaellaplante.com` is on Cloudflare DNS, confirm the CNAME is auto-created. Wait for HTTPS certificate to issue.

- [ ] **Step 6:** User visits https://styleguide.michaellaplante.com and confirms the site loads over HTTPS with valid cert.

---

## Done

Site deployed to `styleguide.michaellaplante.com`. Any push to `main` triggers a redeploy; pushes to other branches get preview URLs automatically.
