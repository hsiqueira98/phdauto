import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SpecSequence from '@/components/vehicle/SpecSequence';
import DriveMode from '@/components/drivemode/DriveMode';
import { vehicles } from '@/data/vehicles';
import { gsap, ScrollTrigger } from '@/lib/gsap';

function motionPreference() {
  const queries = new Map();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
    if (!queries.has(query)) {
      const listeners = new Set();
      queries.set(query, {
        media: query, matches: false,
        addEventListener: (_, listener) => listeners.add(listener),
        removeEventListener: (_, listener) => listeners.delete(listener),
        addListener: (listener) => listeners.add(listener),
        removeListener: (listener) => listeners.delete(listener),
        listeners,
      });
    }
    return queries.get(query);
  });
  return (reduced) => act(() => {
    queries.forEach((query) => {
      if (!query.media.includes('prefers-reduced-motion')) return;
      query.matches = reduced;
      query.listeners.forEach((listener) => listener(query));
    });
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('animation lifecycle', () => {
  it('removes pinning when reduced motion is enabled during the session', () => {
    const setReduced = motionPreference();
    const view = render(<SpecSequence vehicle={vehicles[0]} />);
    const section = view.container.querySelector('.specseq');
    const pins = () => ScrollTrigger.getAll().filter((trigger) => trigger.trigger === section);
    expect(pins()).toHaveLength(1);
    setReduced(true);
    expect(pins()).toHaveLength(0);
    view.container.querySelectorAll('.specseq__numero').forEach((number) => {
      expect(number.textContent).toBe(number.dataset.valor);
    });
    setReduced(false);
    expect(pins()).toHaveLength(1);
    view.rerender(<SpecSequence vehicle={vehicles[1]} />);
    expect(pins()).toHaveLength(1);
    view.unmount();
    expect(pins()).toHaveLength(0);
  });

  it('stops active Drive Mode transitions when reduced motion is enabled', () => {
    const setReduced = motionPreference();
    const view = render(<MemoryRouter><DriveMode open onClose={() => {}} /></MemoryRouter>);
    const photo = view.container.querySelector('.mi__foto');
    expect(gsap.getTweensOf(photo).length).toBeGreaterThan(0);
    setReduced(true);
    expect(gsap.getTweensOf(photo)).toHaveLength(0);
    view.unmount();
    expect(gsap.getTweensOf(photo)).toHaveLength(0);
  });

  it('contains modal keyboard focus, isolates the background and restores the trigger', () => {
    motionPreference();
    const Example = ({ open }) => (
      <MemoryRouter>
        <button type="button">Abrir experiência</button>
        <DriveMode open={open} onClose={() => {}} />
      </MemoryRouter>
    );
    const view = render(<Example open={false} />);
    const opener = screen.getByRole('button', { name: 'Abrir experiência' });
    opener.focus();
    view.rerender(<Example open />);
    expect(screen.getByRole('button', { name: 'Sair' })).toHaveFocus();
    expect(opener).toHaveAttribute('inert');
    const first = screen.getByRole('button', { name: 'Som' });
    const last = screen.getByRole('button', { name: 'Próxima' });
    first.focus();
    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(first).toHaveFocus();
    view.rerender(<Example open={false} />);
    expect(opener).not.toHaveAttribute('inert');
    expect(opener).toHaveFocus();
    const exitingPanel = view.container.querySelector('.mi');
    if (exitingPanel) expect(exitingPanel).toHaveAttribute('inert');
  });
});
