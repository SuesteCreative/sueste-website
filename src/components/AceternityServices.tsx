import { HoverEffect } from "./ui/card-hover-effect";

export const ServicesHoverEffect = () => {
    return (
        <div className="max-w-5xl mx-auto px-8">
            <HoverEffect items={services} />
        </div>
    );
};

const services = [
    {
        title: "Web Development",
        description: "Websites rápidos, SEO-first e focados em conversão.",
        link: "/servicos",
    },
    {
        title: "Social Media",
        description: "Gestão de redes sociais e criação de conteúdo estratégico.",
        link: "/servicos",
    },
    {
        title: "Drone Footage",
        description: "Imagens aéreas cinematográficas em 4K para o seu negócio.",
        link: "/servicos",
    },
    {
        title: "Graphic Design",
        description: "Identidade visual e design que comunica os seus valores.",
        link: "/servicos",
    },
];
