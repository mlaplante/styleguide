# Blog UI Kit — La Plante Web Development

Hi-fi recreation of the blog at `michaellaplante.com/blog`. Sourced from `mlaplante/resumesite` — `blog-src/src/styles/blog.css` (styles) and `blog-src/src/content/posts/*.md` (real post titles/excerpts).

## Screens

- **Blog index** — sticky blue-gradient nav with brand and links, listing of posts with category pill + date + read-time.
- **Article** — title, meta, long-form article body with mono inline code, left-bar quotes, code blocks, 1px hairlines between sections.

## Components

`BlogNav.jsx`, `PostList.jsx`, `PostCard.jsx`, `Article.jsx`, `CategoryPill.jsx`.

Both light and dark modes supported (via `prefers-color-scheme: dark`).
