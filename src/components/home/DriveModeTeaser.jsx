import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { getVehicleBySlug } from '@/data/vehicles';
import { FotoVeiculo } from '@/components/ui/Foto';
import MagneticButton from '@/components/animations/MagneticButton';
const vehicle = getVehicleBySlug('volkswagen-amarok-highline-v6-2019');
export default function DriveModeTeaser({ onAbrir }) {
  const root = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.polly-drive__content > *', { y: 30, opacity: 0, stagger: .08, duration: .8, scrollTrigger: { trigger: root.current, start: 'top 72%', once: true } });
    });
    media.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.polly-drive__photo', { y: 35 }, { y: -35, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: .5 } });
    });
    return () => media.revert();
  }, { scope: root });
  return <section id="modo-imersivo" className="polly-drive section" ref={root} aria-labelledby="drive-title"><div className="shell polly-drive__grid">
    <div className="polly-drive__content"><p className="polly-kicker">04 / DRIVE MODE</p><h2 id="drive-title">Menos mundo.<br /><span>Mais volante.</span></h2><p>Uma pausa no ruído. Fotografia em tela cheia, detalhes que importam e espaço para imaginar você ali.</p><MagneticButton type="button" className="btn btn--accent btn--lg" onClick={onAbrir}>Entrar na experiência <span aria-hidden="true">↗</span></MagneticButton><Link to="/colecao" className="polly-drive__catalog">Ou continuar pela coleção →</Link></div>
    <div className="polly-drive__visual"><span className="polly-drive__vertical" aria-hidden="true">FEEL THE NEXT CHAPTER</span><div className="polly-drive__photo"><FotoVeiculo veiculo={vehicle} proporcao="4 / 5" veu="leve" /><button type="button" onClick={onAbrir} className="polly-drive__start" aria-label="Ativar Drive Mode">↗</button></div><div className="polly-drive__caption"><span>VOCÊ. A MÁQUINA. O MOMENTO.</span><span>▷ DRIVE MODE</span></div></div>
  </div></section>;
}
