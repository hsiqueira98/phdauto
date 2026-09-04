import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';

const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Scroll suave global + sincronia com o ScrollTrigger.
 *
 * O Lenis vira a fonte da verdade do scroll e o GSAP passa a ser
 * atualizado por ele — sem isso, seções pinadas e scrub brigam com
 * a inércia e a experiência "treme".
 */
export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const desktop = useMediaQuery('(min-width: 960px) and (hover: hover) and (pointer: fine)');
  const reduced = useReducedMotion();

  useEffect(() => {
    // Touch devices keep their native momentum and never register a ticker.
    // These preferences are reactive, including changes while the page is open.
    if (!desktop || reduced) return undefined;

    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      prevent: (node) => Boolean(node.closest('dialog, [role="dialog"]')),
    });

    const unsubscribe = instance.on('scroll', ScrollTrigger.update);

    // One shared animation loop; a real clock avoids changing global GSAP
    // lag-smoothing settings for every animation elsewhere in the application.
    const tick = () => instance.raf(performance.now());
    gsap.ticker.add(tick);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      unsubscribe();
      instance.destroy();
      setLenis(null);
    };
  }, [desktop, reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Helper de navegação suave usado por âncoras e CTAs. */
export function useScrollTo() {
  const lenis = useLenis();
  const reduced = useReducedMotion();
  return useCallback((target, options = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis && !reduced) lenis.scrollTo(el, { offset: 0, duration: 1.1, ...options });
    else window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top + (options.offset ?? 0),
      behavior: reduced || options.immediate ? 'instant' : 'smooth',
    });
  }, [lenis, reduced]);
}
