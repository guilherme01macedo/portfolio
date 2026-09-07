import Image from 'next/image';
import type { Photo, Slide } from '@/content/types';
import { blurDataUrl, PHOTO_SIZES, photoSrc } from '@/lib/images';
import { slideHeadingClass } from './slideStyles';

export function SlidePhoto({
  photo,
  priority = false,
}: {
  photo: Photo;
  priority?: boolean;
}) {
  const blur = blurDataUrl(photo.slug);
  return (
    <Image
      src={photoSrc(photo.slug)}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes={PHOTO_SIZES.slide}
      priority={priority}
      placeholder={blur ? 'blur' : 'empty'}
      blurDataURL={blur}
      className="h-auto w-full rounded-lg object-cover"
    />
  );
}

export function PhotoSlide({ slide, photo }: { slide: Slide; photo?: Photo }) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <h2 className={slideHeadingClass}>{slide.title}</h2>
        {slide.body && <p className="text-stage-fg/80 text-lg">{slide.body}</p>}
      </div>
      {photo ? (
        <SlidePhoto photo={photo} />
      ) : (
        <div
          aria-hidden="true"
          className="bg-accent/20 aspect-[3/2] rounded-lg"
        />
      )}
    </div>
  );
}
