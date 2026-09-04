import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

// Bind React contexts to this exact engine instance (including CJS/ESM tests).
gsap.registerPlugin(ScrollTrigger, Observer, useGSAP);

/**
 * Defaults do "motor cinematográfico".
 * GSAP cuida de scroll, pin e sequências longas.
 * Motion (motion.dev) cuida de microinteração de UI.
 */
gsap.defaults({ ease: 'power3.out', duration: 0.9 });

export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, Observer };
