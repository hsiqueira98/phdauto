# PHD Automóveis - Análise de Redesign Visual e Prompt para Agente

## PARTE 1: ANÁLISE COMPLETA DO PROJETO ATUAL

### 1.1 Visão Geral da Arquitetura
O site é um conceito visual navegável (código comentado como "The Drive Gallery") que se apresenta como um catálogo premium de automóveis seminovos. A estrutura atual é bem pensada mas segue um padrão corporativo clássico de concessionária.

**Stack Técnico:**
- React 19 + Vite + React Router 7
- GSAP 3.13 + @gsap/react (animações complexas)
- Motion.dev 12.23 (microinterações)
- Lenis 1.3.26 (smooth scroll physics)
- Testing: Vitest + React Testing Library

### 1.2 Paleta de Cores Atual
- **Primário:** Preto profundo (#08090a) - superfícies
- **Secundário:** Off-white (#f4f3f0) - texto principal
- **Accent:** Terra/marrom (#c08a5e) - destaques
- **Semânticos:** Cinzas metálicos para hierarquia

**Problema Visual:** Paleta segura, mas monótona. Falta movimento cromático.

### 1.3 Design System Tipográfico
```
Display (4.5rem max): Archivo + Inter
H1: clamp(2rem, 4.2vw, 3.4rem)
H2: clamp(1.6rem, 3vw, 2.5rem)
Entrelinha: 1.08-1.7 (muito bom)
Tracking: Bem calibrado, não condensado
```

**Problema Visual:** Tipografia excelente em legibilidade, mas com pouca hierarquia visual dramática.

### 1.4 Componentes Principais - Estado Atual

#### Hero Section
- Parallax suave de imagem (-12% yPercent)
- Fade de conteúdo (-14% yPercent)
- Entrada staggered (350ms de delay)
- **Limitação:** Movimento discreto, sem dramaticidade

#### Manifesto
- Scroll-pin com reveal de palavras (opacity 0.16 → 1)
- Scrub 0.6 (suave, não abrupto)
- **Limitação:** Pausa forçada no scroll (pode ser irritante)

#### Collection (Horizontal)
- Scroll horizontal controlado por scroll vertical
- Zoom in/out de cartões (0.88 → 1 → 0.88)
- **Limitação:** Funciona bem mas sem elementos dramáticos

#### Catalog
- Grid/Gallery responsivo
- Filtros + busca por linguagem natural
- Motion para entrada de cartões
- **Limitação:** Interface funcional, não cinematográfica

#### Drive Mode
- Fullscreen imersivo
- Navegação por gestos (roda, toque, teclado)
- Som ambiente (blips)
- **Potencial:** Já tem "feel imersivo", pode expandir

### 1.5 Animações Atuais
- Easing padrão: cubic-bezier(0.16, 1, 0.3, 1) "expo.out"
- Duração: 0.25s (rápido) a 0.9s (lento)
- ScrollTrigger: Muitas seções usam pin + scrub
- Will-change: Bem otimizado em elementos críticos

**Problema:** Animações são suaves e funcionais, mas não criam impacto emocional.

### 1.6 Estrutura de Rotas
```
/ (Home) → Hero, Manifesto, Universos, Collection, DriveMode, SmartFind, Sell, Timeline, Showroom, FinalCta
/colecao (Catalog) → Filtros avançados + Gallery
/veiculo/:slug (Vehicle) → Detalhes técnicos + simulador
/vender (Sell)
/financiamento (Financing)
/phd (About)
```

---

## PARTE 2: OPORTUNIDADES DE MELHORIA VISUAL IDENTIFICADAS

### 2.1 Nível Hero (First Fold)
**Atual:**
- Imagem estática com paralax leve
- Texto fadeando conforme scroll

**Oportunidades:**
- [ ] Entrada da imagem com máscara reveladora (clip-path)
- [ ] Texto com split-lines + stagger maior (efeito cinematográfico)
- [ ] Gradiente animado sobreposto sobre imagem
- [ ] Distorção sutil na imagem (GSAP Morpho ou CSS filters)
- [ ] Efeito de "câmera recuando" mais dramático
- [ ] Botões com efeito magnetic + ripple
- [ ] Marquee animado com logomark de carro silhueta

### 2.2 Manifesto (Seção 1)
**Atual:**
- Scroll-pin travando o scroll

**Oportunidades:**
- [ ] Remover pin (experiência de scroll contínua)
- [ ] Substituir por reveal progressivo de 3 frases sequenciais
- [ ] Cada frase com entrada por letter-stagger
- [ ] Background muda cor/padrão conforme progride
- [ ] Contador ("30 anos") com animação numérica fluida
- [ ] Efeito de "underline pulsante" no manifesto

### 2.3 Collection (Horizontal Scroll)
**Atual:**
- Scroll horizontal com scale/opacity dos cartões

**Oportunidades:**
- [ ] Rotação 3D sutil dos cartões em perspectiva
- [ ] Efeito de "depth fade" (cartões distantes mais desfocados)
- [ ] Sombra dinâmica que segue perspectiva
- [ ] Imagem com overlay gradient animado no hover
- [ ] Número do cartão com animation de contagem
- [ ] Scroll indicator com barrita animada

### 2.4 Catálogo (Grid View)
**Atual:**
- Motion simples com opacity/y
- Cards estáticos

**Oportunidades:**
- [ ] Entrada com rotação 3D + perspective
- [ ] Imagem com hover zoom + blur animation
- [ ] Selo "Escolha PHD" com pulse/glow effect
- [ ] Preço com animação de "slide up" do rodapé
- [ ] Filtro ativo com animação de "check" checkmark
- [ ] Loading skeleton com shimmer effect
- [ ] Grid masonry dinâmico em mobile

### 2.5 Página de Veículo
**Atual:**
- Galeria de fotos com scroll
- Dados técnicos estáticos

**Oportunidades:**
- [ ] Hero de veículo com múltiplas imagens em carousel 3D
- [ ] Specs revelados conforme scroll (stagger vertical)
- [ ] Simulador com sliders animados
- [ ] Botão WhatsApp com pulse/float effect
- [ ] Galeria de fotos em lightbox com animação suave
- [ ] "Relacionados" com infinite scroll

### 2.6 Drive Mode (Interface Imersiva)
**Atual:**
- Fullscreen com gesture navigation
- Som ambiente

**Oportunidades:**
- [ ] Transição suave ao entrar/sair (fade preto)
- [ ] Imagem com cor-shifting animado
- [ ] Especificações com "flip card" animation 3D
- [ ] Número de índice com typewriter effect
- [ ] Preço com pulsação quando atualiza
- [ ] Gesto visual feedback (seta/swipe hint)
- [ ] Partículas ou padrão SVG animado de fundo

### 2.7 Navigation & Layout
**Atual:**
- Header simples com show/hide
- Menu overlay com clip-path

**Oportunidades:**
- [ ] Logo com hover scale + rotation
- [ ] Link ativo com underline animado
- [ ] Search com expanding animation
- [ ] Menu com blur backdrop + glassmorphism
- [ ] Scroll indicator progress bar no topo
- [ ] Breadcrumb animado em páginas internas
- [ ] Footer com gradiente direcionado

---

## PARTE 3: CONCEITO VISUAL DO NOVO SITE

### 3.1 Identidade Cinematográfica
O novo site deve evocar:
- **Cinema noir:** Preto, branco e acentos vermelhos
- **Showroom luxuoso:** Iluminação dramática, espaçamento generoso
- **Catálogo de design:** Fotografia como elemento principal
- **Velocidade controlada:** Transições suaves mas decisivas

### 3.2 Pilares de Animação

#### 1. **Entrada & Saída (Reveal)**
- Máscaras que abrem (clip-path)
- Palavras que surgem letra por letra
- Imagens que recuam/avançam
- Fade + scale combinados

#### 2. **Movimento Contínuo (Scroll-driven)**
- Parallax multi-layer (2-3 níveis)
- Zoom progressivo
- Rotação controlada
- Mudanças de cor/saturação

#### 3. **Interatividade (Hover/Click)**
- Magnetic buttons (cursor tracking)
- Ripple effects
- Glow/shadow dinâmico
- Scale com easing suave

#### 4. **Transição entre Seções**
- Fade + blur transition
- Sequência coordenada de elementos
- "Câmera zoomando" entre seções

### 3.3 Paleta Cromática Expandida
```
Primária:     #08090a (preto profundo)
Secundária:   #f4f3f0 (off-white)
Accent (Novo): #dc2626 (vermelho mais vibrante)
Suporte:      #4f46e5 (azul para contrastes ocasionais)
Negativo:     #0f172a (azul-preto para variação)

Gradientes:
- Dark fade: #08090a → transparent
- Accent glow: rgba(220, 38, 38, 0.2) → transparent
- Metallic: #8b9099 → #3d424a
```

### 3.4 Tipografia Cinematográfica
- Manter Archivo + Inter (já bom)
- Aumentar entrelinha em títulos (1.1 → 1.2)
- Usar letter-spacing negativo sutil em display
- Criar variação de peso (400 normal, 600 semi-bold, 700 bold)

---

## PARTE 4: ESTRUTURA TÉCNICA PROPOSTA

### 4.1 Novos Utilitários GSAP
```javascript
// animations/reveals.js
- createTextReveal(element, config)
- createClipPathReveal(element, config)
- createParallaxLayer(element, depth)
- createMagneticButton(element)

// animations/sequences.js
- createSectionSequence(config)
- createStaggerSequence(elements, timing)
- createColorShiftSequence(element, colors)

// animations/effects.js
- createGlowEffect(element, intensity)
- createDistortionWave(element)
- createShimmer(element)
```

### 4.2 Componentes Novos/Refatorados
```
components/
├── layout/
│   ├── Header.jsx (refator: animações de logo)
│   ├── Footer.jsx (refator: reveal staggered)
│   └── ScrollProgress.jsx (novo)
├── animations/
│   ├── TextReveal.jsx (novo)
│   ├── MagneticButton.jsx (novo)
│   ├── GlowCard.jsx (novo)
│   └── ParallaxImage.jsx (novo)
├── home/
│   ├── Hero.jsx (refator: clip-path + distortion)
│   ├── Manifesto.jsx (refator: sem pin, reveal sequencial)
│   ├── Collection.jsx (refator: 3D + depth)
│   └── Timeline.jsx (novo conceito)
├── catalog/
│   ├── VehicleCard.jsx (refator: glow + shimmer)
│   └── FilterPanel.jsx (refator: animações)
└── vehicle/
    └── SpecSequence.jsx (refator: mais dramático)
```

### 4.3 Arquivos CSS Novos
```
styles/
├── animations.css (novo: @keyframes centralizadas)
├── effects.css (novo: glow, shadow, blur)
├── cinematics.css (novo: sequências complexas)
└── tokens.css (refator: cores expandidas)
```

---

## PARTE 5: ROADMAP DE IMPLEMENTAÇÃO

### Fase 1: Fundação (1-2 dias)
1. [ ] Expandir tokens CSS com cores + gradientes novos
2. [ ] Criar utilitários de animação reutilizáveis (animations.js)
3. [ ] Criar componentes de animação (TextReveal, MagneticButton)
4. [ ] Setup de @keyframes centralizadas

### Fase 2: Hero & Navegação (2-3 dias)
1. [ ] Refatorar Hero com clip-path reveal
2. [ ] Adicionar distorção sutil de imagem
3. [ ] Implementar Header com animações
4. [ ] Criar ScrollProgress bar
5. [ ] Magnetic buttons em CTAs

### Fase 3: Manifesto & Collection (2-3 dias)
1. [ ] Remover pin do Manifesto
2. [ ] Implementar reveal sequencial de frases
3. [ ] Refatorar Collection com 3D perspective
4. [ ] Adicionar depth fade nos cartões

### Fase 4: Catálogo (2-3 dias)
1. [ ] Refatorar VehicleCard com glow effect
2. [ ] Shimmer loading skeleton
3. [ ] Animações de filtro
4. [ ] Hover effects refinados

### Fase 5: Página de Veículo (2-3 dias)
1. [ ] Carousel 3D de imagens
2. [ ] Reveal staggered de specs
3. [ ] Lightbox animado
4. [ ] Simulador com animações

### Fase 6: Drive Mode & Refinamentos (2-3 dias)
1. [ ] Transições de entrada/saída
2. [ ] Color-shifting animado
3. [ ] Feedback visual de gestos
4. [ ] Polish final: easing, timing

### Fase 7: Testes & Otimização (1-2 dias)
1. [ ] Testar performance em diferentes dispositivos
2. [ ] Otimizar will-change e gpu acceleration
3. [ ] Validar acessibilidade (prefers-reduced-motion)
4. [ ] A/B testing de timing/easing

---

## PARTE 6: EXEMPLOS DE IMPLEMENTAÇÃO

### Exemplo 1: TextReveal com GSAP
```javascript
// animations/textReveal.js
export const createTextReveal = (element, { stagger = 0.05, duration = 0.9 } = {}) => {
  const words = element.querySelectorAll('.word');
  return gsap.from(words, {
    opacity: 0,
    y: 20,
    duration,
    stagger,
    ease: 'power3.out',
  });
};
```

### Exemplo 2: Magnetic Button
```javascript
// components/animations/MagneticButton.jsx
export const MagneticButton = ({ children, ...props }) => {
  const ref = useRef();
  useGSAP(() => {
    if (!ref.current) return;
    const element = ref.current;
    const onMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(element, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.3,
        ease: 'power2.out',
      });
    };
    const onMouseLeave = () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.3 });
    };
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);
    return () => {
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  });
  return <button ref={ref} {...props}>{children}</button>;
};
```

### Exemplo 3: Parallax Multi-layer
```javascript
// animations/parallax.js
export const createParallaxLayers = (container, depths = [0.1, 0.2, 0.5]) => {
  const layers = container.querySelectorAll('[data-parallax]');
  layers.forEach((layer, i) => {
    gsap.to(layer, {
      yPercent: () => window.innerHeight * -depths[i % depths.length] * 0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  });
};
```

---

## PARTE 7: VALIDAÇÃO & MÉTRICAS

### Checklist Visual
- [ ] Cada seção tem movimento que comunica propósito
- [ ] Nenhuma animação supera 1.2s (sente-se rápido)
- [ ] Contraste de texto sempre ≥ 4.5:1
- [ ] Transições funcionam bem em mouse + touchscreen
- [ ] Performance: FPS > 55 em mobile

### Acessibilidade
- [ ] `prefers-reduced-motion: reduce` em todos os animations
- [ ] Sem animações que causem vertigem/epilepsia
- [ ] Teclado navegável (tab, Enter, Escape)
- [ ] Anúncios ARIA para mudanças dinâmicas

---

# PARTE 8: PROMPT PARA AGENTE CLAUDE

*[Veja seção abaixo]*
