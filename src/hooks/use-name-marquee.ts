import { useLayoutEffect, useRef, type RefObject } from 'react';

const MARQUEE_CLASS = 'shelf-card__name--marquee';
const OVERFLOW_CLASS = 'shelf-card__name--overflow';
const SCROLL_WIDTH_PROPERTY = '--shelf-name-scroll-width';
const DURATION_PROPERTY = '--shelf-name-duration';
const MARQUEE_ANIMATION = 'shelf-card-name-marquee';

const PX_PER_SEC = 40;
const MIN_SCROLL_SEC = 1.5;

function getScroller(container: HTMLElement): HTMLElement | null {
  const scroller = container.firstElementChild;
  return scroller instanceof HTMLElement ? scroller : null;
}

function clearMarquee(container: HTMLElement, scroller: HTMLElement | null): void {
  container.classList.remove(MARQUEE_CLASS);
  if (scroller === null) {
    return;
  }
  scroller.style.removeProperty(SCROLL_WIDTH_PROPERTY);
  scroller.style.removeProperty(DURATION_PROPERTY);
}

function getFirstLabel(container: HTMLElement): HTMLElement | null {
  const first = getScroller(container)?.firstElementChild;
  return first instanceof HTMLElement ? first : null;
}

function syncOverflowHint(container: HTMLElement): void {
  const first = getFirstLabel(container);
  if (first === null || prefersReducedMotion()) {
    container.classList.remove(OVERFLOW_CLASS);
    return;
  }

  container.classList.toggle(OVERFLOW_CLASS, first.scrollWidth > container.clientWidth);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function restartMarquee(scroller: HTMLElement): void {
  scroller.style.animation = 'none';
  void scroller.offsetWidth;
  scroller.style.removeProperty('animation');
}

export function useNameMarquee(text: string): {
  nameRef: RefObject<HTMLSpanElement | null>;
  playMarquee: () => void;
} {
  const nameRef = useRef<HTMLSpanElement>(null);
  const onEndRef = useRef<((event: AnimationEvent) => void) | null>(null);

  const playMarquee = () => {
    const container = nameRef.current;
    if (container === null || prefersReducedMotion()) {
      return;
    }

    const scroller = getScroller(container);
    const first = scroller?.firstElementChild;
    const copy = scroller?.lastElementChild;
    if (
      scroller === null ||
      !(first instanceof HTMLElement) ||
      !(copy instanceof HTMLElement) ||
      first === copy
    ) {
      return;
    }

    if (first.scrollWidth <= container.clientWidth) {
      return;
    }

    container.classList.add(MARQUEE_CLASS);
    const distancePx = copy.offsetLeft - first.offsetLeft;
    if (distancePx <= 0) {
      clearMarquee(container, scroller);
      return;
    }

    const scrollSec = Math.max(MIN_SCROLL_SEC, distancePx / PX_PER_SEC);
    scroller.style.setProperty(SCROLL_WIDTH_PROPERTY, `${distancePx}px`);
    scroller.style.setProperty(DURATION_PROPERTY, `${scrollSec.toFixed(2)}s`);

    if (onEndRef.current !== null) {
      scroller.removeEventListener('animationend', onEndRef.current);
    }

    const onEnd = (event: AnimationEvent) => {
      if (event.target !== scroller || event.animationName !== MARQUEE_ANIMATION) {
        return;
      }
      scroller.removeEventListener('animationend', onEnd);
      onEndRef.current = null;
      clearMarquee(container, scroller);
    };

    onEndRef.current = onEnd;
    scroller.addEventListener('animationend', onEnd);
    restartMarquee(scroller);
  };

  useLayoutEffect(() => {
    const container = nameRef.current;
    if (container === null) {
      return;
    }

    let applying = false;
    const syncHint = () => {
      if (applying) {
        return;
      }
      applying = true;
      syncOverflowHint(container);
      applying = false;
    };

    syncHint();
    const observer = new ResizeObserver(syncHint);
    observer.observe(container);
    const first = getFirstLabel(container);
    if (first !== null) {
      observer.observe(first);
    }

    return () => {
      observer.disconnect();
      const scroller = getScroller(container);
      if (scroller !== null && onEndRef.current !== null) {
        scroller.removeEventListener('animationend', onEndRef.current);
        onEndRef.current = null;
      }
      container.classList.remove(OVERFLOW_CLASS);
      clearMarquee(container, scroller);
    };
  }, [text]);

  return { nameRef, playMarquee };
}
