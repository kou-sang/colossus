import { smoothClosedPath } from '../constants/anatomy';

/*
 * Figuras de ejercicios dibujadas por código (sin fotos externas: sin costo de hosting ni derechos de imagen).
 * Módulo puro: recibe una pose y devuelve un SVG en texto → se puede probar y previsualizar fuera de React.
 *
 * Desde 4.3.0 cada pose se arma como un esqueleto 3D y se proyecta en tres vistas:
 *  - 'side'  (lateral, eje X: la figura mira a la derecha),
 *  - 'front' (frontal, eje Y: la figura mira a la cámara),
 *  - 'top'   (superior, eje Z: vista cenital).
 * El cuerpo tiene volumen (torso con pecho, cintura y pelvis; extremidades cónicas; manos, pies y cabeza con nariz
 * que indica hacia dónde mira) y se dibuja de atrás hacia adelante según la profundidad de cada vista.
 *
 * Convenciones de las poses (sin cambios respecto de versiones anteriores):
 *  - `t`: torso (cadera → hombro) en grados desde la vertical; + = inclinado adelante, 90 = boca abajo, -90 = boca arriba.
 *  - Brazos `a1`/`a2` = [brazo, antebrazo] y piernas `l1`/`l2` = [muslo, pierna]: ángulos ABSOLUTOS desde la vertical
 *    hacia abajo en el plano sagital (0 = abajo, 90 = adelante, 180 = arriba, -90 = atrás). `1` = lado cercano, `2` = lejano.
 *  - Una pierna puede ser 'line' (continúa la línea del torso) o ['rel', dMuslo, dPierna] relativa a esa línea.
 *  - `abd`: { a1, a2, l1, l2 } separación lateral (abducción) en grados de cada extremidad; por defecto brazos 8°, piernas 4°.
 *  - `ground`: 'feet' | 'lowest' | 'seat' | 'grip' | 'none' (usa `hip`). `solve` ajusta `t` para apoyar una articulación.
 *  - Vista frontal nativa (`view: 'front'`): `arms`/`legs` = [[abducción, segundo segmento] izq, der], `tilt`, `rot`, `shrug`.
 *  - Los accesorios (`props`) usan coordenadas relativas a la cadera (o `rel`, o `abs`).
 */

export const FIGURE_SIZE = Object.freeze({ width: 200, height: 196, top: -36 });
export const VIEWS = Object.freeze(['side', 'front', 'top']);
const FLOOR_Y = 148;
const LENGTHS = Object.freeze({ torso: 46, neck: 7, head: 8.5, upperArm: 25, forearm: 23, thigh: 34, shin: 33, foot: 9 });
const SHOULDER_HALF = 11;
const HIP_HALF = 6.5;
const DEFAULT_ABDUCTION = Object.freeze({ a1: 8, a2: 8, l1: 4, l2: 4 });
const TOP_CENTER_Y = 62;

const rad = (deg) => (deg * Math.PI) / 180;
const add2 = (point, length, angleFromDown) => [point[0] + length * Math.sin(rad(angleFromDown)), point[1] + length * Math.cos(rad(angleFromDown))];
const fmt = (value) => Math.round(value * 10) / 10;

// ───────── Vectores 3D ─────────
const v = (x, y, z) => [x, y, z];
const vAdd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vSub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const vScale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const vDot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const vCross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vLen = (a) => Math.hypot(a[0], a[1], a[2]);
const vNorm = (a) => { const length = vLen(a) || 1; return vScale(a, 1 / length); };
const vLerp = (a, b, t) => vAdd(a, vScale(vSub(b, a), t));

// Rotación de Rodrigues de `point` alrededor de un eje (unitario) que pasa por `origin`.
const rotateAround = (point, origin, axis, degrees) => {
  const angle = rad(degrees);
  const p = vSub(point, origin);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rotated = vAdd(vAdd(vScale(p, cos), vScale(vCross(axis, p), sin)), vScale(axis, vDot(axis, p) * (1 - cos)));
  return vAdd(rotated, origin);
};

// ───────── Esqueleto lateral (2D, igual que antes) ─────────

const resolveLeg = (leg, torsoAngle) => {
  const lineAngle = -torsoAngle; // Prolongación del torso hacia abajo (cadera → pies)
  if (leg === 'line') return [lineAngle, lineAngle];
  if (Array.isArray(leg) && leg[0] === 'rel') return [lineAngle + leg[1], lineAngle + leg[2]];
  return leg;
};

const sideSkeleton = (pose) => {
  const t = pose.t ?? 0;
  const hip = [0, 0];
  const torsoDown = 180 - t; // dirección cadera→hombro expresada "desde abajo"
  const shoulder = add2(hip, LENGTHS.torso, torsoDown);
  const neckAngle = pose.neck ?? torsoDown;
  const neckTop = add2(shoulder, LENGTHS.neck, neckAngle);
  const head = add2(neckTop, LENGTHS.head - 1, neckAngle);
  const arm = (angles) => {
    const [upper, lower] = angles ?? [0, 0];
    const elbow = add2(shoulder, LENGTHS.upperArm, upper);
    return { elbow, wrist: add2(elbow, LENGTHS.forearm, lower) };
  };
  const leg = (raw) => {
    const [thigh, shin, foot] = resolveLeg(raw ?? [0, 0], t);
    const knee = add2(hip, LENGTHS.thigh, thigh);
    const ankle = add2(knee, LENGTHS.shin, shin);
    return { knee, ankle, toe: add2(ankle, LENGTHS.foot, foot ?? shin + 90) };
  };
  return {
    hip, shoulder, neckTop, head, torsoDown,
    near: { ...arm(pose.a1), ...leg(pose.l1) },
    far: { ...arm(pose.a2 ?? pose.a1), ...leg(pose.l2 ?? pose.l1) },
  };
};

// Ajusta `t` por bisección para que `joint` quede a la altura de los dedos del pie (flexiones, planchas).
const solveTorso = (pose) => {
  const { joint, range, offset = 0 } = pose.solve;
  const gap = (t) => {
    const skeleton = sideSkeleton({ ...pose, t });
    const contact = Math.max(skeleton.near[joint][1], skeleton.far[joint][1]);
    const feet = Math.max(skeleton.near.toe[1], skeleton.far.toe[1], skeleton.near.ankle[1], skeleton.far.ankle[1]);
    return contact - feet + offset;
  };
  let [low, high] = range;
  if (Math.sign(gap(low)) === Math.sign(gap(high))) return pose;
  for (let step = 0; step < 40; step += 1) {
    const middle = (low + high) / 2;
    if (Math.sign(gap(middle)) === Math.sign(gap(low))) low = middle;
    else high = middle;
  }
  return { ...pose, t: (low + high) / 2 };
};

const JOINTS_2D = Object.freeze({
  shoulder: (s) => s.shoulder, hip: (s) => s.hip, head: (s) => s.head, wrist: (s) => s.near.wrist, elbow: (s) => s.near.elbow,
  knee: (s) => s.near.knee, ankle: (s) => s.near.ankle, toe: (s) => s.near.toe, farWrist: (s) => s.far.wrist, farKnee: (s) => s.far.knee, farToe: (s) => s.far.toe,
});

// Posición en el lienzo de la vista lateral (mismas reglas de apoyo que las versiones anteriores).
const placeSide = (pose, s) => {
  const bodyPoints = [s.head, s.shoulder, s.hip, ...['near', 'far'].flatMap((side) => [s[side].elbow, s[side].wrist, s[side].knee, s[side].ankle, s[side].toe])];
  let dy;
  if (pose.ground === 'grip') dy = pose.grip[1] - s.near.wrist[1];
  else if (pose.ground === 'none') dy = pose.hip?.[1] ?? 90;
  else if (pose.ground === 'seat') dy = FLOOR_Y - (pose.seatH ?? 40);
  else if (pose.ground === 'lowest') dy = FLOOR_Y - 3.5 - Math.max(...bodyPoints.map(([, y], index) => (index === 0 ? y + LENGTHS.head - 3.5 : y)));
  else dy = FLOOR_Y - 2.5 - Math.max(s.near.toe[1], s.far.toe[1], s.near.ankle[1], s.far.ankle[1]);
  dy -= pose.lift ?? 0;
  const xs = bodyPoints.map(([x]) => x);
  const dx = pose.ground === 'grip'
    ? pose.grip[0] - s.near.wrist[0]
    : pose.hip?.[0] ?? 100 - (Math.min(...xs) + Math.max(...xs)) / 2 + (pose.dx ?? 0);
  return { dx, dy };
};

/*
 * Esqueleto 3D a partir de una pose lateral. Mundo: x = adelante, y = abajo (como el lienzo), z = lateral (+ = lado cercano).
 * El plano sagital coincide con el lienzo de la vista lateral → la vista lateral conserva exactamente el dibujo de siempre.
 */
const buildRigFromSide = (rawPose) => {
  const pose = rawPose.solve ? solveTorso(rawPose) : rawPose;
  const s = sideSkeleton(pose);
  const { dx, dy } = placeSide(pose, s);
  const W = ([x, y], z = 0) => v(x + dx, y + dy, z);
  const abd = { ...DEFAULT_ABDUCTION, ...(pose.abd ?? {}) };
  const twist = pose.twist ?? 0;

  const shoulderCenter = W(s.shoulder);
  const hipCenter = W(s.hip);
  const up = vNorm(vSub(shoulderCenter, hipCenter));
  const lateral = rotateAround(v(0, 0, 1), v(0, 0, 0), up, twist);

  const limb = (side, kind) => {
    const sign = side === 'near' ? 1 : -1;
    const points = s[side];
    const isArm = kind === 'arm';
    const root = isArm ? vAdd(shoulderCenter, vScale(lateral, SHOULDER_HALF * sign)) : W(s.hip, HIP_HALF * sign);
    const offset = vSub(root, isArm ? shoulderCenter : hipCenter);
    const chain = (isArm ? [points.elbow, points.wrist] : [points.knee, points.ankle, points.toe]).map((point) => vAdd(W(point), offset));
    if (isArm && twist) {
      // El giro del torso arrastra a los brazos alrededor del eje del tronco.
      for (let index = 0; index < chain.length; index += 1) chain[index] = rotateAround(chain[index], hipCenter, up, twist);
    }
    // Abducción: rota toda la cadena hacia afuera alrededor del eje perpendicular al primer segmento y al eje lateral.
    const degrees = abd[`${isArm ? 'a' : 'l'}${side === 'near' ? 1 : 2}`] ?? 0;
    const first = vSub(chain[0], root);
    const axis = vCross(first, v(0, 0, sign));
    if (degrees && vLen(axis) > 1e-6) {
      const unit = vNorm(axis);
      for (let index = 0; index < chain.length; index += 1) chain[index] = rotateAround(chain[index], root, unit, degrees);
    }
    return isArm ? { root, elbow: chain[0], wrist: chain[1] } : { root, knee: chain[0], ankle: chain[1], toe: chain[2] };
  };

  return {
    hipCenter,
    shoulderCenter,
    neckTop: W(s.neckTop),
    head: W(s.head),
    up,
    lateral,
    arms: { near: limb('near', 'arm'), far: limb('far', 'arm') },
    legs: { near: limb('near', 'leg'), far: limb('far', 'leg') },
    side2d: { s, W },
  };
};

// ───────── Vista frontal nativa (poses definidas de frente) ─────────

const rotate2 = ([x, y], [cx, cy], degrees) => {
  const angle = rad(degrees);
  return [cx + (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle), cy + (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle)];
};

const frontSkeleton = (pose) => {
  const tilt = pose.tilt ?? 0;
  const hipCenter = [0, 0];
  const shoulderCenter = add2(hipCenter, LENGTHS.torso, 180 + tilt);
  const across = (center, half, sign) => [center[0] + sign * half * Math.cos(rad(tilt)), center[1] + sign * half * Math.sin(rad(tilt))];
  const shrug = pose.shrug ?? 0;
  const shoulders = [across(shoulderCenter, SHOULDER_HALF, -1), across(shoulderCenter, SHOULDER_HALF, 1)].map(([x, y]) => [x, y - shrug]);
  const hips = [across(hipCenter, HIP_HALF, -1), across(hipCenter, HIP_HALF, 1)];
  const neckTop = add2(shoulderCenter, LENGTHS.neck, 180 + tilt);
  const head = add2(neckTop, LENGTHS.head - 1, 180 + tilt);
  const [armLeft, armRight] = pose.arms ?? [[10, 10], [10, 10]];
  const [legLeft, legRight] = pose.legs ?? [[4, 4], [4, 4]];
  const chain = (origin, [first, second], sign, lengths) => {
    const middle = add2(origin, lengths[0], sign * first);
    return [middle, add2(middle, lengths[1], sign * second)];
  };
  const arms = [chain(shoulders[0], armLeft, -1, [LENGTHS.upperArm, LENGTHS.forearm]), chain(shoulders[1], armRight, 1, [LENGTHS.upperArm, LENGTHS.forearm])];
  const legs = [chain(hips[0], legLeft, -1, [LENGTHS.thigh, LENGTHS.shin]), chain(hips[1], legRight, 1, [LENGTHS.thigh, LENGTHS.shin])];
  return { hipCenter, shoulderCenter, shoulders, hips, neckTop, head, arms, legs };
};

const BODY_X = 100; // posición "adelante" de las figuras definidas de frente

const buildRigFromFront = (pose) => {
  const f = frontSkeleton(pose);
  const pivot = [f.legs[0][1][0], f.legs[0][1][1]];
  const rot = (point) => (pose.rot ? rotate2(point, pivot, pose.rot) : point);
  const all = [...f.arms.flat(), ...f.legs.flat(), f.head, ...f.shoulders].map(rot);
  const bottom = Math.max(...all.map(([, y]) => y)) + (pose.ground === 'lowest' ? 4 : 2.5);
  const dy = pose.ground === 'none' ? (pose.hip?.[1] ?? 90) : FLOOR_Y - bottom - (pose.lift ?? 0);
  const xs = all.map(([x]) => x);
  const dx = -(Math.min(...xs) + Math.max(...xs)) / 2 + (pose.dx ?? 0);
  // Lienzo frontal (x, y) → mundo: z = x (lateral), x = adelante fijo, y igual.
  const W = (point) => { const [x, y] = rot(point); return v(BODY_X, y + dy, x + dx); };
  const hipCenter = W(f.hipCenter);
  const shoulderCenter = W(f.shoulderCenter);
  const up = vNorm(vSub(shoulderCenter, hipCenter));
  const lateral = vNorm(vSub(W(f.shoulders[1]), W(f.shoulders[0])));
  const toe = (ankle) => vAdd(ankle, v(LENGTHS.foot, 1, 0));
  const arm = (index) => ({ root: W(f.shoulders[index]), elbow: W(f.arms[index][0]), wrist: W(f.arms[index][1]) });
  const leg = (index) => { const ankle = W(f.legs[index][1]); return { root: W(f.hips[index]), knee: W(f.legs[index][0]), ankle, toe: toe(ankle) }; };
  return {
    hipCenter,
    shoulderCenter,
    neckTop: W(f.neckTop),
    head: W(f.head),
    up,
    lateral,
    // índice 1 = derecha del lienzo frontal = +z = "cercano"
    arms: { near: arm(1), far: arm(0) },
    legs: { near: leg(1), far: leg(0) },
    front2d: { f, W },
  };
};

// ───────── Primitivas 3D ─────────

const COLORS = Object.freeze({ body: 'var(--text)', far: 'var(--muted)', gear: 'var(--accent)', frame: 'var(--text-2)', floor: 'var(--border)', gap: 'var(--surface-2)' });

const prim = Object.freeze({
  capsule: (a, b, r1, r2, extra = {}) => ({ kind: 'capsule', pts: [a, b], r1, r2, ...extra }),
  sphere: (c, r, extra = {}) => ({ kind: 'sphere', pts: [c], r, ...extra }),
  line: (a, b, color, width, extra = {}) => ({ kind: 'line', pts: [a, b], color, width, ...extra }),
  polyline: (pts, color, width, extra = {}) => ({ kind: 'polyline', pts, color, width, ...extra }),
  poly: (pts, extra = {}) => ({ kind: 'poly', pts, ...extra }),
  hull: (pts, extra = {}) => ({ kind: 'hull', pts, ...extra }),
});

// Disco (placa de barra, rueda) como polígono 3D: centro, normal y radio.
const discPoints = (center, normal, radius, segments = 20) => {
  const n = vNorm(normal);
  const helper = Math.abs(n[1]) < 0.9 ? v(0, 1, 0) : v(1, 0, 0);
  const u = vNorm(vCross(n, helper));
  const w = vCross(n, u);
  return Array.from({ length: segments }, (_, index) => {
    const angle = (index / segments) * Math.PI * 2;
    return vAdd(center, vAdd(vScale(u, Math.cos(angle) * radius), vScale(w, Math.sin(angle) * radius)));
  });
};
const disc = (center, normal, radius, extra = {}) => prim.poly(discPoints(center, normal, radius), { fill: 'none', stroke: COLORS.gear, width: 3.2, ...extra });

// Caja a partir de una esquina y tres aristas → se dibuja su silueta (envolvente convexa de los 8 vértices).
const box = (corner, ex, ey, ez, extra = {}) => {
  const pts = [];
  [0, 1].forEach((i) => [0, 1].forEach((j) => [0, 1].forEach((k) => pts.push(vAdd(corner, vAdd(vScale(ex, i), vAdd(vScale(ey, j), vScale(ez, k))))))));
  return prim.hull(pts, { fill: COLORS.frame, stroke: COLORS.gap, width: 1, ...extra });
};
// Caja alineada a los ejes entre dos puntos opuestos.
const aabb = (min, max, extra) => box(min, v(max[0] - min[0], 0, 0), v(0, max[1] - min[1], 0), v(0, 0, max[2] - min[2]), extra);
// Tabla (banco, respaldo): segmento a→b en el plano sagital, ancho en z y espesor hacia `down`.
const slab = (a, b, halfWidth, thickness, down = v(0, 1, 0), extra) =>
  box(vAdd(a, v(0, 0, -halfWidth)), vSub(b, a), vScale(vNorm(down), thickness), v(0, 0, halfWidth * 2), extra);

// ───────── Cuerpo ─────────

// Estaciones del torso a lo largo del eje cadera→hombro: ancho lateral, profundidad y desplazamiento hacia adelante (pecho).
const TORSO_STATIONS = Object.freeze([
  { t: -0.04, w: 8.5, d: 6, f: 0 },
  { t: 0.12, w: 9.8, d: 6.8, f: 0 },
  { t: 0.42, w: 8.6, d: 6, f: 0.6 },
  { t: 0.72, w: 11.4, d: 7.4, f: 1.6 },
  { t: 0.92, w: 12.8, d: 6.6, f: 0.8 },
  { t: 1.04, w: 11, d: 5.2, f: 0 },
]);

const buildBody = (rig) => {
  const items = [];
  const { hipCenter, shoulderCenter, up, lateral } = rig;
  const forward = vNorm(vCross(lateral, up));
  const torsoLength = vLen(vSub(shoulderCenter, hipCenter));
  items.push({ kind: 'torso', pts: TORSO_STATIONS.map((station) => vAdd(vAdd(hipCenter, vScale(up, torsoLength * station.t)), vScale(forward, station.f))), stations: TORSO_STATIONS, up, lateral, forward, fill: COLORS.body, role: 'torso' });

  // Cuello y cabeza; la nariz marca hacia dónde mira la figura (clave en las vistas frontal y superior).
  const headDir = vNorm(vSub(rig.head, rig.neckTop));
  const headForward = vNorm(vSub(forward, vScale(headDir, vDot(forward, headDir))));
  items.push(prim.capsule(shoulderCenter, rig.head, 3.6, 3.2, { fill: COLORS.body, role: 'neck' }));
  items.push(prim.sphere(rig.head, LENGTHS.head, { fill: COLORS.body, role: 'head' }));
  items.push(prim.capsule(vAdd(rig.head, vScale(headForward, LENGTHS.head - 1.5)), vAdd(vAdd(rig.head, vScale(headForward, LENGTHS.head + 2.2)), vScale(headDir, -1)), 1.8, 1.2, { fill: COLORS.body, role: 'head' }));

  ['far', 'near'].forEach((side) => {
    const arm = rig.arms[side];
    const leg = rig.legs[side];
    const tag = { side };
    items.push(prim.capsule(arm.root, arm.elbow, 4.4, 3.6, { ...tag, role: 'limb' }));
    items.push(prim.capsule(arm.elbow, arm.wrist, 3.5, 2.6, { ...tag, role: 'limb' }));
    const handDir = vNorm(vSub(arm.wrist, arm.elbow));
    items.push(prim.sphere(vAdd(arm.wrist, vScale(handDir, 2.6)), 3.1, { ...tag, role: 'limb' }));
    items.push(prim.capsule(leg.root, leg.knee, 6.4, 4.6, { ...tag, role: 'limb' }));
    items.push(prim.capsule(leg.knee, leg.ankle, 4.6, 3, { ...tag, role: 'limb' }));
    items.push(prim.capsule(vLerp(leg.ankle, leg.toe, -0.2), leg.toe, 3, 2.1, { ...tag, role: 'limb' }));
  });
  return items;
};

// ───────── Accesorios (vista lateral nativa) ─────────

const hand3d = (rig, side = 'near') => {
  const arm = rig.arms[side] ?? rig.arms.near;
  return vAdd(arm.wrist, vScale(vNorm(vSub(arm.wrist, arm.elbow)), 2.6));
};

const buildSideProps = (pose, rig) => {
  const { s, W } = rig.side2d;
  const items = [];
  const floorY = FLOOR_Y;
  (pose.props ?? []).forEach((prop) => {
    const origin = prop.rel ? JOINTS_2D[prop.rel](s) : [0, 0];
    const at2 = (point) => (prop.abs ? v(point[0], point[1], 0) : W([point[0] + origin[0], point[1] + origin[1]]));
    const handsMid = vLerp(hand3d(rig, 'near'), hand3d(rig, 'far'), 0.5);
    const anchorAt = (value) => {
      if (value === 'hand' || value === undefined) return handsMid;
      if (typeof value === 'string') return W(JOINTS_2D[value](s));
      return at2(value);
    };
    switch (prop.type) {
      case 'bench': {
        const [a, b] = [at2(prop.from), at2(prop.to)];
        items.push(slab(a, b, 12, 5));
        (prop.legs ?? [0.15, 0.85]).forEach((fraction) => {
          const p = vLerp(a, b, fraction);
          [-9, 9].forEach((z) => items.push(prim.line(v(p[0], p[1] + 4, z), v(p[0], floorY, z), COLORS.frame, 2.5)));
        });
        break;
      }
      case 'pad': {
        const hip = W(s.hip);
        const shoulder = W(s.shoulder);
        const axis = vNorm(vSub(shoulder, hip));
        const facing = (prop.side ?? 'back') === 'front' ? 1 : -1;
        const normal = vScale(v(-axis[1], axis[0], 0), facing); // perpendicular en el plano sagital, hacia el pecho
        const offset = prop.offset ?? 8;
        const [before, after] = prop.extend ?? [6, 6];
        const a = vAdd(vAdd(hip, vScale(normal, offset)), vScale(axis, -before));
        const b = vAdd(vAdd(shoulder, vScale(normal, offset)), vScale(axis, after));
        items.push(slab(a, b, 12, 5, vScale(normal, 1)));
        if (prop.legs !== false) [a, b].filter((p) => p[1] < floorY - 6).forEach((p) => items.push(prim.line(v(p[0], p[1] + 3, 0), v(p[0], floorY, 0), COLORS.frame, 3)));
        break;
      }
      case 'seat': {
        const c = W([(prop.x ?? 0) + origin[0], (prop.y ?? 9) + origin[1]]);
        const w = prop.w ?? 26;
        items.push(aabb(v(c[0] - w / 2, c[1] - 2.5, -12), v(c[0] + w / 2, c[1] + 2.5, 12)));
        if (prop.post !== false) items.push(prim.line(v(c[0], c[1] + 3, 0), v(c[0], floorY, 0), COLORS.frame, 4));
        break;
      }
      case 'box': {
        const p = at2(prop.pos);
        items.push(aabb(v(p[0], p[1], -16), v(p[0] + prop.w, floorY, 16), { fill: 'none', stroke: COLORS.frame, width: 2.5 }));
        break;
      }
      case 'seg': {
        const [a, b] = [at2(prop.from), at2(prop.to)];
        items.push(prim.line(a, b, COLORS.frame, prop.width ?? 4));
        break;
      }
      case 'post': {
        const p = at2(prop.pos);
        items.push(prim.line(p, v(p[0], floorY, 0), COLORS.frame, 4));
        break;
      }
      case 'barbell': {
        const base = anchorAt(prop.at);
        const c = vAdd(base, v(prop.offset?.[0] ?? 0, prop.offset?.[1] ?? 0, -base[2]));
        const r = prop.r ?? 11;
        items.push(prim.line(vAdd(c, v(0, 0, -50)), vAdd(c, v(0, 0, 50)), COLORS.frame, 2.6));
        if (r > 0) {
          [-1, 1].forEach((sign) => {
            items.push(disc(vAdd(c, v(0, 0, sign * 38)), v(0, 0, 1), r));
            items.push(disc(vAdd(c, v(0, 0, sign * 42)), v(0, 0, 1), r * 0.82, { width: 2.6 }));
          });
        }
        break;
      }
      case 'dumbbell': {
        const sides = prop.both === false ? ['near'] : ['far', 'near'];
        sides.forEach((side) => {
          const h = vAdd(hand3d(rig, side), v(prop.offset?.[0] ?? 0, prop.offset?.[1] ?? 0, 0));
          items.push(prim.line(vAdd(h, v(0, 0, -5)), vAdd(h, v(0, 0, 5)), COLORS.frame, 2.4));
          [-5, 5].forEach((z) => items.push(disc(vAdd(h, v(0, 0, z)), v(0, 0, 1), 5, { fill: COLORS.gear, width: 1.6 })));
        });
        break;
      }
      case 'kettlebell': {
        const h = anchorAt(prop.at);
        items.push(prim.line(h, vAdd(h, v(0, 5, 0)), COLORS.gear, 2.5));
        items.push(prim.sphere(vAdd(h, v(0, 10, 0)), 6.5, { fill: COLORS.gear }));
        break;
      }
      case 'plate': {
        items.push(disc(anchorAt(prop.at), v(1, 0, 0), prop.r ?? 9));
        break;
      }
      case 'ball': {
        const c = prop.pos ? at2(prop.pos) : handsMid;
        items.push(prim.sphere(vAdd(c, v(prop.dx ?? 0, prop.dy ?? 0, 0)), prop.r ?? 8, { fill: COLORS.gear }));
        break;
      }
      case 'cable': {
        const anchor2 = at2(prop.to);
        const ends = prop.dual ? [['near', 1], ['far', -1]] : [[prop.side ?? null, 0]];
        ends.forEach(([side, sign]) => {
          const hand = side ? hand3d(rig, side) : handsMid;
          const anchor = v(anchor2[0], anchor2[1], sign * 42);
          items.push(prim.line(v(anchor[0], Math.min(anchor[1] - 6, FIGURE_SIZE.top + 6), anchor[2]), v(anchor[0], floorY, anchor[2]), COLORS.frame, 3.2));
          items.push(prim.sphere(anchor, 3.4, { fill: COLORS.frame }));
          items.push(prim.line(anchor, hand, COLORS.gear, 1.8));
        });
        if (!prop.dual) items.push(prim.line(hand3d(rig, 'near'), hand3d(rig, 'far'), COLORS.gear, 2.4));
        break;
      }
      case 'bar': {
        const c = prop.pos ? at2(prop.pos) : v(handsMid[0], handsMid[1], 0);
        items.push(prim.line(vAdd(c, v(0, 0, -32)), vAdd(c, v(0, 0, 32)), COLORS.frame, 4));
        items.push(prim.sphere(c, 2.6, { fill: COLORS.frame })); // En la vista lateral la barra se ve de punta
        break;
      }
      case 'rope': {
        const c = at2(prop.pos);
        items.push(prim.line(v(c[0], FIGURE_SIZE.top + 4, 0), v(c[0], floorY, 0), COLORS.gear, 3));
        break;
      }
      case 'wave': {
        const length = prop.length ?? 60;
        ['near', 'far'].forEach((side, sideIndex) => {
          const h = hand3d(rig, side);
          const pts = Array.from({ length: 25 }, (_, index) => {
            const progress = index / 24;
            return v(h[0] + progress * length, h[1] + Math.sin(progress * Math.PI * 3 + sideIndex * Math.PI) * 6 * (prop.amp ?? 1) * (1 - progress * 0.4), h[2]);
          });
          items.push(prim.polyline(pts, COLORS.gear, 2.5));
        });
        break;
      }
      case 'arc': {
        const a = hand3d(rig, 'far');
        const b = hand3d(rig, 'near');
        const control = v((a[0] + b[0]) / 2, prop.under ? floorY + 4 : Math.min(a[1], b[1]) - 70, 0);
        const pts = Array.from({ length: 21 }, (_, index) => {
          const t = index / 20;
          return vAdd(vAdd(vScale(a, (1 - t) ** 2), vScale(control, 2 * t * (1 - t))), vScale(b, t ** 2));
        });
        items.push(prim.polyline(pts, COLORS.gear, 2));
        break;
      }
      case 'wheel': {
        const h = vAdd(handsMid, v(0, 2, 0));
        items.push(prim.line(vAdd(h, v(0, 0, -10)), vAdd(h, v(0, 0, 10)), COLORS.frame, 2.4));
        items.push(disc(h, v(0, 0, 1), 7, { width: 3.4 }));
        break;
      }
      case 'bike': {
        const seat = at2(prop.seat ?? [0, 4]);
        const handle = at2(prop.handle);
        const front = v(handle[0] + 4, floorY - 14, 0);
        const back = v(seat[0] - 14, floorY - 14, 0);
        const crank = v(seat[0] + 18, floorY - 16, 0);
        items.push(disc(front, v(0, 0, 1), 14, { stroke: COLORS.frame, width: 3 }), disc(back, v(0, 0, 1), 14, { stroke: COLORS.frame, width: 3 }));
        [[back, vAdd(seat, v(0, 3, 0))], [vAdd(seat, v(0, 3, 0)), crank], [crank, front], [crank, handle], [vAdd(seat, v(-6, 3, 0)), vAdd(seat, v(6, 3, 0))]]
          .forEach(([a, b]) => items.push(prim.line(a, b, COLORS.frame, 3)));
        items.push(prim.line(vAdd(handle, v(0, 0, -10)), vAdd(handle, v(0, 0, 10)), COLORS.frame, 3));
        break;
      }
      case 'water': {
        const pts = Array.from({ length: 37 }, (_, index) => v(10 + index * 5, floorY - 34 + Math.sin(index * 0.9) * 2.5, 0));
        items.push(prim.polyline(pts, COLORS.frame, 2, { opacity: 0.6, views: ['side', 'front'] }));
        break;
      }
      case 'wall': {
        const p = at2(prop.pos);
        items.push(prim.poly([v(p[0], FIGURE_SIZE.top + 4, -46), v(p[0], FIGURE_SIZE.top + 4, 46), v(p[0], floorY, 46), v(p[0], floorY, -46)], { fill: 'none', stroke: COLORS.frame, width: 3, opacity: 0.8 }));
        break;
      }
      case 'net': {
        const p = at2(prop.pos);
        const h = prop.h ?? 40;
        items.push(prim.poly([v(p[0], floorY - h, -46), v(p[0], floorY - h, 46), v(p[0], floorY, 46), v(p[0], floorY, -46)], { fill: 'none', stroke: COLORS.frame, width: 2, opacity: 0.8 }));
        break;
      }
      case 'racket': {
        const h = hand3d(rig, 'near');
        const tip = vAdd(h, v(16 * Math.sin(rad(prop.angle ?? 180)), 16 * Math.cos(rad(prop.angle ?? 180)), 0));
        items.push(prim.line(h, tip, COLORS.frame, 2.5));
        items.push(disc(vAdd(tip, vScale(vNorm(vSub(tip, h)), 6)), v(0, 0, 1), 6.5, { width: 2.4 }));
        break;
      }
      case 'arrow': {
        items.push(prim.line(at2(prop.from), at2(prop.to), COLORS.gear, 1.5, { dash: true }));
        break;
      }
      default:
        break;
    }
  });
  return items;
};

// ───────── Accesorios (vista frontal nativa) ─────────

const buildFrontProps = (pose, rig) => {
  const { f, W } = rig.front2d;
  const items = [];
  const hands = [hand3d(rig, 'far'), hand3d(rig, 'near')];
  (pose.props ?? []).forEach((prop) => {
    switch (prop.type) {
      case 'dumbbell':
        hands.forEach((h) => {
          items.push(prim.line(vAdd(h, v(-5, 0, 0)), vAdd(h, v(5, 0, 0)), COLORS.frame, 2.4));
          [-5, 5].forEach((x) => items.push(disc(vAdd(h, v(x, 0, 0)), v(1, 0, 0), 5, { fill: COLORS.gear, width: 1.6 })));
        });
        break;
      case 'barbell': {
        const [a, b] = hands;
        const y = (a[1] + b[1]) / 2;
        items.push(prim.line(v(a[0], y, Math.min(a[2], b[2]) - 24), v(a[0], y, Math.max(a[2], b[2]) + 24), COLORS.frame, 2.6));
        [Math.min(a[2], b[2]) - 18, Math.max(a[2], b[2]) + 18].forEach((z) => items.push(disc(v(a[0], y, z), v(0, 0, 1), 11)));
        break;
      }
      case 'kettlebell': {
        const h = vLerp(hands[0], hands[1], 0.5);
        items.push(prim.sphere(vAdd(h, v(0, 9, 0)), 6.5, { fill: COLORS.gear }));
        break;
      }
      case 'cable':
        hands.forEach((h, index) => {
          const anchor = W(prop.anchors[index]);
          items.push(prim.line(anchor, v(anchor[0], FLOOR_Y, anchor[2]), COLORS.frame, 3.2));
          items.push(prim.sphere(anchor, 3.4, { fill: COLORS.frame }));
          items.push(prim.line(anchor, h, COLORS.gear, 1.8));
        });
        break;
      case 'seat': {
        const c = W(prop.pos);
        items.push(aabb(v(c[0] - 12, c[1], c[2] - prop.w / 2), v(c[0] + 12, c[1] + 5, c[2] + prop.w / 2)));
        items.push(prim.line(v(c[0], c[1] + 5, c[2]), v(c[0], FLOOR_Y, c[2]), COLORS.frame, 4));
        break;
      }
      case 'pads':
        f.legs.forEach(([knee], index) => {
          const p = W(knee);
          const side = index === 0 ? -1 : 1;
          const z = p[2] + side * (prop.inside ? -6 : 7);
          items.push(aabb(v(p[0] - 5, p[1] - 8, z - 2.5), v(p[0] + 5, p[1] + 8, z + 2.5), { fill: COLORS.gear }));
        });
        break;
      case 'band':
        items.push(prim.line(rig.legs.far.knee, rig.legs.near.knee, COLORS.gear, 2.5));
        break;
      default:
        break;
    }
  });
  return items;
};

// ───────── Proyección y dibujo ─────────

const PROJECTIONS = Object.freeze({
  side: { project: ([x, y]) => [x, y], depth: (p) => p[2], dir: ([x, y]) => [x, y] },
  front: { project: ([, y, z]) => [100 + z, y], depth: (p) => p[0], dir: ([, y, z]) => [z, y] },
  top: { project: ([x, , z]) => [x, TOP_CENTER_Y + z], depth: (p) => -p[1], dir: ([x, , z]) => [x, z] },
});

// Envolvente convexa (monotone chain) de puntos 2D.
const convexHull = (points) => {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const build = (list) => {
    const hull = [];
    list.forEach((point) => {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) hull.pop();
      hull.push(point);
    });
    hull.pop();
    return hull;
  };
  return [...build(sorted), ...build([...sorted].reverse())];
};

const pathFrom = (points, closed = true) => `M${points.map((p) => `${fmt(p[0])} ${fmt(p[1])}`).join(' L')}${closed ? ' Z' : ''}`;

// Cápsula cónica en 2D: dos radios unidos por tangentes, extremos redondeados.
const capsulePath = (a, b, r1, r2) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy);
  if (length < 0.6) return null;
  const nx = -dy / length;
  const ny = dx / length;
  const p1 = [a[0] + nx * r1, a[1] + ny * r1];
  const p2 = [b[0] + nx * r2, b[1] + ny * r2];
  const p3 = [b[0] - nx * r2, b[1] - ny * r2];
  const p4 = [a[0] - nx * r1, a[1] - ny * r1];
  return `M${fmt(p1[0])} ${fmt(p1[1])} L${fmt(p2[0])} ${fmt(p2[1])} A${fmt(r2)} ${fmt(r2)} 0 0 0 ${fmt(p3[0])} ${fmt(p3[1])} L${fmt(p4[0])} ${fmt(p4[1])} A${fmt(r1)} ${fmt(r1)} 0 0 0 ${fmt(p1[0])} ${fmt(p1[1])} Z`;
};

// Contorno del torso en pantalla: en cada estación, el ancho visible combina el ancho lateral y la profundidad.
const torsoShape = (item, view) => {
  const projection = PROJECTIONS[view];
  const [axisX, axisY] = projection.dir(item.up);
  const axisLength = Math.hypot(axisX, axisY);
  const lat = projection.dir(item.lateral);
  const fwd = projection.dir(item.forward);
  const centers = item.pts.map(projection.project);
  if (axisLength < 0.35) {
    // Mirando a lo largo del tronco (p. ej. desde arriba a alguien de pie): elipse del pecho.
    const station = item.stations[3];
    const c = centers[3];
    const pts = Array.from({ length: 24 }, (_, index) => {
      const angle = (index / 24) * Math.PI * 2;
      return [c[0] + lat[0] * station.w * Math.cos(angle) + fwd[0] * station.d * Math.sin(angle), c[1] + lat[1] * station.w * Math.cos(angle) + fwd[1] * station.d * Math.sin(angle)];
    });
    return smoothClosedPath(pts, 0.5);
  }
  const nx = -axisY / axisLength;
  const ny = axisX / axisLength;
  const extent = (station) => Math.hypot(station.w * (lat[0] * nx + lat[1] * ny), station.d * (fwd[0] * nx + fwd[1] * ny));
  const left = centers.map((c, index) => [c[0] + nx * extent(item.stations[index]), c[1] + ny * extent(item.stations[index])]);
  const right = centers.map((c, index) => [c[0] - nx * extent(item.stations[index]), c[1] - ny * extent(item.stations[index])]);
  return smoothClosedPath([...left, ...right.reverse()], 0.55);
};

const renderItem = (item, view, color) => {
  const projection = PROJECTIONS[view];
  const pts = item.pts.map(projection.project);
  const opacity = item.opacity ? ` opacity="${item.opacity}"` : '';
  switch (item.kind) {
    case 'torso':
      return `<path d="${torsoShape(item, view)}" fill="${color}" stroke="${COLORS.gap}" stroke-width="1.2" stroke-linejoin="round"/>`;
    case 'capsule': {
      const d = capsulePath(pts[0], pts[1], item.r1, item.r2);
      const r = Math.max(item.r1, item.r2);
      return d
        ? `<path d="${d}" fill="${color}" stroke="${COLORS.gap}" stroke-width="1.1" stroke-linejoin="round"/>`
        : `<circle cx="${fmt(pts[0][0])}" cy="${fmt(pts[0][1])}" r="${r}" fill="${color}" stroke="${COLORS.gap}" stroke-width="1.1"/>`;
    }
    case 'sphere':
      return `<circle cx="${fmt(pts[0][0])}" cy="${fmt(pts[0][1])}" r="${item.r}" fill="${item.fill === COLORS.body ? color : item.fill}" stroke="${COLORS.gap}" stroke-width="1.1"${opacity}/>`;
    case 'line':
      return `<line x1="${fmt(pts[0][0])}" y1="${fmt(pts[0][1])}" x2="${fmt(pts[1][0])}" y2="${fmt(pts[1][1])}" stroke="${item.color}" stroke-width="${item.width}" stroke-linecap="round"${item.dash ? ' stroke-dasharray="3 3"' : ''}${opacity}/>`;
    case 'polyline':
      return `<path d="${pathFrom(pts, false)}" fill="none" stroke="${item.color}" stroke-width="${item.width}" stroke-linecap="round" stroke-linejoin="round"${opacity}/>`;
    case 'poly':
      return `<path d="${pathFrom(pts)}" fill="${item.fill ?? 'none'}" stroke="${item.stroke ?? 'none'}" stroke-width="${item.width ?? 1}" stroke-linejoin="round"${opacity}/>`;
    case 'hull':
      return `<path d="${pathFrom(convexHull(pts))}" fill="${item.fill ?? 'none'}" stroke="${item.stroke ?? 'none'}" stroke-width="${item.width ?? 1}" stroke-linejoin="round"${opacity}/>`;
    default:
      return '';
  }
};

const depthOf = (item, view) => {
  const projection = PROJECTIONS[view];
  const depths = item.pts.map(projection.depth);
  return depths.reduce((sum, value) => sum + value, 0) / depths.length;
};

// Escena de una pose en una vista: primitivas ordenadas de atrás hacia adelante con su color final.
const buildScene = (pose, view) => {
  const isFrontPose = pose.view === 'front';
  const rig = isFrontPose ? buildRigFromFront(pose) : buildRigFromSide(pose);
  const body = buildBody(rig);
  const props = (isFrontPose ? buildFrontProps(pose, rig) : buildSideProps(pose, rig)).filter((item) => !item.views || item.views.includes(view));
  const torsoDepth = depthOf(body[0], view);
  // Profundidad: lo más lejano primero. Un pequeño sesgo deja el cuerpo por delante del implemento que toca.
  const all = [...props.map((item) => ({ item, depth: depthOf(item, view) - 0.01 })), ...body.map((item) => ({ item, depth: depthOf(item, view) }))];
  all.sort((a, b) => a.depth - b.depth);
  return all.map(({ item, depth }) => {
    const isBody = item.role !== undefined;
    // Extremidades por detrás del torso, más tenues: dan sensación de volumen en todas las vistas.
    const color = isBody ? (item.role === 'limb' && depth < torsoDepth - 3 ? COLORS.far : COLORS.body) : item.fill ?? COLORS.frame;
    return { item, color };
  });
};

/**
 * Caja [minX, minY, maxX, maxY] que ocupa una pose en una vista (incluye grosores y el piso si se dibuja).
 * Sirve para encuadrar todos los fotogramas de un ejercicio con el mismo zoom.
 */
export const measurePose = (pose, view = 'side') => {
  const projection = PROJECTIONS[view];
  let bounds = [Infinity, Infinity, -Infinity, -Infinity];
  const grow = ([x, y], r = 0) => {
    bounds = [Math.min(bounds[0], x - r), Math.min(bounds[1], y - r), Math.max(bounds[2], x + r), Math.max(bounds[3], y + r)];
  };
  buildScene(pose, view).forEach(({ item }) => {
    const pad = item.kind === 'torso' ? 13 : item.kind === 'capsule' ? Math.max(item.r1, item.r2) : item.r ?? (item.width ?? 2) / 2;
    item.pts.forEach((point) => grow(projection.project(point), pad));
  });
  if (view !== 'top' && !pose.noFloor) grow([bounds[0], FLOOR_Y + 2]);
  return bounds;
};

const DEFAULT_VIEWBOX = Object.freeze([0, FIGURE_SIZE.top, FIGURE_SIZE.width, FIGURE_SIZE.height]);

/**
 * Devuelve el SVG (texto) de una pose en la vista pedida. Colores por variables CSS del tema (claro/oscuro).
 * `viewBox` = [x, y, ancho, alto] para encuadrar (por defecto, el lienzo completo).
 */
export const renderPoseSvg = (pose, { title = '', view = 'side', viewBox = DEFAULT_VIEWBOX } = {}) => {
  const parts = buildScene(pose, view).map(({ item, color }) => renderItem(item, view, color));
  const [vx, vy, vw, vh] = viewBox;
  const floor = pose.noFloor || view === 'top' ? '' : `<line x1="${fmt(vx + 4)}" y1="${FLOOR_Y + 1}" x2="${fmt(vx + vw - 4)}" y2="${FLOOR_Y + 1}" stroke="${COLORS.floor}" stroke-width="2" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(vx)} ${fmt(vy)} ${fmt(vw)} ${fmt(vh)}" role="img" aria-label="${title.replace(/"/g, '')}">${floor}${parts.join('')}</svg>`;
};

// ───────── Interpolación ("Mitad") ─────────

// Ángulos: por el camino corto (el pullover iba de 178° a -108° y la mitad salía por delante del cuerpo).
const blendAngle = (a, b) => {
  let diff = b - a;
  if (diff > 180) diff -= 360;
  else if (diff < -180) diff += 360;
  return a + diff / 2;
};

const blend = (a, b, angular) => {
  if (typeof a === 'number' && typeof b === 'number') return angular ? blendAngle(a, b) : (a + b) / 2;
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length && a[0] !== 'rel') return a.map((value, index) => blend(value, b[index], angular));
  if (Array.isArray(a) && Array.isArray(b) && a[0] === 'rel' && b[0] === 'rel') return ['rel', blend(a[1], b[1], angular), blend(a[2], b[2], angular)];
  return a;
};

export const interpolatePose = (start, end) => {
  const result = { ...start };
  ['t', 'neck', 'tilt', 'rot', 'twist'].forEach((key) => {
    if (typeof start[key] === 'number' || typeof end[key] === 'number') result[key] = blend(start[key] ?? 0, end[key] ?? 0, true);
  });
  ['lift', 'dx', 'shrug'].forEach((key) => {
    if (typeof start[key] === 'number' || typeof end[key] === 'number') result[key] = blend(start[key] ?? 0, end[key] ?? 0, false);
  });
  ['a1', 'a2', 'l1', 'l2', 'arms', 'legs'].forEach((key) => {
    if (start[key] !== undefined && end[key] !== undefined) result[key] = blend(start[key], end[key], true);
  });
  ['hip', 'grip'].forEach((key) => {
    if (start[key] !== undefined && end[key] !== undefined) result[key] = blend(start[key], end[key], false);
  });
  if (start.abd || end.abd) {
    const keys = new Set([...Object.keys(start.abd ?? {}), ...Object.keys(end.abd ?? {})]);
    result.abd = Object.fromEntries([...keys].map((key) => [key, blend(start.abd?.[key] ?? DEFAULT_ABDUCTION[key], end.abd?.[key] ?? DEFAULT_ABDUCTION[key], false)]));
  }
  return result;
};
