/*
 * Motor del reloj de entrenamiento. Módulo puro (sin React): define los modos, arma la secuencia de fases
 * y calcula el estado a partir de marcas de tiempo (no de "ticks" acumulados), así un celular que suspende
 * la pestaña o un setInterval atrasado nunca desfasan el reloj.
 */

export const PHASE_KIND = Object.freeze({ PREP: 'prep', WORK: 'work', REST: 'rest' });

// Límites de los campos (segundos / rondas): evitan configuraciones absurdas o que cuelguen la UI.
const LIMITS = Object.freeze({
  prepSec: [0, 60],
  workSec: [0, 3600],
  restSec: [0, 900],
  rounds: [1, 99],
  totalMin: [1, 120],
  intervalSec: [10, 600],
  capMin: [0, 120],
});

/*
 * Modos disponibles. `fields` define qué se configura y `defaults` sus valores iniciales.
 * Los textos de `help` explican el formato a quien no lo conoce.
 */
export const TIMER_MODES = Object.freeze([
  {
    id: 'classic',
    label: 'Series + descanso',
    short: 'Series',
    help: 'Haz cada serie a tu ritmo (o con tiempo fijo) y el reloj cuenta el descanso entre series.',
    fields: ['rounds', 'workSec', 'restSec', 'prepSec'],
    defaults: { rounds: 3, workSec: 0, restSec: 90, prepSec: 5 },
  },
  {
    id: 'tabata',
    label: 'Tabata',
    short: 'Tabata',
    help: 'Protocolo clásico: 8 rondas de 20 s a máxima intensidad y 10 s de pausa (4 minutos).',
    fields: ['rounds', 'workSec', 'restSec', 'prepSec'],
    defaults: { rounds: 8, workSec: 20, restSec: 10, prepSec: 10 },
  },
  {
    id: 'emom',
    label: 'EMOM',
    short: 'EMOM',
    help: '"Every minute on the minute": al empezar cada minuto haces las repeticiones y descansas lo que sobra.',
    fields: ['rounds', 'intervalSec', 'prepSec'],
    defaults: { rounds: 10, intervalSec: 60, prepSec: 10 },
  },
  {
    id: 'amrap',
    label: 'AMRAP',
    short: 'AMRAP',
    help: '"As many rounds as possible": tantas rondas como puedas en el tiempo total. Suma cada ronda con el botón +1.',
    fields: ['totalMin', 'prepSec'],
    defaults: { totalMin: 10, prepSec: 10 },
  },
  {
    id: 'forTime',
    label: 'For Time',
    short: 'For Time',
    help: 'Cronómetro: completa el trabajo lo más rápido posible. El tope de tiempo es opcional (0 = sin tope).',
    fields: ['capMin', 'prepSec'],
    defaults: { capMin: 0, prepSec: 10 },
  },
  {
    id: 'intervals',
    label: 'Intervalos',
    short: 'Intervalos',
    help: 'Intervalos a medida (HIIT): elige el trabajo, la pausa y las rondas.',
    fields: ['rounds', 'workSec', 'restSec', 'prepSec'],
    defaults: { rounds: 6, workSec: 40, restSec: 20, prepSec: 10 },
  },
]);

export const TIMER_MODE_BY_ID = Object.freeze(Object.fromEntries(TIMER_MODES.map((mode) => [mode.id, mode])));

export const FIELD_LABELS = Object.freeze({
  rounds: { label: 'Rondas / series', unit: '' },
  workSec: { label: 'Trabajo', unit: 's', hint: '0 = a tu ritmo' },
  restSec: { label: 'Descanso', unit: 's' },
  prepSec: { label: 'Preparación', unit: 's' },
  totalMin: { label: 'Tiempo total', unit: 'min' },
  intervalSec: { label: 'Cada', unit: 's' },
  capMin: { label: 'Tope', unit: 'min', hint: '0 = sin tope' },
});

const clamp = (value, [min, max]) => Math.min(max, Math.max(min, value));

// Normaliza una configuración (de la UI o de localStorage): números enteros dentro de los límites.
export const sanitizeTimerConfig = (modeId, rawConfig = {}) => {
  const mode = TIMER_MODE_BY_ID[modeId] ?? TIMER_MODES[0];
  const config = {};
  mode.fields.forEach((field) => {
    const parsed = Math.round(Number(rawConfig[field]));
    config[field] = clamp(Number.isFinite(parsed) ? parsed : mode.defaults[field], LIMITS[field]);
  });
  return { mode: mode.id, ...config };
};

/**
 * Secuencia de fases de un modo. `duration` en ms; null = fase abierta (termina cuando la persona toca "Siguiente").
 * `countUp` indica que la fase se muestra como cronómetro (sube) en vez de cuenta regresiva.
 */
export const buildPhases = (config) => {
  const phases = [];
  const seconds = (value) => value * 1000;
  if (config.prepSec > 0) phases.push({ kind: PHASE_KIND.PREP, duration: seconds(config.prepSec), round: 0 });

  switch (config.mode) {
    case 'classic':
    case 'tabata':
    case 'intervals':
      for (let round = 1; round <= config.rounds; round += 1) {
        phases.push({ kind: PHASE_KIND.WORK, duration: config.workSec > 0 ? seconds(config.workSec) : null, countUp: config.workSec === 0, round });
        if (round < config.rounds && config.restSec > 0) phases.push({ kind: PHASE_KIND.REST, duration: seconds(config.restSec), round });
      }
      break;
    case 'emom':
      for (let round = 1; round <= config.rounds; round += 1) {
        phases.push({ kind: PHASE_KIND.WORK, duration: seconds(config.intervalSec), round });
      }
      break;
    case 'amrap':
      phases.push({ kind: PHASE_KIND.WORK, duration: seconds(config.totalMin * 60), round: 1 });
      break;
    case 'forTime':
      phases.push({ kind: PHASE_KIND.WORK, duration: config.capMin > 0 ? seconds(config.capMin * 60) : null, countUp: true, round: 1 });
      break;
    default:
      break;
  }
  const totalRounds = Math.max(1, ...phases.map((phase) => phase.round));
  return phases.map((phase) => ({ ...phase, totalRounds }));
};

// Duración total conocida (null si hay fases abiertas).
export const totalDuration = (phases) =>
  phases.every((phase) => phase.duration !== null) ? phases.reduce((sum, phase) => sum + phase.duration, 0) : null;

// ───────── Máquina de estados ─────────

export const TIMER_STATUS = Object.freeze({ IDLE: 'idle', RUNNING: 'running', PAUSED: 'paused', DONE: 'done' });

export const createTimerState = () => ({
  status: TIMER_STATUS.IDLE,
  phaseIndex: 0,
  phaseStartedAt: null, // marca de tiempo (ms) del inicio de la fase actual, corregida por las pausas
  pausedAt: null,
  startedAt: null,
  finishedAt: null,
  pausedTotal: 0,
  completedWork: 0, // fases de trabajo terminadas (series/rondas hechas)
  manualRounds: 0, // contador +1 de AMRAP / For Time
});

const elapsedInPhase = (state, now) => {
  if (state.phaseStartedAt === null) return 0;
  const reference = state.status === TIMER_STATUS.PAUSED ? state.pausedAt : now;
  return Math.max(0, reference - state.phaseStartedAt);
};

// Avanza a la fase siguiente. `carry` = ms que sobraron de la fase anterior (si el tick llegó tarde).
const advance = (state, phases, now, carry = 0) => {
  const finished = phases[state.phaseIndex];
  const completedWork = state.completedWork + (finished?.kind === PHASE_KIND.WORK ? 1 : 0);
  const nextIndex = state.phaseIndex + 1;
  if (nextIndex >= phases.length) {
    return { ...state, status: TIMER_STATUS.DONE, completedWork, finishedAt: now - carry, phaseIndex: phases.length - 1 };
  }
  return { ...state, phaseIndex: nextIndex, phaseStartedAt: now - carry, completedWork };
};

/**
 * Reducer del reloj. Las acciones llevan `now` (ms) para que el reducer sea puro y testeable.
 */
export const timerReducer = (state, action) => {
  const { phases, now } = action;
  switch (action.type) {
    case 'start':
      if (!phases.length) return state;
      return { ...createTimerState(), status: TIMER_STATUS.RUNNING, phaseStartedAt: now, startedAt: now };
    case 'pause':
      return state.status === TIMER_STATUS.RUNNING ? { ...state, status: TIMER_STATUS.PAUSED, pausedAt: now } : state;
    case 'resume': {
      if (state.status !== TIMER_STATUS.PAUSED) return state;
      const pausedFor = now - state.pausedAt;
      return { ...state, status: TIMER_STATUS.RUNNING, phaseStartedAt: state.phaseStartedAt + pausedFor, pausedAt: null, pausedTotal: state.pausedTotal + pausedFor };
    }
    case 'tick': {
      if (state.status !== TIMER_STATUS.RUNNING) return state;
      let next = state;
      // Bucle acotado: si la pestaña estuvo suspendida, puede haber que saltar varias fases cortas de golpe.
      for (let guard = 0; guard < phases.length + 1; guard += 1) {
        const phase = phases[next.phaseIndex];
        if (!phase || phase.duration === null) break;
        const elapsed = elapsedInPhase(next, now);
        if (elapsed < phase.duration) break;
        next = advance(next, phases, now, elapsed - phase.duration);
        if (next.status === TIMER_STATUS.DONE) break;
      }
      return next;
    }
    case 'next':
      if (state.status !== TIMER_STATUS.RUNNING && state.status !== TIMER_STATUS.PAUSED) return state;
      return advance({ ...state, status: TIMER_STATUS.RUNNING, pausedAt: null }, phases, now);
    case 'finish':
      // Terminar antes de tiempo: cuenta la fase de trabajo en curso si ya había empezado.
      if (state.status === TIMER_STATUS.IDLE || state.status === TIMER_STATUS.DONE) return state;
      return {
        ...state,
        status: TIMER_STATUS.DONE,
        finishedAt: state.status === TIMER_STATUS.PAUSED ? state.pausedAt : now,
        completedWork: state.completedWork + (phases[state.phaseIndex]?.kind === PHASE_KIND.WORK ? 1 : 0),
      };
    case 'addRound':
      return { ...state, manualRounds: Math.max(0, state.manualRounds + (action.delta ?? 1)) };
    case 'reset':
      return createTimerState();
    default:
      return state;
  }
};

/**
 * Vista derivada para la UI: fase actual, tiempo a mostrar y progreso 0–1.
 */
export const describeTimer = (state, phases, now) => {
  const phase = phases[state.phaseIndex] ?? null;
  const elapsed = state.status === TIMER_STATUS.IDLE ? 0 : elapsedInPhase(state, now);
  const remaining = phase?.duration ? Math.max(0, phase.duration - elapsed) : null;
  const showCountUp = !phase || phase.countUp || phase.duration === null;
  const displayMs = state.status === TIMER_STATUS.DONE
    ? (state.finishedAt ?? now) - (state.startedAt ?? now) - state.pausedTotal
    : showCountUp ? elapsed : remaining ?? 0;
  const totalElapsed = state.startedAt === null
    ? 0
    : (state.status === TIMER_STATUS.DONE ? state.finishedAt : state.status === TIMER_STATUS.PAUSED ? state.pausedAt : now) - state.startedAt - state.pausedTotal;
  return {
    phase,
    nextPhase: phases[state.phaseIndex + 1] ?? null,
    displayMs: Math.max(0, displayMs),
    remainingMs: remaining,
    progress: phase?.duration ? Math.min(1, elapsed / phase.duration) : null,
    totalElapsedMs: Math.max(0, totalElapsed),
  };
};

// mm:ss (o h:mm:ss). Cuenta regresiva redondea hacia arriba para que "0:01" no se muestre como "0:00".
export const formatClock = (ms, { ceil = false } = {}) => {
  const totalSeconds = Math.max(0, ceil ? Math.ceil(ms / 1000) : Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mmss = `${hours ? String(minutes).padStart(2, '0') : minutes}:${String(seconds).padStart(2, '0')}`;
  return hours ? `${hours}:${mmss}` : mmss;
};

export const phaseLabel = (phase, modeId) => {
  if (!phase) return '';
  if (phase.kind === PHASE_KIND.PREP) return 'Preparación';
  if (phase.kind === PHASE_KIND.REST) return modeId === 'classic' ? 'Descanso' : 'Pausa';
  switch (modeId) {
    case 'classic': return `Serie ${phase.round} de ${phase.totalRounds}`;
    case 'emom': return `Minuto ${phase.round} de ${phase.totalRounds}`;
    case 'amrap': return 'AMRAP en curso';
    case 'forTime': return 'For Time';
    default: return `Trabajo · ronda ${phase.round}/${phase.totalRounds}`;
  }
};
