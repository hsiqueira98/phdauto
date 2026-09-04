import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { gsap } from '@/lib/gsap';
export default function FinalCta({ onAbrirModoImersivo }) {
  const root = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.polly-final__title > span', { yPercent: 35, opacity: 0, stagger: .1, duration: .85, scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } });
    });
    return () => media.revert();
  }, { scope: root });
  return <section id="cta" className="polly-final section" ref={root}><div className="shell">
    <p className="polly-kicker">SEU PRÓXIMO MOVIMENTO</p><h2 className="polly-final__title"><span>A vida segue.</span><span>Vá de <em>POLLY.</em></span></h2>
    <div className="polly-final__bottom"><p>Novos caminhos começam com uma escolha.</p><div><Link to="/colecao" className="btn btn--paper btn--lg">Encontre seu próximo carro <span aria-hidden="true">↗</span></Link><button type="button" onClick={onAbrirModoImersivo} className="polly-final__secondary">Experimentar Drive Mode</button></div></div>
  </div></section>;
}
