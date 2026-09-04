import { useState } from 'react';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DriveMode from '@/components/drivemode/DriveMode';
import SpecSequence from '@/components/vehicle/SpecSequence';
import { vehicles } from '@/data/vehicles';
import { ScrollTrigger } from '@/lib/gsap';

function device({ width = 1440, height = 900, coarse = false } = {}) {
  const queries = new Map();
  const matches = (query) => query.split(',').some((part) => {
    if (part.includes('prefers-reduced-motion')) return false;
    if (part.includes('pointer: coarse')) return coarse;
    const maxWidth = part.match(/max-width:\s*(\d+)px/);
    const maxHeight = part.match(/max-height:\s*(\d+)px/);
    return maxWidth ? width <= Number(maxWidth[1]) : maxHeight ? height <= Number(maxHeight[1]) : false;
  });
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
    if (!queries.has(query)) {
      const listeners = new Set();
      queries.set(query, {
        media: query, matches: matches(query),
        addEventListener: (_, listener) => listeners.add(listener),
        removeEventListener: (_, listener) => listeners.delete(listener),
        addListener: (listener) => listeners.add(listener),
        removeListener: (listener) => listeners.delete(listener),
        listeners,
      });
    }
    return queries.get(query);
  });
  return (next) => act(() => {
    ({ width = width, height = height, coarse = coarse } = next);
    queries.forEach((query) => {
      query.matches = matches(query.media);
      query.listeners.forEach((listener) => listener(query));
    });
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('mobile vehicle experiences', () => {
  it.each([
    { width: 390, height: 844, coarse: false },
    { width: 1024, height: 768, coarse: true },
    { width: 844, height: 320, coarse: false },
  ])('shows every highlight without a pinned scroll sequence on $width×$height, coarse=$coarse', (viewport) => {
    device(viewport);
    const view = render(<SpecSequence vehicle={vehicles[0]} />);
    const section = screen.getByRole('region', { name: 'Destaques do veículo' });
    expect(ScrollTrigger.getAll().filter((trigger) => trigger.trigger === section)).toHaveLength(0);
    const highlights = view.container.querySelector('.specseq__etapas');
    for (const text of ['1.8 TURBO', '180 CV', 'MANUAL', '2005']) {
      expect(within(highlights).getByText(text)).toBeVisible();
    }
    expect(view.container.querySelector('.pin-spacer')).not.toBeInTheDocument();
  });

  it('restores cinematic pinning only when a resized screen becomes roomy with a fine pointer', () => {
    const resize = device();
    render(<SpecSequence vehicle={vehicles[0]} />);
    const section = screen.getByRole('region', { name: 'Destaques do veículo' });
    const pins = () => ScrollTrigger.getAll().filter((trigger) => trigger.trigger === section);
    expect(pins()).toHaveLength(1);
    resize({ width: 390 });
    expect(pins()).toHaveLength(0);
    resize({ width: 1440 });
    expect(pins()).toHaveLength(1);
  });

  it('uses primary next/previous controls on touch screens and restores focus after closing', async () => {
    device({ width: 390, height: 844, coarse: true });
    function Example() {
      const [open, setOpen] = useState(false);
      return <MemoryRouter>
        <button type="button" onClick={() => setOpen(true)}>Abrir experiência</button>
        <DriveMode open={open} onClose={() => setOpen(false)} />
      </MemoryRouter>;
    }
    render(<Example />);
    const opener = screen.getByRole('button', { name: 'Abrir experiência' });
    opener.focus();
    fireEvent.click(opener);
    const dialog = screen.getByRole('dialog');
    // Tiny per-car markers must not remain a second, inaccessible touch navigation.
    expect(within(dialog).queryByRole('button', { name: 'Volkswagen Golf GTI' })).not.toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: 'Ver máquina' })).toHaveAttribute('href', '/veiculo/volkswagen-golf-gti-2005');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Próxima' }));
    expect(within(dialog).getByRole('link', { name: 'Ver máquina' })).toHaveAttribute('href', '/veiculo/volkswagen-nivus-highline-2021');
    await act(() => new Promise((resolve) => setTimeout(resolve, 450)));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Anterior' }));
    expect(within(dialog).getByRole('link', { name: 'Ver máquina' })).toHaveAttribute('href', '/veiculo/volkswagen-golf-gti-2005');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Sair' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(opener).not.toHaveAttribute('inert');
  });
});
