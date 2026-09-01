import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import FilterPanel from '@/components/catalog/FilterPanel';
import VehicleCard from '@/components/catalog/VehicleCard';
import { vehicles } from '@/data/vehicles';
import { sortOptions, universes } from '@/data/taxonomy';
import {
  activeChips,
  applyFilters,
  createFilters,
  filtersToParams,
  paramsToFilters,
  removeChip,
  sortVehicles,
} from '@/lib/filtering';
import { parseQuery, searchSuggestions } from '@/lib/smartSearch';
import { useLockBodyScroll, useMediaQuery } from '@/lib/hooks';

/**
 * CATÁLOGO
 *
 * Aqui a promessa se paga: quem quer comprar rápido tem marca, modelo,
 * ano, preço, câmbio, combustível, cor, quilometragem e opcionais.
 * Toda combinação de filtros é um link — a URL é o estado.
 */
export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => paramsToFilters(searchParams), [searchParams]);

  const [text, setText] = useState(filters.q);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState('gallery');
  const inputRef = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 1100px)');

  useLockBodyScroll(drawerOpen && !isDesktop);

  const patch = (fragment) => {
    const next = { ...filters, ...fragment };
    setSearchParams(filtersToParams(next), { replace: true });
  };

  const reset = () => {
    setText('');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  /* Busca em linguagem natural, aplicada com debounce. */
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return undefined;
    }
    const id = setTimeout(() => {
      setSearchParams((prev) => {
        const current = paramsToFilters(prev);

        // Campo vazio limpa só a busca textual — os filtros do painel continuam valendo.
        if (!text.trim()) return filtersToParams({ ...current, q: '' });

        // Com texto, a frase assume: ela descreve o conjunto inteiro de critérios.
        const { patch: parsed, rest } = parseQuery(text);
        return filtersToParams({ ...createFilters({ sort: current.sort }), ...parsed, q: rest });
      }, { replace: true });
    }, 350);
    return () => clearTimeout(id);
  }, [text, setSearchParams]);

  useEffect(() => {
    if (searchParams.get('focus') === 'busca') inputRef.current?.focus();
  }, [searchParams]);

  const results = useMemo(
    () => sortVehicles(applyFilters(vehicles, filters), filters.sort),
    [filters],
  );

  const chips = activeChips(filters);
  const tokens = useMemo(() => parseQuery(text).tokens, [text]);

  return (
    <main className="catalog" id="conteudo">
      <header className="catalog__header">
        <div className="catalog__header-top">
          <div className="section-index meta">
            <span className="section-index__num">01</span>
            <span>Catálogo completo</span>
          </div>
          <p className="catalog__total meta">
            {String(results.length).padStart(2, '0')} de {vehicles.length} máquinas
          </p>
        </div>

        <h1 className="catalog__title t-display">A coleção</h1>

        <form className="catalog__search" onSubmit={(e) => e.preventDefault()} role="search">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar por descrição
          </label>
          <input
            id="catalog-search"
            ref={inputRef}
            type="text"
            className="catalog__search-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite o que você procura — SUV automático até 100 mil"
            autoComplete="off"
          />
          {text && (
            <button type="button" className="catalog__search-clear" onClick={() => setText('')} aria-label="Limpar busca">
              ×
            </button>
          )}
        </form>

        {tokens.length > 0 && (
          <ul className="catalog__tokens">
            <li className="meta">Entendi:</li>
            {tokens.map((t) => (
              <li key={t} className="catalog__token">
                {t}
              </li>
            ))}
          </ul>
        )}

        {!text && (
          <ul className="catalog__suggestions">
            {searchSuggestions.slice(0, 4).map((s) => (
              <li key={s}>
                <button type="button" className="catalog__suggestion" onClick={() => setText(s)}>
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Atalhos editoriais — os mesmos universos da home */}
        <ul className="catalog__universes">
          <li>
            <button
              type="button"
              className={`catalog__universe ${filters.universes.length === 0 ? 'is-active' : ''}`}
              onClick={() => patch({ universes: [] })}
            >
              Tudo
            </button>
          </li>
          {universes.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                className={`catalog__universe ${filters.universes.includes(u.id) ? 'is-active' : ''}`}
                onClick={() =>
                  patch({
                    universes: filters.universes.includes(u.id)
                      ? filters.universes.filter((x) => x !== u.id)
                      : [...filters.universes, u.id],
                  })
                }
              >
                {u.label}
              </button>
            </li>
          ))}
        </ul>
      </header>

      <div className="catalog__toolbar">
        <button
          type="button"
          className="catalog__filters-toggle"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-expanded={drawerOpen}
        >
          <span className="catalog__filters-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Filtros
          {chips.length > 0 && <span className="catalog__filters-count">{chips.length}</span>}
        </button>

        <AnimatePresence>
          {chips.length > 0 && (
            <motion.ul
              className="catalog__chips"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {chips.map((chip) => (
                <motion.li
                  key={`${chip.key}-${chip.value}-${chip.label}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <button
                    type="button"
                    className="chip"
                    onClick={() => {
                      if (chip.key === 'q') setText('');
                      setSearchParams(filtersToParams(removeChip(filters, chip)), { replace: true });
                    }}
                  >
                    {chip.label}
                    <span aria-hidden="true">×</span>
                  </button>
                </motion.li>
              ))}
              <li>
                <button type="button" className="chip chip--clear" onClick={reset}>
                  Limpar tudo
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="catalog__toolbar-right">
          <div className="catalog__view" role="group" aria-label="Modo de visualização">
            <button
              type="button"
              className={view === 'gallery' ? 'is-active' : ''}
              onClick={() => setView('gallery')}
              aria-pressed={view === 'gallery'}
            >
              Galeria
            </button>
            <button
              type="button"
              className={view === 'list' ? 'is-active' : ''}
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
            >
              Lista
            </button>
          </div>

          <label className="catalog__sort">
            <span className="sr-only">Ordenar por</span>
            <select value={filters.sort} onChange={(e) => patch({ sort: e.target.value })}>
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className={`catalog__body ${drawerOpen ? 'has-filters' : ''}`}>
        <AnimatePresence>
          {drawerOpen && (
            <motion.aside
              className="catalog__aside"
              initial={isDesktop ? { width: 0, opacity: 0 } : { x: '-100%' }}
              animate={isDesktop ? { width: 300, opacity: 1 } : { x: 0 }}
              exit={isDesktop ? { width: 0, opacity: 0 } : { x: '-100%' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="catalog__aside-inner">
                <div className="catalog__aside-head">
                  <p className="meta">Filtros</p>
                  <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Fechar filtros">
                    ×
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  patch={patch}
                  onReset={reset}
                  resultCount={results.length}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <section className="catalog__results" aria-live="polite">
          {results.length === 0 ? (
            <div className="catalog__empty">
              <p className="t-h2">Nada bate com isso.</p>
              <p>
                Nenhuma máquina do estoque atende a todos os critérios ao mesmo tempo.
                Tente remover um filtro — ou fale com a gente: às vezes o carro certo
                chega antes de aparecer no site.
              </p>
              <button type="button" className="btn btn--paper" onClick={reset}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <motion.div layout className={`catalog__grid catalog__grid--${view}`}>
              <AnimatePresence mode="popLayout">
                {results.map((v, i) => (
                  <VehicleCard key={v.id} vehicle={v} index={i} view={view} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>

      {drawerOpen && !isDesktop && (
        <button
          type="button"
          className="catalog__scrim"
          onClick={() => setDrawerOpen(false)}
          aria-label="Fechar filtros"
        />
      )}
    </main>
  );
}
