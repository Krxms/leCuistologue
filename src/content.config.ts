import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* Journal : un fichier .md dans src/content/journal/ = un article (URL /journal/<id>). `draft: true` le garde hors du site. */

const journal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/journal" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { journal };
