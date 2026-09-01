import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, Observer, prefersReducedMotion } from '@/lib/gsap';
import { createColorShift } from '@/lib/animations';
import { vehicles } from '@/data/vehicles';
import { formatPrice, pad2 } from '@/lib/format';
import { bodyLabels, getUniverse } from '@/data/taxonomy';
import { FotoVeiculo } from '@/components/ui/Foto';
import { useKeyDown, useLockBodyScroll } from '@/lib/hooks';
import { blip, startAmbient, stopAmbient } from '@/lib/driveAudio';

/**
 * MODO IMERSIVO
 *
 * A interface desaparece. Ficam a fotografia em tela cheia, três
 * características e o preço.
 *
 * Gesto: GSAP Observer (roda, arraste, toque, teclado).
 * Transição: GSAP, remontada a cada troca de índice.
 *
 * Totalmente opcional — quem quer comprar rápido usa o catálogo.
 */
export default function DriveMode({ open, onClose }) {
  const [indice, setIndice] = useState(0);
  const [direcao, setDirecao] = useState(1);
  const [som, setSom] = useState(false);
  const raiz = useRef(null);
  const travado = useRef(false);

  const lista = vehicles.filter((v) => v.status !== 'reservado');
  const veiculo = lista[indice];

  useLockBodyScroll(open);

  const mover = useCallback(
    (passo) => {
      if (travado.current) return;
      travado.current = true;
      setDirecao(passo);
      setIndice((i) => (i + passo + lista.length) % lista.length);
      blip(passo > 0 ? 392 : 330);
      setTimeout(() => {
        travado.current = false;
      }, 420);
    },
    [lista.length],
  );

  useKeyDown('Escape', onClose, open);
  useKeyDown(['ArrowRight', 'ArrowDown'], () => mover(1), open);
  useKeyDown(['ArrowLeft', 'ArrowUp'], () => mover(-1), open);

  /* Gesto: roda, arraste e toque */
  useEffect(() => {
    if (!open || !raiz.current) return undefined;

    const observador = Observer.create({
      target: raiz.current,
      type: 'wheel,touch,pointer',
      preventDefault: true,
      tolerance: 24,
      wheelSpeed: -1,
      onUp: () => mover(1),
      onDown: () => mover(-1),
      onLeft: () => mover(1),
      onRight: () => mover(-1),
    });

    return () => observador.kill();
  }, [open, mover]);

  /* Som ambiente: começa desligado, só toca por gesto da pessoa */
  useEffect(() => {
    if (!open || !som) {
      stopAmbient();
      return undefined;
    }
    startAmbient(0.1);
    return () => stopAmbient();
  }, [open, som]);

  useEffect(() => {
    if (!open) setSom(false);
  }, [open]);

  /* Transição entre máquinas */
  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        // Cortina preta: escurece e reabre, como um corte de cinema
        .fromTo(
          '.mi__cortina',
          { opacity: 1 },
          { opacity: 0, duration: 0.75, ease: 'power2.out' },
          0,
        )
        .from('.mi__foto', { xPercent: 8 * direcao, opacity: 0, scale: 1.04, duration: 1.1 }, 0)
        .from('.mi__nome-interno', { yPercent: 110, duration: 0.9, stagger: 0.06 }, 0.12)
        .from('.mi__item', { y: 18, opacity: 0, duration: 0.7, stagger: 0.05 }, 0.26)
        .from('.mi__preco', { y: 16, opacity: 0, duration: 0.7 }, 0.34)
        // Índice datilografado, dígito a dígito
        .from('.mi__digito', { opacity: 0, duration: 0.14, stagger: 0.09, ease: 'none' }, 0.2);
    },
    { scope: raiz, dependencies: [indice, open], revertOnUpdate: true },
  );

  /* Tinta ambiente que muda devagar.
     A troca acontece no véu, não num filtro sobre a fotografia:
     animar hue-rotate numa imagem em tela cheia repinta cada quadro. */
  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return;
      createColorShift(
        '.mi__tinta',
        ['rgba(220,38,38,0.10)', 'rgba(79,70,229,0.08)', 'rgba(139,144,153,0.07)'],
        { duration: 7, property: 'backgroundColor' },
      );
    },
    { scope: raiz, dependencies: [open] },
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mi"
          ref={raiz}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Modo imersivo — exploração da coleção"
        >
          <div className="mi__palco" key={veiculo.id}>
            <span className="mi__tinta" aria-hidden="true" />
            <span className="mi__cortina" aria-hidden="true" />
            <FotoVeiculo
              veiculo={veiculo}
              proporcao="auto"
              veu="forte"
              posicao="center 55%"
              prioridade
              className="mi__foto"
            />
          </div>

          {/* Barra mínima */}
          <div className="mi__barra">
            <span className="mi__marca meta">
              PHD <em>Modo imersivo</em>
            </span>

            <div className="mi__barra-direita">
              <button
                type="button"
                className={`mi__som ${som ? 'is-ligado' : ''}`}
                onClick={() => setSom((s) => !s)}
                aria-pressed={som}
              >
                <span className="mi__som-barras" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                {som ? 'Som ligado' : 'Som'}
              </button>

              <button type="button" className="mi__sair" onClick={onClose}>
                Sair <span aria-hidden="true">ESC</span>
              </button>
            </div>
          </div>

          {/* Informação */}
          <div className="mi__info">
            <h2 className="mi__nome">
              <span className="mi__nome-mascara">
                <span className="mi__nome-interno meta">{veiculo.brand}</span>
              </span>
              <span className="mi__nome-mascara">
                <span className="mi__nome-interno t-h1">{veiculo.model}</span>
              </span>
            </h2>

            <ul className="mi__itens">
              <li className="mi__item meta">{getUniverse(veiculo.universe)?.label}</li>
              <li className="mi__item meta">{veiculo.engine}</li>
              <li className="mi__item meta">{veiculo.transmission}</li>
            </ul>

            <p className="mi__preco">{formatPrice(veiculo.price)}</p>

            <Link to={`/veiculo/${veiculo.slug}`} className="mi__ver" onClick={onClose}>
              Ver máquina <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Rodapé: índice e navegação */}
          <div className="mi__rodape">
            <span className="mi__contador num">
              <span className="sr-only">
                {indice + 1} de {lista.length}
              </span>
              {Array.from(pad2(indice + 1)).map((d, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <span className="mi__digito" key={i} aria-hidden="true">
                  {d}
                </span>
              ))}
              <em aria-hidden="true">/ {pad2(lista.length)}</em>
            </span>

            <ol className="mi__trilho">
              {lista.map((v, i) => (
                <li key={v.id}>
                  <button
                    type="button"
                    className={`mi__marca-trilho ${i === indice ? 'is-ativa' : ''}`}
                    onClick={() => {
                      setDirecao(i > indice ? 1 : -1);
                      setIndice(i);
                    }}
                    aria-label={`${v.brand} ${v.model}`}
                    aria-current={i === indice}
                  />
                </li>
              ))}
            </ol>

            <div className="mi__nav">
              <button type="button" onClick={() => mover(-1)} aria-label="Anterior">
                ←
              </button>
              <span className="meta mi__dica">Role, arraste ou use as setas</span>
              <button type="button" onClick={() => mover(1)} aria-label="Próxima">
                →
              </button>
            </div>
          </div>

          <span className="mi__etiqueta meta" aria-hidden="true">
            {bodyLabels[veiculo.body]} · {veiculo.year} · {veiculo.color}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
