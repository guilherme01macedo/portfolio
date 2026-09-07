type Observed = {
  callback: IntersectionObserverCallback;
  elements: Set<Element>;
};

const observers: Observed[] = [];

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private readonly elements = new Set<Element>();

  constructor(private readonly callback: IntersectionObserverCallback) {
    observers.push({ callback, elements: this.elements });
  }

  observe(el: Element) {
    this.elements.add(el);
  }
  unobserve(el: Element) {
    this.elements.delete(el);
  }
  disconnect() {
    this.elements.clear();
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

export function installIntersectionObserverMock() {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}

/**
 * Simulate the browser reporting one element entering or leaving the viewport.
 * `coverage` is the fraction of the (800px-tall) viewport the element covers;
 * it defaults to fully covering (1) when intersecting and none (0) when not,
 * but a test can pass a smaller fraction to simulate a slide taller than the
 * viewport.
 */
export function intersect(
  el: Element,
  isIntersecting: boolean,
  coverage: number = isIntersecting ? 1 : 0,
) {
  for (const observer of observers) {
    if (!observer.elements.has(el)) continue;
    const entry = {
      target: el,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: { height: coverage * 800 },
      rootBounds: { height: 800 },
    } as IntersectionObserverEntry;
    observer.callback([entry], observer as unknown as IntersectionObserver);
  }
}
