import { useState } from 'react';

/**
 * FOTOGRAFIA — PHD Photo Standard
 *
 * Todo veículo aparece no mesmo recorte, com o mesmo tratamento.
 * O acervo emprestado do protótipo vem de fontes diferentes, com
 * luz e fundo diferentes; a graduação aplicada aqui (dessaturação
 * leve, contraste e véu grafite) é o que faz vinte e quatro fotos
 * distintas lerem como uma coleção só.
 *
 * É também a demonstração do argumento: quando as fotos forem
 * feitas no showroom, no mesmo ângulo, o efeito fica muito maior.
 */
export default function Foto({
  src,
  alt,
  proporcao = '16 / 10',
  posicao = 'center 55%',
  escala = 1,
  prioridade = false,
  veu = 'medio',
  className = '',
  children,
}) {
  const [carregada, setCarregada] = useState(false);
  const [falhou, setFalhou] = useState(false);

  return (
    <figure
      className={`foto foto--veu-${veu} ${carregada ? 'is-carregada' : ''} ${className}`}
      style={{ '--foto-proporcao': proporcao }}
    >
      {!falhou && src ? (
        <img
          className="foto__img"
          src={src}
          alt={alt}
          loading={prioridade ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={prioridade ? 'high' : 'auto'}
          style={{ objectPosition: posicao, '--foto-escala': escala }}
          onLoad={() => setCarregada(true)}
          onError={() => setFalhou(true)}
        />
      ) : (
        <span className="foto__vazio meta" aria-label={alt}>
          Fotografia indisponível
        </span>
      )}

      <span className="foto__grade" aria-hidden="true" />
      {children}
    </figure>
  );
}

/**
 * Foto de um veículo, com alt descritivo montado a partir dos dados.
 * Os campos do modelo seguem em inglês (brand/model/...) porque são
 * contrato de dados; só o que a pessoa lê está em português.
 */
export function FotoVeiculo({ veiculo, indice = 0, ...resto }) {
  const fotos = veiculo.photos ?? [];
  const src = fotos[indice] ?? fotos[0];
  return (
    <Foto
      src={src}
      alt={`${veiculo.brand} ${veiculo.model} ${veiculo.version}, ${veiculo.year}, cor ${veiculo.color.toLowerCase()}`}
      {...resto}
    />
  );
}
