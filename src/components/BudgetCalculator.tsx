import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, Trash2, Send, Square, CheckSquare, ChevronDown } from 'lucide-react';
import pricingData from '../data/pricing.json';
import './BudgetCalculator.css';

// Animated Counter Hook
function useCountUp(endValue: number, duration: number = 800) {
    const [count, setCount] = useState(endValue);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const startValue = count;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutQuart
            const easing = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(startValue + easing * (endValue - startValue));
            setCount(currentCount);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [endValue, duration]);

    return count;
}

interface Selection {
    isSelected?: boolean;
    option?: string | null;
}

interface SelectionsState {
    [key: string]: Selection;
}

interface AddonsState {
    [key: string]: boolean;
}

interface FormState {
    name: string;
    email: string;
    company: string;
    deadline: string;
    message: string;
    honey: string;
}

const BudgetCalculator = ({ lang = 'pt' }: { lang?: string }) => {
    const [selections, setSelections] = useState<SelectionsState>({});
    const [addons, setAddons] = useState<AddonsState>({});
    const [droneHours, setDroneHours] = useState(1);
    const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
    const [formState, setFormState] = useState<FormState>({ name: '', email: '', company: '', deadline: '', message: '', honey: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isStickyMobile, setIsStickyMobile] = useState(false);
    const [isMergedWithForm, setIsMergedWithForm] = useState(false);

    // Scroll detection: collapse card and handle merge logic
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (window.innerWidth <= 1024) {
                // Collapse much earlier: as soon as we scroll 50px
                setIsStickyMobile(scrollY > 50);

                // Detect proximity to form for merge effect
                const formEl = document.getElementById('budget-form-ref');
                if (formEl) {
                    const rect = formEl.getBoundingClientRect();
                    // Merge logic: Swap the element into the form when close
                    const mergeThreshold = 140;
                    setIsMergedWithForm(rect.top <= mergeThreshold);
                }
            } else {
                // Desktop logic: Detect when sticky card aligns with form
                setIsStickyMobile(false);
                const formEl = document.getElementById('budget-form-ref');
                if (formEl) {
                    const rect = formEl.getBoundingClientRect();
                    // On desktop, the card is at top: 100px. 
                    // When form reaches ~120px, they are side-by-side.
                    setIsMergedWithForm(rect.top <= 140);
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const shouldCollapse = isStickyMobile;

    // Load from local storage
    useEffect(() => {
        const savedSelections = localStorage.getItem('budgetSelections');
        const savedAddons = localStorage.getItem('budgetAddons');
        const savedHours = localStorage.getItem('budgetDroneHours');
        const savedGroups = localStorage.getItem('budgetExpandedGroups');

        if (savedSelections) setSelections(JSON.parse(savedSelections));
        if (savedAddons) setAddons(JSON.parse(savedAddons));
        if (savedHours) setDroneHours(parseInt(savedHours, 10));
        if (savedGroups) setExpandedGroups(JSON.parse(savedGroups));
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('budgetSelections', JSON.stringify(selections));
        localStorage.setItem('budgetAddons', JSON.stringify(addons));
        localStorage.setItem('budgetDroneHours', droneHours.toString());
        localStorage.setItem('budgetExpandedGroups', JSON.stringify(expandedGroups));
    }, [selections, addons, droneHours, expandedGroups]);

    const calculateEstimation = () => {
        let baseSum = 0;
        let hasStartingAt = false;

        pricingData.services.forEach((service: any) => {
            if (service.is_group && service.sub_services) {
                service.sub_services.forEach((sub: any) => checkItem(sub));
            } else {
                checkItem(service);
            }
        });

        function checkItem(service: any) {
            if (selections[service.id]) {
                if (service.id === 'drone') {
                    baseSum += (service.hourly_rate || 0) * droneHours;
                    const optId = selections[service.id].option;
                    if (optId) {
                        const opt = service.options.find((o: any) => o.id === optId);
                        if (opt) baseSum += opt.price;
                    }
                } else {
                    const opt = service.options.find((o: any) => o.id === selections[service.id].option);
                    if (opt) {
                        baseSum += opt.price;
                        if (opt.type === 'starting_at') hasStartingAt = true;
                    }
                }
            }
        }

        // Global Addons
        pricingData.global_addons.forEach((addon: any) => {
            if (addons[addon.id]) {
                baseSum += addon.price;
                if (addon.type === 'starting_at') hasStartingAt = true;
            }
        });

        const marginBase = Math.round(baseSum);
        return { baseSum, marginBase, hasStartingAt };
    };

    const { baseSum, marginBase, hasStartingAt } = calculateEstimation();
    const animatedTotal = useCountUp(marginBase, 1200);

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    const toggleService = (serviceId: string) => {
        setSelections(prev => {
            const newSel = { ...prev };
            if (newSel[serviceId]) {
                delete newSel[serviceId];
            } else {
                let svc: any = null;
                pricingData.services.forEach((s: any) => {
                    if (s.id === serviceId) svc = s;
                    if (s.is_group && s.sub_services) {
                        const sub = s.sub_services.find((ss: any) => ss.id === serviceId);
                        if (sub) svc = sub;
                    }
                });

                if (!svc) return newSel;
                if (svc.id === 'drone') {
                    newSel[serviceId] = { isSelected: true, option: null };
                } else {
                    newSel[serviceId] = { option: svc.options?.[0]?.id };
                }
            }
            return newSel;
        });
    };

    const updateOption = (serviceId: string, optionId: string | null) => {
        setSelections(prev => ({
            ...prev,
            [serviceId]: { ...prev[serviceId], option: optionId }
        }));
    };

    const toggleAddon = (addonId: string) => {
        setAddons(prev => ({
            ...prev,
            [addonId]: !prev[addonId]
        }));
    };

    const clearBudget = () => {
        setSelections({});
        setAddons({});
        setDroneHours(1);
        setStatus({ type: '', msg: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', msg: '' });

        // Validate
        if (formState.honey) {
            setIsSubmitting(false); // Honeypot trap
            return;
        }

        try {
            const response = await fetch('/api/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formState,
                    selections,
                    addons,
                    droneHours,
                    totalEstimated: marginBase,
                    hasStartingAt,
                    lang
                })
            });

            const result = await response.json();
            if (result.success) {
                setStatus({ type: 'success', msg: lang === 'pt' ? 'Pedido enviado com sucesso!' : 'Request sent successfully!' });
                clearBudget();
                setFormState({ name: '', email: '', company: '', deadline: '', message: '', honey: '' });
            } else {
                setStatus({ type: 'error', msg: result.error || (lang === 'pt' ? 'Erro ao enviar. Tente novamente.' : 'Error sending. Try again.') });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: lang === 'pt' ? 'Erro de comunicação. Tente novamente.' : 'Communication error. Try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const t = {
        estimate: lang === 'pt' ? 'Estimativa' : 'Estimate',
        startingAt: lang === 'pt' ? 'A partir de' : 'Starting at',
        clear: lang === 'pt' ? 'Limpar orçamento' : 'Clear quote',
        legal: lang === 'pt' ? 'Os valores apresentados são estimativas baseadas na informação fornecida. O valor final pode variar consoante personalização, número de páginas, funcionalidades, integrações, SEO e produção de conteúdos.' : 'The values presented are estimates based on the information provided. The final value may vary depending on customization, number of pages, features, integrations, SEO, and content production.',
        yourDetails: lang === 'pt' ? 'Os Seus Dados' : 'Your Details',
        name: lang === 'pt' ? 'Nome' : 'Name',
        company: lang === 'pt' ? 'Empresa' : 'Company',
        deadline: lang === 'pt' ? 'Prazo (Ex: 1 mês)' : 'Deadline (e.g., 1 month)',
        msgOpt: lang === 'pt' ? 'Mensagem (Opcional)' : 'Message (Optional)',
        send: lang === 'pt' ? 'Enviar pedido' : 'Send request',
        sending: lang === 'pt' ? 'A enviar...' : 'Sending...',
        monthlyNote: lang === 'pt' ? 'valores mensais' : 'monthly values',
        hourly: lang === 'pt' ? 'por hora' : 'per hour',
        hours: lang === 'pt' ? 'Horas' : 'Hours',
        included: lang === 'pt' ? 'Incluído' : 'Included',
        onRequest: lang === 'pt' ? 'Sob consulta' : 'On request',
        addonsTitle: lang === 'pt' ? 'Serviços Adicionais' : 'Additional Services',
        base: lang === 'pt' ? 'Preço base' : 'Base price'
    };

    const renderServiceCard = (service: any, idx: number, isSub = false) => {
        if (service.is_group) {
            const isGroupOpen = !!expandedGroups[service.id];
            const hasSelectedSub = service.sub_services.some((s: any) => !!selections[s.id]);

            return (
                <motion.div
                    key={service.id}
                    className={`service-card group-card ${hasSelectedSub ? 'has-selection' : ''} ${isGroupOpen ? 'is-open' : ''}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                    <div
                        className="service-header group-header"
                        onClick={() => toggleGroup(service.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') toggleGroup(service.id) }}
                    >
                        <div className="service-header-left">
                            <h3 className="service-title">{lang === 'pt' ? service.name_pt : service.name_en}</h3>
                        </div>
                        <div className="group-indicator">
                            <ChevronDown size={20} className={`chevron-icon ${isGroupOpen ? 'open' : ''}`} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {isGroupOpen && (
                            <motion.div
                                className="group-body"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="sub-services-wrapper">
                                    {service.sub_services.map((sub: any, subIdx: number) => renderServiceCard(sub, subIdx, true))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            );
        }

        const isSelected = !!selections[service.id];

        return (
            <motion.div
                key={service.id}
                className={`service-card ${isSub ? 'sub-card' : ''} ${isSelected ? 'selected' : ''}`}
                initial={isSub ? { opacity: 1 } : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={isSub ? { duration: 0 } : { duration: 0.5, delay: idx * 0.1 }}
                whileHover={!isSelected ? { scale: 1.01 } : {}}
            >
                <div
                    className="service-header"
                    onClick={() => toggleService(service.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') toggleService(service.id) }}
                >
                    <div className="service-header-left">
                        <div className={`checkbox-custom ${isSelected ? 'checked' : ''}`}>
                            {isSelected && <Check size={16} strokeWidth={3} className="check-icon" />}
                        </div>
                        <h3 className="service-title">{lang === 'pt' ? service.name_pt : service.name_en}</h3>
                    </div>
                    {service.is_monthly && <span className="service-badge">{t.monthlyNote}</span>}
                </div>

                <AnimatePresence>
                    {isSelected && (
                        <motion.div
                            className="service-body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {service.id === 'drone' ? (
                                <div className="drone-config">
                                    <div className="option-row">
                                        <label className="option-label">{t.hours} ({service.hourly_rate}€ {t.hourly})</label>
                                        <div className="number-input">
                                            <button type="button" onClick={() => setDroneHours(Math.max(1, droneHours - 1))}>-</button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={droneHours}
                                                onChange={(e) => setDroneHours(parseInt(e.target.value) || 1)}
                                            />
                                            <button type="button" onClick={() => setDroneHours(droneHours + 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className="options-list">
                                        <div
                                            className={`sub-option ${!selections[service.id].option ? 'active' : ''}`}
                                            onClick={() => updateOption(service.id, null)}
                                        >
                                            <div className="sub-opt-info">
                                                <span className="sub-opt-name">Sem edição</span>
                                            </div>
                                            <div className="sub-opt-price-wrapper">
                                                <span className="sub-opt-price">0€</span>
                                                {!selections[service.id].option && <Check size={16} className="active-check" />}
                                            </div>
                                        </div>
                                        {service.options.map((opt: any) => (
                                            <div
                                                key={opt.id}
                                                className={`sub-option ${selections[service.id].option === opt.id ? 'active' : ''}`}
                                                onClick={() => updateOption(service.id, opt.id)}
                                            >
                                                <div className="sub-opt-info">
                                                    <span className="sub-opt-name">{lang === 'pt' ? opt.name_pt : opt.name_en}</span>
                                                </div>
                                                <div className="sub-opt-price-wrapper">
                                                    <span className="sub-opt-price">+{opt.price}€</span>
                                                    {selections[service.id].option === opt.id && <Check size={16} className="active-check" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="options-list">
                                    {service.options.map((opt: any) => {
                                        const isOptActive = selections[service.id].option === opt.id;
                                        const priceText = opt.type === 'starting_at' ? `${t.startingAt} ${opt.price}€` : `+${opt.price}€`;

                                        return (
                                            <div
                                                key={opt.id}
                                                className={`sub-option ${isOptActive ? 'active' : ''}`}
                                                onClick={() => updateOption(service.id, opt.id)}
                                            >
                                                <div className="sub-opt-info">
                                                    <span className="sub-opt-name">{lang === 'pt' ? opt.name_pt : opt.name_en}</span>
                                                    {(opt.range_pt || opt.range_en) && (
                                                        <span className="sub-opt-range">
                                                            {lang === 'pt' ? opt.range_pt : opt.range_en}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="sub-opt-price-wrapper">
                                                    <span className="sub-opt-price">{priceText}</span>
                                                    {isOptActive && <Check size={16} className="active-check" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <div className={`calc-container ${isMergedWithForm ? 'is-merged' : ''} ${marginBase === 0 ? 'is-zero' : ''}`}>
            <div className="calc-sticky-boundary">
                {/* LEFT COLUMN: STICKY Total */}
                <div className="calc-sidebar">
                    <motion.div
                        layout
                        className={`estimate-card glass-panel ${shouldCollapse ? 'mobile-collapsed' : ''}`}
                        initial={false}
                        animate={{
                            padding: shouldCollapse ? '12px 20px' : '40px',
                            gap: shouldCollapse ? '12px' : '24px'
                        }}
                    >
                        {!shouldCollapse && (
                            <p className="estimate-label">
                                {hasStartingAt ? t.startingAt : t.estimate}
                            </p>
                        )}

                        <div className="estimate-shrink-content">
                            {shouldCollapse && (
                                <span className="estimate-label-inline">
                                    {hasStartingAt ? t.startingAt : t.estimate}
                                </span>
                            )}
                            <div className="estimate-value-wrapper">
                                <span className="estimate-value">{animatedTotal.toLocaleString('pt-PT')}</span>
                                <span className="estimate-currency">€</span>
                                <AnimatePresence>
                                    {marginBase > 0 && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="estimate-iva"
                                        >
                                            + IVA
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn-clear"
                            onClick={clearBudget}
                            disabled={marginBase === 0}
                        >
                            <Trash2 size={16} />
                            {!shouldCollapse && <span className="btn-clear-text" style={{ marginLeft: 8 }}>{t.clear}</span>}
                        </button>

                        {!shouldCollapse && (
                            <div className="legal-note">
                                <Info size={16} className="legal-icon" />
                                <p>{t.legal}</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className={`calc-selection-area ${isStickyMobile ? 'has-sticky-margin' : ''}`}>
                    <div className="calc-step-group">
                        {pricingData.services.map((service: any, idx) => renderServiceCard(service, idx))}
                    </div>

                    {/* ADDONS - Now wrapped in a card */}
                    <motion.div
                        className="addons-section glass-panel"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        style={{ marginTop: '2rem' }}
                    >
                        <h3 className="section-title" style={{ marginTop: 0 }}>{t.addonsTitle}</h3>
                        <div className="addons-grid">
                            {pricingData.global_addons.map((addon: any) => {
                                const isActive = !!addons[addon.id];
                                return (
                                    <div
                                        key={addon.id}
                                        className={`addon-card ${isActive ? 'active' : ''}`}
                                        onClick={() => toggleAddon(addon.id)}
                                    >
                                        <div className="addon-icon" style={{ flexShrink: 0 }}>
                                            {isActive ? <CheckSquare size={20} className="check-icon" /> : <Square size={20} className="uncheck-icon" />}
                                        </div>
                                        <div className="addon-content">
                                            <span className="addon-name">{lang === 'pt' ? addon.name_pt : addon.name_en}</span>
                                            <span className="addon-price">
                                                {addon.on_request
                                                    ? t.onRequest
                                                    : (addon.price > 0 ? `+${addon.price}€` : t.included)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* DOCKING AREA: Removed spacer in favor of liquid merge */}

                    {/* SUBMISSION FORM - Now inside the right column for desktop follow-through */}
                    <div className={`calc-form-container ${isMergedWithForm ? 'is-merged' : ''}`}>
                        <div className="calc-form-area">
                            <motion.form
                                id="budget-form-ref"
                                className="quote-form glass-panel"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                {/* If merged (mobile), show the sticky content inside the form card at the top */}
                                <AnimatePresence>
                                    {(isMergedWithForm && typeof window !== 'undefined' && window.innerWidth <= 1024) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="merged-estimate-header"
                                        >
                                            <div className="estimate-shrink-content">
                                                <span className="estimate-label-inline">
                                                    {hasStartingAt ? t.startingAt : t.estimate}
                                                </span>
                                                <div className="estimate-value-wrapper">
                                                    <span className="estimate-value">{animatedTotal.toLocaleString('pt-PT')}</span>
                                                    <span className="estimate-currency">€</span>
                                                    <AnimatePresence>
                                                        {marginBase > 0 && (
                                                            <motion.span
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: -10 }}
                                                                className="estimate-iva"
                                                            >
                                                                + IVA
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-clear"
                                                onClick={clearBudget}
                                                disabled={marginBase === 0}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <h3 className="form-title">{t.yourDetails}</h3>

                                <div className="form-row pair">
                                    <div className="input-group">
                                        <input type="text" name="name" required placeholder=" " value={formState.name} onChange={handleInputChange} />
                                        <label>{t.name}</label>
                                    </div>
                                    <div className="input-group">
                                        <input type="email" name="email" required placeholder=" " value={formState.email} onChange={handleInputChange} />
                                        <label>Email</label>
                                    </div>
                                </div>

                                <div className="form-row pair">
                                    <div className="input-group">
                                        <input type="text" name="company" required placeholder=" " value={formState.company} onChange={handleInputChange} />
                                        <label>{t.company}</label>
                                    </div>
                                    <div className="input-group">
                                        <input type="text" name="deadline" required placeholder=" " value={formState.deadline} onChange={handleInputChange} />
                                        <label>{t.deadline}</label>
                                    </div>
                                </div>

                                <div className="form-row full">
                                    <div className="input-group">
                                        <textarea name="message" placeholder=" " value={formState.message} onChange={handleInputChange} rows={3}></textarea>
                                        <label>{t.msgOpt}</label>
                                    </div>
                                </div>

                                <input type="text" name="honey" style={{ display: 'none' }} value={formState.honey} onChange={handleInputChange} aria-hidden="true" />

                                {status.msg && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className={`form-status ${status.type}`}
                                    >
                                        {status.msg}
                                    </motion.div>
                                )}

                                <button type="submit" className="submit-btn" disabled={isSubmitting || marginBase === 0}>
                                    {isSubmitting ? (
                                        <span className="sending"><Spinner /> {t.sending}</span>
                                    ) : (
                                        <span className="sending">{t.send} <Send size={18} /></span>
                                    )}
                                </button>
                            </motion.form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Removed Gooey Filter SVG as it caused rendering issues on mobile */}
        </div>
    );
};

const Spinner = () => (
    <svg className="spinner" viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
);

export default BudgetCalculator;
