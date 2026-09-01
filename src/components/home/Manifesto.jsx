import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { createCountUp, createTextReveal } from '@/lib/animations';
import { SplitWords } from '@/components/ui/SplitText';
import Instrumento from './Instrumento';

const FRASES = [
  'Não temos carros à venda.',
  'Selecionamos carros para diferentes maneiras de viver.',
  'Cada um passou pelo mesmo critério antes de entrar no pátio.',
];

const NUMEROS = [
  { valor: 30, rotulo: 'anos escolhendo carros em Brasília' },
  { valor: 24, rotulo: 'máquinas na coleção de hoje' },
  { valor: 90, rotulo: 'dias de garantia de motor e câmbio' },
];

/**
 * MANIFESTO
 *
 * Sem pin: a rolagem nunca trava. As três frases entram em sequência
 * conforme entram na tela, e o fundo escurece com um brilho vermelho
 * crescendo atrás — o movimento acompanha a leitura em vez de
 * segurar a página.
 *
 * A revelação é por palavra, não por letra: são três frases longas,
 * e uma caixa por caractere aqui custaria centenas de nós por nada.
 */
export default function Manifesto() {
  const raiz = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('.manifesto__frase', { opacity: 1 });
        gsap.set('.manifesto__frase .split-words__word', { opacity: 1, y: 0 });
        gsap.utils.toArray('.manifesto__numero-valor').forEach((el, i) => {
          el.textContent = String(NUMEROS[i].valor);
        });
        return;
      }

      // Cada frase acende quando chega — nada trava a rolagem
      gsap.utils.toArray('.manifesto__frase').forEach((frase) => {
        const reveal = createTextReveal(frase, {
          splitBy: 'word',
          stagger: 0.028,
          duration: 0.85,
          y: 26,
        });
        if (!reveal) return;
        reveal.pause();
        ScrollTrigger.create({
          trigger: frase,
          start: 'top 82%',
          once: true,
          onEnter: () => reveal.play(),
        });
      });

      // Sublinhado que pulsa sob a primeira frase
      gsap.fromTo(
        '.manifesto__risco',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.manifesto__risco', start: 'top 88%', once: true },
        },
      );

      // O fundo escurece e o brilho cresce ao longo da seção
      gsap.fromTo(
        '.manifesto__brilho',
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );

      // Contadores
      gsap.utils.toArray('.manifesto__numero-valor').forEach((el, i) => {
        const contagem = createCountUp(el, NUMEROS[i].valor, { duration: 1.6 });
        if (!contagem) return;
        contagem.pause();
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => contagem.play(),
        });
      });
    },
    { scope: raiz },
  );

  return (
    <section className="section manifesto" ref={raiz} id="manifesto">
      <span className="manifesto__brilho" aria-hidden="true" />

      <div className="shell">
        <div className="section-index meta">
          <span className="section-index__num">01</span>
          <span>Manifesto</span>
        </div>

        <div className="manifesto__grade">
          <div className="manifesto__frases">
            {FRASES.map((frase, i) => (
              <div className="manifesto__bloco" key={frase}>
                <SplitWords
                  text={frase}
                  as="p"
                  className={`manifesto__frase ${i === 0 ? 't-h1' : 't-h2'}`}
                />
                {i === 0 && <span className="manifesto__risco" aria-hidden="true" />}
              </div>
            ))}
          </div>

          {/* Coluna direita: o instrumento ancora o espaço que antes
              ficava vazio, e os números descem sob ele. */}
          <div className="manifesto__lado">
            <Instrumento className="manifesto__instrumento" />

            <div className="manifesto__numeros">
              {NUMEROS.map((n) => (
                <div className="manifesto__numero" key={n.rotulo}>
                  <span className="manifesto__numero-valor num">0</span>
                  <span className="meta">{n.rotulo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
