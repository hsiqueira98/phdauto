import { useEffect, useRef } from 'react';
import { createMagneticButton } from '@/lib/animations';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';

/**
 * Botão magnético.
 *
 * `as` permite envolver um <Link> ou <a> sem perder o efeito — os
 * CTAs do site nem sempre são <button>.
 * Só liga em ponteiro fino: no toque não existe hover, e o listener
 * seria peso morto.
 */
export default function MagneticButton({
  children,
  as: Tag = 'button',
  className = '',
  force = 0.25,
  ...props
}) {
  const ref = useRef(null);
  const ponteiroFino = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduzido = useReducedMotion();

  useEffect(() => {
    if (!ref.current || !ponteiroFino || reduzido) return undefined;
    return createMagneticButton(ref.current, { force });
  }, [ponteiroFino, reduzido, force]);

  return (
    <Tag ref={ref} className={`magnetic-button ${className}`} {...props}>
      {children}
    </Tag>
  );
}
