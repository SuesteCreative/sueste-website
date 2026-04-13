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
  }),
});

export const collections = { blog };
