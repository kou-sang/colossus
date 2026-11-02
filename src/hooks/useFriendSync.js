import { useEffect, useRef } from 'react';
import { addFriend, setFriendList } from '../services/userService';
import { logError } from '../utils/errors';

/*
 * Mantiene users/{uid}.friendIds igual a "integrantes de mis grupos" (sin incluirme).
 * Corre al cargar los grupos y cada vez que cambian (alguien entra o sale). Las altas van de a una porque
 * las reglas solo aceptan sumar un amigo por escritura (verificado contra el grupo indicado).
 * Costo: solo escribe cuando hay diferencias; en el uso normal, 0 escrituras.
 */
export const useFriendSync = (user, groups, groupsLoading) => {
  const runningRef = useRef(false);
  const groupsKey = groups.map((group) => `${group.id}:${[...(group.memberIds ?? [])].sort().join(',')}`).sort().join('|');
  const currentKey = [...user.friendIds].sort().join(',');

  useEffect(() => {
    if (groupsLoading || runningRef.current) return;
    const groupOf = new Map(); // amigo → un grupo compartido (para `viaGroup`)
    groups.forEach((group) => (group.memberIds ?? []).forEach((memberId) => {
      if (memberId !== user.id && !groupOf.has(memberId)) groupOf.set(memberId, group.id);
    }));
    const current = new Set(user.friendIds);
    const toRemove = [...current].filter((id) => !groupOf.has(id));
    const toAdd = [...groupOf.keys()].filter((id) => !current.has(id));
    if (toRemove.length === 0 && toAdd.length === 0) return;

    runningRef.current = true;
    (async () => {
      try {
        if (toRemove.length) await setFriendList(user.id, [...current].filter((id) => groupOf.has(id)));
        for (const friendId of toAdd) {
          // En serie a propósito: las reglas exigen una sola alta por escritura.
          await addFriend(user.id, friendId, groupOf.get(friendId));
        }
      } catch (syncError) {
        logError('friends:sync', syncError);
      } finally {
        runningRef.current = false;
      }
    })();
    // groupsKey/currentKey resumen grupos y amigos: el efecto no se repite por cambios de identidad sin contenido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupsKey, currentKey, groupsLoading, user.id]);
};
