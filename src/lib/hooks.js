import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const previous = document.body.style.overflow;
    const previousPad = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = previous;
      document.body.style.paddingRight = previousPad;
    };
  }, [locked]);
}

export function useKeyDown(key, handler, active = true) {
  const saved = useRef(handler);
  saved.current = handler;

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.includes(e.key)) saved.current(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [key, active]);
}

/** Estado + setter que também aceita função parcial de patch. */
export function usePatchState(initial) {
  const [state, setState] = useState(initial);
  const patch = useCallback(
    (fragment) => setState((prev) => ({ ...prev, ...(typeof fragment === 'function' ? fragment(prev) : fragment) })),
    [],
  );
  return [state, patch, setState];
}
