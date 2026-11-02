import { CalendarDays, Check, CloudOff, Flame, Plus, Timer, Trophy, Undo2 } from 'lucide-react';
import { Suspense, useMemo, useState } from 'react';
import { EmptyState, IconButton, SectionCard, Spinner, StatTile } from '../../components/ui';
import { QUERY_LIMITS } from '../../constants/collections';
import { CATALOG_EXERCISE_NAMES, canonicalExerciseName } from '../../constants/exercises';
import { useAppData } from '../../context/AppDataContext';
import { useFeedback } from '../../context/FeedbackContext';
import { useSubscription } from '../../hooks/useSubscription';
import { useToday } from '../../hooks/useToday';
import { createWorkoutLog, deleteWorkoutLog, subscribeToLogs } from '../../services/logService';
import { parseTargetReps } from '../../services/validation';
import { playClick } from '../../utils/audio';
import { addDays, formatLongDate, formatShortDate, getDayKey, parseDateKey, startOfWeek, toDateKey } from '../../utils/dates';
import { logError, toUserMessage } from '../../utils/errors';
import { computeWeekStreak, countPlannedDays, countTrainingDays } from '../../utils/metrics';
import { LogEntryForm } from './LogEntryForm';
import { lazyWithPrefetch } from '../../utils/lazyWithPrefetch';

// El reloj (~15 KB) sale del bundle inicial: se descarga al tocar o pasar el puntero por "Hacer ahora" / "Reloj".
const WORKOUT_TIMER = lazyWithPrefetch(() => import('./timer/WorkoutTimer'), 'WorkoutTimer');
const WorkoutTimer = WORKOUT_TIMER.Component;
const prefetchTimer = () => WORKOUT_TIMER.prefetch();

const hasValue = (value) => value !== '' && value !== null && value !== undefined;

// Valores de la rutina para un ejercicio del plan (series, reps objetivo y kg si se cargaron).
const buildRoutineValues = (item) => {
  const routineWeight = hasValue(item.weight) ? Number(item.weight) : null;
  const values = {
    sets: item.sets ?? '',
    reps: parseTargetReps(item.reps) ?? '',
    weight: Number.isFinite(routineWeight) ? routineWeight : '',
  };
  const label = [`${item.sets} × ${item.reps || '—'}`, Number.isFinite(routineWeight) ? `${routineWeight} kg` : null].filter(Boolean).join(' · ');
  return { values, label };
};

/*
 * Valores con los que se prellena "Hecho" / "Hacer ahora": lo ÚLTIMO que registraste de ese ejercicio
 * (así se respeta tu progresión real); si nunca lo registraste, los valores de la rutina.
 */
const buildConfirmDefaults = (item, latestLog) => {
  const routine = buildRoutineValues(item).values;
  return {
    exercise: item.exercise,
    muscle: item.muscle,
    sets: latestLog?.sets ?? routine.sets,
    reps: latestLog?.reps ?? routine.reps,
    weight: latestLog ? latestLog.weight ?? '' : routine.weight,
    fallbackSets: item.sets || 3,
  };
};

const formatSetSummary = (log) => {
  if (!log) return null;
  const weight = log.weight !== null ? `${log.weight} kg` : 'sin peso';
  return log.reps ? `${weight} × ${log.reps}` : weight;
};

/*
 * Un ejercicio del plan del día. Dos acciones:
 *  - "Hacer ahora": abre el reloj con series/reps/kg editables para la serie actual.
 *  - "Hecho": pide confirmar series, reps y kg (prellenados con lo último que hiciste).
 */
const PlannedItem = ({ item, isDone, previousLog, latestLog, best, panel, onOpenConfirm, onOpenTimer, onSubmit, onCancel }) => {
  const routineValues = buildRoutineValues(item);
  const isConfirming = panel?.key === item.id;
  return (
    <li className={`py-3 first:pt-0 last:pb-0 ${isDone && !isConfirming ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1 basis-48">
          <h4 className="truncate font-bold">{item.exercise}</h4>
          <p className="text-sm text-secondary">
            {item.sets} series{item.reps && ` × ${item.reps} reps`}
            {hasValue(item.weight) && ` · ${item.weight} kg`}
          </p>
          {(previousLog || best) && (
            <p className="mt-0.5 text-xs text-muted">
              {previousLog && <>Última ({formatShortDate(previousLog.performedAt)}): {previousLog.sets} × {formatSetSummary(previousLog)}</>}
              {previousLog && best?.e1rm && ' · '}
              {best?.e1rm && <>Mejor 1RM est.: {best.e1rm} kg</>}
            </p>
          )}
        </div>
        {isDone ? (
          <span className="badge badge-good shrink-0"><Check size={14} aria-hidden /> Hecho</span>
        ) : (
          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" className="btn btn-ghost px-3" onClick={() => onOpenTimer(item)} onPointerEnter={prefetchTimer} onTouchStart={prefetchTimer} onFocus={prefetchTimer}>
              <Timer size={16} aria-hidden /> Hacer ahora
            </button>
            <button type="button" className="btn btn-outline px-3" aria-expanded={isConfirming} onClick={() => onOpenConfirm(item)}>
              <Check size={16} aria-hidden /> Hecho
            </button>
          </div>
        )}
      </div>
      {isConfirming && (
        <LogEntryForm
          key={panel.version}
          heading={panel.fromTimer ? 'Confirma lo que hiciste' : latestLog ? 'Confirma los valores (prellenados con tu última vez)' : 'Confirma los valores'}
          defaults={panel.values ?? buildConfirmDefaults(item, latestLog)}
          routineValues={routineValues}
          submitLabel="Confirmar"
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
    </li>
  );
};

export const TodayTab = ({ onCelebrate }) => {
  const { user, activeRoutine, myBests, routines } = useAppData();
  const { notify, confirm } = useFeedback();
  const todayKey = useToday();
  // Panel abierto: { key: id del ítem | 'free', values?, fromTimer?, version } (version fuerza remontar el formulario).
  const [panel, setPanel] = useState(null);
  // Reloj abierto: { item } para un ejercicio del plan o { item: null } como reloj libre.
  const [timerTarget, setTimerTarget] = useState(null);

  // 'since' depende solo del día → la suscripción no se recrea en cada render.
  const logsState = useSubscription(
    (onData, onError) =>
      subscribeToLogs({ since: addDays(parseDateKey(todayKey), -QUERY_LIMITS.TODAY_LOOKBACK_DAYS), userIds: [user.id] }, onData, onError),
    [user.id, todayKey],
    [],
  );
  const myLogs = logsState.data;

  const { todayLogs, previousLogByExercise, latestLogByExercise } = useMemo(() => {
    const today = [];
    const previous = {};
    const latest = {};
    // myLogs viene ordenado desc → el primero de cada ejercicio es el más reciente.
    myLogs.forEach((log) => {
      if (!latest[log.exercise]) latest[log.exercise] = log;
      if (toDateKey(log.performedAt) === todayKey) today.push(log);
      else if (!previous[log.exercise]) previous[log.exercise] = log;
    });
    return { todayLogs: today, previousLogByExercise: previous, latestLogByExercise: latest };
  }, [myLogs, todayKey]);

  // Memoizado: `?? []` creaba un array nuevo en cada render y anulaba el useMemo de `completion`.
  const plannedItems = useMemo(() => activeRoutine?.days[getDayKey(parseDateKey(todayKey))] ?? [], [activeRoutine, todayKey]);

  // Un ejercicio repetido en el día requiere tantos registros como apariciones.
  const completion = useMemo(() => {
    const remaining = {};
    todayLogs.forEach((log) => { remaining[log.exercise] = (remaining[log.exercise] ?? 0) + 1; });
    return plannedItems.map((item) => {
      const key = canonicalExerciseName(item.exercise);
      if (remaining[key] > 0) {
        remaining[key] -= 1;
        return true;
      }
      return false;
    });
  }, [plannedItems, todayLogs]);

  const doneCount = completion.filter(Boolean).length;
  const trainedDaysThisWeek = countTrainingDays(myLogs, user.id, startOfWeek(parseDateKey(todayKey)));
  const plannedDays = countPlannedDays(activeRoutine);
  const weekStreak = computeWeekStreak(myLogs, user.id);

  const exerciseOptions = useMemo(() => {
    const fromRoutines = routines.flatMap((routine) => Object.values(routine.days).flat().map((item) => item.exercise));
    return [...new Set([...CATALOG_EXERCISE_NAMES, ...fromRoutines.map(canonicalExerciseName)])].sort();
  }, [routines]);

  const handleLog = async (entry) => {
    try {
      const currentBest = myBests[canonicalExerciseName(entry.exercise)];
      const { isPr, committed } = createWorkoutLog({ userId: user.id, username: user.username, entry, currentBest });
      // La escritura es optimista: onSnapshot la muestra al instante; el servidor confirma después (o al volver la red).
      committed.catch((commitError) => {
        logError('log:commit', commitError);
        notify(toUserMessage(commitError, 'No se pudo sincronizar el registro.'), 'error');
      });
      onCelebrate(isPr); // Festejo aleatorio (1 de 5) con su propio sonido; respeta el botón de silencio
      notify(isPr ? '¡Nuevo récord personal!' : 'Ejercicio registrado', 'success');
      setPanel(null);
    } catch (logErrorInstance) {
      logError('log:create', logErrorInstance);
      notify(toUserMessage(logErrorInstance), 'error');
    }
  };

  const openConfirm = (item, values = null, fromTimer = false) => {
    playClick();
    setPanel((current) => (current?.key === item.id && !values ? null : { key: item.id, values, fromTimer, version: Date.now() }));
  };

  const openTimer = (item) => {
    playClick();
    setPanel(null);
    setTimerTarget({ item });
  };

  // Al terminar en el reloj: se abre la confirmación con lo realmente hecho (series del reloj, reps y kg editados).
  const handleTimerFinish = (result) => {
    const { item } = timerTarget;
    setTimerTarget(null);
    openConfirm(item, { exercise: item.exercise, muscle: item.muscle, sets: result.sets, reps: result.reps, weight: result.weight, fallbackSets: item.sets || 3 }, true);
  };

  const handleUndo = async (log) => {
    const accepted = await confirm({
      title: 'Deshacer registro',
      message: `Se eliminará ${log.exercise} (${formatSetSummary(log)}).`,
      confirmLabel: 'Eliminar',
      tone: 'danger',
    });
    if (!accepted) return;
    try {
      await deleteWorkoutLog(log, myBests[log.exercise]);
      notify('Registro eliminado', 'info');
    } catch (deleteError) {
      logError('log:delete', deleteError);
      notify(toUserMessage(deleteError), 'error');
    }
  };

  const toggleFreeForm = () => {
    playClick();
    setPanel((current) => (current?.key === 'free' ? null : { key: 'free', version: Date.now() }));
  };

  const timerItem = timerTarget?.item ?? null;
  const timerInitialValues = timerItem ? buildConfirmDefaults(timerItem, latestLogByExercise[canonicalExerciseName(timerItem.exercise)]) : null;

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="card p-4 md:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold capitalize text-secondary">{formatLongDate(parseDateKey(todayKey))}</p>
            <h2 className="mt-1 text-xl font-black md:text-2xl">¡A entrenar, {user.username}!</h2>
          </div>
          <button type="button" className="btn btn-ghost shrink-0 px-3" onClick={() => { playClick(); setTimerTarget({ item: null }); }}
            onPointerEnter={prefetchTimer} onTouchStart={prefetchTimer} onFocus={prefetchTimer}>
            <Timer size={16} aria-hidden /> Reloj
          </button>
        </div>
        {activeRoutine && plannedItems.length > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between gap-2 text-sm font-semibold">
              <span className="min-w-0 truncate text-secondary">{activeRoutine.name}</span>
              <span className="shrink-0">{doneCount}/{plannedItems.length}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full surface-2" role="progressbar" aria-valuemin={0} aria-valuemax={plannedItems.length} aria-valuenow={doneCount}>
              <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${(doneCount / plannedItems.length) * 100}%` }} />
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile icon={CalendarDays} label="Esta semana" value={plannedDays ? `${trainedDaysThisWeek}/${plannedDays}` : trainedDaysThisWeek} hint={plannedDays ? 'días entrenados / planificados' : 'días entrenados'} />
        <StatTile icon={Flame} label="Racha" value={`${weekStreak} sem`} hint="semanas consecutivas activas" />
        <StatTile icon={Trophy} label="PRs hoy" value={todayLogs.filter((log) => log.isPr).length} hint="récords de 1RM estimado" />
      </div>

      {!activeRoutine ? (
        <EmptyState icon={CalendarDays} title="Sin rutina activa" description="Activa una rutina en la pestaña Rutinas o registra ejercicios libres abajo." />
      ) : plannedItems.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Día de descanso" description="La recuperación también construye músculo. Si entrenas igual, regístralo abajo." />
      ) : (
        <SectionCard title="Plan de hoy" subtitle="«Hacer ahora» abre el reloj; «Hecho» registra el ejercicio con tus últimos valores.">
          <ul className="divide-y divide-[var(--border)]">
            {plannedItems.map((item, index) => {
              const exerciseKey = canonicalExerciseName(item.exercise);
              return (
                <PlannedItem
                  key={item.id}
                  item={item}
                  isDone={completion[index]}
                  previousLog={previousLogByExercise[exerciseKey]}
                  latestLog={latestLogByExercise[exerciseKey]}
                  best={myBests[exerciseKey]}
                  panel={panel}
                  onOpenConfirm={openConfirm}
                  onOpenTimer={openTimer}
                  onSubmit={handleLog}
                  onCancel={() => setPanel(null)}
                />
              );
            })}
          </ul>
        </SectionCard>
      )}

      <SectionCard
        title="Registrado hoy"
        subtitle={logsState.loading ? 'Sincronizando…' : todayLogs.length ? `${todayLogs.length} ejercicio(s)` : 'Aún no registraste nada hoy'}
        actions={
          <button type="button" className="btn btn-ghost" aria-expanded={panel?.key === 'free'} onClick={toggleFreeForm}>
            <Plus size={16} aria-hidden /> Ejercicio libre
          </button>
        }
      >
        {panel?.key === 'free' && (
          <LogEntryForm key={panel.version} defaults={{ fallbackSets: 3 }} showExerciseField exerciseOptions={exerciseOptions} onSubmit={handleLog} onCancel={() => setPanel(null)} />
        )}
        {logsState.loading && (
          <div className="py-4">
            <Spinner size="sm" label="Cargando tu historial de los últimos 60 días…" hint="Lo usamos para marcar lo hecho hoy y sugerir tus últimos valores." />
          </div>
        )}
        {todayLogs.length > 0 && (
          <ul className="mt-2 divide-y divide-[var(--border)]">
            {todayLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-2 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {log.exercise} {log.isPr && <span className="badge badge-accent ml-1"><Trophy size={12} aria-hidden /> PR</span>}
                  </p>
                  <p className="text-xs text-secondary">
                    {log.sets} × {formatSetSummary(log)}
                    {log.isPending && <span className="ml-2 inline-flex items-center gap-1 text-muted"><CloudOff size={12} aria-hidden /> pendiente de sincronizar</span>}
                  </p>
                </div>
                <IconButton label={`Deshacer ${log.exercise}`} icon={Undo2} onClick={() => handleUndo(log)} />
              </li>
            ))}
          </ul>
        )}
        {logsState.error && <p className="mt-2 text-sm text-accent">{toUserMessage(logsState.error)}</p>}
      </SectionCard>

      {timerTarget && (
        <Suspense fallback={null}>
          <WorkoutTimer
            exercise={timerItem?.exercise ?? null}
            initialValues={timerInitialValues}
            routineValues={timerItem ? buildRoutineValues(timerItem) : null}
            onFinish={timerItem ? handleTimerFinish : undefined}
            onClose={() => setTimerTarget(null)}
          />
        </Suspense>
      )}
    </div>
  );
};
