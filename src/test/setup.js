import '@testing-library/jest-dom/vitest';
import { afterAll } from 'vitest';

/**
 * Polyfills mínimos para o jsdom.
 * GSAP/ScrollTrigger, Lenis e Motion consultam estas APIs no mount —
 * sem elas nenhum componente do projeto renderiza em teste.
 */

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  });
}

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (!window.IntersectionObserver) window.IntersectionObserver = MockObserver;
if (!window.ResizeObserver) window.ResizeObserver = MockObserver;

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
  window.cancelAnimationFrame = (id) => clearTimeout(id);
}

if (!Element.prototype.scrollTo) Element.prototype.scrollTo = () => {};
// jsdom expõe esta função, mas sua implementação apenas emite erro.
window.scrollTo = () => {};

if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
}

// Encerra os relógios globais antes de o jsdom remover requestAnimationFrame.
afterAll(async () => {
  const { gsap, ScrollTrigger } = await import('@/lib/gsap');
  ScrollTrigger.disable(true, true);
  gsap.globalTimeline.clear();
  gsap.ticker.sleep();
});
