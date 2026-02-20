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
2. Fastest workflow:

```bash
cp src/content/blog/_template.md src/content/blog/my-new-post.md
```

3. Minimum frontmatter you must provide:

```yaml
title:
description:
publishedDate: 2026-02-20
```

4. Common optional fields:

```yaml
category: General
tags:
  - Frontend
  - Performance
draft: false
updatedDate: 2026-02-20
featuredImage: ./images/cover.png
author: Bibek Joshi
```

5. For local featured images (optional), store assets near the post and reference with a relative path:

```yaml
featuredImage: ./images/your-image.png
```

6. Set `draft: true` to keep a post in development. Drafts are excluded from production builds.
7. Homepage featured section automatically uses the latest 3 published posts.

## Post Schema

Schema is intentionally small and practical for normal guide-style blogging.

- Required: `title`, `description`, `publishedDate`
- Recommended: `category`, `tags`, `draft`
- Optional: `updatedDate`, `author`, `featuredImage`, `draft`

Defaults:

- `author`: `Bibek Joshi`
- `category`: `General`
- `tags`: `[]`
- `draft`: `false`

Validation and quality rules:

- `updatedDate` must be on or after `publishedDate`
- `tags` supports array values or comma-separated text
- tags are trimmed and deduplicated automatically

## Configure Newsletter

Newsletter emails are stored locally in one key:

- `newsletter-subscribers.json` (browser `localStorage`)

Behavior:

- validates email format
- saves into a single list
- if email already exists, it does nothing

## Environment Variables

No `.env` file is required for local development, build, or deploy.

## Deploy to Vercel

1. Push repository to Git provider.
2. Import project in Vercel.
3. Build command: `npm run build`
4. Output directory: `dist`

The project uses pure static output (`dist/`) and can be deployed directly on Vercel.
