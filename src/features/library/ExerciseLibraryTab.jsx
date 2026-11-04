import { Search } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { EmptyState } from '../../components/ui';
import { CATEGORIES, CATEGORY_LABELS, EXERCISE_CATALOG, searchExercises } from '../../constants/exercises';
import { DESKTOP_QUERY, useMediaQuery } from '../../hooks/useMediaQuery';
import { readPersisted, usePersistentState, writePersisted } from '../../hooks/usePersistentState';
import { playClick } from '../../utils/audio';
import { ExerciseDetail } from './ExerciseDetail';

// Posición de la lista (página en el celular, lista con scroll propio en escritorio): se recuerda entre visitas.
const SCROLL_KEY = 'library:scroll';
const SAVE_DELAY_MS = 400;
const isScrollState = (value) => Number.isFinite(value?.page) && Number.isFinite(value?.list);

/*
 * Guarda una posición con retardo. El retardo es a propósito: al cambiar de pestaña la app sube la página a 0
 * mientras esta pestaña todavía está montada; la limpieza del desmontaje cancela ese guardado y no se pierde la posición.
 */
const useDelayedScrollSaver = () => {
  const timerRef = useRef(null);
  const cancel = useCallback(() => window.clearTimeout(timerRef.current), []);
  const save = useCallback((patch) => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      writePersisted(SCROLL_KEY, { ...readPersisted(SCROLL_KEY, { page: 0, list: 0 }, isScrollState), ...patch });
    }, SAVE_DELAY_MS);
  }, []);
  useEffect(() => cancel, [cancel]);
  return { save, cancel };
};

const ExerciseList = ({ query, onQueryChange, category, onCategoryChange, selectedName, onSelect }) => {
  const listRef = useRef(null);
  const { save: saveScroll } = useDelayedScrollSaver();
  // Escritorio: la lista tiene scroll propio; se restaura donde quedó.
  useLayoutEffect(() => {
    if (listRef.current) listRef.current.scrollTop = readPersisted(SCROLL_KEY, { page: 0, list: 0 }, isScrollState).list;
  }, []);
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
            <ul ref={listRef} className="rounded-xl border divider lg:max-h-[calc(100dvh-20rem)] lg:overflow-y-auto lg:overscroll-contain" aria-label="Ejercicios"
        onScroll={(event) => saveScroll({ list: event.currentTarget.scrollTop })}>
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
  // Búsqueda, categoría y ejercicio abierto se recuerdan: al volver se sigue en el mismo lugar de la lista.
  const [query, setQuery] = usePersistentState('library:query', '', (value) => typeof value === 'string');
  const [category, setCategory] = usePersistentState('library:category', '', (value) => typeof value === 'string');
  const [selectedName, setSelectedName] = usePersistentState('library:selected', null, (value) => value === null || Boolean(EXERCISE_CATALOG[value]));
  const selected = selectedName ? EXERCISE_CATALOG[selectedName] : null;
  const isListVisible = isDesktop || !selected;
  const { save: saveScroll, cancel: cancelScrollSave } = useDelayedScrollSaver();

  // Celular: la lista se desplaza con la página → se guarda el scroll de la página mientras la lista está a la vista.
  useEffect(() => {
    if (isDesktop || selected) return undefined;
    const handleScroll = () => saveScroll({ page: window.scrollY });
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Al abrir una ficha se descarta el guardado pendiente (el salto al inicio de la ficha no es tu posición).
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelScrollSave();
    };
  }, [isDesktop, selected, saveScroll, cancelScrollSave]);

  // Al volver de la ficha (o al entrar a la pestaña) la lista aparece donde la dejaste.
  useLayoutEffect(() => {
    if (!isDesktop && isListVisible) window.scrollTo({ top: readPersisted(SCROLL_KEY, { page: 0, list: 0 }, isScrollState).page });
  }, [isDesktop, isListVisible]);

  const select = (name) => {
    playClick();
    if (!isDesktop) {
      // Desde la lista se guarda la posición al instante; desde una alternativa dentro de la ficha no se toca.
      if (!selected) writePersisted(SCROLL_KEY, { ...readPersisted(SCROLL_KEY, { page: 0, list: 0 }, isScrollState), page: window.scrollY });
      window.scrollTo({ top: 0 });
    }
    setSelectedName(name);
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
