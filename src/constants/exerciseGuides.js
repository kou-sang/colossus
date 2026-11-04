/*
 * Ficha técnica de cada ejercicio de la biblioteca (desde 4.6.0).
 * - Cada ejercicio tiene sus propios pasos (coinciden con su dibujo), un consejo propio y, si aplica, un error típico.
 * - GUIDE_FAMILIES (guides/families.js): consejos y errores compartidos que valen para todos los integrantes de la familia.
 * - Las claves de entrenadores (coachCues.js) se buscan por familia (o por `cuesFrom`).
 * Los músculos NO se repiten aquí: salen del diccionario (constants/exercises.js), así la ficha y las analíticas coinciden.
 */

import { COACH_CUES } from './coachCues';
import { ARM_GUIDES } from './guides/arms';
import { BACK_GUIDES } from './guides/back';
import { CHEST_GUIDES } from './guides/chest';
import { CONDITIONING_GUIDES } from './guides/conditioning';
import { CORE_GUIDES } from './guides/core';
import { GUIDE_FAMILIES as FAMILIES } from './guides/families';
import { LEG_GUIDES } from './guides/legs';
import { SHOULDER_GUIDES } from './guides/shoulders';

export const GUIDE_FAMILIES = Object.freeze(FAMILIES);

export const EXERCISE_GUIDES = Object.freeze({
  ...CHEST_GUIDES,
  ...BACK_GUIDES,
  ...SHOULDER_GUIDES,
  ...ARM_GUIDES,
  ...LEG_GUIDES,
  ...CORE_GUIDES,
  ...CONDITIONING_GUIDES,
});

export const getExerciseGuide = (name) => {
  const guide = EXERCISE_GUIDES[name];
  if (!guide) return null;
  const family = GUIDE_FAMILIES[guide.family] ?? { tips: [], mistakes: [] };
  return {
    family: guide.family,
    steps: guide.steps,
    tips: [guide.tip, ...family.tips].filter(Boolean),
    mistakes: [guide.mistake, ...family.mistakes].filter(Boolean),
    coachCues: COACH_CUES[guide.family] ?? COACH_CUES[family.cuesFrom] ?? [],
  };
};
