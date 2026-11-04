import { useCallback, useState } from 'react';
import { logError } from '../utils/errors';

const PREFIX = 'colossus:ui:';

// Lee un valor guardado; si falta, está corrupto o no pasa la validación, devuelve el inicial.
export const readPersisted = (key, initialValue, isValid = () => true) => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return initialValue;
    const parsed = JSON.parse(raw);
    return isValid(parsed) ? parsed : initialValue;
  } catch {
    return initialValue;
  }
};

export const writePersisted = (key, value) => {
  try {
    if (value === undefined) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (storageError) {
    // Modo privado o cuota llena: la app sigue funcionando, solo no recuerda la preferencia.
    logError(`ui-state:${key}`, storageError);
  }
};

/**
 * useState que se recuerda en este dispositivo (localStorage): paneles plegados, filtros, posición en listas.
 * `isValid` descarta valores viejos con otra forma (por ejemplo, después de una actualización).
 */
export const usePersistentState = (key, initialValue, isValid) => {
  const [value, setValue] = useState(() => readPersisted(key, initialValue, isValid));
  const setPersisted = useCallback((next) => {
    setValue((previous) => {
      const resolved = typeof next === 'function' ? next(previous) : next;
      writePersisted(key, resolved);
      return resolved;
    });
  }, [key]);
  return [value, setPersisted];
};
