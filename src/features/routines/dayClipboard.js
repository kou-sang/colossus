import { logError } from '../../utils/errors';

/*
 * Portapapeles de días de rutina (por dispositivo, en localStorage): copias el lunes de una rutina y lo pegas
 * en cualquier día de otra, incluso después de cerrar el editor o recargar. Solo se guardan los campos de
 * cada ejercicio (sin ids: al pegar se generan nuevos para no duplicar claves).
 */
const STORAGE_KEY = 'colossus:routine-day-clipboard:v1';
const MAX_ITEMS = 40;

export const readDayClipboard = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!parsed || !Array.isArray(parsed.items) || parsed.items.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const writeDayClipboard = ({ routineName, day, items }) => {
  const clean = items
    .filter((item) => String(item.exercise ?? '').trim())
    .slice(0, MAX_ITEMS)
    .map(({ exercise, sets, reps, weight, muscle }) => ({ exercise, sets: sets ?? '', reps: reps ?? '', weight: weight ?? '', muscle: muscle ?? null }));
  if (clean.length === 0) return null;
  const payload = { routineName: routineName || 'Rutina sin nombre', day, items: clean, copiedAt: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (storageError) {
    logError('routine:day-clipboard', storageError); // Modo privado: vive solo en memoria de esta pantalla
  }
  return payload;
};
