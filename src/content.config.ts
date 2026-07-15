import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// News articles — fully managed through Decap CMS (/admin).
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    // Language of this article. Defaults to English.
    lang: z.enum(['en', 'es', 'fr', 'de', 'ar', 'pt', 'ru', 'uk', 'ko', 'zh-CN', 'yue']).default('en'),
    // Path to an uploaded image (stored in /public/uploads). Optional.
    thumbnail: z.string().optional(),
    draft: z.boolean().default(false),
    // Links this article to its translations across languages. Auto-managed
    // by the translation pipeline — defaults to the English post's own slug.
    translationKey: z.string().optional(),
  }),
});

export const collections = { news };
