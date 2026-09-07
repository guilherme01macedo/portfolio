import type { Photo, Site, Slide } from '@/content/types';
import { DiagramSlide } from './slides/DiagramSlide';
import { EndSlide } from './slides/EndSlide';
import { PhotoSlide } from './slides/PhotoSlide';
import { RouteSlide } from './slides/RouteSlide';
import { TextSlide } from './slides/TextSlide';
import { TitleSlide } from './slides/TitleSlide';

type Props = { slide: Slide; photo?: Photo; site: Site };

export function SlideBody({ slide, photo, site }: Props) {
  switch (slide.kind) {
    case 'title':
      return <TitleSlide slide={slide} />;
    case 'text':
      return <TextSlide slide={slide} />;
    case 'diagram':
      return <DiagramSlide slide={slide} />;
    case 'photo':
      return <PhotoSlide slide={slide} photo={photo} />;
    case 'route':
      return <RouteSlide slide={slide} />;
    case 'end':
      return <EndSlide slide={slide} site={site} />;
  }
}
