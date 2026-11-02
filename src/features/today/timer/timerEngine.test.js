import { describe, expect, it } from 'vitest';
import { buildPhases, createTimerState, describeTimer, formatClock, sanitizeTimerConfig, timerReducer } from './timerEngine';

const run = (phases, actions) => actions.reduce((state, [type, now, extra = {}]) => timerReducer(state, { type, phases, now, ...extra }), createTimerState());

describe('timerEngine', () => {
  it('arma las fases de un Tabata (sin descanso después de la última ronda)', () => {
    const phases = buildPhases(sanitizeTimerConfig('tabata', { rounds: 2, workSec: 20, restSec: 10, prepSec: 5 }));
    expect(phases.map((phase) => phase.kind)).toEqual(['prep', 'work', 'rest', 'work']);
  });

  it('salta varias fases si la pestaña estuvo suspendida y descuenta las pausas', () => {
    const phases = buildPhases(sanitizeTimerConfig('tabata', { rounds: 2, workSec: 20, restSec: 10, prepSec: 5 }));
    let state = run(phases, [['start', 0], ['tick', 26_000]]);
    expect(state.phaseIndex).toBe(2); // prep (5) + trabajo (20) ya pasaron
    state = run(phases, [['start', 0], ['tick', 26_000], ['pause', 27_000], ['resume', 37_000]]);
    expect(Math.round(describeTimer(state, phases, 37_000).remainingMs)).toBe(8000);
    state = timerReducer(state, { type: 'tick', phases, now: 100_000 });
    expect(state.status).toBe('done');
    expect(state.completedWork).toBe(2);
    expect(formatClock(describeTimer(state, phases, 100_000).displayMs)).toBe('0:55');
  });

  it('en "Series + descanso" la serie a tu ritmo termina con "Serie hecha"', () => {
    const phases = buildPhases(sanitizeTimerConfig('classic', { rounds: 3, workSec: 0, restSec: 60, prepSec: 0 }));
    expect(phases[0].duration).toBeNull();
    let state = run(phases, [['start', 0], ['tick', 50_000]]);
    expect(state.phaseIndex).toBe(0); // fase abierta: no avanza sola
    state = timerReducer(state, { type: 'next', phases, now: 50_000 });
    expect(state).toMatchObject({ phaseIndex: 1, completedWork: 1 });
  });

  it('acota configuraciones absurdas', () => {
    expect(sanitizeTimerConfig('amrap', { totalMin: 999 }).totalMin).toBe(120);
    expect(sanitizeTimerConfig('modo-inexistente', {}).mode).toBe('classic');
  });
});
