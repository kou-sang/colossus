import { detectGear, EXERCISE_GUIDES } from '../constants/exerciseGuides';
import { POSES } from '../constants/exercisePoses';
import { FIGURE_SIZE, interpolatePose, measurePose, renderPoseSvg } from './poseFigure';

// Anclaje de polea por defecto (baja, al frente) para ejercicios que en la ficha usan polea y el patrón no define uno.
const DEFAULT_CABLE_ANCHOR = [56, 28];

const gearProp = (gear, pattern) => {
  switch (gear) {
    case 'barbell': return { type: 'barbell' };
    case 'dumbbell': return { type: 'dumbbell' };
    case 'kettlebell': return { type: 'kettlebell' };
    case 'plate': return { type: 'plate' };
    case 'wheel': return { type: 'wheel' };
    case 'cable': return { type: 'cable', to: pattern.cableTo ?? DEFAULT_CABLE_ANCHOR, dual: Boolean(pattern.dualCable) };
    default: return null; // 'machine' | 'none': sin implemento en la mano
  }
};

// Reemplaza el marcador { type: 'gear' } por el implemento real, conservando sus opciones (posición, desplazamiento…).
const resolveFrame = (frame, gear, pattern) => {
  const base = gearProp(gear, pattern);
  const props = (frame.props ?? [])
    .map((prop) => {
      if (prop.type !== 'gear') return prop;
      if (!base) return null;
      const { type: _placeholder, ...options } = prop;
      return { ...base, ...options, type: base.type };
    })
    .filter(Boolean);
  return { ...frame, props };
};

const FRAME_PADDING = 8;
const MIN_FRAME_WIDTH = 110; // evita zooms exagerados en ejercicios con poco recorrido
const ASPECT = FIGURE_SIZE.width / FIGURE_SIZE.height;

// Encuadre común a los 3 fotogramas: misma escala → el movimiento se compara sin saltos de zoom.
const fitViewBox = (frames, view) => {
  const boxes = frames.map((frame) => measurePose(frame, view));
  let [minX, minY, maxX, maxY] = [Math.min(...boxes.map((b) => b[0])), Math.min(...boxes.map((b) => b[1])), Math.max(...boxes.map((b) => b[2])), Math.max(...boxes.map((b) => b[3]))];
  minX -= FRAME_PADDING; minY -= FRAME_PADDING; maxX += FRAME_PADDING; maxY += FRAME_PADDING;
  let width = Math.max(maxX - minX, MIN_FRAME_WIDTH);
  let height = maxY - minY;
  if (width / height > ASPECT) height = width / ASPECT;
  else width = height * ASPECT;
  const cx = (minX + maxX) / 2;
  // Con piso, se ancla abajo (el piso queda al pie del cuadro); sin piso, se centra.
  const top = view === 'top' ? (minY + maxY) / 2 - height / 2 : maxY - height;
  return [cx - width / 2, top, width, height];
};

export const FRAME_LABELS = Object.freeze(['Inicio', 'Mitad', 'Final']);
export const VIEW_OPTIONS = Object.freeze([
  { value: 'side', label: 'Lateral' },
  { value: 'front', label: 'Frontal' },
  { value: 'top', label: 'Superior' },
]);

// Vista que mejor muestra el movimiento: la del plano en que se definió el patrón.
export const defaultViewFor = (name) => {
  const guide = EXERCISE_GUIDES[name];
  return POSES[guide?.pose]?.view === 'front' ? 'front' : 'side';
};

/**
 * Tres fotogramas (inicio, mitad, final) en SVG para un ejercicio del catálogo y una vista. null si no tiene ficha.
 * Memoizado por nombre y vista (el tema se aplica por variables CSS).
 */
const cache = new Map();
export const buildExerciseFrames = (name, view = 'side') => {
  const cacheKey = `${name}|${view}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  let result = null;
  try {
    const guide = EXERCISE_GUIDES[name];
    const pattern = guide ? POSES[guide.pose] : null;
    if (pattern) {
      const gear = guide.gear ?? detectGear(name, pattern.gear);
      const [first, second, third] = pattern.frames;
      const frames = third ? [first, second, third] : [first, interpolatePose(first, second), second];
      const viewLabel = VIEW_OPTIONS.find((option) => option.value === view)?.label.toLowerCase() ?? '';
      const resolved = frames.map((frame) => resolveFrame(frame, gear, pattern));
      const viewBox = fitViewBox(resolved, view);
      result = resolved.map((frame, index) => renderPoseSvg(frame, { view, viewBox, title: `${name}: ${FRAME_LABELS[index].toLowerCase()}, vista ${viewLabel}` }));
    }
  } catch (renderError) {
    if (import.meta.env?.DEV) console.warn('[exerciseFrames]', name, renderError);
    result = null; // Un dibujo roto nunca debe romper la ficha.
  }
  cache.set(cacheKey, result);
  return result;
};
