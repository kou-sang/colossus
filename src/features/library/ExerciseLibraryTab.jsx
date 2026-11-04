import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../../components/ui';
import { CATEGORIES, CATEGORY_LABELS, EXERCISE_CATALOG, searchExercises } from '../../constants/exercises';
import { DESKTOP_QUERY, useMediaQuery } from '../../hooks/useMediaQuery';
import { playClick } from '../../utils/audio';
import { ExerciseDetail } from './ExerciseDetail';

const ExerciseList = ({ query, onQueryChange, category, onCategoryChange, selectedName, onSelect }) => {
  const results = useMemo(
    () => searchExercises(query).filter(({ entry }) => !category || entry.category === category),
    [query, category],
  );
  return (
    <div className="flex flex-col gap-3">
      {/*
        Móvil: la lista NO tiene scroll propio (antes su final quedaba debajo de la barra de navegación inferior);
        se desplaza con la página y el buscador queda fijo debajo del encabezado. Escritorio: lista con scroll propio.
      */}
      <div className="library-search sticky z-10 -mx-4 space-y-2 px-4 pb-2 pt-1 lg:static lg:mx-0 lg:px-0 lg:pb-0 lg:pt-0">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input className="input pl-9" placeholder="Buscar (ej: pájaro, curl, sentadilla)" aria-label="Buscar ejercicio"
            value={query} onChange={(event) => onQueryChange(event.target.value)} />
        </div>
        <select aria-label="Filtrar por categoría" className="input" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">Todas las categorías</option>
          {CATEGORIES.filter(({ id }) => id !== 'OTROS').map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
        </select>
      </div>
      <p className="text-xs text-muted">{results.length} ejercicio(s)</p>
            <ul className="rounded-xl border divider lg:max-h-[calc(100dvh-20rem)] lg:overflow-y-auto lg:overscroll-contain" aria-label="Ejercicios">
        {results.map(({ entry, matchedAlias }) => {
          const isSelected = entry.name === selectedName;
          return (
            <li key={entry.name}>
              <button type="button" aria-current={isSelected || undefined}
                className={`w-full border-b divider px-3 py-2.5 text-left last:border-b-0 ${isSelected ? 'bg-[var(--accent-soft)]' : 'hover:bg-[var(--surface-2)]'}`}
                onClick={() => onSelect(entry.name)}>
                <span className={`block truncate text-sm font-bold ${isSelected ? 'text-accent' : ''}`}>{entry.name}</span>
                <span className="block truncate text-xs text-muted">
                  {CATEGORY_LABELS[entry.category]}{matchedAlias && ` · "${matchedAlias}"`}
                </span>
              </button>
            </li>
          );
        })}
        {results.length === 0 && <li className="p-4 text-center text-sm text-muted">Sin resultados.</li>}
      </ul>
    </div>
  );
};

/**
 * Biblioteca de ejercicios: lista navegable + ficha con ilustraciones del movimiento, diagrama de músculos,
 * técnica, consejos y errores comunes (ver constants/exerciseGuides.js, constants/guides/ y constants/figures/).
 */
export const ExerciseLibraryTab = () => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selectedName, setSelectedName] = useState(null);
  const selected = selectedName ? EXERCISE_CATALOG[selectedName] : null;

  const select = (name) => {
    playClick();
    setSelectedName(name);
    if (!isDesktop) window.scrollTo({ top: 0 });
  };

  const list = (
    <ExerciseList query={query} onQueryChange={setQuery} category={category} onCategoryChange={setCategory}
      selectedName={selectedName} onSelect={select} />
  );

  // Móvil: lista o ficha (una a la vez). Escritorio: lista fija a la izquierda + ficha.
  if (!isDesktop) {
    return selected
      ? <ExerciseDetail exercise={selected} onBack={() => { playClick(); setSelectedName(null); }} onSelect={select} />
      : <div className="card p-4">{list}</div>;
  }

  return (
    <div className="grid grid-cols-[minmax(0,320px)_minmax(0,1fr)] items-start gap-6">
      <div className="card sticky top-20 p-4">{list}</div>
      {selected
        ? <ExerciseDetail exercise={selected} onSelect={select} />
        : <EmptyState icon={Search} title="Elige un ejercicio" description="Verás cómo se ejecuta, qué músculos trabaja, la técnica paso a paso, consejos y errores comunes." />}
    </div>
  );
};
