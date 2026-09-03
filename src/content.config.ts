import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* ===== Journal (blog) =============================================
   Articles en Markdown dans src/content/journal/. Un fichier = un
   article. `draft: true` le garde hors du site (utile pour préparer
   un brouillon). L'`id` d'une entrée = le nom du fichier sans .md,
   qui devient l'URL /journal/<id>.
   ================================================================= */

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
