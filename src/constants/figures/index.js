import { ARM_FIGURES } from './arms';
import { BACK_FIGURES } from './back';
import { CHEST_FIGURES } from './chest';
import { CONDITIONING_FIGURES } from './conditioning';
import { CORE_FIGURES } from './core';
import { LEG_FIGURES } from './legs';
import { SHOULDER_FIGURES } from './shoulders';

// Figura de cada ejercicio del catálogo: { build: fase → escena, phases?, view?, focus? }.
export const FIGURES = Object.freeze({ ...CHEST_FIGURES, ...BACK_FIGURES, ...SHOULDER_FIGURES, ...ARM_FIGURES, ...LEG_FIGURES, ...CORE_FIGURES, ...CONDITIONING_FIGURES });
