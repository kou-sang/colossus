import { FIGURES } from '../constants/figures';
import { measureScene, renderScene } from './figure/render';

/*
 * Ilustraciones de cada ejercicio: 3 fotogramas (inicio, mitad, final) en 3 vistas (lateral, frontal, superior).
 * Cada ejercicio define su movimiento como una función de la fase (0 → 1) en constants/figures/*: el esqueleto se
 * resuelve con cinemática inversa (pies apoyados, manos en la barra) y se dibuja con volumen muscular (utils/figure/*).
 */

export const FRAME_LABELS = Object.freeze(['Inicio', 'Mitad', 'Final']);
export const VIEW_OPTIONS = Object.freeze([
  { value: 'side', label: 'Lateral' },
  { value: 'front', label: 'Frontal' },
  { value: 'top', label: 'Superior' },
]);

const ASPECT = 200 / 196;
const FRAME_PADDING = 7;
const MIN_FRAME_WIDTH = 120;

// Encuadre común a los 3 fotogramas: misma escala, así el movimiento se compara sin saltos de zoom.
// `focus` acerca la cámara a ciertas partes del cuerpo (manos y antebrazos en los ejercicios de agarre).
const fitViewBox = (scenes, view, focus) => {
  const boxes = scenes.map((scene) => measureScene(scene, view, focus));
  const pad = focus ? 12 : FRAME_PADDING;
  let minX = Math.min(...boxes.map((b) => b[0])) - pad;
  let minY = Math.min(...boxes.map((b) => b[1])) - pad;
  const maxX = Math.max(...boxes.map((b) => b[2])) + pad;
  const maxY = Math.max(...boxes.map((b) => b[3])) + pad;
  let width = Math.max(maxX - minX, focus ? 60 : MIN_FRAME_WIDTH);
  let height = maxY - minY;
  if (width / height > ASPECT) height = width / ASPECT;
  else width = height * ASPECT;
  const cx = (minX + maxX) / 2;
  minX = cx - width / 2;
  // Con piso, el cuadro se apoya abajo; en la vista superior (o con foco) se centra.
  minY = view === 'top' || focus ? (minY + maxY) / 2 - height / 2 : maxY - height;
  return [minX, minY, width, height];
};

// Vista que mejor muestra el movimiento.
export const defaultViewFor = (name) => FIGURES[name]?.view ?? 'side';

// Escenas 3D de un ejercicio (una por fotograma). null si no tiene figura.
export const buildExerciseScenes = (name) => {
  const figure = FIGURES[name];
  if (!figure) return null;
  return (figure.phases ?? [0, 0.5, 1]).map((phase) => figure.build(phase));
};

/**
 * Tres fotogramas en SVG para un ejercicio y una vista. null si no tiene figura.
 * Memoizado por nombre y vista (el tema se aplica con variables CSS).
 */
const cache = new Map();
export const buildExerciseFrames = (name, view = 'side') => {
  const cacheKey = `${name}|${view}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  let result = null;
  try {
    const scenes = buildExerciseScenes(name);
    if (scenes) {
      const viewBox = fitViewBox(scenes, view, FIGURES[name].focus ?? null);
      const viewLabel = VIEW_OPTIONS.find((option) => option.value === view)?.label.toLowerCase() ?? '';
      result = scenes.map((scene, index) => renderScene(scene, view, viewBox, `${name}: ${FRAME_LABELS[index].toLowerCase()}, vista ${viewLabel}`));
    }
  } catch (renderError) {
    if (import.meta.env?.DEV) console.warn('[exerciseFrames]', name, renderError);
    result = null; // Un dibujo roto nunca debe romper la ficha.
  }
  cache.set(cacheKey, result);
  return result;
};
