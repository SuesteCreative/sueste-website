# Changelog

All notable changes to this project will be documented in this file.

## [v1] - 2026-02-25
### Added
- **Portfolio Section**: New premium landing page grid with 3 projects and data-driven metrics.
- **Analytics Metrics**: Blueprint-style numbers with blue gradients in portfolio cards showing results.
- **Brand Visuals**: Dynamic, animated background blobs with blue gradients added to all pages.
- **Socials & Contacts**: Full contact info (Lisbon, Phone, Email) and Social Media (IG, FB, LI) integrated into the footer.
- **Google Analytics**: GA4 tracking installed and verified at the top of the `<head>`.
- **Enhanced Footer**: Redesigned as a clean, professional grid with improved typography.

### Changed
- **Logo Strategy**: Significant enlargement of the Navbar logo (80px) that shrinks seamlessly to 36px on scroll.
- **Navbar Behavior**: Transparency logic for landing page to keep items visible over hero while hiding the background bar until the sequence completes (1.8vh).
- **Footer Aesthetics**: Matched background color to site background to eliminate visible separators.
- **General Styling**: Refined spacing and typography across sections for a more premium finish.

## [Unreleased] - 2026-02-24
### Added
- Initial Astro 5 project setup and React integration.
- `RULEBOOK.md` with development standards and mobile-first rules.
- Centralized i18n and pricing data structure.
- Dynamic Budget Calculator with Framer Motion and API submission hub.
- **Success Pages**: 6 new conversion pages for Google Ads (Booking, Contact, Subscription) in PT/EN.
- Reusable `SuccessView.tsx` component with premium animations.
- Animated "+ IVA" reveal in the budget total.
- Gradient text styling for mobile "Orçamento" link.

### Changed
- **Mobile UX**: Refined budget card sticky behavior (Sticky Top -> Dock at Form).
- **Animations**: Improved price counter stability using `easeOutQuart` smoothing.
- **Navbar**: Internal restructure to prevent overlapping icons and redundant buttons in mobile view.
- Simplified service badges for better mobile legibility.

### Fixed
- Fixed overlapping "X" icons in mobile navigation drawer.
- Fixed budget calculator layout order for correct CSS sticky container behavior.
- Corrected alignment of logo and CTA buttons in mobile view.

