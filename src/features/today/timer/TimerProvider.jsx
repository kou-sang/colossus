import { Pause, Play } from 'lucide-react';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { playClick } from '../../../utils/audio';
import { lazyWithPrefetch } from '../../../utils/lazyWithPrefetch';
import { TimerContext } from './TimerContext';
import { formatClock, phaseLabel, PHASE_KIND, sanitizeTimerConfig, TIMER_STATUS } from './timerEngine';
import { readTimerStore, writeTimerStore } from './timerStore';
import { useWorkoutTimer } from './useWorkoutTimer';

// La ventana del reloj (~10 KB) se descarga recién al abrirla; el motor y el contador viven en el bundle base.
const TIMER_DIALOG = lazyWithPrefetch(() => import('./WorkoutTimer'), 'WorkoutTimer');
const WorkoutTimer = TIMER_DIALOG.Component;
const prefetchTimerDialog = () => TIMER_DIALOG.prefetch();

const DOCK_COLORS = Object.freeze({ [PHASE_KIND.PREP]: 'var(--warning)', [PHASE_KIND.WORK]: 'var(--accent)', [PHASE_KIND.REST]: 'var(--good)' });

/*
 * Mini reloj flotante: aparece cuando el reloj está corriendo (o en pausa) y la ventana está cerrada.
 * Así puedes registrar series o mirar otra pestaña sin perder el descanso. Tocarlo vuelve a abrir el reloj.
 */
const TimerDock = ({ timer, modeId, onOpen }) => {
  const { phase, displayMs } = timer.view;
  const isPaused = timer.state.status === TIMER_STATUS.PAUSED;
  const color = DOCK_COLORS[phase?.kind] ?? 'var(--accent)';
  return (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-3 z-50 flex items-center gap-1 rounded-full border divider bg-[var(--surface)] p-1 shadow-lg lg:bottom-6 lg:right-6">
      <button type="button" className="flex min-h-[44px] items-center gap-2 rounded-full px-3 text-left" onClick={onOpen}
        aria-label={`Abrir reloj: ${phaseLabel(phase, modeId)}, ${formatClock(displayMs, { ceil: !phase?.countUp })}`}>
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
        <span className="flex flex-col leading-tight">
          <span className="text-lg font-black tabular-nums">{formatClock(displayMs, { ceil: !(phase?.countUp || phase?.duration === null) })}</span>
          <span className="max-w-[9rem] truncate text-[11px] font-semibold text-secondary">{isPaused ? 'En pausa' : phaseLabel(phase, modeId)}</span>
        </span>
      </button>
      <button type="button" className="icon-btn rounded-full" aria-label={isPaused ? 'Reanudar reloj' : 'Pausar reloj'}
        onClick={() => { playClick(); if (isPaused) timer.resume(); else timer.pause(); }}>
        {isPaused ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
      </button>
    </div>
  );
};

/**
 * Reloj de entrenamiento a nivel de la app: sigue corriendo (y sonando) aunque cierres la ventana, cambies de
 * pestaña o recargues. La ventana es solo una vista del reloj.
 */
export const TimerProvider = ({ children }) => {
  const [initial] = useState(readTimerStore);
  const [modeId, setModeId] = useState(initial.modeId);
  const [rawConfigs, setRawConfigs] = useState(initial.configs);
  const [isOpen, setIsOpen] = useState(false);
  const config = useMemo(() => sanitizeTimerConfig(modeId, rawConfigs[modeId]), [modeId, rawConfigs]);
  const timer = useWorkoutTimer(config, initial.state);

  // Se guarda en cada cambio de estado (no en cada tick: el estado cambia solo en acciones y cambios de fase).
  useEffect(() => {
    writeTimerStore({ modeId, configs: rawConfigs, state: timer.state });
  }, [modeId, rawConfigs, timer.state]);

  const { reset } = timer;
  const changeMode = useCallback((nextMode) => {
    reset();
    setModeId(nextMode);
  }, [reset]);
  const changeField = useCallback((field, value) => {
    reset();
    setRawConfigs((previous) => ({ ...previous, [modeId]: { ...previous[modeId], [field]: value } }));
  }, [modeId, reset]);

  const open = useCallback(() => {
    playClick();
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const isActive = timer.state.status === TIMER_STATUS.RUNNING || timer.state.status === TIMER_STATUS.PAUSED;
  const value = useMemo(
    () => ({ timer, modeId, rawConfigs, config, isOpen, isActive, open, close, changeMode, changeField, prefetch: prefetchTimerDialog }),
    [timer, modeId, rawConfigs, config, isOpen, isActive, open, close, changeMode, changeField],
  );

  return (
    <TimerContext.Provider value={value}>
      {children}
      {isOpen && <Suspense fallback={null}><WorkoutTimer /></Suspense>}
      {!isOpen && isActive && <TimerDock timer={timer} modeId={modeId} onOpen={open} />}
    </TimerContext.Provider>
  );
};

