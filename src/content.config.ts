import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * One Case Study per Portfolio Project per language.
 * File layout: src/content/projects/<locale>/<slug>.mdx
 * A missing Spanish file falls back to the English setting; it never 404s.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** Position on the sheet. Flagship first. */
    order: z.number(),
    /** One line: what this product is. Shown in the project table. */
    character: z.string(),
    /** What Andrés did on it. No seniority claims. */
    role: z.string(),
    year: z.string(),
    /** Shipped state a stranger can verify, e.g. "v0.5.0 · AppImage". */
    state: z.string(),
    stack: z.array(z.string()),
    links: z.object({
      source: z.url(),
      live: z.url().optional(),
      download: z.url().optional(),
    }),
    /** YouTube URL for this project's Cast. Unset renders the reserved plate. */
    cast: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
