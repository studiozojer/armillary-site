import { z } from 'astro/zod';

/**
 * The frontmatter contract for a wiki page.
 *
 * `kind` is an enum with one member on purpose. When practices arrive they
 * become `kind: 'practice'` carrying `requires` / `writes`, which is an
 * additive change rather than a retrofit — and until then, a page claiming
 * to be a practice fails the build instead of rendering as one.
 */
export const essaySchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number(),
  kind: z.enum(['essay']),
});

export type Essay = z.infer<typeof essaySchema>;
