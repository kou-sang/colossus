import { getExerciseCategory, resolveMuscleDistribution } from '../constants/exercises';
import { hasSetDetails, rirFatigueFactor } from './sets';

/*
 * Crédito de series por músculo (conteo fraccional, Pelland y cols. 2024; Schoenfeld y cols. 2017).
 * Antes cada serie se repartía entre todos los músculos según su % (3 series de press banca = 1,2 series de
 * pecho medio): la suma daba 1 serie por serie y ningún músculo llegaba nunca a las 10–20 series semanales de
 * referencia, que cuentan cada serie entera para el músculo que la hace. Ahora:
 *  - Músculo directo (≥ 50 % de lo que recibe el principal del ejercicio): la serie cuenta entera (1).
 *  - Sinergista claro (≥ 20 % del principal): media serie (0,5).
 *  - Participación menor: proporcional (hasta 0,5), así un estabilizador apenas suma.
 */
export const DIRECT_RATIO = 0.5;
export const SYNERGIST_RATIO = 0.2;
const SYNERGIST_CREDIT = 0.5;

const creditFor = (ratio) => {
  if (ratio >= DIRECT_RATIO) return 1;
  if (ratio >= SYNERGIST_RATIO) return SYNERGIST_CREDIT;
  return (ratio / SYNERGIST_RATIO) * SYNERGIST_CREDIT;
};

// Actividades de resistencia/técnica (correr, boxeo, yoga): reparten el trabajo en muchos músculos por igual y
// no son series de fuerza. Ningún músculo recibe más de media serie por cada "serie" registrada.
const ENDURANCE_CATEGORIES = new Set(['CARDIO', 'COMBATE', 'MOVILIDAD']);
const ENDURANCE_MAX_CREDIT = 0.5;

const creditCache = new Map();

// { músculo: crédito por serie } a partir de una distribución { músculo: % (0–1) }.
export const creditsFromDistribution = (distribution) => {
  const entries = Object.entries(distribution ?? {});
  const top = Math.max(0, ...entries.map(([, share]) => share));
  if (top <= 0) return {};
  return Object.fromEntries(entries.map(([muscleId, share]) => [muscleId, creditFor(share / top)]));
};

// Créditos por serie de un registro o ítem de rutina (cacheado por ejercicio/músculo: el cálculo es estable).
export const muscleCreditsOf = (item) => {
  const key = `${item?.exercise ?? ''}|${item?.muscle ?? ''}`;
  if (!creditCache.has(key)) {
    const credits = creditsFromDistribution(resolveMuscleDistribution(item));
    const isEndurance = ENDURANCE_CATEGORIES.has(getExerciseCategory(item));
    creditCache.set(key, isEndurance
      ? Object.fromEntries(Object.entries(credits).map(([muscleId, credit]) => [muscleId, Math.min(credit, ENDURANCE_MAX_CREDIT)]))
      : credits);
  }
  return creditCache.get(key);
};

// Series de un registro (con series detalladas, cada una cuenta).
export const setsOf = (log) => (Number.isFinite(log?.sets) ? log.sets : 0);

// Series ponderadas por esfuerzo (para la fatiga): al fallo cansa más que con 4 repeticiones en reserva.
export const effortSetsOf = (log) => (hasSetDetails(log)
  ? log.setDetails.reduce((sum, set) => sum + rirFatigueFactor(Number.isInteger(set.rir) ? set.rir : log.rir), 0)
  : setsOf(log) * rirFatigueFactor(log?.rir));
