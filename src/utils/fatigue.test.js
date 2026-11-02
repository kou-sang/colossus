import { describe, expect, it } from 'vitest';
import { buildMuscleFatigue } from './fatigue';

const now = new Date('2026-11-02T12:00:00');
const squat = (extra = {}) => ({ userId: 'a', exercise: 'SENTADILLA', sets: 5, performedAt: new Date('2026-11-02T08:00:00'), ...extra });
const fatigueOf = (log) => buildMuscleFatigue([log], { userIds: ['a'], now }).vasto_lateral.percent;

describe('buildMuscleFatigue', () => {
  it('un músculo no entrenado está fresco', () => {
    expect(buildMuscleFatigue([squat()], { userIds: ['a'], now }).pecho_medio.percent).toBe(0);
  });

  it('el RIR pondera la fatiga: al fallo > sin dato > lejos del fallo', () => {
    expect(fatigueOf(squat({ rir: 0 }))).toBeGreaterThan(fatigueOf(squat()));
    expect(fatigueOf(squat())).toBeGreaterThan(fatigueOf(squat({ rir: 4 })));
  });

  it('la fatiga se disipa con el tiempo y se ignora lo de hace más de 7 días', () => {
    const old = squat({ performedAt: new Date('2026-10-30T08:00:00') });
    expect(fatigueOf(old)).toBeLessThan(fatigueOf(squat()));
    expect(fatigueOf(squat({ performedAt: new Date('2026-10-20T08:00:00') }))).toBe(0);
  });
});
