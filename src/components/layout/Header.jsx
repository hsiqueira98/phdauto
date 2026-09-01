import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLockBodyScroll, useKeyDown } from '@/lib/hooks';
import { universes } from '@/data/taxonomy';

/**
 * Menu quase ridiculamente simples.
 * Collection — Sell — Financing — PHD — Search. Nada de portal.
 */
const NAV = [
  { to: '/colecao', pt: 'Coleção', en: 'Ver estoque' },
  { to: '/vender', pt: 'Vender', en: 'Avaliar meu carro' },
  { to: '/financiamento', pt: 'Financiamento', en: 'Simular parcela' },
  { to: '/phd', pt: 'A casa', en: 'Desde 1996' },
];

export default function Header({ onOpenDriveMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useLockBodyScroll(menuOpen);
  useKeyDown('Escape', () => setMenuOpen(false), menuOpen);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 260 && y > last);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`header ${scrolled ? 'is-scrolled' : ''} ${hidden && !menuOpen ? 'is-hidden' : ''}`}
      >
        <div className="header__inner">
          <Link to="/" className="header__logo" aria-label="PHD Automóveis — início">
            <span className="header__mark">
              PHD
              <span className="header__mark-risco" aria-hidden="true" />
            </span>
            <span className="header__sub meta">Automóveis</span>
          </Link>

          <nav className="header__nav" aria-label="Navegação principal">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `header__link ${isActive ? 'is-active' : ''}`}
              >
                <span className="header__link-en">{item.pt}</span>
                <span className="header__link-pt">{item.en}</span>
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <button type="button" className="header__drive" onClick={onOpenDriveMode}>
              <span className="header__drive-dot" aria-hidden="true" />
              Modo imersivo
            </button>

            <Link to="/colecao?focus=busca" className="header__search" aria-label="Buscar veículo">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" strokeLinecap="round" />
              </svg>
              {/* Rótulo que só abre no hover: o ícone sozinho é ambíguo,
                  mas a barra não pode carregar mais uma palavra fixa. */}
              <span className="header__search-rotulo meta" aria-hidden="true">Buscar</span>
            </Link>

            <button
              type="button"
              className={`header__burger ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="menu-overlay"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu-overlay__inner">
              <div className="menu-overlay__main">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.18 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link to={item.to} className="menu-overlay__link t-h1">
                      <span className="menu-overlay__num meta">0{i + 1}</span>
                      {item.pt}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="menu-overlay__aside">
                <p className="meta">Universos</p>
                <ul className="menu-overlay__universes">
                  {universes.map((u) => (
                    <li key={u.id}>
                      <Link to={`/colecao?universes=${u.id}`} className="link-underline">
                        {u.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="menu-overlay__contact">
                  <p className="meta">Showroom</p>
                  <p>SIA Trecho 3 — Brasília, DF</p>
                  <p className="menu-overlay__muted">Seg a Sex 8h–18h · Sáb 8h–13h</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
