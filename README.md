# Mario Lopez's website

Mario's software engineering blog and portfolio, built as a static Astro site
and deployed on Netlify.

## Development

Use the Node.js and npm versions declared in `.nvmrc` and `package.json`.

```shell
nvm use
npm ci
npm run dev
```

The development server is available at `http://localhost:4321`.

## Publishing a post

Add a directory to `content/blog` containing an `index.md` file and its local
images:

```text
content/blog/my-post/
├── index.md
└── featured-image.png
```

Required frontmatter:

```yaml
---
title: "Post title"
date: "2026-08-02T12:00:00.000Z"
description: "A concise summary for search results and social previews."
featuredImage: "featured-image.png"
---
```

Posts publish at `/blogs/<directory-name>/`. Netlify redirects the previous
root-level route to the canonical blog route.

## Verification

```shell
npm run typecheck
npm run build
npm run test:e2e
npm run audit:production
```

The production build is written to `dist`.
