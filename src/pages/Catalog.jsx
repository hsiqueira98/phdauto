import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
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

/* A saída continua animada, mas o painel deixa de receber foco imediatamente. */
function CatalogFilterDrawer({ children, isDesktop, panelRef }) {
  const present = useIsPresent();
  return (
    <motion.aside
      ref={panelRef}
      id="catalog-filters"
      className="catalog__aside"
      role={!isDesktop && present ? 'dialog' : undefined}
      aria-modal={!isDesktop && present ? true : undefined}
      aria-label="Filtros da coleção"
      aria-hidden={!present || undefined}
      inert={!present || undefined}
      tabIndex={-1}
      initial={isDesktop ? { width: 0, opacity: 0 } : { x: '-100%' }}
      animate={isDesktop ? { width: 300, opacity: 1 } : { x: 0 }}
      exit={isDesktop ? { width: 0, opacity: 0 } : { x: '-100%' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.aside>
  );
}

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
  const drawerRef = useRef(null);
  const filterButtonRef = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 1100px)');
  const modalOpen = drawerOpen && !isDesktop;

  useLockBodyScroll(modalOpen);

  useEffect(() => {
    const panel = drawerRef.current;
    if (!modalOpen || !panel) return undefined;

    const returnFocus = filterButtonRef.current;
    const outside = [];

    // Isola os irmãos de cada ancestral, incluindo cabeçalho e rodapé globais.
    // O fundo continua clicável e não participa da sequência de teclado.
    for (let branch = panel; branch?.parentElement; branch = branch.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (sibling === branch || sibling.classList.contains('catalog__scrim')) continue;
        outside.push([sibling, sibling.getAttribute('inert')]);
        sibling.setAttribute('inert', '');
      }
      if (branch.parentElement === document.body) break;
    }

    const focusable = () => [...panel.querySelectorAll(
      'button, a[href], input:not([type="hidden"]), select, textarea, [tabindex]',
    )].filter((element) => {
      const style = getComputedStyle(element);
      return !element.disabled && element.tabIndex >= 0
        && !element.closest('[hidden], [inert], [aria-hidden="true"]')
        && style.display !== 'none' && style.visibility !== 'hidden';
    });

    const focusFirst = () => (focusable()[0] ?? panel).focus({ preventScroll: true });
    focusFirst();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setDrawerOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const controls = focusable();
      const first = controls[0] ?? panel;
      const last = controls.at(-1) ?? panel;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || active === panel || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocusIn = (event) => {
      if (!panel.contains(event.target)) focusFirst();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      outside.forEach(([element, previous]) => {
        if (previous === null) element.removeAttribute('inert');
        else element.setAttribute('inert', previous);
      });
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [modalOpen]);

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
            <span>Coleção POLLY · demonstração</span>
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
              aria-pressed={filters.universes.length === 0}
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
                aria-pressed={filters.universes.includes(u.id)}
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
          ref={filterButtonRef}
          className="catalog__filters-toggle"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-expanded={drawerOpen}
          aria-controls={drawerOpen ? 'catalog-filters' : undefined}
          aria-haspopup={!isDesktop ? 'dialog' : undefined}
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
            <CatalogFilterDrawer isDesktop={isDesktop} panelRef={drawerRef}>
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
            </CatalogFilterDrawer>
          )}
        </AnimatePresence>

        <section className="catalog__results" aria-live="polite">
          {results.length === 0 ? (
            <div className="catalog__empty">
              <p className="t-h2">Nada bate com isso.</p>
              <p>
                Nenhuma máquina do estoque atende a todos os critérios ao mesmo tempo.
                Tente remover um filtro ou explore outro perfil de direção para
                descobrir mais possibilidades nesta coleção de demonstração.
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

      {modalOpen && (
        <button
          type="button"
          className="catalog__scrim"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </main>
  );
}
