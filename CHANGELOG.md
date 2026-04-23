# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-04-23
### Added
- **Serviços — Partner & Google Ads Cards**: Expanded BentoServices from 4 to 6 cards in a clean 3×2 grid. New "Fotografia Profissional" card showcases the Nadine Campos partnership (logo badge, link to `/parcerias/nadine-campos`); new "Google Ads" card covers performance-marketing services.
- **Serviços page — Google Ads section**: New detailed section (`#ads`) on `/servicos` and `/en/services` with features (Search & PMax, Conversion Tracking, ROAS Optimization, Reporting).
- **Card CTAs + Deep Links**: Every bento card is now a clickable link with a matching "Ver serviço" / "View service" CTA ("Ver parceria" for the partner card). Hash-anchored hrefs auto-scroll to the relevant section on the Serviços page (`/servicos#web`, `#design`, `#social`, `#video`, `#ads`).
- **Entry Animations**: Ecossistema Digital stage (desktop + mobile lists) now fades/slides in via `data-reveal` when scrolled into view. Section headers rendered through `Section.astro` now animate on scroll (data-reveal applied to `.section-header`).

### Changed
- **Serviços Page Rhythm**: Each service section now fits the desktop viewport — reduced `.service-section` padding (12rem → 6rem). Section icons now match the landing bento icons 1:1 and inherit a per-section accent color (blue / amber / purple / cyan / green) threaded via `--accent` CSS var — hover glow, bento-item highlights, and border gradients all follow the same accent.

### Fixed
- **Serviços PT Titles**: Card titles now translate correctly on the Portuguese landing ("Desenvolvimento Web", "Fotografia Drone", "Redes Sociais", "Design Gráfico"); previously hardcoded in English only.
- **Ecossistema Digital Spacing**: Tightened vertical rhythm on landing — reduced header margin (4rem → 2rem), stage height (420px → 300px), and stage margin (3rem → 2rem) so subtitle-to-cards and cards-to-footer gaps match.

## [v2.1] - 2026-02-27
### Fixed
- **Mobile Background Cohesion**: Made body background transparent to reveal global animated blobs across all sections, eliminating abrupt black cuts on the landing page.
- **Responsive Typography**: Applied `clamp()` to all major headings (Portfolio projects, Testimonials, Bento cards) ensuring long titles fit perfectly on mobile screens.
- **Process Carousel**: Transformed the "Our Process" section into a native horizontal carousel with `scroll-snap` for mobile users.
- **Layout Consistency**: Standardized section padding and transparent backgrounds for Services, Portfolio, and CTA sections.


## [v2] - 2026-02-26
### Added
- **Services Page Overhaul**: Implemented large background numbers (01-04) with parallax, blue gradient blobs for depth, and premium neon hover effects.
- **Improved Visual Consistency**: Standardized bento card aesthetics and lighting across all service sections with glassmorphism.
- **Enhanced Interactivity**: Re-added scroll-reveal stagger animations for service features and improved hover states with scale, rotation, and neon glow.
- **Hero Video & Animations**: Updated hero rendering with GSAP timeline adjustments, Lenis smooth scroll for zoom out sequences, and scroll-triggered text reveals.
- **Modern UI Elements**: Modernized hero typography and buttons, including an animated scroll-down indicator and button gradient text matching.
- **Docking Animations**: Migrated budget calculator docking transitions to physics-based Framer Motion springs and clean AnimatePresence wait fade transitions.

### Changed
- **Localized Taglines**: Verified and corrected the hero tagline across PT ("O que move nem sempre se vê. Mas o impacto é inevitável.") and EN versions on both Landing and Services pages.
- **Local Asset Integration**: Switched drone service imagery to high-quality local `drone-footage.webp`.
- **Typography & Styling**: Applied ultra-premium typography with fluid sizing, glassmorphic buttons, and GSAP blur reveals across the site.
- **Visuals**: Increased canvas brightness and reduced gradient overlay darkness to make the hero video stand out.
- **Project Structure**: Changed project layout CTA to link to the budget page (Orçamento) instead of contact.
- **Codebase Simplification**: Reverted the addition of external UI libraries (Aceternity UI/Tailwind) to preserve the original, bespoke glassmorphism aesthetics.
- **Budget Calculator**: Replaced IntersectionObserver with a reliable scroll bounding box trigger for smoother docking.

### Fixed
- **Final CTA Visibility**: Restored visibility of the final budget request button on the services page by fixing z-index and scroll triggers.
- **Bento Card Layout**: Refined card structure (Kicker on one line, Title on another) for maximum legibility.
- **Budget Accuracy**: Made the drone hourly calculation explicit in the UI budget so mathematical formulas make precise sense to the end user.
- **Layout & Rendering**: Restored seamless fluid interpolation, prevented double render flashes during docking state transitions, and bound vertical layout alignment to avoid wobbling.
- **Desktop Docking**: Visually connected the estimate card by expanding its width, corrected desktop flexbox grid shape shifting, and restored missing borders.
- **Portfolio Pages**: Restored missing Astro syntax symbols, fixed nested imports, and implemented individual portfolio pages correctly.
- **Drone UI**: Perfected drone neon total layout on both mobile and desktop views.

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

