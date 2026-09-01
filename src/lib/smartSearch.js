import { facets } from '@/data/taxonomy';

/**
 * Busca em linguagem natural.
 *
 * O filtro clássico continua existindo — ele só deixou de ser
 * a primeira coisa que a pessoa vê. Aqui traduzimos frases como
 * "SUV automático até 100 mil" para o mesmo objeto de filtro
 * que os controles avançados manipulam.
 */

export const normalize = (str) =>
  String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();

/** "80" + "mil" -> 80000 | "80.000" -> 80000 | "80" (preço) -> 80000 */
const toAmount = (raw, unit, assumeThousands = true) => {
  const cleaned = String(raw).replace(/\./g, '').replace(',', '.');
  let n = Number.parseFloat(cleaned);
  if (Number.isNaN(n)) return null;
  if (unit && /^(mil|k)$/.test(unit)) n *= 1000;
  else if (assumeThousands && n < 1000) n *= 1000;
  return Math.round(n);
};

const BRAND_ALIASES = {
  vw: 'Volkswagen',
  volks: 'Volkswagen',
  mercedes: 'Mercedes-Benz',
  merc: 'Mercedes-Benz',
  benz: 'Mercedes-Benz',
  bmw: 'BMW',
  mini: 'MINI',
  chevrolet: 'Chevrolet',
  chevy: 'Chevrolet',
  gm: 'Chevrolet',
};

const BODY_TERMS = [
  [/\bsuvs?\b|\butilitario\b/, 'suv'],
  [/\bhatch(?:back)?\b|\bcompacto\b/, 'hatch'],
  [/\bseda(?:n|ns)?\b|\bsedans?\b/, 'sedan'],
  [/\bpicapes?\b|\bpick[\s-]?ups?\b|\bcaminhonetes?\b/, 'pickup'],
];

const FUEL_TERMS = [
  [/\bdiesel\b|\bturbodiesel\b/, 'Diesel'],
  [/\bflex\b|\betanol\b|\balcool\b/, 'Flex'],
  [/\bgasolina\b/, 'Gasolina'],
];

const UNIVERSE_TERMS = [
  [/\bperformance\b|\besportivos?\b|\bpotente\b|\bturbo\b/, 'performance'],
  [/\burban\b|\burbanos?\b|\bcidade\b/, 'urban'],
  [/\badventure\b|\baventura\b|\boff[\s-]?road\b|\btrilha\b|\b4x4\b/, 'adventure'],
  [/\bexecutive\b|\bexecutivos?\b|\bpremium\b|\bluxo\b/, 'executive'],
  [/\bfirst[\s-]?drive\b|\bprimeiro carro\b|\bentrada\b|\bbarato\b/, 'first-drive'],
];

const FEATURE_TERMS = [
  [/\bteto solar\b|\bteto panoramico\b|\bteto\b/, 'Teto solar'],
  [/\bcamera de re\b|\bcamera\b/, 'Câmera de ré'],
  [/\bcouro\b/, 'Bancos em couro'],
  [/\bled\b/, 'Faróis LED'],
  [/\bpiloto automatico\b/, 'Piloto automático'],
  [/\bpainel digital\b/, 'Painel digital'],
];

/**
 * @returns {{patch: object, tokens: string[], rest: string}}
 *   patch  — fragmento de filtro pronto para merge
 *   tokens — rótulos legíveis do que foi entendido (feedback na UI)
 *   rest   — o que sobrou, usado como busca textual livre
 */
export function parseQuery(input) {
  let text = ` ${normalize(input)} `;
  const patch = {};
  const tokens = [];

  const consume = (regex) => {
    text = text.replace(regex, ' ');
  };

  const push = (key, value) => {
    if (Array.isArray(patch[key])) {
      if (!patch[key].includes(value)) patch[key].push(value);
    } else {
      patch[key] = [value];
    }
  };

  /* --- 1. Ano ---
     Vem primeiro de propósito: "a partir de 2019" é ano, não preço mínimo.
     Só reconhecemos 19xx/20xx, então nenhum valor monetário cai aqui. */
  const YEAR = '(?:19|20)\\d{2}';

  const yearRange = text.match(new RegExp(`entre\\s*(${YEAR})\\s*e\\s*(${YEAR})`));
  const yearFrom = text.match(new RegExp(`(?:a partir de|acima de|apos|de)\\s*(${YEAR})`));
  const yearTo = text.match(new RegExp(`(?:ate|no maximo|max(?:imo)?)\\s*(${YEAR})`));

  if (yearRange) {
    patch.yearMin = Number(yearRange[1]);
    patch.yearMax = Number(yearRange[2]);
    tokens.push(`${yearRange[1]}–${yearRange[2]}`);
    consume(yearRange[0]);
  } else if (yearFrom) {
    patch.yearMin = Number(yearFrom[1]);
    tokens.push(`${yearFrom[1]} ou mais novo`);
    consume(yearFrom[0]);
  } else if (yearTo) {
    patch.yearMax = Number(yearTo[1]);
    tokens.push(`até ${yearTo[1]}`);
    consume(yearTo[0]);
  } else {
    const yearExact = text.match(new RegExp(`\\b(${YEAR})\\b`));
    if (yearExact) {
      patch.yearMin = Number(yearExact[1]);
      patch.yearMax = Number(yearExact[1]);
      tokens.push(yearExact[1]);
      consume(yearExact[0]);
    }
  }

  // --- 2. Quilometragem (antes de preço: "até 50 mil km" não é dinheiro) ---
  const kmMatch = text.match(
    /(?:ate|abaixo de|menos de|no maximo|max(?:imo)?)\s*([\d.,]+)\s*(mil|k)?\s*(?:km|quilometros?)/,
  );
  if (kmMatch) {
    const value = toAmount(kmMatch[1], kmMatch[2], true);
    if (value) {
      patch.kmMax = value;
      tokens.push(`até ${value.toLocaleString('pt-BR')} km`);
    }
    consume(kmMatch[0]);
  }

  // --- 3. Faixa de preço "entre X e Y" ---
  const rangeMatch = text.match(/entre\s*(?:r\$)?\s*([\d.,]+)\s*(mil|k)?\s*e\s*(?:r\$)?\s*([\d.,]+)\s*(mil|k)?/);
  if (rangeMatch) {
    const min = toAmount(rangeMatch[1], rangeMatch[2]);
    const max = toAmount(rangeMatch[3], rangeMatch[4]);
    if (min) patch.priceMin = min;
    if (max) patch.priceMax = max;
    if (min && max) tokens.push(`entre ${(min / 1000).toFixed(0)} e ${(max / 1000).toFixed(0)} mil`);
    consume(rangeMatch[0]);
  }

  // --- 4. Preço máximo ---
  const maxMatch = text.match(/(?:ate|abaixo de|menos de|no maximo|max(?:imo)?)\s*(?:r\$)?\s*([\d.,]+)\s*(mil|k)?/);
  if (maxMatch) {
    const value = toAmount(maxMatch[1], maxMatch[2]);
    if (value) {
      patch.priceMax = value;
      tokens.push(`até ${(value / 1000).toFixed(0)} mil`);
    }
    consume(maxMatch[0]);
  }

  // --- 5. Preço mínimo ---
  const minMatch = text.match(/(?:acima de|a partir de|mais de|min(?:imo)?)\s*(?:r\$)?\s*([\d.,]+)\s*(mil|k)?/);
  if (minMatch) {
    const value = toAmount(minMatch[1], minMatch[2]);
    if (value) {
      patch.priceMin = value;
      tokens.push(`acima de ${(value / 1000).toFixed(0)} mil`);
    }
    consume(minMatch[0]);
  }

  // --- 6. Câmbio ---
  if (/\bautomatic[oa]s?\b|\bautomatic\b|\bcvt\b|\bdsg\b|\bat\b/.test(text)) {
    push('transmissions', 'Automático');
    tokens.push('automático');
    consume(/\bautomatic[oa]s?\b|\bautomatic\b|\bcvt\b|\bdsg\b|\bat\b/g);
  }
  if (/\bmanuais?\b|\bmanual\b/.test(text)) {
    push('transmissions', 'Manual');
    tokens.push('manual');
    consume(/\bmanuais?\b|\bmanual\b/g);
  }

  // --- 7. Combustível ---
  FUEL_TERMS.forEach(([regex, value]) => {
    if (regex.test(text)) {
      push('fuels', value);
      tokens.push(value.toLowerCase());
      consume(new RegExp(regex.source, 'g'));
    }
  });

  // --- 8. Carroceria ---
  BODY_TERMS.forEach(([regex, value]) => {
    if (regex.test(text)) {
      push('bodies', value);
      tokens.push(value);
      consume(new RegExp(regex.source, 'g'));
    }
  });

  // --- 9. Marca (facetas reais + apelidos) ---
  facets.brands.forEach((brand) => {
    const needle = normalize(brand).split('-')[0];
    if (needle.length >= 3 && new RegExp(`\\b${needle}\\b`).test(text)) {
      push('brands', brand);
      tokens.push(brand);
      consume(new RegExp(`\\b${needle}\\b`, 'g'));
    }
  });
  Object.entries(BRAND_ALIASES).forEach(([alias, brand]) => {
    if (new RegExp(`\\b${alias}\\b`).test(text) && facets.brands.includes(brand)) {
      push('brands', brand);
      if (!tokens.includes(brand)) tokens.push(brand);
      consume(new RegExp(`\\b${alias}\\b`, 'g'));
    }
  });

  // --- 10. Opcionais ---
  FEATURE_TERMS.forEach(([regex, value]) => {
    if (regex.test(text)) {
      push('features', value);
      tokens.push(value.toLowerCase());
      consume(new RegExp(regex.source, 'g'));
    }
  });

  // --- 11. Universo editorial ---
  UNIVERSE_TERMS.forEach(([regex, value]) => {
    if (regex.test(text)) {
      push('universes', value);
      consume(new RegExp(regex.source, 'g'));
    }
  });

  // --- 12. Heurística "econômico" ---
  if (/\beconomic[oa]s?\b|\bbaixo consumo\b|\bgasta pouco\b/.test(text)) {
    patch.economy = true;
    tokens.push('econômico');
    consume(/\beconomic[oa]s?\b|\bbaixo consumo\b|\bgasta pouco\b/g);
  }

  const rest = text.replace(/\b(carro|carros|quero|procuro|um|uma|de|com|por|ate|e)\b/g, ' ').replace(/\s+/g, ' ').trim();

  return { patch, tokens, rest };
}

/** Sugestões exibidas abaixo do campo de busca. */
export const searchSuggestions = [
  'SUV até 100 mil',
  'automático até 90 mil',
  'Volkswagen turbo',
  'carro econômico',
  'picape diesel 4x4',
  'primeiro carro até 70 mil',
];
