import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';

interface NavItem {
    href: string;
    label: string;
}

interface NavbarUIProps {
    lang: 'pt' | 'en';
    navItems: NavItem[];
    quoteLabel: string;
    quoteHref: string;
}

const LangSwitcher: React.FC<{ lang: 'pt' | 'en', mobile?: boolean }> = ({ lang, mobile }) => {
    const isPT = lang === 'pt';
    const targetUrl = isPT ? '/en/' : '/';

    return (
        <a href={targetUrl} className={`lang-toggle-wrapper ${mobile ? 'mobile' : ''}`}>
            <div className="lang-toggle-track">
                <motion.div
                    className="lang-toggle-thumb"
                    animate={{ x: isPT ? 0 : 32 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
                <span className={`lang-label pt ${isPT ? 'active' : ''}`}>PT</span>
                <span className={`lang-label en ${!isPT ? 'active' : ''}`}>EN</span>
            </div>
        </a>
    );
};

const NavbarUI: React.FC<NavbarUIProps> = ({ lang, navItems, quoteLabel, quoteHref }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <nav className={`navbar-root ${scrolled ? 'scrolled' : ''}`}>
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
                            <div className="drawer-header-internal" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
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
