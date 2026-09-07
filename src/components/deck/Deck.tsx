'use client';

import type { Photo, Site, Slide } from '@/content/types';
import { DeckHud } from './DeckHud';
import { SlideBody } from './SlideBody';
import { SlideSection } from './SlideSection';
import { useDeck } from './useDeck';

type Props = { slides: Slide[]; photos: Photo[]; site: Site };

export function Deck({ slides, photos, site }: Props) {
  const { index, total, inView, goTo, registerSlide } = useDeck(slides.length);
  return (
    <div data-testid="deck" className="bg-stage text-stage-fg">
      {slides.map((slide, i) => (
        <SlideSection
          key={slide.id}
          id={`slide-${slide.id}`}
          index={i}
          label={slide.title}
          ref={registerSlide(i)}
          onAdvance={() => goTo(i + 1)}
        >
          <SlideBody
            slide={slide}
            photo={photos.find((p) => p.slug === slide.image)}
            site={site}
          />
        </SlideSection>
      ))}
      <DeckHud
        index={index}
        total={total}
        visible={inView}
        onPrev={() => goTo(index - 1)}
        onNext={() => goTo(index + 1)}
      />
    </div>
  );
}
