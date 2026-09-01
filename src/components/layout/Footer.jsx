import { Link } from 'react-router-dom';
import { universes } from '@/data/taxonomy';
import { Marquee } from '@/components/ui/atoms';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Marquee
        items={['PHD AUTOMÓVEIS', 'BRASÍLIA', 'DESDE 1996', 'SEMINOVOS SELECIONADOS']}
        speed={34}
        className="footer__marquee"
      />

      <div className="footer__grid">
        <div className="footer__brand">
          <span className="footer__mark">PHD</span>
          <p className="footer__tagline">
            Selecionamos carros para diferentes maneiras de viver.
          </p>
        </div>

        <nav className="footer__col" aria-label="Coleção">
          <p className="meta">Coleção</p>
          <ul>
            {universes.map((u) => (
              <li key={u.id}>
                <Link to={`/colecao?universes=${u.id}`} className="link-underline">
                  {u.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/colecao" className="link-underline">
                Estoque completo
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Serviços">
          <p className="meta">Serviços</p>
          <ul>
            <li><Link to="/vender" className="link-underline">Vender meu carro</Link></li>
            <li><Link to="/financiamento" className="link-underline">Financiamento</Link></li>
            <li><Link to="/phd" className="link-underline">A casa PHD</Link></li>
            <li><Link to="/colecao?focus=busca" className="link-underline">Busca inteligente</Link></li>
          </ul>
        </nav>

        <div className="footer__col">
          <p className="meta">Showroom</p>
          <address className="footer__address">
            SIA Trecho 3<br />
            Brasília — Distrito Federal
          </address>
          <p className="footer__hours">
            Seg a Sex 8h–18h<br />
            Sáb 8h–13h
          </p>
          <a className="footer__whats" href="https://wa.me/5561000000000" target="_blank" rel="noreferrer">
            Falar no WhatsApp
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="footer__base">
        <p className="meta">© {year} PHD Automóveis — Brasília, desde 1996</p>
        <p className="meta footer__note">
          Conceito de redesign · protótipo de apresentação
        </p>
      </div>
    </footer>
  );
}
