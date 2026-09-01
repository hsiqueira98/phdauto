import { describe, expect, it } from 'vitest';
import { parseQuery } from './smartSearch';
import { applyFilters, createFilters, paramsToFilters, filtersToParams, sortVehicles } from './filtering';
import { vehicles } from '@/data/vehicles';

const run = (q) => {
  const { patch, rest } = parseQuery(q);
  return applyFilters(vehicles, createFilters({ ...patch, q: rest }));
};

describe('parseQuery', () => {
  it('entende carroceria + teto de preço', () => {
    const { patch } = parseQuery('SUV até 100 mil');
    expect(patch.bodies).toEqual(['suv']);
    expect(patch.priceMax).toBe(100000);
  });

  it('entende câmbio automático', () => {
    const { patch } = parseQuery('carro automático até 90 mil');
    expect(patch.transmissions).toContain('Automático');
    expect(patch.priceMax).toBe(90000);
  });

  it('não confunde quilometragem com dinheiro', () => {
    const { patch } = parseQuery('até 60 mil km');
    expect(patch.kmMax).toBe(60000);
    expect(patch.priceMax).toBeUndefined();
  });

  it('reconhece marca por apelido', () => {
    const { patch } = parseQuery('vw turbo');
    expect(patch.brands).toContain('Volkswagen');
  });

  it('reconhece faixa "entre X e Y"', () => {
    const { patch } = parseQuery('entre 80 e 120 mil');
    expect(patch.priceMin).toBe(80000);
    expect(patch.priceMax).toBe(120000);
  });

  it('reconhece ano mínimo', () => {
    const { patch } = parseQuery('sedan a partir de 2019');
    expect(patch.yearMin).toBe(2019);
  });

  it('aplica heurística de econômico', () => {
    const { patch } = parseQuery('carro econômico');
    expect(patch.economy).toBe(true);
  });
});

describe('applyFilters', () => {
  it('SUV até 100 mil devolve apenas SUVs dentro do teto', () => {
    const out = run('SUV até 100 mil');
    expect(out.length).toBeGreaterThan(0);
    out.forEach((v) => {
      expect(v.body).toBe('suv');
      expect(v.price).toBeLessThanOrEqual(100000);
    });
  });

  it('picape diesel 4x4 devolve apenas picapes a diesel', () => {
    const out = run('picape diesel');
    expect(out.length).toBeGreaterThan(0);
    out.forEach((v) => {
      expect(v.body).toBe('pickup');
      expect(v.fuel).toBe('Diesel');
    });
  });

  it('econômico exclui diesel e motores grandes', () => {
    const out = run('carro econômico');
    expect(out.length).toBeGreaterThan(0);
    out.forEach((v) => {
      expect(v.fuel).not.toBe('Diesel');
      expect(v.power).toBeLessThanOrEqual(130);
    });
  });

  it('busca livre encontra por modelo', () => {
    const out = run('golf');
    expect(out.map((v) => v.model)).toContain('Golf GTI');
  });

  it('combinação impossível devolve vazio', () => {
    const out = run('Mercedes até 40 mil');
    expect(out).toHaveLength(0);
  });
});

describe('ordenação', () => {
  it('menor preço ordena crescente', () => {
    const out = sortVehicles(vehicles, 'preco-asc');
    for (let i = 1; i < out.length; i += 1) {
      expect(out[i].price).toBeGreaterThanOrEqual(out[i - 1].price);
    }
  });

  it('mais novo ordena por ano decrescente', () => {
    const out = sortVehicles(vehicles, 'ano-desc');
    for (let i = 1; i < out.length; i += 1) {
      expect(out[i].year).toBeLessThanOrEqual(out[i - 1].year);
    }
  });
});

describe('estado na URL', () => {
  it('serializa e desserializa sem perder filtros', () => {
    const original = createFilters({
      brands: ['Volkswagen', 'Jeep'],
      bodies: ['suv'],
      priceMax: 120000,
      economy: true,
      sort: 'preco-asc',
    });

    const restored = paramsToFilters(filtersToParams(original));

    expect(restored.brands).toEqual(['Volkswagen', 'Jeep']);
    expect(restored.bodies).toEqual(['suv']);
    expect(restored.priceMax).toBe(120000);
    expect(restored.economy).toBe(true);
    expect(restored.sort).toBe('preco-asc');
  });

  it('URL vazia devolve os filtros padrão', () => {
    const restored = paramsToFilters(new URLSearchParams());
    expect(applyFilters(vehicles, restored)).toHaveLength(vehicles.length);
  });
});
