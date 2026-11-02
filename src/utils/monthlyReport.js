import { getExerciseCategory } from '../constants/exercises';
import { estimateMinutes } from './energy';
import { addDays, toDateKey } from './dates';
import { buildEffectiveSetsByMuscle, computeTonnage, round1 } from './metrics';

/*
 * Resumen mensual (últimos 30 días contra los 30 anteriores) y recomendaciones automáticas.
 * Las reglas siguen principios de sobrecarga progresiva ampliamente aceptados:
 *  - Doble progresión: subir repeticiones dentro del rango y, al llegar al tope, subir el peso (~2,5–5%).
 *  - Volumen semanal orientativo de 10–20 series efectivas por músculo (Schoenfeld y col., 2017).
 *  - Frecuencia de 2 veces por semana por músculo como mínimo útil (Schoenfeld y col., 2016).
 *  - 150 min/semana de actividad aeróbica moderada (OMS, 2020).
 */

export const REPORT_DAYS = 30;
const WEEKS = REPORT_DAYS / 7;
const MIN_SESSIONS_FOR_TREND = 3;
const TOP_REP_RANGE = 12; // Al llegar a este número de repeticiones conviene subir el peso
const HIGH_REPS = 20;
const LOW_VOLUME_MAJOR = 6;
const HIGH_VOLUME = 22;
const CARDIO_TARGET_MIN_WEEK = 150;

const MAJOR_GROUPS = Object.freeze([
  { label: 'Pecho', muscles: ['pecho_superior', 'pecho_medio', 'pecho_inferior'], suggestions: ['PRESS BANCA CON MANCUERNAS', 'FONDOS PARA PECHO', 'CRUCE DE POLEAS'] },
  { label: 'Espalda (dorsales)', muscles: ['dorsal_ancho', 'redondo_mayor'], suggestions: ['JALON AL PECHO', 'REMO UNILATERAL', 'DOMINADAS'] },
  { label: 'Espalda media', muscles: ['trapecio_medio', 'deltoides_posterior'], suggestions: ['REMO BAJO', 'FACE PULL', 'VUELOS POSTERIORES'] },
  { label: 'Hombros', muscles: ['deltoides_anterior', 'deltoides_lateral'], suggestions: ['VUELOS LATERALES', 'PRESS DE HOMBROS CON MANCUERNAS'] },
  { label: 'Bíceps', muscles: ['biceps', 'braquial'], suggestions: ['CURL BICEPS INCLINADO', 'CURL MARTILLO'] },
  { label: 'Tríceps', muscles: ['triceps_largo', 'triceps_lateral'], suggestions: ['EXTENSION DE TRICEPS CON SOGA', 'PRESS FRANCES'] },
  { label: 'Cuádriceps', muscles: ['recto_femoral', 'vasto_lateral', 'vasto_medial'], suggestions: ['SENTADILLA', 'PRENSA 45', 'SILLON DE CUADRICEPS'] },
  { label: 'Isquiotibiales', muscles: ['biceps_femoral', 'semitendinoso'], suggestions: ['PESO MUERTO RUMANO', 'CURL FEMORAL SENTADO'] },
  { label: 'Glúteos', muscles: ['gluteo_mayor', 'gluteo_medio'], suggestions: ['HIP THRUST', 'SENTADILLA BULGARA'] },
  { label: 'Pantorrillas', muscles: ['gemelos', 'soleo'], suggestions: ['GEMELOS PARADO', 'SOLEO SENTADO'] },
]);
const CORE_MUSCLES = ['recto_abdominal', 'oblicuos'];
const CORE_SUGGESTIONS = ['PLANCHA', 'DEAD BUG', 'RUEDA ABDOMINAL', 'PALLOF PRESS'];

const summarize = (logs) => {
  const days = new Set(logs.map((log) => toDateKey(log.performedAt)));
  const cardioMinutes = logs
    .filter((log) => ['CARDIO', 'DEPORTES', 'BAILE', 'COMBATE'].includes(getExerciseCategory(log)))
    .reduce((sum, log) => sum + estimateMinutes(log), 0);
  const exerciseCounts = {};
  logs.forEach((log) => { exerciseCounts[log.exercise] = (exerciseCounts[log.exercise] ?? 0) + 1; });
  return {
    trainingDays: days.size,
    daysPerWeek: round1(days.size / WEEKS),
    exercises: logs.length,
    sets: logs.reduce((sum, log) => sum + (Number.isFinite(log.sets) ? log.sets : 0), 0),
    tonnage: Math.round(logs.reduce((sum, log) => sum + (computeTonnage(log) ?? 0), 0)),
    prs: logs.filter((log) => log.isPr).length,
    cardioMinutes: Math.round(cardioMinutes),
    topExercises: Object.entries(exerciseCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([exercise, count]) => ({ exercise, count })),
  };
};

const percentChange = (current, previous) => (previous > 0 ? Math.round(((current - previous) / previous) * 100) : null);

// Tendencia de un ejercicio con peso: mejor serie de cada día, primera mitad contra última sesión.
const buildExerciseTrends = (logs) => {
  const byExercise = {};
  logs.forEach((log) => {
    if (!log.e1rm) return;
    const dayKey = toDateKey(log.performedAt);
    const sessions = (byExercise[log.exercise] ??= new Map());
    const current = sessions.get(dayKey);
    if (!current || log.e1rm > current.e1rm) sessions.set(dayKey, log);
  });
  return Object.entries(byExercise)
    .map(([exercise, sessionMap]) => {
      const sessions = [...sessionMap.values()].sort((a, b) => a.performedAt - b.performedAt);
      if (sessions.length < 2) return null;
      const first = sessions[0];
      const last = sessions[sessions.length - 1];
      const bestE1rm = Math.max(...sessions.map((session) => session.e1rm));
      const change = percentChange(last.e1rm, first.e1rm) ?? 0;
      const sameLoad = sessions.slice(-MIN_SESSIONS_FOR_TREND).every((session) => session.weight === last.weight && session.reps === last.reps);
      let status = 'progress';
      if (change <= -5) status = 'regress';
      else if (change < 2 && (sameLoad || sessions.length >= MIN_SESSIONS_FOR_TREND)) status = 'plateau';
      return { exercise, sessions: sessions.length, first, last, bestE1rm, change, status, sameLoad };
    })
    .filter(Boolean)
    .sort((a, b) => b.sessions - a.sessions);
};

const groupSets = (weeklyByMuscle, muscles) => round1(muscles.reduce((sum, id) => sum + (weeklyByMuscle[id] ?? 0), 0) / muscles.length);

/**
 * Informe del último mes de un perfil. `logs` debe cubrir al menos 60 días para poder comparar.
 */
export const buildMonthlyReport = (logs, userId, now = new Date()) => {
  const end = now;
  const start = addDays(end, -REPORT_DAYS);
  const previousStart = addDays(start, -REPORT_DAYS);
  const userLogs = logs.filter((log) => log.userId === userId);
  const currentLogs = userLogs.filter((log) => log.performedAt >= start && log.performedAt <= end);
  const previousLogs = userLogs.filter((log) => log.performedAt >= previousStart && log.performedAt < start);

  const current = summarize(currentLogs);
  const previous = summarize(previousLogs);
  const totals = buildEffectiveSetsByMuscle(currentLogs);
  const weeklyByMuscle = Object.fromEntries(Object.entries(totals).map(([id, value]) => [id, value / WEEKS]));
  const trends = buildExerciseTrends(currentLogs);
  const recommendations = [];
  const add = (kind, title, detail, priority = 2) => recommendations.push({ kind, title, detail, priority });

  if (current.exercises === 0) {
    return { current, previous, deltas: {}, trends, groups: [], recommendations: [], start, end, isEmpty: true };
  }

  // ── Frecuencia ──
  if (current.daysPerWeek < 2.5) {
    add('days', 'Aumentar días de entrenamiento', `Entrenaste ${current.daysPerWeek} días por semana. Con 3–4 días cada músculo recibe 2 estímulos semanales, el mínimo que más se asocia al progreso.`, 1);
  } else if (current.daysPerWeek > 6) {
    add('rest', 'Agregar un día de descanso', `Entrenaste ${current.daysPerWeek} días por semana. Un día completo de descanso ayuda a recuperar articulaciones y sistema nervioso.`, 2);
  }

  // ── Volumen por grupo muscular ──
  const groups = MAJOR_GROUPS.map((group) => ({ ...group, weeklySets: groupSets(weeklyByMuscle, group.muscles) }));
  const lowGroups = groups.filter((group) => group.weeklySets < LOW_VOLUME_MAJOR).sort((a, b) => a.weeklySets - b.weeklySets);
  lowGroups.slice(0, 3).forEach((group) => {
    add('sets', `Aumentar series de ${group.label.toLowerCase()}`,
      `${group.weeklySets} series efectivas por semana (orientativo: 10–20). Suma 2–4 series semanales, por ejemplo con ${group.suggestions.slice(0, 2).join(' o ')}.`,
      group.weeklySets < 2 ? 1 : 2);
  });
  groups.filter((group) => group.weeklySets > HIGH_VOLUME).forEach((group) => {
    add('reduceSets', `Reducir series de ${group.label.toLowerCase()}`, `${group.weeklySets} series efectivas por semana: más de ${HIGH_VOLUME} suele costar recuperarse. Prueba quitar 3–4 series y subir la intensidad.`, 2);
  });

  // ── Core ──
  const coreSets = groupSets(weeklyByMuscle, CORE_MUSCLES);
  if (coreSets < 3) {
    add('core', 'Hacer ejercicios de abdomen', `Solo ${coreSets} series efectivas semanales de core. Dos o tres series de ${CORE_SUGGESTIONS.slice(0, 3).join(', ')} al final de 2 sesiones alcanzan.`, 2);
  }

  // ── Progresión de cargas (doble progresión) ──
  trends.filter((trend) => trend.status === 'plateau').slice(0, 3).forEach((trend) => {
    const { reps, weight, rir } = trend.last;
    if (Number.isInteger(rir) && rir >= 3) {
      add('intensity', `Acercarte más al fallo en ${trend.exercise}`, `Tus últimas series quedaron con ${rir >= 4 ? '4 o más' : rir} repeticiones en reserva: el estímulo es bajo. Termina las series a 1–2 RIR antes de cambiar el peso.`, 1);
    } else if (reps >= HIGH_REPS) {
      add('weight', `Subir kg y bajar repeticiones en ${trend.exercise}`, `Vienes haciendo ${reps} repeticiones con ${weight} kg: sube a ~${round1(weight * 1.1)} kg y trabaja en 8–12 repeticiones.`, 1);
    } else if (reps >= TOP_REP_RANGE) {
      add('weight', `Aumentar kilogramos en ${trend.exercise}`, `Llegaste a ${reps} repeticiones con ${weight} kg en varias sesiones: sube 2,5–5% (≈ ${round1(weight * 1.025)}–${round1(weight * 1.05)} kg) y vuelve a construir repeticiones.`, 1);
    } else {
      add('reps', `Aumentar repeticiones en ${trend.exercise}`, `Estancado en ${weight} kg × ${reps}. Antes de subir el peso, suma 1 repetición por serie cada semana hasta llegar a ${TOP_REP_RANGE}.`, 2);
    }
  });
  trends.filter((trend) => trend.status === 'regress').slice(0, 2).forEach((trend) => {
    add('deload', `Revisar fatiga en ${trend.exercise}`, `El 1RM estimado bajó ${Math.abs(trend.change)}% este mes. Puede ser cansancio acumulado: haz una semana más liviana (−40% de series) o revisa sueño y alimentación.`, 1);
  });

  // ── Esfuerzo (RIR) ──
  const rirValues = currentLogs.map((log) => log.rir).filter((value) => Number.isInteger(value));
  if (rirValues.length >= 6) {
    const averageRir = rirValues.reduce((sum, value) => sum + value, 0) / rirValues.length;
    if (averageRir >= 3.5) {
      add('intensity', 'Entrenar más cerca del fallo', `Tu RIR promedio fue ${round1(averageRir)}: la mayoría de las series de hipertrofia deberían terminar a 0–3 repeticiones del fallo.`, 1);
    } else if (averageRir <= 0.7) {
      add('recovery', 'Dejar alguna repetición en reserva', `Tu RIR promedio fue ${round1(averageRir)} (casi todo al fallo). Alterna con series a 1–2 RIR: progresas igual y te recuperas mejor.`, 2);
    }
  }

  // ── Cardio ──
  const cardioPerWeek = Math.round(current.cardioMinutes / WEEKS);
  if (cardioPerWeek < CARDIO_TARGET_MIN_WEEK) {
    add('cardio', 'Sumar actividad aeróbica', `${cardioPerWeek} min/semana registrados (la OMS recomienda 150 min de intensidad moderada). Caminata en pendiente o bicicleta 2–3 veces por semana completan lo que falta.`, 3);
  }

  // ── Equilibrio empuje / tirón ──
  const push = ['pecho_superior', 'pecho_medio', 'pecho_inferior', 'deltoides_anterior'].reduce((sum, id) => sum + (weeklyByMuscle[id] ?? 0), 0);
  const pull = ['dorsal_ancho', 'trapecio_medio', 'deltoides_posterior', 'redondo_mayor'].reduce((sum, id) => sum + (weeklyByMuscle[id] ?? 0), 0);
  if (push > 6 && pull > 0 && push / pull > 1.5) {
    add('balance', 'Equilibrar empuje y tirón', `Haces ${round1(push / pull)} veces más trabajo de pecho y hombro anterior que de espalda. Suma remos para proteger los hombros y la postura.`, 2);
  }

  // ── Sin récords ──
  if (current.prs === 0 && current.trainingDays >= 8) {
    add('overload', 'Buscar sobrecarga progresiva', 'Fuiste constante pero no hubo récords este mes. Anota la última serie de cada ejercicio e intenta superarla por 1 repetición o 2,5 kg.', 2);
  }

  const deltas = Object.fromEntries(['trainingDays', 'exercises', 'sets', 'tonnage', 'prs', 'cardioMinutes'].map((key) => [key, percentChange(current[key], previous[key])]));

  return {
    current,
    previous,
    deltas,
    trends,
    groups,
    coreSets,
    strongest: [...groups].sort((a, b) => b.weeklySets - a.weeklySets).slice(0, 3).map((group) => ({ label: group.label, weeklySets: group.weeklySets })),
    recommendations: recommendations.sort((a, b) => a.priority - b.priority),
    start,
    end,
    isEmpty: false,
  };
};
