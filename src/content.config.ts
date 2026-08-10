import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One Case Study per Portfolio Project per language.
 * File layout: src/content/specimens/<locale>/<slug>.mdx
 * A missing Spanish file falls back to the English setting; it never 404s.
 */
const specimens = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/specimens' }),
  schema: z.object({
    title: z.string(),
    /** Position on the sheet. Flagship first. */
    order: z.number(),
    /** One line: what this product is. Shown in the specimen table. */
    character: z.string(),
    /** What Andrés did on it. No seniority claims. */
    role: z.string(),
    year: z.string(),
    /** Shipped state a stranger can verify, e.g. "v0.5.0 · AppImage". */
    state: z.string(),
    stack: z.array(z.string()),
    links: z.object({
      source: z.string().url(),
      live: z.string().url().optional(),
      download: z.string().url().optional(),
    }),
    /** Set true only when a Terminal Cast exists for this specimen. */
    cast: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { specimens };
