import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// "work" entries live in src/content/work/*.md
// Each file's `id` is derived from its filename, e.g. studio-os.md -> "studio-os",
// which becomes the URL at /work/studio-os.
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      type: z.enum(['commissioned', 'personal', 'company']),
      role: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      cover: z.union([image(), z.url()]).optional(),
      url: z.url().optional(),
      repo: z.url().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

// "gallery" entries live in src/content/gallery/*.md
// One entry per visual portfolio category (stickers, logos, posters, ...).
// `image` is a remote URL pointing at the legacy site (https://flowin.space).
const gallery = defineCollection({
  loader: glob({ base: './src/content/gallery', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    image: z.url(),
    alt: z.string().optional(),
  }),
});

// "talks" entries live in src/content/talks/*.md
// Talks/speaking engagements; `category` lets us group past vs upcoming.
const talks = defineCollection({
  loader: glob({ base: './src/content/talks', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    url: z.url(),
    date: z.string(),
    category: z.enum(['past', 'upcoming']).default('past'),
  }),
});

export const collections = { work, gallery, talks };
