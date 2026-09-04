import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';

/**
 * Smoke test de renderização.
 * Não valida animação — valida que cada rota monta sem erro,
 * com a estrutura semântica esperada.
 */
const renderAt = (route) => {
  const view = render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Entrar no site' }));
  return view;
};

describe('rotas', () => {
  it('home monta com o headline do hero', () => {
    renderAt('/');
    // O h1 é dividido em linhas mascaradas; o nome acessível traz a frase inteira.
    expect(screen.getByRole('heading', { level: 1, name: /seu próximo capítulo começa ao volante/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /seu próximo capítulo.*do seu jeito/i })).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/PHD|1996|trinta anos/i);
    expect(screen.getByRole('link', { name: 'A POLLY' })).toHaveAttribute('href', '/polly');
  });

  it('catálogo lista os veículos e os controles de filtro', () => {
    renderAt('/colecao');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/a coleção/i);
    expect(screen.getByLabelText(/buscar por descrição/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filtros/i })).toBeInTheDocument();
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });

  it('catálogo respeita filtro vindo da URL', () => {
    renderAt('/colecao?bodies=pickup');
    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      expect(card.textContent).toMatch(/Picape/);
    });
  });

  it('página do veículo mostra marca, modelo e preço', () => {
    renderAt('/veiculo/volkswagen-golf-gti-2005');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/golf gti/i);
    expect(screen.getAllByText(/R\$\s?75\.000/).length).toBeGreaterThan(0);
  });

  it('slug inexistente cai no 404', () => {
    renderAt('/veiculo/nao-existe');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/não está no pátio/i);
  });

  it('páginas institucionais montam', () => {
    ['/vender', '/financiamento', '/polly', '/phd'].forEach((route) => {
      const { unmount } = renderAt(route);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      unmount();
    });
  });
});
