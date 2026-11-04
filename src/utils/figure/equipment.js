import { COLORS } from './render';
import { FLOOR_Y } from './skeleton';
import { add, cross, lerp, madd, norm, scale, sub } from './vec';

/*
 * Implementos y máquinas como primitivas 3D (barras, mancuernas, poleas, bancos, máquinas, aparatos de cardio).
 * Coordenadas de mundo (ver skeleton.js). Los pesos se pintan con el color de acento y las estructuras en gris.
 * `bias` < 0 empuja una estructura hacia atrás en el orden de dibujo (bancos y marcos quedan detrás del cuerpo).
 */

const GEAR = COLORS.gear;
const FRAME = COLORS.frame;
const DARK = COLORS.body;

const helperAxes = (normal) => {
  const n = norm(normal);
  const helper = Math.abs(n[1]) < 0.85 ? [0, 1, 0] : [1, 0, 0];
  const u = norm(cross(n, helper));
  return [u, cross(n, u)];
};

export const ringPts = (center, normal, r, count = 14) => {
  const [u, w] = helperAxes(normal);
  return Array.from({ length: count }, (_, index) => {
    const a = (index / count) * Math.PI * 2;
    return madd(center, [u, Math.cos(a) * r], [w, Math.sin(a) * r]);
  });
};

export const solid = (clouds, opts = {}) => ({ kind: 'solid', clouds, fill: opts.fill ?? FRAME, bias: opts.bias ?? 0, smooth: opts.smooth, views: opts.views, opacity: opts.opacity, stroke: opts.stroke, strokeWidth: opts.strokeWidth });
export const line = (a, b, opts = {}) => ({ kind: 'line', pts: [a, b], color: opts.color ?? FRAME, width: opts.width ?? 2, bias: opts.bias ?? 0, dash: opts.dash, views: opts.views, opacity: opts.opacity });
export const polyline = (pts, opts = {}) => ({ kind: 'polyline', pts, color: opts.color ?? FRAME, width: opts.width ?? 2, bias: opts.bias ?? 0, views: opts.views, opacity: opts.opacity });
export const sphere = (c, r, opts = {}) => ({ kind: 'circle', pts: [c], r, fill: opts.fill ?? GEAR, bias: opts.bias ?? 0, views: opts.views });

// Cilindro entre a y b. Si es fino se dibuja como línea (más liviano).
export const rod = (a, b, r, opts = {}) => {
  if (r < 1.4) return line(a, b, { ...opts, width: r * 2, color: opts.fill ?? opts.color ?? FRAME });
  const axis = sub(b, a);
  return solid([[...ringPts(a, axis, r, 10), ...ringPts(b, axis, r, 10)]], { ...opts, smooth: false });
};

// Cilindro partido en tramos: así el orden de dibujo es correcto cuando cruza el cuerpo (barra en la espalda).
export const segmentedRod = (a, b, r, pieces, opts = {}) =>
  Array.from({ length: pieces }, (_, index) => rod(lerp(a, b, index / pieces), lerp(a, b, (index + 1) / pieces), r, opts));

export const disc = (center, normal, r, thick, opts = {}) => {
  const n = norm(normal);
  return solid([[...ringPts(madd(center, [n, -thick / 2]), n, r, 18), ...ringPts(madd(center, [n, thick / 2]), n, r, 18)]], { fill: GEAR, ...opts, smooth: false });
};

// Caja orientada: centro, 3 ejes unitarios y medias medidas.
export const box = (center, axes, half, opts = {}) => {
  const pts = [];
  [-1, 1].forEach((i) => [-1, 1].forEach((j) => [-1, 1].forEach((k) => pts.push(madd(center, [axes[0], i * half[0]], [axes[1], j * half[1]], [axes[2], k * half[2]])))));
  return solid([pts], { ...opts, smooth: false });
};
export const aabb = (min, max, opts = {}) => box(scale(add(min, max), 0.5), [[1, 0, 0], [0, 1, 0], [0, 0, 1]], scale(sub(max, min), 0.5), opts);

// Almohadilla (tapizado): tabla de a→b (línea central de la cara superior), ancho total 2·halfW, espesor hacia `down`.
export const pad = (a, b, halfW, thick, down = [0, 1, 0], opts = {}) => {
  const along = norm(sub(b, a));
  const d = norm(down);
  const across = norm(cross(along, d));
  const c = madd(lerp(a, b, 0.5), [d, thick / 2]);
  const length = Math.hypot(...sub(b, a));
  return solid([[-1, 1].flatMap((i) => [-1, 1].flatMap((j) => [-1, 1].map((k) => madd(c, [along, (i * length) / 2], [across, j * halfW], [d, (k * thick) / 2 * (i === 0 ? 1 : 1)]))))], { fill: DARK, bias: -6, smooth: true, ...opts });
};

// Pata/poste vertical hasta el piso.
export const post = (top, opts = {}) => rod(top, [top[0], FLOOR_Y, top[2]], opts.r ?? 1.6, { bias: -8, ...opts });

// ───────── Pesos libres ─────────

export const barbell = (center, opts = {}) => {
  const axis = norm(opts.axis ?? [0, 0, 1]);
  const half = opts.half ?? 72;
  const plateR = opts.plateR ?? 19;
  const plates = opts.plates ?? 2;
  const inner = opts.inner ?? 54;
  const items = [...segmentedRod(madd(center, [axis, -inner]), madd(center, [axis, inner]), 1.0, 6, { fill: FRAME })];
  if (half > inner) items.push(rod(madd(center, [axis, -half]), madd(center, [axis, -inner]), 1.6, { fill: FRAME }), rod(madd(center, [axis, inner]), madd(center, [axis, half]), 1.6, { fill: FRAME }));
  if (plateR > 0) {
    [-1, 1].forEach((sign) => {
      for (let index = 0; index < plates; index += 1) {
        const r = index === 0 ? plateR : plateR * 0.78;
        items.push(disc(madd(center, [axis, sign * (inner + 3 + index * 3.4)]), axis, r, 3, { opacity: opts.plateOpacity ?? 0.7 }));
      }
      items.push(disc(madd(center, [axis, sign * (inner + 4 + plates * 3.4)]), axis, 2.6, 1.6, { fill: FRAME }));
    });
  }
  return items;
};

// Barra W (EZ): tramo central en zigzag y discos más chicos.
export const ezBar = (center, opts = {}) => {
  const axis = norm(opts.axis ?? [0, 0, 1]);
  const bend = norm(opts.bendDir ?? [1, 0, 0]);
  const zig = [-30, -20, -12, -6, 0, 6, 12, 20, 30].map((z, index) => madd(center, [axis, z], [bend, [0, 2.2, 0, 2.2, 0, 2.2, 0, 2.2, 0][index]]));
  return [
    polyline(zig, { color: FRAME, width: 2 }),
    rod(madd(center, [axis, -44]), madd(center, [axis, -30]), 1.5, { fill: FRAME }),
    rod(madd(center, [axis, 30]), madd(center, [axis, 44]), 1.5, { fill: FRAME }),
    disc(madd(center, [axis, -35]), axis, opts.plateR ?? 12, 2.6, { opacity: 0.7 }),
    disc(madd(center, [axis, 35]), axis, opts.plateR ?? 12, 2.6, { opacity: 0.7 }),
  ];
};

// Barra hexagonal (trap bar): marco alrededor del cuerpo con manijas a los costados.
export const trapBar = (center, opts = {}) => {
  const f = norm(opts.fwd ?? [1, 0, 0]);
  const z = norm(opts.axis ?? [0, 0, 1]);
  const hex = [[-22, -14], [0, -24], [22, -14], [22, 14], [0, 24], [-22, 14]].map(([a, b]) => madd(center, [f, a * 0.9], [z, b]));
  return [
    polyline([...hex, hex[0]], { color: FRAME, width: 2.2 }),
    rod(madd(center, [z, -24]), madd(center, [z, -50]), 1.6, { fill: FRAME }),
    rod(madd(center, [z, 24]), madd(center, [z, 50]), 1.6, { fill: FRAME }),
    disc(madd(center, [z, -32]), z, opts.plateR ?? 19, 3, { opacity: 0.7 }),
    disc(madd(center, [z, 32]), z, opts.plateR ?? 19, 3, { opacity: 0.7 }),
    rod(madd(center, [z, -16]), madd(center, [z, -16], [f, 0.1]), 1.2, { fill: DARK }),
  ];
};

export const dumbbell = (center, axisDir, opts = {}) => {
  const axis = norm(axisDir);
  const r = opts.r ?? 6;
  const half = opts.half ?? 5.5;
  return [
    rod(madd(center, [axis, -half]), madd(center, [axis, half]), 1.0, { fill: FRAME }),
    disc(madd(center, [axis, -(half + 2.2)]), axis, r, 4.2, opts),
    disc(madd(center, [axis, half + 2.2]), axis, r, 4.2, opts),
  ];
};

// Kettlebell: manija (arco) arriba y bola abajo. `up` = hacia dónde queda la manija respecto de la bola.
export const kettlebell = (handle, opts = {}) => {
  const up = norm(opts.up ?? [0, -1, 0]);
  const across = norm(opts.across ?? [0, 0, 1]);
  const r = opts.r ?? 7.5;
  const bell = madd(handle, [up, -(r + 3)]);
  const arc = Array.from({ length: 9 }, (_, index) => {
    const a = (index / 8) * Math.PI;
    return madd(handle, [across, Math.cos(a) * 4.6], [up, Math.sin(a) * 2.6 - 1.4]);
  });
  return [polyline(arc, { color: FRAME, width: 1.8 }), sphere(bell, r)];
};

export const plate = (center, normal, r = 15, opts = {}) => [disc(center, normal, r, 3, { opacity: 0.85, ...opts }), disc(center, normal, 3, 3.4, { fill: COLORS.gap })];
export const ball = (center, r = 8, opts = {}) => sphere(center, r, opts);

// ───────── Estructuras ─────────

// Banco plano: tapizado de x0 a x1 con la cara superior a `topY`.
export const flatBench = (x0, x1, topY, opts = {}) => {
  const z = opts.z ?? 0;
  const items = [pad([x0, topY, z], [x1, topY, z], opts.halfW ?? 12, 5)];
  [x0 + 8, x1 - 8].forEach((x) => items.push(rod([x, topY + 5, z], [x, FLOOR_Y, z], 1.8, { bias: -8 })));
  items.push(rod([x0 + 4, FLOOR_Y - 1, z], [x1 - 4, FLOOR_Y - 1, z], 1.8, { bias: -8 }));
  return items;
};

// Banco con respaldo inclinado: asiento horizontal + respaldo desde la base del asiento con `angle` (grados sobre la horizontal).
export const inclineBench = (seatX, seatY, angle, opts = {}) => {
  const backLen = opts.backLen ?? 62;
  const dir = [-Math.cos((angle * Math.PI) / 180), -Math.sin((angle * Math.PI) / 180), 0];
  const top = madd([seatX - 2, seatY, 0], [dir, backLen]);
  // Cara del respaldo (hacia la persona) y espesor hacia el lado opuesto.
  const face = [Math.sin((angle * Math.PI) / 180), -Math.cos((angle * Math.PI) / 180), 0];
  const down = scale(face, -1);
  const items = [
    pad([seatX - 2, seatY, 0], top, 12, 5, down),
    pad([seatX, seatY, 0], [seatX + (opts.seatLen ?? 22), seatY, 0], 12, 5),
    rod([seatX + 6, seatY + 5, 0], [seatX + 6, FLOOR_Y, 0], 1.8, { bias: -8 }),
    rod(madd(top, [down, 4]), [top[0] + 6, FLOOR_Y, 0], 1.8, { bias: -8 }),
    rod([top[0] + 2, FLOOR_Y - 1, 0], [seatX + 12, FLOOR_Y - 1, 0], 1.8, { bias: -8 }),
  ];
  return items;
};

// Tabla inclinada genérica (respaldo, banco declinado, apoyo de pecho): de `a` a `b`, con el tapizado hacia `face`.
export const slantPad = (a, b, face, opts = {}) => {
  const f = norm(face);
  return pad(a, b, opts.halfW ?? 12, opts.thick ?? 5, scale(f, -1), opts);
};

export const box3 = (min, max, opts = {}) => aabb(min, max, { fill: 'none', stroke: FRAME, strokeWidth: 2, bias: -6, ...opts });
export const plyoBox = (x0, x1, height, opts = {}) => aabb([x0, FLOOR_Y - height, -(opts.halfW ?? 18)], [x1, FLOOR_Y, opts.halfW ?? 18], { fill: FRAME, bias: -10, opacity: 0.85, ...opts });

// Barra fija con parantes (dominadas, colgarse). La barra corre en z a la altura `y`.
export const pullUpBar = (x, y, opts = {}) => {
  const half = opts.half ?? 40;
  const back = opts.back ?? -18;
  return [
    rod([x, y, -half], [x, y, half], 1.3, { fill: FRAME }),
    rod([x, y, -half], [x + back, y, -half], 1.6, { bias: -8 }),
    rod([x, y, half], [x + back, y, half], 1.6, { bias: -8 }),
    post([x + back, y, -half]),
    post([x + back, y, half]),
  ];
};

// Paralelas (fondos): dos barras en x a la altura `y`, separadas `half` en z.
export const dipBars = (x, y, opts = {}) => {
  const half = opts.half ?? 24;
  const len = opts.len ?? 30;
  return [-1, 1].flatMap((s) => [rod([x - len / 2, y, s * half], [x + len / 2, y, s * half], 1.5, { fill: FRAME }), post([x - len / 2 + 3, y, s * half]), post([x + len / 2 - 3, y, s * half])]);
};

// Columna de polea: torre con pila de pesas y polea a la altura `pulleyY`.
export const cableColumn = (x, z, pulleyY, opts = {}) => {
  const top = Math.min(pulleyY - 8, opts.top ?? FLOOR_Y - 172);
  const back = opts.back ?? 0;
  const items = [
    aabb([x - 4 + back, top, z - 4], [x + 4 + back, FLOOR_Y, z + 4], { fill: FRAME, bias: -60, opacity: 0.4 }),
    disc([x, pulleyY, z], opts.wheelAxis ?? [0, 0, 1], 3.2, 1.6, { fill: FRAME }),
  ];
  return items;
};

// Cable desde la polea hasta un punto (la mano, el tobillo o la manija).
export const cable = (from, to, opts = {}) => line(from, to, { color: GEAR, width: 1.2, ...opts });

// Manijas de polea: 'D' (estribo), 'rope' (soga), 'bar' (barra recta), 'v' (triángulo), 'strap' (tobillera).
export const handle = (type, at, axis = [0, 0, 1], opts = {}) => {
  const a = norm(axis);
  switch (type) {
    case 'rope': {
      const spread = opts.spread ?? 6;
      const down = norm(opts.down ?? [0, 1, 0]);
      return [polyline([madd(at, [down, -3]), madd(at, [a, -spread], [down, 2]), madd(at, [a, -spread * 1.2], [down, 4])], { color: DARK, width: 2.4 }), polyline([madd(at, [down, -3]), madd(at, [a, spread], [down, 2]), madd(at, [a, spread * 1.2], [down, 4])], { color: DARK, width: 2.4 })];
    }
    case 'bar':
      return [rod(madd(at, [a, -(opts.half ?? 22)]), madd(at, [a, opts.half ?? 22]), 1.1, { fill: FRAME })];
    case 'v':
      return [polyline([madd(at, [a, -4], [opts.down ?? [0, 1, 0], 2]), madd(at, [opts.down ?? [0, 1, 0], -3]), madd(at, [a, 4], [opts.down ?? [0, 1, 0], 2])], { color: FRAME, width: 2.2 })];
    case 'strap':
      return [sphere(at, 3, { fill: DARK })];
    default:
      return [rod(madd(at, [a, -4]), madd(at, [a, 4]), 1.0, { fill: FRAME })];
  }
};

// Pila de pesas de una máquina (caja vertical con discos).
export const weightStack = (x, z, opts = {}) => {
  const h = opts.h ?? 120;
  return [
    aabb([x - 5, FLOOR_Y - h, z - 9], [x + 5, FLOOR_Y, z + 9], { fill: FRAME, bias: -60, opacity: 0.4 }),
    aabb([x - 3.5, FLOOR_Y - 34, z - 7], [x + 3.5, FLOOR_Y - 4, z + 7], { fill: GEAR, bias: -59, opacity: 0.6 }),
  ];
};

// Asiento simple con poste (máquinas, banco Scott, cajón bajo).
export const seat = (cx, topY, opts = {}) => {
  const halfX = opts.halfX ?? 13;
  const z = opts.z ?? 0;
  return [pad([cx - halfX, topY, z], [cx + halfX, topY, z], opts.halfW ?? 12, 5), post([cx, topY + 5, z], { r: 2 })];
};

// Respaldo vertical/inclinado: desde `bottom` hacia arriba con inclinación `lean` (grados hacia atrás).
export const backrest = (bottom, length, lean = 10, opts = {}) => {
  const dir = [-Math.sin((lean * Math.PI) / 180), -Math.cos((lean * Math.PI) / 180), 0];
  const top = madd(bottom, [dir, length]);
  const face = [Math.cos((lean * Math.PI) / 180), -Math.sin((lean * Math.PI) / 180), 0];
  return [slantPad(bottom, top, face, opts), rod(madd(lerp(bottom, top, 0.5), [face, -6]), [bottom[0] - 10, FLOOR_Y, bottom[2]], 1.8, { bias: -10 })];
};

// Rodillo acolchado (máquinas de piernas, banco de hiperextensiones): cilindro corto en z.
export const roller = (center, opts = {}) => {
  const half = opts.half ?? 9;
  const axis = norm(opts.axis ?? [0, 0, 1]);
  return rod(madd(center, [axis, -half]), madd(center, [axis, half]), opts.r ?? 3.4, { fill: DARK, bias: opts.bias ?? 0 });
};

// Disco cargado en un perno de máquina (palanca de carga libre): se ve de canto en la vista lateral si `axis` es z.
export const loadedPlate = (at, axis = [0, 0, 1], r = 10) => [disc(at, axis, r, 2.6, { opacity: 0.75 }), disc(at, axis, 2.4, 3, { fill: FRAME })];

// Brazo de palanca (máquinas): barra de `pivot` a `end`.
export const lever = (pivot, end, opts = {}) => [rod(pivot, end, opts.r ?? 1.7, { fill: FRAME, bias: opts.bias ?? -2 }), disc(pivot, opts.axis ?? [0, 0, 1], 3, 2, { fill: FRAME })];

// Marco de máquina: polilínea gruesa gris detrás del cuerpo.
export const frame = (pts, opts = {}) => polyline(pts, { color: FRAME, width: opts.width ?? 3, bias: opts.bias ?? -14, opacity: opts.opacity ?? 0.8 });

// Rieles verticales del multipower (Smith) con la barra guiada.
export const smithRails = (x, opts = {}) => {
  const half = opts.half ?? 52;
  return [-1, 1].map((s) => rod([x, FLOOR_Y - 170, s * half], [x, FLOOR_Y, s * half], 1.5, { bias: -12, opacity: 0.8 }));
};

// Rack / jaula: dos parantes con soportes (ganchos) a la altura `hookY`.
export const rack = (x, hookY, opts = {}) => {
  const half = opts.half ?? 50;
  return [-1, 1].flatMap((s) => [rod([x, FLOOR_Y - 160, s * half], [x, FLOOR_Y, s * half], 1.8, { bias: -14, opacity: 0.7 }), rod([x, hookY, s * half], [x + 6, hookY, s * half], 1.2, { bias: -12 })]);
};

// Banda elástica entre dos puntos.
export const band = (a, b, opts = {}) => line(a, b, { color: GEAR, width: 1.6, ...opts });

// Correas de suspensión (TRX) o anillas: desde el anclaje alto hasta cada mano.
export const straps = (anchor, hands, opts = {}) => hands.flatMap((h) => [line(anchor, h, { color: FRAME, width: 1.4 }), opts.rings ? solid([ringPts(h, [0, 0, 1], 3.2, 10).concat(ringPts(h, [1, 0, 0], 3.2, 10))], { fill: 'none', stroke: GEAR, strokeWidth: 1.4 }) : rod(madd(h, [[0, 0, 1], -3]), madd(h, [[0, 0, 1], 3]), 1.2, { fill: DARK })]);

// Soga vertical colgada del techo (trepada).
export const climbRope = (x, z = 0, opts = {}) => line([x, opts.top ?? FLOOR_Y - 230, z], [x, FLOOR_Y, z], { color: GEAR, width: 2.6 });

// Sogas de batalla: ondas desde las manos hasta el anclaje.
export const battleRope = (hand, anchor, phase = 0, amp = 6) => {
  const pts = Array.from({ length: 24 }, (_, index) => {
    const t = index / 23;
    const p = lerp(hand, anchor, t);
    return add(p, [0, Math.sin(t * Math.PI * 3 + phase) * amp * (1 - t * 0.7), 0]);
  });
  return polyline(pts, { color: GEAR, width: 2.2 });
};

export const floorMark = (x0, x1, z = 0) => line([x0, FLOOR_Y - 0.5, z], [x1, FLOOR_Y - 0.5, z], { color: FRAME, width: 1.4 });
export { GEAR, FRAME, DARK };
