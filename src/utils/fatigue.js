import { resolveMuscleDistribution } from '../constants/exercises';
import { MUSCLE_IDS } from '../constants/muscles';
import { hasSetDetails, rirFatigueFactor } from './sets';

/*
 * Fatiga muscular estimada (función pura). Modelo simple y explicable:
 *  - Cada registro aporta "series efectivas" a cada músculo (series × % de participación).
 *  - Ese aporte se disipa exponencialmente con una vida media según el tamaño del músculo: los grandes
 *    (cuádriceps, glúteos, dorsales, pecho) tardan más en recuperarse que los chicos (antebrazos, gemelos).
 *    Referencias: la síntesis proteica y el rendimiento suelen normalizarse en 48–72 h tras una sesión dura
 *    (MacDougall 1995; Schoenfeld 2016), antes en músculos pequeños.
 *  - 100% = una sesión exigente completa para ese músculo (capacidad en series efectivas).
 *  - Si registraste el RIR, cada serie pesa según su esfuerzo (al fallo ×1,15 … 4+ en reserva ×0,7).
 * Es una estimación orientativa: no mide dolor ni sueño.
 */

const SIZE_PARAMS = Object.freeze({
  // Capacidad en series efectivas POR MÚSCULO individual (un cuádriceps se reparte en 3 cabezas: una sesión
  // de piernas exigente deja ~3–4 series efectivas en cada una).
  large: { halfLifeHours: 30, capacity: 4 },
  medium: { halfLifeHours: 24, capacity: 3.5 },
  small: { halfLifeHours: 18, capacity: 3 },
});

const MUSCLE_SIZE = Object.freeze({
  pecho_superior: 'large', pecho_medio: 'large', pecho_inferior: 'large',
  dorsal_ancho: 'large', trapecio_medio: 'large', lumbares: 'large',
  recto_femoral: 'large', vasto_lateral: 'large', vasto_medial: 'large',
  biceps_femoral: 'large', semitendinoso: 'large', aductores: 'large', gluteo_mayor: 'large',
  braquial: 'small', braquiorradial: 'small', antebrazo_flexores: 'small', antebrazo_extensores: 'small',
  manguito_rotador: 'small', serrato: 'small', redondo_mayor: 'small', tibial: 'small', gemelos: 'small',
});

const paramsOf = (muscleId) => SIZE_PARAMS[MUSCLE_SIZE[muscleId] ?? 'medium'];

// Más allá de esta ventana el aporte es despreciable (< 3% incluso en músculos grandes).
export const FATIGUE_WINDOW_HOURS = 7 * 24;

export const FATIGUE_LEVELS = Object.freeze([
  { key: 'fresh', max: 25, label: 'Recuperado' },
  { key: 'light', max: 50, label: 'Fatiga leve' },
  { key: 'moderate', max: 75, label: 'Fatiga moderada' },
  { key: 'high', max: Infinity, label: 'Fatiga alta' },
]);

export const classifyFatigue = (percent) => FATIGUE_LEVELS.find((level) => percent < level.max) ?? FATIGUE_LEVELS[3];

const HOUR_MS = 3_600_000;

/**
 * Devuelve { [muscleId]: { percent 0–100, hoursToRecover, lastExercise } } para el momento `now`.
 * `logs` puede incluir varios perfiles: se filtra por `userIds` y se promedia entre ellos.
 */
export const buildMuscleFatigue = (logs, { userIds, now = new Date() }) => {
  const userSet = new Set(userIds);
  const divisor = Math.max(1, userSet.size);
  const nowMs = now.getTime();
  const raw = {};
  const lastExercise = {};

  logs.forEach((log) => {
    if (!userSet.has(log.userId)) return;
    const ageHours = (nowMs - log.performedAt.getTime()) / HOUR_MS;
    if (ageHours < 0 || ageHours > FATIGUE_WINDOW_HOURS) return;
    // Series ponderadas por esfuerzo: con RIR por serie se pondera cada una; si no, el RIR del registro (o 1).
    const sets = hasSetDetails(log)
      ? log.setDetails.reduce((sum, set) => sum + rirFatigueFactor(Number.isInteger(set.rir) ? set.rir : log.rir), 0)
      : (Number.isFinite(log.sets) ? log.sets : 0) * rirFatigueFactor(log.rir);
    Object.entries(resolveMuscleDistribution(log)).forEach(([muscleId, share]) => {
      const { halfLifeHours, capacity } = paramsOf(muscleId);
      const remaining = (sets * share * 0.5 ** (ageHours / halfLifeHours)) / capacity;
      raw[muscleId] = (raw[muscleId] ?? 0) + remaining;
      if (share >= 0.15 && (!lastExercise[muscleId] || log.performedAt > lastExercise[muscleId].date)) {
        lastExercise[muscleId] = { exercise: log.exercise, date: log.performedAt };
      }
    });
  });

  return Object.fromEntries(MUSCLE_IDS.map((muscleId) => {
    const percent = Math.min(100, Math.round(((raw[muscleId] ?? 0) / divisor) * 100));
    const { halfLifeHours } = paramsOf(muscleId);
    // Horas hasta bajar del umbral "recuperado" (25%): t = vida media × log2(F / 25).
    const hoursToRecover = percent > FATIGUE_LEVELS[0].max ? Math.ceil(halfLifeHours * Math.log2(percent / FATIGUE_LEVELS[0].max)) : 0;
    return [muscleId, { percent, hoursToRecover, last: lastExercise[muscleId] ?? null }];
  }));
};
