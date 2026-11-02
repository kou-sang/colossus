import { Check, ChevronsRight, ClipboardCheck, Minus, Pause, Play, Plus, RotateCcw, Square, Timer } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { Dialog } from '../../../components/Dialog';
import { IconButton } from '../../../components/ui';
import { playClick } from '../../../utils/audio';
import { logError } from '../../../utils/errors';
import {
  FIELD_LABELS,
  formatClock,
  PHASE_KIND,
  phaseLabel,
  sanitizeTimerConfig,
  TIMER_MODE_BY_ID,
  TIMER_MODES,
  TIMER_STATUS,
} from './timerEngine';
import { useWorkoutTimer } from './useWorkoutTimer';

const STORAGE_KEY = 'colossus:timer:v1';

// Última configuración usada por modo (por dispositivo): los tiempos personalizados no se pierden.
const readStoredTimer = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const writeStoredTimer = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (storageError) {
    logError('timer:storage', storageError); // Modo privado: la configuración vive solo en memoria.
  }
};

const RING_RADIUS = 54;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const PHASE_STYLES = Object.freeze({
  [PHASE_KIND.PREP]: { color: 'var(--warning)', label: 'Prepárate' },
  [PHASE_KIND.WORK]: { color: 'var(--accent)', label: 'Trabajo' },
  [PHASE_KIND.REST]: { color: 'var(--good)', label: 'Descanso' },
});

const ClockRing = ({ progress, color, children }) => (
  <div className="relative mx-auto aspect-square w-full max-w-[220px]">
    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
      <circle cx="60" cy="60" r={RING_RADIUS} fill="none" stroke="var(--surface-2)" strokeWidth="8" />
      {progress !== null && (
        <circle cx="60" cy="60" r={RING_RADIUS} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={RING_LENGTH} strokeDashoffset={RING_LENGTH * progress} style={{ transition: 'stroke-dashoffset 0.2s linear' }} />
      )}
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">{children}</div>
  </div>
);

const ConfigField = ({ id, field, value, disabled, onChange }) => {
  const meta = FIELD_LABELS[field];
  return (
    <div className="min-w-0">
      <label htmlFor={`${id}-${field}`} className="mb-1 block truncate text-xs font-bold text-secondary">
        {meta.label}{meta.unit && ` (${meta.unit})`}
      </label>
      <input id={`${id}-${field}`} type="number" inputMode="numeric" min="0" className="input" disabled={disabled}
        value={value} onChange={(event) => onChange(field, event.target.value)} />
      {meta.hint && <p className="mt-0.5 truncate text-[11px] text-muted">{meta.hint}</p>}
    </div>
  );
};

// Valores de la serie que se va a hacer ahora (series, reps y kg). Todos opcionales.
const PlannedValues = ({ id, values, onChange, routineValues, disabled }) => (
  <div className="rounded-xl surface-2 p-3">
    <p className="mb-2 text-xs font-bold text-secondary">Lo que vas a hacer ahora</p>
    <div className="grid grid-cols-3 gap-2">
      {[
        { key: 'sets', label: 'Series', step: '1' },
        { key: 'reps', label: 'Reps', step: '1' },
        { key: 'weight', label: 'Kg', step: '0.5' },
      ].map((field) => (
        <div key={field.key} className="min-w-0">
          <label htmlFor={`${id}-plan-${field.key}`} className="mb-1 block text-[11px] font-bold text-muted">{field.label}</label>
          <input id={`${id}-plan-${field.key}`} type="number" min="0" step={field.step} className="input" disabled={disabled}
            inputMode={field.key === 'weight' ? 'decimal' : 'numeric'} placeholder="—"
            value={values[field.key] ?? ''} onChange={(event) => onChange({ [field.key]: event.target.value })} />
        </div>
      ))}
    </div>
    {routineValues && (
      <button type="button" className="btn btn-ghost mt-2 w-full text-xs" disabled={disabled} onClick={() => { playClick(); onChange(routineValues.values); }}>
        <ClipboardCheck size={14} aria-hidden /> Valores de rutina: {routineValues.label}
      </button>
    )}
  </div>
);

/**
 * Reloj de entrenamiento (Series + descanso, Tabata, EMOM, AMRAP, For Time e Intervalos), en una ventana.
 * Con `exercise` muestra qué serie se va a hacer y, al terminar, `onFinish` devuelve lo hecho para registrarlo.
 * Sin `exercise` funciona como reloj libre.
 */
export const WorkoutTimer = ({ exercise = null, initialValues = null, routineValues = null, onFinish, onClose }) => {
  const id = useId();
  const stored = useMemo(readStoredTimer, []);
  const [modeId, setModeId] = useState(() => (TIMER_MODE_BY_ID[stored?.mode] ? stored.mode : 'classic'));
  const [rawConfigs, setRawConfigs] = useState(() => {
    const base = Object.fromEntries(TIMER_MODES.map((mode) => [mode.id, { ...mode.defaults, ...(stored?.configs?.[mode.id] ?? {}) }]));
    // Con un ejercicio, las series del reloj arrancan con las series planificadas.
    const plannedSets = Number(initialValues?.sets);
    if (Number.isInteger(plannedSets) && plannedSets > 0) base.classic = { ...base.classic, rounds: plannedSets };
    return base;
  });
  const [values, setValues] = useState(() => ({ sets: initialValues?.sets ?? '', reps: initialValues?.reps ?? '', weight: initialValues?.weight ?? '' }));

  const config = useMemo(() => sanitizeTimerConfig(modeId, rawConfigs[modeId]), [modeId, rawConfigs]);
  const timer = useWorkoutTimer(config);
  const { status } = timer.state;
  const isIdle = status === TIMER_STATUS.IDLE;
  const isDone = status === TIMER_STATUS.DONE;
  const mode = TIMER_MODE_BY_ID[modeId];

  // Se persiste la configuración elegida (modo y tiempos) para la próxima vez.
  useEffect(() => {
    writeStoredTimer({ mode: modeId, configs: rawConfigs });
  }, [modeId, rawConfigs]);

  const changeMode = (nextMode) => {
    playClick();
    timer.reset();
    setModeId(nextMode);
  };

  const changeField = (field, value) => {
    timer.reset();
    setRawConfigs((previous) => ({ ...previous, [modeId]: { ...previous[modeId], [field]: value } }));
  };

  const changeValues = (patch) => {
    setValues((previous) => ({ ...previous, ...patch }));
    // Si cambian las series planificadas, el modo "Series + descanso" las acompaña.
    const sets = Number(patch.sets);
    if (Number.isInteger(sets) && sets > 0 && isIdle) {
      setRawConfigs((previous) => ({ ...previous, classic: { ...previous.classic, rounds: sets } }));
    }
  };

  const { phase, nextPhase, displayMs, progress, totalElapsedMs } = timer.view;
  const phaseStyle = PHASE_STYLES[phase?.kind] ?? PHASE_STYLES[PHASE_KIND.WORK];
  const countsManually = modeId === 'amrap' || modeId === 'forTime';
  const completed = countsManually ? timer.state.manualRounds : timer.state.completedWork;
  const isOpenPhase = phase && phase.duration === null && phase.kind === PHASE_KIND.WORK;

  const handleRegister = () => {
    playClick();
    const doneSets = completed > 0 ? completed : Number(values.sets) || 1;
    onFinish?.({
      ...values,
      // En "Series + descanso" se registran las series realmente hechas; en los demás modos, las rondas.
      sets: String(doneSets),
      durationSec: Math.round(totalElapsedMs / 1000),
      mode: modeId,
    });
  };

  return (
    // Con el reloj corriendo, Escape / atrás / tocar afuera no cierran (evita perder una serie por accidente):
    // primero hay que pausar o terminar.
    <Dialog title="Reloj" icon={Timer} subtitle={exercise ?? undefined} onClose={onClose} dismissible={isIdle || isDone || status === TIMER_STATUS.PAUSED}
      closeLabel="Cerrar reloj" bodyClassName="px-4 pb-4 pt-3 md:px-5 md:pb-5">

      {exercise && (
        <div className="mb-3">
          <PlannedValues id={id} values={values} onChange={changeValues} routineValues={routineValues} disabled={!isIdle && !isDone} />
        </div>
      )}

      <div className="mb-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Tipo de reloj">
        {TIMER_MODES.map((option) => (
          <button key={option.id} type="button" role="radio" aria-checked={option.id === modeId} aria-pressed={option.id === modeId}
            className="chip" disabled={!isIdle && !isDone} onClick={() => changeMode(option.id)}>
            {option.short}
          </button>
        ))}
      </div>
      <p className="mb-3 text-xs text-muted">{mode.help}</p>

      {(isIdle || isDone) && (
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {mode.fields.map((field) => (
            <ConfigField key={field} id={id} field={field} value={rawConfigs[modeId][field]} onChange={changeField} />
          ))}
        </div>
      )}

      <ClockRing progress={isDone ? 0 : progress} color={phaseStyle.color}>
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: isDone ? 'var(--good)' : phaseStyle.color }}>
          {isDone ? 'Terminado' : isIdle ? 'Listo' : phaseLabel(phase, modeId)}
        </span>
        <span className="text-5xl font-black leading-tight tabular-nums" aria-live="off">
          {formatClock(displayMs, { ceil: !isDone && !(phase?.countUp || phase?.duration === null) })}
        </span>
        {!isIdle && (
          <span className="text-xs font-semibold text-secondary">
            {countsManually ? `${completed} ronda(s)` : `${completed}/${phase?.totalRounds ?? 0} ${modeId === 'classic' ? 'series' : 'rondas'}`}
          </span>
        )}
      </ClockRing>

      <p className="mt-2 min-h-[1.25rem] text-center text-xs text-muted" aria-live="polite">
        {isDone
          ? `Tiempo total: ${formatClock(totalElapsedMs)}`
          : status === TIMER_STATUS.PAUSED ? 'En pausa'
            : nextPhase && !isIdle ? `Después: ${phaseLabel(nextPhase, modeId)}${nextPhase.duration ? ` (${formatClock(nextPhase.duration)})` : ''}` : ''}
      </p>

      <div className="mt-3 flex flex-col gap-2">
        {isIdle && (
          <button type="button" className="btn btn-primary w-full py-3 text-base" onClick={() => { playClick(); timer.start(); }}>
            <Play size={18} aria-hidden /> Empezar
          </button>
        )}

        {status === TIMER_STATUS.RUNNING && (
          <>
            {isOpenPhase && (
              <button type="button" className="btn btn-primary w-full py-3 text-base" onClick={() => { playClick(); timer.next(); }}>
                <Check size={18} aria-hidden /> {modeId === 'classic' ? 'Serie hecha' : 'Terminé'}
              </button>
            )}
            {countsManually && (
              <div className="flex gap-2">
                <button type="button" className="btn btn-primary flex-1 py-3 text-base" onClick={() => { playClick(); timer.addRound(1); }}>
                  <Plus size={18} aria-hidden /> 1 ronda
                </button>
                <IconButton label="Restar una ronda" icon={Minus} onClick={() => timer.addRound(-1)} />
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => { playClick(); timer.pause(); }}><Pause size={16} aria-hidden /> Pausa</button>
              <button type="button" className="btn btn-ghost" onClick={() => { playClick(); timer.next(); }}><ChevronsRight size={16} aria-hidden /> Saltar</button>
              <button type="button" className="btn btn-ghost" onClick={() => { playClick(); timer.finish(); }}><Square size={14} aria-hidden /> Fin</button>
            </div>
          </>
        )}

        {status === TIMER_STATUS.PAUSED && (
          <div className="grid grid-cols-3 gap-2">
            <button type="button" className="btn btn-primary" onClick={() => { playClick(); timer.resume(); }}><Play size={16} aria-hidden /> Seguir</button>
            <button type="button" className="btn btn-ghost" onClick={() => { playClick(); timer.reset(); }}><RotateCcw size={16} aria-hidden /> Reiniciar</button>
            <button type="button" className="btn btn-ghost" onClick={() => { playClick(); timer.finish(); }}><Square size={14} aria-hidden /> Fin</button>
          </div>
        )}

        {isDone && (
          <>
            <p className="rounded-xl bg-[var(--accent-soft)] p-3 text-center text-sm font-semibold">
              {completed > 0
                ? `¡Bien! ${completed} ${countsManually || modeId !== 'classic' ? 'ronda(s)' : 'serie(s)'} en ${formatClock(totalElapsedMs)}.`
                : `Tiempo: ${formatClock(totalElapsedMs)}.`}
            </p>
            <div className="flex gap-2">
              {exercise && onFinish && (
                <button type="button" className="btn btn-primary flex-1" onClick={handleRegister}>
                  <Check size={16} aria-hidden /> Registrar
                </button>
              )}
              <button type="button" className="btn btn-ghost flex-1" onClick={() => { playClick(); timer.reset(); }}>
                <RotateCcw size={16} aria-hidden /> Otra vez
              </button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};
