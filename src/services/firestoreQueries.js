import { collection, documentId, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { QUERY_LIMITS } from '../constants/collections';

const chunk = (items, size) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));

/**
 * Escucha solo los documentos con esos ids (operador 'in', máx. 30 por consulta → se parte en bloques).
 * Emite la lista combinada recién cuando todos los bloques respondieron al menos una vez (sin parpadeos de
 * "perfil sin nombre"). Costo: 1 lectura por documento pedido, no por documento de la colección.
 */
export const subscribeToDocsByIds = (collectionName, ids, mapDoc, onData, onError) => {
  const uniqueIds = [...new Set(ids)].filter(Boolean);
  if (uniqueIds.length === 0) {
    onData([]);
    return () => {};
  }
  const parts = chunk(uniqueIds, QUERY_LIMITS.MAX_USERS_PER_IN_QUERY);
  const results = new Array(parts.length).fill(null);
  const unsubscribers = parts.map((part, index) =>
    onSnapshot(
      query(collection(db, collectionName), where(documentId(), 'in', part)),
      (snapshot) => {
        results[index] = snapshot.docs.map(mapDoc);
        if (results.every(Boolean)) onData(results.flat());
      },
      onError,
    ),
  );
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};
