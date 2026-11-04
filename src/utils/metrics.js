import { getExerciseCategory, resolveMuscleDistribution } from '../constants/exercises';
import { hasSetDetails, setDetailsTonnage } from './sets';
import { addDays, diffInCalendarDays, startOfWeek, toDateKey, toWeekKey } from './dates';

// Funciones puras: sin React ni Firestore → testeables de forma aislada.

export const round1 = (value) => Math.round(value * 10) / 10;

// 1RM estimado (Epley). Permite comparar 80kg×5 contra 70kg×10 en una sola escala.
// Más allá de 12 reps la fórmula pierde precisión, por eso se recorta.
const MAX_RELIABLE_REPS = 12;

export const estimateOneRepMax = (weight, reps) => {
  if (!Number.isFinite(weight) || weight <= 0) return null;
  if (!Number.isFinite(reps) || reps <= 1) return round1(weight);
  const cappedReps = Math.min(reps, MAX_RELIABLE_REPS);
  return round1(weight * (1 + cappedReps / 30));
};

// Tonelaje = series × reps × peso. Con series detalladas se suma cada una (Σ reps × kg): la "mejor serie"
// repetida N veces sobreestimaba el volumen real. Null si falta algún dato (no se inventan valores).
export const computeTonnage = (log) => {
  if (hasSetDetails(log)) return setDetailsTonnage(log.setDetails);
  const { sets, reps, weight } = log;
  if (![sets, reps, weight].every((value) => Number.isFinite(value) && value > 0)) return null;
  return sets * reps * weight;
};

export const filterByUser = (logs, userId) => logs.filter((log) => log.userId === userId);

// Serie temporal de progresión de un usuario + ejercicio.
// unifyDays=true (por defecto): mejor 1RM estimado de cada día. unifyDays=false: un punto por registro, con su hora exacta.
export const buildStrengthSeries = (logs, userId, exercise, { unifyDays = true } = {}) => {
  const toPoint = (log) => ({
    time: log.performedAt.getTime(),
    e1rm: log.e1rm,
    weight: log.weight,
    reps: log.reps,
    isPr: Boolean(log.isPr),
  });
  const candidates = logs.filter((log) => log.userId === userId && log.exercise === exercise && log.e1rm);

  if (!unifyDays) return candidates.map(toPoint).sort((a, b) => a.time - b.time);

  const bestByDay = new Map();
  candidates.forEach((log) => {
    const dayKey = toDateKey(log.performedAt);
    const current = bestByDay.get(dayKey);
    if (!current || log.e1rm > current.e1rm) bestByDay.set(dayKey, toPoint(log));
  });
  return [...bestByDay.values()].sort((a, b) => a.time - b.time);
};

/**
 * Progresión de fuerza PROMEDIO de la selección (varios ejercicios en una sola línea).
 * Los kg de ejercicios distintos no se pueden promediar (100 kg de banca vs 20 kg de curl), así que cada
 * ejercicio se expresa como % de cambio sobre su primer 1RM estimado del rango y se promedian esos %.
 *  - Cada ejercicio conserva su último valor conocido: un día que solo entrenaste curl no "borra" la banca.
 *  - Con `muscleScope` (músculos elegidos en el filtro) cada ejercicio pesa según cuánto trabaja esos músculos.
 *  - unifyDays=true: un punto por día con el mejor 1RM de cada ejercicio; false: un punto por registro.
 * Devuelve [{ time, change (%), exercises (cuántos promedia), isPr }].
 */
export const buildStrengthIndexSeries = (logs, userId, { unifyDays = true, muscleScope = null } = {}) => {
  const scope = muscleScope ? new Set(muscleScope) : null;
  const weightOf = (log) => {
    if (!scope) return 1;
    return Object.entries(resolveMuscleDistribution(log)).reduce((sum, [muscleId, share]) => sum + (scope.has(muscleId) ? share : 0), 0);
  };
  const candidates = logs
    .filter((log) => log.userId === userId && log.e1rm > 0)
    .map((log) => ({ log, weight: weightOf(log) }))
    .filter(({ weight }) => weight > 0)
    .sort((a, b) => a.log.performedAt - b.log.performedAt);

  // Pasos: un día (mejor 1RM por ejercicio) o cada registro por separado.
  const steps = [];
  const stepIndex = new Map();
  candidates.forEach(({ log, weight }) => {
    const key = unifyDays ? toDateKey(log.performedAt) : `${log.id ?? ''}|${log.performedAt.getTime()}|${steps.length}`;
    let step = stepIndex.get(key);
    if (!step) {
      step = { time: 0, byExercise: new Map(), isPr: false };
      stepIndex.set(key, step);
      steps.push(step);
    }
    step.time = Math.max(step.time, log.performedAt.getTime());
    step.isPr ||= Boolean(log.isPr);
    const current = step.byExercise.get(log.exercise);
    if (!current || log.e1rm > current.e1rm) step.byExercise.set(log.exercise, { e1rm: log.e1rm, weight });
  });

  const baseline = new Map();
  const latest = new Map();
  return steps.map((step) => {
    step.byExercise.forEach(({ e1rm, weight }, exercise) => {
      if (!baseline.has(exercise)) baseline.set(exercise, e1rm);
      latest.set(exercise, { ratio: e1rm / baseline.get(exercise), weight });
    });
    let weighted = 0;
    let totalWeight = 0;
    latest.forEach(({ ratio, weight }) => {
      weighted += ratio * weight;
      totalWeight += weight;
    });
    return { time: step.time, change: round1((weighted / totalWeight - 1) * 100), exercises: latest.size, isPr: step.isPr };
  });
};

/**
 * Consistencia de un usuario: ejercicios acumulados a lo largo del tiempo (cada registro = 1 ejercicio).
 * Una pendiente alta es constancia; una línea plana, días sin entrenar. Marca los momentos con mejora de PR.
 *  - unifyDays=true: un punto por día (hora del último ejercicio de ese día).
 *  - unifyDays=false: un punto por ejercicio, con su hora exacta.
 * Los logs ya vienen filtrados por rango, categoría y músculo.
 */
export const buildConsistencySeries = (logs, userId, { unifyDays = true } = {}) => {
  const userLogs = logs.filter((log) => log.userId === userId).sort((a, b) => a.performedAt - b.performedAt);
  const points = [];
  let total = 0;

  if (unifyDays) {
    const byDay = new Map();
    userLogs.forEach((log) => {
      const dayKey = toDateKey(log.performedAt);
      const day = byDay.get(dayKey) ?? { dayKey, time: 0, count: 0, sets: 0, hasPr: false, prExercises: [] };
      day.count += 1;
      day.sets += Number.isFinite(log.sets) ? log.sets : 0;
      day.time = Math.max(day.time, log.performedAt.getTime());
      if (log.isPr) {
        day.hasPr = true;
        day.prExercises.push(log.exercise);
      }
      byDay.set(dayKey, day);
    });
    [...byDay.values()].sort((a, b) => a.time - b.time).forEach((day) => {
      total += day.count;
      points.push({ ...day, total });
    });
  } else {
    userLogs.forEach((log) => {
      total += 1;
      points.push({
        dayKey: toDateKey(log.performedAt),
        time: log.performedAt.getTime(),
        count: 1,
        sets: Number.isFinite(log.sets) ? log.sets : 0,
        hasPr: Boolean(log.isPr),
        prExercises: log.isPr ? [log.exercise] : [],
        exercise: log.exercise,
        total,
      });
    });
  }

  return {
    points,
    total,
    trainingDays: new Set(userLogs.map((log) => toDateKey(log.performedAt))).size,
    prCount: userLogs.filter((log) => log.isPr).length,
  };
};

// Tonelaje semanal por usuario. Devuelve filas { weekKey, [userId]: kg } listas para Recharts.
export const buildWeeklyTonnage = (logs, userIds, since, now = new Date()) => {
  const rows = new Map();
  for (let cursor = startOfWeek(since); cursor <= now; cursor = addDays(cursor, 7)) {
    const weekKey = toDateKey(cursor);
    rows.set(weekKey, { weekKey, time: cursor.getTime(), ...Object.fromEntries(userIds.map((id) => [id, 0])) });
  }
  logs.forEach((log) => {
    if (!userIds.includes(log.userId)) return;
    const row = rows.get(toWeekKey(log.performedAt));
    const tonnage = computeTonnage(log);
    if (row && tonnage) row[log.userId] += tonnage;
  });
  return [...rows.values()];
};

// Umbral de participación para considerar que un ejercicio "estimuló" un músculo (recuperación/abandono).
const MIN_SHARE_FOR_STIMULUS = 0.15;
// Músculos chicos de manos y pies: rara vez superan el 15 % de un ejercicio, aunque el ejercicio sí los trabaje.
const ACCESSORY_STIMULUS_SHARE = Object.freeze({ mano_palma: 0.05, mano_dedos: 0.05, pie: 0.05 });
export const stimulusThreshold = (muscleId) => ACCESSORY_STIMULUS_SHARE[muscleId] ?? MIN_SHARE_FOR_STIMULUS;

/**
 * Filtro central de analíticas. Se aplica en memoria (sin lecturas extra a Firestore).
 * `categories`/`muscles` = null significa "todos".
 */
/*
 * `categories` y `muscles` se combinan con Y (compatibilidad). `scope` es el filtro unificado de Analíticas:
 * { categories, muscles } con O lógico → pasa si el ejercicio es de una categoría elegida o trabaja algún músculo elegido.
 */
export const filterLogs = (logs, { userIds = null, categories = null, muscles = null, scope = null, since = null, until = null } = {}) => {
  const userSet = userIds ? new Set(userIds) : null;
  const categorySet = categories ? new Set(categories) : null;
  const muscleSet = muscles ? new Set(muscles) : null;
  const scopeCategories = scope ? new Set(scope.categories ?? []) : null;
  const scopeMuscles = scope ? new Set(scope.muscles ?? []) : null;
  return logs.filter((log) => {
    if (userSet && !userSet.has(log.userId)) return false;
    if (since && log.performedAt < since) return false;
    if (until && log.performedAt > until) return false;
    if (categorySet && !categorySet.has(getExerciseCategory(log))) return false;
    if (muscleSet && !Object.keys(resolveMuscleDistribution(log)).some((muscleId) => muscleSet.has(muscleId))) return false;
    if (scope && !scopeCategories.has(getExerciseCategory(log)) && !Object.keys(resolveMuscleDistribution(log)).some((muscleId) => scopeMuscles.has(muscleId))) return false;
    return true;
  });
};

// Series efectivas = series × participación del músculo (Face Pull 3 series → 1.2 en deltoides posterior).
const forEachMuscleShare = (log, muscleSet, callback) => {
  const sets = Number.isFinite(log.sets) ? log.sets : 0;
  Object.entries(resolveMuscleDistribution(log)).forEach(([muscleId, share]) => {
    if (muscleSet && !muscleSet.has(muscleId)) return;
    callback(muscleId, sets * share, share);
  });
};

export const buildEffectiveSetsByMuscle = (logs, { userIds = null, muscles = null } = {}) => {
  const userSet = userIds ? new Set(userIds) : null;
  const muscleSet = muscles ? new Set(muscles) : null;
  const totals = {};
  logs.forEach((log) => {
    if (userSet && !userSet.has(log.userId)) return;
    forEachMuscleShare(log, muscleSet, (muscleId, effectiveSets) => {
      totals[muscleId] = (totals[muscleId] ?? 0) + effectiveSets;
    });
  });
  return totals;
};

// Compatibilidad: series efectivas por músculo en los últimos N días para un usuario.
export const buildSetsByMuscle = (logs, userId, days = 7, now = new Date()) => {
  const since = addDays(now, -(days - 1));
  return buildEffectiveSetsByMuscle(logs.filter((log) => log.performedAt >= since), { userIds: [userId] });
};

// Serie semanal de series efectivas de un músculo por usuario (gráfico generado al hacer click).
export const buildWeeklyMuscleSeries = (logs, muscleId, userIds, since, now = new Date()) => {
  const rows = new Map();
  for (let cursor = startOfWeek(since); cursor <= now; cursor = addDays(cursor, 7)) {
    rows.set(toDateKey(cursor), { weekKey: toDateKey(cursor), time: cursor.getTime(), ...Object.fromEntries(userIds.map((id) => [id, 0])) });
  }
  const muscleSet = new Set([muscleId]);
  logs.forEach((log) => {
    if (!userIds.includes(log.userId)) return;
    const row = rows.get(toWeekKey(log.performedAt));
    if (!row) return;
    forEachMuscleShare(log, muscleSet, (_, effectiveSets) => {
      row[log.userId] = round1(row[log.userId] + effectiveSets);
    });
  });
  return [...rows.values()];
};

// Qué ejercicios aportan a un músculo y con qué porcentaje del total.
export const buildExerciseContributions = (logs, muscleId, userIds = null) => {
  const userSet = userIds ? new Set(userIds) : null;
  const byExercise = {};
  let total = 0;
  logs.forEach((log) => {
    if (userSet && !userSet.has(log.userId)) return;
    forEachMuscleShare(log, new Set([muscleId]), (_, effectiveSets, share) => {
      const entry = (byExercise[log.exercise] ??= { exercise: log.exercise, effectiveSets: 0, share });
      entry.effectiveSets += effectiveSets;
      total += effectiveSets;
    });
  });
  return Object.values(byExercise)
    .map((entry) => ({ ...entry, effectiveSets: round1(entry.effectiveSets), ratio: total ? entry.effectiveSets / total : 0 }))
    .sort((a, b) => b.effectiveSets - a.effectiveSets);
};

/**
 * Historial de un músculo (detalle del mapa de Recuperación): cada registro que lo estimuló, del más reciente al
 * más viejo, con el % del ejercicio que recae en ese músculo y sus series efectivas. Mismo umbral que la recuperación.
 */
export const buildMuscleTimeline = (logs, muscleId, userIds = null, limit = 12) => {
  const userSet = userIds ? new Set(userIds) : null;
  const threshold = stimulusThreshold(muscleId);
  return logs
    .filter((log) => !userSet || userSet.has(log.userId))
    .map((log) => ({ log, share: resolveMuscleDistribution(log)[muscleId] ?? 0 }))
    .filter(({ share }) => share >= threshold)
    .sort((a, b) => b.log.performedAt - a.log.performedAt)
    .slice(0, limit)
    .map(({ log, share }) => ({
      id: log.id ?? `${log.userId}-${log.performedAt.getTime()}-${log.exercise}`,
      userId: log.userId,
      exercise: log.exercise,
      date: log.performedAt,
      share,
      effectiveSets: round1((Number.isFinite(log.sets) ? log.sets : 0) * share),
    }));
};

export const buildMuscleLastTrained = (logs, userId) => {
  const lastByMuscle = {};
  logs.forEach((log) => {
    if (userId && log.userId !== userId) return;
    Object.entries(resolveMuscleDistribution(log)).forEach(([muscle, share]) => {
      if (share < stimulusThreshold(muscle)) return;
      const previous = lastByMuscle[muscle];
      if (!previous || log.performedAt > previous.date) {
        lastByMuscle[muscle] = { date: log.performedAt, exercise: log.exercise };
      }
    });
  });
  return lastByMuscle;
};

/*
 * Escala de estímulo (series efectivas por semana) → nivel 0–5 del ramp verde.
 * Bins discretos (no gradiente continuo): se leen a simple vista y en la leyenda.
 * 10–20 series/semana es el rango orientativo de hipertrofia → niveles 4–5.
 */
export const STIMULUS_BINS = Object.freeze([
  { level: 0, min: 0, label: 'Sin estímulo' },
  { level: 1, min: 0.01, label: '< 3' },
  { level: 2, min: 3, label: '3–6' },
  { level: 3, min: 6, label: '6–10' },
  { level: 4, min: 10, label: '10–20' },
  { level: 5, min: 20, label: '20+' },
]);

export const classifyStimulus = (weeklySets) => {
  const value = Number.isFinite(weeklySets) ? weeklySets : 0;
  return [...STIMULUS_BINS].reverse().find((bin) => value >= bin.min) ?? STIMULUS_BINS[0];
};

// Días distintos entrenados (no cantidad de registros: evita premiar registrar de más).
export const countTrainingDays = (logs, userId, since) => {
  const days = new Set();
  logs.forEach((log) => {
    if (log.userId === userId && log.performedAt >= since) days.add(toDateKey(log.performedAt));
  });
  return days.size;
};

// Racha de semanas consecutivas con al menos un entrenamiento (la semana actual no rompe la racha).
export const computeWeekStreak = (logs, userId, now = new Date()) => {
  const trainedWeeks = new Set(filterByUser(logs, userId).map((log) => toWeekKey(log.performedAt)));
  let cursor = startOfWeek(now);
  if (!trainedWeeks.has(toDateKey(cursor))) cursor = addDays(cursor, -7);
  let streak = 0;
  while (trainedWeeks.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -7);
  }
  return streak;
};

export const countPlannedDays = (routine) =>
  routine ? Object.values(routine.days).filter((items) => items.length > 0).length : 0;

// Estado de recuperación/abandono por músculo. Bins discretos: un degradado continuo
// de hue no se distingue a simple vista ni con daltonismo.
export const RECENCY_STATUS = Object.freeze([
  { key: 'good', maxDays: 7, label: '≤ 7 días' },
  { key: 'warning', maxDays: 14, label: '8–14 días' },
  { key: 'serious', maxDays: 27, label: '15–27 días' },
  { key: 'critical', maxDays: Infinity, label: '28+ días / nunca' },
]);

export const classifyRecency = (lastDate, now = new Date()) => {
  if (!lastDate) return { ...RECENCY_STATUS[3], days: null };
  const days = diffInCalendarDays(now, lastDate);
  const status = RECENCY_STATUS.find(({ maxDays }) => days <= maxDays);
  return { ...status, days };
};
