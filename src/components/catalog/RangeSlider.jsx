import { useId } from 'react';

/**
 * Slider de faixa com dois polegares.
 * Dois inputs range sobrepostos — funciona por teclado e leitor de tela,
 * que é o motivo de não ser uma implementação só com divs e ponteiro.
 */
export default function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  format = (v) => v,
  label,
}) {
  const uid = useId().replace(/:/g, '');
  const [lo, hi] = value;
  const span = max - min || 1;

  const startPct = ((lo - min) / span) * 100;
  const endPct = ((hi - min) / span) * 100;

  const setLow = (raw) => {
    const next = Math.min(Number(raw), hi - step);
    onChange([Math.max(min, next), hi]);
  };

  const setHigh = (raw) => {
    const next = Math.max(Number(raw), lo + step);
    onChange([lo, Math.min(max, next)]);
  };

  return (
    <div className="range">
      <div className="range__head">
        <span className="meta">{label}</span>
        <span className="range__value">
          {format(lo)} <span className="range__dash">—</span> {format(hi)}
        </span>
      </div>

      <div className="range__track range__track--dual">
        <span className="range__rail" />
        <span
          className="range__fill"
          style={{ left: `${startPct}%`, right: `${100 - endPct}%` }}
        />

        <label className="range__label" htmlFor={`${uid}-lo`}>
          {label} — mínimo
        </label>
        <input
          id={`${uid}-lo`}
          className="range__input range__input--lo"
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-valuetext={String(format(lo))}
          onChange={(e) => setLow(e.target.value)}
        />

        <label className="range__label" htmlFor={`${uid}-hi`}>
          {label} — máximo
        </label>
        <input
          id={`${uid}-hi`}
          className="range__input range__input--hi"
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-valuetext={String(format(hi))}
          onChange={(e) => setHigh(e.target.value)}
        />
      </div>
    </div>
  );
}

/** Variante de um polegar só — usada para "até X km". */
export function MaxSlider({ min, max, step = 1, value, onChange, format = (v) => v, label }) {
  const uid = useId().replace(/:/g, '');
  const pct = ((value - min) / (max - min || 1)) * 100;

  return (
    <div className="range">
      <div className="range__head">
        <span className="meta">{label}</span>
        <span className="range__value">até {format(value)}</span>
      </div>
      <div className="range__track">
        <span className="range__rail" />
        <span className="range__fill" style={{ left: '0%', right: `${100 - pct}%` }} />
        <label className="sr-only" htmlFor={`${uid}-max`}>
          {label}
        </label>
        <input
          id={`${uid}-max`}
          className="range__input range__input--hi"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={String(format(value))}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
