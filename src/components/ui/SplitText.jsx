import { forwardRef } from 'react';

/**
 * Split tipográfico para máscaras de revelação.
 *
 * Cada linha vira um container com overflow hidden e um inner que o GSAP
 * translada. Mantém o texto acessível via aria-label — leitores de tela
 * leem a frase inteira, não palavra por palavra.
 *
 * Classes-alvo para GSAP:
 *   .split__line   — a máscara
 *   .split__inner  — o alvo da animação (y / rotation / opacity)
 */

const SplitLines = forwardRef(function SplitLines(
  { lines, as: Tag = 'span', className = '', innerClassName = '', ...rest },
  ref,
) {
  const label = lines.join(' ');
  return (
    <Tag ref={ref} className={`split ${className}`} aria-label={label} {...rest}>
      {lines.map((line, i) => (
        <span className="split__line" key={`${line}-${i}`} aria-hidden="true">
          <span className={`split__inner ${innerClassName}`} data-line={i}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
});

/**
 * Split por letra, dentro de máscaras de linha.
 *
 * Usado só no título de abertura: é o efeito mais caro do site
 * (uma caixa por caractere), e não faz sentido repetir isso em
 * texto corrido. O nome acessível continua sendo a frase inteira.
 */
export function SplitLetters({
  lines,
  as: Tag = 'span',
  className = '',
  innerClassName = '',
  ...rest
}) {
  const label = lines.join(' ');
  return (
    <Tag className={`split split-letters ${className}`} aria-label={label} {...rest}>
      {lines.map((line, li) => (
        <span className="split__line" key={`${line}-${li}`} aria-hidden="true">
          {Array.from(line).map((ch, ci) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={`${li}-${ci}`}
              className={`split-letters__letter ${innerClassName}`}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

/** Split por palavra — usado no manifesto, onde cada palavra acende sozinha. */
export function SplitWords({ text, as: Tag = 'p', className = '', ...rest }) {
  const words = text.split(' ');
  return (
    <Tag className={`split-words ${className}`} aria-label={text} {...rest}>
      {words.map((word, i) => (
        <span className="split-words__word" key={`${word}-${i}`} aria-hidden="true">
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

export default SplitLines;
