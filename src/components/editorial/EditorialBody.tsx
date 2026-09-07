import type { Photo, PlaygroundItem, Site } from '@/content/types';
import { Footer } from './Footer';
import { PhotoGrid } from './PhotoGrid';
import { PlaygroundList } from './PlaygroundList';

type Props = { photos: Photo[]; playground: PlaygroundItem[]; site: Site };

export function EditorialBody({ photos, playground, site }: Props) {
  return (
    <div className="bg-paper text-ink">
      <section
        id="photos"
        tabIndex={-1}
        aria-labelledby="photos-heading"
        className="snap-start px-6 py-20 outline-none md:px-16"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <h2 id="photos-heading" className="text-3xl font-semibold">
            From the road
          </h2>
          <p className="text-ink-muted max-w-2xl">
            Hackathons, workshops, and the people who showed up.
          </p>
          <PhotoGrid photos={photos} />
        </div>
      </section>
      <section
        id="playground"
        aria-labelledby="playground-heading"
        className="px-6 py-20 md:px-16"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <h2 id="playground-heading" className="text-3xl font-semibold">
            Playground
          </h2>
          <PlaygroundList items={playground} />
        </div>
      </section>
      <Footer site={site} />
    </div>
  );
}
