import { resolveMuscleDistribution } from '../constants/exercises';
import { muscleCreditsOf } from './setCredits';
import { CATEGORY_LABELS, MUSCLE_BY_ID, MUSCLES } from '../constants/muscles';
import { WEEK_DAYS } from './dates';

/*
 * Análisis de una rutina semanal (función pura): cómo se reparten las series entre categorías y músculos,
 * qué músculos no se trabajan y desequilibrios típicos (empuje/tirón, cuádriceps/isquiotibiales).
 * Usa la misma "serie efectiva" que Analíticas: entera para los músculos principales, media para los sinergistas (utils/setCredits.js).
 */

// Categorías anatómicas (las de deporte/estilo no tienen músculos propios).
export const BODY_CATEGORIES = Object.freeze([...new Set(MUSCLES.map((muscle) => muscle.category))]);

// Un músculo se considera "trabajado" si al menos un ejercicio de la rutina lo estimula ≥ 15%
// (mismo umbral que el mapa de Recuperación). Por debajo solo recibe trabajo residual.
export const MIN_SHARE_TO_COUNT = 0.15;
// Rango orientativo de series efectivas semanales para hipertrofia (Schoenfeld y col., 2017; Israetel/RP).
export const WEEKLY_TARGET = Object.freeze({ min: 10, max: 20 });
// Músculos chicos que reciben mucho trabajo indirecto: no se exige el rango completo.
const SMALL_MUSCLES = new Set(['mano_palma', 'mano_dedos', 'pie', 'braquial', 'manguito_rotador', 'tibial', 'serrato', 'redondo_mayor', 'braquiorradial', 'antebrazo_extensores', 'antebrazo_flexores', 'soleo']);

// Músculos propios de manos y pies: casi siempre reciben trabajo indirecto; no se reportan como "sin trabajar".
const ACCESSORY_MUSCLES = new Set(['mano_palma', 'mano_dedos', 'pie']);

const PUSH = ['pecho_superior', 'pecho_medio', 'pecho_inferior', 'deltoides_anterior', 'triceps_largo', 'triceps_lateral'];
const PULL = ['dorsal_ancho', 'redondo_mayor', 'trapecio_medio', 'deltoides_posterior', 'biceps', 'braquial'];
const QUADS = ['recto_femoral', 'vasto_lateral', 'vasto_medial'];
const HAMSTRINGS = ['biceps_femoral', 'semitendinoso'];

const round1 = (value) => Math.round(value * 10) / 10;
const sumOf = (totals, ids) => ids.reduce((sum, id) => sum + (totals[id] ?? 0), 0);

export const analyzeRoutine = (routine) => {
  const byMuscleTotals = {};
  const maxShareByMuscle = {};
  let exerciseCount = 0;
  let totalSets = 0;
  const trainingDays = [];

  WEEK_DAYS.forEach((day) => {
    const items = routine?.days?.[day] ?? [];
    if (items.length) trainingDays.push(day);
    items.forEach((item) => {
      if (!item?.exercise) return;
      const sets = Number(item.sets) || 0;
      exerciseCount += 1;
      totalSets += sets;
      // Series efectivas con el mismo conteo que Analíticas (directo = 1, sinergista = 0,5): comparables con 10–20/semana.
      const credits = muscleCreditsOf(item);
      Object.entries(resolveMuscleDistribution(item)).forEach(([muscleId, share]) => {
        if (!MUSCLE_BY_ID[muscleId]) return;
        byMuscleTotals[muscleId] = (byMuscleTotals[muscleId] ?? 0) + sets * (credits[muscleId] ?? 0);
        maxShareByMuscle[muscleId] = Math.max(maxShareByMuscle[muscleId] ?? 0, share);
      });
    });
  });

  const effectiveTotal = Object.values(byMuscleTotals).reduce((sum, value) => sum + value, 0);
  const percentOf = (value) => (effectiveTotal ? Math.round((value / effectiveTotal) * 1000) / 10 : 0);

  const byMuscle = MUSCLES.map((muscle) => {
    const sets = byMuscleTotals[muscle.id] ?? 0;
    const isWorked = (maxShareByMuscle[muscle.id] ?? 0) >= MIN_SHARE_TO_COUNT;
    return { id: muscle.id, label: muscle.short, fullLabel: muscle.label, category: muscle.category, sets: round1(sets), percent: percentOf(sets), isWorked };
  }).sort((a, b) => b.sets - a.sets);

  const byCategory = BODY_CATEGORIES.map((categoryId) => {
    const sets = byMuscle.filter((muscle) => muscle.category === categoryId).reduce((sum, muscle) => sum + muscle.sets, 0);
    const isWorked = byMuscle.some((muscle) => muscle.category === categoryId && muscle.isWorked);
    return { id: categoryId, label: CATEGORY_LABELS[categoryId] ?? categoryId, sets: round1(sets), percent: percentOf(sets), isWorked };
  }).sort((a, b) => b.sets - a.sets);

  const untrained = byMuscle.filter((muscle) => !muscle.isWorked && !ACCESSORY_MUSCLES.has(muscle.id));
  const undertrained = byMuscle.filter((muscle) => muscle.isWorked && !SMALL_MUSCLES.has(muscle.id) && muscle.sets < WEEKLY_TARGET.min / 2);
  const overtrained = byMuscle.filter((muscle) => muscle.sets > WEEKLY_TARGET.max * 1.25);
  const untrainedCategories = byCategory.filter((category) => !category.isWorked);

  const pushSets = sumOf(byMuscleTotals, PUSH);
  const pullSets = sumOf(byMuscleTotals, PULL);
  const quadSets = sumOf(byMuscleTotals, QUADS);
  const hamSets = sumOf(byMuscleTotals, HAMSTRINGS);

  // Observaciones accionables (texto corto). Umbrales conservadores para no alarmar por poco.
  const insights = [];
  if (pushSets > 4 && pullSets > 0 && pushSets / pullSets > 1.4) {
    insights.push({ tone: 'warning', text: `Empujas ${round1(pushSets / pullSets)} veces más de lo que tiras: suma remos o face pulls para cuidar los hombros.` });
  } else if (pullSets > 4 && pushSets > 0 && pullSets / pushSets > 1.6) {
    insights.push({ tone: 'info', text: 'Hay bastante más tirón que empuje: está bien para corregir postura, pero no descuides el pecho.' });
  }
  if (quadSets > 4 && hamSets < quadSets * 0.5) {
    insights.push({ tone: 'warning', text: 'Los isquiotibiales reciben menos de la mitad que los cuádriceps: agrega un curl femoral o un peso muerto rumano.' });
  }
  if (trainingDays.length > 0 && trainingDays.length < 3) {
    insights.push({ tone: 'info', text: `Solo ${trainingDays.length} día(s) por semana: con 3 o más días cada músculo puede entrenarse 2 veces por semana.` });
  }
  if (overtrained.length) {
    insights.push({ tone: 'warning', text: `${overtrained.map((muscle) => muscle.label).join(', ')}: más de ${Math.round(WEEKLY_TARGET.max * 1.25)} series semanales, difícil de recuperar.` });
  }

  return {
    exerciseCount,
    totalSets,
    effectiveTotal: round1(effectiveTotal),
    trainingDays,
    byCategory,
    byMuscle,
    untrained,
    untrainedCategories,
    undertrained,
    overtrained,
    pushPull: { push: round1(pushSets), pull: round1(pullSets) },
    insights,
  };
};
