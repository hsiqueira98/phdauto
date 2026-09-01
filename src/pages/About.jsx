import Timeline from '@/components/home/Timeline';
import Showroom from '@/components/home/Showroom';
import { Counter, Reveal } from '@/components/ui/atoms';

const PRINCIPLES = [
  {
    n: '01',
    title: 'Nem todo carro entra.',
    body: 'A seleção é o produto. Um carro que a gente não colocaria na garagem de casa não vai para o pátio.',
  },
  {
    n: '02',
    title: 'O laudo vem antes da foto.',
    body: 'Procedência, histórico e cautelar resolvidos antes de o veículo ser anunciado — não depois da pergunta.',
  },
  {
    n: '03',
    title: 'Todas as máquinas, a mesma luz.',
    body: 'Mesmo local, mesmo ângulo, mesmo tratamento. É o que transforma um estoque numa coleção.',
  },
  {
    n: '04',
    title: 'O preço fica na tela.',
    body: 'Sem "consulte-nos". Se está publicado, está valendo — e a simulação de parcela vem junto.',
  },
];

export default function About() {
  return (
    <main className="page" id="conteudo">
      <header className="page__hero">
        <div className="shell">
          <div className="section-index meta">
            <span className="section-index__num">01</span>
            <span>A casa</span>
          </div>
          <Reveal>
            <h1 className="page__title t-display">
              Trinta anos
              <br />
              escolhendo
              <br />
              carros.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="page__lead">
              Tempo de mercado é o único ativo que não se compra. A PHD começou em 1996,
              em Brasília, e continua fazendo a mesma coisa: escolher bem antes de vender.
            </p>
          </Reveal>

          <div className="page__stats">
            <Reveal className="page__stat" delay={0.15}>
              <span className="page__stat-valor num">
                <Counter to={1996} format={(n) => Math.round(n)} />
              </span>
              <span className="meta">Ano de fundação</span>
            </Reveal>
            <Reveal className="page__stat" delay={0.2}>
              <span className="page__stat-valor num">
                <Counter to={30} />
              </span>
              <span className="meta">Anos de operação</span>
            </Reveal>
            <Reveal className="page__stat" delay={0.25}>
              <span className="page__stat-valor num">
                <Counter to={24} />
              </span>
              <span className="meta">Máquinas na coleção</span>
            </Reveal>
          </div>
        </div>
      </header>

      <section className="section principles">
        <div className="shell">
          <div className="section-index meta">
            <span className="section-index__num">02</span>
            <span>Critério</span>
          </div>

          <ol className="principles__list">
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 0.07} className="principles__item">
                <span className="principles__n meta">{p.n}</span>
                <h2 className="principles__title t-h3">{p.title}</h2>
                <p className="principles__body">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Timeline />
      <Showroom />
    </main>
  );
}
