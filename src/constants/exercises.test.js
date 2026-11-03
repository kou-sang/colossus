import { describe, expect, it } from 'vitest';
import { buildExerciseFrames } from '../utils/exerciseFrames';
import { checkAnatomy } from '../utils/figure/skeleton';
import { COACH_CUES } from './coachCues';
import { EXERCISE_GUIDES, GUIDE_FAMILIES, getExerciseGuide } from './exerciseGuides';
import { canonicalExerciseName, CATALOG_INTEGRITY_PROBLEMS, EXERCISE_CATALOG, getExerciseCategory, getRetiredActivity, resolveMuscleDistribution } from './exercises';
import { FIGURES } from './figures';
import { CATEGORIES } from './muscles';

const names = Object.keys(EXERCISE_CATALOG);
const VIEWS = ['side', 'front', 'top'];

describe('catálogo de ejercicios', () => {
  it('no tiene problemas de integridad (duplicados, códigos desconocidos, sumas ≠ 100)', () => {
    expect(CATALOG_INTEGRITY_PROBLEMS).toEqual([]);
  });

  it('ronda los 400 ejercicios y ya no incluye Baile ni Deportes', () => {
    expect(names.length).toBeGreaterThanOrEqual(380);
    expect(names.length).toBeLessThan(430);
    const categories = new Set(Object.values(EXERCISE_CATALOG).map((entry) => entry.category));
    expect([...categories].filter((category) => category === 'BAILE' || category === 'DEPORTES')).toEqual([]);
    expect(Object.keys(CATEGORIES)).not.toContain('BAILE');
    expect(Object.keys(CATEGORIES)).not.toContain('DEPORTES');
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

  it('las actividades retiradas (baile y deportes) se siguen resolviendo para el historial', () => {
    expect(getRetiredActivity('FUTBOL')).toBeTruthy();
    expect(getExerciseCategory({ exercise: 'FUTBOL' })).toBe('CARDIO');
    expect(getExerciseCategory({ exercise: 'zumba' })).toBe('CARDIO');
    const distribution = resolveMuscleDistribution({ exercise: 'PADEL' });
    expect(Object.values(distribution).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
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
});

describe('fichas de técnica', () => {
  it('cada ejercicio tiene ficha con familia válida y al menos 3 pasos', () => {
    expect(names.filter((name) => !EXERCISE_GUIDES[name])).toEqual([]);
    expect(Object.keys(EXERCISE_GUIDES).filter((name) => !EXERCISE_CATALOG[name])).toEqual([]);
    expect(names.filter((name) => !GUIDE_FAMILIES[EXERCISE_GUIDES[name].family])).toEqual([]);
    expect(names.filter((name) => EXERCISE_GUIDES[name].steps.length < 3 || !EXERCISE_GUIDES[name].tip)).toEqual([]);
  });

  it('ningún paso ni consejo propio se repite entre ejercicios distintos', () => {
    const steps = new Map();
    const tips = new Map();
    const repeated = [];
    names.forEach((name) => {
      const guide = EXERCISE_GUIDES[name];
      guide.steps.forEach((step) => {
        if (steps.has(step)) repeated.push(`${name} / ${steps.get(step)}: ${step}`);
        else steps.set(step, name);
      });
      if (tips.has(guide.tip)) repeated.push(`${name} / ${tips.get(guide.tip)}: ${guide.tip}`);
      else tips.set(guide.tip, name);
    });
    expect(repeated).toEqual([]);
  });

  it('cada familia tiene consejos y errores, y `cuesFrom` apunta a claves existentes', () => {
    const incomplete = Object.entries(GUIDE_FAMILIES)
      .filter(([, family]) => family.tips.length < 2 || family.mistakes.length < 2 || (family.cuesFrom && !COACH_CUES[family.cuesFrom]))
      .map(([id]) => id);
    expect(incomplete).toEqual([]);
  });

  it('todas las fichas exponen claves de entrenador', () => {
    expect(names.filter((name) => getExerciseGuide(name).coachCues.length === 0)).toEqual([]);
  });
});

// Renderiza ~1200 SVG y ~1200 esqueletos: se amplía el timeout por defecto (5 s) de vitest.
const HEAVY_TIMEOUT = 120000;

describe('ilustraciones', () => {
  it('cada ejercicio tiene figura y se genera en las 3 vistas sin valores inválidos', () => {
    expect(names.filter((name) => !FIGURES[name])).toEqual([]);
    const broken = [];
    names.forEach((name) => VIEWS.forEach((view) => {
      const frames = buildExerciseFrames(name, view);
      if (!frames || frames.length !== 3 || frames.some((svg) => !svg.startsWith('<svg') || svg.includes('NaN'))) broken.push(`${name} (${view})`);
    }));
    expect(broken).toEqual([]);
  }, HEAVY_TIMEOUT);

  it('no hay dos ejercicios con el mismo dibujo', () => {
    const seen = new Map();
    const duplicates = [];
    names.forEach((name) => {
      // El nombre va en el aria-label: se quita para comparar solo el dibujo.
      const drawing = VIEWS.map((view) => buildExerciseFrames(name, view).join('')).join('|').replaceAll(name, '');
      if (seen.has(drawing)) duplicates.push(`${seen.get(drawing)} = ${name}`);
      else seen.set(drawing, name);
    });
    expect(duplicates).toEqual([]);
  }, HEAVY_TIMEOUT);

  it('todas las posturas son anatómicamente posibles (articulaciones, piso)', () => {
    const issues = [];
    names.forEach((name) => {
      const figure = FIGURES[name];
      (figure.phases ?? [0, 0.5, 1]).forEach((phase) => {
        const problems = checkAnatomy(figure.build(phase).skeleton);
        if (problems.length) issues.push(`${name} @${phase}: ${problems.join(', ')}`);
      });
    });
    expect(issues).toEqual([]);
  }, HEAVY_TIMEOUT);
});
