import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';
import { createCountUp } from '@/lib/animations';
import { FotoVeiculo } from '@/components/ui/Foto';

/**
 * A INVERSÃO
 *
 * Quase todo site automotivo começa pela ficha técnica. Aqui a
 * fotografia fica presa em tela cheia e as informações entram uma
 * de cada vez, como uma apresentação de lançamento.
 *
 * Emoção primeiro, informação depois, conversão por último — a
 * ficha completa vem logo abaixo.
 */

/** "180 CV" -> { numero: 180, resto: 'CV' }. Só inteiros contam. */
function separar(etapa) {
  const m = String(etapa).match(/^(\d+)(\s+.*)?$/);
  if (!m) return { numero: null, texto: etapa };
  return { numero: Number(m[1]), resto: (m[2] ?? '').trim(), texto: etapa };
}

export default function SpecSequence({ vehicle }) {
  const raiz = useRef(null);
  const reduced = useReducedMotion();
  const compact = useMediaQuery('(max-width: 1100px), (max-height: 600px), (pointer: coarse)');
  const etapas = [...vehicle.highlights, String(vehicle.year)].map(separar);

  useGSAP(
    () => {
      if (reduced || compact) {
        gsap.set('.specseq__step', { autoAlpha: 1, position: 'relative' });
        gsap.set('.specseq__divisor', { clipPath: 'inset(0 0 0 0)' });
        gsap.utils.toArray('.specseq__numero').forEach((el) => {
          el.textContent = el.dataset.valor;
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: raiz.current,
          start: 'top top',
          end: `+=${etapas.length * 80}%`,
          pin: true,
          scrub: 0.7,
        },
      });

      // A imagem respira ao longo de toda a sequência
      tl.fromTo(
        '.specseq__foto .foto__img',
        { scale: 1.04 },
        { scale: 1.12, ease: 'none', duration: etapas.length },
        0,
      );

      etapas.forEach((etapa, i) => {
        const passo = `.specseq__step[data-step="${i}"]`;

        tl.fromTo(
          passo,
          { autoAlpha: 0, yPercent: 40 },
          { autoAlpha: 1, yPercent: 0, duration: 0.4, ease: 'power3.out' },
          i,
        );

        // Divisor entra por máscara, da esquerda
        tl.fromTo(
          `${passo} .specseq__divisor`,
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power2.out' },
          i + 0.12,
        );

        // Números contam em vez de simplesmente aparecer
        const alvoNumero = raiz.current?.querySelector(`${passo} .specseq__numero`);
        if (alvoNumero && etapa.numero !== null) {
          const contagem = createCountUp(alvoNumero, etapa.numero, {
            duration: 0.5,
            formatar: (n) => String(n),
          });
          if (contagem) tl.add(contagem, i + 0.05);
        }

        tl.to(
          passo,
          { autoAlpha: 0, yPercent: -28, duration: 0.35, ease: 'power2.in' },
          i + 0.62,
        );

        tl.to('.specseq__progresso-fill', { scaleX: (i + 1) / etapas.length, duration: 0.4 }, i);
      });
    },
    { scope: raiz, dependencies: [vehicle.slug, reduced, compact], revertOnUpdate: true },
  );

  return (
    <section className="specseq" ref={raiz} aria-label="Destaques do veículo">
      <FotoVeiculo
        veiculo={vehicle}
        indice={1}
        proporcao="auto"
        veu="forte"
        posicao="center 55%"
        className="specseq__foto"
      />

      <div className="specseq__etapas">
        {etapas.map((etapa, i) => (
          <span className="specseq__step" data-step={i} key={etapa.texto}>
            <span className="specseq__valor t-display">
              {compact || reduced ? etapa.texto : etapa.numero !== null ? (
                <>
                  <span className="specseq__numero num" data-valor={etapa.numero}>
                    {etapa.numero}
                  </span>
                  {etapa.resto ? ` ${etapa.resto}` : ''}
                </>
              ) : (
                etapa.texto
              )}
            </span>
            <span className="specseq__divisor" aria-hidden="true" />
          </span>
        ))}
      </div>

      <div className="specseq__progresso" aria-hidden="true">
        <span className="specseq__progresso-fill" />
      </div>

      <p className="specseq__rotulo meta">
        {vehicle.brand} — {vehicle.model}
      </p>

      {/* Mesma informação, sempre legível para leitor de tela. */}
      <ul className="sr-only">
        {etapas.map((e) => (
          <li key={e.texto}>{e.texto}</li>
        ))}
      </ul>
    </section>
  );
}
