# Personal Technical Blog (Astro)

Production-ready personal technical blog built with Astro, TypeScript, TailwindCSS, and Markdown content collections.

## Stack

- Astro (static output)
- TypeScript
- TailwindCSS + Typography plugin
- Astro Content Collections (`src/content/blog`)
- RSS + Sitemap + JSON-LD SEO
- Local newsletter capture (single local storage file)
- Static output compatible with Vercel hosting

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Add a New Post

1. Create a new Markdown file inside `src/content/blog/`.
2. Include required frontmatter:

```yaml
title:
description:
publishedDate:
updatedDate:
author:
tags:
category:
featuredImage:
draft:
featured:
```

3. For local featured images, store assets near the post and reference with a relative path:

```yaml
featuredImage: ./images/your-image.png
```

4. Set `draft: true` to keep a post in development. Drafts are excluded from production builds.
5. Set `featured: true` to include a post in the homepage featured section.

## Configure Newsletter

Newsletter emails are stored locally in one key:

- `newsletter-subscribers.json` (browser `localStorage`)

Behavior:

- validates email format
- saves into a single list
- if email already exists, it does nothing

## Deploy to Vercel

1. Push repository to Git provider.
2. Import project in Vercel.
3. Build command: `npm run build`
4. Output directory: `dist`

The project uses pure static output (`dist/`) and can be deployed directly on Vercel.
