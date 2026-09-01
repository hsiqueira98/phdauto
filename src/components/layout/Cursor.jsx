import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';

/**
 * Cursor da galeria. Só aparece em ponteiro fino (mouse).
 * Qualquer elemento com data-cursor="texto" troca o rótulo.
 */
export default function Cursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduced = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 42, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 900, damping: 42, mass: 0.35 });

  const [label, setLabel] = useState('');
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!fine || reduced) return undefined;

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target.closest('[data-cursor]') : null;
      const interactive =
        e.target instanceof Element ? e.target.closest('a, button, input, [role="button"]') : null;
      setLabel(target?.getAttribute('data-cursor') ?? '');
      setActive(Boolean(target || interactive));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;

  return (
    <motion.div className="cursor" style={{ x: sx, y: sy }} aria-hidden="true">
      <motion.div
        className="cursor__ring"
        animate={{
          scale: label ? 2.9 : active ? 1.7 : 1,
          backgroundColor: label ? 'rgba(220,38,38,0.95)' : 'rgba(244,243,240,0)',
          borderColor: active ? 'rgba(244,243,240,0.9)' : 'rgba(244,243,240,0.5)',
        }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="cursor__label meta"
        animate={{ opacity: label ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
