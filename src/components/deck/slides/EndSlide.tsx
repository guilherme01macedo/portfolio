import type { Site, Slide } from '@/content/types';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { slideHeadingClass } from './slideStyles';

export function EndSlide({ slide, site }: { slide: Slide; site: Site }) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className={slideHeadingClass}>{slide.title}</h2>
      {slide.body && (
        <p className="text-stage-fg/80 max-w-2xl text-lg">{slide.body}</p>
      )}
      <SocialLinks links={site.links} tone="dark" />
      <p className="text-stage-fg/50 text-sm">
        Keep scrolling for photos and side projects.
      </p>
    </div>
  );
}
