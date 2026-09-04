import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vehicles } from '@/data/vehicles';
import { estimateInstallment, formatPrice } from '@/lib/format';
import { facets } from '@/data/taxonomy';
import { Reveal } from '@/components/ui/atoms';

const STEPS = [
  { n: '01', title: 'Encontre seu carro', body: 'Explore a coleção e escolha um valor de referência.' },
  { n: '02', title: 'Visualize as parcelas', body: 'Ajuste a entrada e o prazo para explorar diferentes cenários.' },
  { n: '03', title: 'Converse sobre condições', body: 'Em uma contratação real, taxas e aprovação dependem da instituição financeira.' },
  { n: '04', title: 'Revise antes de decidir', body: 'Confira o custo total e as condições da proposta antes de assumir um compromisso.' },
];

export default function Financing() {
  const [price, setPrice] = useState(90000);
  const [months, setMonths] = useState(48);
  const [entryPct, setEntryPct] = useState(30);

  const installment = estimateInstallment(price, months, entryPct / 100);
  const affordable = vehicles.filter((v) => v.price <= price).length;

  return (
    <main className="page" id="conteudo">
      <header className="page__hero">
        <div className="shell">
          <div className="section-index meta">
            <span className="section-index__num">01</span>
            <span>Financiamento</span>
          </div>
          <Reveal>
            <h1 className="page__title t-display">
              A conta antes
              <br />
              da conversa.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="page__lead">
              Explore a entrada, o prazo e uma estimativa de parcela para o seu próximo
              carro. Esta é uma demonstração: os valores não representam uma oferta
              de crédito da POLLY VEÍCULOS.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="section fin">
        <div className="shell fin__shell">
          <div className="fin__sim">
            <div className="fin__result">
              <span className="meta">Parcela estimada</span>
              <span className="fin__value">{formatPrice(installment)}</span>
              <span className="meta">
                em {months}x · entrada de {formatPrice(price * (entryPct / 100))}
              </span>
            </div>

            <label className="fin__control">
              <span className="meta">Valor do veículo — {formatPrice(price)}</span>
              <input
                type="range"
                min={facets.priceMin}
                max={facets.priceMax}
                step="5000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </label>

            <label className="fin__control">
              <span className="meta">Entrada — {entryPct}%</span>
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={entryPct}
                onChange={(e) => setEntryPct(Number(e.target.value))}
              />
            </label>

            <label className="fin__control">
              <span className="meta">Prazo — {months} meses</span>
              <input
                type="range"
                min="12"
                max="60"
                step="12"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
              />
            </label>

            <Link to={`/colecao?priceMax=${price}`} className="btn btn--paper btn--full">
              Ver as {affordable} máquinas até {formatPrice(price)}
            </Link>

            <p className="fin__note meta">
              Simulação ilustrativa de protótipo — taxa fixa de referência, sem consulta a crédito.
            </p>
          </div>

          <ol className="fin__steps">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.07} className="fin__step">
                <span className="fin__step-n meta">{s.n}</span>
                <h2 className="fin__step-title">{s.title}</h2>
                <p>{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
