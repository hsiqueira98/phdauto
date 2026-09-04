import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCountUp, createMagneticButton } from '@/lib/animations';
import { gsap } from '@/lib/gsap';

const media = (reduced = false) => vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
  matches: query.includes('prefers-reduced-motion') ? reduced : true,
  media: query,
  addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
}));

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('motion runtime safeguards', () => {
  it('shows the final count immediately when reduced motion is requested', () => {
    media(true);
    const element = document.createElement('span');
    const animation = createCountUp(element, 1250);
    animation?.kill();
    expect(element.textContent).toBe('1.250');
  });

  it('restores the button transform and removes its pointer listeners on cleanup', () => {
    media();
    const button = document.createElement('button');
    document.body.append(button);
    const initialTransform = button.style.transform;
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 100, height: 40 });
    const cleanup = createMagneticButton(button);
    button.dispatchEvent(new MouseEvent('pointerenter', { clientX: 90, clientY: 30 }));
    button.dispatchEvent(new MouseEvent('pointermove', { clientX: 90, clientY: 30 }));
    gsap.getTweensOf(button).forEach((tween) => tween.progress(1));
    expect(button.style.transform).not.toBe(initialTransform);
    cleanup();
    expect(button.style.transform).toBe(initialTransform);
    button.dispatchEvent(new MouseEvent('pointermove', { clientX: 50, clientY: 20 }));
    expect(gsap.getTweensOf(button)).toHaveLength(0);
  });
});
