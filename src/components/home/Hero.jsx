import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { gsap } from '@/lib/gsap';
import { vehicles } from '@/data/vehicles';
import MagneticButton from '@/components/animations/MagneticButton';

export default function Hero({ onAbrirModoImersivo }) {
  const root = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power3.out', duration: .85 } })
        .from('.polly-hero__line > span', { yPercent: 105, stagger: .1 })
        .from('.polly-hero__intro, .polly-hero__actions', { y: 20, opacity: 0, stagger: .1 }, .3)
        .from('.polly-hero__image', { scale: 1.05, opacity: 0, duration: 1.2 }, 0);
    });
    media.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: .5 } })
        .to('.polly-hero__media', { yPercent: 12, ease: 'none' }, 0)
        .to('.polly-hero__copy', { y: -55, opacity: .25, ease: 'none' }, 0);
    });
    return () => media.revert();
  }, { scope: root });

  return <section className="polly-hero" ref={root} aria-labelledby="polly-hero-title">
    <div className="polly-hero__media" aria-hidden="true"><img className="polly-hero__image" src="/imagens/capa/capa-home.jpg" alt="" fetchPriority="high" decoding="async" /></div>
    <div className="polly-hero__copy">
      <p className="polly-kicker"><span /> UM NOVO NOME. NOVOS CAMINHOS.</p>
      <h1 id="polly-hero-title" className="polly-hero__title" aria-label="Seu próximo capítulo começa ao volante.">
        <span className="polly-hero__line" aria-hidden="true"><span>Seu próximo</span></span>
        <span className="polly-hero__line" aria-hidden="true"><span>capítulo<span className="red-dot">.</span></span></span>
        <span className="polly-hero__subtitle" aria-hidden="true">Começa ao volante.</span>
      </h1>
      <p className="polly-hero__intro">Prazer, POLLY. Carros que combinam com a sua vida.<br className="desktop-break" /> Uma nova forma de encontrar o seu próximo destino.</p>
      <div className="polly-hero__actions"><MagneticButton as={Link} to="/colecao" className="btn btn--accent btn--lg">Explorar coleção <span aria-hidden="true">↗</span></MagneticButton><button type="button" className="polly-play" onClick={onAbrirModoImersivo}><span aria-hidden="true">▷</span> Entrar no Drive Mode</button></div>
    </div>
    <div className="polly-hero__edition" aria-hidden="true"><span>THE DRIVE GALLERY</span><b>01 / POLLY</b></div>
    <div className="polly-hero__bottom"><span><b>{String(vehicles.length).padStart(2, '0')}</b> veículos na coleção</span><span className="polly-hero__image-note">Fotografia de inspiração</span><a href="#manifesto">O próximo movimento é seu <span aria-hidden="true">↓</span></a></div>
  </section>;
}
