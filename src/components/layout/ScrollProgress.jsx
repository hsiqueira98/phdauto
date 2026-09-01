import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

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

    let pendente = false;

    const atualizar = () => {
      pendente = false;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progresso = total > 0 ? window.scrollY / total : 0;
      gsap.to(el, {
        scaleX: gsap.utils.clamp(0, 1, progresso),
        duration: 0.25,
        ease: 'none',
        overwrite: true,
      });
    };

    const aoRolar = () => {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(atualizar);
    };

    atualizar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);

    return () => {
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
      gsap.killTweensOf(el);
    };
  }, []);

  return <div ref={barra} className="scroll-progress" aria-hidden="true" />;
}
