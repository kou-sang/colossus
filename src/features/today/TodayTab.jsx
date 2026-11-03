import { CalendarDays, CalendarPlus, Check, CloudOff, Flame, Play, Plus, Timer, TrendingUp, Trophy, Undo2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { IconButton, SectionCard, Spinner, StatTile } from '../../components/ui';
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
import { formatSetDetails, hasSetDetails, suggestNextLoad } from '../../utils/sets';
import { computeWeekStreak, countPlannedDays, countTrainingDays } from '../../utils/metrics';
import { AddLogToRoutineDialog } from './AddLogToRoutineDialog';
import { clearFormDraft, readOpenPanel, writeOpenPanel } from './logDrafts';
import { LogEntryForm } from './LogEntryForm';
import { useTimer } from './timer/TimerContext';
import { formatClock } from './timer/timerEngine';

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
    // Series detalladas de la última vez (sin el RIR: el esfuerzo es de cada sesión y no se arrastra).
    setDetails: latestLog?.setDetails?.map(({ reps, weight }) => ({ reps, weight })) ?? null,
    fallbackSets: item.sets || 3,
  };
};

// Tope del rango de repeticiones de la rutina ("8-12" → 12, "10" → 10): guía la sugerencia de carga.
const topRepsOf = (repsText) => {
  const numbers = String(repsText ?? '').match(/\d+/g)?.map(Number) ?? [];
  return numbers.length ? Math.max(...numbers) : 12;
};

// Línea completa de un registro: "4 × 60 kg × 8 · RIR 2" o, con detalle, "60×10 · 62,5×8 @1".
const formatLogLine = (log) => {
  if (hasSetDetails(log)) return formatSetDetails(log.setDetails);
  const rir = Number.isInteger(log.rir) ? ` · RIR ${log.rir >= 4 ? '4+' : log.rir}` : '';
  return `${log.sets} × ${formatSetSummary(log)}${rir}`;
};

const formatSetSummary = (log) => {
  if (!log) return null;
  if (hasSetDetails(log)) return formatSetDetails(log.setDetails);
  const weight = log.weight !== null ? `${log.weight} kg` : 'sin peso';
  return log.reps ? `${weight} × ${log.reps}` : weight;
};

// Un ejercicio del plan del día. "Hacer" abre el registro prellenado con lo último que hiciste.
const PlannedItem = ({ item, isDone, previousLog, latestLog, best, panel, onOpen, onSubmit, onCancel }) => {
  const routineValues = buildRoutineValues(item);
  const suggestion = isDone ? null : suggestNextLoad(previousLog, { topReps: topRepsOf(item.reps) });
  const isOpen = panel?.key === item.id;
  return (
    <li className={`py-3 first:pt-0 last:pb-0 ${isDone && !isOpen ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-bold">{item.exercise}</h4>
          <p className="text-sm text-secondary">
            {item.sets} series{item.reps && ` × ${item.reps} reps`}
            {hasValue(item.weight) && ` · ${item.weight} kg`}
          </p>
          {suggestion && (
            <p className="mt-0.5 flex items-start gap-1 text-xs font-semibold text-[var(--good)]">
              <TrendingUp size={13} className="mt-px shrink-0" aria-hidden /> {suggestion.text}
            </p>
          )}
          {(previousLog || best) && (
            <p className="mt-0.5 text-xs text-muted">
              {previousLog && <>Última vez ({formatShortDate(previousLog.performedAt)}): {formatLogLine(previousLog)}</>}
              {previousLog && best?.e1rm && ' · '}
              {best?.e1rm && <>Récord: {best.e1rm} kg (1RM est.)</>}
            </p>
          )}
        </div>
        {isDone ? (
          <span className="badge badge-good mt-1 shrink-0"><Check size={14} aria-hidden /> Hecho</span>
        ) : (
          <button type="button" className="btn btn-outline shrink-0 px-4" aria-expanded={isOpen} onClick={() => onOpen(item)}>
            <Play size={16} aria-hidden /> Hacer
          </button>
        )}
      </div>
      {isOpen && (
        <LogEntryForm
          draftKey={item.id}
          heading={latestLog ? 'Lo de la última vez ya está cargado: ajusta y guarda.' : null}
          defaults={buildConfirmDefaults(item, latestLog)}
          routineValues={routineValues}
          submitLabel="Guardar"
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
    </li>
  );
};

// Botones del plan: ejercicio fuera de la rutina y reloj libre (muestra el tiempo si está corriendo).
const PlanActions = ({ isFreeOpen, onToggleFree }) => {
  const { timer, isActive, open, prefetch } = useTimer();
  return (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" className="btn btn-ghost" aria-expanded={isFreeOpen} onClick={onToggleFree}>
        <Plus size={16} aria-hidden /> Ejercicio libre
      </button>
      <button type="button" className={`btn ${isActive ? 'btn-outline' : 'btn-ghost'}`} onClick={open} onPointerEnter={prefetch} onTouchStart={prefetch} onFocus={prefetch}>
        <Timer size={16} aria-hidden /> {isActive ? formatClock(timer.view.displayMs, { ceil: !timer.view.phase?.countUp }) : 'Reloj libre'}
      </button>
    </div>
  );
};

export const TodayTab = ({ onCelebrate }) => {
  const { user, activeRoutine, myBests, routines } = useAppData();
  const { notify, confirm } = useFeedback();
  const todayKey = useToday();
  // Formulario abierto: { key: id del ítem | 'free' }. Se recuerda al cambiar de pestaña (logDrafts).
  const [panel, setPanelState] = useState(readOpenPanel);
  const setPanel = (next) => {
    setPanelState(next);
    writeOpenPanel(next);
  };
  const [routineTarget, setRoutineTarget] = useState(null); // registro que se agrega a una rutina

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
      onCelebrate(isPr); // Festejo aleatorio (1 de 5) con su propio sonido; respeta el volumen elegido
      notify(isPr ? '¡Nuevo récord personal!' : 'Ejercicio registrado', 'success');
      clearFormDraft(panel?.key);
      setPanel(null);
    } catch (logErrorInstance) {
      logError('log:create', logErrorInstance);
      notify(toUserMessage(logErrorInstance), 'error');
    }
  };

  const togglePanel = (key) => {
    playClick();
    setPanel(panel?.key === key ? null : { key });
  };

  const cancelPanel = () => {
    clearFormDraft(panel?.key);
    setPanel(null);
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

  const planSubtitle = !activeRoutine
    ? 'No tienes una rutina activa: puedes registrar ejercicios libres.'
    : plannedItems.length === 0 ? 'Hoy toca descanso según tu rutina.' : `${activeRoutine.name} · ${doneCount} de ${plannedItems.length} hechos`;

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="card p-4 md:p-6">
        <p className="text-sm font-semibold capitalize text-secondary">{formatLongDate(parseDateKey(todayKey))}</p>
        <h2 className="mt-1 text-xl font-black md:text-2xl">¡A entrenar, {user.username}!</h2>
        {activeRoutine && plannedItems.length > 0 && (
          <div className="mt-4 h-2 overflow-hidden rounded-full surface-2" role="progressbar" aria-label="Progreso del plan de hoy" aria-valuemin={0} aria-valuemax={plannedItems.length} aria-valuenow={doneCount}>
            <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${(doneCount / plannedItems.length) * 100}%` }} />
          </div>
        )}
      </header>

      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <StatTile icon={CalendarDays} label="Semana" value={plannedDays ? `${trainedDaysThisWeek}/${plannedDays}` : trainedDaysThisWeek} hint={plannedDays ? 'días de tu plan' : 'días entrenados'} />
        <StatTile icon={Flame} label="Racha" value={`${weekStreak} sem`} hint="seguidas" />
        <StatTile icon={Trophy} label="Récords" value={todayLogs.filter((log) => log.isPr).length} hint="hoy" />
      </div>

      <SectionCard title="Plan de hoy" subtitle={planSubtitle}>
        <PlanActions isFreeOpen={panel?.key === 'free'} onToggleFree={() => togglePanel('free')} />
        {panel?.key === 'free' && (
          <LogEntryForm draftKey="free" defaults={{ fallbackSets: 3 }} showExerciseField exerciseOptions={exerciseOptions} onSubmit={handleLog} onCancel={cancelPanel} />
        )}
        {activeRoutine && plannedItems.length > 0 && (
          <ul className="mt-4 divide-y divide-[var(--border)] border-t divider pt-3">
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
                  onOpen={(target) => togglePanel(target.id)}
                  onSubmit={handleLog}
                  onCancel={cancelPanel}
                />
              );
            })}
          </ul>
        )}
        {!activeRoutine && (
          <p className="mt-3 text-xs text-muted">Activa una rutina en la pestaña Rutinas y acá verás los ejercicios de cada día.</p>
        )}
      </SectionCard>

      <SectionCard
        title="Registrado hoy"
        subtitle={logsState.loading ? 'Sincronizando…' : todayLogs.length ? `${todayLogs.length} ejercicio(s)` : 'Todavía nada. Lo que guardes aparece acá.'}
      >
        {logsState.loading && (
          <div className="py-4">
            <Spinner size="sm" label="Cargando tus últimos 60 días…" hint="Así marcamos lo hecho y te sugerimos los valores de la última vez." />
          </div>
        )}
        {todayLogs.length > 0 && (
          <ul className="divide-y divide-[var(--border)]">
            {todayLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-1 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {log.exercise} {log.isPr && <span className="badge badge-accent ml-1"><Trophy size={12} aria-hidden /> Récord</span>}
                  </p>
                  <p className="text-xs text-secondary">
                    {formatLogLine(log)}
                    {log.isPending && <span className="ml-2 inline-flex items-center gap-1 text-muted"><CloudOff size={12} aria-hidden /> sin sincronizar</span>}
                  </p>
                </div>
                <IconButton label={`Agregar ${log.exercise} a una rutina`} icon={CalendarPlus} onClick={() => { playClick(); setRoutineTarget(log); }} />
                <IconButton label={`Deshacer ${log.exercise}`} icon={Undo2} onClick={() => handleUndo(log)} />
              </li>
            ))}
          </ul>
        )}
        {logsState.error && <p className="mt-2 text-sm text-accent">{toUserMessage(logsState.error)}</p>}
      </SectionCard>

      {routineTarget && <AddLogToRoutineDialog log={routineTarget} onClose={() => setRoutineTarget(null)} />}
    </div>
  );
};
