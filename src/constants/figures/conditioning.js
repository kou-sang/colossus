import * as E from '../../utils/figure/equipment';
import { createSkeleton } from '../../utils/figure/skeleton';
import { add, ANKLE_Y, armAngles, arms, BODY, chestPoint, fist, fistMid, FLOOR_Y, grab, lerp, madd, mix, norm, palmDown, pelvisFromShoulders, scale, scene, shoulderOf, sideSign, STAND_HIP_Y, sub, track, withBody } from './common';
import { plankBody, standing } from './setups';

/*
 * Funcional, cardio, crossfit, combate y movilidad.
 * Convenciones: x = adelante, y = abajo, z = izquierda de la figura. Ángulos de extremidades: e (elevación), p (plano: 0 adelante, 180 atrás), b (codo/rodilla).
 */

const BAR_Y = FLOOR_Y - 210;
const LEG_REACH = BODY.thigh + BODY.shin;
const deg = (a) => (a * Math.PI) / 180;

// Elevación con signo: positiva hacia adelante (flexión), negativa hacia atrás (extensión).
const swing = (a, b = 0, extra = {}) => ({ e: Math.abs(a), p: a >= 0 ? 0 : 180, b, ...extra });
const armSwing = (a, b = 90, hand = {}) => ({ arm: swing(Math.max(-55, a), b), hand: { pr: 90, grip: 'fist', ...hand } });

// Baja (o sube) todo el cuerpo hasta que el punto más bajo de los pies quede en floorY − air.
const ground = (pose, air = 0, floorY = FLOOR_Y) => {
  const sk = createSkeleton(pose);
  const low = Math.max(...['L', 'R'].flatMap((side) => [sk.legs[side].foot.heel[1], sk.legs[side].foot.toe[1], sk.legs[side].end[1] + 3]));
  return { ...pose, pelvis: { ...pose.pelvis, at: add(pose.pelvis.at, [0, floorY - air - low, 0]) } };
};

// De pie con salto opcional (air > 0 = en el aire con los pies en punta).
const standAir = ({ x = 0, drop = 0, hinge = 0, stance = 10.5, footX = 0, air = 0, toeOut = 10, kneeOut = 0.3, stagger = 0 } = {}) => {
  const base = standing({ x, drop: drop - air, hinge, stance, footX, toeOut, kneeOut, stagger });
  base.legL.to = add(base.legL.to, [0, -air, 0]);
  base.legR.to = add(base.legR.to, [0, -air, 0]);
  if (air > 0) { base.footL = { plantar: 30, out: toeOut }; base.footR = { plantar: 30, out: toeOut }; }
  base.neck = { flex: -hinge * 0.35 };
  return base;
};

const midShoulder = (sk) => lerp(shoulderOf(sk, 'L'), shoulderOf(sk, 'R'), 0.5);
const overheadGrip = (sk, grip, forward = 0) => {
  const m = midShoulder(sk);
  const reach = Math.sqrt(Math.max(0, 50 ** 2 - (grip - BODY.shoulderHalf) ** 2));
  return arms(
    grab([m[0] + forward, m[1] - reach, grip], [0.5, 1, 0.7], 180),
    grab([m[0] + forward, m[1] - reach, -grip], [0.5, 1, -0.7], 180),
  );
};
const frontRack = (sk, grip = 20) => {
  const bar = chestPoint(sk, 45, 9.5);
  return arms(grab(add(bar, [0, 0, grip]), [1, -0.2, 0.25], 40, { flex: -60, grip: 'open' }), grab(add(bar, [0, 0, -grip]), [1, -0.2, -0.25], 40, { flex: -60, grip: 'open' }));
};
const highPlankArms = (x, width = 19) => arms(palmDown([x, FLOOR_Y - 2.6, width], [-1, 0, 0.3], 100), palmDown([x, FLOOR_Y - 2.6, -width], [-1, 0, -0.3], 100));
const highPlank = (o = {}) => {
  const body = plankBody({ shoulderH: o.shoulderH ?? 50, toeX: o.toeX ?? -60 });
  const pose = { ...body.pose, ...(o.legs ?? {}) };
  return { pose, hx: body.shoulderX + 2 };
};
const wheel = (c, r, normal = [0, 0, 1], opts = {}) => {
  const pts = E.ringPts(c, normal, r, 28);
  return E.polyline([...pts, pts[0]], { color: opts.color ?? E.FRAME, width: opts.width ?? 2.4, bias: opts.bias ?? -12 });
};

/*
 * ───────── Marcha y carrera ─────────
 * keys: [cadera L, rodilla L, cadera R, rodilla R, vuelo] en las fases 0 / 0.5 / 1.
 */
const RUN_KEYS = [[0, [26, 14, -22, 45, 0]], [0.5, [-22, 50, 45, 95, 7]], [1, [-16, 80, 26, 14, 0]]];
const SPRINT_KEYS = [[0, [62, 100, -28, 8, 0]], [0.5, [-25, 20, 70, 110, 8]], [1, [-18, 95, 30, 20, 0]]];
const run = (o = {}) => (phase) => {
  const [lh, lk, rh, rk, air] = track(phase, o.keys ?? RUN_KEYS);
  const lean = typeof o.lean === 'function' ? o.lean(phase) : o.lean ?? 8;
  const pose = {
    pelvis: { at: [0, STAND_HIP_Y, 0], pitch: lean },
    neck: { flex: -lean * 0.7 },
    legL: swing(lh, lk), legR: swing(rh, rk),
    footL: { plantar: lh < 0 ? 28 : 0 }, footR: { plantar: rh < 0 ? 28 : 0 },
    ...arms(armSwing(-lh * (o.armAmp ?? 1.1) - lean * 0.5, o.elbow ?? 90), armSwing(-rh * (o.armAmp ?? 1.1) - lean * 0.5, o.elbow ?? 90)),
  };
  return scene(ground(pose, air + (o.deck ?? 0)), (sk) => (o.props ? o.props(sk, phase) : []));
};

const treadmill = (incline = 0) => () => {
  const a = Math.atan(incline);
  const dir = [Math.cos(a), -Math.sin(a), 0];
  const back = [-55, FLOOR_Y - 6, 0];
  const front = madd(back, [dir, 112]);
  return [
    E.pad(back, front, 20, 6, [Math.sin(a), Math.cos(a), 0], { fill: E.FRAME, bias: -10 }),
    E.line(front, [front[0] + 2, FLOOR_Y, 0], { color: E.FRAME, width: 3, bias: -12 }),
    [-1, 1].map((s) => E.polyline([[front[0] - 4, front[1], s * 22], [front[0] + 4, FLOOR_Y - 118, s * 22], [front[0] - 22, FLOOR_Y - 100, s * 22]], { color: E.FRAME, width: 2.2, bias: -14 })),
    E.aabb([front[0], FLOOR_Y - 126, -18], [front[0] + 8, FLOOR_Y - 112, 18], { fill: E.FRAME, bias: -16, opacity: 0.8 }),
  ];
};

// Caminata con los pies ubicados por IK (permite pendiente, carga en las manos y caminar hacia atrás).
const WALK_FEET = [[0, [22, 0, -20, 0]], [0.5, [0, 0, 5, 10]], [1, [-20, 0, 22, 0]]];
const walk = (o = {}) => (phase) => {
  const [lx0, ll, rx0, rl] = track(phase, o.feet ?? WALK_FEET);
  const k = o.stride ?? 1;
  const sign = o.backward ? -1 : 1;
  const [lx, rx] = [lx0 * k * sign + (o.footX ?? 0), rx0 * k * sign + (o.footX ?? 0)];
  const slope = o.slope ?? 0;
  const footY = (x) => FLOOR_Y - (o.deck ?? 0) - (x + 55) * slope - BODY.ankleH;
  const spread = Math.abs(lx - rx);
  const lean = o.lean ?? 3;
  const hipY = Math.min(footY(0), footY(-10)) - Math.sqrt(Math.max(0, (LEG_REACH - 1) ** 2 - (spread / 2) ** 2)) + (o.drop ?? 0);
  // Pie de apoyo plano, pie de atrás despegando en punta (tobillo elevado), pie en el aire relajado.
  const toeOff = (x, lift, other, otherLift) => (lift === 0 && otherLift === 0 && x * sign < other * sign ? 6 : 0);
  const footState = (x, lift, other, otherLift) => {
    if (lift > 0) return { plantar: 5 };
    if (otherLift > 0) return { flat: true };
    return x * sign > other * sign ? { plantar: -8 } : { plantar: 22 };
  };
  const base = {
    pelvis: { at: [o.hipX ?? 0, hipY, 0], pitch: lean },
    neck: { flex: -lean * 0.6 },
    legL: { to: [lx, footY(lx) - ll - toeOff(lx, ll, rx, rl), 9], pole: [1, -0.1, 0.1] }, footL: footState(lx, ll, rx, rl),
    legR: { to: [rx, footY(rx) - rl - toeOff(rx, rl, lx, ll), -9], pole: [1, -0.1, -0.1] }, footR: footState(rx, rl, lx, ll),
  };
  const pose = withBody(base, (sk) => (o.arms ? o.arms(sk, phase) : arms(armSwing(-(lx - (o.footX ?? 0)) * 0.9 * sign, 18), armSwing(-(rx - (o.footX ?? 0)) * 0.9 * sign, 18))));
  return scene(pose, (sk) => (o.props ? o.props(sk, phase) : []));
};

const skipping = (phase) => {
  const [lh, lk, rh, rk, air] = track(phase, [[0, [88, 95, -6, 12, 2]], [0.5, [30, 60, 30, 60, 9]], [1, [-6, 12, 88, 95, 2]]]);
  const pose = { pelvis: { at: [0, STAND_HIP_Y, 0], pitch: -2 }, legL: swing(lh, lk), legR: swing(rh, rk), footL: { plantar: 35 }, footR: { plantar: 35 }, ...arms(armSwing(-lh * 0.6 + 10, 90), armSwing(-rh * 0.6 + 10, 90)) };
  return scene(ground(pose, air));
};

// Escaladora (escalera mecánica): escalones de 20 cm que suben hacia +x.
const stairMill = (phase) => {
  const STEP_H = 20;
  const STEP_D = 26;
  const stepTop = (i) => FLOOR_Y - 14 - i * STEP_H;
  const [lStep, lLift, rStep, rLift] = track(phase, [[0, [2, 0, 1, 0]], [0.5, [2, 0, 2, 22]], [1, [2, 0, 3, 0]]]);
  const footAt = (stepIdx, lift) => [stepIdx * STEP_D - 30 + 8, stepTop(stepIdx) - BODY.ankleH - lift];
  const L = footAt(lStep, lLift);
  const R = footAt(rStep, rLift);
  const high = L[1] < R[1] ? L : R;
  const P = [high[0] - 10, high[1] - 64 + mix(0, 6, Math.abs(lStep - rStep) > 0 ? 0 : 1), 0];
  const pose = withBody({
    pelvis: { at: P, pitch: 12 }, neck: { flex: -6 },
    legL: { to: [L[0], L[1], 9], pole: [1, -0.2, 0.1] }, footL: { flat: true },
    legR: { to: [R[0], R[1], -9], pole: [1, -0.2, -0.1] }, footR: rLift > 0 ? { plantar: 10 } : { flat: true },
  }, (sk) => arms(grab(add(shoulderOf(sk, 'L'), [16, 44, 12]), [-1, 0.3, 0.4], 90), grab(add(shoulderOf(sk, 'R'), [16, 44, -12]), [-1, 0.3, -0.4], 90)));
  return scene(pose, (sk) => [
    Array.from({ length: 5 }, (_, i) => E.aabb([i * STEP_D - 30 - 5, stepTop(i), -20], [i * STEP_D - 30 + STEP_D - 5, FLOOR_Y, 20], { fill: E.FRAME, bias: -20, opacity: 0.55 })),
    [-1, 1].map((s) => E.polyline([[-40, FLOOR_Y, s * 26], [-30, fist(sk, 'L')[1], s * 26], [fist(sk, 'L')[0] + 30, fist(sk, 'L')[1] - 10, s * 26]], { color: E.FRAME, width: 2.2, bias: -14 })),
  ]);
};

// Stepper: dos pedales que suben y bajan alternados; manos en la baranda fija.
const stepper = (phase) => {
  const [lY, rY] = track(phase, [[0, [34, 12]], [0.5, [23, 23]], [1, [12, 34]]]);
  const L = [10, FLOOR_Y - lY - BODY.ankleH];
  const R = [10, FLOOR_Y - rY - BODY.ankleH];
  const low = Math.max(L[1], R[1]);
  const pose = withBody({
    pelvis: { at: [0, low - 66, 0], pitch: 10 }, neck: { flex: -4 },
    legL: { to: [L[0], L[1], 10], pole: [1, -0.1, 0.1] }, footL: { flat: true },
    legR: { to: [R[0], R[1], -10], pole: [1, -0.1, -0.1] }, footR: { flat: true },
  }, (sk) => arms(grab(chestPoint(sk, 26, 28, 18), [-1, 0.4, 0.5], 90), grab(chestPoint(sk, 26, 28, -18), [-1, 0.4, -0.5], 90)));
  return scene(pose, (sk) => [
    [['L', L], ['R', R]].map(([side, f]) => E.pad([f[0] - 12, f[1] + BODY.ankleH, sideSign(side) * 10], [f[0] + 14, f[1] + BODY.ankleH, sideSign(side) * 10], 6, 3, [0, 1, 0], { fill: E.FRAME })),
    [['L', L], ['R', R]].map(([side, f]) => E.line([f[0] - 30, FLOOR_Y - 8, sideSign(side) * 10], [f[0] - 12, f[1] + BODY.ankleH + 2, sideSign(side) * 10], { color: E.FRAME, width: 2 })),
    E.aabb([-40, FLOOR_Y - 10, -20], [30, FLOOR_Y, 20], { fill: E.FRAME, bias: -20, opacity: 0.6 }),
    E.polyline([[30, FLOOR_Y, 0], [36, fistMid(sk)[1], 0]], { color: E.FRAME, width: 3, bias: -14 }),
    E.rod([fistMid(sk)[0], fistMid(sk)[1], 22], [fistMid(sk)[0], fistMid(sk)[1], -22], 1.2, { fill: E.FRAME }),
  ]);
};

/*
 * ───────── Bicicletas y máquinas de cardio sentadas ─────────
 */
const bike = (o) => (phase) => {
  const C = o.crank;
  const theta = deg((o.crankStart ?? -30) + phase * 180);
  const r = 17;
  const pedal = (side) => add(C, [Math.cos(theta + (side === 'L' ? 0 : Math.PI)) * r, Math.sin(theta + (side === 'L' ? 0 : Math.PI)) * r, sideSign(side) * 11]);
  const P = o.seat;
  const base = {
    pelvis: { at: P, pitch: o.lean },
    neck: { flex: -(o.lean ?? 0) * 0.6 },
    legL: { to: add(pedal('L'), [-3, -6, 0]), pole: o.kneePole ?? [1, -0.4, 0.15] }, footL: { plantar: 12 },
    legR: { to: add(pedal('R'), [-3, -6, 0]), pole: o.kneePole ?? [1, -0.4, -0.15] }, footR: { plantar: 12 },
  };
  const pose = withBody(base, (sk) => o.hands(sk, phase));
  return scene(pose, (sk) => [
    wheel(C, r, [0, 0, 1], { color: E.DARK, width: 1.6, bias: -4 }),
    ['L', 'R'].map((side) => E.line(C, pedal(side), { color: E.DARK, width: 2 })),
    o.props(sk, phase),
  ]);
};

const roadBike = bike({
  crank: [10, FLOOR_Y - 34, 0], seat: [-8, FLOOR_Y - 96, 0], lean: 52,
  hands: () => arms(grab([58, FLOOR_Y - 98, 14], [-1, 0.6, 0.6], 90), grab([58, FLOOR_Y - 98, -14], [-1, 0.6, -0.6], 90)),
  props: () => [
    wheel([-38, FLOOR_Y - 34, 0], 34), wheel([66, FLOOR_Y - 34, 0], 34),
    E.polyline([[-38, FLOOR_Y - 34, 0], [10, FLOOR_Y - 34, 0], [-6, FLOOR_Y - 88, 0], [-38, FLOOR_Y - 34, 0]], { color: E.FRAME, width: 2.6, bias: -10 }),
    E.polyline([[10, FLOOR_Y - 34, 0], [52, FLOOR_Y - 92, 0], [-6, FLOOR_Y - 88, 0]], { color: E.FRAME, width: 2.6, bias: -10 }),
    E.line([52, FLOOR_Y - 92, 0], [66, FLOOR_Y - 34, 0], { color: E.FRAME, width: 2.6, bias: -10 }),
    E.rod([58, FLOOR_Y - 98, -16], [58, FLOOR_Y - 98, 16], 1.2, { fill: E.FRAME }),
    E.pad([-16, FLOOR_Y - 90, 0], [2, FLOOR_Y - 90, 0], 5, 3),
  ],
});

const stationaryBike = bike({
  crank: [8, FLOOR_Y - 30, 0], seat: [-10, FLOOR_Y - 92, 0], lean: 22,
  hands: () => arms(grab([40, FLOOR_Y - 118, 18], [-1, 0.8, 0.6], 90), grab([40, FLOOR_Y - 118, -18], [-1, 0.8, -0.6], 90)),
  props: () => [
    E.disc([44, FLOOR_Y - 40, 0], [0, 0, 1], 18, 6, { fill: E.FRAME, bias: -10, opacity: 0.7 }),
    E.polyline([[-30, FLOOR_Y, 0], [-14, FLOOR_Y - 84, 0]], { color: E.FRAME, width: 3, bias: -12 }),
    E.polyline([[8, FLOOR_Y - 30, 0], [-12, FLOOR_Y - 78, 0]], { color: E.FRAME, width: 3, bias: -12 }),
    E.polyline([[60, FLOOR_Y, 0], [36, FLOOR_Y - 112, 0]], { color: E.FRAME, width: 3, bias: -12 }),
    E.line([-40, FLOOR_Y, 0], [70, FLOOR_Y, 0], { color: E.FRAME, width: 3, bias: -12 }),
    E.rod([40, FLOOR_Y - 118, -20], [40, FLOOR_Y - 118, 20], 1.2, { fill: E.FRAME }),
    E.pad([-20, FLOOR_Y - 86, 0], [-2, FLOOR_Y - 86, 0], 7, 4),
  ],
});

const assaultBike = (phase) => {
  const handleAngle = (side) => deg((side === 'L' ? 1 : -1) * mix(-16, 16, phase));
  const pivot = [40, FLOOR_Y - 40, 0];
  const handleTop = (side) => add(pivot, [Math.sin(handleAngle(side)) * 70 - 14, -Math.cos(handleAngle(side)) * 70, sideSign(side) * 22]);
  return bike({
    crank: [8, FLOOR_Y - 30, 0], seat: [-12, FLOOR_Y - 88, 0], lean: 18,
    hands: () => arms(grab(handleTop('L'), [-1, 0.5, 0.6], 90), grab(handleTop('R'), [-1, 0.5, -0.6], 90)),
    props: () => [
      wheel([48, FLOOR_Y - 46, 0], 34, [0, 0, 1], { width: 3 }),
      E.disc([48, FLOOR_Y - 46, 0], [0, 0, 1], 30, 12, { fill: E.FRAME, opacity: 0.25, bias: -16 }),
      ['L', 'R'].map((side) => E.line(add(pivot, [0, 0, sideSign(side) * 22]), handleTop(side), { color: E.FRAME, width: 2.6, bias: -6 })),
      E.polyline([[-30, FLOOR_Y, 0], [-16, FLOOR_Y - 80, 0]], { color: E.FRAME, width: 3, bias: -12 }),
      E.line([-40, FLOOR_Y, 0], [80, FLOOR_Y, 0], { color: E.FRAME, width: 3, bias: -12 }),
      E.pad([-22, FLOOR_Y - 82, 0], [-4, FLOOR_Y - 82, 0], 8, 4),
    ],
  })(phase);
};

const recumbentBike = bike({
  crank: [46, FLOOR_Y - 46, 0], seat: [-18, FLOOR_Y - 50, 0], lean: -22, crankStart: 150, kneePole: [0.3, -1, 0.2],
  hands: (sk) => arms(grab(add(sk.pelvis.o, [6, 2, 22]), [-1, -0.3, 0.4], 90), grab(add(sk.pelvis.o, [6, 2, -22]), [-1, -0.3, -0.4], 90)),
  props: (sk) => [
    E.slantPad(add(sk.pelvis.o, [-6, -2, 0]), chestPoint(sk, 56, -9), sk.chest.basis.fwd, { halfW: 14 }),
    E.pad(add(sk.pelvis.o, [-10, 9, 0]), add(sk.pelvis.o, [14, 9, 0]), 14, 5),
    E.polyline([[-40, FLOOR_Y, 0], [-14, FLOOR_Y - 38, 0], [46, FLOOR_Y - 46, 0], [70, FLOOR_Y, 0]], { color: E.FRAME, width: 3, bias: -12 }),
    ['L', 'R'].map((side) => E.rod(add(sk.pelvis.o, [0, 2, sideSign(side) * 22]), add(sk.pelvis.o, [12, 2, sideSign(side) * 22]), 1.2, { fill: E.FRAME })),
  ],
});

// Elíptico: de pie sobre pedales que recorren una elipse; manijas móviles en oposición.
const elliptical = (phase) => {
  const theta = deg(phase * 180);
  const foot = (side) => {
    const t = theta + (side === 'L' ? 0 : Math.PI);
    return [Math.cos(t) * 18, FLOOR_Y - 22 + Math.sin(t) * 5 - BODY.ankleH, sideSign(side) * 10];
  };
  const low = Math.max(foot('L')[1], foot('R')[1]);
  const pose = withBody({
    pelvis: { at: [-2, low - 66, 0], pitch: 6 }, neck: { flex: -3 },
    legL: { to: foot('L'), pole: [1, -0.1, 0.1] }, footL: { flat: true },
    legR: { to: foot('R'), pole: [1, -0.1, -0.1] }, footR: { flat: true },
  }, (sk) => {
    const hand = (side) => add(shoulderOf(sk, side), [30 - Math.cos(theta + (side === 'L' ? 0 : Math.PI)) * 12, 22, sideSign(side) * 6]);
    return arms(grab(hand('L'), [-1, 0.4, 0.6], 90), grab(hand('R'), [-1, 0.4, -0.6], 90));
  });
  return scene(pose, (sk) => [
    ['L', 'R'].map((side) => {
      const f = foot(side);
      return [E.pad([f[0] - 14, f[1] + BODY.ankleH, f[2]], [f[0] + 14, f[1] + BODY.ankleH, f[2]], 6, 3, [0, 1, 0], { fill: E.FRAME }), E.line([f[0] - 12, f[1] + 6, f[2]], [-52, FLOOR_Y - 18, f[2]], { color: E.FRAME, width: 2.2 }), E.line(fist(sk, side), [52, FLOOR_Y - 40, f[2]], { color: E.FRAME, width: 2.4 })];
    }),
    E.disc([-52, FLOOR_Y - 18, 0], [0, 0, 1], 16, 8, { fill: E.FRAME, opacity: 0.5, bias: -14 }),
    E.line([-60, FLOOR_Y - 1, 0], [64, FLOOR_Y - 1, 0], { color: E.FRAME, width: 3, bias: -14 }),
    E.line([56, FLOOR_Y, 0], [52, FLOOR_Y - 120, 0], { color: E.FRAME, width: 3, bias: -14 }),
  ]);
};

// Remo ergómetro: ataque (piernas flexionadas) → empuje de piernas → final con el mango en las costillas.
const rowErg = (phase) => {
  const seatX = track(phase, [[0, -6], [0.5, -30], [1, -40]]);
  const pitch = track(phase, [[0, 20], [0.5, 10], [1, -22]]);
  const P = [seatX, FLOOR_Y - 30, 0];
  const pose = withBody({
    pelvis: { at: P, pitch }, neck: { flex: -pitch * 0.4 },
    legL: { to: [54, FLOOR_Y - 26, 9], pole: [0.3, -1, 0.15] }, footL: { plantar: -12 },
    legR: { to: [54, FLOOR_Y - 26, -9], pole: [0.3, -1, -0.15] }, footR: { plantar: -12 },
  }, (sk) => {
    const h = phase < 0.75 ? add(midShoulder(sk), [mix(48, 46, phase * 1.3), 26, 0]) : chestPoint(sk, 34, 14);
    const pole = phase < 0.75 ? [0, 1, 0] : [-1, 0, 0];
    return arms(grab(add(h, [0, 0, 9]), [pole[0], pole[1], 0.5], 180), grab(add(h, [0, 0, -9]), [pole[0], pole[1], -0.5], 180));
  });
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    return [
      E.line([-80, FLOOR_Y - 18, 0], [70, FLOOR_Y - 18, 0], { color: E.FRAME, width: 3, bias: -12 }),
      E.post([-78, FLOOR_Y - 18, 0]),
      E.pad(add(P, [-10, 8, 0]), add(P, [10, 8, 0]), 12, 4),
      E.slantPad([48, FLOOR_Y - 18, 0], [60, FLOOR_Y - 40, 0], [-0.86, -0.5, 0], { halfW: 14 }),
      E.aabb([70, FLOOR_Y - 46, -16], [96, FLOOR_Y, 16], { fill: E.FRAME, bias: -16, opacity: 0.6 }),
      E.line(h, [72, FLOOR_Y - 36, 0], { color: E.DARK, width: 1.4 }),
      E.rod(add(h, [0, 0, -12]), add(h, [0, 0, 12]), 1.3, { fill: E.FRAME }),
    ];
  });
};

// Ski erg: tirones desde arriba de la cabeza hasta los muslos con bisagra de cadera.
const skiErg = (phase) => {
  const hinge = track(phase, [[0, 2], [0.5, 30], [1, 56]]);
  const drop = track(phase, [[0, 0], [0.5, 8], [1, 12]]);
  const pose = withBody(standAir({ hinge, drop, x: -mix(0, 12, phase), stance: 12 }), (sk) => {
    const top = add(midShoulder(sk), [14, -46, 0]);
    const low = chestPoint(sk, -4, 26);
    const h = track(phase, [[0, top], [0.5, add(lerp(top, low, 0.55), [10, 0, 0])], [1, add(low, [-4, 6, 0])]]);
    return arms(grab(add(h, [0, 0, 12]), [-0.8, 0.3, 0.6], 90), grab(add(h, [0, 0, -12]), [-0.8, 0.3, -0.6], 90));
  });
  return scene(pose, (sk) => [
    E.aabb([44, FLOOR_Y - 220, -10], [56, FLOOR_Y, 10], { fill: E.FRAME, bias: -40, opacity: 0.5 }),
    ['L', 'R'].map((side) => [E.cable([44, FLOOR_Y - 214, sideSign(side) * 8], fist(sk, side)), E.handle('D', fist(sk, side), [0, 1, 0])]),
  ]);
};

// Natación (crol): cuerpo horizontal en el agua, un brazo adelante y el otro terminando la brazada.
const swim = (phase) => {
  const WATER = FLOOR_Y - 50;
  const roll = track(phase, [[0, 30], [0.5, 0], [1, -30]]);
  const kick = track(phase, [[0, 8], [0.5, -8], [1, 8]]);
  const armL = track(phase, [[0, [170, 0, 0]], [0.5, [95, 0, 70]], [1, [12, 0, 10]]]);
  const armR = track(phase, [[0, [12, 0, 10]], [0.5, [120, 70, 100]], [1, [170, 0, 0]]]);
  const pose = {
    pelvis: { at: [0, WATER, 0], pitch: 88, roll }, neck: { flex: -10, turn: roll * 0.8 },
    legL: swing(kick, 12), legR: swing(-kick, 12), footL: { plantar: 45 }, footR: { plantar: 45 },
    armL: { e: armL[0], p: armL[1], b: armL[2] }, handL: { pr: 180, grip: 'flat' },
    armR: { e: armR[0], p: armR[1], b: armR[2] }, handR: { pr: 180, grip: 'flat' },
  };
  return scene(pose, () => [
    E.line([-110, WATER - 6, 0], [110, WATER - 6, 0], { color: E.FRAME, width: 1.6, bias: 40, opacity: 0.8 }),
    E.aabb([-110, WATER - 6, -40], [110, FLOOR_Y, 40], { fill: E.FRAME, bias: -60, opacity: 0.15 }),
  ]);
};

/*
 * ───────── Soga ─────────
 */
const ropeArc = (hL, hR, angle, floorY) => {
  const c = lerp(hL, hR, 0.5);
  const R = floorY - c[1] + 1;
  const dir = [Math.sin(deg(angle)), Math.cos(deg(angle)), 0];
  const pts = Array.from({ length: 15 }, (_, i) => {
    const t = i / 14;
    const bulge = Math.sin(Math.PI * t) ** 0.6;
    return madd(lerp(hL, hR, t), [dir, R * bulge]);
  });
  return E.polyline(pts, { color: E.DARK, width: 1.4, bias: angle > 90 && angle < 270 ? -20 : 20 });
};
const jumpRope = (o = {}) => (phase) => {
  const air = track(phase, o.double ? [[0, 0], [0.5, 18], [1, 10]] : [[0, 0], [0.5, 7], [1, 3]]);
  const knee = o.double ? track(phase, [[0, 12], [0.5, 30], [1, 18]]) : 6;
  const base = standAir({ stance: 8, drop: knee * 0.25, air: air > 0 ? air : 0, kneeOut: 0.1 });
  if (air === 0) { base.footL = { plantar: 25 }; base.footR = { plantar: 25 }; }
  const pose = withBody(base, (sk) => arms(grab(add(shoulderOf(sk, 'L'), [8, 48, 16]), [-1, 0.2, 0.4], 90), grab(add(shoulderOf(sk, 'R'), [8, 48, -16]), [-1, 0.2, -0.4], 90)));
  const angles = o.double ? [[0, [10, 190]], [0.5, [120, 300]], [1, [250, 70]]] : [[0, [0]], [0.5, [180]], [1, [300]]];
  return scene(ground(pose, air), (sk) => track(phase, angles).map((a) => ropeArc(fist(sk, 'L'), fist(sk, 'R'), a, FLOOR_Y)));
};

/*
 * ───────── Saltos y pliometría ─────────
 */
const jumpSquat = (phase) => {
  const [drop, hinge, air, armE] = track(phase, [[0, [40, 42, 0, -40]], [0.5, [-4, 0, 22, 160]], [1, [16, 22, 0, 40]]]);
  const base = standAir({ x: -drop * 0.35, drop: Math.max(0, drop), hinge, air, stance: 13 });
  const pose = { ...base, ...arms(armSwing(armE, 10, { grip: 'open' })) };
  return scene(pose);
};
const boxJump = (phase) => {
  const BOX = 50;
  const [x, drop, hinge, air, armE] = track(phase, [[0, [-36, 26, 40, 0, -45]], [0.5, [-8, 24, 30, 46, 80]], [1, [30, 30, 34, BOX, 70]]]);
  const base = standAir({ x: x - drop * 0.3, footX: x, drop, hinge, air, stance: 13 });
  if (phase === 1 || air === BOX) { base.footL = { flat: true }; base.footR = { flat: true }; }
  return scene({ ...base, ...arms(armSwing(armE, 15, { grip: 'open' })) }, () => E.plyoBox(14, 56, BOX));
};
const broadJump = (phase) => {
  const [x, drop, hinge, air, armE, lh] = track(phase, [[0, [-50, 22, 50, 0, -55, 0]], [0.5, [0, -4, 18, 30, 150, 40]], [1, [52, 34, 40, 0, 80, 0]]]);
  const base = standAir({ x: x - drop * 0.3, footX: x + lh * 0.4, drop: Math.max(0, drop), hinge, air, stance: 12 });
  return scene({ ...base, ...arms(armSwing(armE, 10, { grip: 'open' })) }, () => [E.floorMark(-70, -60), E.floorMark(60, 70)]);
};
const jumpLunge = (phase) => {
  const t = track(phase, [[0, 1], [0.5, 0], [1, -1]]);
  const air = track(phase, [[0, 0], [0.5, 16], [1, 0]]);
  const front = t >= 0 ? 'L' : 'R';
  const amt = Math.abs(t);
  const P = [0, STAND_HIP_Y + mix(-air - 2, 30, amt), 0];
  const footY = ANKLE_Y - air;
  const pose = {
    pelvis: { at: P, pitch: 4 },
    [`leg${front}`]: { to: [mix(4, 30, amt), footY, sideSign(front) * 9], pole: [1, -0.2, 0.1 * sideSign(front)] },
    [`leg${front === 'L' ? 'R' : 'L'}`]: { to: [mix(-4, -36, amt), mix(footY - 10, FLOOR_Y - 8, amt), -sideSign(front) * 9], pole: [1, 0.3, -0.1 * sideSign(front)] },
    [`foot${front}`]: amt > 0.5 ? { flat: true } : { plantar: 20 },
    [`foot${front === 'L' ? 'R' : 'L'}`]: { plantar: 40 },
    ...arms(armSwing(front === 'L' ? -30 * amt : 40 * amt, 80), armSwing(front === 'L' ? 40 * amt : -30 * amt, 80)),
  };
  return scene(pose);
};
const jumpingJack = (phase) => {
  const [spread, armP, air] = track(phase, [[0, [8, 6, 0]], [0.5, [18, 90, 8]], [1, [26, 170, 0]]]);
  const base = standAir({ stance: spread, air, toeOut: 16, kneeOut: 0.2 });
  const pose = { ...base, armL: { e: armP, p: 90, b: 6 }, handL: { pr: 90, grip: 'open' }, armR: { e: armP, p: 90, b: 6 }, handR: { pr: 90, grip: 'open' } };
  return scene(pose);
};
const skater = (phase) => {
  const t = track(phase, [[0, 1], [0.5, 0], [1, -1]]);
  const air = track(phase, [[0, 0], [0.5, 12], [1, 0]]);
  const side = t >= 0 ? 'L' : 'R';
  const s = sideSign(side);
  const amt = Math.abs(t);
  const z = mix(0, 30, amt) * s;
  const pose = {
    pelvis: { at: [mix(0, -8, amt), STAND_HIP_Y + mix(-air, 26, amt), z], pitch: mix(10, 40, amt) },
    [`leg${side}`]: { to: [2, ANKLE_Y - air, z + s * 6], pole: [1, -0.1, 0.1 * s] }, [`foot${side}`]: amt > 0.5 ? { flat: true, out: 6 } : { plantar: 20 },
    [`leg${side === 'L' ? 'R' : 'L'}`]: { to: [-26, mix(ANKLE_Y - air - 10, FLOOR_Y - 14, amt), z + s * 18 * amt - s * 6], pole: [1, 0.2, -0.3 * s] }, [`foot${side === 'L' ? 'R' : 'L'}`]: { plantar: 35 },
    neck: { flex: -10 },
    ...arms(armSwing(side === 'L' ? -40 * amt : 50 * amt, 30), armSwing(side === 'L' ? 50 * amt : -40 * amt, 30)),
  };
  return scene(pose);
};
const pistol = (phase) => {
  const drop = mix(0, 52, phase);
  const pose = withBody({
    pelvis: { at: [-mix(0, 18, phase), STAND_HIP_Y + 0.6 + drop, 0], pitch: mix(4, 30, phase) }, neck: { flex: -10 },
    legL: { to: [4, ANKLE_Y, 7], pole: [1, -0.2, 0.15] }, footL: { flat: true },
    legR: { e: mix(30, 118, phase), p: 0, b: mix(10, 4, phase) }, footR: { plantar: 0 },
  }, () => arms(armAngles(mix(70, 95, phase), 10, 0, 0, { grip: 'open' })));
  return scene(pose);
};

/*
 * ───────── Peso corporal en el piso ─────────
 */
const burpee = (phase) => {
  if (phase < 0.25) {
    const pose = withBody(standAir({ x: -14, drop: 40, hinge: 44, stance: 12, kneeOut: 0.1 }), (sk) => highPlankArms(midShoulder(sk)[0] + 10, 16));
    return scene(pose);
  }
  if (phase < 0.75) {
    const { pose, hx } = highPlank();
    return scene(withBody(pose, () => highPlankArms(hx)));
  }
  return scene({ ...standAir({ air: 18, stance: 12 }), ...arms(armAngles(165, 10, 4, 0, { grip: 'open' })) });
};
const barFacingBurpee = (phase) => {
  const BAR_Z = 28;
  if (phase < 0.25) {
    const body = plankBody({ shoulderH: 16, toeX: -60 });
    return scene(withBody(body.pose, () => highPlankArms(body.shoulderX + 2, 22)), () => E.barbell([0, FLOOR_Y - 19, BAR_Z], { axis: [1, 0, 0], half: 62, plateR: 19 }));
  }
  const z = phase < 0.75 ? 0 : BAR_Z + 18;
  const air = phase < 0.75 ? 0 : 34;
  const base = standAir({ drop: phase < 0.75 ? 18 : 6, hinge: phase < 0.75 ? 20 : 8, air, stance: 9 });
  base.pelvis.at = add(base.pelvis.at, [0, 0, z]);
  base.legL.to = add(base.legL.to, [0, 0, z]);
  base.legR.to = add(base.legR.to, [0, 0, z]);
  if (air) { base.legL = { e: 70, p: 0, b: 100 }; base.legR = { e: 70, p: 0, b: 100 }; }
  return scene({ ...base, ...arms(armSwing(phase < 0.75 ? -30 : 60, 20, { grip: 'open' })) }, () => E.barbell([0, FLOOR_Y - 19, BAR_Z], { axis: [1, 0, 0], half: 62, plateR: 19 }));
};
const mountainClimber = (phase) => {
  const t = track(phase, [[0, 1], [0.5, 0], [1, -1]]);
  const { pose, hx } = highPlank();
  // La rodilla que avanza se lleva por IK hacia el pecho con el pie apenas sobre el piso.
  const drive = (side, amt) => ({ to: [mix(-50, hx - 50, amt), FLOOR_Y - mix(12, 16, amt), sideSign(side) * 9], pole: [1, 0.6, sideSign(side) * 0.1] });
  const amtL = t > 0 ? t : t === 0 ? 0.45 : 0;
  const amtR = t < 0 ? -t : t === 0 ? 0.45 : 0;
  if (amtL > 0) { pose.legL = drive('L', amtL); pose.footL = { plantar: 30 }; }
  if (amtR > 0) { pose.legR = drive('R', amtR); pose.footR = { plantar: 30 }; }
  return scene(withBody(pose, () => highPlankArms(hx)));
};
const bearCrawl = (phase) => {
  const t = track(phase, [[0, 1], [0.5, 0], [1, -1]]);
  const P = [0, FLOOR_Y - 58, 0];
  const footX = (side) => -26 + (side === 'R' ? t : -t) * 10;
  const handX = (side) => 42 + (side === 'L' ? t : -t) * 10;
  const lifted = (side) => (side === 'L' ? t > 0.5 : t < -0.5);
  const pose = withBody({
    pelvis: { at: P, pitch: 82 }, neck: { flex: -25 },
    legL: { to: [footX('L'), ANKLE_Y - 4 - (t < -0.5 ? 6 : 0), 11], pole: [1, 0.2, 0.1] }, footL: { plantar: 55 },
    legR: { to: [footX('R'), ANKLE_Y - 4 - (t > 0.5 ? 6 : 0), -11], pole: [1, 0.2, -0.1] }, footR: { plantar: 55 },
  }, () => arms(palmDown([handX('L'), FLOOR_Y - 2.6 - (lifted('L') ? 8 : 0), 16], [-1, 0, 0.3], 100), palmDown([handX('R'), FLOOR_Y - 2.6 - (lifted('R') ? 8 : 0), -16], [-1, 0, -0.3], 100)));
  return scene(pose);
};
const shoulderTap = (phase) => {
  const { pose, hx } = highPlank({ legs: { legL: { e: 0, p: 12, b: 0 }, legR: { e: 0, p: 12, b: 0 }, footL: { plantar: -20 }, footR: { plantar: -20 } } });
  const tapping = phase === 0.5 ? 'L' : phase === 1 ? 'R' : null;
  return scene(withBody(pose, (sk) => {
    const base = highPlankArms(hx);
    if (!tapping) return base;
    const other = tapping === 'L' ? 'R' : 'L';
    const tap = { arm: { to: add(shoulderOf(sk, other), [2, 4, sideSign(tapping) * 2]), pole: [0, 1, sideSign(tapping)] }, hand: { pr: 180, grip: 'flat' } };
    return { ...base, [`arm${tapping}`]: tap.arm, [`hand${tapping}`]: tap.hand };
  }));
};
const inchworm = (phase) => {
  if (phase >= 0.75) {
    const { pose, hx } = highPlank({ toeX: -54 });
    return scene(withBody(pose, () => highPlankArms(hx + 4)));
  }
  const handX = phase < 0.25 ? 18 : 52;
  const pitch = phase < 0.25 ? 120 : 112;
  const S = [handX - 4, FLOOR_Y - 50, 0];
  const P = add(S, [-Math.sin(deg(pitch)) * 44, Math.cos(deg(pitch)) * 44, 0]);
  const pose = { pelvis: { at: P, pitch }, neck: { flex: 20 }, legL: { to: [0, ANKLE_Y, 8], pole: [1, 0, 0.1] }, legR: { to: [0, ANKLE_Y, -8], pole: [1, 0, -0.1] }, footL: { flat: true }, footR: { flat: true }, ...arms(palmDown([handX, FLOOR_Y - 2.6, 15], [-1, 0, 0.3], 100), palmDown([handX, FLOOR_Y - 2.6, -15], [-1, 0, -0.3], 100)) };
  return scene(pose);
};

/*
 * ───────── Invertidos ─────────
 */
const invertedBody = (S, pitch, o = {}) => {
  const P = add(S, [-Math.sin(deg(pitch)) * 44, Math.cos(deg(pitch)) * 44, 0]);
  return { pelvis: { at: P, pitch }, neck: { flex: -25 }, legL: o.legL ?? { e: 0, p: 0, b: 0 }, legR: o.legR ?? { e: 0, p: 0, b: 0 }, footL: { plantar: 35 }, footR: { plantar: 35 } };
};
const wallWalk = (phase) => {
  const WALL = -42;
  const wallProps = () => [E.aabb([WALL - 8, FLOOR_Y - 200, -40], [WALL, FLOOR_Y, 40], { fill: E.FRAME, bias: -40, opacity: 0.35 })];
  if (phase < 0.25) {
    const body = plankBody({ shoulderH: 50, toeX: WALL + 3 });
    return scene(withBody(body.pose, () => highPlankArms(body.shoulderX + 2)), wallProps);
  }
  const hx = phase < 0.75 ? 46 : WALL + 13;
  const S = [hx - 2, FLOOR_Y - 50.5, 0];
  const sinP = Math.min(0.99, (S[0] - WALL - 6) / (44 + LEG_REACH + 6));
  const pitch = 180 - (Math.asin(sinP) * 180) / Math.PI;
  const pose = { ...invertedBody(S, pitch), ...arms(palmDown([hx, FLOOR_Y - 2.6, 18], [-1, 0, 0.4], 100), palmDown([hx, FLOOR_Y - 2.6, -18], [-1, 0, -0.4], 100)) };
  pose.footL = { plantar: 50 };
  pose.footR = { plantar: 50 };
  return scene(pose, wallProps);
};
const handstandWalk = (phase) => {
  const t = track(phase, [[0, 1], [0.5, 0], [1, -1]]);
  const S = [0, FLOOR_Y - 50.5 - (Math.abs(t) > 0.5 ? 3 : 0), 0];
  const hand = (side) => {
    const forward = side === 'L' ? t > 0.5 : t < -0.5;
    return palmDown([forward ? 14 : -2, FLOOR_Y - 2.6 - (forward ? 7 : 0), sideSign(side) * 17], [-1, 0, sideSign(side) * 0.4], 100);
  };
  const pose = { ...invertedBody(S, 172, { legL: { e: 18, p: 0, b: 30 }, legR: { e: 0, p: 180, b: 0 } }), ...arms(hand('L'), hand('R')) };
  pose.pelvis.roll = t * 6;
  return scene(pose);
};
const hspu = (phase) => {
  const hx = 2;
  const S = [hx - mix(2, 8, phase), FLOOR_Y - mix(50.5, 24, phase), 0];
  const pitch = 176;
  const pose = { ...invertedBody(S, pitch), ...arms(palmDown([hx, FLOOR_Y - 2.6, 22], [1, 0, 0.7], 100), palmDown([hx, FLOOR_Y - 2.6, -22], [1, 0, -0.7], 100)) };
  const sk = createSkeleton(pose);
  const wallX = Math.min(sk.legs.L.foot.heel[0], sk.pelvis.o[0] - 8) - 2;
  return scene(pose, () => [E.aabb([wallX - 8, FLOOR_Y - 230, -40], [wallX, FLOOR_Y, 40], { fill: E.FRAME, bias: -40, opacity: 0.35 }), E.pad([hx - 16, FLOOR_Y - 1, 0], [hx - 2, FLOOR_Y - 1, 0], 10, 2)]);
};

/*
 * ───────── Kettlebell, mancuerna y balón ─────────
 */
const hikeArms = (sk) => {
  const c = add(lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5), [-12, 6, 0]);
  return arms(grab(add(c, [0, 0, 3]), [-1, 0.3, 0.4], 180), grab(add(c, [0, 0, -3]), [-1, 0.3, -0.4], 180));
};
const kbSwing = (phase) => {
  const [hinge, drop, x] = track(phase, [[0, [62, 16, -16]], [0.5, [30, 8, -8]], [1, [-2, 0, 0]]]);
  const pose = withBody(standAir({ x, hinge, drop, stance: 15, toeOut: 16 }), (sk) => {
    if (phase === 0) return hikeArms(sk);
    const c = phase === 1 ? add(midShoulder(sk), [50, 2, 0]) : add(midShoulder(sk), [26, 40, 0]);
    return arms(grab(add(c, [0, 0, 3]), [-0.3, 1, 0.6], 180), grab(add(c, [0, 0, -3]), [-0.3, 1, -0.6], 180));
  });
  return scene(pose, (sk) => E.kettlebell(fistMid(sk), { up: phase === 1 ? [-1, 0, 0] : scale(norm(sub(midShoulder(sk), fistMid(sk))), 1), across: [0, 0, 1] }));
};
const kbSnatch = (phase) => {
  const [hinge, drop, x] = track(phase, [[0, [60, 16, -16]], [0.5, [6, 4, -2]], [1, [0, 0, 0]]]);
  const pose = withBody(standAir({ x, hinge, drop, stance: 15, toeOut: 16 }), (sk) => {
    const left = phase === 0
      ? grab(add(lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5), [-12, 6, 2]), [-1, 0.3, 0.4], 180)
      : phase === 1 ? { arm: { e: 172, p: 15, b: 0 }, hand: { pr: 90, grip: 'fist' } } : { arm: { e: 85, p: 70, b: 120 }, hand: { pr: 160, grip: 'fist' } };
    return arms(left, phase === 0 ? armSwing(-20, 15, { grip: 'open' }) : armSwing(10, 15, { grip: 'open' }));
  });
  return scene(pose, (sk) => E.kettlebell(fist(sk, 'L'), phase === 1 ? { up: [0, 1, 0], across: [1, 0, 0], r: 7.5 } : { up: phase === 0 ? [1, -0.4, 0] : [0, -1, 0], across: [0, 0, 1] }));
};
const dbSnatch = (phase) => {
  const [hinge, drop, x] = track(phase, [[0, [44, 40, -16]], [0.5, [6, 4, -2]], [1, [0, 0, 0]]]);
  const pose = withBody(standAir({ x, hinge, drop, stance: 14, toeOut: 14, air: 0 }), (sk) => {
    const left = phase === 0
      ? grab([8, FLOOR_Y - 13, 0], [-0.4, -0.3, 0.6], 180)
      : phase === 1 ? { arm: { e: 172, p: 15, b: 0 }, hand: { pr: 150, grip: 'fist' } } : { arm: { e: 90, p: 80, b: 100 }, hand: { pr: 180, grip: 'fist' } };
    return arms(left, phase === 0 ? palmDown(add(sk.legs.R.mid, [6, -6, -4]), [-1, 0, -0.3], 120) : armSwing(phase === 1 ? 30 : 0, 20, { grip: 'open' }));
  });
  return scene(pose, (sk) => E.dumbbell(fist(sk, 'L'), [0, 0, 1]));
};
const kbHalo = (phase) => {
  const pose = withBody(standAir({ stance: 12 }), (sk) => {
    const head = sk.head.o;
    const c = track(phase, [[0, add(head, [16, 8, 0])], [0.5, add(head, [-2, -6, -16])], [1, add(head, [-16, 4, 0])]]);
    const pole = track(phase, [[0, [0, 1, 0]], [0.5, [0.4, 0, 0]], [1, [1, 0, 0]]]);
    return arms(grab(add(c, [0, 0, 4]), [pole[0], pole[1], 0.8], 90), grab(add(c, [0, 0, -4]), [pole[0], pole[1], -0.8], 90));
  });
  return scene(pose, (sk) => E.kettlebell(fistMid(sk), { up: [0, 1, 0], across: [0, 0, 1], r: 6.5 }));
};
const turkishGetUp = (phase) => {
  if (phase < 0.25) {
    const pose = { pelvis: { at: [0, FLOOR_Y - BODY.backDepth, 0], pitch: -90 }, neck: { flex: 8 }, legL: { to: [26, ANKLE_Y, 10], pole: [0.2, -1, 0.15] }, footL: { flat: true }, legR: { e: 4, p: 20, b: 0 }, footR: { plantar: 10 }, armL: { e: 90, p: 0, b: 0 }, handL: { pr: 90, grip: 'fist' }, armR: { e: 45, p: 90, b: 0 }, handR: { pr: 180, grip: 'flat' } };
    return scene(pose, (sk) => E.kettlebell(fist(sk, 'L'), { up: [0, 1, 0], across: [1, 0, 0] }));
  }
  if (phase < 0.75) {
    const P = [0, FLOOR_Y - 9, 0];
    const pose = withBody({ pelvis: { at: P, pitch: -45 }, neck: { flex: 0, turn: -10 }, legL: { to: [30, ANKLE_Y, 12], pole: [0.2, -1, 0.15] }, footL: { flat: true }, legR: { to: [62, FLOOR_Y - 6, -16], pole: [0, -1, -0.1] }, footR: { plantar: 10 } }, (sk) => ({
      armL: { to: add(shoulderOf(sk, 'L'), [0, -50, 2]), pole: [-1, 0, 0.2] }, handL: { pr: 90, grip: 'fist' },
      armR: { to: add(sk.pelvis.o, [-14, 7.5, -30]), pole: [-1, -0.4, -0.3] }, handR: { pr: 100, grip: 'flat', flex: -70 },
    }));
    return scene(pose, (sk) => E.kettlebell(fist(sk, 'L'), { up: [0, 1, 0], across: [1, 0, 0] }));
  }
  const pose = withBody({ pelvis: { at: [0, STAND_HIP_Y + 30, 0], pitch: 0 }, neck: { flex: 0 }, legL: { to: [26, ANKLE_Y, 9], pole: [1, -0.2, 0.1] }, footL: { flat: true }, legR: { to: [-30, FLOOR_Y - 8, -9], pole: [0.2, 1, -0.1] }, footR: { plantar: 40 } }, (sk) => ({
    armL: { to: add(shoulderOf(sk, 'L'), [0, -50, 2]), pole: [-1, 0, 0.2] }, handL: { pr: 90, grip: 'fist' },
    armR: { e: 30, p: 60, b: 5 }, handR: { pr: 90, grip: 'open' },
  }));
  return scene(pose, (sk) => E.kettlebell(fist(sk, 'L'), { up: [0, 1, 0], across: [1, 0, 0] }));
};
const devilPress = (phase) => {
  if (phase < 0.25) {
    const body = plankBody({ shoulderH: 18, toeX: -60 });
    return scene(withBody(body.pose, () => arms(grab([body.shoulderX + 3, FLOOR_Y - 7, 16], [-1, -0.3, 0.3], 90), grab([body.shoulderX + 3, FLOOR_Y - 7, -16], [-1, -0.3, -0.3], 90))), (sk) => ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), [1, 0, 0])));
  }
  const top = phase >= 0.75;
  const pose = withBody(standAir(top ? { stance: 13 } : { x: -14, hinge: 55, drop: 16, stance: 14 }), (sk) => (top
    ? arms({ arm: { e: 172, p: 15, b: 0 }, hand: { pr: 90, grip: 'fist' } })
    : arms(grab(add(lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5), [-10, 6, 12]), [1, 0, 0.6], 90), grab(add(lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5), [-10, 6, -12]), [1, 0, -0.6], 90))));
  return scene(pose, (sk) => ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), top ? [1, 0, 0] : [0, 1, 0])));
};

const ballAt = (sk) => add(fistMid(sk), [5, 0, 0]);
const ballArms = (c, pole = [0, 1, 0]) => arms(grab(add(c, [0, 0, 8]), [pole[0], pole[1], 0.6], 90, { grip: 'spread' }), grab(add(c, [0, 0, -8]), [pole[0], pole[1], -0.6], 90, { grip: 'spread' }));
const wallBall = (phase) => {
  const [drop, hinge, air] = track(phase, [[0, [44, 30, 0]], [0.5, [0, 2, 0]], [1, [0, 0, 6]]]);
  const pose = withBody(standAir({ x: -drop * 0.35, drop, hinge, air, stance: 15, toeOut: 18 }), (sk) => {
    if (phase === 0) return ballArms(chestPoint(sk, 46, 20));
    return ballArms(add(midShoulder(sk), [10, phase === 1 ? -46 : -30, 0]), [-0.3, -0.2, 0]);
  });
  return scene(pose, (sk) => [
    E.ball(phase === 1 ? [30, FLOOR_Y - 236, 0] : ballAt(sk), 9),
    E.aabb([46, FLOOR_Y - 260, -40], [52, FLOOR_Y, 40], { fill: E.FRAME, bias: -40, opacity: 0.35 }),
    E.line([46, FLOOR_Y - 250, -12], [46, FLOOR_Y - 250, 12], { color: E.GEAR, width: 3 }),
  ]);
};
const slamBall = (phase) => {
  const [hinge, drop, x] = track(phase, [[0, [-6, 0, 0]], [0.5, [30, 6, -6]], [1, [60, 24, -18]]]);
  const air = phase === 0 ? 4 : 0;
  const pose = withBody(standAir({ x, hinge, drop, air, stance: 14 }), (sk) => {
    if (phase === 0) return ballArms(add(midShoulder(sk), [-2, -46, 0]), [-0.3, -0.2, 0]);
    if (phase === 0.5) return ballArms(add(midShoulder(sk), [34, -6, 0]), [-0.3, 0.5, 0]);
    return ballArms([chestPoint(sk, 60, 50)[0], FLOOR_Y - 26, 0], [-0.3, 0.5, 0]);
  });
  return scene(pose, (sk) => E.ball(phase === 1 ? [chestPoint(sk, 60, 50)[0], FLOOR_Y - 10, 0] : ballAt(sk), 10));
};
const rotationalThrow = (phase) => {
  const twist = track(phase, [[0, -45], [0.5, 0], [1, 35]]);
  const pose = withBody({ ...standAir({ stance: 16, drop: 8, hinge: 10, kneeOut: 0.4 }), spine: { twist }, pelvis: { at: [0, STAND_HIP_Y + 8, 0], pitch: 10, yaw: twist * 0.6 } }, (sk) => {
    const c = phase === 1 ? chestPoint(sk, 40, 36, 20) : chestPoint(sk, 16, 20, phase === 0 ? -20 : 0);
    return ballArms(c, [-0.3, 0.6, 0]);
  });
  return scene(pose, (sk) => [E.ball(phase === 1 ? add(chestPoint(sk, 40, 36, 20), [10, -6, 34]) : ballAt(sk), 9), E.aabb([-60, FLOOR_Y - 180, 80], [60, FLOOR_Y, 86], { fill: E.FRAME, bias: -40, opacity: 0.3 })]);
};
const battleRopes = (phase) => {
  const t = track(phase, [[0, 1], [0.5, 0], [1, -1]]);
  const pose = withBody(standAir({ x: -8, drop: 22, hinge: 20, stance: 16, toeOut: 14, kneeOut: 0.4 }), (sk) => {
    const hand = (side) => add(shoulderOf(sk, side), [36, 20 + (side === 'L' ? -t : t) * 14, sideSign(side) * 2]);
    return arms(grab(hand('L'), [-0.6, 1, 0.6], 90), grab(hand('R'), [-0.6, 1, -0.6], 90));
  });
  return scene(pose, (sk) => ['L', 'R'].map((side) => E.battleRope(fist(sk, side), [180, FLOOR_Y - 6, sideSign(side) * 14], phase * Math.PI * (side === 'L' ? 2 : -2), 7)).concat([E.post([182, FLOOR_Y - 10, 0], { r: 3 })]));
};
const trxRow = (phase) => {
  // Pies adelante, cuerpo recto inclinado hacia atrás; el anclaje está arriba y adelante.
  const ankle = [20, ANKLE_Y, 0];
  const lean = mix(48, 26, phase);
  const dir = [-Math.sin(deg(lean)), -Math.cos(deg(lean)), 0];
  const P = madd(ankle, [dir, LEG_REACH + 1]);
  const anchor = [110, FLOOR_Y - 250, 0];
  const pose = withBody({
    pelvis: { at: P, pitch: -lean }, neck: { flex: 10 },
    legL: { to: add(ankle, [0, 0, 10]), pole: [1, 0, 0.1] }, footL: { plantar: -10 },
    legR: { to: add(ankle, [0, 0, -10]), pole: [1, 0, -0.1] }, footR: { plantar: -10 },
  }, (sk) => {
    const m = midShoulder(sk);
    const toward = norm(sub(anchor, m));
    const reach = mix(48, 12, phase);
    return arms(grab(madd(m, [toward, reach], [[0, 0, 1], 18]), [-0.4, 0.3, 1], 90), grab(madd(m, [toward, reach], [[0, 0, 1], -18]), [-0.4, 0.3, -1], 90));
  });
  return scene(pose, (sk) => E.straps(anchor, [fist(sk, 'L'), fist(sk, 'R')]));
};

/*
 * ───────── Halterofilia y barra ─────────
 */
const deadStart = (barY, grip, pose) => Object.assign(pose, arms(grab([3, barY, grip], [-1, -0.1, 0.15], 180), grab([3, barY, -grip], [-1, -0.1, -0.15], 180)));
const ARM_LEN = 51;
const pullFromFloor = ({ grip = 23, stance = 11, toeOut = 10, pitch = 56, barY = FLOOR_Y - 19, x = 3 } = {}) => {
  const S = [x + 3, barY - ARM_LEN, 0];
  const pose = {
    pelvis: { at: pelvisFromShoulders(S, pitch), pitch }, neck: { flex: -pitch * 0.25 },
    legL: { to: [0, ANKLE_Y, stance], pole: [1, -0.1, 0.3] }, legR: { to: [0, ANKLE_Y, -stance], pole: [1, -0.1, -0.3] },
    footL: { flat: true, out: toeOut }, footR: { flat: true, out: toeOut },
  };
  return deadStart(barY, grip, pose);
};
// Triple extensión: de puntas de pie, cadera extendida, hombros encogidos y la barra pegada al cuerpo.
const extension = ({ grip = 23, barH = 'hip', stance = 11, toeOut = 10 } = {}) => {
  const base = standAir({ stance, toeOut, hinge: -6, air: 6, drop: 2 });
  base.legL.to[1] += 6;
  base.legR.to[1] += 6;
  base.footL = { plantar: 40, out: toeOut };
  base.footR = { plantar: 40, out: toeOut };
  base.shoulders = { L: { elev: 4 }, R: { elev: 4 } };
  return withBody(ground(base, 0), (sk) => {
    if (barH === 'chest') {
      const bar = chestPoint(sk, 40, 12);
      return arms(grab(add(bar, [0, 0, grip]), [-0.2, -1, 0.6], 180), grab(add(bar, [0, 0, -grip]), [-0.2, -1, -0.6], 180));
    }
    const bar = chestPoint(sk, barH === 'chin' ? 62 : 4, barH === 'chin' ? 14 : 10);
    return arms(grab(add(bar, [0, 0, grip]), barH === 'chin' ? [-0.2, -1, 0.8] : [-1, 0, 0.2], 180), grab(add(bar, [0, 0, -grip]), barH === 'chin' ? [-0.2, -1, -0.8] : [-1, 0, -0.2], 180));
  });
};
const rackCatch = ({ drop = 16, hinge = 14, stance = 14 } = {}) => withBody(standAir({ x: -6, drop, hinge, stance, toeOut: 18 }), (sk) => frontRack(sk));
const overheadSquat = ({ drop = 0, hinge = 0, stance = 15, grip = 38 } = {}) => withBody(standAir({ x: -drop * 0.32, drop, hinge, stance, toeOut: 20, kneeOut: 0.4 }), (sk) => overheadGrip(sk, grip, -hinge * 0.15));
const barScene = (pose, opts = {}) => scene(pose, (sk) => E.barbell(fistMid(sk), { half: opts.half ?? 72 }));

const powerClean = (phase) => barScene(phase === 0 ? pullFromFloor() : phase === 0.5 ? extension({ barH: 'hip' }) : rackCatch());
const hangClean = (phase) => {
  if (phase === 0) {
    const S = [8, FLOOR_Y - 58 - ARM_LEN, 0];
    const pitch = 30;
    const pose = { pelvis: { at: pelvisFromShoulders(S, pitch), pitch }, neck: { flex: -8 }, legL: { to: [0, ANKLE_Y, 11], pole: [1, -0.1, 0.3] }, legR: { to: [0, ANKLE_Y, -11], pole: [1, -0.1, -0.3] }, footL: { flat: true, out: 10 }, footR: { flat: true, out: 10 } };
    return barScene(deadStart(FLOOR_Y - 58, 23, pose));
  }
  return barScene(phase === 0.5 ? extension({ barH: 'chest' }) : rackCatch({ drop: 26, hinge: 18 }));
};
const snatch = (phase) => barScene(phase === 0 ? pullFromFloor({ grip: 40, pitch: 62, stance: 12 }) : phase === 0.5 ? extension({ barH: 'hip', grip: 40 }) : overheadSquat({ drop: 46, hinge: 22, grip: 40 }), { half: 76 });
const ohSquat = (phase) => barScene(overheadSquat({ drop: mix(0, 48, phase), hinge: mix(0, 24, phase) }), { half: 76 });
const thruster = (phase) => barScene(phase === 0 ? rackCatch({ drop: 40, hinge: 22 }) : phase === 0.5 ? withBody(standAir({ x: -4, drop: 10, hinge: 4, stance: 14, toeOut: 18 }), (sk) => {
  const bar = add(midShoulder(sk), [2, -24, 0]);
  return arms(grab(add(bar, [0, 0, 22]), [1, 0.2, 0.6], 60), grab(add(bar, [0, 0, -22]), [1, 0.2, -0.6], 60));
}) : overheadSquat({ grip: 23, stance: 13 }));
const pushPress = (phase) => barScene(phase === 0 ? rackCatch({ drop: 0, hinge: 0, stance: 12 }) : phase === 0.5 ? rackCatch({ drop: 12, hinge: 2, stance: 12 }) : withBody({ ...standAir({ stance: 12 }), footL: { plantar: 15, out: 10 }, footR: { plantar: 15, out: 10 } }, (sk) => overheadGrip(sk, 23)));
const jerk = (phase) => {
  if (phase < 0.75) return barScene(rackCatch({ drop: phase === 0 ? 0 : 14, hinge: 0, stance: 12 }));
  const pose = withBody({
    pelvis: { at: [-4, STAND_HIP_Y + 14, 0], pitch: 0 }, neck: { flex: 0 },
    legL: { to: [30, ANKLE_Y, 10], pole: [1, -0.2, 0.1] }, footL: { flat: true, out: 8 },
    legR: { to: [-40, ANKLE_Y - 3, -10], pole: [1, 0.3, -0.1] }, footR: { plantar: 35 },
  }, (sk) => overheadGrip(sk, 23));
  return barScene(pose);
};
const sumoHighPull = (phase) => {
  const grip = 7;
  if (phase === 0) return barScene(pullFromFloor({ grip, stance: 28, toeOut: 35, pitch: 40 }));
  if (phase === 0.5) {
    const S = [6, FLOOR_Y - 52 - ARM_LEN, 0];
    const pose = { pelvis: { at: pelvisFromShoulders(S, 22), pitch: 22 }, neck: { flex: -6 }, legL: { to: [0, ANKLE_Y, 28], pole: [1, -0.1, 0.8] }, legR: { to: [0, ANKLE_Y, -28], pole: [1, -0.1, -0.8] }, footL: { flat: true, out: 35 }, footR: { flat: true, out: 35 } };
    return barScene(deadStart(FLOOR_Y - 52, grip, pose));
  }
  const pose = extension({ barH: 'chin', grip, stance: 28, toeOut: 35 });
  return barScene(pose);
};
const overheadLunge = (phase) => {
  const t = phase;
  const pose = withBody({
    pelvis: { at: [mix(0, 6, t), STAND_HIP_Y + mix(0.6, 30, t), 0], pitch: 0 }, neck: { flex: 0 },
    legL: { to: [mix(2, 34, t), ANKLE_Y - (t === 0.5 ? 6 : 0), 10], pole: [1, -0.2, 0.1] }, footL: t === 0.5 ? { plantar: 0 } : { flat: true },
    legR: { to: [mix(-2, -34, t), mix(ANKLE_Y, FLOOR_Y - 8, t), -10], pole: [1, 0.3, -0.1] }, footR: t > 0 ? { plantar: 38 } : { flat: true },
  }, (sk) => overheadGrip(sk, 30));
  return barScene(pose);
};

/*
 * ───────── Gimnásticos en barra, anillas y soga ─────────
 */
const onBar = ({ S, pitch, grip = 26, legs, pole, barY = BAR_Y, rings = false, handY } = {}) => {
  const pose = {
    pelvis: { at: pelvisFromShoulders(S, pitch), pitch }, neck: { flex: -6 },
    legL: legs?.L ?? { e: 10, p: 0, b: 20 }, legR: legs?.R ?? { e: 10, p: 0, b: 20 }, footL: { plantar: 35 }, footR: { plantar: 35 },
  };
  const hy = handY ?? barY;
  const hand = (side) => (rings ? [S[0] + 4, hy, sideSign(side) * grip] : [2, barY, sideSign(side) * grip]);
  Object.assign(pose, arms(grab(hand('L'), pole ? [pole[0], pole[1], 0.4] : [-0.3, 0.6, 1], 180), grab(hand('R'), pole ? [pole[0], pole[1], -0.4] : [-0.3, 0.6, -1], 180)));
  return pose;
};
const muscleUp = (o = {}) => (phase) => {
  const rings = o.rings;
  let pose;
  if (phase === 0) pose = onBar({ S: [-3, BAR_Y + 49, 0], pitch: -12, rings, handY: BAR_Y, legs: { L: { e: 20, p: 180, b: 30 }, R: { e: 20, p: 180, b: 30 } } });
  else if (phase === 0.5) pose = onBar({ S: [rings ? 0 : 6, BAR_Y - (rings ? 2 : 6), 0], pitch: 28, rings, handY: BAR_Y + 12, grip: rings ? 20 : 26, pole: [-1, -0.6], legs: { L: { e: 40, p: 0, b: 30 }, R: { e: 40, p: 0, b: 30 } } });
  else pose = onBar({ S: [rings ? -2 : -2, BAR_Y - 46, 0], pitch: 6, rings, handY: BAR_Y + 4, grip: rings ? 22 : 24, pole: [-1, -0.2], legs: { L: { e: 25, p: 0, b: 10 }, R: { e: 25, p: 0, b: 10 } } });
  return scene(pose, (sk) => (rings
    ? ['L', 'R'].map((side) => E.straps([0, BAR_Y - 70, sideSign(side) * 24], [fist(sk, side)], { rings: true }))
    : E.pullUpBar(2, BAR_Y, { half: 44 })));
};
const toesToBar = (phase) => {
  const cfg = [[-6, { e: 15, p: 180, b: 10 }], [-18, { e: 95, p: 0, b: 100 }], [-34, { e: 136, p: 0, b: 8 }]][phase === 0 ? 0 : phase === 0.5 ? 1 : 2];
  const pose = onBar({ S: [-3 - (phase === 1 ? 10 : 0), BAR_Y + 49, 0], pitch: cfg[0], legs: { L: cfg[1], R: cfg[1] } });
  pose.spine = { flex: phase === 1 ? 24 : 0 };
  return scene(pose, () => E.pullUpBar(2, BAR_Y, { half: 44 }));
};
const kippingPull = (phase) => {
  const cfg = [
    { S: [-1, BAR_Y + 49, 0], pitch: 14, legs: { L: { e: 30, p: 180, b: 40 }, R: { e: 30, p: 180, b: 40 } } },
    { S: [-8, BAR_Y + 47, 0], pitch: -20, legs: { L: { e: 45, p: 0, b: 10 }, R: { e: 45, p: 0, b: 10 } } },
    { S: [-6, BAR_Y + 14, 0], pitch: -14, legs: { L: { e: 30, p: 0, b: 20 }, R: { e: 30, p: 0, b: 20 } } },
  ][phase === 0 ? 0 : phase === 0.5 ? 1 : 2];
  return scene(onBar({ ...cfg, grip: 28 }), () => E.pullUpBar(2, BAR_Y, { half: 44 }));
};
const chestToBar = (phase) => {
  const S = phase === 0 ? [-3, BAR_Y + 49, 0] : phase === 0.5 ? [-4, BAR_Y + 26, 0] : [-12, BAR_Y + 3, 0];
  const pitch = phase === 0 ? -4 : phase === 0.5 ? -14 : -28;
  return scene(onBar({ S, pitch, grip: 26, legs: { L: { e: 20, p: 0, b: 50 }, R: { e: 24, p: 0, b: 60 } } }), () => E.pullUpBar(2, BAR_Y, { half: 44 }));
};
const ropeClimb = (phase) => {
  const ROPE_X = 4;
  const [sy, hiY, loY, kneeE] = phase === 0 ? [FLOOR_Y - 150, FLOOR_Y - 200, FLOOR_Y - 186, 85] : phase === 0.5 ? [FLOOR_Y - 196, FLOOR_Y - 214, FLOOR_Y - 200, 35] : [FLOOR_Y - 214, FLOOR_Y - 262, FLOOR_Y - 250, 90];
  const S = [-6, sy, 0];
  const pose = {
    pelvis: { at: pelvisFromShoulders(S, -4), pitch: -4 }, neck: { flex: -20 },
    legL: { e: kneeE, p: 0, b: kneeE > 50 ? 100 : 40 }, legR: { e: kneeE - 10, p: 0, b: kneeE > 50 ? 110 : 30 }, footL: { plantar: 0 }, footR: { plantar: 30 },
    ...arms(grab([ROPE_X, hiY, 1.5], [-0.4, 0.4, 1], 180), grab([ROPE_X, loY, -1.5], [-0.4, 0.4, -1], 180)),
  };
  return scene(pose, () => E.climbRope(ROPE_X, 0, { top: FLOOR_Y - 280 }));
};
const ghdSitUp = (phase) => {
  const P = [0, FLOOR_Y - 96, 0];
  const pitch = track(phase, [[0, -118], [0.5, -90], [1, 18]]);
  const pose = withBody({
    pelvis: { at: P, pitch }, spine: { flex: phase === 1 ? 20 : 0 }, neck: { flex: phase === 1 ? 20 : 5 },
    legL: { to: [62, FLOOR_Y - 104, 9], pole: [0, -1, 0.1] }, footL: { plantar: -10 },
    legR: { to: [62, FLOOR_Y - 104, -9], pole: [0, -1, -0.1] }, footR: { plantar: -10 },
  }, () => (phase === 1 ? arms(grab([66, FLOOR_Y - 98, 12], [0, 1, 0.5], 180, { grip: 'open' }), grab([66, FLOOR_Y - 98, -12], [0, 1, -0.5], 180, { grip: 'open' })) : arms(armAngles(170, 5, 0, 0, { grip: 'open' }))));
  return scene(pose, () => [
    E.pad(add(P, [-2, 9, 0]), add(P, [24, 9, 0]), 13, 7),
    E.roller([62, FLOOR_Y - 98, 0], { half: 12 }), E.roller([66, FLOOR_Y - 112, 0], { half: 12 }),
    E.slantPad([66, FLOOR_Y - 96, 0], [72, FLOOR_Y - 116, 0], [-1, 0, 0], { halfW: 12 }),
    E.frame([[-10, FLOOR_Y, 0], [8, P[1] + 16, 0], [64, FLOOR_Y - 90, 0], [80, FLOOR_Y, 0]]),
  ]);
};

/*
 * ───────── Strongman y trineos ─────────
 */
const farmerArms = (both = true) => (sk) => arms(grab(add(shoulderOf(sk, 'L'), [2, 50, 4]), [-1, 0, 0.2], 90), both ? grab(add(shoulderOf(sk, 'R'), [2, 50, -4]), [-1, 0, -0.2], 90) : armSwing(0, 10, { grip: 'open' }));
const sledPush = (phase) => {
  const [lx, ll, rx, rl] = track(phase, [[0, [26, 0, -40, 0]], [0.5, [-6, 0, 10, 14]], [1, [-40, 0, 26, 0]]]);
  const pose = withBody({
    pelvis: { at: [-10, FLOOR_Y - 62, 0], pitch: 50 }, neck: { flex: -30 },
    legL: { to: [lx, ANKLE_Y - ll, 10], pole: [1, -0.2, 0.1] }, footL: lx > rx ? { plantar: 10 } : { plantar: 20 },
    legR: { to: [rx, ANKLE_Y - rl, -10], pole: [1, -0.2, -0.1] }, footR: rx > lx ? { plantar: 10 } : { plantar: 20 },
  }, (sk) => arms(grab(add(shoulderOf(sk, 'L'), [44, 6, 2]), [-1, 0.6, 0.3], 90), grab(add(shoulderOf(sk, 'R'), [44, 6, -2]), [-1, 0.6, -0.3], 90)));
  return scene(pose, (sk) => [
    ['L', 'R'].map((side) => E.line([fist(sk, side)[0] + 2, fist(sk, side)[1] - 14, fist(sk, side)[2]], [fist(sk, side)[0] + 6, FLOOR_Y - 12, fist(sk, side)[2]], { color: E.FRAME, width: 3 })),
    E.aabb([fistMid(sk)[0] + 2, FLOOR_Y - 14, -26], [fistMid(sk)[0] + 50, FLOOR_Y - 2, 26], { fill: E.FRAME, opacity: 0.8, bias: -4 }),
    E.loadedPlate([fistMid(sk)[0] + 30, FLOOR_Y - 24, 0], [0, 1, 0], 16),
  ]);
};
const sledDrag = walk({
  backward: true, lean: -12, drop: 8, stride: 0.9,
  arms: (sk) => arms(grab(chestPoint(sk, 10, 26, 8), [-0.6, 0.6, 0.6], 90), grab(chestPoint(sk, 10, 26, -8), [-0.6, 0.6, -0.6], 90)),
  props: (sk) => [E.line(fistMid(sk), [90, FLOOR_Y - 10, 0], { color: E.DARK, width: 1.6 }), E.aabb([90, FLOOR_Y - 14, -24], [130, FLOOR_Y - 2, 24], { fill: E.FRAME, opacity: 0.8 }), E.loadedPlate([110, FLOOR_Y - 24, 0], [0, 1, 0], 16)],
});
const tireFlip = (phase) => {
  const TIRE_R = 44;
  const lift = [0, 40, 78][phase === 0 ? 0 : phase === 0.5 ? 1 : 2];
  const hinge = (x) => [x, FLOOR_Y, 0];
  const pivot = hinge(80 + TIRE_R);
  const a = deg(lift);
  const normal = [-Math.sin(a), -Math.cos(a), 0];
  const center = add(pivot, [-Math.cos(a) * TIRE_R, -Math.sin(a) * TIRE_R - 6, 0]);
  const edge = add(pivot, [-Math.cos(a) * TIRE_R * 2, -Math.sin(a) * TIRE_R * 2 - 4, 0]);
  const cfg = [
    { x: -6, hinge: 58, drop: 40, stance: 18 },
    { x: 8, hinge: 30, drop: 14, stance: 18, footX: 12 },
    { x: 28, hinge: 34, drop: 6, stance: 14, footX: 30 },
  ][phase === 0 ? 0 : phase === 0.5 ? 1 : 2];
  const pose = withBody(standAir({ ...cfg, toeOut: 16, kneeOut: 0.4 }), () => (phase === 1
    ? arms(palmDown(add(edge, [0, 0, 16]), [-1, 0.2, 0.4], 100), palmDown(add(edge, [0, 0, -16]), [-1, 0.2, -0.4], 100))
    : arms(grab(add(edge, [-2, 4, 16]), [-0.6, 0.6, 0.6], 0, { grip: 'open' }), grab(add(edge, [-2, 4, -16]), [-0.6, 0.6, -0.6], 0, { grip: 'open' }))));
  return scene(pose, () => [E.disc(center, normal, TIRE_R, 14, { fill: E.DARK, opacity: 0.9, bias: -8 }), E.disc(center, normal, TIRE_R * 0.45, 14.4, { fill: E.FRAME, bias: -7 })]);
};
const sledgehammer = (phase) => {
  const pose = withBody({ ...standAir({ stance: 14, drop: phase === 1 ? 14 : 4, hinge: [0, 22, 46][phase === 0 ? 0 : phase === 0.5 ? 1 : 2], x: phase === 1 ? -10 : 0 }) }, (sk) => {
    const m = midShoulder(sk);
    const hands = [add(m, [-10, -44, 0]), add(m, [28, -20, 0]), add(m, [38, 30, 0])][phase === 0 ? 0 : phase === 0.5 ? 1 : 2];
    return arms(grab(add(hands, [0, 0, 3]), [-0.3, 0.5, 0.6], 90), grab(add(hands, [-6, 0, -3]), [-0.3, 0.5, -0.6], 90));
  });
  return scene(pose, (sk) => {
    const lo = fist(sk, 'R');
    const hi = fist(sk, 'L');
    const dir = norm(sub(hi, lo));
    const head = phase === 1 ? [72, FLOOR_Y - 34, 0] : madd(hi, [dir, 46]);
    const handleDir = norm(sub(head, lo));
    return [E.rod(madd(lo, [handleDir, -6]), head, 1.3, { fill: E.FRAME }), E.aabb(add(head, [-5, -5, -5]), add(head, [5, 5, 5]), { fill: E.DARK }), E.disc([74, FLOOR_Y - 14, 0], [0, 1, 0], 40, 26, { fill: E.DARK, opacity: 0.85, bias: -10 })];
  });
};
const atlasStone = (phase) => {
  const cfg = [{ x: -10, hinge: 60, drop: 34, stance: 16 }, { x: -18, hinge: 18, drop: 46, stance: 16 }, { x: 4, hinge: -10, drop: 0, stance: 13 }][phase === 0 ? 0 : phase === 0.5 ? 1 : 2];
  const pose = withBody(standAir({ ...cfg, toeOut: 20, kneeOut: 0.5 }), (sk) => {
    const c = phase === 0 ? [24, FLOOR_Y - 18, 0] : phase === 0.5 ? add(lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5), [-4, -18, 0]) : [42, FLOOR_Y - 120, 0];
    return arms(grab(add(c, [-2, -6, 16]), [-0.2, -0.4, 1], 0, { grip: 'spread' }), grab(add(c, [-2, -6, -16]), [-0.2, -0.4, -1], 0, { grip: 'spread' }));
  });
  return scene(pose, (sk) => {
    const c = phase === 0 ? [24, FLOOR_Y - 18, 0] : phase === 0.5 ? add(lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5), [-4, -18, 0]) : [42, FLOOR_Y - 120, 0];
    return [E.sphere(c, 17, { fill: E.FRAME, bias: 5 }), E.aabb([40, FLOOR_Y - 102, -24], [80, FLOOR_Y, 24], { fill: E.DARK, opacity: 0.7, bias: -20 })];
  });
};
const sandbag = (phase) => {
  const cfg = [{ x: -12, hinge: 60, drop: 30, stance: 15 }, { x: -14, hinge: 20, drop: 40, stance: 15 }, { x: 0, hinge: 0, drop: 0, stance: 12 }][phase === 0 ? 0 : phase === 0.5 ? 1 : 2];
  const pose = withBody(standAir({ ...cfg, toeOut: 16, kneeOut: 0.4 }), (sk) => {
    if (phase === 1) return arms({ arm: { to: chestPoint(sk, 52, 10, 8), pole: [0, 1, 1] }, hand: { pr: 90, grip: 'flat' } }, { arm: { to: chestPoint(sk, 46, 12, 4), pole: [0, 1, -1] }, hand: { pr: 90, grip: 'flat' } });
    const c = phase === 0 ? [20, FLOOR_Y - 12, 0] : add(lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5), [6, -12, 0]);
    return arms(grab(add(c, [-4, -6, 14]), [-0.4, -0.2, 1], 0, { grip: 'spread' }), grab(add(c, [-4, -6, -14]), [-0.4, -0.2, -1], 0, { grip: 'spread' }));
  });
  return scene(pose, (sk) => {
    if (phase === 1) {
      const sh = shoulderOf(sk, 'L');
      return E.rod(add(sh, [-14, -6, 2]), add(sh, [16, -4, 2]), 9, { fill: E.FRAME, bias: 6 });
    }
    const c = phase === 0 ? [20, FLOOR_Y - 10, 0] : add(lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5), [6, -12, 0]);
    return E.rod(add(c, [0, 0, -20]), add(c, [0, 0, 20]), 9, { fill: E.FRAME, bias: 6 });
  });
};

/*
 * ───────── Combate ─────────
 */
const glove = (sk, side) => E.sphere(fist(sk, side), 5.4, { fill: E.GEAR, bias: 4 });
const fightStance = (extra = {}) => ({
  pelvis: { at: [-2, STAND_HIP_Y + 8, 0], pitch: 6, yaw: -20, ...extra.pelvis },
  neck: { flex: -10, turn: 20 },
  legL: { to: [16, ANKLE_Y, 9], pole: [1, -0.2, 0.2] }, footL: { flat: true, out: -10 },
  legR: { to: [-18, ANKLE_Y - 10, -12], pole: [1, -0.2, -0.2] }, footR: { plantar: 30, out: 20 },
});
const guard = (sk, side) => ({ arm: { to: add(sk.head.o, [10, 10, sideSign(side) * 7]), pole: [0.2, 1, sideSign(side) * 0.4] }, hand: { pr: 90, grip: 'fist' } });
const punch = (sk, side) => ({ arm: { to: add(shoulderOf(sk, side), [48, 2, side === 'L' ? -4 : 6]), pole: [0, 1, sideSign(side) * 0.6] }, hand: { pr: 170, grip: 'fist' } });
const boxing = (phase) => {
  const pose = withBody({ ...fightStance(), spine: { twist: phase === 1 ? 30 : 0 } }, (sk) => {
    if (phase === 0.5) return { ...arms(punch(sk, 'L'), guard(sk, 'R')) };
    if (phase === 1) return { ...arms(guard(sk, 'L'), punch(sk, 'R')) };
    return arms(guard(sk, 'L'), guard(sk, 'R'));
  });
  if (phase === 1) pose.footR = { plantar: 40, out: 40 };
  return scene(pose, (sk) => [glove(sk, 'L'), glove(sk, 'R')]);
};
const kickboxing = (phase) => {
  if (phase === 0) return scene(withBody(fightStance(), (sk) => arms(guard(sk, 'L'), guard(sk, 'R'))), (sk) => [glove(sk, 'L'), glove(sk, 'R')]);
  const chamber = phase === 0.5;
  const pose = withBody({
    pelvis: { at: [0, STAND_HIP_Y + 2, 0], pitch: chamber ? 4 : -12, yaw: chamber ? 30 : 70, roll: chamber ? 0 : 14 }, neck: { flex: -10, turn: chamber ? -30 : -60 },
    legL: { to: [4, ANKLE_Y, 6], pole: [1, -0.1, 0.4] }, footL: { flat: true, out: chamber ? 30 : 80 },
    legR: chamber ? { e: 100, p: 30, b: 120 } : { e: 82, p: 55, b: 8 }, footR: { plantar: 40 },
  }, (sk) => arms(guard(sk, 'L'), chamber ? guard(sk, 'R') : { arm: { e: 20, p: 60, b: 30 }, hand: { pr: 90, grip: 'fist' } }));
  return scene(pose, (sk) => [glove(sk, 'L'), glove(sk, 'R')]);
};
// Artes marciales de agarre (lucha / judo / BJJ): guardia baja → entrada a las piernas → sprawl.
const martialArts = (phase) => {
  if (phase < 0.25) {
    const pose = withBody(standAir({ stance: 15, drop: 22, hinge: 34, stagger: 8, kneeOut: 0.4 }), (sk) => arms(
      { arm: { to: chestPoint(sk, 40, 30, 14), pole: [-0.2, 1, 0.6] }, hand: { pr: 120, grip: 'open' } },
      { arm: { to: chestPoint(sk, 40, 30, -14), pole: [-0.2, 1, -0.6] }, hand: { pr: 120, grip: 'open' } },
    ));
    return scene(pose);
  }
  if (phase < 0.75) {
    const pose = withBody({
      pelvis: { at: [6, FLOOR_Y - 46, 0], pitch: 40 }, neck: { flex: -25 },
      legL: { to: [34, ANKLE_Y, 10], pole: [1, -0.3, 0.2] }, footL: { flat: true },
      legR: { to: [-34, FLOOR_Y - 8, -10], pole: [0.3, 1, -0.1] }, footR: { plantar: 40 },
    }, () => arms(
      { arm: { to: [74, FLOOR_Y - 46, 14], pole: [-0.4, 1, 0.5] }, hand: { pr: 90, grip: 'open' } },
      { arm: { to: [74, FLOOR_Y - 46, -14], pole: [-0.4, 1, -0.5] }, hand: { pr: 90, grip: 'open' } },
    ));
    return scene(pose);
  }
  const { pose, hx } = highPlank({ shoulderH: 54, toeX: -64, legs: { legL: { e: 0, p: 20, b: 0 }, legR: { e: 0, p: 20, b: 0 }, footL: { plantar: 10 }, footR: { plantar: 10 } } });
  pose.spine = { flex: -22 };
  pose.neck = { flex: -30 };
  return scene(withBody(pose, () => highPlankArms(hx + 6, 20)));
};

/*
 * ───────── Movilidad ─────────
 */
const yoga = (phase) => {
  const mat = () => E.aabb([-80, FLOOR_Y - 1, -20], [80, FLOOR_Y, 20], { fill: E.FRAME, opacity: 0.35, bias: -30 });
  if (phase === 0) {
    const hx = 40;
    const pitch = 130;
    const S = [hx - 12, FLOOR_Y - 46, 0];
    const P = add(S, [-Math.sin(deg(pitch)) * 44, Math.cos(deg(pitch)) * 44, 0]);
    return scene({ pelvis: { at: P, pitch }, neck: { flex: 25 }, legL: { to: [-40, ANKLE_Y, 9], pole: [1, -0.2, 0] }, legR: { to: [-40, ANKLE_Y, -9], pole: [1, -0.2, 0] }, footL: { flat: true }, footR: { flat: true }, ...arms(palmDown([hx, FLOOR_Y - 2.6, 17], [1, 1, 0.4], 100), palmDown([hx, FLOOR_Y - 2.6, -17], [1, 1, -0.4], 100)) }, mat);
  }
  if (phase === 0.5) {
    const pose = {
      pelvis: { at: [-2, STAND_HIP_Y + 24, 0], pitch: 0, yaw: -50 }, neck: { flex: 0, turn: 50 },
      legL: { to: [38, ANKLE_Y, 6], pole: [0.8, -0.2, 0.6] }, footL: { flat: true, out: 0 },
      legR: { to: [-40, ANKLE_Y, -6], pole: [1, -0.2, -0.2] }, footR: { flat: true, out: 80 },
      armL: { e: 90, p: 90, b: 0 }, handL: { pr: 180, grip: 'flat' }, armR: { e: 90, p: 90, b: 0 }, handR: { pr: 180, grip: 'flat' },
    };
    return scene(pose, mat);
  }
  const pose = withBody({
    pelvis: { at: [0, STAND_HIP_Y + 0.6, 0], pitch: 0 }, neck: { flex: 0 },
    legL: { to: [0, ANKLE_Y, 4], pole: [1, -0.1, 0.1] }, footL: { flat: true },
    legR: { e: 30, p: 80, b: 140, r: 30 }, footR: { plantar: 30 },
  }, () => arms(armAngles(175, 5, 0, 0, { grip: 'flat', pr: 90 })));
  return scene(pose, mat);
};
const pilates = (phase) => {
  const mat = () => E.aabb([-90, FLOOR_Y - 1.5, -22], [90, FLOOR_Y, 22], { fill: E.FRAME, opacity: 0.5, bias: -30 });
  if (phase === 0) {
    return scene({ pelvis: { at: [0, FLOOR_Y - BODY.backDepth, 0], pitch: -90 }, spine: { flex: 26 }, neck: { flex: 20 }, legL: { e: 45, p: 0, b: 0 }, legR: { e: 45, p: 0, b: 0 }, footL: { plantar: 30 }, footR: { plantar: 30 }, armL: { e: 30, p: 10, b: 0 }, handL: { pr: 180, grip: 'flat' }, armR: { e: 30, p: 10, b: 0 }, handR: { pr: 180, grip: 'flat' } }, mat);
  }
  if (phase === 0.5) {
    return scene({ pelvis: { at: [0, FLOOR_Y - 13, 0], pitch: 10 }, spine: { flex: 50 }, neck: { flex: 25 }, legL: { e: 98, p: 0, b: 0 }, legR: { e: 98, p: 0, b: 0 }, footL: { plantar: -10 }, footR: { plantar: -10 }, armL: { e: 140, p: 5, b: 0 }, handL: { pr: 90, grip: 'open' }, armR: { e: 140, p: 5, b: 0 }, handR: { pr: 90, grip: 'open' } }, mat);
  }
  return scene({ pelvis: { at: [0, FLOOR_Y - 9, 0], pitch: -40 }, spine: { flex: 6 }, neck: { flex: 0 }, legL: { e: 105, p: 0, b: 0 }, legR: { e: 105, p: 0, b: 0 }, footL: { plantar: 30 }, footR: { plantar: 30 }, armL: { e: 120, p: 5, b: 0 }, handL: { pr: 90, grip: 'open' }, armR: { e: 120, p: 5, b: 0 }, handR: { pr: 90, grip: 'open' } }, mat);
};
const jeffersonCurl = (phase) => {
  const BOX = 30;
  const base = standAir({ stance: 9, air: BOX, hinge: 0, drop: 0 });
  base.footL = { flat: true };
  base.footR = { flat: true };
  base.pelvis.pitch = mix(0, 45, phase);
  base.pelvis.at = add(base.pelvis.at, [-mix(0, 12, phase), 0, 0]);
  base.spine = { flex: mix(0, 70, phase) };
  base.neck = { flex: mix(0, 40, phase) };
  const pose = withBody(base, (sk) => arms(grab(add(shoulderOf(sk, 'L'), [0, 52, 2]), [-1, 0, 0.2], 180), grab(add(shoulderOf(sk, 'R'), [0, 52, -2]), [-1, 0, -0.2], 180)));
  return scene(pose, (sk) => [E.plyoBox(-22, 22, BOX), E.barbell(fistMid(sk), { half: 64, plateR: 16 })]);
};

// Circuito: estaciones distintas en cada cuadro (wall ball → swing → salto al cajón).
const circuit = (phase) => (phase < 0.25 ? wallBall(0) : phase < 0.75 ? kbSwing(1) : boxJump(1));

export const CONDITIONING_FIGURES = {
  // Cardio
  RUNNING: { build: run({}) },
  SPRINTS: { build: run({ keys: SPRINT_KEYS, lean: (phase) => track(phase, [[0, 32], [0.5, 22], [1, 12]]), armAmp: 0.9 }) },
  CINTA: { build: run({ keys: [[0, [22, 14, -18, 40, 0]], [0.5, [-18, 45, 38, 90, 5]], [1, [-14, 75, 22, 14, 0]]], deck: 12, lean: 6, props: treadmill(0) }) },
  CAMINATA: { build: walk({}) },
  'CAMINATA EN PENDIENTE': { build: walk({ slope: 0.22, deck: 6, lean: 12, drop: 2, props: treadmill(0.22) }) },
  SKIPPING: { build: skipping },
  ESCALADORA: { build: stairMill },
  STEPPER: { build: stepper },
  CICLISMO: { build: roadBike },
  'BICICLETA FIJA': { build: stationaryBike },
  'BICICLETA RECLINADA': { build: recumbentBike },
  ELIPTICO: { build: elliptical },
  'REMO ERGOMETRO': { build: rowErg },
  'SKI ERG': { build: skiErg },
  NATACION: { build: swim, view: 'side' },
  SOGA: { build: jumpRope({}), view: 'front' },
  'DOBLE SALTO DE SOGA': { build: jumpRope({ double: true }), view: 'front' },
  'ASSAULT BIKE': { build: assaultBike },
  // Saltos
  'SENTADILLA CON SALTO': { build: jumpSquat },
  'SALTO AL CAJON': { build: boxJump },
  'SALTO HORIZONTAL': { build: broadJump },
  'ESTOCADAS CON SALTO': { build: jumpLunge },
  'JUMPING JACKS': { build: jumpingJack, view: 'front' },
  PATINADOR: { build: skater, view: 'front' },
  'SENTADILLA A UNA PIERNA': { build: pistol },
  // Peso corporal
  BURPEES: { build: burpee },
  'BURPEE SOBRE LA BARRA': { build: barFacingBurpee, view: 'front' },
  ESCALADORES: { build: mountainClimber },
  'CAMINATA DEL OSO': { build: bearCrawl },
  'PLANCHA CON TOQUE DE HOMBRO': { build: shoulderTap, view: 'front' },
  'CAMINATA DE GUSANO': { build: inchworm },
  'WALL WALK': { build: wallWalk },
  'CAMINATA EN VERTICAL': { build: handstandWalk },
  'FLEXIONES EN VERTICAL': { build: hspu },
  // Kettlebell, mancuerna y balón
  'KETTLEBELL SWING': { build: kbSwing },
  'SNATCH CON KETTLEBELL': { build: kbSnatch },
  'ARRANQUE CON MANCUERNA': { build: dbSnatch },
  'HALO CON KETTLEBELL': { build: kbHalo, view: 'front' },
  'GET UP TURCO': { build: turkishGetUp },
  'DEVIL PRESS': { build: devilPress },
  'WALL BALL': { build: wallBall },
  'SLAM BALL': { build: slamBall },
  'LANZAMIENTO LATERAL DE BALON': { build: rotationalThrow, view: 'top' },
  'BATTLE ROPES': { build: battleRopes },
  'REMO EN TRX': { build: trxRow },
  // Halterofilia
  'CARGADA DE POTENCIA': { build: powerClean },
  'CARGADA COLGANTE': { build: hangClean },
  ARRANQUE: { build: snatch },
  'SENTADILLA OVERHEAD': { build: ohSquat },
  THRUSTER: { build: thruster },
  'PUSH PRESS': { build: pushPress },
  ENVION: { build: jerk },
  'TIRON ALTO SUMO': { build: sumoHighPull },
  'ESTOCADAS CON PESO SOBRE LA CABEZA': { build: overheadLunge },
  // Gimnásticos
  'MUSCLE UP': { build: muscleUp({}) },
  'MUSCLE UP EN ANILLAS': { build: muscleUp({ rings: true }) },
  'TOES TO BAR': { build: toesToBar },
  'DOMINADAS KIPPING': { build: kippingPull },
  'PECHO A LA BARRA': { build: chestToBar },
  'TREPADA DE SOGA': { build: ropeClimb },
  'GHD SIT UP': { build: ghdSitUp },
  // Strongman y cargas
  'PASEO DEL GRANJERO': { build: walk({ arms: farmerArms(true), props: (sk) => ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), [1, 0, 0], { r: 7, half: 7 })) }) },
  'PASEO DE MALETA': { build: walk({ arms: farmerArms(false), props: (sk) => E.dumbbell(fist(sk, 'L'), [1, 0, 0], { r: 7, half: 7 }) }), view: 'front' },
  'PASEO DEL CAMARERO': { build: walk({ arms: (sk) => arms({ arm: { to: add(shoulderOf(sk, 'L'), [0, -50, 2]), pole: [-1, 0, 0.3] }, hand: { pr: 90, grip: 'fist' } }, armSwing(0, 15, { grip: 'open' })), props: (sk) => E.kettlebell(fist(sk, 'L'), { up: [0, 1, 0], across: [1, 0, 0] }) }) },
  'EMPUJE DE TRINEO': { build: sledPush },
  'ARRASTRE DE TRINEO': { build: sledDrag },
  'VOLTEO DE NEUMATICO': { build: tireFlip },
  'GOLPES CON MAZA': { build: sledgehammer },
  'LEVANTAMIENTO DE PIEDRA': { build: atlasStone },
  'LEVANTAMIENTO DE SANDBAG': { build: sandbag },
  'CIRCUITO FUNCIONAL': { build: circuit },
  // Combate
  BOXEO: { build: boxing },
  KICKBOXING: { build: kickboxing },
  'ARTES MARCIALES': { build: martialArts },
  // Movilidad
  YOGA: { build: yoga },
  PILATES: { build: pilates },
  'JEFFERSON CURL': { build: jeffersonCurl },
};
