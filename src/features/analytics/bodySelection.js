import { CATEGORIES, MUSCLE_BY_ID, musclesOfCategory } from '../../constants/muscles';

/*
 * Filtro unificado de Analíticas: categorías y músculos en una sola selección múltiple.
 *  - `null` = todo.
 *  - { categories, muscles }: `categories` son categorías completas ("Todos" de esa categoría, o una categoría sin
 *    músculos propios como Cardio); `muscles` son músculos sueltos de categorías que NO están completas.
 * Si se eligen todos los músculos de una categoría uno por uno, se agrupan como la categoría completa.
 */

const categoryMuscleIds = (categoryId) => musclesOfCategory(categoryId).map((muscle) => muscle.id);

export const MUSCLE_CATEGORIES = Object.freeze(CATEGORIES.filter(({ id }) => categoryMuscleIds(id).length > 0));
export const ACTIVITY_CATEGORIES = Object.freeze(CATEGORIES.filter(({ id }) => categoryMuscleIds(id).length === 0));

const normalize = ({ categories, muscles }) => {
  const nextCategories = [...new Set(categories)];
  let nextMuscles = [...new Set(muscles)].filter((id) => !nextCategories.includes(MUSCLE_BY_ID[id]?.category));
  // Todos los músculos de una categoría elegidos uno a uno → la categoría completa.
  MUSCLE_CATEGORIES.forEach(({ id }) => {
    const ids = categoryMuscleIds(id);
    if (!nextCategories.includes(id) && ids.every((muscleId) => nextMuscles.includes(muscleId))) {
      nextCategories.push(id);
      nextMuscles = nextMuscles.filter((muscleId) => !ids.includes(muscleId));
    }
  });
  return nextCategories.length || nextMuscles.length ? { categories: nextCategories, muscles: nextMuscles } : null;
};

export const isCategorySelected = (selection, categoryId) => Boolean(selection?.categories.includes(categoryId));

export const isMuscleSelected = (selection, muscleId) =>
  Boolean(selection && (selection.muscles.includes(muscleId) || selection.categories.includes(MUSCLE_BY_ID[muscleId]?.category)));

export const toggleCategory = (selection, categoryId) => {
  const base = selection ?? { categories: [], muscles: [] };
  if (base.categories.includes(categoryId)) return normalize({ ...base, categories: base.categories.filter((id) => id !== categoryId) });
  return normalize({ categories: [...base.categories, categoryId], muscles: base.muscles });
};

export const toggleMuscle = (selection, muscleId) => {
  const base = selection ?? { categories: [], muscles: [] };
  const categoryId = MUSCLE_BY_ID[muscleId]?.category;
  // Quitar un músculo de una categoría completa: quedan elegidos los demás de esa categoría.
  if (base.categories.includes(categoryId)) {
    return normalize({
      categories: base.categories.filter((id) => id !== categoryId),
      muscles: [...base.muscles, ...categoryMuscleIds(categoryId).filter((id) => id !== muscleId)],
    });
  }
  const muscles = base.muscles.includes(muscleId) ? base.muscles.filter((id) => id !== muscleId) : [...base.muscles, muscleId];
  return normalize({ categories: base.categories, muscles });
};

// Músculos alcanzados por la selección (sueltos + los de categorías completas). null = sin recorte por músculo.
export const selectionMuscles = (selection) => {
  if (!selection) return null;
  const ids = [...selection.muscles, ...selection.categories.flatMap(categoryMuscleIds)];
  return ids.length ? [...new Set(ids)] : null;
};

// Alcance para filterLogs: categoría elegida O algún músculo elegido.
export const selectionScope = (selection) => (selection ? { categories: selection.categories, muscles: selectionMuscles(selection) ?? [] } : null);

export const summarizeSelection = (selection) => {
  if (!selection) return 'todo';
  const labels = [
    ...selection.categories.map((id) => CATEGORIES.find((category) => category.id === id)?.label ?? id),
    ...selection.muscles.map((id) => MUSCLE_BY_ID[id]?.short ?? id),
  ];
  return labels.length <= 3 ? labels.join(', ') : `${labels.slice(0, 2).join(', ')} y ${labels.length - 2} más`;
};

export const isOnlyMuscle = (selection, muscleId) =>
  Boolean(selection && selection.categories.length === 0 && selection.muscles.length === 1 && selection.muscles[0] === muscleId);
