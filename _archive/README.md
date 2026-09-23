# Archive — the Astro setup this site replaced

Nothing in this folder is served. `netlify.toml` publishes `site/` only.

The site used to be built by Astro from components plus JSON/Markdown content.
The pages in `site/` are that build's output, taken as the new source of truth
and converted to plain HTML, CSS and JS. Everything Astro needed is kept here
rather than deleted, because some of it is not recoverable from the live site.

## What is here

| Path | What it was |
| --- | --- |
| `astro-src/` | the components, layouts, pages, i18n helpers and `content.config.ts` |
| `content/i18n/*.json` | all page copy, one file per language — the source the 11 home pages were generated from |
| `content/news/*.md` | the news articles, including translations that were never published |
| `cms/admin/` | the Decap CMS panel and its `config.yml` |
| `cms/uploads/` | CMS media uploads |
| `translate/` | the OpenAI translation pipeline (`npm run translate`) |
| `translate-content.yml` | the GitHub Action that ran that pipeline |
| `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json` | the toolchain |
| `old-backgrounds/` | unreferenced earlier versions of three section background images |

## Why the CMS is not just disabled

Decap CMS commits edits to this repository. Astro then rebuilt the site from
those files. With no build step, editing content here changes nothing that gets
served — the HTML in `site/` is now the source. The panel was archived rather
than left in place so it cannot look like it still publishes.

The same applies to `content/i18n/*.json` and `content/news/*.md`: they are a
snapshot of the copy as it stood at conversion, useful for reference and for
restoring the pipeline, but no longer wired to anything.

## Restoring the pipeline

`astro-src/` is the final state of the components, including every change made
after the last commit, so a restore does not lose design work:

1. `git mv _archive/astro-src src`, and move `content/` back to `src/content`,
   `cms/admin` to `public/admin`, `cms/uploads` to `public/uploads`,
   `translate/` to `scripts/translate`.
2. Move `astro.config.mjs`, `package.json`, `package-lock.json` and
   `tsconfig.json` back to the repository root.
3. Move `assets/css/global.css` and `assets/css/variation-1.css` to
   `src/styles/`, and `assets/img/*` back to `public/` — the components
   reference the flat `/logo.png` style paths, not `/assets/img/`.
4. Restore the inline `<script>` in `layouts/Layout.astro`; it is the same code
   as `site/assets/js/main.js`, with TypeScript annotations.
5. Put back `command = "npm run build"` and `publish = "dist"` in
   `netlify.toml`, re-add the `dist/`, `.astro/` and `node_modules/` ignore
   rules, and restore the Netlify Identity widget in the layout `<head>` if the
   CMS login is wanted again.
6. `npm install && npm run build`.

After that, `site/` is generated output again and can be deleted.
