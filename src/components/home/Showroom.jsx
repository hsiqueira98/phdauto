import { useState } from 'react';
import { Reveal } from '@/components/ui/atoms';

/**
 * SHOWROOM BRASÍLIA
 *
 * Mapa de verdade, não um desenho decorativo.
 *
 * Usa o embed do OpenStreetMap: é o único mapa interativo que roda
 * sem chave de API, então o protótipo funciona na máquina de
 * qualquer pessoa sem cadastro em lugar nenhum. Na produção, trocar
 * pelo provedor que a PHD preferir é só mudar a URL do iframe.
 *
 * As coordenadas vieram da geocodificação do endereço no Nominatim
 * (SIA Trecho 3, CEP 71200-030).
 */
const LAT = -15.8027251;
const LON = -47.9535238;
const CAIXA = 0.012; // ~1,3 km de moldura em volta do ponto

/* Sem `marker=`: o pino do OSM apareceria junto do nosso e ficariam
   dois alfinetes no mesmo ponto. O centro da bbox é exatamente
   (LON, LAT), então o pino centralizado por CSS cai no lugar certo. */
const MAPA_EMBED =
  'https://www.openstreetmap.org/export/embed.html' +
  `?bbox=${LON - CAIXA}%2C${LAT - CAIXA * 0.6}%2C${LON + CAIXA}%2C${LAT + CAIXA * 0.6}` +
  '&layer=mapnik';

const LINK_OSM = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LON}#map=16/${LAT}/${LON}`;
const LINK_ROTA = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LON}`;

export default function Showroom() {
  const [carregado, setCarregado] = useState(false);

  return (
    <section className="section showroom" id="showroom">
      <div className="shell showroom__shell">
        <div className="showroom__copy">
          <div className="section-index meta">
            <span className="section-index__num">08</span>
            <span>Showroom</span>
          </div>

          <Reveal>
            <h2 className="showroom__title t-h1">
              Brasília,
              <br />
              SIA Trecho 3.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="showroom__lead">
              A coleção existe fora da tela. Todas as máquinas ficam no mesmo pátio,
              sob a mesma luz — que é exatamente como elas são fotografadas.
            </p>
          </Reveal>

          <dl className="showroom__info">
            <Reveal delay={0.15}>
              <dt className="meta">Endereço</dt>
              <dd>
                SIA Trecho 3, Lotes 625/695
                <br />
                Brasília — DF, 71200-030
              </dd>
            </Reveal>
            <Reveal delay={0.2}>
              <dt className="meta">Horário</dt>
              <dd>
                Segunda a sexta, 8h às 18h
                <br />
                Sábado, 8h às 13h
              </dd>
            </Reveal>
            <Reveal delay={0.25}>
              <dt className="meta">Contato</dt>
              <dd>
                <a
                  className="link-underline"
                  href="https://wa.me/5561000000000"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
                <br />
                <a className="link-underline" href="tel:+556100000000">
                  (61) 0000-0000
                </a>
              </dd>
            </Reveal>
          </dl>

          <Reveal delay={0.3} className="showroom__acoes">
            <a className="btn btn--paper" href={LINK_ROTA} target="_blank" rel="noreferrer">
              Como chegar
            </a>
            <a className="btn btn--ghost" href={LINK_OSM} target="_blank" rel="noreferrer">
              Abrir no mapa
            </a>
          </Reveal>
        </div>

        <Reveal className="showroom__mapa" delay={0.15}>
          <div className={`showroom__mapa-moldura ${carregado ? 'is-carregado' : ''}`}>
            <iframe
              src={MAPA_EMBED}
              title="Mapa da localização do showroom da PHD Automóveis no SIA Trecho 3, Brasília"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setCarregado(true)}
            />
            {/* Tinta grafite por cima: o mapa é claro e destoaria do
                resto do site. `pointer-events: none` mantém o mapa
                arrastável e com zoom. */}
            <span className="showroom__mapa-tinta" aria-hidden="true" />
            <span className="showroom__mapa-pino" aria-hidden="true">
              <span className="showroom__mapa-ponto" />
              <span className="showroom__mapa-rotulo meta">PHD</span>
            </span>
          </div>
          <p className="showroom__mapa-credito meta">Mapa © colaboradores do OpenStreetMap</p>
        </Reveal>
      </div>
    </section>
  );
}
