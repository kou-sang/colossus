import { toDateKey } from '../../utils/dates';
import { logError } from '../../utils/errors';

/*
 * Borradores de la pestaña Hoy (por dispositivo y por día): qué formulario estaba abierto y lo que ya escribiste.
 * Antes, salir a otra pestaña o abrir el reloj desmontaba el formulario y había que volver a cargar las series.
 * Se descartan solos al día siguiente.
 */
const STORAGE_KEY = 'colossus:today-drafts:v1';

const readAll = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return parsed?.dateKey === toDateKey() ? parsed : { dateKey: toDateKey(), panel: null, forms: {} };
  } catch {
    return { dateKey: toDateKey(), panel: null, forms: {} };
  }
};

const writeAll = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (storageError) {
    logError('today:drafts', storageError);
  }
};

export const readOpenPanel = () => readAll().panel;

export const writeOpenPanel = (panel) => {
  const data = readAll();
  writeAll({ ...data, panel: panel ? { key: panel.key, values: panel.values ?? null } : null });
};

export const readFormDraft = (key) => (key ? readAll().forms[key] ?? null : null);

export const writeFormDraft = (key, form) => {
  if (!key) return;
  const data = readAll();
  writeAll({ ...data, forms: { ...data.forms, [key]: form } });
};

export const clearFormDraft = (key) => {
  if (!key) return;
  const data = readAll();
  const forms = { ...data.forms };
  delete forms[key];
  writeAll({ ...data, forms });
};
