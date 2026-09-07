import type { Slide } from '@/content/types';
import { slideHeadingClass } from './slideStyles';

export function RouteSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-accent text-sm font-medium tracking-widest uppercase">
        {slide.title}
      </h2>
      <ol className="flex flex-col gap-3">
        {(slide.stops ?? []).map((stop) => (
          <li
            key={stop.place}
            className="border-stage-fg/15 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-3"
          >
            <span className={slideHeadingClass}>{stop.place}</span>
            <span className="text-stage-fg/50 text-lg md:text-2xl">
              {stop.country}
            </span>
          </li>
        ))}
      </ol>
      <div className="flex max-w-2xl flex-col gap-4">
        {slide.body && (
          <p className="text-stage-fg/60 text-lg md:text-xl">{slide.body}</p>
        )}
        {slide.note && (
          <p className="text-stage-fg/90 text-xl md:text-3xl">{slide.note}</p>
        )}
      </div>
    </div>
  );
}
