import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { universes } from '@/data/taxonomy';
import { vehicles } from '@/data/vehicles';
import { FotoVeiculo } from '@/components/ui/Foto';
import { Reveal } from '@/components/ui/atoms';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';

const quantidade = (id) => vehicles.filter((v) => v.universe === id).length;
const capa = (id) =>
  vehicles.find((v) => v.universe === id && v.featured) ?? vehicles.find((v) => v.universe === id);

/**
 * A pergunta que substitui o filtro.
 *
 * A prévia mora numa coluna fixa à direita, não colada ao cursor.
 * Seguindo o ponteiro ela cobria justamente o texto que a pessoa
 * estava lendo — o problema que essa versão resolve.
 */
export default function Universes() {
  const ehDesktop = useMediaQuery('(min-width: 1000px)');
  const reduzido = useReducedMotion();
  const [ativo, setAtivo] = useState(universes[0].id);

  const universo = universes.find((u) => u.id === ativo) ?? universes[0];
  const previa = capa(ativo);

  return (
    <section className="section universos" id="universos">
      <div className="shell">
        <div className="section-index meta">
          <span className="section-index__num">02</span>
          <span>Universos</span>
        </div>

        <Reveal>
          <h2 className="universos__titulo t-h1">O que você procura sentir?</h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="universos__lead t-lead">
            Cinco recortes da mesma coleção. Escolha pelo que o carro faz por você,
            não pela categoria em que ele foi cadastrado.
          </p>
        </Reveal>

        <div className="universos__grade">
          <ul className="universos__lista">
            {universes.map((u, i) => (
              <Reveal as="li" key={u.id} delay={i * 0.04}>
                <Link
                  to={`/colecao?universes=${u.id}`}
                  className={`universos__linha ${ativo === u.id ? 'is-ativa' : ''}`}
                  onMouseEnter={() => setAtivo(u.id)}
                  onFocus={() => setAtivo(u.id)}
                  data-cursor="Explorar"
                >
                  <span className="universos__indice meta">{u.index}</span>

                  <span className="universos__texto">
                    <span className="universos__nome t-h3">{u.label}</span>
                    <span className="universos__pergunta">{u.question}</span>
                  </span>

                  <span className="universos__conta meta">
                    {String(quantidade(u.id)).padStart(2, '0')}
                    <span className="universos__seta" aria-hidden="true">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          {/* Painel fixo: nunca cobre a lista */}
          {ehDesktop && (
            <Reveal className="universos__painel" delay={0.12}>
              <div className="universos__painel-interno">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={ativo}
                    initial={reduzido ? false : { opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduzido ? {} : { opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {previa && (
                      <FotoVeiculo veiculo={previa} proporcao="4 / 3" veu="medio" />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="universos__painel-texto">
                  <p className="meta universos__painel-rotulo">{universo.label}</p>
                  <p className="universos__painel-desc">{universo.body}</p>
                  <p className="meta universos__painel-conta">
                    {String(quantidade(universo.id)).padStart(2, '0')} máquinas neste universo
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
