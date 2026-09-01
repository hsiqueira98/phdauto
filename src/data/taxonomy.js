import { vehicles } from './vehicles';

/**
 * Camada editorial sobre o estoque.
 * Tecnicamente os carros continuam sendo hatch/sedan/suv/pickup —
 * os "universos" são só a forma como a PHD escolhe apresentá-los.
 */
export const universes = [
  {
    id: 'performance',
    label: 'Performance',
    question: 'Para quem sente falta de dirigir.',
    body: 'Turbo, câmbio que responde e a suspeita de que o caminho mais longo é o certo.',
    index: '01',
  },
  {
    id: 'urban',
    label: 'Urbano',
    question: 'Para quem mede a cidade em minutos.',
    body: 'Compactos que resolvem vaga, consumo e trânsito sem virar sacrifício.',
    index: '02',
  },
  {
    id: 'adventure',
    label: 'Aventura',
    question: 'Para quando o asfalto acaba.',
    body: 'SUVs e picapes com altura, tração e caçamba de verdade.',
    index: '03',
  },
  {
    id: 'executive',
    label: 'Executivo',
    question: 'Para quem chega antes da apresentação.',
    body: 'Sedãs e premium com acabamento que sustenta a primeira impressão.',
    index: '04',
  },
  {
    id: 'first-drive',
    label: 'Primeiro carro',
    question: 'Para o primeiro que é seu.',
    body: 'Entrada acessível, manutenção previsível e nenhuma armadilha escondida.',
    index: '05',
  },
];

export const getUniverse = (id) => universes.find((u) => u.id === id);

export const bodyLabels = {
  hatch: 'Hatch',
  sedan: 'Sedã',
  suv: 'SUV',
  pickup: 'Picape',
};

export const timeline = [
  {
    year: '1996',
    title: 'Começamos vendendo carros.',
    body: 'Uma loja em Brasília, um estoque pequeno e a ideia de que a palavra dada valia mais que a placa.',
  },
  {
    year: '2006',
    title: 'Continuamos escolhendo carros.',
    body: 'Dez anos depois, a seleção ficou mais rígida. Nem todo carro bom para vender é um carro bom para entregar.',
  },
  {
    year: '2016',
    title: 'Milhares de histórias passaram por aqui.',
    body: 'Primeiro carro, carro da família, carro que levou alguém para longe. Todos passaram pelo mesmo pátio.',
  },
  {
    year: '2026',
    title: 'Escolher um carro deveria ser especial.',
    body: 'Trinta anos depois, continuamos acreditando na mesma coisa. Só mudamos a forma de mostrar.',
  },
];

/* ---------- Facetas derivadas do estoque (nada hard-coded) ---------- */

const uniqueSorted = (arr) => [...new Set(arr)].sort((a, b) => String(a).localeCompare(String(b), 'pt-BR'));

export const facets = {
  brands: uniqueSorted(vehicles.map((v) => v.brand)),
  bodies: uniqueSorted(vehicles.map((v) => v.body)),
  transmissions: uniqueSorted(vehicles.map((v) => v.transmission)),
  fuels: uniqueSorted(vehicles.map((v) => v.fuel)),
  colors: uniqueSorted(vehicles.map((v) => v.color)),
  features: uniqueSorted(vehicles.flatMap((v) => v.features)),
  priceMin: Math.floor(Math.min(...vehicles.map((v) => v.price)) / 5000) * 5000,
  priceMax: Math.ceil(Math.max(...vehicles.map((v) => v.price)) / 5000) * 5000,
  yearMin: Math.min(...vehicles.map((v) => v.year)),
  yearMax: Math.max(...vehicles.map((v) => v.year)),
  kmMax: Math.ceil(Math.max(...vehicles.map((v) => v.km)) / 10000) * 10000,
};

/** Amostra de opcionais que vale expor como filtro rápido. */
export const quickFeatures = [
  'Teto solar',
  'Câmera de ré',
  'Bancos em couro',
  'Faróis LED',
  'Piloto automático',
  'Painel digital',
];

export const colorSwatches = vehicles.reduce((acc, v) => {
  if (!acc[v.color]) acc[v.color] = v.hex;
  return acc;
}, {});

export const sortOptions = [
  { id: 'curadoria', label: 'Curadoria PHD' },
  { id: 'preco-asc', label: 'Menor preço' },
  { id: 'preco-desc', label: 'Maior preço' },
  { id: 'ano-desc', label: 'Mais novo' },
  { id: 'km-asc', label: 'Menor quilometragem' },
];
