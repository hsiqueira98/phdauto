import { Link } from 'react-router-dom';
import BrandMark from '@/components/ui/BrandMark';
export default function Footer() {
  return <footer className="polly-footer"><div className="polly-footer__top">
    <div><Link to="/" aria-label="POLLY VEÍCULOS — início"><BrandMark /></Link><p>Novos caminhos.<br />A sua próxima escolha.</p></div>
    <nav aria-label="Coleção no rodapé"><span className="polly-kicker">EXPLORE</span><Link to="/colecao">A coleção</Link><Link to="/colecao?universes=performance">Performance</Link><Link to="/colecao?universes=urban">Para o dia a dia</Link><Link to="/colecao?universes=adventure">Para ir além</Link></nav>
    <nav aria-label="POLLY no rodapé"><span className="polly-kicker">POLLY VEÍCULOS</span><Link to="/polly">Conheça a POLLY</Link><Link to="/vender">Venda seu carro</Link><Link to="/financiamento">Financiamento</Link></nav>
    <div className="polly-footer__end"><span className="polly-kicker">THE DRIVE GALLERY</span><Link to="/colecao">Seu próximo<br />capítulo começa<br /><span>aqui ↗</span></Link></div>
  </div><div className="polly-footer__base"><span>© {new Date().getFullYear()} POLLY VEÍCULOS</span><span>Protótipo de apresentação · veículos e ofertas demonstrativos</span></div></footer>;
}
