# BioGenAI Solutions — Website

Marketing site for BioGenAI Solutions, built with **Astro** (static site generation)
and **Decap CMS** for Git-based, no-code content editing.

## Tech stack

- **[Astro](https://astro.build)** — static site generator
- **[Decap CMS](https://decapcms.org)** — Git-based headless CMS at `/admin`
- **Netlify** — recommended hosting + Identity/Git Gateway for CMS auth

## Project structure

```
public/
  logo.png            # brand logo (favicon + UI)
  uploads/            # media uploaded via the CMS
  admin/
    index.html        # Decap CMS app
    config.yml        # CMS collections & fields
src/
  layouts/Layout.astro
  components/         # Navbar, Footer, LegalPage
  pages/
    index.astro       # the landing page
    news/[id].astro   # individual news articles
    legal | privacy | terms .astro
  content/
    site/*.json       # editable section content (hero, about, …)
    news/*.md         # news articles
  content.config.ts   # content collection schema
  styles/global.css   # brand design system
```

## Local development

```bash
npm install
npm run dev          # → http://localhost:4321
```

### Editing content locally (with the CMS UI)

Run the local CMS proxy in one terminal and the dev server in another:

```bash
npm run cms          # decap-server, the local Git backend proxy
npm run dev
```

Then open <http://localhost:4321/admin/index.html>. `local_backend: true` in
`public/admin/config.yml` makes Decap write directly to your working tree.

> **Local URL note:** in `npm run dev` you must use the full
> `/admin/index.html` path — Astro's dev server doesn't resolve a directory
> index for `public/` sub-folders. On the built site (`npm run preview` and
> Netlify) the short `/admin` URL works, thanks to the rewrite in `netlify.toml`.

## Build

```bash
npm run build        # outputs static site to dist/
npm run preview      # serve the production build locally
```

## Editable content

Everything below is editable from `/admin` — no code required:

| Collection        | What it controls                                            |
|-------------------|-------------------------------------------------------------|
| **News Articles** | Create/edit/publish posts (shown in the News section)       |
| General & Branding| Brand name, footer tagline, capabilities strip              |
| Hero Section      | Headline, subtitle, buttons, stats, tags                    |
| Solutions         | Solution cards (title, description, icon)                   |
| Services          | Service list                                                |
| Vision/Mission/…  | Vision, Mission, Philosophy statements                      |
| About Section     | Company copy, founder details, stats                        |
| Research Section  | Publication links                                           |
| Contact Section   | Heading, email, "Interested in" options, disclaimer         |

## Deploying to Netlify (CMS auth)

1. Push this repo to GitHub and connect it to a new Netlify site
   (build command `npm run build`, publish directory `dist` — already in `netlify.toml`).
2. In Netlify: **Site settings → Identity → Enable Identity**.
3. Under Identity → **Registration**, set to *Invite only* and invite the client's email.
4. Enable **Identity → Services → Git Gateway**.
5. The client logs in at `https://<your-site>/admin`, edits content, and clicks
   **Publish** — Decap commits to `main`, Netlify rebuilds, and the change goes live.

> Update the `site` value in `astro.config.mjs` and the `site_url`/`display_url`
> in `public/admin/config.yml` to the production domain before launch.

## Notes / follow-ups

- The **contact form** uses a `mailto:` action (opens the visitor's email client).
  For server-side submissions, switch to Netlify Forms or Formspree.
- **reCAPTCHA** shows the required notice; wire a real site key before launch.
- Legal/Privacy/Terms pages contain placeholder copy — have counsel review.
