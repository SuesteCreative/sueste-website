# Sueste Creative - Project Rulebook

## 1. DRY (Don't Repeat Yourself)
- Use Astro components for reusable UI patterns.
- Global styles should be managed in `src/styles/global.css`.
- Shared constants (e.g., SEO defaults) should live in a central config file.

## 2. SEO Rules
- Every page must have a unique `<title>` and `<meta name="description">`.
- Use semantic HTML (h1, h2, main, section, etc.).
- All images must have descriptive `alt` tags.
- Use Open Graph tags for better social sharing.
- Content must be rendered at build time (SSG).

## 3. Accessibility (a11y)
- Minimum color contrast ratios must be met.
- Use `aria-label` where necessary.
- Elements must be keyboard navigable.
- Respect `prefers-reduced-motion` for animations.

## 4. Internationalization (i18n)
- Default language is Portuguese (Portugal) `pt-pt`.
- Secondary language is English `en`.
- All user-facing strings must be defined in `src/i18n/pt.json` and `src/i18n/en.json`.
- Routes for English must be prefixed with `/en/`.

## 5. Changelog Update Rules
- Every meaningful change must be logged in `CHANGELOG.md`.
- Use clear, descriptive summaries of changes.
- Do not make breaking changes without logging and rationale.

## 6. CSS & Design
- Use Vanilla CSS as the primary styling method.
- Maintain a premium, high-end aesthetic.
- Use dynamic animations and micro-interactions where appropriate.
