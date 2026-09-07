import Image from 'next/image';
import type { Photo } from '@/content/types';
import { blurDataUrl, PHOTO_SIZES, photoSrc } from '@/lib/images';

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => {
        const blur = blurDataUrl(photo.slug);
        return (
          <li key={photo.slug}>
            <Image
              src={photoSrc(photo.slug)}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes={PHOTO_SIZES.grid}
              placeholder={blur ? 'blur' : 'empty'}
              blurDataURL={blur}
              className="h-auto w-full rounded-lg"
            />
          </li>
        );
      })}
    </ul>
  );
}
