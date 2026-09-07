import { z } from 'zod';
import { site as siteContent } from '@/content/site';
import { slides as slidesContent } from '@/content/slides';
import { photos as photosContent } from '@/content/photos';
import { playground as playgroundContent } from '@/content/playground';
import type { Photo, PlaygroundItem, Site, Slide } from '@/content/types';

const nonEmpty = z.string().trim().min(1);

export const photoSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  alt: nonEmpty,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  event: nonEmpty.optional(),
});

export const slideSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: z.enum(['title', 'text', 'diagram', 'photo', 'route', 'end']),
    title: nonEmpty,
    body: nonEmpty.optional(),
    image: z.string().optional(),
    note: nonEmpty.optional(),
    steps: z
      .array(z.object({ label: nonEmpty, role: nonEmpty }))
      .min(1)
      .optional(),
    stops: z
      .array(z.object({ place: nonEmpty, country: nonEmpty }))
      .min(2)
      .optional(),
  })
  .refine((s) => s.kind !== 'diagram' || s.steps !== undefined, {
    message: 'a diagram slide needs steps',
  })
  .refine((s) => s.kind !== 'route' || s.stops !== undefined, {
    message: 'a route slide needs stops',
  });

export const playgroundItemSchema = z.object({
  name: nonEmpty,
  blurb: nonEmpty,
  url: z.url(),
  repo: z.url().optional(),
});

export const siteSchema = z.object({
  name: nonEmpty,
  role: nonEmpty,
  location: nonEmpty,
  tagline: nonEmpty,
  description: nonEmpty,
  url: z.url(),
  links: z.object({ linkedin: z.url(), github: z.url(), x: z.url() }),
});

export type Content = {
  site: Site;
  slides: Slide[];
  photos: Photo[];
  playground: PlaygroundItem[];
};

/**
 * Validate all content. Throws with a readable message on the first problem,
 * which fails `next build` when called from a server component.
 */
export function getContent(overrides: Partial<Content> = {}): Content {
  const site = siteSchema.parse(overrides.site ?? siteContent);
  const slides = z
    .array(slideSchema)
    .min(1)
    .parse(overrides.slides ?? slidesContent);
  const photos = z.array(photoSchema).parse(overrides.photos ?? photosContent);
  const playground = z
    .array(playgroundItemSchema)
    .parse(overrides.playground ?? playgroundContent);

  const slugs = new Set(photos.map((p) => p.slug));
  for (const slide of slides) {
    if (slide.image !== undefined && !slugs.has(slide.image)) {
      throw new Error(
        `slide "${slide.id}" references photo "${slide.image}", which is missing from src/content/photos.ts`,
      );
    }
  }

  return { site, slides, photos, playground };
}
