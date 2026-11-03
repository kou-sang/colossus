import { logError } from '../../../utils/errors';
import { createTimerState, TIMER_MODE_BY_ID, TIMER_MODES, TIMER_STATUS } from './timerEngine';

/*
 * Persistencia del reloj en el dispositivo: modo, tiempos de cada modo y el ESTADO en curso.
 * El estado son marcas de tiempo (no un contador), así que al recargar la página o volver a la app
 * el reloj sigue exactamente donde estaba, como si nunca se hubiera cerrado.
 */
const STORAGE_KEY = 'colossus:timer:v2';
const LEGACY_KEY = 'colossus:timer:v1'; // 4.3–4.4: solo modo y tiempos
const MAX_AGE_MS = 12 * 60 * 60 * 1000; // Un reloj olvidado más de 12 h se descarta

const isValidState = (state) =>
  state && typeof state === 'object' && Object.values(TIMER_STATUS).includes(state.status) && Number.isInteger(state.phaseIndex);

export const readTimerStore = () => {
  const defaults = Object.fromEntries(TIMER_MODES.map((mode) => [mode.id, { ...mode.defaults }]));
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY) ?? 'null') ?? {};
    const modeId = TIMER_MODE_BY_ID[stored.mode] ? stored.mode : 'classic';
    const configs = Object.fromEntries(TIMER_MODES.map((mode) => [mode.id, { ...defaults[mode.id], ...(stored.configs?.[mode.id] ?? {}) }]));
    const isFresh = stored.state?.startedAt && Date.now() - stored.state.startedAt < MAX_AGE_MS;
    const state = isValidState(stored.state) && isFresh ? stored.state : createTimerState();
    return { modeId, configs, state };
  } catch {
    return { modeId: 'classic', configs: defaults, state: createTimerState() };
  }
};

export const writeTimerStore = ({ modeId, configs, state }) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: modeId, configs, state }));
  } catch (storageError) {
    logError('timer:storage', storageError); // Modo privado: el reloj funciona, pero no sobrevive a una recarga
  }
};
