import { GENDERS } from '../constants/collections';
import { canonicalExerciseName } from '../constants/exercises';
import { LEGACY_MUSCLE_DISTRIBUTION, MUSCLE_IDS } from '../constants/muscles';
import { ValidationError } from '../utils/errors';
import { hardestRir, parseSetDetails, pickBestSet, RIR_MAX } from '../utils/sets';

// Unicode: el regex original /^[a-zA-Z]+$/ rechazaba "Ñandú", "José" o "Ana María".
const USERNAME_PATTERN = /^[\p{L}\p{N}_ ]{2,24}$/u;

export const sanitizeUsername = (rawUsername) => {
  const username = String(rawUsername ?? '').replace(/\s+/g, ' ').trim();
  if (!USERNAME_PATTERN.test(username)) {
    throw new ValidationError('El usuario debe tener 2–24 caracteres (letras, números, espacios o _).');
  }
  return username;
};

export const sanitizeGender = (gender) => {
  if (!GENDERS.includes(gender)) throw new ValidationError('Selecciona un sexo válido.');
  return gender;
};

export const sanitizePassword = (password) => {
  if (typeof password !== 'string' || password.length < 6) {
    throw new ValidationError('La contraseña debe tener al menos 6 caracteres.');
  }
  return password;
};

const parseOptionalNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : NaN;
};

// Valida una entrada de entrenamiento. Bug original: `if (pesoNum)` descartaba 0 kg,
// aceptaba negativos y no registraba reps → los "PR" comparaban pesos con reps distintas.
// Solo se aceptan ids de músculo conocidos (individuales o macro legados).
const sanitizeMuscleId = (muscle) =>
  typeof muscle === 'string' && (MUSCLE_IDS.includes(muscle) || LEGACY_MUSCLE_DISTRIBUTION[muscle]) ? muscle : null;

// Los alias se guardan con el nombre canónico → historial y ranking no se fragmentan.
// `setDetails` (opcional): series una por una; si viene, sets/reps/weight se derivan de ellas (mejor serie).
// `rir` (opcional): repeticiones en reserva del ejercicio (0–10); con series detalladas, el de la más exigente.
export const sanitizeLogEntry = ({ exercise, muscle, sets, reps, weight, rir, setDetails }) => {
  const name = canonicalExerciseName(exercise);
  if (!name || name.length > 60) throw new ValidationError('Nombre de ejercicio inválido.');

  const detail = parseSetDetails(setDetails);
  if (detail.error) throw new ValidationError(detail.error);
  if (detail.sets.length > 0) {
    const best = pickBestSet(detail.sets);
    const anyRir = detail.sets.some((set) => Number.isInteger(set.rir));
    const fallbackRir = parseOptionalNumber(rir);
    return {
      exercise: name,
      muscle: sanitizeMuscleId(muscle),
      sets: detail.sets.length,
      reps: best.reps,
      weight: best.weight,
      rir: anyRir ? hardestRir(detail.sets) : sanitizeRir(fallbackRir),
      setDetails: detail.sets,
    };
  }

  const parsedSets = parseOptionalNumber(sets) ?? 1;
  if (!Number.isInteger(parsedSets) || parsedSets < 1 || parsedSets > 30) {
    throw new ValidationError('Las series deben ser un entero entre 1 y 30.');
  }

  const parsedReps = parseOptionalNumber(reps);
  if (parsedReps !== null && (!Number.isInteger(parsedReps) || parsedReps < 1 || parsedReps > 100)) {
    throw new ValidationError('Las repeticiones deben ser un entero entre 1 y 100.');
  }

  const parsedWeight = parseOptionalNumber(weight);
  if (parsedWeight !== null && (Number.isNaN(parsedWeight) || parsedWeight < 0 || parsedWeight > 1000)) {
    throw new ValidationError('El peso debe estar entre 0 y 1000 kg.');
  }

  return {
    exercise: name,
    muscle: sanitizeMuscleId(muscle),
    sets: parsedSets,
    reps: parsedReps,
    weight: parsedWeight === null ? null : Math.round(parsedWeight * 100) / 100,
    rir: sanitizeRir(parseOptionalNumber(rir)),
  };
};

const sanitizeRir = (value) => {
  if (value === null) return null;
  if (!Number.isInteger(value) || value < 0 || value > RIR_MAX) throw new ValidationError(`El RIR debe ser un entero entre 0 y ${RIR_MAX}.`);
  return value;
};

export const ROUTINE_DEFAULTS = Object.freeze({ sets: 3, reps: '10' });

// Series, reps y kg son opcionales: vacío → valores por defecto (3 × 10) y kg sin especificar (null).
export const sanitizeRoutineItem = (item) => {
  const exercise = canonicalExerciseName(item.exercise);
  if (!exercise) return null; // Filas vacías se descartan silenciosamente

  const rawSets = String(item.sets ?? '').trim();
  const sets = rawSets === '' ? ROUTINE_DEFAULTS.sets : Number(rawSets);
  if (!Number.isInteger(sets) || sets < 1 || sets > 20) {
    throw new ValidationError(`"${exercise}": las series deben ser un entero entre 1 y 20.`);
  }

  const reps = String(item.reps ?? '').trim().slice(0, 12) || ROUTINE_DEFAULTS.reps;

  const weight = parseOptionalNumber(item.weight);
  if (weight !== null && (Number.isNaN(weight) || weight < 0 || weight > 1000)) {
    throw new ValidationError(`"${exercise}": el peso debe estar entre 0 y 1000 kg.`);
  }

  // El músculo ya no se elige a mano (se infiere); se conserva el de rutinas viejas para no perder historial.
  return {
    id: item.id,
    exercise,
    sets,
    reps,
    weight: weight === null ? null : Math.round(weight * 100) / 100,
    muscle: sanitizeMuscleId(item.muscle),
  };
};

// Extrae el primer número de un objetivo de reps ("8-12" → 8) para prellenar formularios.
export const parseTargetReps = (reps) => {
  const match = String(reps ?? '').match(/\d+/);
  return match ? Number(match[0]) : null;
};

// Datos corporales opcionales (privados, users/{uid}.bodyStats): solo para estimar calorías y alimentación.
const BODY_LIMITS = Object.freeze({ weightKg: [30, 300], heightCm: [120, 230], age: [13, 100] });
export const BODY_ACTIVITY_VALUES = Object.freeze(['sedentary', 'light', 'moderate', 'active']);
export const BODY_GOAL_VALUES = Object.freeze(['lose', 'maintain', 'muscle']);

export const sanitizeBodyStats = ({ weightKg, heightCm, age, activity, goal }) => {
  const parsed = { weightKg: parseOptionalNumber(weightKg), heightCm: parseOptionalNumber(heightCm), age: parseOptionalNumber(age) };
  Object.entries(BODY_LIMITS).forEach(([key, [min, max]]) => {
    const value = parsed[key];
    if (value === null || Number.isNaN(value) || value < min || value > max) {
      const labels = { weightKg: 'El peso', heightCm: 'La altura', age: 'La edad' };
      throw new ValidationError(`${labels[key]} debe estar entre ${min} y ${max}.`);
    }
  });
  return {
    weightKg: Math.round(parsed.weightKg * 10) / 10,
    heightCm: Math.round(parsed.heightCm),
    age: Math.round(parsed.age),
    activity: BODY_ACTIVITY_VALUES.includes(activity) ? activity : 'light',
    goal: BODY_GOAL_VALUES.includes(goal) ? goal : 'maintain',
  };
};
