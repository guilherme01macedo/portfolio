import type { Slide } from '@/content/types';
import { slideHeadingClass } from './slideStyles';

export function TextSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className={slideHeadingClass}>{slide.title}</h2>
      {slide.body && (
        <p className="text-stage-fg/80 max-w-2xl text-lg md:text-2xl">
          {slide.body}
        </p>
      )}
    </div>
  );
}
