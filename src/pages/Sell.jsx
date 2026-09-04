import SellYourCar from '@/components/home/SellYourCar';
import { Reveal } from '@/components/ui/atoms';

export default function Sell() {
  return (
    <main className="page" id="conteudo">
      <header className="page__hero">
        <div className="shell">
          <div className="section-index meta">
            <span className="section-index__num">01</span>
            <span>Vender</span>
          </div>
          <Reveal>
            <h1 className="page__title t-display">
              Seu próximo caminho
              <br />
              pode começar
              <br />
              com o seu carro.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="page__lead">
              Conte o que faz do seu carro uma boa escolha. Marca, modelo, estado
              de conservação e detalhes ajudam a começar a conversa sobre venda
              ou troca com a POLLY VEÍCULOS.
            </p>
          </Reveal>
        </div>
      </header>

      <SellYourCar />
    </main>
  );
}
