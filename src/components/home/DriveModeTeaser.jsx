import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { featuredVehicles, getVehicleBySlug } from '@/data/vehicles';
import { FotoVeiculo } from '@/components/ui/Foto';
import { Marquee } from '@/components/ui/atoms';
import MagneticButton from '@/components/animations/MagneticButton';

const MOSTRA = getVehicleBySlug('volkswagen-amarok-highline-v6-2019');

/**
 * MODO IMERSIVO — a assinatura do projeto.
 *
 * A fotografia ficava atrás do texto, em tela cheia, e a leitura
 * sofria. Agora ela é uma peça emoldurada à direita: continua sendo
 * a prova do que o modo faz, sem disputar espaço com a palavra.
 *
 * Criatividade não pode custar conversão: quem quer comprar rápido
 * vai ao catálogo; quem quer explorar entra aqui.
 */
export default function DriveModeTeaser({ onAbrir }) {
  const raiz = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from('.imersivo__linha-interna', {
        yPercent: 108,
        stagger: 0.08,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: raiz.current, start: 'top 74%' },
      });

      gsap.fromTo(
        '.imersivo__moldura',
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.3,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: raiz.current, start: 'top 70%' },
        },
      );

      gsap.to('.imersivo__moldura .foto__img', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: raiz.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    },
    { scope: raiz },
  );

  return (
    <section className="section imersivo" ref={raiz} id="modo-imersivo">
      <div className="shell imersivo__grade">
        <div className="imersivo__conteudo">
          <div className="section-index meta">
            <span className="section-index__num">04</span>
            <span>Modo imersivo</span>
          </div>

          <h2 className="imersivo__titulo t-display">
            <span className="imersivo__mascara">
              <span className="imersivo__linha-interna">Sem menu.</span>
            </span>
            <span className="imersivo__mascara">
              <span className="imersivo__linha-interna">Sem filtro.</span>
            </span>
            <span className="imersivo__mascara">
              <span className="imersivo__linha-interna">Só a máquina.</span>
            </span>
          </h2>

          <p className="imersivo__lead t-lead">
            A interface desaparece. Ficam a fotografia em tela cheia, três
            características e o preço. Você navega arrastando — sem pressa e sem
            formulário.
          </p>

          <ul className="imersivo__itens meta">
            <li>Tela cheia</li>
            <li>Arraste, role ou use as setas</li>
            <li>Som ambiente opcional</li>
            <li>Sai com ESC</li>
          </ul>

          <div className="imersivo__acoes">
            <MagneticButton
              type="button"
              className="btn btn--accent btn--lg"
              onClick={onAbrir}
              data-cursor="Entrar"
            >
              Ativar modo imersivo
            </MagneticButton>
            <Link to="/colecao" className="btn btn--ghost btn--lg">
              Prefiro o catálogo
            </Link>
          </div>
        </div>

        <div className="imersivo__moldura">
          <FotoVeiculo veiculo={MOSTRA} proporcao="3 / 4" veu="medio" posicao="center 55%" />
          <span className="imersivo__legenda meta">
            {MOSTRA.brand} {MOSTRA.model} — assim aparece no modo imersivo
          </span>
        </div>
      </div>

      <Marquee
        items={featuredVehicles.map((v) => `${v.brand} ${v.model}`)}
        speed={46}
        className="imersivo__marquee"
        separator="·"
      />
    </section>
  );
}
