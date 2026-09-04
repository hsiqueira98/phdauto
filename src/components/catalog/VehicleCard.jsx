import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FotoVeiculo } from '@/components/ui/Foto';
import { formatKm, formatPrice, pad2 } from '@/lib/format';
import { bodyLabels, getUniverse } from '@/data/taxonomy';

/**
 * Cartão do catálogo.
 * Mesmo recorte, mesma hierarquia — o que muda entre um carro e outro
 * é a máquina, nunca o layout.
 */
export default function VehicleCard({ vehicle, index, view = 'gallery' }) {
  const universo = getUniverse(vehicle.universe);
  const reservado = vehicle.status === 'reservado';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.03, 0.3) }}
      className={`vcard vcard--${view} ${reservado ? 'is-reservado' : ''}`}
    >
      <Link to={`/veiculo/${vehicle.slug}`} className="vcard__link" data-cursor="Ver máquina">
        <div className="vcard__moldura shimmer-sweep glow-on-hover">
          <FotoVeiculo veiculo={vehicle} proporcao="4 / 3" veu="medio" className="vcard__foto" />

          <span className="vcard__indice meta">{pad2(index + 1)}</span>

          {reservado && <span className="vcard__selo meta">Reservado</span>}
          {vehicle.featured && !reservado && (
            <span className="vcard__selo vcard__selo--escolha meta">
              <span className="vcard__selo-ponto" aria-hidden="true" />
              Escolha POLLY
            </span>
          )}
        </div>

        <div className="vcard__corpo">
          <header className="vcard__cabecalho">
            <span className="meta vcard__marca">{vehicle.brand}</span>
            <h3 className="vcard__model t-h3">{vehicle.model}</h3>
            <p className="vcard__versao">{vehicle.version}</p>
          </header>

          <ul className="vcard__dados meta">
            <li>{vehicle.year}</li>
            <li>{formatKm(vehicle.km)}</li>
            <li>{vehicle.transmission}</li>
            <li>{bodyLabels[vehicle.body]}</li>
          </ul>

          {/* O rodapé troca de conteúdo no hover: o universo desliza
              para cima e dá lugar à chamada. Duas informações no
              mesmo espaço, sem poluir o cartão em repouso. */}
          <footer className="vcard__rodape">
            <span className="vcard__preco">{formatPrice(vehicle.price)}</span>
            <span className="vcard__troca">
              <span className="vcard__universo meta">{universo?.label}</span>
              <span className="vcard__acao meta" aria-hidden="true">
                Ver máquina <span>→</span>
              </span>
            </span>
          </footer>
        </div>
      </Link>
    </motion.article>
  );
}
