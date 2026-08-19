import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// "work" entries live in src/content/work/*.md
// Each file's `id` is derived from its filename, e.g. studio-os.md -> "studio-os",
// which becomes the URL at /work/studio-os.
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(160),
    type: z.enum(['commissioned', 'personal', 'company']),
    role: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    images: z.array(z.string()).default([]),
    url: z.url().optional(),
    repo: z.url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// "gallery" entries live in src/content/gallery/*.md
// One entry per visual portfolio category (stickers, logos, posters, ...).
// `image` is the category thumbnail and `images` the full set, both served
// from the local /images/portfolio/... copies (same origin — the WebGL
// gallery components texture them, which requires CORS on cross-origin).
const gallery = defineCollection({
  loader: glob({ base: './src/content/gallery', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    alt: z.string().optional(),
    images: z.array(z.string()),
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
