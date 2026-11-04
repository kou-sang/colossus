import { describe, expect, it } from 'vitest';
import { isCategorySelected, isMuscleSelected, isOnlyMuscle, selectionMuscles, selectionScope, toggleCategory, toggleMuscle } from './bodySelection';

describe('filtro unificado de músculos y categorías', () => {
  it('"Todos" de una categoría elige todos sus músculos y vuelve a "todo" al quitarlo', () => {
    const chest = toggleCategory(null, 'PECHO');
    expect(isCategorySelected(chest, 'PECHO')).toBe(true);
    expect(isMuscleSelected(chest, 'pecho_medio')).toBe(true);
    expect(selectionMuscles(chest)).toEqual(['pecho_superior', 'pecho_medio', 'pecho_inferior']);
    expect(toggleCategory(chest, 'PECHO')).toBeNull();
  });

  it('quitar un músculo de una categoría completa deja elegidos los demás', () => {
    const next = toggleMuscle(toggleCategory(null, 'PECHO'), 'pecho_inferior');
    expect(isCategorySelected(next, 'PECHO')).toBe(false);
    expect(next.muscles).toEqual(['pecho_superior', 'pecho_medio']);
  });

  it('elegir uno por uno todos los músculos de una categoría la marca completa', () => {
    const next = ['pecho_superior', 'pecho_medio', 'pecho_inferior'].reduce(toggleMuscle, null);
    expect(next).toEqual({ categories: ['PECHO'], muscles: [] });
  });

  it('combina categorías sin músculos (Cardio) con músculos sueltos', () => {
    const next = toggleMuscle(toggleCategory(null, 'CARDIO'), 'biceps');
    expect(selectionScope(next)).toEqual({ categories: ['CARDIO'], muscles: ['biceps'] });
    expect(isOnlyMuscle(next, 'biceps')).toBe(false);
    expect(isOnlyMuscle(toggleMuscle(null, 'biceps'), 'biceps')).toBe(true);
    expect(selectionMuscles(toggleCategory(null, 'CARDIO'))).toBeNull();
  });
});
