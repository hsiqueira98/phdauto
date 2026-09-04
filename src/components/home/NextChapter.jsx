import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { gsap } from '@/lib/gsap';
const steps = [
  { number: '01', title: 'Descubra.', text: 'Seu dia a dia, seu estilo, seus planos. Explore a coleção pelo que faz sentido para você.', detail: 'ENCONTRE O SEU ESTILO' },
  { number: '02', title: 'Conheça.', text: 'Olhe de perto. Compare os detalhes, explore cada veículo e imagine as próximas viagens.', detail: 'CADA DETALHE CONTA' },
  { number: '03', title: 'Escolha.', text: 'Encontre o equilíbrio entre desejo e possibilidade. O próximo capítulo começa com a sua decisão.', detail: 'O PRÓXIMO PASSO É SEU' },
];
export default function NextChapter() {
  const root = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.polly-step').forEach(step => {
        gsap.from(step.children, { y: 26, opacity: 0, duration: .7, stagger: .08, scrollTrigger: { trigger: step, start: 'top 82%', once: true } });
      });
    });
    media.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.polly-chapter__progress span', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.polly-chapter__steps', start: 'top 60%', end: 'bottom 70%', scrub: true } });
    });
    return () => media.revert();
  }, { scope: root });
  return <section className="polly-chapter section" id="experiencia" aria-labelledby="chapter-title" ref={root}><div className="shell polly-chapter__grid">
    <div className="polly-chapter__intro"><p className="polly-kicker">07 / A EXPERIÊNCIA POLLY</p><h2 id="chapter-title">Seu próximo<br />capítulo.<br /><span>Do seu jeito.</span></h2><p>Uma escolha importante merece espaço. E uma experiência que acompanhe o seu ritmo.</p><Link className="polly-text-link" to="/colecao">Encontre o seu carro <span aria-hidden="true">↗</span></Link></div>
    <div className="polly-chapter__steps"><div className="polly-chapter__progress" aria-hidden="true"><span /></div>{steps.map(step => <article className="polly-step" key={step.number}><span className="polly-step__number">{step.number}</span><span className="polly-kicker">{step.detail}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
  </div></section>;
}
