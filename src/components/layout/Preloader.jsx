import { useEffect } from 'react';
import { motion, useIsPresent } from 'motion/react';
import { useLockBodyScroll, useReducedMotion } from '@/lib/hooks';
import { useLenis } from './SmoothScroll';
import BrandMark from '@/components/ui/BrandMark';

/**
 * Aguarda apenas as fontes e a imagem principal, com saída garantida.
 * O indicador é indeterminado: não simula porcentagens de download.
 */
export default function Preloader({ onDone }) {
  const reduced = useReducedMotion();
  const present = useIsPresent();
  const lenis = useLenis();
  useLockBodyScroll(present);

  useEffect(() => {
    if (!present || !lenis) return undefined;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, present]);

  useEffect(() => {
    if (!present) return undefined;
    let stopped = false;
    const cleanup = [];
    const finish = () => {
      if (stopped) return;
      stopped = true;
      cleanup.forEach((fn) => fn());
      onDone?.();
    };
    const timeout = setTimeout(finish, 3000);
    cleanup.push(() => clearTimeout(timeout));
    const minimum = new Promise((resolve) => {
      const timer = setTimeout(resolve, 3000);
      cleanup.push(() => clearTimeout(timer));
    });
    const hero = document.querySelector('#conteudo img[fetchpriority="high"], #conteudo img[loading="eager"]');
    const imageReady = new Promise((resolve) => {
      if (!hero || hero.complete) return resolve();
      hero.addEventListener('load', resolve, { once: true });
      hero.addEventListener('error', resolve, { once: true });
      cleanup.push(() => {
        hero.removeEventListener('load', resolve);
        hero.removeEventListener('error', resolve);
      });
    });
    Promise.allSettled([minimum, imageReady, document.fonts?.ready]).then(finish);
    return () => { stopped = true; cleanup.forEach((fn) => fn()); };
  }, [onDone, present, reduced]);

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.25 } }}
      aria-label="Carregamento do site"
      aria-hidden={!present || undefined}
      inert={!present || undefined}
      style={{ pointerEvents: present ? 'auto' : 'none' }}
    >
      <div className="preloader__inner">
        <p className="preloader__edition">THE DRIVE GALLERY</p>
        <BrandMark />
        <p className="preloader__headline">Novos caminhos.<br /><span>Uma nova experiência.</span></p>
        <div className="preloader__track" aria-hidden="true"><span /></div>
        <p className="preloader__status" role="status">Preparando sua experiência</p>
      </div>
      <button type="button" className="preloader__skip" onClick={onDone}>Entrar no site <span aria-hidden="true">↗</span></button>
    </motion.div>
  );
}
