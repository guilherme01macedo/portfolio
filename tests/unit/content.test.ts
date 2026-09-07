import { describe, expect, test } from 'vitest';
import { getContent, photoSchema, slideSchema } from '@/lib/content';

describe('content validation', () => {
  test('rejects a photo without alt text', () => {
    const result = photoSchema.safeParse({
      slug: 'hackathon',
      width: 2400,
      height: 1600,
    });
    expect(result.success).toBe(false);
  });

  test('rejects a diagram slide without steps', () => {
    const result = slideSchema.safeParse({
      id: 'now',
      kind: 'diagram',
      title: 'Now',
    });
    expect(result.success).toBe(false);
  });

  test('the real content is valid and has seven slides', () => {
    const content = getContent();
    expect(content.slides).toHaveLength(7);
    expect(content.slides[0].kind).toBe('title');
    expect(content.slides[6].kind).toBe('end');
    expect(content.site.links.linkedin).toContain('linkedin.com');
  });

  test('a slide image must name a photo in the manifest', () => {
    expect(() =>
      getContent({
        slides: [{ id: 'x', kind: 'photo', title: 'X', image: 'missing' }],
        photos: [],
      }),
    ).toThrow(/missing/);
  });
});
