import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { EditorialBody } from '@/components/editorial/EditorialBody';
import { playground } from '@/content/playground';
import { site } from '@/content/site';

const photos = [
  {
    slug: 'hackathon',
    alt: 'Builders at a table',
    width: 2400,
    height: 1600,
  },
  {
    slug: 'suihub',
    alt: 'A workshop room',
    width: 2400,
    height: 1600,
  },
];

describe('EditorialBody', () => {
  test('the photos section is a focus target', () => {
    render(
      <EditorialBody photos={photos} playground={playground} site={site} />,
    );
    const section = document.getElementById('photos');
    expect(section).toHaveAttribute('tabindex', '-1');
  });

  test('renders one image per photo with alt text', () => {
    render(
      <EditorialBody photos={photos} playground={playground} site={site} />,
    );
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(
      screen.getByRole('img', { name: 'A workshop room' }),
    ).toBeInTheDocument();
  });
});
