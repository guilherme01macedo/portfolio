import blur from '../../public/photos/blur.json';

export const PHOTO_SIZES = {
  grid: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  slide: '(min-width: 768px) 50vw, 100vw',
} as const;

export function photoSrc(slug: string): string {
  return `/photos/${slug}.jpg`;
}

export function blurDataUrl(slug: string): string | undefined {
  return (blur as Record<string, string>)[slug];
}
