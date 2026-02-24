# Cartão Euro V1 - Documentação Técnica

Este documento guarda o código e a lógica da animação do cartão de orçamento dinâmico da Sueste Creative, incluindo o efeito de contagem ascendente, o sistema de sticky behavior no mobile e os estilos glassmorphic.

## 1. Lógica React (Hook & Componente)

### Hook de Animação (useCountUp)
Este hook utiliza `requestAnimationFrame` para garantir uma animação fluida a 60fps com suavização `easeOutQuart`.

```tsx
function useCountUp(endValue: number, duration: number = 800) {
    const [count, setCount] = useState(endValue);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const startValue = count;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Suavização: easeOutQuart
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
```

### Estrutura JSX (Cartão Sticky)
O cartão alterna entre um estado expandido e um estado `mobile-collapsed` baseado no scroll.

```tsx
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
                {hasStartingAt ? 'A partir de' : 'Estimativa'}
            </p>
        )}

        <div className="estimate-shrink-content">
            {shouldCollapse && (
                <span className="estimate-label-inline">
                    {hasStartingAt ? 'A PARTIR DE' : 'ESTIMATIVA'}
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

        <button type="button" className="btn-clear" onClick={clearBudget} disabled={marginBase === 0}>
            <Trash2 size={16} />
            {!shouldCollapse && <span style={{ marginLeft: 8 }}>Limpar orçamento</span>}
        </button>
    </motion.div>
</div>
```

## 2. Estilos CSS (Glassmorphism & Sticky)

```css
/* Glassmorphism Base */
.glass-panel {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}

/* Valor com Gradiente */
.estimate-value {
    font-size: 5rem;
    line-height: 1;
    font-weight: 800;
    background: linear-gradient(135deg, #fff 0%, #a1a1aa 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Comportamento Sticky Mobile */
@media (max-width: 1024px) {
    .calc-sidebar {
        position: sticky;
        top: 80px; /* Offset para a Navbar */
        z-index: 50;
        margin-bottom: 2rem;
    }

    .estimate-card.mobile-collapsed {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }

    .estimate-card.mobile-collapsed .estimate-value {
        font-size: 1.8rem !important;
    }
}

/* Animação do +IVA */
.estimate-iva {
    font-size: 0.8rem;
    color: #38bdf8;
    font-weight: 700;
    margin-left: 0.5rem;
    align-self: flex-end;
    margin-bottom: 0.5rem;
}
```
