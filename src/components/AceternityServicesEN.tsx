import { HoverEffect } from "./ui/card-hover-effect";

export const AceternityServicesEN = () => {
    return (
        <div className="w-full">
            <HoverEffect items={services} />
        </div>
    );
};

const services = [
    {
        title: "Web Development",
        description: "Fast, SEO-first websites focused on conversion.",
        link: "/en/services",
    },
    {
        title: "Social Media",
        description: "Social media management and strategic content creation.",
        link: "/en/services",
    },
    {
        title: "Drone Footage",
        description: "Cinematic 4K aerial imagery for your business.",
        link: "/en/services",
    },
    {
        title: "Graphic Design",
        description: "Visual identity and design that communicates your values.",
        link: "/en/services",
    },
];
