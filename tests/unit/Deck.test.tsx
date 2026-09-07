import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Deck } from '@/components/deck/Deck';
import { site } from '@/content/site';
import { slides } from '@/content/slides';
import { intersect } from '../mocks/intersection-observer';

function renderDeck() {
  render(<Deck slides={slides} photos={[]} site={site} />);
  return screen.getAllByRole('region');
}

function mockReducedMotion(matches: boolean) {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }));
}

describe('Deck', () => {
  test('renders one section per slide and starts the counter at 1', () => {
    const sections = renderDeck();
    expect(sections).toHaveLength(7);
    expect(sections[0]).toHaveAttribute('id', 'slide-title');
    expect(screen.getByTestId('deck-counter')).toHaveTextContent('1 / 7');
  });

  test('ArrowRight scrolls the next slide into view and advances the counter', async () => {
    const sections = renderDeck();
    await userEvent.keyboard('{ArrowRight}');
    const scroll = vi.mocked(Element.prototype.scrollIntoView);
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll.mock.contexts[0]).toBe(sections[1]);
    expect(screen.getByTestId('deck-counter')).toHaveTextContent('2 / 7');
  });

  test('Space advances and ArrowLeft goes back', async () => {
    renderDeck();
    await userEvent.keyboard(' ');
    expect(screen.getByTestId('deck-counter')).toHaveTextContent('2 / 7');
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByTestId('deck-counter')).toHaveTextContent('1 / 7');
  });

  test('PageDown advances and PageUp goes back', async () => {
    renderDeck();
    await userEvent.keyboard('{PageDown}');
    expect(screen.getByTestId('deck-counter')).toHaveTextContent('2 / 7');
    await userEvent.keyboard('{PageUp}');
    expect(screen.getByTestId('deck-counter')).toHaveTextContent('1 / 7');
  });

  test('the observer is the source of truth for the counter', () => {
    const sections = renderDeck();
    act(() => intersect(sections[3], true));
    expect(screen.getByTestId('deck-counter')).toHaveTextContent('4 / 7');
  });

  test('keys are ignored and the HUD hides when no slide is in view', async () => {
    const sections = renderDeck();
    act(() => intersect(sections[0], false));
    expect(screen.queryByTestId('deck-counter')).not.toBeInTheDocument();
    await userEvent.keyboard('{ArrowRight}');
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  test('a forward key on the last slide does not prevent the page from scrolling on', () => {
    const sections = renderDeck();
    act(() => intersect(sections[6], true));
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(false);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  test('a back key on the first slide does not prevent the page from scrolling on', () => {
    renderDeck();
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(false);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  test('clicking the current (last) slide does not scroll it again', async () => {
    const sections = renderDeck();
    act(() => intersect(sections[6], true));
    await userEvent.click(sections[6]);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  test('keys typed into a button are ignored', async () => {
    renderDeck();
    const next = screen.getByRole('button', { name: 'Next slide' });
    next.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  test('uses smooth scroll by default', async () => {
    renderDeck();
    await userEvent.keyboard('{ArrowRight}');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  test('uses instant scroll when the user prefers reduced motion', async () => {
    const original = window.matchMedia;
    window.matchMedia = mockReducedMotion(true);
    try {
      renderDeck();
      await userEvent.keyboard('{ArrowRight}');
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'instant',
        block: 'start',
      });
    } finally {
      window.matchMedia = original;
    }
  });

  test('a suppressed observer report reconciles once the scroll window ends', () => {
    vi.useFakeTimers();
    try {
      const sections = renderDeck();
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      });
      act(() => {
        window.dispatchEvent(event);
      });
      expect(screen.getByTestId('deck-counter')).toHaveTextContent('2 / 7');
      act(() => intersect(sections[4], true));
      expect(screen.getByTestId('deck-counter')).toHaveTextContent('2 / 7');
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(screen.getByTestId('deck-counter')).toHaveTextContent('5 / 7');
    } finally {
      vi.useRealTimers();
    }
  });

  test('a second goTo before the first reconcile fires keeps the newer index', () => {
    vi.useFakeTimers();
    try {
      const sections = renderDeck();
      const pressArrowRight = () => {
        const event = new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          cancelable: true,
        });
        act(() => {
          window.dispatchEvent(event);
        });
      };

      pressArrowRight();
      expect(screen.getByTestId('deck-counter')).toHaveTextContent('2 / 7');

      act(() => {
        vi.advanceTimersByTime(50);
      });
      // A stray report for an unrelated, still-visible slide: suppressed
      // because the first scroll's window (to +400 ms) is still open. It
      // deliberately outranks the eventual target (index 4 > index 2) so
      // that, if it wrongly survives to the final reconcile, the test would
      // catch it via Math.min rather than by masking it as a false pass.
      act(() => intersect(sections[4], true));

      act(() => {
        vi.advanceTimersByTime(150);
      }); // +200 ms total
      pressArrowRight(); // extends the window to +600 ms
      expect(screen.getByTestId('deck-counter')).toHaveTextContent('3 / 7');

      act(() => {
        vi.advanceTimersByTime(200);
      }); // +400 ms total: the stale reconcile must not fire here
      expect(screen.getByTestId('deck-counter')).toHaveTextContent('3 / 7');

      act(() => {
        vi.advanceTimersByTime(50);
      }); // +450 ms total
      act(() => intersect(sections[2], true));

      act(() => {
        vi.advanceTimersByTime(150);
      }); // +600 ms total: the window has closed
      expect(screen.getByTestId('deck-counter')).toHaveTextContent('3 / 7');
    } finally {
      vi.useRealTimers();
    }
  });

  test('a slide taller than the viewport is current once it covers 60% of it', () => {
    const sections = renderDeck();
    act(() => intersect(sections[2], true, 0.9));
    expect(screen.getByTestId('deck-counter')).toHaveTextContent('3 / 7');
    expect(screen.getByTestId('deck-hud')).toBeInTheDocument();
    act(() => intersect(sections[2], true, 0.3));
    expect(screen.queryByTestId('deck-hud')).not.toBeInTheDocument();
  });
});
