---
title: "Technical SEO Checklist for Portuguese Websites (2026)"
description: "The definitive technical SEO checklist for Portuguese websites in 2026. Speed, indexing, structured data, hreflang, and more — everything Google evaluates before ranking your site."
pubDate: 2026-05-08
author: "Sueste Creative"
image: "https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=1600"
imageAlt: "Laptop screen showing HTML source code and browser developer tools open"
tags: ["seo", "technical seo", "portugal", "checklist"]
readingTime: 9
lang: "en"
translationSlug: "checklist-seo-tecnico-sites-portugal-2026"
---

Technical SEO is the foundation. Without it, even the best content will not rank consistently. In 2026, with Google's recent updates and the pressure of generative search, fundamentals matter more than ever.

This checklist is what we use on every project we deliver. If your site fails half of these points, you are almost certainly leaving monthly organic traffic on the table.

## 1. Indexing and Crawlability

Before ranking, Google needs to be able to read the site.

- **`robots.txt`** present, accessible at `/robots.txt`, without accidental blocks on important folders (`/_astro/`, `/assets/`, etc.)
- **XML sitemap** submitted in Google Search Console and referenced in `robots.txt`
- **Canonical tags** on every page, pointing to the preferred version (with or without `www`, with or without trailing slash — pick a pattern and stick with it)
- **No duplicate URLs** caused by query parameters, PT/EN versions, or pagination without rel="next"/"prev"
- **`noindex` meta** only where it makes sense (private areas, staging, thank-you pages)
- **404s** returning a real HTTP 404 status, not 200 with a "not found" page (soft 404)

## 2. Performance — Core Web Vitals

Google has used Core Web Vitals as a ranking factor since 2021. In 2026 the thresholds remain:

- **LCP (Largest Contentful Paint):** < 2.5 seconds
- **INP (Interaction to Next Paint):** < 200 ms
- **CLS (Cumulative Layout Shift):** < 0.1

Audit tools: [PageSpeed Insights](https://pagespeed.web.dev/), Chrome DevTools Lighthouse, and the Core Web Vitals report in Search Console (real field data).

Most common fixes:

- Images in modern formats (WebP or AVIF) with `loading="lazy"` on everything below the fold
- Fonts with `font-display: swap` and preload for the critical ones
- No render-blocking JavaScript above the fold
- Critical CSS inline, the rest in a separate chunk
- Eliminate layout shifts: fixed dimensions on images/embeds, reserved space for banners

## 3. HTML Structure and Semantics

Google reads HTML. If the HTML is messy, understanding suffers.

- **A single `<h1>`** per page, containing the primary keyword
- **Logical hierarchy** H2 → H3 → H4 without skipping levels
- **Semantic tags**: `<article>`, `<nav>`, `<main>`, `<aside>`, `<footer>` instead of `<div>` for everything
- **Alt text** on every image (descriptive, not keyword stuffing)
- **Internal links** with descriptive anchor text (avoid "click here")
- **`<button>` vs `<a>`** used correctly (button = action, link = navigation)

## 4. Structured Data (Schema.org)

JSON-LD schema in the `<head>` or right before `</body>`. Gives Google explicit context and unlocks rich results.

For a business in Portugal, the most useful types:

- **`LocalBusiness`** (or variants like `Restaurant`, `MedicalBusiness`, `Store`) — mandatory for local SEO
- **`Organization`** site-wide in the footer
- **`BreadcrumbList`** on every interior page
- **`Article`** on all blog posts
- **`FAQPage`** wherever there are FAQ sections
- **`Product`** + `AggregateRating` for e-commerce

Official validator: [Schema Markup Validator](https://validator.schema.org/).

## 5. Internationalization (hreflang)

If the site has PT and EN versions, hreflang tells Google which one to serve each user.

```html
<link rel="alternate" hreflang="pt-PT" href="https://sueste-creative.pt/servicos" />
<link rel="alternate" hreflang="en" href="https://sueste-creative.pt/en/services" />
<link rel="alternate" hreflang="x-default" href="https://sueste-creative.pt/servicos" />
```

Rules often forgotten:

- Each URL must reference **all versions**, including itself
- `x-default` points to the version to serve when no language matches
- URLs must be **absolute**, not relative
- If PT points to EN, the EN version **must** point back

## 6. Mobile-First

Since 2019 Google indexes the mobile version of the site first. In 2026 this is non-negotiable.

- **Viewport** meta tag correct: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Touch targets** ≥ 48×48 pixels with sufficient spacing
- **Readable text** without needing to zoom (minimum 16px body)
- **No horizontal scroll** at any breakpoint
- **Responsive images** with `srcset` serving the right size per device

Quick test: open the site on a real mobile, not simulated. Any friction means work to do.

## 7. HTTPS and Security

- **HTTPS mandatory**, with automatic HTTP → HTTPS redirect
- **HSTS** header enabled (`Strict-Transport-Security`)
- **SSL certificate** valid and auto-renewing (Cloudflare, Let's Encrypt)
- **Zero mixed content**: nothing on the page loaded via HTTP when the page is HTTPS
- **Cookies** with `Secure` and `HttpOnly` flags where appropriate

## 8. Clean, Stable URLs

- **Short, readable, lowercase URLs** (`/services/web-design`, not `/Services/WEB_DESIGN_123`)
- **Hyphens**, not underscores, as separators
- **No unnecessary parameters** in the canonical version (UTMs are OK, but the canonical URL should not carry them)
- **Consistent hierarchical structure**: `/blog/<slug>` and not `/post?id=123`
- **301 redirects**, never 302, for moved legacy URLs

## 9. Logs and Monitoring

A site without monitoring is one where problems are discovered after traffic has already dropped.

- **Google Search Console** set up and receiving data
- **Google Analytics 4** (or a privacy-respecting alternative like Plausible)
- **Alerts** in Search Console for coverage drops or 404 spikes
- **Monthly Lighthouse audit** (ideally automated in CI/CD)
- **Uptime monitoring** (UptimeRobot, Better Uptime)

## 10. Adjacent Technical Content

- **"About" page** with real company info, VAT number, address, team
- **Contact page** with a form, email, phone, and structured address in schema
- **Privacy policy** and **terms of use** — mandatory in Portugal (GDPR)
- **Cookie policy** with explicit consent before loading trackers
- **Quality external links** with `rel="noopener noreferrer"` when opening in a new tab

---

## How to Audit Your Site

If you want to run the audit now:

1. Run [PageSpeed Insights](https://pagespeed.web.dev/) for mobile and desktop
2. Validate schema at [Schema Markup Validator](https://validator.schema.org/)
3. Check indexing in [Google Search Console](https://search.google.com/search-console)
4. Confirm hreflang is correct with the [hreflang Tags Checker](https://chrome.google.com/webstore/) extension

If you prefer us to handle it, we take credentials and deliver a full report within 48 hours. [Request a quote](/en/quote) or [get in touch](/en/contact) to learn more.

---

## Conclusion

Technical SEO is not magic. It is a checklist that Google publishes and any serious agency follows. The difference between a site that ranks and one that does not is, most of the time, right here on this list.

If your site fails half of these points, the good news is the fixes are usually faster than expected. Organic traffic tends to follow within a few weeks.

*Want a technical audit of your site? [Get in touch](/en/contact). The first 30 minutes are free.*
