import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { universes } from '@/data/taxonomy';
import BrandMark from '@/components/ui/BrandMark';

const NAV = [
  { to: '/colecao', pt: 'Coleção', en: 'Encontre seu carro' },
  { to: '/vender', pt: 'Venda seu carro', en: 'Um novo começo' },
  { to: '/financiamento', pt: 'Financiamento', en: 'Explore possibilidades' },
  { to: '/polly', pt: 'A POLLY', en: 'Conheça a marca' },
];
export default function Header({ onOpenDriveMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useRef(null);
  const menuButton = useRef(null);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { setScrolled(window.scrollY > 30); frame = 0; });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const el = dialog.current;
    if (menuOpen) { el.showModal(); } else if (el.open) { el.close(); menuButton.current?.focus(); }
    return () => { if (el.open) el.close(); };
  }, [menuOpen]);

  return <>
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}><div className="header__inner">
      <Link to="/" className="header__logo" aria-label="POLLY VEÍCULOS — início"><BrandMark /></Link>
      <nav className="header__nav" aria-label="Navegação principal">{NAV.map(item => <NavLink key={item.to} to={item.to} aria-label={item.pt} className={({isActive}) => `header__link ${isActive ? 'is-active' : ''}`}><span className="header__link-en" aria-hidden="true">{item.pt}</span><span className="header__link-pt" aria-hidden="true">{item.en}</span></NavLink>)}</nav>
      <div className="header__actions"><button type="button" className="header__drive" onClick={onOpenDriveMode}><span className="header__drive-dot" aria-hidden="true" /> Drive Mode <span aria-hidden="true">↗</span></button>
        <button ref={menuButton} type="button" className="header__burger" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="polly-menu" aria-label="Abrir menu"><span /><span /></button>
      </div>
    </div></header>
    <dialog id="polly-menu" ref={dialog} className="polly-menu" aria-label="Menu de navegação" onCancel={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)}>
      <div className="polly-menu__bar"><BrandMark /><button type="button" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">✕</button></div>
      <div className="polly-menu__grid"><nav aria-label="Menu expandido">{NAV.map((item, i) => <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{item.pt}<b aria-hidden="true">↗</b></Link>)}</nav><div><p className="polly-kicker">ENCONTRE O SEU ESTILO</p>{universes.map(u => <Link key={u.id} to={`/colecao?universes=${u.id}`} onClick={() => setMenuOpen(false)}>{u.label} ↗</Link>)}<p className="polly-menu__note">Seu próximo capítulo.<br />Começa ao volante.</p></div></div>
    </dialog>
  </>;
}
