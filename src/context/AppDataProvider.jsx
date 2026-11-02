import { useMemo } from 'react';
import { useFriendSync } from '../hooks/useFriendSync';
import { useSubscription } from '../hooks/useSubscription';
import { subscribeToMyGroups } from '../services/groupService';
import { subscribeToPersonalBests } from '../services/personalBestService';
import { subscribeToOwnRoutines } from '../services/routineService';
import { subscribeToProfiles } from '../services/userService';
import { AppDataContext } from './AppDataContext';

// Datos compartidos por varias pestañas. Elimina el prop drilling de prs/routines/usersDb/t/theme.

export const AppDataProvider = ({ user, children }) => {
  const routinesState = useSubscription(
    (onData, onError) => subscribeToOwnRoutines(user.id, onData, onError),
    [user.id],
    [],
  );
  const groupsState = useSubscription((onData, onError) => subscribeToMyGroups(user.id, onData, onError), [user.id], []);

  // Mantiene users/{uid}.friendIds sincronizado con los integrantes de tus grupos (lo exigen las reglas).
  useFriendSync(user, groupsState.data, groupsState.loading);

  /*
   * Personas visibles = tú + amigos YA confirmados en friendIds que siguen en tus grupos. Perfiles y récords se
   * piden solo para ellas (antes: colecciones completas). Usar friendIds (y no los grupos directamente) evita
   * pedir a alguien recién llegado antes de que las reglas lo permitan: un solo id no permitido rechaza la consulta.
   */
  const groupMemberSet = new Set(groupsState.data.flatMap((group) => group.memberIds ?? []));
  const peopleKey = groupsState.loading
    ? null
    : [...new Set([user.id, ...user.friendIds.filter((id) => groupMemberSet.has(id))])].sort().join('|');
  const profilesState = useSubscription(
    peopleKey ? (onData, onError) => subscribeToProfiles(peopleKey.split('|'), onData, onError) : null,
    [peopleKey],
    [],
  );
  const bestsState = useSubscription(
    peopleKey ? (onData, onError) => subscribeToPersonalBests(peopleKey.split('|'), onData, onError) : null,
    [peopleKey],
    {},
  );

  const visibleIds = useMemo(() => new Set(peopleKey ? peopleKey.split('|') : [user.id]), [peopleKey, user.id]);

  const value = useMemo(() => {
    const profilesById = Object.fromEntries(profilesState.data.map((profile) => [profile.id, profile]));
    const activeRoutine = routinesState.data.find((routine) => routine.id === user.activeRoutineId) ?? null;
    return {
      user,
      profiles: profilesState.data,
      profilesById,
      personalBests: bestsState.data,
      myBests: bestsState.data[user.id]?.bests ?? {},
      routines: routinesState.data,
      routinesLoading: routinesState.loading,
      activeRoutine,
      groups: groupsState.data,
      groupsLoading: groupsState.loading,
      groupsError: groupsState.error,
      // Ids que se pueden consultar (tú + amigos confirmados): filtran las consultas de registros por grupo.
      visibleIds,
    };
  }, [visibleIds, user, profilesState.data, bestsState.data, routinesState.data, routinesState.loading, groupsState.data, groupsState.loading, groupsState.error]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};
