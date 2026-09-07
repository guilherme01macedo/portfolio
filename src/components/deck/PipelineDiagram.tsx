'use client';

import { useId, useRef, useState } from 'react';
import type { DiagramStep } from '@/content/types';

export function PipelineDiagram({ steps }: { steps: DiagramStep[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();
  // A mouse click always arrives just after a synthetic mouseenter on the
  // same step, so a plain toggle-on-click would immediately close what the
  // hover just opened. This ref marks the step that a mouseenter just
  // revealed, so the click ending that same gesture is consumed (left open)
  // instead of toggled. It is cleared in two other places besides a matching
  // click: onMouseLeave, so a hover that never turned into a click can't
  // arm a later keyboard press on the same step, and onKeyDown, so any
  // keyboard interaction always runs the plain toggle (keyboard input has no
  // preceding mouseenter, so it never needs to be consumed). Keyboard
  // activation has no such preceding hover either way, so onFocus must never
  // arm this ref: it only opens the step outright.
  const consumeNextClick = useRef<number | null>(null);

  function hoverOpen(i: number) {
    if (open !== i) consumeNextClick.current = i;
    setOpen(i);
  }

  function toggle(i: number) {
    if (consumeNextClick.current === i) {
      consumeNextClick.current = null;
      return;
    }
    setOpen((current) => (current === i ? null : i));
  }

  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {steps.map((step, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-step-${i}`;
        return (
          <li key={step.label} className="flex flex-col gap-3">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(i)}
              onMouseEnter={() => hoverOpen(i)}
              onMouseLeave={() => {
                consumeNextClick.current = null;
              }}
              onFocus={() => setOpen(i)}
              onKeyDown={() => {
                consumeNextClick.current = null;
              }}
              className="border-stage-fg/30 hover:border-accent focus-visible:outline-accent aria-expanded:border-accent rounded-lg border px-4 py-3 text-left text-lg focus-visible:outline-2"
            >
              <span className="text-accent mr-2 font-mono">{i + 1}</span>
              {step.label}
            </button>
            <p
              id={panelId}
              hidden={!isOpen}
              className="text-stage-fg/80 text-base"
            >
              {step.role}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
