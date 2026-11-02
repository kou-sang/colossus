import { describe, expect, it } from 'vitest';
import { buildExerciseFrames } from '../utils/exerciseFrames';
import { EXERCISE_GUIDES, GUIDE_FAMILIES } from './exerciseGuides';
import { POSES } from './exercisePoses';
import { canonicalExerciseName, CATALOG_INTEGRITY_PROBLEMS, EXERCISE_CATALOG, resolveMuscleDistribution } from './exercises';

const names = Object.keys(EXERCISE_CATALOG);

describe('catálogo de ejercicios', () => {
  it('no tiene problemas de integridad (duplicados, códigos desconocidos, sumas ≠ 100)', () => {
    expect(CATALOG_INTEGRITY_PROBLEMS).toEqual([]);
  });

  it('no hay dos ejercicios distintos con la misma distribución muscular', () => {
    const seen = new Map();
    const duplicates = [];
    Object.values(EXERCISE_CATALOG).forEach((entry) => {
      const key = JSON.stringify(Object.entries(entry.distribution).sort());
      if (seen.has(key)) duplicates.push(`${seen.get(key)} = ${entry.name}`);
      else seen.set(key, entry.name);
    });
    expect(duplicates).toEqual([]);
  });

  it('cada ejercicio tiene ficha, familia y patrón de dibujo', () => {
    expect(names.filter((name) => !EXERCISE_GUIDES[name])).toEqual([]);
    expect(Object.entries(EXERCISE_GUIDES).filter(([, guide]) => !GUIDE_FAMILIES[guide.family] || !POSES[guide.pose]).map(([name]) => name)).toEqual([]);
  });

  it('curl de muñeca y curl de muñeca invertido trabajan músculos distintos', () => {
    expect(Object.keys(EXERCISE_CATALOG['CURL DE MUÑECA'].distribution)).toEqual(['antebrazo_flexores']);
    expect(EXERCISE_CATALOG['CURL DE MUÑECA INVERTIDO'].distribution).toHaveProperty('antebrazo_extensores');
  });

  it('los alias y el id legado "antebrazos" se resuelven', () => {
    expect(canonicalExerciseName('alt con mancuerna')).toBe('CURL ALTERNADO CON MANCUERNAS');
    const legacy = resolveMuscleDistribution({ exercise: 'EJERCICIO INVENTADO XYZ', muscle: 'antebrazos' });
    expect(Object.values(legacy).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
  });

  it('todas las ilustraciones se generan en las 3 vistas', () => {
    const broken = [];
    names.forEach((name) => ['side', 'front', 'top'].forEach((view) => {
      const frames = buildExerciseFrames(name, view);
      if (!frames || frames.length !== 3 || frames.some((svg) => !svg.startsWith('<svg') || svg.includes('NaN'))) broken.push(`${name} (${view})`);
    }));
    expect(broken).toEqual([]);
  });
});
