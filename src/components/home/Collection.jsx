import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { gsap } from '@/lib/gsap';
import { featuredVehicles, vehicles } from '@/data/vehicles';
import { formatKm, formatPrice, pad2 } from '@/lib/format';
import { FotoVeiculo } from '@/components/ui/Foto';
import { useReducedMotion } from '@/lib/hooks';
import { useLenis } from '@/components/layout/SmoothScroll';

const selection = featuredVehicles.slice(0, 4);
export default function Collection() {
  const root = useRef(null);
  const viewport = useRef(null);
  const rail = useRef(null);
  const scene = useRef(null);
  const progress = useRef(null);
  const current = useRef(0);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const showIndex = (index) => {
    if (current.current !== index) { current.current = index; setActive(index); }
  };
  const nativeTargets = () => {
    const max = Math.max(0, viewport.current.scrollWidth - viewport.current.clientWidth);
    const positions = [...rail.current.children].map(card => Math.max(0, Math.min(max,
      card.offsetLeft - rail.current.offsetLeft + card.clientWidth / 2 - viewport.current.clientWidth / 2,
    )));
    return { max, positions };
  };

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1000px) and (min-height: 700px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, rail.current.scrollWidth - viewport.current.clientWidth);
      if (distance() <= 0) return;
      root.current.dataset.pinned = 'true';
      viewport.current.scrollLeft = 0;
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'polly-collection', trigger: root.current, start: 'top top',
          end: () => `+=${distance()}`, pin: true, scrub: .45, invalidateOnRefresh: true,
          onUpdate: self => showIndex(Math.round(self.progress * (selection.length - 1))),
        },
      });
      timeline.to(rail.current, { x: () => -distance(), duration: 1, ease: 'none' }, 0)
        .fromTo('.polly-collection__progress span', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0);
      scene.current = timeline.scrollTrigger;
      return () => { scene.current = null; delete root.current?.dataset.pinned; };
    });
    return () => media.revert();
  }, { scope: root });

  const goTo = (index, immediate = false) => {
    const next = Math.max(0, Math.min(selection.length - 1, index));
    showIndex(next);
    if (scene.current) {
      const trigger = scene.current;
      const target = trigger.start + (trigger.end - trigger.start) * next / (selection.length - 1);
      if (lenis) lenis.scrollTo(target, { immediate, duration: .55 });
      else window.scrollTo({ top: target, behavior: reduced || immediate ? 'instant' : 'smooth' });
    } else {
      viewport.current.scrollTo({ left: nativeTargets().positions[next], behavior: reduced || immediate ? 'instant' : 'smooth' });
    }
  };

  return <section id="colecao" className="polly-collection" ref={root} aria-labelledby="collection-title">
    <div className="polly-collection__heading"><div><p className="polly-kicker">03 / A COLEÇÃO</p><h2 id="collection-title">Desejo, em <span>movimento.</span></h2></div><Link className="polly-text-link" to="/colecao">Ver os {vehicles.length} veículos <span aria-hidden="true">↗</span></Link></div>
    <div className="polly-collection__viewport" ref={viewport} onScroll={() => {
      if (scene.current || !rail.current) return;
      const { max, positions } = nativeTargets();
      const left = viewport.current.scrollLeft;
      const ratio = max ? Math.min(1, Math.max(0, left / max)) : 1;
      if (progress.current) progress.current.style.transform = `scaleX(${ratio})`;
      const closest = positions.reduce((best, target, index) =>
        Math.abs(target - left) < Math.abs(positions[best] - left) ? index : best, current.current);
      showIndex(max > 0 && max - left < 2 ? selection.length - 1 : closest);
    }}>
      <div className="polly-collection__rail" ref={rail} onFocusCapture={event => {
        const card = event.target.closest('[data-slide]');
        if (card && scene.current) goTo(Number(card.dataset.slide), true);
      }}>
        {selection.map((vehicle, index) => <article className="polly-vehicle" data-slide={index} key={vehicle.id}>
          <Link to={`/veiculo/${vehicle.slug}`} className="polly-vehicle__link" data-cursor="Conhecer">
            <div className="polly-vehicle__image"><FotoVeiculo veiculo={vehicle} proporcao="16 / 10" veu="leve" /><span className="polly-vehicle__index">{pad2(index + 1)} / SELEÇÃO POLLY</span><span className="polly-vehicle__arrow" aria-hidden="true">↗</span></div>
            <div className="polly-vehicle__details"><div><p className="polly-kicker">{vehicle.brand}</p><h3>{vehicle.model}</h3><p className="polly-vehicle__spec">{vehicle.year} <span>•</span> {formatKm(vehicle.km)} <span>•</span> {vehicle.transmission}</p></div><strong>{formatPrice(vehicle.price)}</strong></div>
          </Link>
        </article>)}
      </div>
    </div>
    <div className="polly-collection__foot"><span className="polly-kicker"><b>{pad2(active + 1)}</b> / {pad2(selection.length)} EM FOCO</span><div className="polly-collection__progress" aria-hidden="true"><span ref={progress} /></div><div className="polly-collection__controls"><button type="button" aria-label="Veículo anterior" disabled={active === 0} onClick={() => goTo(current.current - 1)}>←</button><button type="button" aria-label="Próximo veículo" disabled={active === selection.length - 1} onClick={() => goTo(current.current + 1)}>→</button></div></div>
  </section>;
}
