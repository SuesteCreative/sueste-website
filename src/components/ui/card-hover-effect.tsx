import { cn } from "../../utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const HoverEffect = ({
    items,
    className,
}: {
    items: {
        title: string;
        description: string;
        link?: string;
    }[];
    className?: string;
}) => {
    let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4  py-10",
                className
            )}
        >
            {items.map((item, idx) => (
                <a
                    href={item?.link || "#"}
                    key={item?.link || idx}
                    className="relative group block p-4 md:p-6 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-[rgba(56,189,248,0.1)] block rounded-3xl"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <Card>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                    </Card>
                </a>
            ))}
        </div>
    );
};

export const Card = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "rounded-[20px] h-full w-full p-4 overflow-hidden glass group-hover:border-[var(--color-accent)] relative z-20 transition-colors duration-300",
                className
            )}
        >
            <div className="relative z-50">
                <div className="p-4 sm:p-6">{children}</div>
            </div>
        </div>
    );
};

export const CardTitle = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <h3 className={cn("font-bold tracking-wide mt-2 text-2xl", className)} style={{ color: "var(--color-accent)" }}>
            {children}
        </h3>
    );
};

export const CardDescription = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <p
            className={cn(
                "mt-4 tracking-wide leading-relaxed text-[1.1rem]",
                className
            )}
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
            {children}
        </p>
    );
};
