import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { timeline } from '@/data/taxonomy';

/**
 * HISTÓRIA PHD
 *
 * Tempo de mercado é o único ativo que uma startup não consegue fabricar.
 * Por isso ele deixa de ser um parágrafo em "Sobre" e vira uma seção
 * pinada, contada ano a ano.
 */
export default function Timeline() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('.timeline__entry', { autoAlpha: 1, position: 'relative' });
        return;
      }

      const entries = gsap.utils.toArray('.timeline__entry');
      const marks = gsap.utils.toArray('.timeline__mark');
      const step = 1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${entries.length * 90}%`,
          pin: true,
          scrub: 0.7,
        },
      });

      entries.forEach((entry, i) => {
        const at = i * step;
        const year = entry.querySelector('.timeline__year');
        const copy = entry.querySelectorAll('.timeline__reveal');

        if (i > 0) {
          tl.fromTo(entry, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.32 }, at);
          tl.fromTo(year, { yPercent: 28 }, { yPercent: 0, duration: 0.45 }, at);
          tl.fromTo(copy, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, stagger: 0.06 }, at + 0.05);
        }

        if (i < entries.length - 1) {
          tl.to(entry, { autoAlpha: 0, duration: 0.3 }, at + step - 0.3);
          tl.to(year, { yPercent: -22, duration: 0.4 }, at + step - 0.4);
        }

        tl.to(marks[i], { color: 'var(--accent)', opacity: 1, duration: 0.2 }, at);
        if (i > 0) tl.to(marks[i - 1], { opacity: 0.3, duration: 0.2 }, at);
      });

      /* Fecho. A última entrada precisa sair de cena antes: sem isto
         "Sua vez." aparecia sobreposto ao texto de 2026. */
      const fecho = entries.length * step - 0.35;
      tl.to(entries[entries.length - 1], { autoAlpha: 0, yPercent: -12, duration: 0.35 }, fecho);
      tl.to(marks[marks.length - 1], { opacity: 0.3, duration: 0.2 }, fecho);
      tl.fromTo(
        '.timeline__turn',
        { autoAlpha: 0, yPercent: 30 },
        { autoAlpha: 1, yPercent: 0, duration: 0.5 },
        fecho + 0.2,
      );
    },
    { scope: root },
  );

  return (
    <section className="timeline" ref={root} id="phd">
      <div className="timeline__inner">
        <div className="section-index meta">
          <span className="section-index__num">07</span>
          <span>A casa PHD</span>
        </div>

        <ol className="timeline__rail" aria-hidden="true">
          {timeline.map((t, i) => (
            <li key={t.year} className={`timeline__mark meta ${i === 0 ? 'is-active' : ''}`}>
              {t.year}
            </li>
          ))}
        </ol>

        <div className="timeline__stage">
          {timeline.map((t, i) => (
            <article className={`timeline__entry ${i === 0 ? 'is-first' : ''}`} key={t.year}>
              <div className="timeline__texto">
                <span className="timeline__year num">{t.year}</span>
                <h3 className="timeline__title timeline__reveal t-h2">{t.title}</h3>
                <p className="timeline__body timeline__reveal">{t.body}</p>
              </div>

              {/* Coluna direita: o ano em fantasma e o tempo de estrada
                  daquele marco. O espaço estava vazio. */}
              <div className="timeline__lado" aria-hidden="true">
                <span className="timeline__fantasma num">{t.year}</span>
                <div className="timeline__medida">
                  <span className="timeline__medida-valor num">
                    {Number(t.year) - 1996}
                  </span>
                  <span className="meta">
                    {Number(t.year) - 1996 === 0 ? 'o começo' : 'anos de estrada'}
                  </span>
                  <span className="timeline__barra">
                    <span
                      className="timeline__barra-fill"
                      style={{ transform: `scaleX(${(Number(t.year) - 1996) / 30})` }}
                    />
                  </span>
                </div>
              </div>
            </article>
          ))}

          <div className="timeline__turn">
            <span className="timeline__turn-texto t-display">E continua.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
