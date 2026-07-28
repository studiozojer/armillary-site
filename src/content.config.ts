import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { essaySchema } from './schemas/essay';

const wiki = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/wiki/essays' }),
  schema: essaySchema,
});

export const collections = { wiki };
