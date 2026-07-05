---
name: styleguide-docs-and-writing
description: Use when adding or renaming a styleguide page or component and needing to know which docs of record must be updated (README.md, src/data/nav.ts, CodeSnippet blocks); when README.md, nav.ts, or a component's code snippet look out of sync with the actual src/pages or src/components/brand files; when writing or editing any prose in this repo (README, page copy, PR descriptions) and needing house style/casing rules; when writing user-facing copy for a specimen page and needing brand-voice guardrails; when touching public/robots.txt, sitemap behavior, or astro.config.mjs's site field and needing to check external positioning against michaellaplante.com; when a claim, stat, or feature description in this repo's docs looks unproven or overstated; or when investigating why a doc says one Astro/dependency version while package-lock.json resolves another. Symptoms/keywords: stale README, docs drift, nav.ts out of sync, sidebar missing a page, landing grid missing a card, CodeSnippet doesn't match rendered markup, over-claiming, unproven stat, robots.txt, sitemap-index.xml, site field, brand.michaellaplante.com vs michaellaplante.com consistency.
---

# Styleguide docs and writing

Owns the docs of record (`README.md`, `src/data/nav.ts`, `CodeSnippet` blocks), house
writing style for this repo's own prose, and external positioning (this site is the public
brand face at `brand.michaellaplante.com` and must stay consistent with `michaellaplante.com`
and not over-claim). Does not own brand voice *doctrine* (palette/casing/tone rules) or the
token/class catalog — see cross-refs below.

## When NOT to use this skill

| If you need... | Use instead |
|---|---|
| The full brand voice/casing/palette doctrine (not just a pointer to it) | `laplante-brand-reference` |
| The token/class catalog (`--lp-*`, `--sg-*`, `lp-*`, `sg-*`) | `styleguide-design-tokens-reference` |
| Whether a change is safe to merge, or the non-negotiables list with rationale | `styleguide-change-control` |
| Why the repo is structured this way (3-layer lineage, CSP rationale, etc.) | `styleguide-architecture-contract` |
| dev/build/preview commands, CF Pages deploy mechanics, `_headers`/robots/sitemap *behavior* | `styleguide-run-and-operate` |
| Historical investigations / upgrade incidents | `styleguide-failure-archaeology` |
| Recreating the toolchain, engines, config file contents | `styleguide-build-and-env` |

Any change you make as a result of this skill (editing `nav.ts`, `README.md`,
`public/robots.txt`, `astro.config.mjs`) is a real change to a live docs-of-record file —
route it through `styleguide-change-control` before it lands on `main` like any other change.
This skill tells you *what* to keep in sync and *how to write it*; it does not grant a bypass
of the merge gate.

## 1. Adding a page — docs-of-record checklist

Reproduced and verified against `README.md` "Adding a page" (as of 2026-07-05):

1. Create `src/pages/<group>/<name>.astro` using scoped `<style>` — never `is:global` (selectors
   must not leak; see `styleguide-architecture-contract` for why).
2. **Register it in `src/data/nav.ts`** — this file is the single source of truth for both:
   - the `nav` array (sidebar groups: `Foundations`, `Components`, `UI Kits` as of 2026-07-05),
   - the `landing` array (the landing-page card grid, keyed by `visual` type:
     `'logo' | 'colors' | 'type' | 'spacing' | 'motion' | 'components' | 'ui-kits'`).
   One edit to `nav.ts` updates the sidebar AND the landing grid — do not hand-edit either
   surface separately. Adding a page to a group already represented in `landing` (e.g. a new
   `components/*` page) usually needs only a `nav` entry, not a new `landing` entry.
3. Use `var(--lp-*)` tokens (never raw hex/px) and `sg-*` scaffolding classes for preview
   chrome (`sg-row`, `sg-meta`, `sg-stack`, `sg-swatch`, etc.).
4. Update `README.md`'s "What's in the repo" bullet list if the new page changes the shape of
   a directory (e.g. a new top-level group under `src/pages/`).

## 2. Adding or changing a component — docs-of-record checklist

Reproduced and verified against `README.md` "Adding or changing a component" (as of 2026-07-05):

1. Component CSS lives **once**, in `src/styles/components.css` (`lp-*` classes) — this is the
   portable layer. Do not add component CSS anywhere else.
2. Thin Astro wrappers in `src/components/brand/` (`Button.astro`, `PostCard.astro`,
   `ServiceCard.astro`, `Timeline.astro`, `BlogNav.astro`, `FloatingField.astro`,
   `Callout.astro`) render the canonical markup that both the `components/*` specimen pages
   and the `ui-kits/*` compositions consume.
3. **When you change markup, update the matching `CodeSnippet` on that component's page in the
   same commit.** Verified pattern (`src/pages/components/buttons.astro`):
   ```astro
   ---
   import CodeSnippet from '../../components/CodeSnippet.astro';
   const snippet = `<a class="lp-btn" href="#">Schedule a Consultation</a>
   <!-- Styles: .lp-btn in src/styles/components.css -->`;
   ---
   <CodeSnippet code={snippet} />
   ```
   `CodeSnippet.astro` (19 lines) takes `code: string` and optional `label` (default `'HTML'`),
   and renders a `<details class="sg-code">` with a copy button (`data-copy={code}`) wired to
   the delegated copy handler in `DocsLayout.astro`. The snippet string is hand-authored prose,
   not generated from the rendered component — if you change the component's real markup, the
   snippet string will silently go stale unless you edit it too. **This is the #1 source of
   docs drift in this repo; treat it as a required step, not optional polish.**
4. If the change affects the CSP-relevant surface (e.g. adds an external asset reference),
   stop and route through `styleguide-change-control` — do not resolve it here.

## 3. House style for this repo's own docs

- Imperative/descriptive prose, not marketing copy — `README.md`, code comments, and
  `CodeSnippet` labels describe a design system to engineers; they are not brand-voice copy.
- Keep `README.md`'s "What's in the repo" bullet list matching the actual `src/` directory
  shape — add/remove/rename a top-level directory, update the matching bullet in the same PR.
- Don't restate token values or class inventories in prose docs — link to
  `styleguide-design-tokens-reference` or the source file instead of copy-pasting a table that
  will drift. `README.md` already does this correctly today.
- For user-facing copy on a specimen page (labels, blurbs, eyebrow text) meant to demonstrate
  the live brand voice: don't invent new brand copy — the doctrine (voice, casing, tone
  examples) lives in `laplante-brand-reference`; cross-reference it rather than re-deriving
  casing/voice rules here.

## 4. External positioning — this site IS the public brand face

`brand.michaellaplante.com` (this repo, `astro.config.mjs` `site:` field) is a public-facing
sibling of `michaellaplante.com` (the `resumesite` product this documents, not in this repo —
see `styleguide-architecture-contract` for the 3-layer lineage). Keep them consistent:

- **`astro.config.mjs`** (7 lines, verified) sets `site: 'https://brand.michaellaplante.com'`
  and adds only the `@astrojs/sitemap` integration — no other config. The `site` field is what
  the sitemap integration uses to emit absolute URLs; if the deployed domain ever changes, this
  is the file to update, and it's a `styleguide-change-control`-gated change (it changes build
  output for every page).
- **`public/robots.txt`** (verified, 4 lines):
  ```
  User-agent: *
  Allow: /
  
  Sitemap: https://brand.michaellaplante.com/sitemap-index.xml
  ```
  This is a blanket allow for all user agents, with no AI-training-bot-specific rules. If asked
  to add AI-crawler-specific directives (block/allow specific bots for training vs. retrieval),
  cross-reference skill `robots-txt-ai-bots-training-vs-retrieval` for the policy distinction —
  and route the actual edit through `styleguide-change-control`, since it changes crawl behavior
  for a live public site.
- **Sitemap** is generated by the `@astrojs/sitemap()` integration at build time
  (`dist/sitemap-index.xml`, `dist/sitemap-0.xml`) — there is no hand-maintained sitemap file to
  edit. Don't hand-author a sitemap.
- **No over-claiming.** This repo's own copy (page descriptions, blurbs) should describe what
  the styleguide actually contains — not aspirational features. If you're tempted to write a
  claim this repo can't back up (a metric, a capability, a "coming soon"), label it
  `candidate`/`open` rather than asserting it as fact.

## 5. Cautionary example: the Astro-6-vs-7 doc drift (verified, live in this repo's history)

This is a **real, already-happened** case of docs going stale — use it as the reference story
when explaining why re-sync matters, and follow the re-sync procedure below whenever you find
a similar mismatch.

**What happened (verified via `git log`/`git show`, 2026-07-05):**
- Commit `c511b8d` ("fix(ci): require Node >=22.12.0 for Astro 6") was accurate when written —
  at that commit, `package.json` genuinely pinned `"astro": "^6.4.6"`.
- Commit `be4d2c9` later bumped `astro` from `^6.4.6` to `^7.0.0` ("Bump astro ^6.4.6 -> ^7.0.0
  via npm-check-updates. Build verified locally").
- Commit `9432bab` (the automated weekly deps PR, `chore(deps): update all packages to latest`)
  bumped it further; `package-lock.json` today resolves **`astro` 7.0.3**.
- Nothing re-worded the now-historical commit message (git history is immutable by design —
  that's expected and fine), but this is the exact failure shape to watch for in **live,
  editable prose**: a true-at-write-time statement about a dependency major version silently
  outliving its accuracy as the weekly auto-deps workflow (`.github/workflows/update-dependencies.yml`)
  advances the dependency past it, with no step in that workflow that checks prose docs for
  stale version claims.

**Re-sync procedure — run this whenever a doc states a version/count/size and you're not sure
it's current:**

1. Find the current resolved value in the actual source of truth, not prose:
   - Astro version: `grep -A2 '"node_modules/astro"' package-lock.json | grep version`
   - Page count: `npm run build 2>&1 | grep "page(s) built"`
   - Node engine floor: `grep -A2 '"engines"' package.json`
2. `grep -rn "Astro [0-9]" README.md src/ project/README.md` (or the relevant term) to find
   every place a version/count is asserted in editable prose.
3. If a mismatch is found in a **live editable file** (README.md, a page's description, a
   comment) — fix it in the same PR as whatever change you're already making, or open a small
   dedicated docs-fix PR. Do not fix it by editing old commit messages.
4. If the mismatch is only in historical commit messages, leave it — that's expected and not a
   bug; call it out in a PR description if relevant, but don't rewrite history.
5. Any resulting file edit still routes through `styleguide-change-control` like any other
   change (README/config edits are visible, low-risk changes, but they're still changes).

## Provenance and maintenance

Facts below verified 2026-07-05 against this repo's working tree (`skills` branch). Re-verify
before trusting them if time has passed:

| Fact | Re-verify with |
|---|---|
| Resolved Astro version (7.0.3 as of 2026-07-05) | `grep -A2 '"node_modules/astro"' package-lock.json \| grep version` |
| `README.md` "Adding a page" / "Adding or changing a component" steps still match this text | `git diff HEAD -- README.md` (after reading current file) |
| `nav.ts` groups (`Foundations`, `Components`, `UI Kits`) and `landing` visual keys | `cat src/data/nav.ts` |
| `CodeSnippet.astro` prop shape (`code`, `label = 'HTML'`) | `cat src/components/CodeSnippet.astro` |
| `astro.config.mjs` `site:` value and integrations | `cat astro.config.mjs` |
| `public/robots.txt` contents | `cat public/robots.txt` |
| Astro-6→7 bump commit history cited above | `git log --oneline -- package.json` |
| Page count (golden inventory, owned by `styleguide-validation-and-qa`) | `npm run build 2>&1 | grep "page(s) built"` |
