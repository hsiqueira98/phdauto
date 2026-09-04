import { gsap, prefersReducedMotion } from './gsap';

/**
 * UTILITÁRIOS DE ANIMAÇÃO
 *
 * Funções reutilizáveis para os padrões que se repetem no site.
 * Os helpers respeitam movimento reduzido mesmo fora de um contexto React.
 */

/* ========================= REVEALS ========================= */

export const createTextReveal = (element, config = {}) => {
  const {
    stagger = 0.05,
    duration = 0.9,
    ease = 'power3.out',
    delay = 0,
    y = 20,
    splitBy = 'word', // 'word' | 'line' | 'letter'
  } = config;

  if (!element || prefersReducedMotion()) return null;

  const seletor = {
    word: '.split-words__word',
    line: '.split__inner',
    letter: '.split-letters__letter',
  }[splitBy];

  const alvos = element.querySelectorAll(seletor);
  if (!alvos.length) return null;

  return gsap.from(alvos, { opacity: 0, y, duration, stagger, ease, delay });
};

/** Revelação por máscara. Guarda o estado inicial no próprio elemento. */
export const createClipPathReveal = (element, config = {}) => {
  const { duration = 0.9, ease = 'power3.out', delay = 0, direction = 'left' } = config;
  if (!element || prefersReducedMotion()) return null;

  const mascaras = {
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
    top: 'inset(100% 0 0 0)',
    bottom: 'inset(0 0 100% 0)',
  };

  return gsap.fromTo(
    element,
    { clipPath: mascaras[direction] ?? mascaras.left },
    { clipPath: 'inset(0 0 0 0)', duration, ease, delay },
  );
};

export const createScaleReveal = (element, config = {}) => {
  const { duration = 0.9, ease = 'back.out(1.4)', delay = 0, scale = 0.8 } = config;
  if (!element || prefersReducedMotion()) return null;
  return gsap.from(element, { scale, opacity: 0, duration, ease, delay });
};

/* ========================= PARALLAX ======================== */

export const createParallaxLayers = (container, depths = [0.1, 0.2, 0.5]) => {
  if (!container || prefersReducedMotion()) return [];
  const camadas = container.querySelectorAll('[data-parallax]');

  return Array.from(camadas).map((camada, i) => {
    const profundidade = Number(camada.dataset.parallax) || depths[i % depths.length];
    return gsap.to(camada, {
      yPercent: () => -profundidade * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });
  });
};

/* ====================== SCROLL-DRIVEN ====================== */

export const createScrollZoom = (element, config = {}) => {
  const { from = 0.9, to = 1.2, start = 'top 80%', end = 'top 20%' } = config;
  if (!element || prefersReducedMotion()) return null;

  return gsap.fromTo(
    element,
    { scale: from },
    {
      scale: to,
      ease: 'none',
      scrollTrigger: { trigger: element, start, end, scrub: 0.6, invalidateOnRefresh: true },
    },
  );
};

export const createScrollFade = (element, config = {}) => {
  const { from = 0.3, to = 1 } = config;
  if (!element || prefersReducedMotion()) return null;

  return gsap.fromTo(
    element,
    { opacity: from },
    {
      opacity: to,
      ease: 'none',
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

/* ====================== HOVER / PONTEIRO ==================== */

/**
 * Botão que puxa levemente o cursor.
 * Devolve a função de limpeza — obrigatório remover os listeners.
 */
export const createMagneticButton = (element, config = {}) => {
  const { force = 0.25, ease = 'power2.out', returnDuration = 0.4 } = config;
  if (!element || prefersReducedMotion() ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};

  let bounds;
  let originScrollX = 0;
  let originScrollY = 0;
  let xTo;
  let yTo;
  const context = gsap.context(() => {
    xTo = gsap.quickTo(element, 'x', { duration: 0.3, ease });
    yTo = gsap.quickTo(element, 'y', { duration: 0.3, ease });
  });

  const measure = () => {
    const r = element.getBoundingClientRect();
    bounds = {
      x: r.left + r.width / 2 - Number(gsap.getProperty(element, 'x')),
      y: r.top + r.height / 2 - Number(gsap.getProperty(element, 'y')),
    };
    originScrollX = window.scrollX;
    originScrollY = window.scrollY;
  };

  const aoMover = (e) => {
    if (e.pointerType === 'touch') return;
    if (!bounds) measure();
    // Cache layout at pointer entry; only update reusable tweens while moving.
    xTo.tween.duration(0.3);
    yTo.tween.duration(0.3);
    xTo((e.clientX - bounds.x + window.scrollX - originScrollX) * force);
    yTo((e.clientY - bounds.y + window.scrollY - originScrollY) * force);
  };

  const aoSair = () => {
    bounds = null;
    xTo.tween.duration(returnDuration);
    yTo.tween.duration(returnDuration);
    xTo(0);
    yTo(0);
  };

  element.addEventListener('pointerenter', measure, { passive: true });
  element.addEventListener('pointermove', aoMover, { passive: true });
  element.addEventListener('pointerleave', aoSair);

  return () => {
    element.removeEventListener('pointerenter', measure);
    element.removeEventListener('pointermove', aoMover);
    element.removeEventListener('pointerleave', aoSair);
    // Revert only this effect, restoring the original transform as well.
    context.revert();
  };
};

/* ========================= SEQUÊNCIAS ======================= */

export const createSectionSequence = (container, config = {}) => {
  const { stagger = 0.1, duration = 0.9, ease = 'power3.out', start = 'top 78%' } = config;
  if (!container || prefersReducedMotion()) return null;

  const elementos = container.querySelectorAll('[data-animate]');
  if (!elementos.length) return null;

  return gsap.from(elementos, {
    opacity: 0,
    y: 30,
    duration,
    stagger,
    ease,
    scrollTrigger: { trigger: container, start },
  });
};

export const createStaggerSequence = (elements, config = {}) => {
  const { stagger = 0.05, duration = 0.9, ease = 'power3.out', from = { opacity: 0, y: 20 } } = config;
  if (!elements || !elements.length || prefersReducedMotion()) return null;
  return gsap.from(elements, { ...from, duration, stagger, ease });
};

/* ====================== EFEITOS ESPECIAIS =================== */

/** Contagem numérica com separador de milhar em pt-BR. */
export const createCountUp = (element, target, config = {}) => {
  const { duration = 2, ease = 'power1.inOut', formatar = null } = config;
  if (!element) return null;
  if (prefersReducedMotion()) {
    const value = Math.floor(target);
    element.textContent = formatar ? formatar(value) : value.toLocaleString('pt-BR');
    return null;
  }

  const contador = { valor: 0 };
  return gsap.to(contador, {
    valor: target,
    duration,
    ease,
    onUpdate() {
      const n = Math.floor(contador.valor);
      element.textContent = formatar ? formatar(n) : n.toLocaleString('pt-BR');
    },
  });
};

/**
 * Transição contínua entre cores.
 *
 * `gsap.interpolate` não existe como modifier — o caminho correto é
 * `gsap.utils.interpolate`, que devolve uma função de 0→1 sobre a
 * lista. Animamos um proxy e aplicamos o resultado no elemento.
 */
export const createColorShift = (element, colors, config = {}) => {
  const { duration = 3, ease = 'none', property = 'backgroundColor' } = config;
  if (!element || !colors || colors.length < 2 || prefersReducedMotion()) return null;

  const proxy = { p: 0 };
  const interpolar = gsap.utils.interpolate(colors);
  const setColor = gsap.quickSetter(element, property);

  return gsap.to(proxy, {
    p: 1,
    duration: duration * (colors.length - 1),
    ease,
    repeat: -1,
    yoyo: true,
    onUpdate: () => setColor(interpolar(proxy.p)),
  });
};

/**
 * Respiração sutil da imagem usando apenas transformação composta.
 * Evita filtros em fotografias grandes, que exigem repintura a cada quadro.
 */
export const createDistortionWave = (element, config = {}) => {
  const { duration = 4, intensity = 1 } = config;
  if (!element || prefersReducedMotion()) return null;

  return gsap.to(element, {
    scale: 1 + 0.015 * intensity,
    duration,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });
};

/* ============================ UTILS ========================= */

export const killAllAnimations = (element) => gsap.killTweensOf(element);

/** Libera `will-change` quando a animação termina — ele custa memória. */
export const releaseWillChange = (element) => {
  if (element) gsap.set(element, { willChange: 'auto' });
};
