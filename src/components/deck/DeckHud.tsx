'use client';

type Props = {
  index: number;
  total: number;
  visible: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const buttonClass =
  'rounded-full border border-stage-fg/30 px-3 py-1 hover:border-accent focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-30';

export function DeckHud({ index, total, visible, onPrev, onNext }: Props) {
  if (!visible) return null;
  return (
    <div
      data-testid="deck-hud"
      className="text-stage-fg bg-stage/85 fixed inset-x-0 bottom-0 z-10 flex items-center justify-end gap-6 px-6 py-4 text-sm backdrop-blur-sm md:px-16"
    >
      <p aria-live="polite" data-testid="deck-counter" className="tabular-nums">
        {index + 1} / {total}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          aria-label="Previous slide"
          className={buttonClass}
        >
          &larr;
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index === total - 1}
          aria-label="Next slide"
          className={buttonClass}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
