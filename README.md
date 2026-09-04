# POLLY VEÍCULOS — The Drive Gallery

Protótipo navegável em React para apresentação comercial da POLLY VEÍCULOS.
O conceito combina fotografia automotiva, direção editorial e animação de
rolagem para apresentar uma nova marca e facilitar a exploração da coleção.

A POLLY é apresentada como uma nova empresa. O conteúdo não atribui a ela
datas de fundação, tempo de mercado, contatos ou instalações de outra marca.

## Rodar localmente

O projeto permanece em `D:\phdautomoveis`, conforme solicitado. O nome da
pasta foi preservado para não alterar atalhos nem a localização de trabalho.

```powershell
cd D:\phdautomoveis
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

| Comando | Função |
| --- | --- |
| `npm run dev` | Servidor local com atualização automática |
| `npm run build` | Gera a versão de apresentação em `dist/` |
| `npm run preview` | Serve o build em `http://localhost:4173` |
| `npm test` | Executa os testes existentes |
| `npm run fotos` | Atualiza o acervo de referência via Wikimedia Commons |

## Direção de marca

POLLY VEÍCULOS é a marca principal; The Drive Gallery descreve a experiência
editorial. A identidade usa grafite, tons de prata e vermelho inspirados na
referência fornecida. O conteúdo troca a antiga retrospectiva por uma
apresentação dos critérios que orientam a escolha do próximo carro.

A fotografia abre a experiência. A informação vem em seguida, com catálogo,
filtros e páginas de veículo para quem quer comparar detalhes. O modo imersivo
oferece outro ritmo de exploração, sem impedir acesso direto à coleção.

Os cinco universos editoriais são Performance, Urbano, Aventura, Executivo e
Primeiro carro. As categorias tradicionais continuam nos dados e nos filtros.

## Rotas

| Rota | Conteúdo |
| --- | --- |
| `/` | Apresentação visual, coleção e caminhos para explorar a marca |
| `/colecao` | Catálogo, busca e filtros combináveis |
| `/veiculo/:slug` | Fotos, ficha técnica, demonstração de interesse e simulação |
| `/vender` | Apresentação da avaliação de veículo e formulário demonstrativo |
| `/financiamento` | Simulação ilustrativa de entrada, prazo e parcelas |
| `/polly` | Apresentação da POLLY e critérios de escolha |
| `/phd` | Endereço legado, redirecionado para `/polly` |

## Estrutura

```text
src/
├─ components/
│  ├─ ui/            Foto, SplitText e componentes compartilhados
│  ├─ layout/        Cabeçalho, rodapé, carregamento e rolagem
│  ├─ home/          Seções independentes da apresentação
│  ├─ catalog/       Filtros, slider e cartão de veículo
│  ├─ vehicle/       Sequência visual de especificações
│  └─ drivemode/     Experiência imersiva
├─ data/             Estoque mockado, taxonomia e manifesto de fotos
├─ lib/              Animação, busca, filtros, formatação e áudio
├─ pages/            Páginas da navegação
├─ styles/           Tokens e estilos globais, de componentes e páginas
└─ test/             Configuração e testes
public/
└─ imagens/          Fotografias locais e créditos
scripts/
└─ baixar-fotos.mjs   Atualização das fotos de referência
```

## Movimento

GSAP e ScrollTrigger coordenam as sequências de rolagem, parallax e seções
pinadas. Motion cuida de menus, filtros, cartões e respostas de interface.
Lenis integra a rolagem suave ao ciclo do ScrollTrigger. A separação evita
que duas bibliotecas disputem as mesmas propriedades de um elemento.

As animações são revertidas quando uma rota ou condição responsiva muda.
Lenis é ativado apenas no desktop com ponteiro preciso, usando o ticker
compartilhado do GSAP. No celular a rolagem permanece nativa.

A vitrine da home usa uma única timeline para o trilho e a régua de progresso,
sem desfoque ou sombra animada em cada cartão. O pin só é ativado a partir de
1000px de largura e 700px de altura, com ponteiro preciso e movimento normal.
Fora dessas condições, a coleção usa rolagem nativa com controles acessíveis.
Botões magnéticos reutilizam animações, e as sequências de veículos limpam
seus efeitos ao mudar de modelo. `prefers-reduced-motion` é observado também
durante a sessão.

A abertura exibe uma tela POLLY enquanto aguarda as fontes e a imagem principal.
Ela aparece apenas na montagem inicial, não a cada mudança de rota: duração
visual mínima de 500ms (sem mínimo com movimento reduzido), limite de 3s e
botão "Entrar no site" para sair imediatamente. O indicador é indeterminado,
sem porcentagens fictícias, e o conteúdo de fundo fica temporariamente inativo.

Em telas compactas ou de toque, preço e ano usam dois controles separados para
mínimo e máximo. O painel de filtros tem rolagem própria e botão fixo de
resultados; os cards exibem "Ver máquina" sem depender de hover. Destaques da
ficha não ficam pinados até 1100px, em telas de até 600px de altura ou no toque.
O Drive Mode mantém botões grandes de avançar, voltar e sair, com conteúdo
rolável quando necessário. Formulários não inclinam em janelas compactas.

`NextChapter.jsx` substitui a antiga linha do tempo por três etapas da experiência:
descobrir, conhecer e escolher. O logo de apresentação em `BrandMark.jsx` é
uma interpretação vetorial da referência enviada, para uso neste protótipo.

## Fotografias

As imagens dos veículos ficam em `public/imagens/veiculos/`. Elas são fotos
de referência dos modelos, não das unidades anunciadas. As fichas utilizam
dados fictícios; a cor da foto pode diferir da cor descrita no exemplo.

`scripts/baixar-fotos.mjs` busca imagens no Wikimedia Commons, exige o modelo
no nome do arquivo e filtra gerações incompatíveis quando há informação de
ano. Execute `node scripts/baixar-fotos.mjs --simular` para inspecionar a
seleção sem baixar arquivos.

Os créditos e licenças de cada fotografia estão em
`public/imagens/CREDITOS.md` e `public/imagens/creditos.json`. Eles devem
acompanhar o uso das imagens. Não remova os créditos ao trocar a marca.

Para inserir fotos próprias:

1. Coloque os arquivos em `public/imagens/veiculos/`.
2. Atualize `src/data/fotos.json` na chave `fotoKey` de cada veículo.
3. Confira o corte em desktop, celular, catálogo e página de detalhe.
4. Atualize os créditos conforme a origem e os direitos de cada arquivo.

A foto de atmosfera da capa está separada em
`public/imagens/capa/capa-home.jpg` e não representa um veículo à venda.
O tratamento compartilhado é feito por `src/components/ui/Foto.jsx`.

## Catálogo e busca

O estado dos filtros fica na URL, permitindo compartilhar e reabrir uma
seleção, por exemplo `/colecao?bodies=suv&priceMax=100000`.

| Busca de exemplo | Interpretação |
| --- | --- |
| `SUV até 100 mil` | Carroceria SUV e teto de preço |
| `automático até 90 mil` | Câmbio automático e teto de preço |
| `até 60 mil km` | Limite de quilometragem |
| `sedan a partir de 2019` | Carroceria sedã e ano mínimo |
| `entre 80 e 120 mil` | Faixa de preço |
| `vw turbo` | Volkswagen e universo Performance |
| `carro econômico` | Até 1.6, sem diesel, até 130 cv |

Os filtros também incluem marca, combustível, cor, opcionais, câmbio, ano,
carroceria e universo. A ordenação permite curadoria POLLY, preço, ano e km.
O catálogo oferece visualização em galeria e lista.

## Limites desta apresentação

- Estoque, preços, condições e informações dos veículos são mockados.
- A simulação usa uma taxa fixa ilustrativa. Não consulta crédito nem oferece
  financiamento real; custos e aprovação dependem de uma proposta real.
- Formulários e demonstrações de interesse não enviam dados ou mensagens.
- Telefone, WhatsApp e localização oficiais da POLLY aguardam confirmação;
  o protótipo não deve encaminhar visitantes para contatos da antiga marca.
- O som opcional do modo imersivo é sintetizado com Web Audio e começa desligado.
- Não há backend, CRM, ERP, autenticação ou integração com instituição financeira.

Antes de uma publicação comercial, substituir os dados de demonstração pelo
estoque autorizado, confirmar os canais e instalações da POLLY, revisar textos
comerciais e conectar os formulários aos serviços aprovados.

## Acessibilidade e verificação

O projeto inclui link para pular ao conteúdo, controles nativos, indicações de
foco, navegação por teclado no modo imersivo e anúncios de resultados do
catálogo. Textos divididos para animação mantêm um nome acessível completo.

Execute o build e os testes antes de entregar uma versão. Confira também as
rotas em desktop e celular, menus, filtros, fotos, botões, preferência de
movimento reduzido e navegação de ida e volta. Resultados de desempenho e
contraste precisam ser medidos na versão atual; medições antigas não
representam automaticamente este redesign.
