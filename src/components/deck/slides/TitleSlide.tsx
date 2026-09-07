import type { Slide } from '@/content/types';

export function TitleSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl leading-tight font-semibold text-balance md:text-7xl">
        {slide.title}
      </h1>
      {slide.body && (
        <p className="text-stage-fg/70 text-lg md:text-xl">{slide.body}</p>
      )}
      <p className="text-stage-fg/50 text-sm">Press space or scroll.</p>
    </div>
  );
}
