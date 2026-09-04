import { Link } from 'react-router-dom';
import { Reveal } from '@/components/ui/atoms';
export default function Showroom() {
  return <section className="polly-discover section" id="showroom"><div className="shell polly-discover__grid">
    <p className="polly-kicker">08 / MAIS PERTO DA SUA ESCOLHA</p>
    <Reveal><h2>Olhe de perto.<br /><span>Imagine mais longe.</span></h2><p>Conheça os detalhes, explore as possibilidades e encontre o carro que combina com o seu momento.</p><Link to="/colecao" className="btn btn--paper">Conhecer os veículos <span aria-hidden="true">↗</span></Link></Reveal>
    <div className="polly-discover__stamp" aria-hidden="true"><span>POLLY</span><span>VEÍCULOS</span><b>↗</b></div>
  </div></section>;
}
