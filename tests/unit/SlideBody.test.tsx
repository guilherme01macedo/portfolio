import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { SlideBody } from '@/components/deck/SlideBody';
import { site } from '@/content/site';
import { slides } from '@/content/slides';

function slide(id: string) {
  const found = slides.find((s) => s.id === id);
  if (!found) throw new Error(`no slide ${id}`);
  return found;
}

describe('SlideBody', () => {
  test('the title slide renders the only h1', () => {
    render(<SlideBody slide={slide('title')} site={site} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /building things/,
    );
  });

  test('the end slide links to LinkedIn, X, and GitHub', () => {
    render(<SlideBody slide={slide('end')} site={site} />);
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      site.links.linkedin,
    );
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
      'href',
      site.links.github,
    );
    expect(
      screen.getByRole('link', { name: /^X$|X \(Twitter\)/ }),
    ).toHaveAttribute('href', site.links.x);
  });
});
