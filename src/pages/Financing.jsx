import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vehicles } from '@/data/vehicles';
import { estimateInstallment, formatPrice } from '@/lib/format';
import { facets } from '@/data/taxonomy';
import { Reveal } from '@/components/ui/atoms';

const STEPS = [
  { n: '01', title: 'Escolha a máquina', body: 'Qualquer carro da coleção pode ser financiado.' },
  { n: '02', title: 'Simule aqui', body: 'Entrada, prazo e parcela na tela, antes de qualquer conversa.' },
  { n: '03', title: 'Análise', body: 'Enviamos para as principais instituições e comparamos as taxas.' },
  { n: '04', title: 'Assinatura', body: 'Documentação e transferência resolvidas pela PHD.' },
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
              Ninguém deveria precisar mandar mensagem para descobrir quanto fica a parcela.
              Simule aqui, com os números na sua frente, e só depois fale com a gente.
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
