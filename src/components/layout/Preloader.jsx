import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Abertura da galeria. Curta de propósito — 1,4s.
 * O objetivo é dar um respiro antes do hero, não atrasar o conteúdo.
 */
export default function Preloader({ onDone }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) {
      onDone?.();
      return undefined;
    }
    const duration = 1200;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setCount(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setTimeout(() => onDone?.(), 260);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, onDone]);

  if (reduced) return null;

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="preloader__inner">
        <div className="preloader__mark">
          <span className="preloader__sigla">PHD</span>
          <span className="meta">Automóveis · Brasília</span>
        </div>
        <div className="preloader__count">{String(count).padStart(3, '0')}</div>
      </div>
      <motion.div
        className="preloader__bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: count / 100 }}
        transition={{ ease: 'linear', duration: 0.1 }}
      />
    </motion.div>
  );
}
