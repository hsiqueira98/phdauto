import { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Preloader from '@/components/layout/Preloader';

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('carregamento inicial', () => {
  it('libera a página assim que a imagem está pronta e a entrada visual termina', async () => {
    vi.useFakeTimers();
    const done = vi.fn();
    render(<><main id="conteudo"><img src="/capa.jpg" fetchPriority="high" alt="" /></main><Preloader onDone={done} /></>);
    fireEvent.load(document.querySelector('#conteudo img'));
    await act(() => vi.advanceTimersByTimeAsync(2999));
    expect(done).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(done).toHaveBeenCalledOnce();
  });

  it('libera a página uma única vez se a imagem principal não responder', async () => {
    vi.useFakeTimers();
    const done = vi.fn();
    render(<StrictMode><main id="conteudo"><img src="/pendente.jpg" fetchPriority="high" alt="" /></main><Preloader onDone={done} /></StrictMode>);
    await act(() => vi.advanceTimersByTimeAsync(2999));
    expect(done).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(done).toHaveBeenCalledTimes(1);
    fireEvent.load(document.querySelector('#conteudo img'));
    await act(() => vi.advanceTimersByTimeAsync(4000));
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('permite entrar diretamente enquanto um recurso está pendente', () => {
    const done = vi.fn();
    render(<Preloader onDone={done} />);
    fireEvent.click(screen.getByRole('button', { name: 'Entrar no site' }));
    expect(done).toHaveBeenCalledOnce();
  });

  it('remove temporizadores e bloqueio de rolagem quando desmontado cedo', async () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const { unmount } = render(<Preloader onDone={done} />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    await act(() => vi.advanceTimersByTimeAsync(5000));
    expect(done).not.toHaveBeenCalled();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
