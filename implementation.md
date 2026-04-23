# Sueste Creative — Implementation Roadmap

Priority order based on SEO, trust, and conversion impact.

---

## 🔴 High Priority

- [ ] **Replace fake testimonials with real ones** — All 8 are fictional; replace with real client reviews from Google.
- [ ] **Fix homepage title tag** — `"Home | Sueste Creative"` → `"Web Design & Desenvolvimento no Algarve | Sueste Creative"`
- [ ] **Add AggregateRating schema** — Triggers ★ star ratings in Google search results (uses testimonial data)

---

## 🟡 Medium Priority

- [ ] **Add stats bar section** — Between Hero and Services: `15+ Projetos`, `3 Anos`, `100% Satisfação`, `Algarve & Beyond`
- [ ] **Add FAQ section** — Before final CTA; boosts SEO rich snippets and handles objections
- [ ] **Better OG social preview image** — Replace logo with a proper 1200×630 screenshot of the site

---

## 🟢 Later

- [ ] **Start a blog (3–5 posts)** — Long-tail SEO; topics like "web design Algarve", "quanto custa um site em Portugal"
- [ ] **Tech stack / trusted-by logos** — Brief strip showing Astro, Cloudflare, Shopify, Google, Meta

---

## ✅ Done

- [x] **Portfolio redesign** — Bento grid layout, full-bleed images, premium card design
- [x] **Add DNA CRM project to portfolio** — *(needs proper screenshot image to replace placeholder)*

---

## Audit — 2026-04-08

### Critical
- [x] Create /cookies and /en/cookies pages — footer links are broken (404), GDPR non-compliance
- [x] Fix footer location "Lisboa, Portugal" → "Algarve, Portugal" — contradicts all page content and JSON-LD schema, damages local SEO

### High
- [x] Fix Sobre/About page title — BaseLayout appends "| Sueste Creative" but title prop already contains "| Sueste Creative —", resulting in duplicate brand name in `<title>`
- [x] Improve all generic title tags with keywords + location (Home, Serviços, Portfólio, Contacto, Orçamento, Parcerias and EN equivalents)
- [x] Fix stat counters on /sobre and /en/about — initial HTML shows "0" so crawlers and no-JS users see "0+ projetos", "0 anos", "0% satisfação" — must have real values in HTML
- [x] Add ogImage prop to BaseLayout to allow per-page OG image override — currently all pages share the same logo image
- [x] Fix email inconsistency — footer uses `info@sueste-creative.pt`, everything else uses `geral@sueste-creative.pt`; unify to `geral@`
- [x] Fix TikTok footer link — points to generic `tiktok.com`, not a branded profile; remove until real profile exists
- [x] Fix footer brand description — currently uses hero tagline instead of a real company description

### Medium
- [x] Improve thin meta descriptions for /privacidade, /termos and EN equivalents
- [x] Add FAQPage JSON-LD schema to /contacto and /en/contact — FAQ section exists but has no structured data
- [x] Upgrade BaseLayout JSON-LD — add LocalBusiness type, telephone, and serviceArea to improve local SEO signals
- [x] Add `<meta name="robots" content="noindex, nofollow">` to all /sucesso/* and /en/success/* confirmation pages
- [ ] Add per-page ogImage to portfolio project pages for better social sharing

### Low
- [x] Add SVG favicon link to BaseLayout alongside PNG favicon
- [ ] Note: Partners page has only 1 partner — consider adding more for social proof

---

## Audit — 2026-04-13

### Critical
- [x] GA4 fires on page load without cookie consent — ePrivacy + GDPR violation; build consent-gated banner that blocks GA4 until accepted
- [x] cookies.astro "by continuing you accept" language — not valid GDPR consent; fix after banner implementation

### Medium
- [x] EN cookies page has geral@sueste-creative.pt — fix to info@
- [x] JSON-LD schema in BaseLayout has geral@ email — fix to info@
- [ ] Marketing emails will have no unsubscribe mechanism — note: requires email marketing tool (Resend Broadcasts / Mailchimp)

---

## Audit — 2026-04-23

### Critical
- [x] Missing `.mp4` video asset — 4 portfolio pages reference mp4 that only exists as webm: portfolio/desportos-nauticos-alvor.astro:84, portfolio/dna-site-fardas.astro:82, en/work/desportos-nauticos-alvor.astro:79, en/work/dna-site-fardas.astro:81
- [x] Favicon 404 — BaseLayout.astro:52 refs favicon.svg but only favicon.png exists
- [x] Broken image — web-design-hoteis-algarve.astro:196 refs /images/portfolio/desportos-nauticos.webp (not found)
- [x] Page web-design-hoteis-algarve.astro orphaned from i18n — no EN counterpart, no hreflangEn (resolved: PT-only landing is correct; hreflangPt already doubles as x-default via BaseLayout, no EN version needed for a PT-targeted "Algarve hotéis" keyword page)
- [x] Unoptimized images >1MB — converted crm-iphone/macbook/ipad PNG → WebP (91-94% smaller), removed orphan sueste-logo-creation.png (webp already used)

### Medium
- [x] Meta descriptions >160 chars — en/blog/index, en/about, en/work/dna-crm-backoffice, en/services, blog/index, en/quote, orcamento
- [x] Dead code — delete src/components/QuoteBuilder.jsx (322 lines, orphan) and src/layouts/Layout.astro (replaced by BaseLayout)
- [x] OSRM reliability risk — BudgetCalculator.tsx:264 uses public demo router.project-osrm.org (known risk; acceptable — low traffic, no SLA needed; revisit if 429/5xx observed, candidate replacement: Google Routes API or self-host OSRM)
- [x] handleSubmit missing AbortController timeout — BudgetCalculator.tsx:544 fetch has no timeout; add 30s
- [x] hreflang broken reciprocal pair — en/blog/index.astro already had hreflangEn; PT blog/index was missing — now added
- [x] Generic alt "Partner Logo" — BudgetCalculator.tsx:624 and :786, interpolate partner name

### Low
- [x] Page titles >60 chars with brand suffix — shortened worst offenders (index PT/EN, orcamento, quote, services EN, partners EN)
- [x] og:image fixed across all pages — ProjectLayout now auto-passes heroImage as og:image for all 10 portfolio case studies (blog posts still need per-post frontmatter, not addressed here)
- [x] framer-motion client:load on orcamento/quote (~120KB) — switched to client:visible
- [x] BudgetCalculator useEffect order fragile — consolidated hydration into single effect; URL bundle param wins, else localStorage
