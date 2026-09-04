import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
export default function Manifesto() {
  const root = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.polly-manifesto__reveal', { y: 35, opacity: 0, stagger: .12, duration: .85, scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } });
    });
    return () => media.revert();
  }, { scope: root });
  return <section id="manifesto" className="polly-manifesto section" ref={root} aria-labelledby="manifesto-title">
    <div className="shell polly-manifesto__grid">
      <div><p className="polly-kicker">01 / PRAZER, POLLY.</p><span className="polly-manifesto__symbol" aria-hidden="true">↗</span></div>
      <div><h2 id="manifesto-title" className="polly-manifesto__reveal">O carro é o começo.<br /><span>A história é sua.</span></h2>
        <div className="polly-manifesto__body polly-manifesto__reveal"><p>A primeira chave. A família que cresceu. A vontade de pegar a estrada. Existe um carro para cada novo momento.</p><p>A POLLY VEÍCULOS nasce com esse olhar: entender o que move você e ajudar a encontrar uma escolha que faça sentido.</p></div>
        <Link className="polly-text-link polly-manifesto__reveal" to="/polly">Conheça a POLLY <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
    <div className="shell polly-manifesto__signature"><span>ESCOLHAS COM PERSONALIDADE</span><span>POLLY VEÍCULOS / THE DRIVE GALLERY</span></div>
  </section>;
}
