# BioGenAI Solutions — website

A plain static site: hand-editable HTML, a few stylesheets, one JavaScript
module. No framework, no build step, no dependencies to install.

## Running it

Any static file server works. The pages link assets from the site root
(`/assets/...`), so serve `site/` as the document root rather than opening the
HTML files directly from disk:

```sh
cd site && python3 -m http.server 8000
# → http://localhost:8000
```

## Layout

```
site/                       ← this is what gets deployed
  index.html                English home page
  ar/ de/ es/ fr/ ko/       one home page per language,
  pt/ ru/ uk/ yue/ zh-CN/     each a full translation of index.html
  news/<slug>/index.html    7 news articles
  legal/  privacy/  terms/  standalone pages
  assets/
    css/global.css          base layer: tokens, typography, layout, sections
    css/variation-1.css     the active theme layer, loaded second and wins
    css/pages.css           extra styles for the article and legal pages
    js/main.js              all interactivity (see below)
    img/                    logos and section background images
docs/                       source Word documents the copy came from
```

Both stylesheets load on every page, `global.css` first. Anything in
`variation-1.css` overrides it, so that is usually the file to edit. The
article and legal pages also load `pages.css`.

## What the JavaScript does

`site/assets/js/main.js` is one ES module, loaded at the end of every page.
Sections are independent and each one no-ops when its markup is absent, so the
same file serves the home pages and the article pages:

- sticky navbar state, mobile menu, language dropdown
- reveal-on-scroll via `IntersectionObserver`
- the Solutions and Services card decks (`[data-deck]`) — arrows, dots,
  counter, keyboard arrows, swipe
- the Partners carousel (`[data-carousel]`) — arrows, dots, autoplay
- in-page search built from the section headings at load
- contact form validation and submission to Netlify Forms
- card highlighting when arriving at `#solution-3`, `#service-7`, …
- the footer year

## Editing content

Content lives in the HTML. A change to a section of the English home page has
to be repeated in the ten translated copies under `site/<lang>/index.html` if
it should apply to every language — there is no longer a shared template or a
CMS. The previous Astro setup (components, content JSON, Decap CMS, translation
pipeline) is kept on the `legacy` branch, under `_archive/`; its README there
covers how to restore it.

## Deploying

`netlify.toml` sets `publish = "site"` with no build command. Only `site/` is
uploaded, which keeps `docs/` off the web.

The contact form still works: Netlify Forms detects the `data-netlify="true"`
form in the deployed HTML, so it needs no build step. Only the English form is
marked, which keeps the submission field labels in one language.
