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
              A gente compra
              <br />
              com o mesmo critério
              <br />
              que vende.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="page__lead">
              Trinta anos avaliando seminovos em Brasília criaram um filtro. É por isso
              que nem todo carro entra na coleção — e é por isso que o seu vale a
              avaliação certa, não um chute pela tabela.
            </p>
          </Reveal>
        </div>
      </header>

      <SellYourCar />
    </main>
  );
}
