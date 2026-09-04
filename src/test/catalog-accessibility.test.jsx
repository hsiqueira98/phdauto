import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Catalog from '@/pages/Catalog';

const renderCatalog = () => render(
  <>
    <button type="button">Antes do catálogo</button>
    <MemoryRouter initialEntries={['/colecao']}>
      <Catalog />
    </MemoryRouter>
    <button type="button">Depois do catálogo</button>
  </>,
);

afterEach(() => vi.restoreAllMocks());

describe('acessibilidade do catálogo', () => {
  it('informa o universo selecionado e a opção de mostrar tudo', () => {
    renderCatalog();
    const all = screen.getByRole('button', { name: 'Tudo' });
    const urban = screen.getByRole('button', { name: 'Urbano' });

    expect(all).toHaveAttribute('aria-pressed', 'true');
    expect(urban).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(urban);
    expect(urban).toHaveAttribute('aria-pressed', 'true');
    expect(all).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(all);
    expect(all).toHaveAttribute('aria-pressed', 'true');
    expect(urban).toHaveAttribute('aria-pressed', 'false');
  });

  it('mantém o foco nos filtros mobile e devolve ao botão ao fechar com Escape', () => {
    renderCatalog();
    const before = screen.getByRole('button', { name: 'Antes do catálogo' });
    const after = screen.getByRole('button', { name: 'Depois do catálogo' });
    const opener = screen.getByRole('button', { name: 'Filtros' });
    opener.focus();
    fireEvent.click(opener);

    const dialog = screen.getByRole('dialog', { name: 'Filtros da coleção' });
    const close = within(dialog).getByRole('button', { name: 'Fechar filtros' });
    const last = within(dialog).getByRole('button', { name: 'Perfil' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(close).toHaveFocus();
    expect(before).toHaveAttribute('inert');
    expect(after).toHaveAttribute('inert');

    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(close).toHaveFocus();

    fireEvent.keyDown(close, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(before).not.toHaveAttribute('inert');
    expect(after).not.toHaveAttribute('inert');
  });

  it('remove a inércia externa ao desmontar a página com filtros abertos', () => {
    const external = document.createElement('button');
    external.textContent = 'Controle externo';
    document.body.append(external);
    const { unmount } = renderCatalog();
    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));
    expect(external).toHaveAttribute('inert');
    unmount();
    expect(external).not.toHaveAttribute('inert');
    external.remove();
  });

  it('mantém o painel desktop não modal e permite navegar fora dos filtros', () => {
    const originalMatchMedia = window.matchMedia;
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      ...originalMatchMedia(query),
      matches: query === '(min-width: 1100px)',
    }));
    renderCatalog();
    const before = screen.getByRole('button', { name: 'Antes do catálogo' });
    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(before).not.toHaveAttribute('inert');
    before.focus();
    expect(before).toHaveFocus();
  });
});
