import { z } from 'astro/zod';

/**
 * The frontmatter contract for a wiki page.
 *
 * `kind` is an enum with one member on purpose. Until then, a page claiming
 * to be a practice fails the build instead of rendering as one.
 *
 * Honest note on the forward story: widening this schema to
 * `z.discriminatedUnion('kind', [...])` when practices arrive *is* additive.
 * But that alone is not enough to ship practices. `content.config.ts` pins
 * the `wiki` collection's loader to `base: './content/wiki/essays'` — a
 * sibling `content/wiki/practices/` directory is invisible to it. Widening
 * the base to `'./content/wiki'` with a `**\/*.md` pattern to catch both
 * would also sweep in the wiki repo's own `README.md`, which doesn't carry
 * this frontmatter and would fail the schema and break the build. So a
 * second `kind` needs its own collection (or an ignore pattern) plus a
 * routing decision — `src/pages/wiki/[...id].astro` currently renders
 * every entry in `wiki` under `/wiki/`, with no branching by kind. None of
 * that exists yet; this file alone does not make practices additive.
 */
export const essaySchema = z
  .object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    kind: z.enum(['essay']),
  })
  .strict();

export type Essay = z.infer<typeof essaySchema>;
