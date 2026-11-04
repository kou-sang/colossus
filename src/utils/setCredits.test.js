import { describe, expect, it } from 'vitest';
import { creditsFromDistribution, muscleCreditsOf } from './setCredits';

describe('créditos de serie por músculo', () => {
  it('principal = 1, sinergista = 0,5, estabilizador proporcional', () => {
    const credits = creditsFromDistribution({ a: 0.4, b: 0.2, c: 0.1, d: 0.02 });
    expect([credits.a, credits.b, credits.c]).toEqual([1, 1, 0.5]);
    expect(credits.d).toBeCloseTo(0.125, 5);
  });

  it('las actividades de resistencia no superan media serie por músculo', () => {
    const running = muscleCreditsOf({ exercise: 'RUNNING' });
    expect(Math.max(...Object.values(running))).toBe(0.5);
    expect(muscleCreditsOf({ exercise: 'SENTADILLA' }).gluteo_mayor).toBe(1);
  });
});
