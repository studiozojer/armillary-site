import { describe, expect, it } from 'vitest';
import { essaySchema } from './essay';

const valid = {
  title: 'What the armillary is',
  description: 'A router that composes what a workspace declares.',
  order: 1,
  kind: 'essay',
};

describe('essaySchema', () => {
  it('accepts a well-formed essay', () => {
    expect(essaySchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a page with no order — the wiki is a sequence, not an alphabet', () => {
    const { order, ...withoutOrder } = valid;
    expect(essaySchema.safeParse(withoutOrder).success).toBe(false);
  });

  it('rejects a page with no title', () => {
    const { title, ...withoutTitle } = valid;
    expect(essaySchema.safeParse(withoutTitle).success).toBe(false);
  });

  it('rejects a page with no description', () => {
    const { description, ...withoutDescription } = valid;
    expect(essaySchema.safeParse(withoutDescription).success).toBe(false);
  });

  it('rejects a non-numeric order', () => {
    expect(essaySchema.safeParse({ ...valid, order: 'first' }).success).toBe(false);
  });

  it('rejects kind: practice until practices actually exist', () => {
    expect(essaySchema.safeParse({ ...valid, kind: 'practice' }).success).toBe(false);
  });

  it('rejects an unknown kind', () => {
    expect(essaySchema.safeParse({ ...valid, kind: 'nonsense' }).success).toBe(false);
  });

  it('rejects an unrecognized field — the README promises exactly four', () => {
    expect(essaySchema.safeParse({ ...valid, draft: true }).success).toBe(false);
  });
});
