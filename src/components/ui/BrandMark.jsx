/** Wordmark vetorial de apresentação inspirado na referência da POLLY. */
export default function BrandMark({ className = '' }) {
  return <span className={`polly-brand ${className}`} role="img" aria-label="POLLY VEÍCULOS">
    <svg className="polly-brand__roof" viewBox="0 0 220 31" fill="none" aria-hidden="true"><path d="M5 28C37 26 53 7 89 5c29-2 47 4 68 17l55 7" stroke="currentColor" strokeWidth="2.4" /><path d="m39 27 135 1" stroke="#e2232d" strokeWidth="2" /></svg>
    <span className="polly-brand__name" aria-hidden="true"><b>P</b>OLLY</span>
    <span className="polly-brand__caption" aria-hidden="true">VEÍCULOS</span>
  </span>;
}
