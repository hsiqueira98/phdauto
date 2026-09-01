import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import RangeSlider, { MaxSlider } from './RangeSlider';
import { facets, bodyLabels, colorSwatches, quickFeatures, universes } from '@/data/taxonomy';
import { formatCompact, formatNumber } from '@/lib/format';
import { emptyFilters } from '@/lib/filtering';

/** Grupo colapsável — a complexidade existe, mas não toda de uma vez. */
function Group({ title, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`fgroup ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="fgroup__head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="fgroup__title meta">{title}</span>
        {count > 0 && <span className="fgroup__badge">{count}</span>}
        <span className="fgroup__icon" aria-hidden="true" />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="fgroup__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="fgroup__inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckList({ options, selected, onToggle, render = (o) => o, columns = 1 }) {
  return (
    <ul className={`checklist checklist--${columns}`}>
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <li key={option}>
            <label className={`check ${active ? 'is-active' : ''}`}>
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(option)}
              />
              <span className="check__box" aria-hidden="true" />
              <span className="check__label">{render(option)}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export default function FilterPanel({ filters, patch, onReset, resultCount }) {
  const toggle = (key) => (value) =>
    patch({
      [key]: filters[key].includes(value)
        ? filters[key].filter((v) => v !== value)
        : [...filters[key], value],
    });

  return (
    <div className="filters">
      <div className="filters__head">
        <p className="filters__count">
          <strong>{String(resultCount).padStart(2, '0')}</strong>
          <span className="meta">{resultCount === 1 ? 'máquina' : 'máquinas'}</span>
        </p>
        <button type="button" className="filters__reset meta link-underline" onClick={onReset}>
          Limpar tudo
        </button>
      </div>

      <Group title="Universo" count={filters.universes.length} defaultOpen>
        <CheckList
          options={universes.map((u) => u.id)}
          selected={filters.universes}
          onToggle={toggle('universes')}
          render={(id) => universes.find((u) => u.id === id)?.label ?? id}
        />
      </Group>

      <Group title="Preço" count={filters.priceMin !== emptyFilters.priceMin || filters.priceMax !== emptyFilters.priceMax ? 1 : 0} defaultOpen>
        <RangeSlider
          label="Faixa de preço"
          min={facets.priceMin}
          max={facets.priceMax}
          step={5000}
          value={[filters.priceMin, filters.priceMax]}
          onChange={([lo, hi]) => patch({ priceMin: lo, priceMax: hi })}
          format={(v) => `R$ ${formatCompact(v)}`}
        />
      </Group>

      <Group title="Marca" count={filters.brands.length}>
        <CheckList
          options={facets.brands}
          selected={filters.brands}
          onToggle={toggle('brands')}
          columns={2}
        />
      </Group>

      <Group title="Carroceria" count={filters.bodies.length}>
        <CheckList
          options={facets.bodies}
          selected={filters.bodies}
          onToggle={toggle('bodies')}
          render={(b) => bodyLabels[b] ?? b}
          columns={2}
        />
      </Group>

      <Group title="Câmbio e combustível" count={filters.transmissions.length + filters.fuels.length}>
        <p className="fgroup__sub meta">Câmbio</p>
        <CheckList
          options={facets.transmissions}
          selected={filters.transmissions}
          onToggle={toggle('transmissions')}
          columns={2}
        />
        <p className="fgroup__sub meta">Combustível</p>
        <CheckList
          options={facets.fuels}
          selected={filters.fuels}
          onToggle={toggle('fuels')}
          columns={2}
        />
      </Group>

      <Group title="Ano" count={filters.yearMin !== emptyFilters.yearMin || filters.yearMax !== emptyFilters.yearMax ? 1 : 0}>
        <RangeSlider
          label="Ano do modelo"
          min={facets.yearMin}
          max={facets.yearMax}
          step={1}
          value={[filters.yearMin, filters.yearMax]}
          onChange={([lo, hi]) => patch({ yearMin: lo, yearMax: hi })}
        />
      </Group>

      <Group title="Quilometragem" count={filters.kmMax !== emptyFilters.kmMax ? 1 : 0}>
        <MaxSlider
          label="Rodagem máxima"
          min={10000}
          max={facets.kmMax}
          step={10000}
          value={filters.kmMax}
          onChange={(v) => patch({ kmMax: v })}
          format={(v) => `${formatNumber(v)} km`}
        />
      </Group>

      <Group title="Cor" count={filters.colors.length}>
        <ul className="swatches">
          {facets.colors.map((color) => {
            const active = filters.colors.includes(color);
            return (
              <li key={color}>
                <button
                  type="button"
                  className={`swatch ${active ? 'is-active' : ''}`}
                  onClick={() => toggle('colors')(color)}
                  aria-pressed={active}
                >
                  <span className="swatch__dot" style={{ background: colorSwatches[color] }} />
                  <span className="swatch__label">{color}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Opcionais" count={filters.features.length}>
        <CheckList
          options={quickFeatures}
          selected={filters.features}
          onToggle={toggle('features')}
        />
      </Group>

      <Group title="Perfil" count={filters.economy ? 1 : 0}>
        <label className={`check ${filters.economy ? 'is-active' : ''}`}>
          <input
            type="checkbox"
            checked={filters.economy}
            onChange={() => patch({ economy: !filters.economy })}
          />
          <span className="check__box" aria-hidden="true" />
          <span className="check__label">
            Econômico
            <em className="check__hint">até 1.6, sem diesel, até 130 cv</em>
          </span>
        </label>
      </Group>
    </div>
  );
}
