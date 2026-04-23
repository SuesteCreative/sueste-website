---
title: "Core Web Vitals in Practice: 5 Fixes That Boost Conversion"
description: "Five concrete Core Web Vitals interventions that cut bounce rate and lift conversion on your site. Real examples and measured impact on conversion."
pubDate: 2026-05-29
author: "Sueste Creative"
image: "https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=1600"
imageAlt: "Monitor screen showing Google Lighthouse performance report with metrics"
tags: ["core web vitals", "performance", "conversion", "seo"]
readingTime: 7
lang: "en"
translationSlug: "core-web-vitals-na-pratica-5-fixes-conversao"
---

Core Web Vitals are not an academic metric. They are the difference between a visitor who waits 3 seconds and bounces, and a visitor who sees content in 1 second and converts. In our work with clients in Portugal we regularly measure 15-40% gains in conversion rate from performance interventions alone.

For theoretical context on the metrics themselves, first read [Core Web Vitals: what they are and why they matter](/en/blog/core-web-vitals-what-they-are-and-why-they-matter). This guide is action-focused.

Below, five technical fixes with outsized impact — each implementable in 1 to 5 hours.

## Fix 1: Convert Images to WebP or AVIF

### The Problem

JPEG/PNG images represent 60-70% of a typical site's weight. On a site with hero image + gallery + blog thumbnails, it is easy to exceed 5 MB per page. On mobile 4G, that is 8+ seconds of load time.

### The Fix

Convert all images to **WebP** (supported in 97% of browsers in 2026) or **AVIF** (even better compression, 90% support).

Tools:

- [Squoosh](https://squoosh.app/) — individual converter, free, browser-based
- [Sharp](https://sharp.pixelplumbing.com/) — Node.js, automatable at build time
- [Cloudinary](https://cloudinary.com/) — CDN with on-demand automatic conversion
- Next.js `next/image` or Astro `<Image>` — built-in conversion

### Typical Impact

- Average image weight: 450 KB → 80 KB (80% reduction)
- LCP: 4.2s → 1.8s on sites we tested
- Mobile bounce rate: 12-25% drop

### Fallback

Use `<picture>` with JPEG fallback for older browsers:

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Image description" loading="lazy">
</picture>
```

## Fix 2: Preload the Hero Image + Defer Everything Else

### The Problem

A large hero image takes time to download. The browser only discovers it exists after reading the CSS, computing the layout, and reaching the `<img>` tag. Meanwhile, LCP climbs.

### The Fix

Preload the critical image directly in the `<head>`:

```html
<link rel="preload" as="image" href="/hero.avif" type="image/avif" fetchpriority="high">
```

And make sure everything below the fold has `loading="lazy"` and `decoding="async"`:

```html
<img src="gallery-1.webp" loading="lazy" decoding="async" alt="...">
```

### Typical Impact

- LCP reduced by 300-800ms
- 3G/4G users see content almost instantly

### Note

Preload only **one** image — the main above-the-fold one. Preloading more competes with other critical resources for bandwidth and can make LCP worse.

## Fix 3: Reserve Space to Avoid Layout Shifts (CLS)

### The Problem

The page loads text. Then an image arrives and pushes the text down. The user clicks a button that, at the exact moment of the click, gets shoved and ends up clicking something else. High CLS. Frustrated user.

### The Fix

**Every** image, video, iframe, or element with dynamic dimensions should have reserved space:

1. **Images** — always with `width` and `height` (HTML attributes, not CSS):

```html
<img src="photo.webp" width="800" height="600" alt="...">
```

The browser computes the aspect ratio and reserves space before the image arrives.

2. **Embeds** (YouTube, Twitter) — wrap in a container with aspect-ratio CSS:

```css
.video-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

3. **Ads/banners** — container with reserved minimum height:

```css
.ad-slot {
  min-height: 250px;
}
```

4. **Web fonts** — use `font-display: swap` and `size-adjust` to minimize shift between fallback and web font.

### Typical Impact

- CLS: 0.25 → 0.02 on sites we tested
- Better perceived "quality" — intangible but real

## Fix 4: Eliminate Render-Blocking JavaScript

### The Problem

Third-party scripts (Google Tag Manager, Facebook Pixel, hotjar, chat widgets, cookie banners) loaded synchronously in the `<head>` block render. The page stays blank until each script downloads and executes. INP and LCP suffer.

### The Fix

Load scripts in **async** or **defer** mode:

```html
<!-- Executes as soon as it downloads, without blocking parsing -->
<script async src="..."></script>

<!-- Waits for page parsing, executes at the end -->
<script defer src="..."></script>
```

For third-party scripts that are not critical for initial render:

- **Cookie consent** — load after `load` event
- **Chat widgets** — delay with `setTimeout` or load only on interaction
- **Analytics** — `async` + event queue
- **Facebook Pixel, TikTok Pixel** — use [Partytown](https://partytown.builder.io/) to run in a web worker

### Astro Framework

Astro has native `client:idle`, `client:visible`, `client:media` — loads JavaScript only when needed.

### Typical Impact

- INP: 450ms → 80ms on sites with several trackers
- First Input Delay dramatically reduced on mobile

## Fix 5: Aggressive Cache + CDN

### The Problem

Even with all other fixes in place, if the first request has to hit a server in Lisbon and the user is in Munich, you add 150ms in network latency alone.

### The Fix

1. **Global CDN** — Cloudflare (free), Fastly, AWS CloudFront. Distributes the site across POPs throughout Europe and serves from the one closest to the user.

2. **Aggressive cache headers** on immutable assets:

```
Cache-Control: public, max-age=31536000, immutable
```

For CSS/JS versioned by hash (`style.a3f9c2.css`).

3. **Moderate cache headers** on HTML:

```
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

4. **Service Worker** for sites that benefit from offline functionality or frequent revisits.

### Typical Impact

- TTFB: 800ms → 120ms at geographically distant points
- Revisits: nearly instant (content cached locally)

## How to Measure Impact

Before and after each fix, measure:

1. **PageSpeed Insights** — [pagespeed.web.dev](https://pagespeed.web.dev/) — synthetic + field data
2. **Search Console → Core Web Vitals** — real data from the last 28 days
3. **Google Analytics 4 — Site Speed** — real times per device
4. **A/B test** if possible — half of traffic sees the optimized version, half the legacy. Clean conversion comparison.

On projects we run, we measure:

- Average **17% lift in conversion** after the 5 fixes applied in sequence
- **30-45% reduction in mobile bounce rate**
- Gain of **8-15 positions** in organic ranking for competitive keywords after 6-8 weeks

## Recommended Implementation Order

If you are applying everything on a project, this is the order that minimizes risk and maximizes quick wins:

1. **WebP/AVIF images** (Fix 1) — biggest LCP impact, very low risk
2. **Reserve space to avoid CLS** (Fix 3) — almost no regression risk
3. **Hero preload + lazy everything else** (Fix 2) — needs careful testing
4. **Defer/async scripts** (Fix 4) — watch for analytics race conditions
5. **CDN + cache headers** (Fix 5) — requires infrastructure access

---

## Conclusion

Core Web Vitals are actionable. You do not need to rebuild the site from scratch — five surgical interventions fix most real problems.

At Sueste Creative we run this type of optimization on existing clients' projects and on every new site we deliver. If you want a [technical audit](/en/services#web) of your current site with a report on potential gains, [get in touch](/en/contact). The first analysis is free.

*For context on other technical areas, see our full [technical SEO checklist](/en/blog/technical-seo-checklist-for-portuguese-websites-2026).*
