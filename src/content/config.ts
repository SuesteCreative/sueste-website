import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default("Sueste Creative"),
    image: z.string(),
    imageAlt: z.string(),
    tags: z.array(z.string()),
    readingTime: z.number(), // minutes
    lang: z.enum(["pt", "en"]).default("pt"),
    translationSlug: z.string().optional(), // slug of the same post in the other language
  }),
});

export const collections = { blog };
