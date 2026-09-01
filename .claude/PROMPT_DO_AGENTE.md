---
title: "PROMPT DO AGENTE - Redesign Cinematográfico PHD Automóveis"
date: 2024-09-01
status: "Pronto para execução"
---

# PROMPT EXECUTIVO PARA AGENTE CLAUDE

## Objetivo Principal
Reestilizar completamente o site PHD Automóveis (https://www.phdautomoveis.com.br/) aplicando uma linguagem visual **cinematográfica e luxuosa**, mantendo a paleta de cores **preto, branco e vermelho**, e aproveitando as bibliotecas de animação já instaladas (GSAP, Motion.dev, Lenis).

**Resultado esperado:** Um site que se sinta como um **catálogo de design premium** com transições suaves, animações dramáticas controladas por scroll, e interatividade que instiga o visitante a explorar o catálogo de veículos.

---

## Contexto Técnico
- **Stack:** React 19 + Vite + React Router 7
- **Animações:** GSAP 3.13 + Motion.dev 12.23 + Lenis 1.3.26
- **CSS:** Arquivos modularizados (tokens.css, components.css, home.css, catalog.css, etc)
- **Estrutura:** Componentes bem organizados com padrões claros

---

## Fase 1: Fundação Visual (Dia 1-2)

### 1.1 Expandir Design Tokens
**Arquivo:** `src/styles/tokens.css`

Adicionar à seção de cores:
```css
/* --- Novas cores para cinematografia --- */
--accent-red: #dc2626;        /* Vermelho vibrante */
--accent-red-bright: #ef4444; /* Vermelho brilho */
--accent-red-dim: rgba(220, 38, 38, 0.12);
--accent-red-glow: rgba(220, 38, 38, 0.3);

--dark-black: #0a0a0a;        /* Mais profundo */
--dark-navy: #0f172a;         /* Azul-preto */
--dark-slate: #1a202c;        /* Cinza-azul */

/* --- Gradientes cinematográficos --- */
--gradient-dark-fade: linear-gradient(90deg, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.5) 50%, transparent 100%);
--gradient-accent-glow: radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 70%);
--gradient-metallic: linear-gradient(90deg, #8b9099 0%, #3d424a 100%);

/* --- Shadows cinemáticas --- */
--shadow-glow: 0 0 20px rgba(220, 38, 38, 0.3), 0 0 40px rgba(220, 38, 38, 0.1);
--shadow-deep: 0 20px 40px rgba(0, 0, 0, 0.6);
--shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.3);

/* --- Easing functions estendidas --- */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--ease-quint-out: cubic-bezier(0.23, 1, 0.320, 1);

/* --- Durações refinadas --- */
--dur-very-slow: 1.2s;
--dur-slow: 0.9s;
--dur-medium: 0.6s;
--dur-fast: 0.3s;
--dur-very-fast: 0.15s;
```

Modificar a cor accent existente:
```css
--accent: #dc2626;        /* Substituir #c08a5e */
--accent-bright: #ef4444; /* Substituir #dfa878 */
--accent-dim: rgba(220, 38, 38, 0.12);
```

---

### 1.2 Criar Arquivo de @keyframes Centralizadas
**Arquivo novo:** `src/styles/animations.css`

```css
/* ============================================================
   PHD — Animações Cinematográficas
   ============================================================ */

/* --- Reveals --- */
@keyframes reveal-fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes reveal-fade-scale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes reveal-clip-from-left {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes reveal-clip-from-right {
  from {
    clip-path: inset(0 0 0 100%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes reveal-clip-from-top {
  from {
    clip-path: inset(100% 0 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes reveal-clip-from-bottom {
  from {
    clip-path: inset(0 0 100% 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

/* --- Glow Effects --- */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: var(--shadow-glow);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 40px rgba(220, 38, 38, 0.2), 0 0 20px rgba(220, 38, 38, 0.05);
    opacity: 0.8;
  }
}

@keyframes glow-border {
  0%, 100% {
    border-color: rgba(220, 38, 38, 0.5);
    box-shadow: 0 0 10px rgba(220, 38, 38, 0.3);
  }
  50% {
    border-color: rgba(220, 38, 38, 0.8);
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
  }
}

/* --- Shimmer Loading --- */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

@keyframes shimmer-pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* --- Wave Effects --- */
@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes wave-distortion {
  0% {
    clip-path: polygon(
      0 45%, 5% 46%, 10% 47%, 15% 46%, 20% 45%, 25% 44%, 30% 43%,
      35% 42%, 40% 41%, 45% 40%, 50% 41%, 55% 42%, 60% 43%, 65% 44%,
      70% 45%, 75% 46%, 80% 47%, 85% 46%, 90% 45%, 95% 44%, 100% 43%,
      100% 100%, 0 100%
    );
  }
  100% {
    clip-path: polygon(
      0 40%, 5% 39%, 10% 38%, 15% 39%, 20% 40%, 25% 41%, 30% 42%,
      35% 43%, 40% 44%, 45% 45%, 50% 44%, 55% 43%, 60% 42%, 65% 41%,
      70% 40%, 75% 39%, 80% 38%, 85% 39%, 90% 40%, 95% 41%, 100% 42%,
      100% 100%, 0 100%
    );
  }
}

/* --- Rotate 3D --- */
@keyframes rotate-3d-x {
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(360deg);
  }
}

@keyframes rotate-3d-y {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}

/* --- Floating --- */
@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-pulse {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.02);
  }
}

/* --- Typewriter --- */
@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes typewriter-cursor {
  0%, 49%, 100% {
    border-color: var(--accent-red);
  }
  50%, 99% {
    border-color: transparent;
  }
}

/* --- Marquee --- */
@keyframes marquee-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes marquee-right {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

/* --- Color Shift --- */
@keyframes color-shift {
  0% {
    filter: hue-rotate(0deg) saturate(1);
  }
  50% {
    filter: hue-rotate(10deg) saturate(1.1);
  }
  100% {
    filter: hue-rotate(0deg) saturate(1);
  }
}

@keyframes brightness-pulse {
  0%, 100% {
    filter: brightness(1) contrast(1);
  }
  50% {
    filter: brightness(1.1) contrast(1.05);
  }
}

/* --- Bounce --- */
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(30px);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

@keyframes bounce-out {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0;
    transform: scale(0.3) translateY(-30px);
  }
}

/* --- Staggered Reveal --- */
.reveal-stagger-1 {
  animation: reveal-fade-up var(--dur-slow) var(--ease-out) 0s both;
}

.reveal-stagger-2 {
  animation: reveal-fade-up var(--dur-slow) var(--ease-out) 0.1s both;
}

.reveal-stagger-3 {
  animation: reveal-fade-up var(--dur-slow) var(--ease-out) 0.2s both;
}

.reveal-stagger-4 {
  animation: reveal-fade-up var(--dur-slow) var(--ease-out) 0.3s both;
}

.reveal-stagger-5 {
  animation: reveal-fade-up var(--dur-slow) var(--ease-out) 0.4s both;
}
```

Importar no `main.css`:
```css
@import './animations.css';
```

---

### 1.3 Criar Arquivo de Effects
**Arquivo novo:** `src/styles/effects.css`

```css
/* ============================================================
   PHD — Efeitos Visuais Especiais
   ============================================================ */

/* --- Glow Containers --- */
.glow-container {
  position: relative;
  overflow: hidden;
}

.glow-container::before {
  content: '';
  position: absolute;
  inset: -100%;
  background: var(--gradient-accent-glow);
  animation: pulse-glow var(--dur-slow) ease-in-out infinite;
  pointer-events: none;
}

.glow-container.static::before {
  animation: none;
  opacity: 0.5;
}

/* --- Shimmer Effect --- */
.shimmer-effect {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    var(--ink-800) 0%,
    var(--ink-700) 50%,
    var(--ink-800) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.shimmer-effect.pulse {
  animation: shimmer-pulse 1.5s ease-in-out infinite, shimmer 2s infinite;
}

/* --- Glass Morphism --- */
.glass-effect {
  background: rgba(8, 9, 10, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(244, 243, 240, 0.1);
  border-radius: var(--radius-lg);
}

.glass-effect.thick {
  background: rgba(8, 9, 10, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(244, 243, 240, 0.15);
}

/* --- Noise Texture --- */
.noise-texture {
  position: relative;
}

.noise-texture::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2"/></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.03"/></svg>');
  pointer-events: none;
  opacity: 0.5;
}

/* --- Color Overlay Dynamic --- */
.overlay-gradient {
  position: relative;
}

.overlay-gradient::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-dark-fade);
  pointer-events: none;
  z-index: 2;
}

/* --- Border Animated --- */
.border-animated {
  position: relative;
  border: 1px solid var(--line);
  overflow: hidden;
}

.border-animated::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-dark-fade);
  border: 1px solid var(--accent-red);
  opacity: 0;
  animation: glow-border var(--dur-medium) ease-in-out infinite;
  pointer-events: none;
}

/* --- Wave Background --- */
.wave-background {
  position: relative;
  background: var(--bg);
  overflow: hidden;
}

.wave-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent 0,
    transparent calc(100% / 20),
    rgba(220, 38, 38, 0.05) calc(100% / 20),
    rgba(220, 38, 38, 0.05) calc(200% / 20)
  );
  animation: wave 20s linear infinite;
}

/* --- Mesh Gradient (simulado com múltiplos radiais) --- */
.mesh-gradient {
  position: relative;
  background: 
    radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(139, 144, 153, 0.05) 0%, transparent 50%),
    var(--bg);
  background-attachment: fixed;
}

/* --- Text Glow --- */
.text-glow {
  color: var(--fg);
  text-shadow: 
    0 0 20px rgba(220, 38, 38, 0.3),
    0 0 40px rgba(220, 38, 38, 0.2),
    0 0 60px rgba(220, 38, 38, 0.1);
}

.text-glow.bright {
  text-shadow: 
    0 0 30px rgba(220, 38, 38, 0.5),
    0 0 60px rgba(220, 38, 38, 0.3),
    0 0 90px rgba(220, 38, 38, 0.2);
}

/* --- Depth Shadows --- */
.depth-shadow-1 {
  box-shadow: var(--shadow-soft);
}

.depth-shadow-2 {
  box-shadow: var(--shadow-soft), 0 20px 50px rgba(0, 0, 0, 0.4);
}

.depth-shadow-3 {
  box-shadow: var(--shadow-deep);
}

/* --- Focus Glow --- */
.focus-glow:focus {
  outline: none;
  box-shadow: var(--shadow-glow);
}

.focus-glow:focus-visible {
  outline: 2px solid var(--accent-red);
  outline-offset: 2px;
}
```

Importar no `main.css`:
```css
@import './effects.css';
```

---

### 1.4 Criar Utilitários de Animação GSAP
**Arquivo novo:** `src/lib/animations.js`

```javascript
import gsap from 'gsap';

/**
 * UTILITÁRIOS DE ANIMAÇÃO
 * Funções reutilizáveis para animações comuns
 */

// ========== REVEALS ==========

export const createTextReveal = (element, config = {}) => {
  const {
    stagger = 0.05,
    duration = 0.9,
    ease = 'power3.out',
    delay = 0,
    y = 20,
    splitBy = 'word', // 'word', 'line', 'letter'
  } = config;

  const targets = element.querySelectorAll(`.split-${splitBy}__${splitBy}`);
  if (targets.length === 0) return null;

  return gsap.from(targets, {
    opacity: 0,
    y,
    duration,
    stagger,
    ease,
    delay,
  });
};

export const createClipPathReveal = (element, config = {}) => {
  const {
    duration = 0.9,
    ease = 'power3.out',
    delay = 0,
    direction = 'left', // 'left', 'right', 'top', 'bottom'
  } = config;

  const clipPaths = {
    left: { from: 'inset(0 100% 0 0)', to: 'inset(0 0 0 0)' },
    right: { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0)' },
    top: { from: 'inset(100% 0 0 0)', to: 'inset(0 0 0 0)' },
    bottom: { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0 0)' },
  };

  const paths = clipPaths[direction];
  element.style.clipPath = paths.from;

  return gsap.to(element, {
    clipPath: paths.to,
    duration,
    ease,
    delay,
  });
};

export const createScaleReveal = (element, config = {}) => {
  const { duration = 0.9, ease = 'back.out', delay = 0, scale = 0.8 } = config;

  return gsap.from(element, {
    scale,
    opacity: 0,
    duration,
    ease,
    delay,
  });
};

// ========== PARALLAX ==========

export const createParallaxLayers = (container, depths = [0.1, 0.2, 0.5]) => {
  const layers = container.querySelectorAll('[data-parallax]');
  const animations = [];

  layers.forEach((layer, i) => {
    const depth = depths[i % depths.length];
    const anim = gsap.to(layer, {
      yPercent: () => window.innerHeight * -depth * 0.15,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });
    animations.push(anim);
  });

  return animations;
};

export const createParallaxHorizontal = (container, multiplier = 0.5) => {
  return gsap.to(container, {
    x: () => window.innerWidth * multiplier,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.5,
      invalidateOnRefresh: true,
    },
  });
};

// ========== SCROLL TRIGGERS ==========

export const createScrollZoom = (element, config = {}) => {
  const { from = 0.9, to = 1.2, duration = 0.9 } = config;

  return gsap.fromTo(
    element,
    { scale: from },
    {
      scale: to,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    },
  );
};

export const createScrollFade = (element, config = {}) => {
  const { from = 0.3, to = 1, ease = 'none' } = config;

  return gsap.fromTo(
    element,
    { opacity: from },
    {
      opacity: to,
      ease,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    },
  );
};

export const createScrollRotate = (element, config = {}) => {
  const { from = 0, to = 10, ease = 'none' } = config;

  return gsap.fromTo(
    element,
    { rotation: from },
    {
      rotation: to,
      ease,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    },
  );
};

// ========== HOVER EFFECTS ==========

export const createMagneticButton = (element, config = {}) => {
  const { force = 0.25, ease = 'power2.out', returnDuration = 0.3 } = config;

  const onMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    gsap.to(element, {
      x: x * force,
      y: y * force,
      duration: 0.3,
      ease,
    });
  };

  const onMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: returnDuration,
      ease,
    });
  };

  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  return () => {
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
  };
};

// ========== SEQUENCES ==========

export const createSectionSequence = (container, config = {}) => {
  const { stagger = 0.1, duration = 0.9, ease = 'power3.out' } = config;

  const elements = container.querySelectorAll('[data-animate]');
  return gsap.from(elements, {
    opacity: 0,
    y: 30,
    duration,
    stagger,
    ease,
  });
};

export const createStaggerSequence = (elements, config = {}) => {
  const {
    stagger = 0.05,
    duration = 0.9,
    ease = 'power3.out',
    from = { opacity: 0, y: 20 },
  } = config;

  return gsap.from(elements, {
    ...from,
    duration,
    stagger,
    ease,
  });
};

// ========== SPECIAL EFFECTS ==========

export const createCountUp = (element, target, config = {}) => {
  const { duration = 2, ease = 'power1.inOut', separator = ',' } = config;

  const counterObj = { value: 0 };
  return gsap.to(counterObj, {
    value: target,
    duration,
    ease,
    onUpdate: function () {
      element.textContent = Math.floor(counterObj.value).toLocaleString();
    },
  });
};

export const createColorShift = (element, colors, config = {}) => {
  const { duration = 3, ease = 'linear', property = 'backgroundColor' } = config;

  return gsap.to(element, {
    [property]: colors[colors.length - 1],
    duration: duration * (colors.length - 1),
    ease,
    modifiers: {
      [property]: gsap.interpolate(colors),
    },
    repeat: -1,
    yoyo: true,
  });
};

export const createDistortionWave = (element, config = {}) => {
  const { duration = 2, intensity = 1 } = config;

  return gsap.to(element, {
    duration,
    repeat: -1,
    filter: `blur(${1 * intensity}px)`,
    yoyo: true,
  });
};

// ========== UTILS ==========

export const killAllAnimations = (element) => {
  gsap.killTweensOf(element);
};

export const getScrollProgress = (element) => {
  const rect = element.getBoundingClientRect();
  const start = rect.top;
  const end = rect.bottom;
  return Math.max(0, Math.min(1, 1 - (end / window.innerHeight)));
};
```

---

## Fase 2: Hero & Header (Dia 2-3)

### 2.1 Refatorar Hero Component
**Arquivo:** `src/components/home/Hero.jsx`

Adicionar novos effects:
- Clip-path reveal de imagem (da esquerda)
- Entrada mais dramática de texto com letter-stagger
- Botões com magnetic effect
- Gradiente animado no overlay

---

### 2.2 Implementar ScrollProgress Bar
**Arquivo novo:** `src/components/layout/ScrollProgress.jsx`

```javascript
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      gsap.to(barRef.current, {
        width: `${progress}%`,
        duration: 0.3,
        ease: 'linear',
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2px',
        background: 'linear-gradient(90deg, var(--accent-red) 0%, var(--accent-red-bright) 100%)',
        zIndex: 9999,
        width: '0%',
      }}
    />
  );
}
```

Adicionar ao `App.jsx`:
```javascript
import ScrollProgress from '@/components/layout/ScrollProgress';

// Na renderização:
<ScrollProgress />
```

---

### 2.3 Criar MagneticButton Component
**Arquivo novo:** `src/components/animations/MagneticButton.jsx`

```javascript
import { useRef, useEffect } from 'react';
import { createMagneticButton } from '@/lib/animations';

export default function MagneticButton({
  children,
  onClick,
  className = '',
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    return createMagneticButton(ref.current);
  }, []);

  return (
    <button
      ref={ref}
      className={`magnetic-button ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
```

Adicionar CSS em `styles/components.css`:
```css
.magnetic-button {
  position: relative;
  will-change: transform;
  transition: filter 0.3s ease;
}

.magnetic-button:hover {
  filter: brightness(1.1);
}

.magnetic-button:active {
  filter: brightness(0.95);
}
```

---

## Fase 3: Manifesto & Collection (Dia 3-4)

### 3.1 Refatorar Manifesto
**Arquivo:** `src/components/home/Manifesto.jsx`

Mudanças principais:
- Remover `pin: true` do ScrollTrigger
- Implementar reveal sequencial de frases (em vez de palavras)
- Adicionar contador com `createCountUp`
- Background cor dinâmica conforme scroll

---

### 3.2 Refatorar Collection
**Arquivo:** `src/components/home/Collection.jsx`

Adicionar:
- Perspectiva 3D nos cartões (rotateY sutil)
- Depth fade (blur nos laterais)
- Sombra dinâmica
- Scroll indicator

---

## Fase 4: Catálogo (Dia 4-5)

### 4.1 Refatorar VehicleCard
**Arquivo:** `src/components/catalog/VehicleCard.jsx`

Adicionar:
- Glow effect na borda
- Shimmer effect no hover
- Selo com pulse animation
- Preço com reveal animation

CSS:
```css
.vcard {
  border: 1px solid var(--line);
  animation: glow-border 2s ease-in-out infinite;
}

.vcard:hover {
  box-shadow: var(--shadow-glow);
}

.vcard__selo {
  animation: pulse-glow 2s ease-in-out infinite;
}

.vcard__preco {
  animation: float-gentle 2s ease-in-out infinite;
}
```

---

## Fase 5: Página de Veículo (Dia 5-6)

### 5.1 Refatorar SpecSequence
**Arquivo:** `src/components/vehicle/SpecSequence.jsx`

Adicionar:
- Reveal staggered das specs
- Números com countUp animation
- Dividers com clip-path animation

---

## Fase 6: Drive Mode (Dia 6-7)

### 6.1 Refatorar DriveMode
**Arquivo:** `src/components/drivemode/DriveMode.jsx`

Adicionar:
- Transição de entrada/saída (fade preto)
- Color shift animado da imagem
- Flip 3D do painel de specs
- Typewriter effect no índice

---

## Fase 7: Testes & Otimização (Dia 7-8)

### 7.1 Testes de Performance
- [ ] Chrome DevTools Performance
- [ ] Lighthouse scores
- [ ] FPS em scroll (deve manter > 55fps)
- [ ] Memory leaks (devtools)

### 7.2 Testes de Responsividade
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Gestos touch

### 7.3 Validação de Acessibilidade
- [ ] prefers-reduced-motion: todas animações desabilitadas
- [ ] Contraste de cores (WCAG AA mínimo)
- [ ] Navegação por teclado
- [ ] Screen reader (NVDA/JAWS)

---

## Checklist de Implementação

### Fundação
- [ ] tokens.css expandido com cores + gradientes
- [ ] animations.css com @keyframes centralizadas
- [ ] effects.css com estilos reutilizáveis
- [ ] animations.js com funções utilitárias

### Hero
- [ ] Clip-path reveal de imagem
- [ ] Text stagger cinematográfico
- [ ] Botões com magnetic effect
- [ ] Gradiente animado no overlay

### Manifesto
- [ ] Remover pin do scroll
- [ ] Reveal sequencial de frases
- [ ] Contador animado
- [ ] Background dinâmico

### Collection
- [ ] Perspectiva 3D
- [ ] Depth fade
- [ ] Sombra dinâmica
- [ ] Scroll indicator

### Catálogo
- [ ] Glow na borda dos cards
- [ ] Shimmer effect
- [ ] Selo com pulse
- [ ] Preço com reveal

### Veículo
- [ ] Specs com stagger
- [ ] Count-up de números
- [ ] Lightbox animado

### Drive Mode
- [ ] Transições de entrada/saída
- [ ] Color shift
- [ ] Flip 3D
- [ ] Typewriter effect

### Testes
- [ ] Performance > 55fps
- [ ] Acessibilidade WCAG AA
- [ ] Responsividade total
- [ ] Sem memory leaks

---

## Notas Importantes

1. **Ordem de Cascata CSS:** Respeitar order em main.css:
   - tokens → base → effects → animations → components → seções → páginas

2. **Acessibilidade Primeira:** Sempre wrappear animações com:
   ```javascript
   if (prefersReducedMotion()) return; // Skip animation
   ```

3. **Performance:** Usar `will-change` apenas em elementos que mudam
   - Remover depois que animação termina

4. **Mobile First:** Testes em dispositivos reais, não só DevTools

5. **User Testing:** Coletar feedback sobre "feel" das animações
   - Timing muito lento ou rápido?
   - Efeitos distrativos?
   - Impacto emocional positivo?

---

## Recursos de Referência

- GSAP Docs: https://gsap.com/docs/
- Motion.dev Docs: https://motion.dev/
- Lenis Docs: https://lenis.darkroom.engineering/
- Design Inspiration: https://www.awwwards.com/ (search "automotive luxury")

---

**Documento finalizado em:** 2024-09-01
**Status:** Pronto para execução por agente Claude
**Estimativa:** 7-8 dias de trabalho (se full-time)
