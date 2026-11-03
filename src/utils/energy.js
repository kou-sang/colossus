import { getExerciseCategory } from '../constants/exercises';
import { toDateKey } from './dates';
import { hasSetDetails } from './sets';

/*
 * Gasto calórico y recomendaciones de alimentación (funciones puras).
 * - Calorías: kcal = MET × kg × horas (Compendium of Physical Activities, Ainsworth y col., 2011; actualización 2024).
 *   La duración se estima: fuerza ≈ 2,5 min por serie (trabajo + descanso); cardio, combate y movilidad usan las
 *   repeticiones como minutos (así se indica en la ficha de cada ejercicio).
 * - Metabolismo basal: Mifflin-St Jeor (1990), la ecuación más precisa en adultos sin datos de composición corporal.
 * - Proteína: 1,6–2,2 g/kg para ganar músculo (Morton y col., 2018); hasta 2,4 g/kg en déficit (Helms y col., 2014).
 * Todo es orientativo y no reemplaza a un profesional de la nutrición.
 */

export const DEFAULT_BODY_WEIGHT = 70;

// MET por ejercicio (los más comunes) y por categoría como respaldo.
const EXERCISE_METS = Object.freeze({
  RUNNING: 9.8, SPRINTS: 12, CINTA: 9, CAMINATA: 3.5, 'CAMINATA EN PENDIENTE': 6, CICLISMO: 7.5, 'BICICLETA FIJA': 7,
  NATACION: 7, ELIPTICO: 5, ESCALADORA: 9, 'REMO ERGOMETRO': 7, SOGA: 11, 'DOBLE SALTO DE SOGA': 12, 'ASSAULT BIKE': 10,
  YOGA: 2.5, PILATES: 3, BOXEO: 7.8, KICKBOXING: 10, 'ARTES MARCIALES': 10,
  'SKI ERG': 7.5, 'BICICLETA RECLINADA': 5.5, STEPPER: 7,
  BURPEES: 8, 'CIRCUITO FUNCIONAL': 8, 'BATTLE ROPES': 10, 'KETTLEBELL SWING': 9.8, 'EMPUJE DE TRINEO': 9, 'ARRASTRE DE TRINEO': 9,
  'SNATCH CON KETTLEBELL': 9.8, 'PASEO DEL CAMARERO': 5, 'HALO CON KETTLEBELL': 4, 'CAMINATA DE GUSANO': 4, 'SALTOS DE TOBILLO': 8,
  // Actividades retiradas del catálogo (4.6.0): se conservan para el historial.
  FUTBOL: 7, PADEL: 6, TENIS: 7.3, BASQUET: 6.5, VOLEY: 4, ESCALADA: 8, ZUMBA: 6.5, SAMBA: 6, SALSA: 5, CUMBIA: 5, REGGAETON: 5.5, AEROBICO: 7,
});
const CATEGORY_METS = Object.freeze({ CARDIO: 7, COMBATE: 8, MOVILIDAD: 2.8, FUNCIONAL: 8, CROSSFIT: 8, CORE: 3.8 });
const STRENGTH_MET = 5; // Entrenamiento con pesas, esfuerzo moderado-vigoroso (Compendium 02050–02054)
const MINUTES_PER_STRENGTH_SET = 2.5;
const TIMED_CATEGORIES = new Set(['CARDIO', 'COMBATE', 'MOVILIDAD']);
const DEFAULT_TIMED_MINUTES = 30;

// Minutos estimados de un registro (para calorías e hidratación).
export const estimateMinutes = (log) => {
  const category = getExerciseCategory(log);
  const sets = Number.isFinite(log.sets) && log.sets > 0 ? log.sets : 1;
  if (TIMED_CATEGORIES.has(category)) {
    // Series detalladas de cardio/deportes: cada fila trae sus minutos en "reps".
    if (hasSetDetails(log)) return log.setDetails.reduce((sum, set) => sum + (Number.isFinite(set.reps) ? set.reps : 0), 0) || DEFAULT_TIMED_MINUTES;
    return Number.isFinite(log.reps) && log.reps > 0 ? log.reps * sets : DEFAULT_TIMED_MINUTES * (sets > 1 ? 0.5 : 1) * sets;
  }
  return sets * (category === 'FUNCIONAL' || category === 'CROSSFIT' ? 2 : MINUTES_PER_STRENGTH_SET);
};

export const metOf = (log) => EXERCISE_METS[log.exercise] ?? CATEGORY_METS[getExerciseCategory(log)] ?? STRENGTH_MET;

export const estimateCalories = (log, bodyWeightKg = DEFAULT_BODY_WEIGHT) =>
  Math.round(metOf(log) * bodyWeightKg * (estimateMinutes(log) / 60));

/**
 * Resumen de gasto en un período: total, por día, por categoría y ejercicios que más gastaron.
 */
export const buildEnergyReport = (logs, { bodyWeightKg = DEFAULT_BODY_WEIGHT, since, until, days }) => {
  const byDay = new Map();
  const byCategory = {};
  const byExercise = {};
  let total = 0;
  let minutes = 0;
  logs.forEach((log) => {
    if (since && log.performedAt < since) return;
    if (until && log.performedAt > until) return;
    const kcal = estimateCalories(log, bodyWeightKg);
    const logMinutes = estimateMinutes(log);
    total += kcal;
    minutes += logMinutes;
    const dayKey = toDateKey(log.performedAt);
    byDay.set(dayKey, (byDay.get(dayKey) ?? 0) + kcal);
    const category = getExerciseCategory(log);
    byCategory[category] = (byCategory[category] ?? 0) + kcal;
    byExercise[log.exercise] = (byExercise[log.exercise] ?? 0) + kcal;
  });
  const activeDays = byDay.size;
  return {
    total,
    minutes: Math.round(minutes),
    activeDays,
    perActiveDay: activeDays ? Math.round(total / activeDays) : 0,
    perDay: days ? Math.round(total / days) : 0,
    byCategory: Object.entries(byCategory).map(([id, kcal]) => ({ id, kcal })).sort((a, b) => b.kcal - a.kcal),
    topExercises: Object.entries(byExercise).map(([exercise, kcal]) => ({ exercise, kcal })).sort((a, b) => b.kcal - a.kcal).slice(0, 5),
  };
};

// ───────── Alimentación ─────────

// Factor de actividad SIN contar el entrenamiento (que se suma aparte con lo registrado, para no contarlo dos veces).
export const ACTIVITY_LEVELS = Object.freeze([
  { value: 'sedentary', label: 'Sedentaria (oficina, < 5.000 pasos)', factor: 1.2 },
  { value: 'light', label: 'Ligera (5.000–7.500 pasos)', factor: 1.3 },
  { value: 'moderate', label: 'Moderada (7.500–10.000 pasos)', factor: 1.4 },
  { value: 'active', label: 'Alta (trabajo físico, > 10.000 pasos)', factor: 1.55 },
]);

export const GOALS = Object.freeze([
  { value: 'lose', label: 'Bajar grasa', adjust: -0.2, maxDeficit: 600, protein: [2.0, 2.4] },
  { value: 'maintain', label: 'Mantener', adjust: 0, protein: [1.6, 2.0] },
  { value: 'muscle', label: 'Ganar músculo', adjust: 0.1, maxSurplus: 350, protein: [1.6, 2.2] },
]);

export const computeBmr = ({ weightKg, heightCm, age, sex }) => {
  if (![weightKg, heightCm, age].every((value) => Number.isFinite(value) && value > 0)) return null;
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'femenino' ? -161 : 5));
};

/**
 * Objetivo diario de calorías y macronutrientes.
 * `trainingKcalPerDay` = promedio diario del gasto registrado (no del día puntual: la ingesta conviene estable).
 */
export const buildNutritionPlan = (stats, trainingKcalPerDay = 0, trainingMinutesPerDay = 0) => {
  const bmr = computeBmr(stats);
  if (!bmr) return null;
  const activity = ACTIVITY_LEVELS.find((level) => level.value === stats.activity) ?? ACTIVITY_LEVELS[1];
  const goal = GOALS.find((item) => item.value === stats.goal) ?? GOALS[1];
  const maintenance = Math.round(bmr * activity.factor + trainingKcalPerDay);
  let target = maintenance;
  if (goal.adjust < 0) target = maintenance - Math.min(goal.maxDeficit, Math.round(maintenance * -goal.adjust));
  if (goal.adjust > 0) target = maintenance + Math.min(goal.maxSurplus, Math.round(maintenance * goal.adjust));
  // Piso de seguridad: no recomendar por debajo del metabolismo basal.
  target = Math.max(target, bmr);

  const [proteinMin, proteinMax] = goal.protein;
  const proteinPerKg = (proteinMin + proteinMax) / 2;
  const protein = Math.round(stats.weightKg * proteinPerKg);
  const fat = Math.round(Math.max(stats.weightKg * 0.8, (target * 0.25) / 9));
  const carbs = Math.max(0, Math.round((target - protein * 4 - fat * 9) / 4));
  const waterMl = Math.round((stats.weightKg * 35 + trainingMinutesPerDay * 12) / 50) * 50;

  return {
    bmr,
    maintenance,
    target,
    goal,
    activity,
    macros: { protein, fat, carbs },
    proteinRange: [Math.round(stats.weightKg * proteinMin), Math.round(stats.weightKg * proteinMax)],
    proteinPerMeal: [Math.round(stats.weightKg * 0.3), Math.round(stats.weightKg * 0.4)],
    fiber: Math.round((target / 1000) * 14),
    waterMl,
  };
};
