import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Home } from 'lucide-react';

interface SuccessViewProps {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonHref: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
}

const SuccessView: React.FC<SuccessViewProps> = ({
    title,
    subtitle,
    buttonText,
    buttonHref,
    secondaryButtonText,
    secondaryButtonHref
}) => {
    return (
        <div className="success-container">
            <motion.div
                className="success-card glass-panel"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <motion.div
                    className="success-icon-wrapper"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
                >
                    <div className="icon-pulse"></div>
                    <CheckCircle2 size={80} className="success-icon" />
                </motion.div>

                <motion.h1
                    className="success-title"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {title}
                </motion.h1>

                <motion.p
                    className="success-subtitle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    className="success-actions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <a href={buttonHref} className="btn-primary-nav">
                        {buttonText} <ArrowRight size={18} />
                    </a>

                    {secondaryButtonText && secondaryButtonHref && (
                        <a href={secondaryButtonHref} className="btn-secondary">
                            <Home size={18} /> {secondaryButtonText}
                        </a>
                    )}
                </motion.div>
            </motion.div>

            <style>{`
                .success-container {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    text-align: center;
                }

                .success-card {
                    max-width: 600px;
                    width: 100%;
                    padding: 4rem 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .success-icon-wrapper {
                    position: relative;
                    margin-bottom: 1rem;
                    color: #38bdf8;
                }

                .icon-pulse {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100px;
                    height: 100px;
                    background: rgba(56, 189, 248, 0.2);
                    border-radius: 50%;
                    z-index: -1;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
                    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
                }

                .success-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin: 0;
                    background: linear-gradient(135deg, #fff 0%, #a1a1aa 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .success-subtitle {
                    font-size: 1.1rem;
                    color: #94a3b8;
                    line-height: 1.6;
                    margin-bottom: 1rem;
                }

                .success-actions {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .btn-secondary {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: 50px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s;
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                @media (max-width: 640px) {
                    .success-title { font-size: 2rem; }
                    .success-card { padding: 3rem 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default SuccessView;
