import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

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
  const rafRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const instance = new Lenis({
      duration: 1.15,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    });

    instance.on('scroll', ScrollTrigger.update);

    rafRef.current = (time) => instance.raf(time * 1000);
    gsap.ticker.add(rafRef.current);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Helper de navegação suave usado por âncoras e CTAs. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target, options = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4, ...options });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}
