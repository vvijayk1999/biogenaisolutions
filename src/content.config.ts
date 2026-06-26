import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// News articles — fully managed through Decap CMS (/admin).
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    // Path to an uploaded image (stored in /public/uploads). Optional.
    thumbnail: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
