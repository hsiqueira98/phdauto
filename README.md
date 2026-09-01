# PHD Automóveis — A Coleção

Conceito visual navegável do redesign da **PHD Automóveis** — Brasília, desde 1996.

Protótipo de apresentação comercial. **Sem backend**: o estoque é mockado em
`src/data/vehicles.js`, que serve também como contrato de dados para a integração real.

---

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build em `http://localhost:4173` |
| `npm test` | Testes de lógica e de renderização |
| `npm run fotos` | Rebaixa o acervo de fotografias (veja abaixo) |

---

## A tese

Não é o redesenho de uma concessionária. É a PHD tratada como **marca automotiva
que por acaso vende seminovos**.

Isso muda a referência de projeto: em vez de Webmotors, Kavak e lojas locais, o
vocabulário vem de Porsche, Polestar, Cupra e de editoriais impressos. A inovação
está em **como o estoque é apresentado e desejado** — as animações são consequência
disso, não o produto.

Três decisões sustentam o conceito:

1. **Inversão da ordem.** Emoção → informação → conversão. Quase todo site
   automotivo começa pela ficha técnica; aqui ela vem depois da apresentação.
2. **Camada editorial sobre o estoque.** Hatch, sedã, SUV e picape continuam
   existindo nos dados. Por cima deles, cinco universos: Performance, Urbano,
   Aventura, Executivo e Primeiro carro.
3. **Dois caminhos declarados.** Quem quer comprar rápido usa o catálogo com
   filtros. Quem quer explorar usa o modo imersivo. Criatividade não custa conversão.

---

## Direção tipográfica

O ponto de partida desta versão foi corrigir o que travava a leitura: caixa-alta
condensada, entrelinha abaixo de 1 e corpos gigantescos empilhavam as palavras.

| Antes | Agora |
| --- | --- |
| Anton, caixa-alta, `line-height: 0.84` | Archivo, caixa normal, `line-height: 1.08–1.16` |
| Maior título com até 17rem | Maior título com **4,5rem** |
| Tracking negativo forte | `-0.018em`, só o suficiente para dar aprumo |
| Caixa-alta em títulos e rótulos | Caixa-alta **só** em rótulos, com `0.14em` de espaço |

A hierarquia passou a vir do espaço em volta, não do tamanho da letra. Toda a
escala está em `src/styles/tokens.css` — mexer lá muda o site inteiro.

---

## Fotografia

Todas as fotos são **reais** e ficam em `public/imagens/veiculos/` — 95 arquivos,
até 4 por veículo.

### De onde vêm

`npm run fotos` roda `scripts/baixar-fotos.mjs`, que busca no **Wikimedia Commons**
fotografias dos modelos que estão no estoque mockado. Banco de imagem genérico
mostraria "um SUV qualquer"; numa apresentação para a PHD isso salta aos olhos.

O script faz três filtragens que valem citar, porque sem elas o acervo enche de
carro errado:

- **Modelo obrigatório no nome do arquivo.** Buscar "Volkswagen Polo" no Commons
  devolve carro de rallycross; exigir `polo` no nome resolve.
- **Geração eliminatória.** Um Polo 1991 não representa um Polo 2020. Se o arquivo
  declara o ano e ele está a mais de 7 anos do alvo, o candidato é descartado.
  Resultado atual: **zero fotos fora da geração**.
- **Pontuação por origem.** Fotógrafos automotivos do Commons com enquadramento
  consistente sobem; importações candid do Flickr descem.

`node scripts/baixar-fotos.mjs --simular` lista o que ele escolheria sem baixar nada.

### O tratamento que unifica

O acervo emprestado vem de fontes diferentes, com luz e fundo diferentes.
`src/components/ui/Foto.jsx` aplica a mesma graduação em todas — dessaturação leve,
contraste e véu grafite — e é isso que faz vinte e quatro fotos distintas lerem como
uma coleção só.

**É também a demonstração do argumento:** quando as fotos forem feitas no showroom,
no mesmo ângulo e com o mesmo tratamento, o efeito fica muito maior. Esse é o
**PHD Photo Standard** — mesmo local, mesmo ângulo principal, mesmo crop, mesma cor.

### Trocar pelas fotos da PHD

1. Coloque os arquivos em `public/imagens/veiculos/`.
2. Aponte-os em `src/data/fotos.json`, na chave `fotoKey` do veículo.

Nada de layout muda. Créditos e licenças de cada arquivo atual estão em
`public/imagens/CREDITOS.md`.

---

## Camada cinematográfica

Segunda passada de design, aplicando `.claude/PROMPT_DO_AGENTE.md`.

### Paleta

A cor proprietária passou de bronze para **vermelho**, conforme o documento.
Ela vive em três tokens, todos em `src/styles/tokens.css`:

| Token | Valor | Para quê |
| --- | --- | --- |
| `--accent` | `#dc2626` | Cor **gráfica**: bordas, brilhos, riscos, preenchimentos |
| `--accent-text` | `#ef4444` | Todo **texto** pequeno em vermelho |
| `--accent-solid` | `#b91c1c` | Fundo de botão sólido, com texto em papel |

Por que três e não um: `#dc2626` sobre o grafite dá **4,05:1**, abaixo do
mínimo 4,5:1 que a checklist do próprio documento exige. Como elemento
gráfico ele passa (o mínimo ali é 3:1); como texto de 11px, não. Preenchido
como botão é pior ainda — não alcança 4,5:1 com nenhuma cor de texto, nem
clara nem escura. A separação mantém o vermelho pedido em toda a superfície
visível e resolve o contraste onde ele importa.

### Novos arquivos

```
src/styles/animations.css      @keyframes centralizadas
src/styles/effects.css         glow, shimmer, glass, ruído, malha
src/lib/animations.js          utilitários GSAP reutilizáveis
src/components/layout/ScrollProgress.jsx
src/components/animations/MagneticButton.jsx
```

Cascata em `main.css`: tokens → base → effects → animations → components → seções → páginas.

### O que mudou em cada seção

| Seção | Antes | Agora |
| --- | --- | --- |
| **Abertura** | Parallax discreto | Imagem entra por máscara (clip-path), letras sobem uma a uma, brilho vermelho deriva atrás, CTAs magnéticos |
| **Manifesto** | Pin travando a rolagem | **Sem pin.** Três frases em sequência, risco vermelho crescendo, contadores GSAP, brilho ao fundo |
| **A coleção** | Escala e opacidade | Perspectiva 3D (`rotationY`), depth fade — o que está longe do centro desfoca e perde sombra |
| **Catálogo** | Cartões estáticos | Brilho na borda no hover, varredura de luz, ponto pulsante no selo, rodapé que troca universo por chamada |
| **Veículo** | Specs aparecendo | Números contando, divisor entrando por máscara |
| **Modo imersivo** | Corte seco | Cortina preta entre planos, tinta ambiente derivando, índice datilografado dígito a dígito |
| **Cabeçalho** | Estático | Marca com risco no hover, busca que expande e revela o rótulo |

### Três decisões que fogem da letra do documento

Todas para **cumprir a checklist da Parte 7**, que o texto literal violaria:

1. **Pulso do selo no ponto, não no cartão.** O documento pede
   `animation: glow-border` e `pulse-glow` permanentes em `.vcard`. Animar
   `box-shadow` em 24 cartões ao mesmo tempo repinta a grade inteira a cada
   quadro. O brilho virou estado de hover; o pulso ficou num ponto de 5px,
   que é composição pura.

2. **Tinta em vez de filtro no modo imersivo.** `hue-rotate` sobre uma
   fotografia em tela cheia repinta a cada quadro. A cor deriva numa camada
   de véu por cima — mesma leitura, custo zero.

3. **`scaleX` em vez de `width` na barra de progresso**, e um pseudo fixo em
   vez de `background-attachment: fixed` na malha. Ambos evitam layout e
   repaint por quadro de rolagem.

Duas funções do documento também tinham API incorreta e foram implementadas
funcionando: `createColorShift` (usava `gsap.interpolate` como modifier;
o correto é `gsap.utils.interpolate`) e `createDistortionWave`.

### Medições

Feitas no navegador, com o build de produção:

| Critério da checklist | Exigido | Medido |
| --- | --- | --- |
| FPS na faixa horizontal | > 55 | **60** |
| Contraste de texto | ≥ 4,5:1 | **nenhuma falha** |
| Erros de console | 0 | **0** |
| `prefers-reduced-motion` | tudo legível | palavras em opacidade 1, contadores no valor final, máscaras abertas |

O ajuste de contraste também subiu `--fg-faint` de `#61666e` para `#888d95`:
o tom antigo dava 3,39:1 e reprovava em todas as superfícies.

---

## Ajustes da terceira rodada

Feitos a partir da revisão tela a tela.

| Seção | Problema apontado | O que mudou |
| --- | --- | --- |
| **Abertura** | Texto tapava o carro; havia um veículo do estoque em destaque | Capa fixa de atmosfera (**não é do estoque**), coluna de texto estreita à esquerda e véu que escurece só a faixa do texto. O bloco "Em destaque" saiu |
| **Manifesto** | Texto todo à esquerda, fundo preto parado | Duas colunas: frases à esquerda, instrumento animado + números à direita. Fundo com linhas diagonais derivando |
| **Universos** | A prévia seguia o cursor e cobria a leitura | Painel fixo na coluna da direita. A linha ativa é marcada por um risco vermelho, sem apagar as outras |
| **A coleção** | Carrossel fora do centro, cortando preço e ficha | Recuo lateral calculado (`(100vw − largura do cartão) / 2`): o cartão em foco para no centro. Altura travada na viewport, com a foto cedendo espaço para a ficha |
| **Modo imersivo** | Foto em tela cheia atrás do texto | Fotografia virou peça emoldurada à direita, com máscara de entrada e parallax próprio |
| **Encontrar meu carro** | Não parecia um campo | Caixa com fundo, borda e brilho no foco, rótulo visível e cursor piscando enquanto está vazio |
| **Vender meu carro** | Card estático no canto | Card flutuante que inclina seguindo o ponteiro, fixo na altura da tela enquanto se lê os passos |
| **A casa PHD** | Nada à direita | Ano em contorno, contador de anos de estrada e barra de progresso dos 30 anos |
| **Showroom** | SVG decorativo no lugar de um mapa | **Mapa real**, interativo, com as coordenadas geocodificadas do endereço |
| **Rodapé** | — | Mantido |

### O mapa

`src/components/home/Showroom.jsx` embute o OpenStreetMap: é o único mapa
interativo que roda **sem chave de API**, então o protótipo abre na máquina de
qualquer pessoa sem cadastro em lugar nenhum. Trocar pelo provedor que a PHD
preferir é mudar a URL do iframe.

As coordenadas (`-15,8027 / -47,9535`) vieram da geocodificação do endereço no
Nominatim e batem com o CEP 71200-030 que já estava no site. Uma camada de tinta
grafite por cima alinha o mapa claro ao resto da página, sem bloquear o ponteiro —
ele continua arrastável e com zoom.

### A capa

`public/imagens/capa/capa-home.jpg` é imagem de atmosfera, **não** um veículo à
venda. Está separada do acervo do estoque justamente para deixar isso explícito
no código e no arquivo de créditos.

---

## Arquitetura de animação

Duas engines, dois territórios, zero disputa de responsabilidade.

| Engine | Território |
| --- | --- |
| **GSAP** + ScrollTrigger + Observer | Pin, scrub, rolagem horizontal, parallax, sequência da página de produto, gesto do modo imersivo |
| **Motion** (motion.dev) | Microinteração de UI: cartões, menus, filtros, chips, modais, feedback |
| **Lenis** | Rolagem suave, sincronizada com o ScrollTrigger |

**Anime.js foi descartado de propósito.** GSAP e Motion já cobrem tudo, e uma
terceira engine só criaria disputa por responsabilidade.

Todo movimento respeita `prefers-reduced-motion`: seções pinadas viram blocos
estáticos, a rolagem horizontal vira carrossel nativo com scroll-snap e nenhuma
informação depende de animação para existir.

---

## Estrutura

```
src/
├─ components/
│  ├─ ui/            Foto (PHD Photo Standard), SplitText, atoms (Motion)
│  ├─ layout/        Header, Footer, Cursor, Preloader, SmoothScroll
│  ├─ home/          As 10 seções da home, uma por arquivo
│  ├─ catalog/       FilterPanel, RangeSlider, VehicleCard
│  ├─ vehicle/       SpecSequence (a sequência pinada)
│  └─ drivemode/     DriveMode (modo imersivo, tela cheia)
├─ data/             vehicles.js (estoque), taxonomy.js, fotos.json (gerado)
├─ lib/              gsap, filtering, smartSearch, format, hooks, driveAudio
├─ pages/            Home, Catalog, Vehicle, Sell, Financing, About, NotFound
├─ styles/           tokens → base → components → layout → seções
└─ test/             setup e testes de rota
scripts/
└─ baixar-fotos.mjs  Monta o acervo de fotografias
```

### Rotas

| Rota | Conteúdo |
| --- | --- |
| `/` | Abertura → Manifesto → Universos → A coleção → Modo imersivo → Busca → Vender → História → Showroom → Chamada final |
| `/colecao` | Catálogo completo com todos os filtros |
| `/veiculo/:slug` | Página de produto |
| `/vender` · `/financiamento` · `/phd` | Páginas de apoio |

---

## Catálogo — os filtros

A complexidade não sumiu; ela deixou de ser a porta de entrada.

**Busca em linguagem natural** (`src/lib/smartSearch.js`) traduz frases para o mesmo
objeto de filtro que os controles manipulam:

| Você digita | Vira |
| --- | --- |
| `SUV até 100 mil` | carroceria SUV + preço máx. 100.000 |
| `automático até 90 mil` | câmbio automático + preço máx. 90.000 |
| `até 60 mil km` | rodagem máx. 60.000 km (não confunde com dinheiro) |
| `sedan a partir de 2019` | carroceria sedã + ano mín. 2019 |
| `entre 80 e 120 mil` | faixa de preço |
| `vw turbo` | marca Volkswagen + universo Performance |
| `carro econômico` | até 1.6, sem diesel, até 130 cv |

**Filtros completos:** universo, faixa de preço, marca, carroceria, câmbio,
combustível, faixa de ano, quilometragem máxima, cor (com amostras), opcionais e
perfil econômico. Mais ordenação (curadoria PHD, preço, ano, km) e alternância
entre galeria e lista.

**Toda combinação é um link.** O estado vive na URL — `/colecao?bodies=suv&priceMax=100000`
é compartilhável, indexável e sobrevive ao refresh.

---

## Direção visual

Evita deliberadamente o clichê do setor (preto + vermelho + carbono + fonte racing).

| Token | Valor | Uso |
| --- | --- | --- |
| `--ink-850` | `#0b0c0e` | Grafite profundo, superfície base |
| `--paper` | `#f4f3f0` | Off-white, texto e superfícies claras |
| `--steel-200` | `#8b9099` | Cinza metálico, texto secundário |
| `--accent` | `#c08a5e` | **Placeholder** — trocar pela cor oficial da PHD |

O accent é consumido por **um único token** em `src/styles/tokens.css`. Trocar
aquela linha reveste o site inteiro.

**Tipografia:** Archivo (títulos) + Inter (interface), ambas com stack de fallback —
o site não quebra sem conexão com o Google Fonts.

---

## O que é protótipo

Transparência para a apresentação:

- Estoque, preços e textos são **mockados** — inspirados no perfil real da loja.
- As fotografias são **do modelo, não da unidade**. A página de veículo diz isso na
  tela, e a cor registrada na ficha pode não bater com a do carro fotografado.
- Formulários de avaliação e contato **não enviam nada**.
- A simulação de financiamento usa taxa fixa ilustrativa, sem consulta a crédito.
- Endereço, telefone e WhatsApp são **placeholders**.
- O som ambiente do modo imersivo é sintetizado em Web Audio — nenhum arquivo de
  áudio no bundle. Começa sempre desligado.

---

## Acessibilidade

- Navegação completa por teclado, incluindo o modo imersivo (setas e `ESC`).
- Link para pular ao conteúdo.
- Textos divididos para animação mantêm o nome acessível intacto via `aria-label`.
- Sliders de faixa usam `input[type=range]` reais — operáveis por teclado.
- `prefers-reduced-motion` desliga todo o movimento sem perder conteúdo.
- Resultados do catálogo anunciados via `aria-live`.
