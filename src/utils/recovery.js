import { MUSCLE_IDS } from '../constants/muscles';
import { effortSetsOf, muscleCreditsOf } from './setCredits';

/*
 * Estado de recuperación de cada músculo (mapa de Recuperación). Reemplaza al mapa de fatiga de 4.8, que daba
 * músculos "recuperados" a personas agotadas por tres motivos que aquí se corrigen:
 *  1. Repartía cada serie entre todos los músculos (3 series de press = 1,2 series de pecho): la carga real
 *     quedaba diluida. Ahora se usan créditos de serie (directo = 1, sinergista = 0,5; ver setCredits.js).
 *  2. Vidas medias de 18–30 h: a las 48 h casi todo figuraba recuperado. La fuerza y el daño muscular tras una
 *     sesión exigente suelen tardar 48–72 h en normalizarse, más en músculos grandes y con trabajo excéntrico
 *     (Raastad 2004; Schoenfeld 2016; Pareja-Blanco 2017). Vidas medias actuales: 36 h grandes, 30 h medianos,
 *     24 h chicos.
 *  3. No contemplaba la acumulación: con mucho volumen en la semana (más de 20 series efectivas) la
 *     recuperación se hace más lenta. Ahora la vida media se estira con la carga de los últimos 7 días.
 * Es una estimación orientativa: no mide sueño, estrés ni dolor. Si te sientes cansado, prioriza cómo te sientes.
 */

const SIZE_PARAMS = Object.freeze({
  // capacity = series efectivas de una sesión exigente para ese músculo (100 % de fatiga).
  large: { halfLifeHours: 36, capacity: 6 },
  medium: { halfLifeHours: 30, capacity: 5 },
  small: { halfLifeHours: 24, capacity: 4 },
});

const MUSCLE_SIZE = Object.freeze({
  pecho_superior: 'large', pecho_medio: 'large', pecho_inferior: 'large',
  dorsal_ancho: 'large', trapecio_medio: 'large', lumbares: 'large',
  recto_femoral: 'large', vasto_lateral: 'large', vasto_medial: 'large',
  biceps_femoral: 'large', semitendinoso: 'large', aductores: 'large', gluteo_mayor: 'large',
  braquial: 'small', braquiorradial: 'small', antebrazo_flexores: 'small', antebrazo_extensores: 'small',
  manguito_rotador: 'small', serrato: 'small', redondo_mayor: 'small', tibial: 'small', soleo: 'small',
  mano_palma: 'small', mano_dedos: 'small', pie: 'small',
});

const paramsOf = (muscleId) => SIZE_PARAMS[MUSCLE_SIZE[muscleId] ?? 'medium'];

const HOUR_MS = 3_600_000;
// Ventana analizada: más allá de 10 días el aporte es despreciable incluso con la recuperación estirada.
export const RECOVERY_WINDOW_HOURS = 10 * 24;
// Carga semanal a partir de la cual la recuperación se hace más lenta (tope del rango de hipertrofia).
const WEEKLY_LOAD_THRESHOLD = 20;
const MAX_LOAD_STRETCH = 2;

export const RECOVERY_LEVELS = Object.freeze([
  { key: 'fresh', max: 20, label: 'Recuperado' },
  { key: 'light', max: 45, label: 'Recuperándose' },
  { key: 'moderate', max: 75, label: 'Fatigado' },
  { key: 'high', max: Infinity, label: 'Muy fatigado' },
]);

// "~10 h" o "~3 días" (a partir de 36 h se redondea a días).
export const formatRecoveryTime = (hours) => (hours >= 36 ? `~${Math.round(hours / 24)} días` : `~${Math.max(1, Math.round(hours))} h`);

export const classifyRecovery = (percent) => RECOVERY_LEVELS.find((level) => percent < level.max) ?? RECOVERY_LEVELS[RECOVERY_LEVELS.length - 1];

/**
 * { [músculo]: { percent (0–100 de fatiga), hoursToRecover, weeklyLoad } } en el momento `now`.
 * Con varios perfiles se promedia entre ellos.
 */
export const buildMuscleRecovery = (logs, { userIds, now = new Date() }) => {
  const userSet = new Set(userIds);
  const divisor = Math.max(1, userSet.size);
  const nowMs = now.getTime();
  const contributions = {}; // músculo → [{ ageHours, load }]
  const weeklyLoad = {};

  logs.forEach((log) => {
    if (!userSet.has(log.userId)) return;
    const ageHours = (nowMs - log.performedAt.getTime()) / HOUR_MS;
    if (ageHours < 0 || ageHours > RECOVERY_WINDOW_HOURS) return;
    const effortSets = effortSetsOf(log);
    Object.entries(muscleCreditsOf(log)).forEach(([muscleId, credit]) => {
      const load = effortSets * credit;
      if (load <= 0) return;
      (contributions[muscleId] ??= []).push({ ageHours, load });
      if (ageHours <= 7 * 24) weeklyLoad[muscleId] = (weeklyLoad[muscleId] ?? 0) + load;
    });
  });

  return Object.fromEntries(MUSCLE_IDS.map((muscleId) => {
    const { halfLifeHours, capacity } = paramsOf(muscleId);
    const load = (weeklyLoad[muscleId] ?? 0) / divisor;
    // Mucho volumen en la semana → la recuperación se estira (hasta el doble de tiempo).
    const stretch = Math.min(MAX_LOAD_STRETCH, 1 + Math.max(0, load - WEEKLY_LOAD_THRESHOLD) / WEEKLY_LOAD_THRESHOLD);
    const halfLife = halfLifeHours * stretch;
    const residual = (contributions[muscleId] ?? []).reduce((sum, item) => sum + item.load * 0.5 ** (item.ageHours / halfLife), 0) / divisor;
    const rawPercent = (residual / capacity) * 100;
    const percent = Math.min(100, Math.round(rawPercent));
    // Horas hasta bajar del umbral "Recuperado": t = vida media × log2(fatiga / umbral).
    const freshMax = RECOVERY_LEVELS[0].max;
    const hoursToRecover = rawPercent >= freshMax ? Math.ceil(halfLife * Math.log2(rawPercent / freshMax)) : 0;
    return [muscleId, { percent, hoursToRecover, weeklyLoad: Math.round(load * 10) / 10 }];
  }));
};
