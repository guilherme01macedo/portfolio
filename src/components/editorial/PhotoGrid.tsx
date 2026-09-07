import Image from 'next/image';
import type { Photo } from '@/content/types';
import { blurDataUrl, PHOTO_SIZES, photoSrc } from '@/lib/images';

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => {
        const blur = blurDataUrl(photo.slug);
        return (
          <li
            key={photo.slug}
            className="bg-ink/5 relative aspect-[3/2] overflow-hidden rounded-lg"
          >
            <Image
              src={photoSrc(photo.slug)}
              alt={photo.alt}
              fill
              sizes={PHOTO_SIZES.grid}
              placeholder={blur ? 'blur' : 'empty'}
              blurDataURL={blur}
              className="object-cover"
            />
          </li>
        );
      })}
    </ul>
  );
}
