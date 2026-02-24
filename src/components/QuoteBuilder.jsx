import React, { useState, useEffect } from 'react';
import pricingData from '../data/pricing.json';

const QuoteBuilder = ({ lang = 'pt' }) => {
    const [selections, setSelections] = useState({});
    const [total, setTotal] = useState(0);
    const [formState, setFormState] = useState({ name: '', email: '', message: '', honey: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            const response = await fetch('/api/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formState,
                    selections,
                    total
                })
            });

            const result = await response.json();
            if (result.success) {
                setStatus({ type: 'success', msg: result.message });
            } else {
                setStatus({ type: 'error', msg: result.message });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: lang === 'pt' ? 'Erro ao enviar. Tente novamente.' : 'Error sending. Try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateTotal = (currentSelections) => {
        let sum = 0;
        pricingData.services.forEach(service => {
            if (currentSelections[service.id]) {
                sum += service.base_price;
                const option = service.options.find(o => o.id === currentSelections[service.id].option);
                if (option) sum += option.price;

                if (service.id === 'web' && currentSelections[service.id].pages) {
                    sum += currentSelections[service.id].pages * service.per_page;
                }
            }
        });
        return sum;
    };

    useEffect(() => {
        setTotal(calculateTotal(selections));
    }, [selections]);

    const toggleService = (serviceId) => {
        setSelections(prev => {
            const newSelections = { ...prev };
            if (newSelections[serviceId]) {
                delete newSelections[serviceId];
            } else {
                const service = pricingData.services.find(s => s.id === serviceId);
                newSelections[serviceId] = { option: service.options[0].id, pages: service.id === 'web' ? 1 : 0 };
            }
            return newSelections;
        });
    };

    const updateOption = (serviceId, optionId) => {
        setSelections(prev => ({
            ...prev,
            [serviceId]: { ...prev[serviceId], option: optionId }
        }));
    };

    const updatePages = (serviceId, pages) => {
        setSelections(prev => ({
            ...prev,
            [serviceId]: { ...prev[serviceId], pages: parseInt(pages) || 0 }
        }));
    };

    return (
        <div className="quote-grid">
            <div className="price-display glass sticky-price">
                <label>{lang === 'pt' ? 'Estimativa' : 'Estimate'}</label>
                <div className="price-value">
                    {total}€ <span>+ IVA</span>
                </div>
                <p className="price-disclaimer">
                    {lang === 'pt'
                        ? 'Valor final sujeito a confirmação após análise técnica.'
                        : 'Final value subject to confirmation after technical analysis.'}
                </p>
            </div>

            <div className="configurator">
                {pricingData.services.map(service => (
                    <div key={service.id} className={`service-item glass ${selections[service.id] ? 'selected' : ''}`}>
                        <div className="service-main" onClick={() => toggleService(service.id)}>
                            <input type="checkbox" checked={!!selections[service.id]} readOnly />
                            <h3>{lang === 'pt' ? service.name_pt : service.name_en}</h3>
                            <span className="base-price">+{service.base_price}€</span>
                        </div>

                        {selections[service.id] && (
                            <div className="service-options">
                                <div className="options-group">
                                    <label>{lang === 'pt' ? 'Opção:' : 'Option:'}</label>
                                    <select
                                        value={selections[service.id].option}
                                        onChange={(e) => updateOption(service.id, e.target.value)}
                                    >
                                        {service.options.map(opt => (
                                            <option key={opt.id} value={opt.id}>
                                                {lang === 'pt' ? opt.name_pt : opt.name_en} ({opt.price > 0 ? `+${opt.price}€` : 'Incluído'})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {service.id === 'web' && (
                                    <div className="options-group">
                                        <label>{lang === 'pt' ? 'Número de Páginas:' : 'Number of Pages:'}</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={selections[service.id].pages}
                                            onChange={(e) => updatePages(service.id, e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                <form className="contact-details glass" onSubmit={handleSubmit}>
                    <h3>{lang === 'pt' ? 'Os Seus Dados' : 'Your Details'}</h3>
                    <div className="form-grid">
                        <input
                            type="text"
                            name="name"
                            placeholder={lang === 'pt' ? 'Nome' : 'Name'}
                            value={formState.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formState.email}
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder={lang === 'pt' ? 'Mensagem (Opcional)' : 'Message (Optional)'}
                            value={formState.message}
                            onChange={handleInputChange}
                        ></textarea>

                        <input type="text" name="honey" value={formState.honey} onChange={handleInputChange} style={{ display: 'none' }} />

                        {status.msg && (
                            <div className={`status-msg ${status.type}`}>
                                {status.msg}
                            </div>
                        )}

                        <button className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? (lang === 'pt' ? 'A enviar...' : 'Sending...')
                                : (lang === 'pt' ? 'Enviar Pedido de Orçamento' : 'Send Quote Request')}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .quote-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 4rem;
          align-items: start;
        }

        .sticky-price {
          position: sticky;
          top: 100px;
          padding: 3rem;
          text-align: center;
          border-radius: 30px;
        }

        .price-value {
          font-size: 4rem;
          font-weight: 800;
          color: var(--color-accent);
          margin: 1rem 0;
        }

        .price-value span {
          font-size: 1rem;
          opacity: 0.5;
        }

        .configurator {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .service-item {
          padding: 2rem;
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .service-item.selected {
          border-color: var(--color-accent);
          background: rgba(0, 112, 243, 0.05);
        }

        .service-main {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
        }

        .service-options {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 2rem;
        }

        .options-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .options-group select, .options-group input {
          background: #111;
          border: 1px solid #333;
          color: white;
          padding: 0.5rem;
          border-radius: 8px;
        }

        .contact-details {
          padding: 3rem;
          margin-top: 2rem;
          border-radius: 30px;
        }

        .form-grid {
          display: grid;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .form-grid input, .form-grid textarea {
          background: #111;
          border: 1px solid #333;
          color: white;
          padding: 1rem;
          border-radius: 12px;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .status-msg {
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
        }

        .status-msg.success {
          background: rgba(0, 255, 0, 0.1);
          color: #4ade80;
          border: 1px solid rgba(0, 255, 0, 0.2);
        }

        .status-msg.error {
          background: rgba(255, 0, 0, 0.1);
          color: #f87171;
          border: 1px solid rgba(255, 0, 0, 0.2);
        }

        @media (max-width: 900px) {
          .quote-grid {
            grid-template-columns: 1fr;
          }
          .sticky-price {
            position: relative;
            top: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default QuoteBuilder;
