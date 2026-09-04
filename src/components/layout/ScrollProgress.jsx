import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Barra de progresso de leitura, presa no topo.
 *
 * Anima `scaleX` em vez de `width`: largura força layout a cada
 * quadro de rolagem, escala é composta na GPU. O leitor vê a mesma
 * coisa e o scroll não perde quadros.
 */
export default function ScrollProgress() {
  const barra = useRef(null);

  useEffect(() => {
    const el = barra.current;
    if (!el) return undefined;

    const setProgress = gsap.quickSetter(el, 'scaleX');
    const update = (trigger) => setProgress(trigger.progress);
    // Reuse ScrollTrigger's existing scroll/update cycle. No extra rAF,
    // document measurement or freshly allocated tween on every scroll event.
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: update,
      onRefresh: update,
    });
    update(trigger);

    return () => {
      trigger.kill();
    };
  }, []);

  return <div ref={barra} className="scroll-progress" aria-hidden="true" />;
}
