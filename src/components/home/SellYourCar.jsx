import { useState } from 'react';
import { motion } from 'motion/react';
import { Reveal } from '@/components/ui/atoms';
import { facets } from '@/data/taxonomy';
import CardFlutuante from '@/components/animations/CardFlutuante';

const STEPS = [
  { n: '01', title: 'Você descreve', body: 'Marca, modelo, ano e quilometragem. Três campos, um minuto.' },
  { n: '02', title: 'A gente avalia', body: 'Avaliação presencial no showroom do SIA ou por vídeo, se preferir.' },
  { n: '03', title: 'Você decide', body: 'Compra direta, consignação ou troca com volta. Sem obrigação de fechar.' },
];

/**
 * VENDER MEU CARRO
 * Bloco de conversão — o formulário é visual (protótipo sem backend).
 */
export default function SellYourCar() {
  const [form, setForm] = useState({ brand: '', model: '', year: '', km: '' });
  const [sent, setSent] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="section sell" id="vender">
      <div className="shell sell__shell">
        <div className="sell__intro">
          <div className="section-index meta">
            <span className="section-index__num">06</span>
            <span>Vender meu carro</span>
          </div>

          <Reveal>
            <h2 className="sell__title t-h1">
              Seu carro
              <br />
              também tem
              <br />
              uma próxima
              <br />
              história.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="sell__lead">
              Compramos, trocamos e recebemos em consignação. Trinta anos avaliando
              seminovos em Brasília viraram um critério — e ele funciona nos dois sentidos.
            </p>
          </Reveal>

          <ol className="sell__steps">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={0.15 + i * 0.08} className="sell__step">
                <span className="sell__step-n meta">{s.n}</span>
                <div>
                  <h3 className="sell__step-title">{s.title}</h3>
                  <p className="sell__step-body">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <CardFlutuante className="sell__panel">
          <form className="sell__form" onSubmit={submit}>
            <p className="meta sell__form-head">Avaliação rápida</p>

            <div className="field">
              <label htmlFor="sell-brand">Marca</label>
              <select id="sell-brand" value={form.brand} onChange={update('brand')} required>
                <option value="">Selecione</option>
                {facets.brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="outra">Outra</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="sell-model">Modelo</label>
              <input id="sell-model" type="text" value={form.model} onChange={update('model')} placeholder="Ex.: Golf GTI" required />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="sell-year">Ano</label>
                <input id="sell-year" type="number" min="1980" max="2026" value={form.year} onChange={update('year')} placeholder="2019" required />
              </div>
              <div className="field">
                <label htmlFor="sell-km">Quilometragem</label>
                <input id="sell-km" type="number" min="0" value={form.km} onChange={update('km')} placeholder="58000" required />
              </div>
            </div>

            <button type="submit" className="btn btn--paper btn--full">
              {sent ? 'Recebido — entramos em contato' : 'Pedir avaliação'}
            </button>

            {sent && (
              <motion.p
                className="sell__sent meta"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Protótipo de apresentação — nenhum dado é enviado.
              </motion.p>
            )}

            <p className="sell__disclaimer meta">
              Ou chame no WhatsApp e mande as fotos direto.
            </p>
          </form>
        </CardFlutuante>
      </div>
    </section>
  );
}
