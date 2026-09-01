const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const int = new Intl.NumberFormat('pt-BR');

export const formatPrice = (value) => brl.format(value);

/** "R$ 129.900" sem o símbolo, para uso em layouts editoriais. */
export const formatPriceBare = (value) => int.format(value);

export const formatKm = (value) => `${int.format(value)} km`;

export const formatNumber = (value) => int.format(value);

/** 129900 -> "129,9 mil" (usado em chips e resumos curtos). */
export const formatCompact = (value) => {
  if (value >= 1000) {
    const n = value / 1000;
    return `${int.format(Number.isInteger(n) ? n : Number(n.toFixed(1)))} mil`;
  }
  return int.format(value);
};

export const pad2 = (n) => String(n).padStart(2, '0');

/** Número de parcelas fictício, apenas para a UI de simulação. */
export const estimateInstallment = (price, months = 48, entryRatio = 0.3, rate = 0.0169) => {
  const financed = price * (1 - entryRatio);
  const factor = (rate * (1 + rate) ** months) / ((1 + rate) ** months - 1);
  return financed * factor;
};
