import { COLLECTIONS } from '../constants/collections';
import { canonicalExerciseName } from '../constants/exercises';
import { toJsDate } from '../utils/dates';
import { subscribeToDocsByIds } from './firestoreQueries';

// 1 documento por usuario con su mejor marca por ejercicio.
const mapBestsDoc = (bestDoc) => {
  const data = bestDoc.data();
  // Unifica alias (nombres viejos) conservando la mejor marca por ejercicio canónico.
  const bests = {};
  Object.entries(data.bests ?? {}).forEach(([storedName, best]) => {
    if (!best) return;
    const exercise = canonicalExerciseName(storedName);
    const current = bests[exercise];
    if (!current || (best.e1rm ?? 0) > (current.e1rm ?? 0)) {
      bests[exercise] = { ...best, storedName, achievedAt: toJsDate(best.achievedAt) };
    }
  });
  return { userId: bestDoc.id, username: data.username ?? '', bests };
};

/*
 * Récords solo de los ids pedidos (tú + integrantes de tus grupos): el ranking de fuerza de un grupo
 * cuesta N lecturas (N = integrantes) y no crece con la cantidad total de usuarios de la app.
 */
export const subscribeToPersonalBests = (ids, onData, onError) =>
  subscribeToDocsByIds(
    COLLECTIONS.PERSONAL_BESTS,
    ids,
    mapBestsDoc,
    (list) => onData(Object.fromEntries(list.map((entry) => [entry.userId, entry]))),
    onError,
  );
