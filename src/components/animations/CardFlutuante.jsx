import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';

/**
 * CARD FLUTUANTE
 *
 * Inclina levemente seguindo o ponteiro, como um objeto físico sobre
 * a mesa. A rotação é sutil de propósito: o card tem campos de
 * formulário dentro, e inclinação demais atrapalha mirar o clique.
 *
 * Só liga em ponteiro fino e com movimento permitido.
 */
export default function CardFlutuante({
  children,
  className = '',
  inclinacao = 7,
  ...resto
}) {
  const ref = useRef(null);
  const ponteiroFino = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduzido = useReducedMotion();
  const ativo = ponteiroFino && !reduzido;

  // -0.5 .. 0.5 em cada eixo, relativo ao centro do card
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const mola = { stiffness: 150, damping: 18, mass: 0.6 };
  const sx = useSpring(px, mola);
  const sy = useSpring(py, mola);

  const rotateY = useTransform(sx, [-0.5, 0.5], [-inclinacao, inclinacao]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [inclinacao, -inclinacao]);
  const brilhoX = useTransform(sx, [-0.5, 0.5], [20, 80]);
  const brilhoY = useTransform(sy, [-0.5, 0.5], [20, 80]);

  // Hoisted: dentro do JSX condicional isso seria um hook chamado
  // condicionalmente, que o React não permite.
  const reflexo = useTransform(
    [brilhoX, brilhoY],
    ([x, y]) => `radial-gradient(340px circle at ${x}% ${y}%, rgba(244,243,240,0.08), transparent 65%)`,
  );

  const aoMover = (e) => {
    if (!ativo || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - (r.left + r.width / 2)) / r.width);
    py.set((e.clientY - (r.top + r.height / 2)) / r.height);
  };

  const aoSair = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div className={`flutuante ${className}`} onPointerMove={aoMover} onPointerLeave={aoSair}>
      <motion.div
        ref={ref}
        className="flutuante__card"
        style={ativo ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
        {...resto}
      >
        {/* Reflexo que acompanha o ponteiro — dá volume sem sombra extra */}
        {ativo && (
          <motion.span
            className="flutuante__reflexo"
            aria-hidden="true"
            style={{ background: reflexo }}
          />
        )}
        {children}
      </motion.div>
    </div>
  );
}
