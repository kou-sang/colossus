import { smoothClosedPath } from '../../constants/anatomy';
import { buildBodyParts } from './body';
import { FLOOR_Y } from './skeleton';

/*
 * Proyección ortográfica en 3 vistas y dibujo SVG (orden de pintor: de atrás hacia adelante).
 * Cada parte del cuerpo se dibuja en dos pasadas (contorno + relleno) para que la unión de sus piezas
 * se vea como una sola silueta orgánica, separada de las demás partes por un borde fino.
 */

export const COLORS = Object.freeze({ body: 'var(--text)', far: 'var(--muted)', gear: 'var(--accent)', frame: 'var(--text-2)', floor: 'var(--border)', gap: 'var(--surface-2)' });

const TOP_CENTER_Y = 62;
export const PROJECTIONS = Object.freeze({
  side: { project: (p) => [p[0], p[1]], depth: (p) => p[2], camera: [0, 0, 1] },
  front: { project: (p) => [100 + p[2], p[1]], depth: (p) => p[0], camera: [1, 0, 0] },
  top: { project: (p) => [p[0], TOP_CENTER_Y + p[2]], depth: (p) => -p[1], camera: [0, -1, 0] },
});

const fmt = (value) => Math.round(value * 10) / 10;

const convexHull = (points) => {
  if (points.length < 3) return points;
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const crossZ = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list) => {
    const hull = [];
    list.forEach((point) => {
      while (hull.length >= 2 && crossZ(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) hull.pop();
      hull.push(point);
    });
    hull.pop();
    return hull;
  };
  return [...half(sorted), ...half([...sorted].reverse())];
};

// Quita vértices casi coincidentes (menos texto en el SVG, curvas igual de suaves).
const decimate = (points, minGap = 0.7) => {
  const out = [];
  points.forEach((point) => {
    const last = out[out.length - 1];
    if (!last || Math.hypot(point[0] - last[0], point[1] - last[1]) >= minGap) out.push(point);
  });
  if (out.length > 3 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) < minGap) out.pop();
  return out;
};

const hullPath = (cloud, project, smooth = true) => {
  const hull = decimate(convexHull(cloud.map(project)));
  if (hull.length < 3) return '';
  if (!smooth) return `M${hull.map((p) => `${fmt(p[0])} ${fmt(p[1])}`).join(' L')} Z`;
  return smoothClosedPath(hull, 0.45).replace(/(\d+\.\d)\d+/g, '$1');
};

const avgDepth = (points, depth) => points.reduce((sum, point) => sum + depth(point), 0) / Math.max(1, points.length);

const detailPaths = (details, projection) => {
  const segments = [];
  details.forEach((line) => {
    let run = [];
    line.forEach(({ point, normal }) => {
      const facing = normal[0] * projection.camera[0] + normal[1] * projection.camera[1] + normal[2] * projection.camera[2];
      if (facing > 0.22) run.push(projection.project(point));
      else { if (run.length > 1) segments.push(run); run = []; }
    });
    if (run.length > 1) segments.push(run);
  });
  return segments.map((run) => `M${run.map((p) => `${fmt(p[0])} ${fmt(p[1])}`).join(' L')}`).join(' ');
};

// ───────── Primitivas de implementos ─────────
// solid: nubes de puntos (envolvente convexa rellena) · line · polyline · circle.

const renderProp = (item, projection) => {
  const opacity = item.opacity ? ` opacity="${item.opacity}"` : '';
  switch (item.kind) {
    case 'solid': {
      const d = item.clouds.map((cloud) => hullPath(cloud, projection.project, item.smooth !== false)).join(' ');
      return d ? `<path d="${d}" fill="${item.fill ?? COLORS.frame}" stroke="${item.stroke ?? COLORS.gap}" stroke-width="${item.strokeWidth ?? 0.9}" stroke-linejoin="round"${opacity}/>` : '';
    }
    case 'line': {
      const [a, b] = item.pts.map(projection.project);
      return `<line x1="${fmt(a[0])}" y1="${fmt(a[1])}" x2="${fmt(b[0])}" y2="${fmt(b[1])}" stroke="${item.color ?? COLORS.frame}" stroke-width="${item.width ?? 2}" stroke-linecap="round"${item.dash ? ' stroke-dasharray="3 3"' : ''}${opacity}/>`;
    }
    case 'polyline': {
      const pts = item.pts.map(projection.project);
      return `<path d="M${pts.map((p) => `${fmt(p[0])} ${fmt(p[1])}`).join(' L')}" fill="none" stroke="${item.color ?? COLORS.frame}" stroke-width="${item.width ?? 2}" stroke-linecap="round" stroke-linejoin="round"${opacity}/>`;
    }
    case 'circle': {
      const [c] = item.pts.map(projection.project);
      return `<circle cx="${fmt(c[0])}" cy="${fmt(c[1])}" r="${fmt(item.r)}" fill="${item.fill ?? COLORS.frame}" stroke="${COLORS.gap}" stroke-width="0.9"${opacity}/>`;
    }
    default:
      return '';
  }
};

const propPoints = (item) => (item.kind === 'solid' ? item.clouds.flat() : item.pts);

/**
 * Escena: { skeleton, props, noFloor }. Devuelve los elementos ordenados con su SVG.
 */
const layoutScene = (scene, view) => {
  const projection = PROJECTIONS[view];
  const parts = buildBodyParts(scene.skeleton);
  const torso = parts.find((part) => part.id === 'torso');
  const torsoDepth = avgDepth(torso.clouds.flat(), projection.depth);
  const torsoBox = torso.clouds.flat().map(projection.project).reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [Infinity, Infinity, -Infinity, -Infinity]);
  const items = [];
  parts.forEach((part) => {
    const depth = avgDepth(part.clouds.flat(), projection.depth) + (part.id === 'neck' ? -0.5 : 0);
    items.push({ type: 'body', part, depth });
  });
  (scene.props ?? []).forEach((item) => {
    if (item.views && !item.views.includes(view)) return;
    items.push({ type: 'prop', item, depth: avgDepth(propPoints(item), projection.depth) + (item.bias ?? 0) - 0.01 });
  });
  items.sort((a, b) => a.depth - b.depth);
  return { items, projection, torsoDepth, torsoBox, view };
};

// Extremidad "lejana" (más tenue): detrás del tronco. En las vistas frontal y superior además debe quedar tapada por él.
const isFarLimb = (part, depth, layout) => {
  if (part.role !== 'limb' || depth >= layout.torsoDepth - 4) return false;
  if (layout.view === 'side') return true;
  const [x, y] = layout.projection.project(part.anchor);
  const [x0, y0, x1, y1] = layout.torsoBox;
  return x > x0 - 3 && x < x1 + 3 && y > y0 - 3 && y < y1 + 3;
};

export const renderScene = (scene, view, viewBox, title = '') => {
  const layout = layoutScene(scene, view);
  const { items, projection } = layout;
  const body = items.map((entry) => {
    if (entry.type === 'prop') return renderProp(entry.item, projection);
    const { part } = entry;
    const isFar = isFarLimb(part, entry.depth, layout);
    const color = isFar ? COLORS.far : COLORS.body;
    const d = part.clouds.map((cloud) => hullPath(cloud, projection.project)).join(' ');
    const details = part.details?.length ? detailPaths(part.details, projection) : '';
    return `<path d="${d}" fill="${COLORS.gap}" stroke="${COLORS.gap}" stroke-width="2.2" stroke-linejoin="round"/><path d="${d}" fill="${color}"/>${details ? `<path d="${details}" fill="none" stroke="${COLORS.gap}" stroke-width="0.75" stroke-linecap="round" opacity="0.75"/>` : ''}`;
  });
  const [vx, vy, vw, vh] = viewBox;
  const floor = scene.noFloor || view === 'top' ? '' : `<line x1="${fmt(vx + 3)}" y1="${FLOOR_Y + 0.8}" x2="${fmt(vx + vw - 3)}" y2="${FLOOR_Y + 0.8}" stroke="${COLORS.floor}" stroke-width="2" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(vx)} ${fmt(vy)} ${fmt(vw)} ${fmt(vh)}" role="img" aria-label="${title.replace(/"/g, '')}">${floor}${body.join('')}</svg>`;
};

// Caja [minX, minY, maxX, maxY] de la escena proyectada (incluye el piso si se dibuja).
// `focus` (opcional): ids de partes del cuerpo a encuadrar (acerca la cámara a manos y antebrazos, por ejemplo).
export const measureScene = (scene, view, focus = null) => {
  const projection = PROJECTIONS[view];
  let bounds = [Infinity, Infinity, -Infinity, -Infinity];
  const grow = ([x, y], r = 0) => { bounds = [Math.min(bounds[0], x - r), Math.min(bounds[1], y - r), Math.max(bounds[2], x + r), Math.max(bounds[3], y + r)]; };
  buildBodyParts(scene.skeleton).forEach((part) => { if (!focus || focus.includes(part.id)) part.clouds.flat().forEach((point) => grow(projection.project(point), 1.2)); });
  if (focus) return bounds;
  (scene.props ?? []).forEach((item) => {
    if (item.views && !item.views.includes(view)) return;
    const pad = item.kind === 'line' || item.kind === 'polyline' ? (item.width ?? 2) / 2 : item.kind === 'circle' ? item.r : 1;
    propPoints(item).forEach((point) => grow(projection.project(point), pad));
  });
  if (view !== 'top' && !scene.noFloor) grow([bounds[0], FLOOR_Y + 2]);
  return bounds;
};
