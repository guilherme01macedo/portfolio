import { Deck } from '@/components/deck/Deck';
import { EditorialBody } from '@/components/editorial/EditorialBody';
import { getContent } from '@/lib/content';

export default function Home() {
  const { site, slides, photos, playground } = getContent();
  return (
    <>
      <Deck slides={slides} photos={photos} site={site} />
      <EditorialBody photos={photos} playground={playground} site={site} />
    </>
  );
}
