import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion } from 'motion/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { getRelated, getVehicleBySlug } from '@/data/vehicles';
import { bodyLabels, getUniverse } from '@/data/taxonomy';
import { estimateInstallment, formatKm, formatPrice, pad2 } from '@/lib/format';
import Foto, { FotoVeiculo } from '@/components/ui/Foto';
import SpecSequence from '@/components/vehicle/SpecSequence';
import VehicleCard from '@/components/catalog/VehicleCard';
import { Magnetic, Reveal } from '@/components/ui/atoms';
import NotFound from './NotFound';

function FichaTecnica({ vehicle }) {
  const linhas = [
    ['Ano', vehicle.year],
    ['Quilometragem', formatKm(vehicle.km)],
    ['Motor', vehicle.engine],
    ['Potência', `${vehicle.power} cv`],
    ['Câmbio', vehicle.transmission],
    ['Combustível', vehicle.fuel],
    ['Carroceria', bodyLabels[vehicle.body]],
    ['Portas', vehicle.doors],
    ['Cor', vehicle.color],
    ['Universo', getUniverse(vehicle.universe)?.label],
  ];

  return (
    <dl className="ficha">
      {linhas.map(([rotulo, valor]) => (
        <div className="ficha__linha" key={rotulo}>
          <dt className="meta">{rotulo}</dt>
          <dd>{valor}</dd>
        </div>
      ))}
    </dl>
  );
}

function Simulacao({ price }) {
  const [meses, setMeses] = useState(48);
  const [entradaPct, setEntradaPct] = useState(30);

  const entrada = price * (entradaPct / 100);
  const parcela = estimateInstallment(price, meses, entradaPct / 100);

  return (
    <div className="simulacao">
      <p className="meta simulacao__topo">Simulação</p>

      <div className="simulacao__resultado">
        <span className="simulacao__valor">{formatPrice(parcela)}</span>
        <span className="meta">por mês em {meses}x</span>
      </div>

      <div className="simulacao__controles">
        <label className="simulacao__controle">
          <span className="meta">
            Entrada — {entradaPct}% ({formatPrice(entrada)})
          </span>
          <input
            type="range"
            min="10"
            max="70"
            step="5"
            value={entradaPct}
            onChange={(e) => setEntradaPct(Number(e.target.value))}
          />
        </label>

        <label className="simulacao__controle">
          <span className="meta">Prazo — {meses} meses</span>
          <input
            type="range"
            min="12"
            max="60"
            step="12"
            value={meses}
            onChange={(e) => setMeses(Number(e.target.value))}
          />
        </label>
      </div>

      <p className="simulacao__nota meta">
        Valores ilustrativos de protótipo. A simulação real depende de análise de crédito.
      </p>
    </div>
  );
}

export default function Vehicle() {
  const { slug } = useParams();
  const vehicle = getVehicleBySlug(slug);
  const raiz = useRef(null);
  const [foto, setFoto] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setFoto(0);
  }, [slug]);

  useGSAP(
    () => {
      if (!vehicle || prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.vhero__mask-inner', { yPercent: 112, duration: 1.2, stagger: 0.08 })
        .from('.vhero__dados > *', { y: 18, opacity: 0, duration: 0.9, stagger: 0.06 }, 0.4);

      gsap.to('.vhero__foto', {
        yPercent: 10,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: { trigger: '.vhero', start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: raiz, dependencies: [slug] },
  );

  if (!vehicle) return <NotFound />;

  const relacionados = getRelated(vehicle, 3);
  const universo = getUniverse(vehicle.universe);
  const fotos = vehicle.photos ?? [];

  return (
    <main className="vehicle" ref={raiz} id="conteudo">
      {/* ---------- 1. Emoção ---------- */}
      <section className="vhero">
        <FotoVeiculo
          veiculo={vehicle}
          proporcao="auto"
          veu="forte"
          posicao="center 55%"
          prioridade
          className="vhero__foto"
        />

        {/* As fotos do protótipo são do modelo, não da unidade em estoque.
            Dizer isso na tela evita a pergunta óbvia na apresentação. */}
        <span className="vhero__referencia meta">Foto de referência do modelo</span>

        <div className="vhero__conteudo">
          <div className="shell">
            <nav className="vhero__trilha meta" aria-label="Trilha de navegação">
              <Link to="/colecao" className="link-underline">
                Coleção
              </Link>
              <span aria-hidden="true">/</span>
              <Link to={`/colecao?universes=${vehicle.universe}`} className="link-underline">
                {universo?.label}
              </Link>
              <span aria-hidden="true">/</span>
              <span>{vehicle.model}</span>
            </nav>

            <h1 className="vhero__titulo">
              <span className="vhero__mask">
                <span className="vhero__mask-inner vhero__marca meta">{vehicle.brand}</span>
              </span>
              <span className="vhero__mask">
                <span className="vhero__mask-inner vhero__model t-display">{vehicle.model}</span>
              </span>
            </h1>

            <div className="vhero__dados">
              <p className="vhero__frase t-lead">{vehicle.headline}</p>
              <div className="vhero__linha">
                <span className="vhero__preco">{formatPrice(vehicle.price)}</span>
                <span className="meta vhero__situacao">
                  {vehicle.status === 'reservado' ? 'Reservado' : 'Disponível no showroom'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 2. A sequência ---------- */}
      <SpecSequence vehicle={vehicle} />

      {/* ---------- 3. Informação ---------- */}
      <section className="section vficha">
        <div className="shell vficha__shell">
          <div className="vficha__texto">
            <div className="section-index meta">
              <span className="section-index__num">01</span>
              <span>A máquina</span>
            </div>
            <Reveal>
              <p className="vficha__lead t-lead">{vehicle.story}</p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="vficha__subtitulo meta">Equipamentos</h2>
              <ul className="vficha__itens">
                {vehicle.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="vficha__tabela" delay={0.12}>
            <h2 className="vficha__subtitulo meta">Ficha técnica</h2>
            <FichaTecnica vehicle={vehicle} />
          </Reveal>
        </div>
      </section>

      {/* ---------- 4. Galeria ---------- */}
      {fotos.length > 0 && (
        <section className="section vgaleria">
          <div className="shell">
            <div className="section-index meta">
              <span className="section-index__num">02</span>
              <span>Galeria</span>
            </div>

            <div className="vgaleria__palco">
              <AnimatePresence mode="wait">
                <motion.div
                  key={foto}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="vgaleria__quadro"
                >
                  <Foto
                    src={fotos[foto]}
                    alt={`${vehicle.brand} ${vehicle.model} — foto ${foto + 1} de ${fotos.length}`}
                    proporcao="16 / 9"
                    veu="leve"
                  />
                </motion.div>
              </AnimatePresence>

              <span className="vgaleria__legenda meta">
                {pad2(foto + 1)} / {pad2(fotos.length)}
              </span>
            </div>

            <ul className="vgaleria__miniaturas">
              {fotos.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    className={`vgaleria__miniatura ${foto === i ? 'is-ativa' : ''}`}
                    onClick={() => setFoto(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    aria-pressed={foto === i}
                  >
                    <Foto src={src} alt="" proporcao="4 / 3" veu="leve" />
                  </button>
                </li>
              ))}
            </ul>

            <p className="vgaleria__nota">
              No projeto final, todas as máquinas são registradas no mesmo local, no mesmo
              ângulo principal e com o mesmo tratamento — é esse padrão que transforma um
              estoque em coleção. As fotos deste protótipo são de referência.
            </p>
          </div>
        </section>
      )}

      {/* ---------- 5. Conversão ---------- */}
      <section className="section vconversao">
        <div className="shell vconversao__shell">
          <div className="vconversao__texto">
            <div className="section-index meta">
              <span className="section-index__num">03</span>
              <span>Levar para casa</span>
            </div>

            <h2 className="vconversao__titulo t-h1">
              {vehicle.model} por {formatPrice(vehicle.price)}
            </h2>

            <ul className="vconversao__pontos">
              <li>Garantia de motor e câmbio por 90 dias</li>
              <li>Laudo cautelar e histórico de procedência</li>
              <li>Aceitamos seu usado na troca</li>
              <li>Financiamento com as principais instituições</li>
            </ul>

            <div className="vconversao__acoes">
              <Magnetic>
                <a
                  className="btn btn--accent btn--lg"
                  href={`https://wa.me/5561000000000?text=${encodeURIComponent(
                    `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.year}.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="WhatsApp"
                >
                  Falar sobre esta máquina
                </a>
              </Magnetic>
              <Link to="/colecao" className="btn btn--ghost btn--lg">
                Voltar à coleção
              </Link>
            </div>
          </div>

          <Reveal className="vconversao__painel">
            <Simulacao price={vehicle.price} />
          </Reveal>
        </div>
      </section>

      {/* ---------- 6. Relacionados ---------- */}
      <section className="section vrelacionados">
        <div className="shell">
          <div className="section-index meta">
            <span className="section-index__num">04</span>
            <span>Na mesma direção</span>
          </div>

          <div className="vrelacionados__grade">
            {relacionados.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} index={i} view="gallery" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
