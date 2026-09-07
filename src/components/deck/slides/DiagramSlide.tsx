import type { Slide } from '@/content/types';
import { PipelineDiagram } from '../PipelineDiagram';
import { slideHeadingClass } from './slideStyles';

export function DiagramSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className={slideHeadingClass}>{slide.title}</h2>
      {slide.body && (
        <p className="text-stage-fg/80 max-w-2xl text-lg">{slide.body}</p>
      )}
      <PipelineDiagram steps={slide.steps ?? []} />
    </div>
  );
}
