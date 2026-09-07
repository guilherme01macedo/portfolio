'use client';

import type { MouseEvent, ReactNode, Ref } from 'react';
import { isInteractiveTarget } from './useDeck';

type Props = {
  id: string;
  index: number;
  label: string;
  ref: Ref<HTMLElement>;
  onAdvance: () => void;
  children: ReactNode;
};

export function SlideSection({
  id,
  index,
  label,
  ref,
  onAdvance,
  children,
}: Props) {
  const onClick = (e: MouseEvent<HTMLElement>) => {
    if (isInteractiveTarget(e.target)) return;
    if (window.getSelection()?.toString()) return;
    onAdvance();
  };
  return (
    <section
      id={id}
      ref={ref}
      data-slide-index={index}
      aria-label={label}
      onClick={onClick}
      className="flex min-h-dvh snap-start flex-col justify-center px-6 py-16 md:px-16"
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}
