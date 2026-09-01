import { facets } from '@/data/taxonomy';
import { normalize } from './smartSearch';

export const emptyFilters = {
  q: '',
  universes: [],
  brands: [],
  bodies: [],
  transmissions: [],
  fuels: [],
  colors: [],
  features: [],
  priceMin: facets.priceMin,
  priceMax: facets.priceMax,
  yearMin: facets.yearMin,
  yearMax: facets.yearMax,
  kmMax: facets.kmMax,
  economy: false,
  sort: 'curadoria',
};

export const createFilters = (patch = {}) => ({ ...emptyFilters, ...patch });

/** Cilindrada extraída de "1.8 Turbo" / "3.0 V6 TDI". */
const displacement = (engine) => {
  const m = String(engine).match(/(\d\.\d)/);
  return m ? Number.parseFloat(m[1]) : null;
};

const isEconomic = (v) => {
  const d = displacement(v.engine);
  return v.fuel !== 'Diesel' && d !== null && d <= 1.6 && v.power <= 130;
};

const matchesText = (v, q) => {
  if (!q) return true;
  const needle = normalize(q);
  if (!needle) return true;
  const haystack = normalize(
    [v.brand, v.model, v.version, v.engine, v.color, v.transmission, v.fuel, ...v.features].join(' '),
  );
  return needle.split(/\s+/).every((word) => haystack.includes(word));
};

const inList = (list, value) => list.length === 0 || list.includes(value);

export function applyFilters(vehicles, f) {
  return vehicles.filter((v) => {
    if (!inList(f.universes, v.universe)) return false;
    if (!inList(f.brands, v.brand)) return false;
    if (!inList(f.bodies, v.body)) return false;
    if (!inList(f.transmissions, v.transmission)) return false;
    if (!inList(f.fuels, v.fuel)) return false;
    if (!inList(f.colors, v.color)) return false;
    if (f.features.length && !f.features.every((feat) => v.features.includes(feat))) return false;
    if (v.price < f.priceMin || v.price > f.priceMax) return false;
    if (v.year < f.yearMin || v.year > f.yearMax) return false;
    if (v.km > f.kmMax) return false;
    if (f.economy && !isEconomic(v)) return false;
    if (!matchesText(v, f.q)) return false;
    return true;
  });
}

const CURATION_ORDER = ['performance', 'executive', 'adventure', 'urban', 'first-drive'];

export function sortVehicles(list, sort) {
  const out = [...list];
  switch (sort) {
    case 'preco-asc':
      return out.sort((a, b) => a.price - b.price);
    case 'preco-desc':
      return out.sort((a, b) => b.price - a.price);
    case 'ano-desc':
      return out.sort((a, b) => b.year - a.year || a.km - b.km);
    case 'km-asc':
      return out.sort((a, b) => a.km - b.km);
    default:
      // Curadoria: destaques primeiro, depois pela ordem editorial dos universos.
      return out.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          CURATION_ORDER.indexOf(a.universe) - CURATION_ORDER.indexOf(b.universe) ||
          b.price - a.price,
      );
  }
}

/** Chips do que está ativo, com o callback de remoção já resolvido. */
export function activeChips(f) {
  const chips = [];
  const arrayKeys = [
    ['universes', (x) => x],
    ['brands', (x) => x],
    ['bodies', (x) => x],
    ['transmissions', (x) => x],
    ['fuels', (x) => x],
    ['colors', (x) => x],
    ['features', (x) => x],
  ];

  arrayKeys.forEach(([key, label]) => {
    f[key].forEach((value) => chips.push({ key, value, label: label(value) }));
  });

  if (f.q) chips.push({ key: 'q', value: '', label: `"${f.q}"` });
  if (f.economy) chips.push({ key: 'economy', value: false, label: 'econômico' });
  if (f.priceMin !== emptyFilters.priceMin || f.priceMax !== emptyFilters.priceMax) {
    chips.push({
      key: 'price',
      value: null,
      label: `${(f.priceMin / 1000).toFixed(0)}–${(f.priceMax / 1000).toFixed(0)} mil`,
    });
  }
  if (f.yearMin !== emptyFilters.yearMin || f.yearMax !== emptyFilters.yearMax) {
    chips.push({ key: 'year', value: null, label: `${f.yearMin}–${f.yearMax}` });
  }
  if (f.kmMax !== emptyFilters.kmMax) {
    chips.push({ key: 'km', value: null, label: `até ${(f.kmMax / 1000).toFixed(0)} mil km` });
  }

  return chips;
}

export function removeChip(f, chip) {
  const next = { ...f };
  switch (chip.key) {
    case 'q':
      next.q = '';
      break;
    case 'economy':
      next.economy = false;
      break;
    case 'price':
      next.priceMin = emptyFilters.priceMin;
      next.priceMax = emptyFilters.priceMax;
      break;
    case 'year':
      next.yearMin = emptyFilters.yearMin;
      next.yearMax = emptyFilters.yearMax;
      break;
    case 'km':
      next.kmMax = emptyFilters.kmMax;
      break;
    default:
      next[chip.key] = f[chip.key].filter((x) => x !== chip.value);
  }
  return next;
}

export const countActive = (f) => activeChips(f).length;

/** Serializa para a URL — deep-link de qualquer combinação de filtros. */
export function filtersToParams(f) {
  const params = new URLSearchParams();
  Object.entries(f).forEach(([key, value]) => {
    if (key === 'sort' && value === emptyFilters.sort) return;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(','));
    } else if (typeof value === 'boolean') {
      if (value) params.set(key, '1');
    } else if (value !== '' && value !== emptyFilters[key]) {
      params.set(key, String(value));
    }
  });
  return params;
}

export function paramsToFilters(params) {
  const f = createFilters();
  const arrays = ['universes', 'brands', 'bodies', 'transmissions', 'fuels', 'colors', 'features'];
  arrays.forEach((key) => {
    const raw = params.get(key);
    if (raw) f[key] = raw.split(',').filter(Boolean);
  });
  ['priceMin', 'priceMax', 'yearMin', 'yearMax', 'kmMax'].forEach((key) => {
    const raw = params.get(key);
    if (raw && !Number.isNaN(Number(raw))) f[key] = Number(raw);
  });
  if (params.get('q')) f.q = params.get('q');
  if (params.get('economy') === '1') f.economy = true;
  if (params.get('sort')) f.sort = params.get('sort');
  return f;
}
