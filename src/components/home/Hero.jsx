import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { createClipPathReveal } from '@/lib/animations';
import Foto from '@/components/ui/Foto';
import { SplitLetters } from '@/components/ui/SplitText';
import { ScrollCue } from '@/components/ui/atoms';
import MagneticButton from '@/components/animations/MagneticButton';

/**
 * ABERTURA
 *
 * A capa é uma imagem de atmosfera — não é um veículo do estoque.
 * Ela existe para prender o olhar, não para vender aquele carro.
 *
 * O texto ocupa uma coluna estreita à esquerda e a máquina fica
 * enquadrada à direita: nada de tipografia por cima da lataria.
 */
export default function Hero({ onAbrirModoImersivo }) {
  const raiz = useRef(null);

  useGSAP(
    () => {
      const reduzido = prefersReducedMotion();

      if (reduzido) {
        gsap.set('.hero__midia', { clipPath: 'inset(0 0 0 0)' });
        return;
      }

      const entrada = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });

      entrada.add(
        createClipPathReveal('.hero__midia', {
          direction: 'left',
          duration: 1.5,
          ease: 'power4.inOut',
        }),
        0,
      );

      entrada
        .from('.hero__selo', { y: 16, opacity: 0, duration: 1 }, 0.45)
        .from(
          '.hero__titulo .split-letters__letter',
          { yPercent: 115, opacity: 0, duration: 1.1, stagger: 0.022 },
          0.55,
        )
        .from('.hero__lead', { y: 20, opacity: 0, duration: 1 }, 1.05)
        .from('.hero__acoes > *', { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 1.15)
        .from('.hero__rodape > *', { y: 16, opacity: 0, duration: 0.9, stagger: 0.08 }, 1.25);

      gsap.to('.hero__brilho', {
        xPercent: 18,
        yPercent: -10,
        scale: 1.15,
        duration: 14,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      gsap.to('.hero__midia', {
        yPercent: 10,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: raiz.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      gsap.to('.hero__conteudo', {
        yPercent: -14,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: raiz.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: raiz },
  );

  return (
    <section className="hero" ref={raiz}>
      <div className="hero__midia">
        <Foto
          src="/imagens/capa/capa-home.jpg"
          alt=""
          proporcao="auto"
          veu="capa"
          prioridade
          posicao="72% 58%"
          className="hero__foto"
        />
      </div>

      <span className="hero__brilho" aria-hidden="true" />

      <div className="hero__conteudo">
        <div className="hero__coluna">
          <p className="hero__selo meta">
            PHD Automóveis <span aria-hidden="true">·</span> Brasília{' '}
            <span aria-hidden="true">·</span> desde 1996
          </p>

          <SplitLetters
            as="h1"
            className="hero__titulo t-display"
            lines={['Escolha o que', 'vai te mover.']}
          />

          <p className="hero__lead t-lead">
            Seu próximo carro não começa em uma busca. Começa em uma sensação.
          </p>

          <div className="hero__acoes">
            <MagneticButton
              as={Link}
              to="/colecao"
              className="btn btn--paper btn--lg"
              data-cursor="Abrir"
            >
              Ver a coleção
            </MagneticButton>
            <MagneticButton
              type="button"
              className="btn btn--ghost btn--lg"
              onClick={onAbrirModoImersivo}
            >
              Modo imersivo
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="hero__rodape">
        <p className="hero__resumo meta">
          24 máquinas selecionadas <span aria-hidden="true">·</span> SIA Trecho 3
        </p>
        <ScrollCue label="Role para explorar" />
      </div>
    </section>
  );
}
