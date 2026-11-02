/*
 * Series detalladas y esfuerzo percibido (RIR). Funciones puras compartidas por validación, servicios y UI.
 *
 * Modelo (compatible hacia atrás): un registro puede traer `setDetails: [{ reps, weight, rir }]`.
 * Los campos de siempre (`sets`, `reps`, `weight`) se siguen guardando como resumen:
 *   sets = cantidad de series, reps/weight = la MEJOR serie (mayor 1RM estimado).
 * Así el ranking, los récords, los gráficos y los registros viejos funcionan sin cambios.
 *
 * RIR ("reps in reserve") = repeticiones que te quedaban antes del fallo (0 = fallo). Es la escala de
 * esfuerzo más usada en hipertrofia (Zourdos y col., 2016; Helms y col., 2016).
 */

export const MAX_SET_DETAILS = 30;
export const RIR_MAX = 10;

// Opciones de la UI: 4 agrupa "4 o más" (lejos del fallo; la precisión baja mucho a partir de ahí).
export const RIR_OPTIONS = Object.freeze([
  { value: 0, label: '0', hint: 'Fallo: no salía otra' },
  { value: 1, label: '1', hint: 'Quedaba 1 repetición' },
  { value: 2, label: '2', hint: 'Quedaban 2' },
  { value: 3, label: '3', hint: 'Quedaban 3' },
  { value: 4, label: '4+', hint: 'Quedaban 4 o más' },
]);

const MAX_RELIABLE_REPS = 12;
const round1 = (value) => Math.round(value * 10) / 10;

// Mismo Epley que utils/metrics (copiado para que este módulo no dependa del catálogo de ejercicios).
const e1rmOf = ({ weight, reps }) => {
  if (!Number.isFinite(weight) || weight <= 0) return null;
  if (!Number.isFinite(reps) || reps <= 1) return round1(weight);
  return round1(weight * (1 + Math.min(reps, MAX_RELIABLE_REPS) / 30));
};

const toNumberOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : NaN;
};

/**
 * Valida y limpia una lista de series. Devuelve { sets, error }: `sets` sin filas vacías, o `error` (texto).
 */
export const parseSetDetails = (rawSets) => {
  if (!Array.isArray(rawSets)) return { sets: [], error: null };
  const sets = [];
  for (let index = 0; index < rawSets.length; index += 1) {
    const raw = rawSets[index] ?? {};
    const reps = toNumberOrNull(raw.reps);
    const weight = toNumberOrNull(raw.weight);
    const rir = toNumberOrNull(raw.rir);
    if (reps === null && weight === null) continue; // Fila vacía: se descarta
    const label = `Serie ${index + 1}`;
    if (reps !== null && (!Number.isInteger(reps) || reps < 1 || reps > 100)) return { sets: [], error: `${label}: las repeticiones deben ser un entero entre 1 y 100.` };
    if (weight !== null && (Number.isNaN(weight) || weight < 0 || weight > 1000)) return { sets: [], error: `${label}: el peso debe estar entre 0 y 1000 kg.` };
    if (rir !== null && (!Number.isInteger(rir) || rir < 0 || rir > RIR_MAX)) return { sets: [], error: `${label}: el RIR debe ser un entero entre 0 y ${RIR_MAX}.` };
    sets.push({ reps, weight: weight === null ? null : Math.round(weight * 100) / 100, rir });
  }
  if (sets.length > MAX_SET_DETAILS) return { sets: [], error: `Máximo ${MAX_SET_DETAILS} series por registro.` };
  return { sets, error: null };
};

// Mejor serie: mayor 1RM estimado; sin peso, la de más repeticiones.
export const pickBestSet = (sets) =>
  sets.reduce((best, set) => {
    if (!best) return set;
    const [a, b] = [e1rmOf(set) ?? -1, e1rmOf(best) ?? -1];
    if (a !== b) return a > b ? set : best;
    return (set.reps ?? 0) > (best.reps ?? 0) ? set : best;
  }, null);

// RIR del registro = el de la serie más exigente (el menor): es el que mejor refleja la fatiga.
export const hardestRir = (sets) => {
  const values = sets.map((set) => set.rir).filter((value) => Number.isInteger(value));
  return values.length ? Math.min(...values) : null;
};

export const hasSetDetails = (log) => Array.isArray(log?.setDetails) && log.setDetails.length > 0;

/**
 * Tonelaje real de las series detalladas (Σ reps × kg). null si ninguna serie tiene ambos datos.
 */
export const setDetailsTonnage = (sets) => {
  let total = 0;
  let counted = false;
  sets.forEach(({ reps, weight }) => {
    if (Number.isFinite(reps) && reps > 0 && Number.isFinite(weight) && weight > 0) {
      total += reps * weight;
      counted = true;
    }
  });
  return counted ? total : null;
};

const formatNumber = (value) => String(value).replace('.', ',');

// "60×10 · 62,5×8 · 65×6" (con RIR: "65×6 @1").
export const formatSetDetails = (sets, { withRir = true } = {}) =>
  sets.map(({ reps, weight, rir }) => {
    const load = weight === null || weight === undefined ? 'PC' : formatNumber(weight); // PC = peso corporal
    const base = reps ? `${load}×${reps}` : `${load} kg`;
    return withRir && Number.isInteger(rir) ? `${base} @${rir}` : base;
  }).join(' · ');

/*
 * Factor de intensidad para la fatiga: una serie al fallo cansa más que una con 4 repeticiones en reserva.
 * Sin RIR registrado = 1 (el comportamiento de siempre).
 */
export const rirFatigueFactor = (rir) => {
  if (!Number.isInteger(rir)) return 1;
  if (rir <= 0) return 1.15;
  if (rir === 1) return 1.05;
  if (rir === 2) return 1;
  if (rir === 3) return 0.85;
  return 0.7;
};

/**
 * Sugerencia para la próxima sesión (doble progresión guiada por RIR):
 *  - RIR ≥ 3 con reps en el tope del rango → subir peso (~5%, redondeado a 2,5 kg; 1 kg si es liviano).
 *  - RIR ≥ 2 → +1 repetición (o subir peso si ya llegó al tope).
 *  - RIR 0–1 → repetir la carga; si además las reps cayeron, mantener y priorizar descanso.
 * Devuelve null si falta información (sin peso o sin repeticiones).
 */
export const suggestNextLoad = (log, { topReps = 12 } = {}) => {
  if (!log || !Number.isFinite(log.weight) || log.weight <= 0 || !Number.isFinite(log.reps)) return null;
  const rir = Number.isInteger(log.rir) ? log.rir : null;
  const step = log.weight >= 20 ? 2.5 : 1;
  const heavier = Math.round((log.weight * 1.05) / step) * step || log.weight + step;
  const nextWeight = Math.max(heavier, log.weight + step);
  if (rir === null) {
    return log.reps >= topReps
      ? { weight: nextWeight, reps: Math.max(6, log.reps - 4), text: `Llegaste a ${log.reps} reps: prueba ${formatNumber(nextWeight)} kg.` }
      : { weight: log.weight, reps: log.reps + 1, text: `Intenta ${log.reps + 1} reps con ${formatNumber(log.weight)} kg.` };
  }
  if (rir >= 3) {
    return { weight: nextWeight, reps: log.reps, text: `Te sobraban ${rir === 4 ? '4+' : rir} reps: sube a ${formatNumber(nextWeight)} kg.` };
  }
  if (rir === 2) {
    return log.reps >= topReps
      ? { weight: nextWeight, reps: Math.max(6, log.reps - 4), text: `${log.reps} reps con 2 en reserva: sube a ${formatNumber(nextWeight)} kg.` }
      : { weight: log.weight, reps: log.reps + 1, text: `Quedaban 2 reps: intenta ${log.reps + 1} con ${formatNumber(log.weight)} kg.` };
  }
  return { weight: log.weight, reps: log.reps, text: `Cerca del fallo: repite ${formatNumber(log.weight)} kg × ${log.reps} con mejor técnica.` };
};
