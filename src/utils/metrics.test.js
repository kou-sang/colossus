import { describe, expect, it } from 'vitest';
import { buildMuscleLastTrained, buildMuscleTimeline, buildStrengthIndexSeries, filterLogs, stimulusThreshold } from './metrics';

const day = (n, hour = 10) => new Date(2026, 9, n, hour);
const log = (exercise, n, e1rm, extra = {}) => ({ id: `${exercise}-${n}`, userId: 'u1', exercise, performedAt: day(n), e1rm, sets: 3, ...extra });

describe('filterLogs con alcance unificado', () => {
  const logs = [log('PRESS BANCA', 1, 100), log('RUNNING', 1, null), log('CURL CON BARRA', 2, 40)];

  it('pasa si la categoría está elegida O si trabaja algún músculo elegido', () => {
    const names = (scope) => filterLogs(logs, { scope }).map((item) => item.exercise);
    expect(names({ categories: ['CARDIO'], muscles: [] })).toEqual(['RUNNING']);
    expect(names({ categories: ['CARDIO'], muscles: ['biceps'] })).toEqual(['RUNNING', 'CURL CON BARRA']);
    expect(names(null)).toHaveLength(3);
  });
});

describe('progresión de fuerza promedio de la selección', () => {
  it('promedia el % de cambio de cada ejercicio respecto de su primer registro', () => {
    const points = buildStrengthIndexSeries([
      log('PRESS BANCA', 1, 100),
      log('CURL CON BARRA', 2, 40),
      log('PRESS BANCA', 3, 110),
      log('CURL CON BARRA', 4, 44),
    ], 'u1');
    expect(points.map((point) => point.change)).toEqual([0, 0, 5, 10]);
    expect(points.map((point) => point.exercises)).toEqual([1, 2, 2, 2]);
  });

  it('pondera por los músculos elegidos y descarta ejercicios que no los trabajan', () => {
    const logs = [log('PRESS BANCA', 1, 100), log('CURL CON BARRA', 1, 40), log('CURL CON BARRA', 2, 48)];
    const onlyBiceps = buildStrengthIndexSeries(logs, 'u1', { muscleScope: ['biceps'] });
    expect(onlyBiceps.map((point) => point.change)).toEqual([0, 20]);
    expect(onlyBiceps[1].exercises).toBe(1);
  });

  it('un punto por día con el mejor 1RM, o uno por registro sin unificar', () => {
    const logs = [log('PRESS BANCA', 1, 100), { ...log('PRESS BANCA', 1, 105), id: 'b', performedAt: day(1, 18) }, log('PRESS BANCA', 2, 110)];
    expect(buildStrengthIndexSeries(logs, 'u1').map((point) => point.change)).toEqual([0, 4.8]);
    expect(buildStrengthIndexSeries(logs, 'u1', { unifyDays: false }).map((point) => point.change)).toEqual([0, 5, 10]);
  });
});

describe('historial de un músculo (detalle de Recuperación)', () => {
  it('lista los estímulos del más reciente al más viejo con el % del ejercicio', () => {
    const logs = [log('PESO MUERTO RUMANO', 1, 120), log('CURL FEMORAL SENTADO', 3, 50), log('PRESS BANCA', 4, 100)];
    const entries = buildMuscleTimeline(logs, 'semitendinoso', ['u1']);
    expect(entries.map((entry) => entry.exercise)).toEqual(['CURL FEMORAL SENTADO', 'PESO MUERTO RUMANO']);
    expect(entries[0].share).toBeGreaterThan(0.15);
    expect(entries[0].effectiveSets).toBeCloseTo(3 * entries[0].share, 1);
  });

  it('manos y pies cuentan desde 5 % (son músculos chicos)', () => {
    expect(stimulusThreshold('pie')).toBe(0.05);
    expect(stimulusThreshold('pecho_medio')).toBe(0.15);
    const last = buildMuscleLastTrained([log('RUNNING', 2, null), log('HAND GRIP', 3, null)], null);
    expect(last.pie.exercise).toBe('RUNNING');
    expect(last.mano_palma.exercise).toBe('HAND GRIP');
  });
});
