import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { parseQuery, searchSuggestions } from '@/lib/smartSearch';
import { applyFilters, createFilters, filtersToParams } from '@/lib/filtering';
import { vehicles } from '@/data/vehicles';
import { Reveal } from '@/components/ui/atoms';

/**
 * Busca inteligente.
 *
 * A complexidade do filtro não sumiu — ela só parou de ser a porta de entrada.
 * A frase digitada é traduzida em tempo real para o mesmo objeto de filtro
 * que os controles avançados do catálogo manipulam.
 */
export default function SmartFind() {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { tokens, filters, results } = useMemo(() => {
    const { patch, tokens: parsed, rest } = parseQuery(query);
    const f = createFilters({ ...patch, q: rest });
    return { tokens: parsed, filters: f, results: applyFilters(vehicles, f) };
  }, [query]);

  const submit = (e) => {
    e?.preventDefault();
    navigate(`/colecao?${filtersToParams(filters).toString()}`);
  };

  return (
    <section className="section smart-find" id="encontrar">
      <div className="shell">
        <div className="section-index meta">
          <span className="section-index__num">05</span>
          <span>Encontrar meu carro</span>
        </div>

        <Reveal>
          <h2 className="smart-find__title t-h1">
            Diga com suas
            <br />
            palavras.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <form className="smart-find__form" onSubmit={submit} role="search">
            {/* Rótulo visível: o campo estava tão discreto que não se
                lia como campo. */}
            <label htmlFor="smart-find-input" className="smart-find__rotulo meta">
              Descreva o carro que você procura
            </label>
            <span className="smart-find__campo">
            <input
              id="smart-find-input"
              ref={inputRef}
              className="smart-find__input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: SUV automático até 100 mil"
              autoComplete="off"
            />
              <button type="submit" className="smart-find__submit" aria-label="Buscar">
                <span aria-hidden="true">→</span>
              </button>
            </span>
          </form>
        </Reveal>

        <div className="smart-find__feedback" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {tokens.length > 0 && (
              <motion.ul
                className="smart-find__tokens"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                key="tokens"
              >
                <li className="meta smart-find__tokens-label">Entendi:</li>
                {tokens.map((t) => (
                  <motion.li
                    key={t}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="smart-find__token"
                  >
                    {t}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {query.trim().length > 0 && (
            <p className="smart-find__count meta">
              {results.length === 0
                ? 'Nenhuma máquina com esses critérios — tente afrouxar um filtro.'
                : `${results.length} ${results.length === 1 ? 'máquina encontrada' : 'máquinas encontradas'}`}
            </p>
          )}
        </div>

        <div className="smart-find__suggestions">
          <p className="meta">Ou comece por aqui</p>
          <ul>
            {searchSuggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="smart-find__chip"
                  onClick={() => {
                    setQuery(s);
                    inputRef.current?.focus();
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="smart-find__note">
          Prefere o jeito tradicional? O catálogo tem marca, modelo, ano, preço, câmbio,
          combustível, cor, quilometragem e opcionais — tudo isso continua lá,
          <button type="button" className="smart-find__inline-link" onClick={() => navigate('/colecao')}>
            um clique adiante
          </button>
          .
        </p>
      </div>
    </section>
  );
}
