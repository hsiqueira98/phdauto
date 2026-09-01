import { gsap } from './gsap';

/**
 * UTILITÁRIOS DE ANIMAÇÃO
 *
 * Funções reutilizáveis para os padrões que se repetem no site.
 * Quem chama é responsável por checar `prefersReducedMotion()`.
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

  if (!element) return null;

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
  if (!element) return null;

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
  if (!element) return null;
  return gsap.from(element, { scale, opacity: 0, duration, ease, delay });
};

/* ========================= PARALLAX ======================== */

export const createParallaxLayers = (container, depths = [0.1, 0.2, 0.5]) => {
  if (!container) return [];
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
  if (!element) return null;

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
  if (!element) return null;

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
  if (!element) return () => {};

  const aoMover = (e) => {
    const r = element.getBoundingClientRect();
    gsap.to(element, {
      x: (e.clientX - (r.left + r.width / 2)) * force,
      y: (e.clientY - (r.top + r.height / 2)) * force,
      duration: 0.3,
      ease,
    });
  };

  const aoSair = () => gsap.to(element, { x: 0, y: 0, duration: returnDuration, ease });

  element.addEventListener('pointermove', aoMover);
  element.addEventListener('pointerleave', aoSair);

  return () => {
    element.removeEventListener('pointermove', aoMover);
    element.removeEventListener('pointerleave', aoSair);
    gsap.killTweensOf(element);
  };
};

/* ========================= SEQUÊNCIAS ======================= */

export const createSectionSequence = (container, config = {}) => {
  const { stagger = 0.1, duration = 0.9, ease = 'power3.out', start = 'top 78%' } = config;
  if (!container) return null;

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
  if (!elements || !elements.length) return null;
  return gsap.from(elements, { ...from, duration, stagger, ease });
};

/* ====================== EFEITOS ESPECIAIS =================== */

/** Contagem numérica com separador de milhar em pt-BR. */
export const createCountUp = (element, target, config = {}) => {
  const { duration = 2, ease = 'power1.inOut', formatar = null } = config;
  if (!element) return null;

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
  if (!element || !colors || colors.length < 2) return null;

  const proxy = { p: 0 };
  const interpolar = gsap.utils.interpolate(colors);

  return gsap.to(proxy, {
    p: 1,
    duration: duration * (colors.length - 1),
    ease,
    repeat: -1,
    yoyo: true,
    onUpdate: () => gsap.set(element, { [property]: interpolar(proxy.p) }),
  });
};

/**
 * Respiração sutil da imagem.
 * Blur é caro por quadro, então o peso fica na escala (composta na
 * GPU) e o desfoque entra só como um traço.
 */
export const createDistortionWave = (element, config = {}) => {
  const { duration = 4, intensity = 1 } = config;
  if (!element) return null;

  return gsap.to(element, {
    scale: 1 + 0.015 * intensity,
    filter: `blur(${0.6 * intensity}px) saturate(1.05)`,
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
