import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { gsap } from 'gsap';

interface NavItem {
    href: string;
    label: string;
}

interface NavbarUIProps {
    lang: 'pt' | 'en';
    navItems: NavItem[];
    quoteLabel: string;
    quoteHref: string;
    isLandingPage?: boolean;
}

const LangSwitcher: React.FC<{ lang: 'pt' | 'en', mobile?: boolean }> = ({ lang, mobile }) => {
    const isPT = lang === 'pt';
    const [targetUrl, setTargetUrl] = useState(isPT ? '/en/' : '/');
    const containerRef = useRef<HTMLAnchorElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const ptLabelRef = useRef<HTMLSpanElement>(null);
    const enLabelRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const getSwitchLanguageUrl = (pathname: string, currentLang: 'pt' | 'en') => {
            const isPT = currentLang === 'pt';
            const ptToEnMap: Record<string, string> = {
                '/servicos': '/en/services', '/portfolio': '/en/work', '/sobre': '/en/about',
                '/contacto': '/en/contact', '/orcamento': '/en/quote', '/servicos/': '/en/services/',
                '/portfolio/': '/en/work/', '/sobre/': '/en/about/', '/contacto/': '/en/contact/',
                '/orcamento/': '/en/quote/',
            };
            const enToPtMap: Record<string, string> = {
                '/en/services': '/servicos', '/en/work': '/portfolio', '/en/about': '/sobre',
                '/en/contact': '/contacto', '/en/quote': '/orcamento', '/en/services/': '/servicos/',
                '/en/work/': '/portfolio/', '/en/about/': '/sobre/', '/en/contact/': '/contacto/',
                '/en/quote/': '/orcamento/',
            };
            const normalizedPath = pathname.endsWith('/') && pathname !== '/' && pathname !== '/en/'
                ? pathname.slice(0, -1) : pathname;

            if (isPT) {
                if (normalizedPath === '/') return '/en/';
                if (ptToEnMap[normalizedPath]) return ptToEnMap[normalizedPath];
                if (normalizedPath.startsWith('/portfolio/')) return normalizedPath.replace('/portfolio/', '/en/work/');
                return '/en/';
            } else {
                if (normalizedPath === '/en' || normalizedPath === '/en/') return '/';
                if (enToPtMap[normalizedPath]) return enToPtMap[normalizedPath];
                if (normalizedPath.startsWith('/en/work/')) return normalizedPath.replace('/en/work/', '/portfolio/');
                return '/';
            }
        };
        setTargetUrl(getSwitchLanguageUrl(window.location.pathname, lang));
    }, [lang]);

    useEffect(() => {
        if (!thumbRef.current) return;

        const travel = mobile ? 40 : 32;
        const targetX = isPT ? 0 : travel;

        const tl = gsap.timeline({ overwrite: true });

        // Liquid squash and stretch move
        tl.to(thumbRef.current, {
            x: targetX,
            scaleX: 1.5,
            scaleY: 0.7,
            duration: 0.3,
            ease: "power2.in"
        })
            .to(thumbRef.current, {
                scaleX: 1,
                scaleY: 1,
                duration: 0.7,
                ease: "elastic.out(1, 0.5)"
            }, "-=0.1");

        // Label scaling and intensity
        gsap.to(ptLabelRef.current, {
            scale: isPT ? 1.25 : 0.85,
            fontWeight: isPT ? "900" : "500",
            color: isPT ? "#000" : (mobile ? "#fff" : "rgba(255,255,255,0.4)"),
            duration: 0.4
        });
        gsap.to(enLabelRef.current, {
            scale: !isPT ? 1.25 : 0.85,
            fontWeight: !isPT ? "900" : "500",
            color: !isPT ? "#000" : (mobile ? "#fff" : "rgba(255,255,255,0.4)"),
            duration: 0.4
        });
    }, [isPT, mobile]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const moveX = (e.clientX - centerX) * 0.3;
        const moveY = (e.clientY - centerY) * 0.3;

        gsap.to(containerRef.current, {
            x: moveX,
            y: moveY,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        if (!containerRef.current) return;
        gsap.to(containerRef.current, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.4)"
        });
    };

    return (
        <a
            ref={containerRef}
            href={targetUrl}
            className={`lang-toggle-wrapper ${mobile ? 'mobile' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'inline-block', transition: 'none' }}
        >
            <div className="lang-toggle-track">
                <div className="lang-toggle-thumb" ref={thumbRef} />
                <span ref={ptLabelRef} className={`lang-label pt ${isPT ? 'active' : ''}`}>PT</span>
                <span ref={enLabelRef} className={`lang-label en ${!isPT ? 'active' : ''}`}>EN</span>
            </div>
        </a>
    );
};

const NavbarUI: React.FC<NavbarUIProps> = ({ lang, navItems, quoteLabel, quoteHref, isLandingPage = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // HeroScrollSequence scroll distance is 300vh. 
            // 30 frames left out of 500 is ~94% of the scroll track (2.82 * innerHeight).
            const threshold = isLandingPage ? (window.innerHeight * 2.82) : 20;
            setScrolled(scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLandingPage]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <nav className={`navbar-root ${scrolled ? 'scrolled' : ''} ${isLandingPage ? 'is-landing' : ''}`}>
            <div className="container nav-content">
                <a href={lang === 'pt' ? '/' : '/en/'} className="logo">
                    <img src="/images/logo-white-hor.webp" alt="Sueste Creative Logo" className="logo-img" />
                </a>

                {/* DESKTOP LINKS */}
                <ul className="nav-links desktop-only">
                    {navItems.map((item, idx) => (
                        <li key={idx}>
                            <a href={item.href} className="nav-link-item">{item.label}</a>
                        </li>
                    ))}
                    <li>
                        <a href={quoteHref} className="btn-primary-nav">{quoteLabel}</a>
                    </li>
                    <li style={{ marginLeft: '1rem' }}>
                        <LangSwitcher lang={lang} />
                    </li>
                </ul>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    style={{ zIndex: 10001, opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? 'none' : 'auto' }}
                >
                    <Menu size={28} />
                </button>
            </div>

            {/* MOBILE DRAWER */}
            <AnimatePresence>
                {isOpen && (
                    <div className="mobile-drawer-root">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="nav-overlay-blur"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="nav-drawer-panel"
                        >
                            <div className="drawer-header-internal" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
                                <button
                                    className="drawer-close-btn"
                                    onClick={() => setIsOpen(false)}
                                    style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                                >
                                    <X size={32} />
                                </button>
                            </div>
                            <div className="drawer-inner">
                                <ul className="mobile-nav-list">
                                    {navItems.map((item, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                        >
                                            <a href={item.href} onClick={() => setIsOpen(false)}>{item.label}</a>
                                        </motion.li>
                                    ))}
                                    <motion.li
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="drawer-cta-item"
                                    >
                                        <a href={quoteHref} className="mobile-nav-quote-link" onClick={() => setIsOpen(false)}>
                                            {quoteLabel}
                                        </a>
                                    </motion.li>

                                    <motion.li
                                        className="drawer-lang-section"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <div className="lang-section-label">
                                            <Globe size={18} />
                                            <span>{lang === 'pt' ? 'Idioma' : 'Language'}</span>
                                        </div>
                                        <LangSwitcher lang={lang} mobile />
                                    </motion.li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default NavbarUI;
