import Showroom from '@/components/home/Showroom';
import { Reveal } from '@/components/ui/atoms';

const PRINCIPLES = [
  {
    n: '01',
    title: 'Comece pelo seu momento.',
    body: 'Rotina, espaço, estilo e vontade de dirigir. A escolha começa no que faz sentido para você.',
  },
  {
    n: '02',
    title: 'Olhe além da fotografia.',
    body: 'Conheça a versão, os equipamentos e os detalhes de cada veículo. Histórico e condições merecem uma conversa clara antes da decisão.',
  },
  {
    n: '03',
    title: 'Encontre seu jeito de dirigir.',
    body: 'Explore por perfil, compare as possibilidades e refine sua busca. O carro certo precisa combinar com a vida que você leva.',
  },
  {
    n: '04',
    title: 'Decida com clareza.',
    body: 'Valores, informações e próximos passos no mesmo lugar. Nossa proposta é dar espaço para uma escolha bem pensada.',
  },
];

export default function About() {
  return (
    <main className="page" id="conteudo">
      <header className="page__hero">
        <div className="shell">
          <div className="section-index meta">
            <span className="section-index__num">01</span>
            <span>Conheça a POLLY</span>
          </div>
          <Reveal>
            <h1 className="page__title t-display">
              Uma nova marca.
              <br />
              Novas direções.
              <br />
              Seu próximo carro.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="page__lead">
              A POLLY VEÍCULOS nasce com uma proposta: tornar a escolha do próximo
              carro uma experiência mais próxima, clara e inspiradora. Um novo nome
              para acompanhar os caminhos que você quer descobrir.
            </p>
          </Reveal>

          <div className="page__stats">
            <Reveal className="page__stat" delay={0.15}>
              <span className="page__stat-valor num">
                01
              </span>
              <span className="meta">Explore as possibilidades</span>
            </Reveal>
            <Reveal className="page__stat" delay={0.2}>
              <span className="page__stat-valor num">
                02
              </span>
              <span className="meta">Conheça os detalhes</span>
            </Reveal>
            <Reveal className="page__stat" delay={0.25}>
              <span className="page__stat-valor num">
                03
              </span>
              <span className="meta">Escolha sua direção</span>
            </Reveal>
          </div>
        </div>
      </header>

      <section className="section principles">
        <div className="shell">
          <div className="section-index meta">
            <span className="section-index__num">02</span>
            <span>O que orienta a escolha</span>
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

      <Showroom />
    </main>
  );
}
