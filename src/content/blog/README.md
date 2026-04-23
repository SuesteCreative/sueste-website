# Blog Content

How the blog works on this site — for anyone (human or Claude) topping up content.

## The system is not auto-generating

`.github/workflows/scheduled-publish.yml` runs daily at 07:00 UTC and triggers a Cloudflare redeploy via a webhook. It does **not** generate or write posts. It only causes the site to rebuild so that posts whose `pubDate` has arrived become visible.

The actual "reveal when pubDate arrives" filter lives in `src/pages/blog/index.astro` and `src/pages/en/blog/index.astro` — both filter with `pubDate <= now` before rendering the listing and the dynamic `[slug]` pages.

So: posts are human-written markdown files. Drop one here with a future `pubDate` and it appears automatically on that date.

## Cadence target

One **PT + EN pair** published every ~7 days. Always keep **≥3 future-dated pairs** in the queue to avoid gaps.

Run `npm run blog:queue` at any time to see how many live and scheduled posts exist per language. The script exits with code 1 if any language has fewer than 3 future posts — wire that into CI later if useful.

## Frontmatter schema

Defined in `src/content/config.ts`. Required fields:

```yaml
---
title: "string"
description: "string, 140-160 chars recommended for SEO"
pubDate: 2026-05-08              # YYYY-MM-DD, future dates are hidden until reached
author: "Sueste Creative"        # default
image: "https://..."             # hero image URL (Pexels / own)
imageAlt: "string"               # descriptive alt for the hero image
tags: ["tag1", "tag2"]           # 3-5 tags, lowercase
readingTime: 7                   # integer, minutes
lang: "pt"                       # "pt" or "en"
translationSlug: "pair-slug"     # slug of the same post in the other language
---
```

## SEO checklist per post

Before committing any new post, confirm:

- [ ] Title ≤ 60 chars, includes the primary keyword near the start
- [ ] Description 140-160 chars, compelling + keyword
- [ ] One H1 implicit from `title`; body uses H2/H3 hierarchy (never skip levels)
- [ ] Every inline image has descriptive alt text
- [ ] ≥ 3 internal links (to `/servicos`, `/orcamento`, `/contacto`, other posts)
- [ ] ≥ 1 outbound authoritative reference (Google docs, Web.dev, Schema.org, etc.)
- [ ] PT ↔ EN `translationSlug` cross-reference both ways
- [ ] `lang` matches the language of the body
- [ ] Frontmatter `pubDate` is the target publish date (future date = scheduled)

## Commit convention

```
content(blog): <slug of one of the new posts>
```

For pairs, commit together in one commit.

## Deploy

Push to `main`. Cloudflare Pages rebuilds automatically. The scheduled-publish workflow then triggers another rebuild every 24h so future-dated posts come online on time.

Never run `wrangler deploy` — we rely on git-push auto-deploy only.
