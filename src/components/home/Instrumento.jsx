import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

const RAIO = 150;
const TICKS = 60;

/**
 * INSTRUMENTO
 *
 * Anel de instrumento de painel, reduzido ao essencial: aros
 * concêntricos, marcações e um arco vermelho que varre devagar.
 *
 * Existe para ocupar o lado direito do manifesto, que estava vazio.
 * É vetorial e anima só rotação e opacidade — nada de repaint.
 */
export default function Instrumento({ className = '' }) {
  const raiz = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.to('.instrumento__anel-externo', {
        rotate: 360,
        duration: 90,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center',
      });

      gsap.to('.instrumento__anel-interno', {
        rotate: -360,
        duration: 130,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center',
      });

      // A varredura vermelha: vai e volta, como um ponteiro procurando
      gsap.fromTo(
        '.instrumento__varredura',
        { rotate: -128 },
        {
          rotate: 128,
          duration: 6.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          transformOrigin: 'center',
        },
      );

      gsap.to('.instrumento__pulso', {
        scale: 1.35,
        opacity: 0,
        duration: 3.2,
        ease: 'power2.out',
        repeat: -1,
        transformOrigin: 'center',
      });

      gsap.to('.instrumento__tick', {
        opacity: 0.85,
        duration: 1.4,
        ease: 'sine.inOut',
        stagger: { each: 0.05, from: 'start', repeat: -1, yoyo: true },
      });
    },
    { scope: raiz },
  );

  const ticks = Array.from({ length: TICKS }, (_, i) => {
    const ang = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
    const maior = i % 5 === 0;
    const r1 = RAIO - (maior ? 16 : 8);
    return {
      x1: 180 + Math.cos(ang) * r1,
      y1: 180 + Math.sin(ang) * r1,
      x2: 180 + Math.cos(ang) * RAIO,
      y2: 180 + Math.sin(ang) * RAIO,
      maior,
    };
  });

  return (
    <div className={`instrumento ${className}`} ref={raiz} aria-hidden="true">
      <svg viewBox="0 0 360 360" role="presentation">
        <defs>
          <linearGradient id="inst-varredura" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-red)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent-red)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle className="instrumento__pulso" cx="180" cy="180" r="96"
          fill="none" stroke="var(--accent-red)" strokeWidth="1" opacity="0.5" />

        <circle className="instrumento__anel-externo" cx="180" cy="180" r={RAIO + 18}
          fill="none" stroke="rgba(244,243,240,0.12)" strokeWidth="1"
          strokeDasharray="2 14" />

        <circle className="instrumento__anel-interno" cx="180" cy="180" r={RAIO - 42}
          fill="none" stroke="rgba(244,243,240,0.08)" strokeWidth="1"
          strokeDasharray="30 10" />

        <circle cx="180" cy="180" r="96" fill="none" stroke="rgba(244,243,240,0.06)" strokeWidth="1" />

        <g className="instrumento__ticks">
          {ticks.map((t, i) => (
            <line
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="instrumento__tick"
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.maior ? 'rgba(244,243,240,0.4)' : 'rgba(244,243,240,0.16)'}
              strokeWidth={t.maior ? 2 : 1}
              opacity="0.35"
            />
          ))}
        </g>

        {/* Setor varrido pelo ponteiro */}
        <path
          className="instrumento__varredura"
          d={`M 180 180 L ${180 - 44} ${180 - 138} A 145 145 0 0 1 ${180 + 44} ${180 - 138} Z`}
          fill="url(#inst-varredura)"
          opacity="0.35"
        />

        <circle cx="180" cy="180" r="5" fill="var(--accent-red)" />
      </svg>
    </div>
  );
}
