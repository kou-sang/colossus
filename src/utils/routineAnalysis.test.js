import { describe, expect, it } from 'vitest';
import { WEEK_DAYS } from './dates';
import { analyzeRoutine } from './routineAnalysis';

const routineWith = (days) => ({ days: Object.fromEntries(WEEK_DAYS.map((day) => [day, days[day] ?? []])) });

describe('analyzeRoutine', () => {
  it('reparte el 100% entre categorías y detecta músculos sin trabajar', () => {
    const analysis = analyzeRoutine(routineWith({ lunes: [{ exercise: 'PRESS BANCA', sets: 4 }] }));
    const total = analysis.byCategory.reduce((sum, category) => sum + category.percent, 0);
    expect(total).toBeGreaterThan(99.4);
    expect(total).toBeLessThan(100.6);
    expect(analysis.untrained.map((muscle) => muscle.id)).toContain('gemelos');
    expect(analysis.untrained.map((muscle) => muscle.id)).not.toContain('pecho_medio');
  });

  it('avisa cuando hay mucho más empuje que tirón', () => {
    const analysis = analyzeRoutine(routineWith({ lunes: [{ exercise: 'PRESS BANCA', sets: 8 }, { exercise: 'PRESS MILITAR', sets: 6 }], martes: [{ exercise: 'REMO BAJO', sets: 2 }] }));
    expect(analysis.insights.some((insight) => insight.text.includes('Empujas'))).toBe(true);
  });

  it('una rutina vacía no rompe', () => {
    expect(analyzeRoutine(routineWith({})).exerciseCount).toBe(0);
  });
});
