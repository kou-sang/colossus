import { describe, expect, it } from 'vitest';
import { sanitizeLogEntry } from '../services/validation';
import { computeTonnage } from './metrics';
import { formatSetDetails, suggestNextLoad } from './sets';

describe('series detalladas y RIR', () => {
  it('resume con la mejor serie (mayor 1RM estimado) y suma el tonelaje real', () => {
    const entry = sanitizeLogEntry({ exercise: 'press banca', setDetails: [
      { reps: '10', weight: '60', rir: 2 }, { reps: '8', weight: '62.5', rir: 1 }, { reps: '6', weight: '65' }, { reps: '', weight: '' },
    ] });
    expect(entry).toMatchObject({ exercise: 'PRESS BANCA', sets: 3, reps: 10, weight: 60, rir: 1 });
    expect(computeTonnage(entry)).toBe(600 + 500 + 390);
    expect(formatSetDetails(entry.setDetails)).toBe('60×10 @2 · 62,5×8 @1 · 65×6');
  });

  it('los registros sin detalle siguen funcionando igual', () => {
    const entry = sanitizeLogEntry({ exercise: 'remo con barra', sets: 4, reps: 8, weight: 50 });
    expect(entry.setDetails).toBeUndefined();
    expect(entry.rir).toBeNull();
    expect(computeTonnage(entry)).toBe(1600);
  });

  it('rechaza valores fuera de rango', () => {
    expect(() => sanitizeLogEntry({ exercise: 'x', sets: 3, rir: 11 })).toThrow();
    expect(() => sanitizeLogEntry({ exercise: 'x', setDetails: [{ reps: 0.5, weight: 10 }] })).toThrow();
  });

  it('sugiere la próxima carga según el RIR', () => {
    expect(suggestNextLoad({ weight: 60, reps: 10, rir: 3 }).weight).toBe(62.5);
    expect(suggestNextLoad({ weight: 60, reps: 8, rir: 2 }).reps).toBe(9);
    expect(suggestNextLoad({ weight: 60, reps: 8, rir: 0 })).toMatchObject({ weight: 60, reps: 8 });
    expect(suggestNextLoad({ weight: null, reps: 8 })).toBeNull();
  });
});
