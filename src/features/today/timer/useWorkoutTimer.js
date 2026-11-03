import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { isVibrationEnabled, playCountdownTick, playRestStart, playTimerFinish, playWorkStart } from '../../../utils/audio';
import { logError } from '../../../utils/errors';
import { buildPhases, createTimerState, describeTimer, PHASE_KIND, timerReducer, TIMER_STATUS } from './timerEngine';

const TICK_MS = 100;
const COUNTDOWN_SECONDS = 3;

// Vibración corta en los cambios de fase (celular en el bolsillo o lejos). Silenciosa si no está soportada.
const vibrate = (pattern) => {
  if (!isVibrationEnabled()) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Sin soporte: no pasa nada.
  }
};

/*
 * Mantiene la pantalla encendida mientras el reloj corre (Screen Wake Lock API).
 * Se vuelve a pedir al regresar a la pestaña porque el navegador lo libera al ocultarla.
 */
const useWakeLock = (active) => {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return undefined;
    let sentinel = null;
    let cancelled = false;
    const request = async () => {
      try {
        sentinel = await navigator.wakeLock.request('screen');
      } catch (wakeError) {
        logError('timer:wake-lock', wakeError); // Batería baja o permiso denegado: el reloj funciona igual.
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !cancelled) request();
    };
    request();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      sentinel?.release().catch(() => {});
    };
  }, [active]);
};

/**
 * Estado del reloj + efectos (sonidos, vibración, pantalla encendida). Lo usa SOLO el TimerProvider:
 * el reloj vive a nivel de la app y sigue corriendo aunque se cierre la ventana o se cambie de pestaña.
 * `config` ya sanitizada (ver sanitizeTimerConfig); `initialState` permite retomar un reloj guardado.
 */
export const useWorkoutTimer = (config, initialState) => {
  const phases = useMemo(() => buildPhases(config), [config]);
  const [state, dispatch] = useReducer(timerReducer, initialState ?? null, (restored) => restored ?? createTimerState());
  const [now, setNow] = useState(() => Date.now());

  // Cada acción usa la MISMA marca de tiempo para el reducer y para la pantalla. Antes la pantalla seguía con el
  // último "tick" (hasta 200 ms viejo) y al pausar/reanudar el número saltaba un segundo.
  const send = useCallback((type, extra = {}) => {
    const current = Date.now();
    setNow(current);
    dispatch({ type, phases, now: current, ...extra });
  }, [phases]);

  const isRunning = state.status === TIMER_STATUS.RUNNING;
  useEffect(() => {
    if (!isRunning) return undefined;
    const intervalId = setInterval(() => {
      const current = Date.now();
      setNow(current);
      dispatch({ type: 'tick', phases, now: current });
    }, TICK_MS);
    return () => clearInterval(intervalId);
  }, [isRunning, phases]);

  useWakeLock(isRunning || state.status === TIMER_STATUS.PAUSED);

  // Sonidos: cambio de fase y cuenta regresiva de los últimos 3 segundos.
  const lastPhaseRef = useRef(null);
  const lastBeepRef = useRef(null);
  useEffect(() => {
    if (state.status === TIMER_STATUS.DONE) {
      if (lastPhaseRef.current !== 'done') {
        playTimerFinish();
        vibrate([200, 100, 200]);
      }
      lastPhaseRef.current = 'done';
      return;
    }
    if (state.status !== TIMER_STATUS.RUNNING) {
      if (state.status === TIMER_STATUS.IDLE) lastPhaseRef.current = null;
      return;
    }
    const phase = phases[state.phaseIndex];
    const phaseKey = `${state.phaseIndex}`;
    if (lastPhaseRef.current !== phaseKey) {
      lastPhaseRef.current = phaseKey;
      if (phase?.kind === PHASE_KIND.WORK) {
        playWorkStart();
        vibrate(120);
      } else if (phase?.kind === PHASE_KIND.REST) {
        playRestStart();
        vibrate([80, 60, 80]);
      }
    }
    if (phase?.duration) {
      const remainingSeconds = Math.ceil((phase.duration - (now - state.phaseStartedAt)) / 1000);
      const beepKey = `${phaseKey}:${remainingSeconds}`;
      if (remainingSeconds > 0 && remainingSeconds <= COUNTDOWN_SECONDS && lastBeepRef.current !== beepKey) {
        lastBeepRef.current = beepKey;
        playCountdownTick();
      }
    }
  }, [state, phases, now]);

  // `now` solo avanza mientras corre; en pausa/fin describeTimer usa las marcas guardadas (pausedAt/finishedAt).
  const view = describeTimer(state, phases, now);

  return {
    state,
    phases,
    view,
    start: () => send('start'),
    pause: () => send('pause'),
    resume: () => send('resume'),
    next: () => send('next'),
    finish: () => send('finish'),
    reset: () => send('reset'),
    addRound: (delta = 1) => send('addRound', { delta }),
  };
};
