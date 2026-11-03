import { BODY } from './skeleton';
import { add, cross, lerp, madd, norm, perp, scale, sub } from './vec';

/*
 * Cuerpo con volumen muscular a partir del esqueleto.
 * Cada parte es una lista de "nubes" de puntos 3D; al proyectar, cada nube se convierte en su envolvente convexa
 * y la unión de envolventes da la silueta (entre estaciones aparecen las curvas de cada músculo).
 * Además, cada parte trae líneas de definición muscular (separación bíceps/tríceps, pectoral, abdominales, cuádriceps,
 * gemelo, etc.) que solo se dibujan si esa cara del cuerpo mira a la cámara.
 */

const RING = 14;

// Elipse 3D (sección transversal): centro, dos ejes unitarios y radios.
const ellipse = (center, ax1, r1, ax2, r2, count = RING) =>
  Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    return madd(center, [ax1, Math.cos(angle) * r1], [ax2, Math.sin(angle) * r2]);
  });

/*
 * Tubo muscular: estaciones { t, wl, wa, oa, ol } a lo largo de a→b.
 * wl = radio hacia afuera (eje `out`), wa = radio anterior (eje `ant`), oa/ol = desplazamiento del centro.
 */
const tube = (a, b, out, ant, stations) => {
  const axis = sub(b, a);
  const rings = stations.map((s) => {
    const center = madd(a, [axis, s.t], [ant, s.oa ?? 0], [out, s.ol ?? 0]);
    return { center, ring: ellipse(center, out, s.wl, ant, s.wa), s };
  });
  const clouds = [];
  for (let index = 0; index < rings.length - 1; index += 1) clouds.push([...rings[index].ring, ...rings[index + 1].ring]);
  return { clouds, rings };
};

// Punto sobre la superficie de un tubo: estación interpolada y ángulo (0 = afuera, 90 = adelante, 180 = adentro, 270 = atrás).
const surfacePoint = (a, b, out, ant, stations, t, angleDeg, inset = 0.9) => {
  let lo = stations[0];
  let hi = stations[stations.length - 1];
  for (let index = 0; index < stations.length - 1; index += 1) {
    if (t >= stations[index].t && t <= stations[index + 1].t) { lo = stations[index]; hi = stations[index + 1]; break; }
  }
  const f = hi.t === lo.t ? 0 : (t - lo.t) / (hi.t - lo.t);
  const k = (key) => (lo[key] ?? 0) + ((hi[key] ?? 0) - (lo[key] ?? 0)) * f;
  const angle = (angleDeg * Math.PI) / 180;
  const center = madd(a, [sub(b, a), t], [ant, k('oa')], [out, k('ol')]);
  const point = madd(center, [out, Math.cos(angle) * k('wl') * inset], [ant, Math.sin(angle) * k('wa') * inset]);
  const normal = norm(add(scale(out, Math.cos(angle) / Math.max(0.5, k('wl'))), scale(ant, Math.sin(angle) / Math.max(0.5, k('wa')))));
  return { point, normal };
};

const curve = (sampler, from, to, steps = 8) => Array.from({ length: steps + 1 }, (_, index) => sampler(from + ((to - from) * index) / steps));

// ───────── Perfiles musculares (proporciones de un adulto entrenado) ─────────

const UPPER_ARM = [
  { t: -0.12, wl: 4.6, wa: 5.2 },
  { t: 0.04, wl: 6.1, wa: 6.0, oa: 0.2 },
  { t: 0.24, wl: 5.6, wa: 5.6, oa: 0.3 },
  { t: 0.42, wl: 4.6, wa: 5.1, oa: 0.5 },
  { t: 0.6, wl: 4.3, wa: 5.0, oa: 0.6 },
  { t: 0.8, wl: 3.9, wa: 4.1, oa: 0.3 },
  { t: 1.02, wl: 3.5, wa: 3.2 },
];
const FOREARM = [
  { t: -0.05, wl: 3.6, wa: 3.2 },
  { t: 0.16, wl: 4.2, wa: 3.7, oa: 0.4 },
  { t: 0.4, wl: 3.6, wa: 3.0, oa: 0.2 },
  { t: 0.7, wl: 2.8, wa: 2.2 },
  { t: 0.93, wl: 2.3, wa: 1.7 },
  { t: 1.0, wl: 2.3, wa: 1.6 },
];
const THIGH = [
  { t: -0.08, wl: 7.4, wa: 7.6 },
  { t: 0.12, wl: 7.7, wa: 7.4, oa: 0.3 },
  { t: 0.36, wl: 6.9, wa: 6.7, oa: 0.7 },
  { t: 0.6, wl: 6.0, wa: 5.9, oa: 0.7 },
  { t: 0.8, wl: 5.2, wa: 5.1, oa: 0.5, ol: -0.4 },
  { t: 0.94, wl: 4.6, wa: 4.6, oa: 0.4 },
  { t: 1.03, wl: 4.3, wa: 4.4, oa: 0.4 },
];
const SHIN = [
  { t: -0.03, wl: 4.2, wa: 4.2 },
  { t: 0.15, wl: 4.6, wa: 5.1, oa: -1.0 },
  { t: 0.32, wl: 4.4, wa: 4.8, oa: -1.1 },
  { t: 0.55, wl: 3.4, wa: 3.5, oa: -0.5 },
  { t: 0.8, wl: 2.7, wa: 2.7, oa: -0.1 },
  { t: 1.0, wl: 2.7, wa: 2.9 },
];

/*
 * Tronco: estaciones por altura `h` (0 = línea de caderas). Hasta la cintura se usa la base de la pelvis y desde ahí la
 * del tórax (el tronco se curva en crunch, extensiones, etc.). w = medio ancho, d = media profundidad, f = desplazamiento
 * del centro hacia adelante (pecho) o atrás (glúteos).
 */
const TORSO = [
  { h: -10, w: 9.0, d: 6.5, f: -0.6 },
  { h: -4, w: 12.4, d: 8.8, f: -1.6 },
  { h: 3, w: 12.2, d: 8.2, f: -0.6 },
  { h: 10, w: 10.8, d: 7.4, f: 0.3 },
  { h: 16, w: 10.6, d: 7.6, f: 0.6 },
  { h: 24, w: 12.4, d: 8.6, f: 1.1 },
  { h: 32, w: 14.0, d: 9.6, f: 1.8 },
  { h: 38, w: 15.2, d: 9.0, f: 1.4 },
  { h: 43, w: 13.4, d: 7.0, f: -0.2 },
  { h: 46.5, w: 7.0, d: 5.2, f: -1.0 },
];

const torsoFrame = (sk, h) => {
  const { pelvis, chest, waist } = sk;
  if (h <= BODY.pelvisLen) {
    return { center: madd(pelvis.o, [pelvis.basis.up, h]), basis: pelvis.basis };
  }
  const basis = chest.basis;
  return { center: madd(waist, [basis.up, h - BODY.pelvisLen]), basis };
};

const torsoPoint = (sk, h, angleDeg, inset = 0.92) => {
  let lo = TORSO[0];
  let hi = TORSO[TORSO.length - 1];
  for (let index = 0; index < TORSO.length - 1; index += 1) {
    if (h >= TORSO[index].h && h <= TORSO[index + 1].h) { lo = TORSO[index]; hi = TORSO[index + 1]; break; }
  }
  const f = hi.h === lo.h ? 0 : (h - lo.h) / (hi.h - lo.h);
  const k = (key) => lo[key] + (hi[key] - lo[key]) * f;
  const { center, basis } = torsoFrame(sk, h);
  const angle = (angleDeg * Math.PI) / 180;
  const c = madd(center, [basis.fwd, k('f')]);
  return {
    point: madd(c, [basis.lat, Math.cos(angle) * k('w') * inset], [basis.fwd, Math.sin(angle) * k('d') * inset]),
    normal: norm(add(scale(basis.lat, Math.cos(angle) / k('w')), scale(basis.fwd, Math.sin(angle) / k('d')))),
  };
};

const buildTorso = (sk) => {
  const rings = TORSO.map((s) => {
    const { center, basis } = torsoFrame(sk, s.h);
    const c = madd(center, [basis.fwd, s.f]);
    return { center: c, ring: ellipse(c, basis.lat, s.w, basis.fwd, s.d, 18) };
  });
  const clouds = [];
  for (let index = 0; index < rings.length - 1; index += 1) clouds.push([...rings[index].ring, ...rings[index + 1].ring]);
  // Trapecio: une la base del cuello con los hombros (pendiente del "yugo").
  const { basis } = sk.chest;
  const trap = [sk.arms.L.root, sk.arms.R.root].flatMap((shoulder) => [madd(shoulder, [basis.up, 2.2], [basis.fwd, -1.5]), madd(shoulder, [basis.up, 1], [basis.fwd, 2])]);
  clouds.push([...trap, madd(sk.neckBase, [basis.up, 3], [basis.fwd, -2.5]), madd(sk.neckBase, [basis.up, 2], [basis.fwd, 1.5]), madd(sk.neckBase, [basis.up, -1], [basis.lat, 5]), madd(sk.neckBase, [basis.up, -1], [basis.lat, -5])]);

  const line = (sampler, from, to, steps) => curve(sampler, from, to, steps);
  const details = [
    // Borde inferior del pectoral (de la axila al esternón), a ambos lados.
    line((a) => torsoPoint(sk, 28.5 + Math.abs(a - 90) * 0.06, a), 32, 86, 10),
    line((a) => torsoPoint(sk, 28.5 + Math.abs(a - 90) * 0.06, a), 94, 148, 10),
    // Línea alba y separación entre pectorales.
    line((h) => torsoPoint(sk, h, 90), 4, 38, 10),
    // Líneas de los abdominales.
    line((a) => torsoPoint(sk, 20, a), 62, 118, 6),
    line((a) => torsoPoint(sk, 13.5, a), 64, 116, 6),
    // Oblicuos / borde del dorsal.
    line((h) => torsoPoint(sk, h, 18 + h * 0.6), 6, 30, 8),
    line((h) => torsoPoint(sk, h, 162 - h * 0.6), 6, 30, 8),
    // Columna y omóplatos (espalda).
    line((h) => torsoPoint(sk, h, 270), 8, 42, 10),
    line((h) => torsoPoint(sk, h, 232 + (h - 26) * 0.8), 26, 40, 6),
    line((h) => torsoPoint(sk, h, 308 - (h - 26) * 0.8), 26, 40, 6),
    // Pliegue de los glúteos.
    line((a) => torsoPoint(sk, -7.5, a), 205, 262, 6),
    line((a) => torsoPoint(sk, -7.5, a), 278, 335, 6),
  ];
  return { clouds, details, anchor: sk.chest.o };
};

const buildArm = (sk, side) => {
  const arm = sk.arms[side];
  const hand = arm.hand;
  const upperOut = side === 'L' ? norm(cross(arm.a1, arm.d1)) : norm(cross(arm.d1, arm.a1));
  const upper = tube(arm.root, arm.mid, upperOut, arm.a1, UPPER_ARM);
  // Antebrazo: la sección se aplana en el plano de la palma (radio y cúbito).
  const fore = tube(arm.mid, arm.end, hand.foreThumb, hand.forePalm, FOREARM);
  const upperLine = (t, ang) => surfacePoint(arm.root, arm.mid, upperOut, arm.a1, UPPER_ARM, t, ang);
  const foreLine = (t, ang) => surfacePoint(arm.mid, arm.end, hand.foreThumb, hand.forePalm, FOREARM, t, ang);
  return {
    upper: {
      clouds: upper.clouds,
      details: [
        curve((t) => upperLine(t, 8), 0.36, 0.86, 8), // bíceps / tríceps (cara externa)
        curve((t) => upperLine(t, 172), 0.36, 0.86, 8), // cara interna
        curve((a) => upperLine(0.3 + Math.sin((a * Math.PI) / 180) * 0.06, a), -10, 190, 12), // borde del deltoides
      ],
      anchor: lerp(arm.root, arm.mid, 0.5),
    },
    fore: {
      clouds: fore.clouds,
      details: [curve((t) => foreLine(t, 60 - t * 40), 0.08, 0.72, 8), curve((t) => foreLine(t, 200 + t * 30), 0.08, 0.6, 6)],
      anchor: lerp(arm.mid, arm.end, 0.5),
    },
    hand: buildHand(hand),
  };
};

// Mano: palma, dedos (estirados o cerrados en puño) y pulgar. La muñeca queda marcada por el cambio de ancho.
const buildHand = (hand) => {
  const { wrist, dir, palm, thumb, grip } = hand;
  const knuckles = madd(wrist, [dir, BODY.palm]);
  const box = (from, to, halfW, halfT, wTo = halfW) => [from, to].flatMap((p, index) => {
    const w = index === 0 ? halfW : wTo;
    return [[w, halfT], [w, -halfT], [-w, halfT], [-w, -halfT]].map(([a, b]) => madd(p, [thumb, a], [palm, b]));
  });
  const clouds = [box(madd(wrist, [dir, 0.3]), knuckles, 3.0, 1.7, 3.9)];
  let thumbTip;
  const thumbBase = madd(wrist, [dir, 2.4], [thumb, 2.6], [palm, 0.8]);
  if (grip === 'fist') {
    // Dedos cerrados alrededor del agarre: bloque que se curva hacia la palma.
    clouds.push([
      ...box(madd(knuckles, [dir, -1]), madd(knuckles, [dir, 2.4]), 3.9, 1.7, 3.6),
      ...[[3.4, 0], [-3.4, 0]].flatMap(([w]) => [madd(knuckles, [thumb, w], [dir, 1.6], [palm, 4.2]), madd(knuckles, [thumb, w], [dir, -1.6], [palm, 4.6])]),
    ]);
    thumbTip = madd(thumbBase, [dir, 5.6], [palm, 3.2], [thumb, -1.6]);
  } else if (grip === 'spread') {
    // Dedos abiertos en abanico (extensión de dedos).
    clouds.push(box(knuckles, madd(knuckles, [dir, BODY.fingers]), 4.2, 1.0, 5.6));
    thumbTip = madd(thumbBase, [dir, 3.6], [thumb, 3.4]);
  } else if (grip === 'flat') {
    clouds.push(box(knuckles, madd(knuckles, [dir, BODY.fingers]), 3.8, 1.1, 3.2));
    thumbTip = madd(thumbBase, [dir, 4.6], [thumb, 1.4]);
  } else {
    clouds.push(box(knuckles, madd(knuckles, [dir, BODY.fingers], [palm, 1.6]), 3.7, 1.2, 3.1));
    thumbTip = madd(thumbBase, [dir, 4.8], [thumb, 1.6], [palm, 1.4]);
  }
  clouds.push([...ellipse(thumbBase, perp(thumb, dir), 1.8, palm, 1.6, 8), ...ellipse(thumbTip, perp(thumb, dir), 1.3, palm, 1.2, 8)]);
  return { clouds, details: [], anchor: knuckles };
};

const buildLeg = (sk, side) => {
  const leg = sk.legs[side];
  const out = side === 'L' ? norm(cross(leg.a1, leg.d1)) : norm(cross(leg.d1, leg.a1));
  const shinOut = side === 'L' ? norm(cross(leg.a2, leg.d2)) : norm(cross(leg.d2, leg.a2));
  const thigh = tube(leg.root, leg.mid, out, leg.a1, THIGH);
  const shin = tube(leg.mid, leg.end, shinOut, leg.a2, SHIN);
  const thighLine = (t, ang) => surfacePoint(leg.root, leg.mid, out, leg.a1, THIGH, t, ang);
  const shinLine = (t, ang) => surfacePoint(leg.mid, leg.end, shinOut, leg.a2, SHIN, t, ang);
  const foot = leg.foot;
  const at = (fd, fu, fl) => madd(foot.ankle, [foot.dir, fd], [foot.up, fu], [foot.lat, fl]);
  const footCloud = [
    at(-4.6, -4.6, 2.2), at(-4.6, -4.6, -2.2), at(-5.2, -1.2, 2.2), at(-5.2, -1.2, -2.2),
    at(0.4, 2.2, 2.6), at(0.4, 2.2, -2.6), at(6, 0, 3.0), at(6, 0, -3.0),
    at(11.5, -4.8, 4.2), at(11.5, -4.8, -3.6), at(15.5, -4.6, 2.6), at(15.5, -4.6, -2.2), at(13.8, -2.6, 3.4), at(13.8, -2.6, -2.8),
  ];
  return {
    thigh: {
      clouds: thigh.clouds,
      details: [
        curve((t) => thighLine(t, 0), 0.1, 0.92, 9), // banda iliotibial: cuádriceps / isquiotibiales
        curve((t) => thighLine(t, 180), 0.25, 0.9, 8), // aductores
        curve((t) => thighLine(t, 90 + (t - 0.2) * 70), 0.2, 0.82, 8), // recto femoral / vasto medial
      ],
      anchor: lerp(leg.root, leg.mid, 0.5),
    },
    shin: {
      clouds: shin.clouds,
      details: [curve((t) => shinLine(t, 300 - t * 30), 0.06, 0.6, 7), curve((t) => shinLine(t, 90), 0.08, 0.85, 8)],
      anchor: lerp(leg.mid, leg.end, 0.5),
    },
    foot: { clouds: [footCloud], details: [], anchor: at(5, 0, 0) },
  };
};

const buildHead = (sk) => {
  const { o, basis } = sk.head;
  const { up, fwd, lat } = basis;
  const skull = [];
  for (let i = 0; i < 7; i += 1) {
    const phi = (i / 6) * Math.PI - Math.PI / 2;
    for (let j = 0; j < 10; j += 1) {
      const theta = (j / 10) * Math.PI * 2;
      skull.push(madd(o, [up, Math.sin(phi) * 9.2 + 0.8], [fwd, Math.cos(phi) * Math.cos(theta) * 8.6 - 0.6], [lat, Math.cos(phi) * Math.sin(theta) * 7.2]));
    }
  }
  const jaw = [
    madd(o, [up, -8.8], [fwd, 5.6]), madd(o, [up, -9.6], [fwd, 3.4], [lat, 2]), madd(o, [up, -9.6], [fwd, 3.4], [lat, -2]),
    madd(o, [up, -6.5], [fwd, -1], [lat, 5.4]), madd(o, [up, -6.5], [fwd, -1], [lat, -5.4]), madd(o, [up, -2], [fwd, 6.8], [lat, 3]), madd(o, [up, -2], [fwd, 6.8], [lat, -3]),
  ];
  const nose = [madd(o, [up, 0.6], [fwd, 7.6]), madd(o, [up, -2.6], [fwd, 9.6]), madd(o, [up, -3.6], [fwd, 7.8]), madd(o, [up, -2.4], [fwd, 7.8], [lat, 1.4]), madd(o, [up, -2.4], [fwd, 7.8], [lat, -1.4])];
  const neckOut = sk.chest.basis.lat;
  const neckFwd = perp(sk.chest.basis.fwd, norm(sub(sk.neckTop, sk.neckBase)));
  const neck = tube(sk.neckBase, madd(sk.neckTop, [up, 2]), neckOut, neckFwd, [{ t: 0, wl: 5.6, wa: 4.8 }, { t: 0.5, wl: 4.5, wa: 4.4, oa: 0.4 }, { t: 1, wl: 4.2, wa: 4.2, oa: 0.6 }]);
  const ear = (sign) => ({ point: madd(o, [up, -0.5], [fwd, -0.8], [lat, sign * 7.1]), normal: scale(lat, sign) });
  const earLoop = (sign) => Array.from({ length: 7 }, (_, index) => {
    const a = (index / 6) * Math.PI * 2;
    const base = ear(sign);
    return { point: madd(base.point, [up, Math.sin(a) * 2.2], [fwd, Math.cos(a) * 1.4]), normal: base.normal };
  });
  return {
    head: { clouds: [skull, [...jaw, madd(o, [up, -3], [fwd, -5], [lat, 5]), madd(o, [up, -3], [fwd, -5], [lat, -5])], nose], details: [earLoop(1), earLoop(-1)], anchor: o },
    neck: { clouds: neck.clouds, details: [], anchor: lerp(sk.neckBase, sk.neckTop, 0.5) },
  };
};

/**
 * Partes del cuerpo listas para proyectar: { id, side, role, clouds, details, anchor }.
 * role: 'torso' | 'limb' | 'head'. side: 'L' | 'R' | null.
 */
export const buildBodyParts = (sk) => {
  const parts = [];
  const torso = buildTorso(sk);
  parts.push({ id: 'torso', side: null, role: 'torso', ...torso });
  const { head, neck } = buildHead(sk);
  parts.push({ id: 'neck', side: null, role: 'head', ...neck });
  parts.push({ id: 'head', side: null, role: 'head', ...head });
  ['L', 'R'].forEach((side) => {
    const arm = buildArm(sk, side);
    parts.push({ id: `upperArm${side}`, side, role: 'limb', ...arm.upper });
    parts.push({ id: `forearm${side}`, side, role: 'limb', ...arm.fore });
    parts.push({ id: `hand${side}`, side, role: 'limb', ...arm.hand });
    const leg = buildLeg(sk, side);
    parts.push({ id: `thigh${side}`, side, role: 'limb', ...leg.thigh });
    parts.push({ id: `shin${side}`, side, role: 'limb', ...leg.shin });
    parts.push({ id: `foot${side}`, side, role: 'limb', ...leg.foot });
  });
  return parts;
};
