import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Microinterações de UI — responsabilidade do Motion (motion.dev).
 * O GSAP não entra aqui: ele cuida de scroll, pin e sequência cinematográfica.
 * Duas engines, dois territórios, zero disputa.
 */

/* ---------------------------------------------------------------- Reveal */

export function Reveal({
  children,
  delay = 0,
  y = 28,
  once = true,
  amount = 0.35,
  className = '',
  as = 'div',
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/* -------------------------------------------------------------- Magnetic */

/** Botão que puxa levemente o cursor. Usado só nos CTAs principais. */
export function Magnetic({ children, strength = 0.28, className = '', ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: 'inline-flex' }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------- Marquee */

export function Marquee({ items, speed = 28, className = '', separator = '//' }) {
  const sequence = [...items, ...items];
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {sequence.map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`}>
            {item}
            <em className="marquee__sep">{separator}</em>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Counter */

/** Número que conta quando entra na viewport. */
export function Counter({ to, duration = 1.4, format = (n) => Math.round(n), className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);

  useEffect(() => {
    if (!inView || reduced) {
      if (reduced) setValue(to);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - 2 ** (-10 * t);
      setValue(to * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}

/* -------------------------------------------------------------- ScrollCue */

export function ScrollCue({ label = 'Explorar coleção' }) {
  const reduced = useReducedMotion();
  return (
    <div className="scroll-cue">
      <span className="meta">{label}</span>
      <motion.span
        className="scroll-cue__line"
        animate={reduced ? {} : { scaleY: [0, 1, 0], originY: [0, 0, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
