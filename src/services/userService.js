import { arrayUnion, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS } from '../constants/collections';
import { subscribeToDocsByIds } from './firestoreQueries';
import { sanitizeBodyStats, sanitizeGender, sanitizeUsername } from './validation';

// Separación público/privado: el código original escuchaba TODA la colección 'users',
// que incluía emails → cualquier usuario podía ver el correo de todos.

export const subscribeToProfile = (uid, onData, onError) =>
  onSnapshot(
    doc(db, COLLECTIONS.PROFILES, uid),
    (snapshot) => onData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null),
    onError,
  );

export const subscribeToAccount = (uid, onData, onError) =>
  onSnapshot(
    doc(db, COLLECTIONS.USERS, uid),
    (snapshot) => onData(snapshot.exists() ? snapshot.data() : null),
    onError,
  );

/*
 * Perfiles públicos SOLO de los ids pedidos (tú + integrantes de tus grupos).
 * Antes se escuchaba la colección completa: cada apertura costaba 1 lectura por usuario registrado en la app.
 */
export const subscribeToProfiles = (ids, onData, onError) =>
  subscribeToDocsByIds(COLLECTIONS.PROFILES, ids, (profileDoc) => ({ id: profileDoc.id, ...profileDoc.data() }), onData, onError);

// Idempotente: crea perfil público y cuenta privada solo si no existen.
export const ensureUserDocuments = async ({ uid, email, username, gender }) => {
  const cleanUsername = sanitizeUsername(username);
  const cleanGender = sanitizeGender(gender);
  const profileRef = doc(db, COLLECTIONS.PROFILES, uid);
  const accountRef = doc(db, COLLECTIONS.USERS, uid);

  const [profileSnapshot, accountSnapshot] = await Promise.all([getDoc(profileRef), getDoc(accountRef)]);
  const writes = [];

  if (!profileSnapshot.exists()) {
    writes.push(
      setDoc(profileRef, {
        username: cleanUsername,
        usernameLower: cleanUsername.toLowerCase(),
        gender: cleanGender,
        createdAt: serverTimestamp(),
      }),
    );
  }
  if (!accountSnapshot.exists()) {
    writes.push(setDoc(accountRef, { email: email ?? null, activeRoutineId: null, createdAt: serverTimestamp() }));
  }
  await Promise.all(writes);
};

export const updateProfileData = async (uid, { username, gender }) => {
  const cleanUsername = sanitizeUsername(username);
  await setDoc(
    doc(db, COLLECTIONS.PROFILES, uid),
    { username: cleanUsername, usernameLower: cleanUsername.toLowerCase(), gender: sanitizeGender(gender) },
    { merge: true },
  );
};

export const syncAccountEmail = async (uid, email) => {
  await setDoc(doc(db, COLLECTIONS.USERS, uid), { email: email ?? null }, { merge: true });
};

// Preferencias privadas (colores personalizados): viven en users/{uid} y se sincronizan entre dispositivos.
export const savePreferences = async (uid, preferences) => {
  // updateDoc reemplaza el mapa completo (setDoc+merge haría merge profundo y "resetear" no borraría colores).
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), { preferences, preferencesUpdatedAt: serverTimestamp() });
};

export const setActiveRoutine = async (uid, routineId) => {
  await setDoc(doc(db, COLLECTIONS.USERS, uid), { activeRoutineId: routineId ?? null }, { merge: true });
};

// Datos corporales (privados): viven en users/{uid}, que solo puede leer y escribir su dueño.
export const saveBodyStats = async (uid, stats) => {
  const clean = sanitizeBodyStats(stats);
  await setDoc(doc(db, COLLECTIONS.USERS, uid), { bodyStats: { ...clean, updatedAt: serverTimestamp() } }, { merge: true });
  return clean;
};

/*
 * Lista de amigos (users/{uid}.friendIds): personas con las que compartes al menos un grupo.
 * Las reglas de Firestore la usan para decidir qué perfiles, récords y registros puedes leer.
 *  - Quitar ids: siempre permitido (una sola escritura).
 *  - Agregar: de a UNO por escritura e indicando el grupo que lo justifica (`viaGroup`); las reglas verifican que
 *    ambos estén en ese grupo. Así nadie puede agregarse a cualquier persona.
 */
export const setFriendList = async (uid, friendIds) => {
  await setDoc(doc(db, COLLECTIONS.USERS, uid), { friendIds }, { merge: true });
};

export const addFriend = async (uid, friendId, groupId) => {
  await setDoc(doc(db, COLLECTIONS.USERS, uid), { friendIds: arrayUnion(friendId), viaGroup: groupId }, { merge: true });
};
