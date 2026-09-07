import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { clampIndex, deckReducer } from './deckReducer';
import { useReducedMotion } from './useReducedMotion';

/** Ignore observer reports for this long after a programmatic scroll starts. */
const PROGRAMMATIC_SCROLL_MS = 400;
/** A slide is "current" when it covers at least this fraction of the viewport. */
const VISIBLE_RATIO = 0.6;
/** Sample intersection ratio at every 5% step so partial coverage is reported. */
const OBSERVER_THRESHOLD = Array.from({ length: 21 }, (_, i) => i / 20);
const INTERACTIVE =
  'a, button, input, textarea, select, summary, [contenteditable]:not([contenteditable="false"])';

export function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(INTERACTIVE) !== null;
}

function isForwardKey(e: KeyboardEvent) {
  return (
    (e.key === ' ' && !e.shiftKey) ||
    e.key === 'ArrowRight' ||
    e.key === 'ArrowDown' ||
    e.key === 'PageDown'
  );
}

function isBackKey(e: KeyboardEvent) {
  return (
    (e.key === ' ' && e.shiftKey) ||
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowUp' ||
    e.key === 'PageUp'
  );
}

export function useDeck(total: number) {
  const [state, dispatch] = useReducer(deckReducer, { index: 0, total });
  const [inView, setInView] = useState(true);
  const reducedMotion = useReducedMotion();

  const slideEls = useRef<(HTMLElement | null)[]>([]);
  const registerSlideCache = useRef(
    new Map<number, (el: HTMLElement | null) => void>(),
  );
  const visible = useRef(new Set<number>());
  const programmaticUntil = useRef(0);
  const reconcileTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = state.index;
  }, [state.index]);

  const registerSlide = useCallback((i: number) => {
    const cached = registerSlideCache.current.get(i);
    if (cached) return cached;
    const ref = (el: HTMLElement | null) => {
      slideEls.current[i] = el;
    };
    registerSlideCache.current.set(i, ref);
    return ref;
  }, []);

  // Arm (or re-arm) the reconcile timer for `ms`. When it fires, the window
  // may have been extended since it was scheduled (a second goTo), so it
  // re-checks the window before dispatching and reschedules itself if the
  // window is still open.
  const scheduleReconcile = useCallback(function schedule(ms: number) {
    if (reconcileTimeout.current) clearTimeout(reconcileTimeout.current);
    reconcileTimeout.current = setTimeout(() => {
      reconcileTimeout.current = null;
      const remaining = programmaticUntil.current - Date.now();
      if (remaining > 0) {
        schedule(remaining);
        return;
      }
      if (visible.current.size > 0) {
        dispatch({ type: 'OBSERVED', index: Math.min(...visible.current) });
      }
    }, ms);
  }, []);

  const goTo = useCallback(
    (target: number): boolean => {
      const next = clampIndex(target, total);
      const el = slideEls.current[next];
      if (!el) return false;
      if (next === indexRef.current) return false;
      // A fresh scroll starts a fresh window; a reconcile scheduled for the
      // old one would otherwise fire mid-scroll and revert the counter.
      if (reconcileTimeout.current) {
        clearTimeout(reconcileTimeout.current);
        reconcileTimeout.current = null;
      }
      programmaticUntil.current = Date.now() + PROGRAMMATIC_SCROLL_MS;
      dispatch({ type: 'GOTO', index: next });
      indexRef.current = next;
      el.scrollIntoView({
        behavior: reducedMotion ? 'instant' : 'smooth',
        block: 'start',
      });
      return true;
    },
    [total, reducedMotion],
  );

  // The observer is the source of truth for the current index and for inView.
  useEffect(() => {
    const els = slideEls.current.filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = Number((entry.target as HTMLElement).dataset.slideIndex);
          const rootHeight = entry.rootBounds?.height || window.innerHeight;
          const covered =
            rootHeight > 0 ? entry.intersectionRect.height / rootHeight : 0;
          const isCurrent = covered >= VISIBLE_RATIO;
          if (isCurrent) visible.current.add(i);
          else visible.current.delete(i);
        }
        setInView(visible.current.size > 0);
        if (visible.current.size === 0) return;

        const remaining = programmaticUntil.current - Date.now();
        if (remaining > 0) {
          // A programmatic scroll is in flight: don't let this report fight
          // it, but don't drop it either. Reconcile once the window ends.
          scheduleReconcile(remaining);
          return;
        }
        dispatch({ type: 'OBSERVED', index: Math.min(...visible.current) });
      },
      { threshold: OBSERVER_THRESHOLD },
    );
    els.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      if (reconcileTimeout.current) clearTimeout(reconcileTimeout.current);
    };
  }, [total, scheduleReconcile]);

  // Keys are intents. They never write the index directly.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!inView || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey)
        return;
      if (isInteractiveTarget(e.target)) return;
      const forward = isForwardKey(e);
      const back = isBackKey(e);
      if (!forward && !back) return;
      const current = indexRef.current;
      // On the last slide, let the page scroll on into the body.
      if (forward && current >= total - 1) return;
      if (back && current <= 0) return;
      const moved = goTo(forward ? current + 1 : current - 1);
      if (moved) e.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inView, total, goTo]);

  return { index: state.index, total, inView, goTo, registerSlide };
}
