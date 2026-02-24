# Changelog

All notable changes to this project will be documented in this file.

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

