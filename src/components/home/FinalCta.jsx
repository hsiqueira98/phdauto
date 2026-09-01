import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { Magnetic } from '@/components/ui/atoms';

export default function FinalCta({ onAbrirModoImersivo }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        '.final__line-inner',
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.1,
          ease: 'expo.out',
          duration: 1.4,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        },
      );

      gsap.to('.final__halo', {
        scale: 1.25,
        opacity: 0.9,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section className="section final" ref={root} id="cta">
      <div className="final__halo" aria-hidden="true" />

      <div className="shell final__shell">
        <h2 className="final__title t-display" aria-label="Sua vez.">
          <span className="final__mask" aria-hidden="true">
            <span className="final__line-inner">Sua</span>
          </span>
          <span className="final__mask" aria-hidden="true">
            <span className="final__line-inner">vez.</span>
          </span>
        </h2>

        <p className="final__lead">
          Trinta anos depois, continuamos acreditando que escolher um carro
          deveria ser especial. O resto é consequência.
        </p>

        <div className="final__actions">
          <Magnetic>
            <Link to="/colecao" className="btn btn--paper btn--lg" data-cursor="Abrir">
              Explorar coleção
            </Link>
          </Magnetic>
          <button type="button" className="btn btn--ghost btn--lg" onClick={onAbrirModoImersivo}>
            Ou entrar no modo imersivo
          </button>
        </div>

        <p className="final__foot meta">PHD Automóveis · Brasília · desde 1996</p>
      </div>
    </section>
  );
}
