import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { featuredVehicles } from '@/data/vehicles';
import { formatKm, formatPrice, pad2 } from '@/lib/format';
import { FotoVeiculo } from '@/components/ui/Foto';

/**
 * A COLEÇÃO
 *
 * Uma faixa horizontal comandada pela rolagem. A máquina central ganha
 * escala e as laterais recuam — mais catálogo de design do que
 * listagem de classificados.
 *
 * Em telas pequenas ou com movimento reduzido, o mesmo markup vira um
 * carrossel nativo com scroll-snap. Nenhuma função depende da animação.
 */
export default function Collection() {
  const raiz = useRef(null);
  const trilho = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const el = trilho.current;
        const distancia = () => Math.max(0, el.scrollWidth - window.innerWidth);

        const percurso = gsap.to(el, {
          x: () => -distancia(),
          ease: 'none',
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top top',
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        /* Perspectiva: o cartão chega girado, endireita no centro e
           gira para o outro lado ao sair. O desfoque e a sombra
           acompanham — o que está longe do centro perde nitidez. */
        gsap.utils.toArray('.colecao__painel').forEach((painel) => {
          const cartao = painel.querySelector('.colecao__cartao');

          const longe = {
            scale: 0.86,
            opacity: 0.42,
            filter: 'blur(2.5px) saturate(0.75)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
          };

          gsap
            .timeline({
              scrollTrigger: {
                trigger: painel,
                containerAnimation: percurso,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            })
            .fromTo(
              cartao,
              { ...longe, rotationY: 14 },
              {
                scale: 1,
                opacity: 1,
                rotationY: 0,
                filter: 'blur(0px) saturate(1)',
                boxShadow: '0 28px 60px rgba(0,0,0,0.55)',
                ease: 'power2.out',
              },
            )
            .to(cartao, { ...longe, rotationY: -14, ease: 'power2.in' });
        });

        gsap.fromTo(
          '.colecao__progresso-fill',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: raiz.current,
              start: 'top top',
              end: () => `+=${distancia()}`,
              scrub: true,
            },
          },
        );

        return () => ScrollTrigger.refresh();
      });

      return () => mm.revert();
    },
    { scope: raiz },
  );

  return (
    <section className="colecao" ref={raiz} id="colecao">
      <div className="colecao__topo">
        <div className="section-index meta">
          <span className="section-index__num">03</span>
          <span>A coleção</span>
        </div>
        <p className="colecao__dica meta">
          Arraste ou role <span aria-hidden="true">→</span>
        </p>
      </div>

      <div className="colecao__janela">
        <div className="colecao__trilho" ref={trilho}>
          <div className="colecao__painel colecao__painel--texto">
            <div className="colecao__abertura">
              <h2 className="t-h1">Oito máquinas em destaque</h2>
              <p className="t-lead">
                O estoque completo continua a um clique. Isto aqui é a vitrine — a parte
                que a gente mostraria primeiro se você entrasse na loja.
              </p>
              <Link to="/colecao" className="btn btn--paper">
                Ver as 24 máquinas
              </Link>
            </div>
          </div>

          {featuredVehicles.map((v, i) => (
            <article className="colecao__painel" key={v.id}>
              <Link to={`/veiculo/${v.slug}`} className="colecao__cartao" data-cursor="Ver máquina">
                <FotoVeiculo
                  veiculo={v}
                  proporcao="4 / 3"
                  veu="medio"
                  className="colecao__foto"
                />

                <div className="colecao__info">
                  <div className="colecao__cabecalho">
                    <span className="meta colecao__num">
                      {pad2(i + 1)} / {pad2(featuredVehicles.length)}
                    </span>
                    <span className="meta colecao__marca">{v.brand}</span>
                    <h3 className="colecao__modelo t-h3">{v.model}</h3>
                  </div>

                  <dl className="colecao__dados">
                    <div>
                      <dt className="meta">Ano</dt>
                      <dd>{v.year}</dd>
                    </div>
                    <div>
                      <dt className="meta">Rodagem</dt>
                      <dd>{formatKm(v.km)}</dd>
                    </div>
                    <div>
                      <dt className="meta">Motor</dt>
                      <dd>{v.engine}</dd>
                    </div>
                  </dl>

                  <div className="colecao__rodape">
                    <span className="colecao__preco">{formatPrice(v.price)}</span>
                    <span className="colecao__cta meta">
                      Ver máquina <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}

          <div className="colecao__painel colecao__painel--texto">
            <div className="colecao__abertura">
              <p className="meta">Fim da vitrine</p>
              <h3 className="t-h2">O estoque inteiro está organizado por filtros.</h3>
              <Link to="/colecao" className="btn btn--paper">
                Abrir catálogo completo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="colecao__progresso" aria-hidden="true">
        <span className="colecao__progresso-fill" />
      </div>
    </section>
  );
}
