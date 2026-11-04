import * as E from '../../utils/figure/equipment';
import { add, ANKLE_Y, arms, BENCH_TOP, BODY, chestPoint, fist, fistMid, FLOOR_Y, grab, lerp, madd, mix, norm, scale, scene, shoulderOf, sideSign, STAND_HIP_Y, sub, track, withBody } from './common';
import { dips } from './chest';
import { seated, splitStance, supineBench } from './setups';

/*
 * Brazos: curls de bíceps, extensiones y empujes de tríceps, antebrazos, muñecas y agarre (mano).
 * Los ejercicios de muñeca y mano acercan la cámara (`focus`) a los antebrazos y las manos.
 */

const HANDS_FOCUS = ['forearmL', 'forearmR', 'handL', 'handR'];
const stand = ({ pitch = 0, stance = 11, drop = 0 } = {}) => ({
  pelvis: { at: [0, STAND_HIP_Y + 0.6 + drop, 0], pitch },
  legL: { to: [0, ANKLE_Y, stance], pole: [1, -0.1, 0.2] }, legR: { to: [0, ANKLE_Y, -stance], pole: [1, -0.1, -0.2] },
  footL: { flat: true, out: 8 }, footR: { flat: true, out: 8 },
});
const sideArm = { arm: { e: 8, p: 60, b: 20 }, hand: { pr: 90, grip: 'open' } };

// ───────── Bíceps ─────────

/*
 * Curl de pie con los codos fijos. o.gear: 'barbell' | 'ez' | 'dumbbell' | 'cable' | 'rope' | 'cableBar';
 * o.pr: 0 supino, 90 martillo, 180 invertido; o.alternate; o.cross (martillo cruzado); o.zottman; o.order (21s).
 */
const curl = (o = {}) => (phase) => {
  const bendAt = (t) => mix(8, 138, t);
  let bL = bendAt(phase);
  let bR = bL;
  let prL = o.pr ?? 0;
  let prR = prL;
  if (o.alternate) {
    bL = bendAt(track(phase, [[0, 0], [0.5, 1], [1, 0]]));
    bR = bendAt(track(phase, [[0, 0], [0.5, 0], [1, 1]]));
  }
  if (o.order) bL = bR = bendAt(track(phase, [[0, 0.45], [0.5, 1], [1, 0]]));
  if (o.zottman) {
    bL = bR = bendAt(track(phase, [[0, 0], [0.5, 1], [1, 0.45]]));
    prL = prR = track(phase, [[0, 0], [0.4, 0], [0.5, 180], [1, 180]]);
  }
  const p = o.cross ? -25 : 10;
  const r = o.cross ? -35 : 0;
  const pose = { ...stand({ stance: 11 }), armL: { e: 4, p, b: bL, r }, armR: { e: 4, p, b: bR, r }, handL: { pr: prL, grip: 'fist' }, handR: { pr: prR, grip: 'fist' } };
  return scene(pose, (sk) => {
    const items = [];
    if (o.gear === 'barbell') items.push(E.barbell(fistMid(sk), { plateR: 12, half: 60, inner: 44 }));
    else if (o.gear === 'ez') items.push(E.ezBar(fistMid(sk), { bendDir: [1, 0, 0] }));
    else if (o.gear === 'cable' || o.gear === 'rope' || o.gear === 'cableBar') {
      const h = fistMid(sk);
      const pulley = [h[0] + 28, FLOOR_Y - 10, 0];
      items.push(E.cableColumn(pulley[0] + 5, 0, pulley[1]), E.cable(pulley, h));
      if (o.gear === 'rope') items.push(E.polyline([fist(sk, 'L'), add(h, [2, 3, 0]), fist(sk, 'R')], { color: E.DARK, width: 2.4 }));
      else items.push(E.handle('bar', h, [0, 0, 1], { half: 22 }));
    } else ['L', 'R'].forEach((side) => items.push(E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb)));
    return items;
  });
};

// Curl arrastrado (drag curl): la barra sube pegada al cuerpo y los codos van hacia atrás.
const dragCurl = (phase) => {
  const pose = withBody(stand(), (sk) => {
    const hand = (side) => lerp(chestPoint(sk, -8, 15, sideSign(side) * 18), chestPoint(sk, 30, 13.5, sideSign(side) * 18), phase);
    return arms(grab(hand('L'), [-1, 0.2, 0.3], 0), grab(hand('R'), [-1, 0.2, -0.3], 0));
  });
  return scene(pose, (sk) => E.barbell(fistMid(sk), { plateR: 12, half: 60, inner: 44 }));
};

// Curl en banco Scott (predicador): brazos apoyados en el atril inclinado. o.gear: 'ez' | 'dumbbell' | 'machine'.
const preacher = (o = {}) => (phase) => {
  const setup = seated({ lean: -8, seatY: FLOOR_Y - 52, back: false, footX: 26 });
  const b = mix(12, 128, phase);
  const pose = { ...setup.pose, armL: { e: 48, p: 8, b, r: 0 }, armR: o.single ? { e: 10, p: 20, b: 40 } : { e: 48, p: 8, b, r: 0 }, handL: { pr: 0, grip: 'fist' }, handR: { pr: o.single ? 90 : 0, grip: o.single ? 'open' : 'fist' } };
  return scene(pose, (sk) => {
    const shL = shoulderOf(sk, 'L');
    const elbow = sk.arms.L.mid;
    const padTop = madd(shL, [norm(sub(elbow, shL)), 4], [[0, 1, 0], 5]);
    const padEnd = madd(elbow, [norm(sub(elbow, shL)), 5], [[0, 1, 0], 5]);
    const items = [setup.props(sk), E.slantPad([padTop[0], padTop[1] + 2, 0], [padEnd[0], padEnd[1] + 2, 0], [-0.7, -0.7, 0], { halfW: 18, thick: 9 }), E.post([padEnd[0] - 8, padEnd[1] + 10, 0], { r: 2 })];
    if (o.gear === 'dumbbell') items.push(E.dumbbell(fist(sk, 'L'), sk.arms.L.hand.thumb));
    else if (o.gear === 'machine') ['L', 'R'].forEach((side) => items.push(E.handle('D', fist(sk, side), sk.arms[side].hand.thumb), E.lever(add(sk.arms[side].mid, [0, 0, sideSign(side) * 6]), add(fist(sk, side), [0, 0, sideSign(side) * 6]))));
    else items.push(E.ezBar(fistMid(sk), { bendDir: [1, 0, 0] }));
    if (o.gear === 'machine') items.push(E.weightStack(sk.pelvis.o[0] + 60, 0));
    return items;
  });
};

// Curl en máquina con los brazos horizontales apoyados al frente (tipo Nautilus).
const machineCurl = (phase) => {
  const setup = seated({ lean: 2, seatY: FLOOR_Y - 46, back: false, footX: 30 });
  const b = mix(12, 125, phase);
  const pose = { ...setup.pose, armL: { e: 78, p: 10, b }, armR: { e: 78, p: 10, b }, handL: { pr: 0, grip: 'fist' }, handR: { pr: 0, grip: 'fist' } };
  return scene(pose, (sk) => {
    const items = [setup.props(sk)];
    const e = lerp(sk.arms.L.mid, sk.arms.R.mid, 0.5);
    items.push(E.slantPad(add(e, [-22, 6, 0]), add(e, [4, 6, 0]), [0.1, -1, 0], { halfW: 20 }), E.post(add(e, [-12, 12, 0]), { r: 2 }));
    ['L', 'R'].forEach((side) => items.push(E.lever(add(sk.arms[side].mid, [0, 0, sideSign(side) * 6]), add(fist(sk, side), [0, 0, sideSign(side) * 6])), E.handle('D', fist(sk, side), sk.arms[side].hand.thumb)));
    items.push(E.weightStack(sk.pelvis.o[0] + 64, 0));
    return items;
  });
};

// Curl concentrado: sentado, codo apoyado en la cara interna del muslo.
const concentrationCurl = (phase) => {
  const setup = seated({ lean: -38, seatY: FLOOR_Y - 44, back: false, footX: 34, stance: 20 });
  const b = mix(10, 135, phase);
  const pose = { ...setup.pose, armL: { e: 36, p: -8, b, r: -15 }, handL: { pr: 0, grip: 'fist' }, armR: { e: 40, p: 30, b: 60 }, handR: { pr: 90, grip: 'flat' } };
  return scene(pose, (sk) => [setup.props(sk), E.dumbbell(fist(sk, 'L'), sk.arms.L.hand.thumb)]);
};

// Curl inclinado: sentado en banco a 45°, brazos colgando por detrás del tronco.
const inclineCurl = (phase) => {
  const setup = supineBench({ angle: 48 });
  const b = mix(6, 130, phase);
  const pose = { ...setup.pose, armL: { e: 40, p: 175, b, r: 0 }, armR: { e: 40, p: 175, b, r: 0 }, handL: { pr: 0, grip: 'fist' }, handR: { pr: 0, grip: 'fist' } };
  return scene(pose, (sk) => [setup.props(sk), ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb))]);
};

// Curl araña: boca abajo en un banco inclinado, brazos colgando verticales por delante del respaldo.
const spiderCurl = (phase) => {
  const b = mix(6, 130, phase);
  const pose = { pelvis: { at: [-16, FLOOR_Y - 70, 0], pitch: 52 }, legL: { to: [-40, ANKLE_Y, 13], pole: [1, 0, 0.4] }, legR: { to: [-40, ANKLE_Y, -13], pole: [1, 0, -0.4] }, footL: { flat: true }, footR: { flat: true }, neck: { flex: -10 }, armL: { e: 52, p: 0, b }, armR: { e: 52, p: 0, b }, handL: { pr: 0, grip: 'fist' }, handR: { pr: 0, grip: 'fist' } };
  return scene(pose, (sk) => [E.slantPad(chestPoint(sk, -12, -BODY.chestFront - 0.5), chestPoint(sk, 44, -BODY.chestFront - 0.5), scale(sk.pelvis.basis.fwd, -1), { halfW: 12 }), E.post(chestPoint(sk, 6, -16), { r: 2 }), ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb))]);
};

// Curl bayesiano: de espaldas a la polea baja, el brazo empieza por detrás del cuerpo.
const bayesianCurl = (phase) => {
  const b = mix(8, 132, phase);
  const pose = { ...splitStance({ front: 16, back: -18, hinge: 4 }), armL: { e: 32, p: 178, b }, handL: { pr: 0, grip: 'fist' }, armR: sideArm.arm, handR: sideArm.hand };
  return scene(pose, (sk) => {
    const pulley = [-56, FLOOR_Y - 12, 14];
    return [E.cableColumn(pulley[0] - 5, pulley[2], pulley[1]), E.cable(pulley, fist(sk, 'L')), E.handle('D', fist(sk, 'L'), sk.arms.L.hand.thumb)];
  });
};

// Curl en polea alta (pose de doble bíceps entre dos poleas).
const highCableCurl = (phase) => {
  const b = mix(10, 125, phase);
  const pose = { ...stand({ stance: 13 }), armL: { e: 86, p: 90, b, r: 90 }, armR: { e: 86, p: 90, b, r: 90 }, handL: { pr: 0, grip: 'fist' }, handR: { pr: 0, grip: 'fist' } };
  return scene(pose, (sk) => ['L', 'R'].map((side) => {
    const pulley = [0, shoulderOf(sk, side)[1] - 8, sideSign(side) * 80];
    return [E.cableColumn(pulley[0], pulley[2], pulley[1]), E.cable(pulley, fist(sk, side)), E.handle('D', fist(sk, side), sk.arms[side].hand.thumb)];
  }));
};

// Curl en TRX: cuerpo inclinado hacia atrás colgado de las correas; al flexionar los codos el cuerpo sube.
const trxCurl = (phase) => {
  const alpha = mix(48, 62, phase) * (Math.PI / 180);
  const heel = [34, FLOOR_Y - 4];
  const legLen = BODY.thigh + BODY.shin + 3;
  const hip = [heel[0] - Math.cos(alpha) * legLen, heel[1] - Math.sin(alpha) * legLen, 0];
  const pitch = -(90 - (alpha * 180) / Math.PI);
  const pose = { pelvis: { at: hip, pitch }, legL: { e: 0, p: 4 }, legR: { e: 0, p: 4 }, footL: { plantar: -10 }, footR: { plantar: -10 } };
  const sk0 = withBody(pose, (sk) => {
    const sh = lerp(shoulderOf(sk, 'L'), shoulderOf(sk, 'R'), 0.5);
    const reach = add(sh, [46 * Math.cos(0.5), -46 * Math.sin(0.5), 0]);
    const target = lerp(reach, add(sh, [14, -16, 0]), phase);
    return arms(grab(add(target, [0, 0, 9]), [0, 1, 0.5], 0), grab(add(target, [0, 0, -9]), [0, 1, -0.5], 0));
  });
  return scene(sk0, (sk) => E.straps([fistMid(sk)[0] + 40, FLOOR_Y - 210, 0], [fist(sk, 'L'), fist(sk, 'R')]));
};

// Curl acostado en polea: boca arriba en el piso con los pies hacia la polea baja; codos apoyados.
const lyingCableCurl = (phase) => {
  const pose = { pelvis: { at: [0, FLOOR_Y - 9, 0], pitch: 90 + 180 - 0, yaw: 0 } };
  pose.pelvis = { at: [0, FLOOR_Y - 9.2, 0], pitch: -90, yaw: 180 };
  Object.assign(pose, { legL: { e: 0, p: 2 }, legR: { e: 0, p: 2 }, footL: { plantar: 0 }, footR: { plantar: 0 } });
  const b = mix(15, 130, phase);
  Object.assign(pose, { armL: { e: 6, p: 15, b }, armR: { e: 6, p: 15, b }, handL: { pr: 0, grip: 'fist' }, handR: { pr: 0, grip: 'fist' } });
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    const pulley = [h[0] - 110, FLOOR_Y - 10, 0];
    return [E.cableColumn(pulley[0] - 5, 0, pulley[1]), E.cable(pulley, h), E.handle('bar', h, [0, 0, 1], { half: 20 })];
  });
};

// Curl waiter: una mancuerna vertical sostenida por el disco con las dos palmas.
const waiterCurl = (phase) => {
  const pose = withBody(stand(), (sk) => {
    const low = chestPoint(sk, -4, 18);
    const high = chestPoint(sk, 36, 22);
    const t = lerp(low, high, phase);
    return arms(grab(add(t, [0, 0, 3]), [-0.4, 1, 0.4], 30, { grip: 'flat' }), grab(add(t, [0, 0, -3]), [-0.4, 1, -0.4], 30, { grip: 'flat' }));
  });
  return scene(pose, (sk) => {
    const top = lerp(sk.arms.L.hand.wrist, sk.arms.R.hand.wrist, 0.5);
    const palm = norm(add(sk.arms.L.hand.palm, sk.arms.R.hand.palm));
    const c = madd(top, [palm, 7]);
    return E.dumbbell(madd(c, [[0, 1, 0], 5]), [0, 1, 0], { r: 6.5 });
  });
};

// ───────── Tríceps ─────────

/*
 * Empuje en polea alta (pushdown). o.handle: 'bar' | 'rope' | 'v' | 'reverse' | 'single' | 'cross'.
 */
const pushdown = (o = {}) => (phase) => {
  const b = mix(105, 4, phase);
  const pr = { bar: 180, rope: 90, v: 140, reverse: 0, single: 180, cross: 90 }[o.handle ?? 'bar'];
  const base = stand({ pitch: 10, stance: 12, drop: 2 });
  // Barra recta: manos al ancho de los hombros; V: manos juntas; invertido: palmas arriba y codos pegados.
  const spread = { bar: 14, v: -14, reverse: 4, single: 6 }[o.handle] ?? 4;
  let armL = { e: 10, p: spread, b, r: o.handle === 'v' ? -18 : 0 };
  let armR = armL;
  if (o.handle === 'rope') armL = armR = { e: 10, p: 4 + phase * 10, b, r: phase * -12 };
  if (o.handle === 'single') armR = sideArm.arm;
  if (o.handle === 'cross') {
    armL = { e: 35, p: -60 + phase * 20, b: mix(110, 6, phase), r: mix(-80, 10, phase) };
    armR = sideArm.arm;
  }
  const pose = { ...base, armL, armR, handL: { pr, grip: 'fist' }, handR: o.handle === 'single' || o.handle === 'cross' ? sideArm.hand : { pr, grip: 'fist' } };
  return scene(pose, (sk) => {
    const single = o.handle === 'single' || o.handle === 'cross';
    const h = single ? fist(sk, 'L') : fistMid(sk);
    const pulley = o.handle === 'cross' ? [shoulderOf(sk, 'L')[0] + 8, FLOOR_Y - 200, -60] : [h[0] + 18, FLOOR_Y - 200, 0];
    const items = [E.cableColumn(pulley[0] + 4, pulley[2], pulley[1]), E.cable(pulley, h)];
    if (o.handle === 'rope') items.push(E.polyline([fist(sk, 'L'), add(h, [1, -4, 0]), fist(sk, 'R')], { color: E.DARK, width: 2.4 }));
    else if (o.handle === 'v') items.push(E.handle('v', h, [0, 0, 1], { down: [0, -1, 0] }));
    else if (single) items.push(E.handle('D', h, sk.arms.L.hand.thumb));
    else items.push(E.handle('bar', h, [0, 0, 1], { half: 20 }));
    return items;
  });
};

/*
 * Extensión por encima de la cabeza. o.gear: 'dumbbell1' (una mano), 'copa' (una mancuerna con dos manos),
 * 'rope' (polea, de espaldas), 'ez' (sentado con barra W).
 */
const overheadExtension = (o = {}) => (phase) => {
  const b = mix(140, 8, phase);
  let setup;
  if (o.gear === 'ez' || o.gear === 'copa') setup = seated({ lean: -2, seatY: FLOOR_Y - 44 });
  else if (o.gear === 'rope') setup = { pose: { ...splitStance({ hinge: 32, front: 16, back: -20, drop: 4 }) }, props: () => [] };
  else setup = { pose: stand(), props: () => [] };
  const e = o.gear === 'rope' ? 150 : 168;
  const both = o.gear !== 'dumbbell1';
  const armSpec = { e, p: o.gear === 'rope' ? 8 : 4, b, r: 0 };
  const pose = {
    ...setup.pose,
    armL: { ...armSpec, p: both ? (o.gear === 'copa' ? -8 : 6) : 0 },
    armR: both ? { ...armSpec, p: o.gear === 'copa' ? -8 : 6 } : sideArm.arm,
    handL: { pr: o.gear === 'ez' ? 180 : 90, grip: o.gear === 'copa' ? 'flat' : 'fist' },
    handR: both ? { pr: o.gear === 'ez' ? 180 : 90, grip: o.gear === 'copa' ? 'flat' : 'fist' } : sideArm.hand,
  };
  return scene(pose, (sk) => {
    const items = [setup.props(sk)];
    if (o.gear === 'ez') items.push(E.ezBar(fistMid(sk), { bendDir: [1, 0, 0] }));
    else if (o.gear === 'copa') {
      const top = fistMid(sk);
      items.push(E.dumbbell(madd(top, [norm(sk.arms.L.hand.dir), 4]), norm(add(sk.arms.L.hand.dir, sk.arms.R.hand.dir)), { r: 7 }));
    } else if (o.gear === 'rope') {
      const h = fistMid(sk);
      const pulley = [h[0] - 40, FLOOR_Y - 26, 0];
      items.push(E.cableColumn(pulley[0] - 5, 0, pulley[1]), E.cable(pulley, h), E.polyline([fist(sk, 'L'), add(h, [-3, 2, 0]), fist(sk, 'R')], { color: E.DARK, width: 2.4 }));
    } else items.push(E.dumbbell(fist(sk, 'L'), sk.arms.L.hand.thumb));
    return items;
  });
};

/*
 * Extensión acostado (press francés y variantes). o.gear: 'ez' | 'dumbbell' | 'cable' | 'jm' | 'tate'.
 */
const lyingExtension = (o = {}) => (phase) => {
  const setup = supineBench({});
  let pose;
  if (o.gear === 'jm' || o.gear === 'tate') {
    pose = withBody(setup.pose, (sk) => {
      const s = lerp(shoulderOf(sk, 'L'), shoulderOf(sk, 'R'), 0.5);
      const hand = (side) => {
        const top = [s[0] + 1, s[1] - 46, sideSign(side) * (o.gear === 'tate' ? 14 : 11)];
        const bottom = o.gear === 'jm' ? chestPoint(sk, 47, 14, sideSign(side) * 11) : chestPoint(sk, 32, 14, sideSign(side) * 7);
        return lerp(top, bottom, phase);
      };
      const pole = (side) => (o.gear === 'jm' ? [0.9, 0.2, sideSign(side) * 0.2] : [0, 0.3, sideSign(side) * 1]);
      return arms(grab(hand('L'), pole('L'), o.gear === 'tate' ? 180 : 90), grab(hand('R'), pole('R'), o.gear === 'tate' ? 180 : 90));
    });
  } else {
    const b = mix(6, 128, phase);
    pose = { ...setup.pose, armL: { e: 96, p: 4, b, r: 0 }, armR: { e: 96, p: 4, b, r: 0 }, handL: { pr: o.gear === 'dumbbell' ? 90 : 160, grip: 'fist' }, handR: { pr: o.gear === 'dumbbell' ? 90 : 160, grip: 'fist' } };
  }
  return scene(pose, (sk) => {
    const items = [setup.props(sk)];
    if (o.gear === 'dumbbell' || o.gear === 'tate') ['L', 'R'].forEach((side) => items.push(E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb)));
    else if (o.gear === 'cable') {
      const h = fistMid(sk);
      const pulley = [sk.head.o[0] - 50, FLOOR_Y - 14, 0];
      items.push(E.cableColumn(pulley[0] - 5, 0, pulley[1]), E.cable(pulley, h), E.handle('bar', h, [0, 0, 1], { half: 16 }));
    } else if (o.gear === 'jm') items.push(E.barbell(fistMid(sk), { plateR: 15 }));
    else items.push(E.ezBar(fistMid(sk), { bendDir: [0, 1, 0] }));
    return items;
  });
};

// Patada de tríceps: torso inclinado, brazo pegado al cuerpo y el antebrazo se estira hacia atrás.
const kickback = (o = {}) => (phase) => {
  const b = mix(95, 4, phase);
  const pose = { pelvis: { at: [-14, STAND_HIP_Y + 9, 0], pitch: 62 }, legL: { to: [16, ANKLE_Y, 11], pole: [1, -0.2, 0.2] }, legR: { to: [-24, ANKLE_Y, -11], pole: [1, 0, -0.2] }, footL: { flat: true }, footR: { flat: true, out: 12 }, neck: { flex: -20 }, armL: { e: 8, p: 180, b, r: 0 }, handL: { pr: 90, grip: 'fist' }, armR: { e: 50, p: 10, b: 60 }, handR: { pr: 90, grip: 'flat' } };
  return scene(pose, (sk) => {
    if (o.gear === 'cable') {
      const pulley = [sk.arms.L.mid[0] + 40, FLOOR_Y - 20, 10];
      return [E.cableColumn(pulley[0] + 5, pulley[2], pulley[1]), E.cable(pulley, fist(sk, 'L')), E.handle('D', fist(sk, 'L'), sk.arms.L.hand.thumb)];
    }
    return E.dumbbell(fist(sk, 'L'), sk.arms.L.hand.thumb);
  });
};

// Fondos en máquina asistida: rodillas sobre la plataforma con contrapeso.
const assistedDipMachine = (phase) => {
  const sc = dips({ leanTop: 4, leanBottom: 8, flare: 0.2, kneeBend: 95, legsForward: 70 })(phase);
  const knee = lerp(sc.skeleton.legs.L.mid, sc.skeleton.legs.R.mid, 0.5);
  sc.props.push(E.pad(add(knee, [-14, 5, 0]), add(knee, [10, 5, 0]), 12, 4), ...E.weightStack(-40, 0), ...E.lever(add(knee, [-40, 20, 0]), add(knee, [-14, 7, 0])));
  return sc;
};

// Fondos en banco: manos en el borde del banco detrás, pies adelante en el piso.
const benchDips = (phase) => {
  const benchX = -20;
  const dropY = mix(0, 22, phase);
  const S = [benchX + 6, BENCH_TOP - 46 + dropY, 0];
  const pitch = mix(-4, 2, phase);
  const pose = withBody({
    pelvis: { at: add(S, [0, 44, 0]), pitch },
    legL: { to: [benchX + 66, ANKLE_Y, 10], pole: [0, -1, 0.1] }, legR: { to: [benchX + 66, ANKLE_Y, -10], pole: [0, -1, -0.1] },
    footL: { flat: true, out: 4 }, footR: { flat: true, out: 4 },
  }, () => arms(
    { arm: { to: [benchX + 1, BENCH_TOP - 2.6, 18], pole: [-1, -0.2, 0.15] }, hand: { pr: 20, grip: 'flat', flex: -70 } },
    { arm: { to: [benchX + 1, BENCH_TOP - 2.6, -18], pole: [-1, -0.2, -0.15] }, hand: { pr: 20, grip: 'flat', flex: -70 } },
  ));
  return scene(pose, () => E.flatBench(benchX - 60, benchX + 6, BENCH_TOP));
};

// Fondos en máquina sentado: se empujan las manijas hacia abajo junto a la cadera.
const seatedDipMachine = (phase) => {
  const setup = seated({ lean: 6, seatY: FLOOR_Y - 46 });
  const pose = withBody(setup.pose, (sk) => {
    const hand = (side) => lerp(chestPoint(sk, 32, -2, sideSign(side) * 24), chestPoint(sk, 4, 2, sideSign(side) * 23), phase);
    return arms(grab(hand('L'), [-1, -0.3, 0.2], 90), grab(hand('R'), [-1, -0.3, -0.2], 90));
  });
  return scene(pose, (sk) => [setup.props(sk), ['L', 'R'].map((side) => [E.lever(add(shoulderOf(sk, side), [-30, -10, sideSign(side) * 10]), fist(sk, side)), E.handle('D', fist(sk, side), [1, 0, 0])]), E.weightStack(sk.pelvis.o[0] - 36, 0)]);
};

// Extensión de tríceps en máquina: codos apoyados al frente, se estiran los brazos.
const tricepsMachine = (phase) => {
  const setup = seated({ lean: 4, seatY: FLOOR_Y - 46, back: false, footX: 30 });
  const b = mix(120, 8, phase);
  const pose = { ...setup.pose, armL: { e: 60, p: 10, b, r: 0 }, armR: { e: 60, p: 10, b, r: 0 }, handL: { pr: 90, grip: 'fist' }, handR: { pr: 90, grip: 'fist' } };
  return scene(pose, (sk) => {
    const e = lerp(sk.arms.L.mid, sk.arms.R.mid, 0.5);
    return [setup.props(sk), E.slantPad(add(e, [-20, 2, 0]), add(e, [6, 9, 0]), [0.3, -1, 0], { halfW: 20 }), E.post(add(e, [-6, 14, 0]), { r: 2 }), ['L', 'R'].map((side) => [E.lever(add(sk.arms[side].mid, [0, 0, sideSign(side) * 6]), add(fist(sk, side), [0, 0, sideSign(side) * 6])), E.handle('D', fist(sk, side), sk.arms[side].hand.thumb)]), E.weightStack(sk.pelvis.o[0] + 66, 0)];
  });
};

// ───────── Antebrazos y mano ─────────

/*
 * Muñeca con los antebrazos apoyados en los muslos (sentado). o.pr: 0 palmas arriba (flexión) / 180 abajo (extensión);
 * o.gear: 'barbell' | 'dumbbell' (una mano sobre el banco) | 'cable'; o.fingers (curl de dedos).
 */
const wristWork = (o = {}) => (phase) => {
  const setup = seated({ lean: -28, seatY: FLOOR_Y - 44, back: false, footX: 30, stance: 12 });
  const flex = o.fingers ? 10 : mix(o.from ?? -55, o.to ?? 55, phase);
  const grip = o.fingers ? (phase < 0.5 ? 'open' : 'fist') : 'fist';
  const pose = withBody(setup.pose, (sk) => {
    const knee = (side) => sk.legs[side].mid;
    const hand = (side) => madd(knee(side), [[1, 0, 0], 17], [[0, -1, 0], 4]);
    const spec = (side) => ({ arm: { to: hand(side), pole: [-0.3, 1, sideSign(side) * 0.2] }, hand: { pr: o.pr ?? 0, flex, grip } });
    if (o.single) return arms(spec('L'), { arm: { e: 30, p: 10, b: 80 }, hand: { pr: 90, grip: 'flat' } });
    return arms(spec('L'), spec('R'));
  });
  return scene(pose, (sk) => {
    const items = [setup.props(sk)];
    if (o.gear === 'dumbbell') items.push(E.dumbbell(fist(sk, 'L'), sk.arms.L.hand.thumb, { r: 5 }));
    else if (o.gear === 'cable') {
      const h = fistMid(sk);
      items.push(E.cable([h[0] + 30, FLOOR_Y - 10, 0], h), E.cableColumn(h[0] + 35, 0, FLOOR_Y - 10), E.handle('bar', h, [0, 0, 1], { half: 18 }));
    } else {
      const c = o.fingers && phase < 0.5 ? madd(fistMid(sk), [lerp(sk.arms.L.hand.dir, sk.arms.R.hand.dir, 0.5), 3]) : fistMid(sk);
      items.push(E.barbell(c, { plateR: 0, half: 30, inner: 26 }));
    }
    return items;
  });
};

// Curl de muñeca de pie con la barra detrás de los glúteos.
const behindBackWrist = (phase) => {
  const flex = mix(-40, 55, phase);
  const pose = withBody(stand(), (sk) => arms(
    { arm: { to: chestPoint(sk, -12, -14, 18), pole: [-1, 0, 0.3] }, hand: { pr: 0, flex, grip: 'fist' } },
    { arm: { to: chestPoint(sk, -12, -14, -18), pole: [-1, 0, -0.3] }, hand: { pr: 0, flex, grip: 'fist' } },
  ));
  return scene(pose, (sk) => E.barbell(fistMid(sk), { plateR: 0, half: 34, inner: 30 }));
};

// Desviación radial/cubital y pronosupinación con la mancuerna tomada de un extremo, brazo al costado.
const forearmTilt = (o = {}) => (phase) => {
  const base = o.seatedForearm ? seated({ lean: -20, seatY: FLOOR_Y - 44, back: false, footX: 30 }) : { pose: stand(), props: () => [] };
  const pose = withBody(base.pose, (sk) => {
    if (o.mode === 'rotate') {
      const knee = sk.legs.L.mid;
      return arms({ arm: { to: madd(knee, [[1, 0, 0], 10], [[0, -1, 0], 5]), pole: [-0.3, 1, 0.2] }, hand: { pr: mix(10, 170, phase), grip: 'fist' } }, { arm: { e: 30, p: 10, b: 80 }, hand: { pr: 90, grip: 'flat' } });
    }
    const dev = o.mode === 'ulnar' ? mix(10, -28, phase) : mix(-20, 28, phase);
    return arms({ arm: { e: o.mode === 'ulnar' ? 6 : 4, p: o.mode === 'ulnar' ? 30 : 10, b: 2 }, hand: { pr: 90, grip: 'fist', dev } }, sideArm);
  });
  return scene(pose, (sk) => {
    const h = sk.arms.L.hand;
    const shaftDir = o.mode === 'ulnar' ? scale(h.thumb, -1) : h.thumb;
    const items = [base.props(sk), E.rod(fist(sk, 'L'), madd(fist(sk, 'L'), [shaftDir, 14]), 1.0, { fill: E.FRAME }), E.disc(madd(fist(sk, 'L'), [shaftDir, 14]), shaftDir, 5.5, 3.6)];
    return items;
  });
};

// Rodillo de muñeca: brazos al frente enrollando la cuerda con el peso.
const wristRoller = (phase) => {
  const pose = withBody(stand(), (sk) => {
    const c = chestPoint(sk, 40, 46);
    const flexL = mix(-40, 50, phase);
    return arms(grab(add(c, [0, 0, 14]), [-0.3, 1, 0.4], 180, { flex: flexL }), grab(add(c, [0, 0, -14]), [-0.3, 1, -0.4], 180, { flex: -flexL }));
  });
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    const weightY = mix(FLOOR_Y - 10, FLOOR_Y - 50, phase);
    return [E.rod(add(h, [0, 0, -20]), add(h, [0, 0, 20]), 1.8, { fill: E.FRAME }), E.line(h, [h[0], weightY, 0], { color: E.DARK, width: 1.2 }), E.disc([h[0], weightY + 6, 0], [0, 1, 0], 8, 3)];
  });
};

// Colgado de la barra (con barra, toallas o a una mano).
const hang = (o = {}) => (phase) => {
  const barY = FLOOR_Y - 210;
  const S = [-3, barY + 50, o.single ? 8 : 0];
  const pose = {
    pelvis: { at: add(S, [0, 44, 0]), pitch: -2, roll: o.single ? -6 : 0 },
    shoulders: { L: { elev: mix(5, 2, phase) }, R: { elev: mix(5, 2, phase) } },
    legL: { e: 6, p: 0, b: 20 }, legR: { e: 10, p: 0, b: 30 }, footL: { plantar: 25 }, footR: { plantar: 25 },
  };
  const grip = o.towel ? 18 : 24;
  Object.assign(pose, arms(grab([2, barY + (o.towel ? 16 : 0), grip], [-0.3, 0.6, 1], o.towel ? 90 : 180), o.single ? { arm: { e: 20, p: 70, b: 30 }, hand: { pr: 90, grip: 'open' } } : grab([2, barY + (o.towel ? 16 : 0), -grip], [-0.3, 0.6, -1], o.towel ? 90 : 180)));
  return scene(pose, (sk) => {
    const items = [E.pullUpBar(2, barY, { half: 44 })];
    if (o.towel) ['L', 'R'].forEach((side) => items.push(E.line([2, barY, sideSign(side) * grip], add(fist(sk, side), [0, 5, 0]), { color: E.FRAME, width: 3.2 })));
    return items;
  });
};

// Agarre estático con implemento a los costados (mancuernas, barra gruesa) o pinza con discos.
const staticHold = (o = {}) => (phase) => {
  const pose = withBody(stand({ stance: 11 }), (sk) => {
    const hand = (side) => add(shoulderOf(sk, side), [o.front ? 8 : 0, 50 - (o.front ? 2 : 0), sideSign(side) * (o.front ? 4 : 5)]);
    const pr = o.front ? 180 : 90;
    const extra = o.pinch ? { grip: 'flat' } : {};
    return arms(grab(hand('L'), [-1, 0, 0.2], pr, extra), grab(hand('R'), [-1, 0, -0.2], pr, extra));
  });
  return scene(pose, (sk) => {
    const sway = mix(0, 0.5, phase);
    if (o.pinch) return ['L', 'R'].map((side) => [E.plate(madd(fist(sk, side), [sk.arms[side].hand.palm, 2]), [0, 0, 1], 11), E.plate(madd(fist(sk, side), [sk.arms[side].hand.palm, -2 + sway]), [0, 0, 1], 11)]);
    if (o.front) return [E.barbell(fistMid(sk), { plateR: 15 }), ['L', 'R'].map((side) => E.rod(madd(fist(sk, side), [[0, 0, 1], -4]), madd(fist(sk, side), [[0, 0, 1], 4]), 3.4, { fill: E.DARK }))];
    return ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb, { r: 7 }));
  });
};

// Trabajo de mano con el antebrazo frente al cuerpo: handgrip, pelota, banda en los dedos, cubo de arroz.
const handWork = (o = {}) => (phase) => {
  const grips = { gripper: ['open', 'fist', 'open'], ball: ['open', 'fist', 'open'], band: ['fist', 'spread', 'fist'], rice: ['spread', 'fist', 'spread'] }[o.mode];
  const g = grips[phase < 0.25 ? 0 : phase < 0.75 ? 1 : 2];
  const base = o.mode === 'rice' ? stand({ pitch: 30, drop: 6 }) : stand();
  const pose = o.mode === 'rice'
    ? { ...base, armL: { e: 30, p: 10, b: 10 }, armR: { e: 30, p: 10, b: 10 }, handL: { pr: 90, grip: g, flex: mix(-20, 20, phase) }, handR: { pr: 90, grip: g, flex: mix(-20, 20, phase) } }
    : { ...base, armL: { e: 18, p: 10, b: 95, r: -10 }, handL: { pr: 70, grip: g }, armR: sideArm.arm, handR: sideArm.hand };
  return scene(pose, (sk) => {
    const h = sk.arms.L.hand;
    const center = madd(h.wrist, [h.dir, 5.5], [h.palm, 2]);
    if (o.mode === 'gripper') {
      const open = g === 'open' ? 1 : 0.35;
      return [E.rod(madd(center, [h.palm, -1]), madd(center, [h.palm, -1], [h.dir, 9]), 1.2, { fill: E.FRAME }), E.rod(madd(center, [h.palm, 3]), madd(center, [h.palm, 3 + 4 * open], [h.dir, 9]), 1.2, { fill: E.FRAME })];
    }
    if (o.mode === 'ball') return E.sphere(madd(center, [h.palm, 1.5]), g === 'open' ? 3.6 : 2.6);
    if (o.mode === 'band') return E.polyline(Array.from({ length: 9 }, (_, index) => madd(h.wrist, [h.dir, 12], [h.thumb, ((index - 4) / 4) * (g === 'spread' ? 6 : 3.6)], [h.palm, Math.cos(((index - 4) / 4) * Math.PI) * 0.5])), { color: E.GEAR, width: 1.6 });
    const bucket = [sk.arms.L.hand.wrist[0] + 2, FLOOR_Y, 0];
    return [E.aabb([bucket[0] - 14, FLOOR_Y - 40, -26], [bucket[0] + 14, FLOOR_Y, 26], { fill: E.FRAME, opacity: 0.35, bias: 20 }), E.line([bucket[0] - 14, FLOOR_Y - 36, -26], [bucket[0] + 14, FLOOR_Y - 36, 26], { color: E.GEAR, width: 1, opacity: 0.6 })];
  });
};

export const ARM_FIGURES = {
  // Bíceps
  'CURL CON BARRA': { build: curl({ gear: 'barbell' }) },
  'CURL CON BARRA W': { build: curl({ gear: 'ez' }), view: 'front' },
  'CURL 21': { build: curl({ gear: 'barbell', order: true }) },
  'CURL CON MANCUERNAS': { build: curl({ gear: 'dumbbell' }), view: 'front' },
  'CURL ALTERNADO CON MANCUERNAS': { build: curl({ gear: 'dumbbell', alternate: true }), view: 'front' },
  'CURL MARTILLO': { build: curl({ gear: 'dumbbell', pr: 90 }), view: 'front' },
  'CURL MARTILLO CRUZADO': { build: curl({ gear: 'dumbbell', pr: 90, cross: true }), view: 'front' },
  'CURL ZOTTMAN': { build: curl({ gear: 'dumbbell', zottman: true }), view: 'front' },
  'CURL MARTILLO CON SOGA': { build: curl({ gear: 'rope', pr: 90 }) },
  'CURL POLEA': { build: curl({ gear: 'cableBar' }) },
  'CURL INVERTIDO': { build: curl({ gear: 'barbell', pr: 180 }) },
  'CURL INVERTIDO EN POLEA': { build: curl({ gear: 'cableBar', pr: 180 }) },
  'CURL DRAG': { build: dragCurl },
  'CURL SCOTT': { build: preacher({}) },
  'CURL SCOTT CON MANCUERNA': { build: preacher({ gear: 'dumbbell', single: true }) },
  'CURL SCOTT EN MAQUINA': { build: preacher({ gear: 'machine' }) },
  'CURL EN MAQUINA': { build: machineCurl },
  'CURL CONCENTRADO': { build: concentrationCurl, view: 'front' },
  'CURL BICEPS INCLINADO': { build: inclineCurl },
  'CURL ARAÑA': { build: spiderCurl },
  'CURL BAYESIANO': { build: bayesianCurl },
  'CURL EN POLEA ALTA': { build: highCableCurl, view: 'front' },
  'CURL DE BICEPS EN TRX': { build: trxCurl },
  'CURL ACOSTADO EN POLEA': { build: lyingCableCurl },
  'CURL WAITER': { build: waiterCurl },
  // Tríceps
  'EXTENSION DE TRICEPS EN POLEA': { build: pushdown({ handle: 'bar' }) },
  'EXTENSION DE TRICEPS CON SOGA': { build: pushdown({ handle: 'rope' }), view: 'front' },
  'EXTENSION DE TRICEPS CON BARRA V': { build: pushdown({ handle: 'v' }) },
  'EXTENSION DE TRICEPS AGARRE INVERTIDO': { build: pushdown({ handle: 'reverse' }) },
  'EXTENSION UNILATERAL EN POLEA': { build: pushdown({ handle: 'single' }) },
  'EXTENSION CRUZADA EN POLEA': { build: pushdown({ handle: 'cross' }), view: 'front' },
  'EXTENSION DE TRICEPS CON MANCUERNA': { build: overheadExtension({ gear: 'dumbbell1' }) },
  'TRICEPS COPA': { build: overheadExtension({ gear: 'copa' }) },
  'TRICEPS TRAS NUCA EN POLEA': { build: overheadExtension({ gear: 'rope' }) },
  'PRESS FRANCES SENTADO CON BARRA W': { build: overheadExtension({ gear: 'ez' }) },
  'PRESS FRANCES': { build: lyingExtension({ gear: 'ez' }) },
  'PRESS FRANCES CON MANCUERNAS': { build: lyingExtension({ gear: 'dumbbell' }) },
  'PRESS FRANCES EN POLEA': { build: lyingExtension({ gear: 'cable' }) },
  'JM PRESS': { build: lyingExtension({ gear: 'jm' }) },
  'PRESS TATE': { build: lyingExtension({ gear: 'tate' }), view: 'front' },
  'PATADA DE TRICEPS': { build: kickback({}) },
  'PATADA DE TRICEPS EN POLEA': { build: kickback({ gear: 'cable' }) },
  'FONDOS EN PARALELAS': { build: dips({ leanTop: 2, leanBottom: 6, flare: 0.15, back: 12, kneeBend: 70 }) },
  'FONDOS EN ANILLAS': { build: dips({ leanTop: 4, leanBottom: 10, flare: 0.2, gear: 'rings', kneeBend: 20, legsForward: 25 }), view: 'front' },
  'FONDOS EN BARRA RECTA': { build: dips({ leanTop: 10, leanBottom: 24, flare: 0.5, gear: 'bar', half: 12, back: 4 }) },
  'FONDOS EN MAQUINA': { build: assistedDipMachine },
  'FONDOS SENTADO EN MAQUINA': { build: seatedDipMachine },
  'FONDOS EN BANCO': { build: benchDips },
  'EXTENSION DE TRICEPS EN MAQUINA': { build: tricepsMachine },
  // Antebrazos y mano
  'CURL DE MUÑECA': { build: wristWork({ pr: 0 }), focus: HANDS_FOCUS },
  'CURL DE MUÑECA INVERTIDO': { build: wristWork({ pr: 180, from: 50, to: -50 }), focus: HANDS_FOCUS },
  'CURL DE MUÑECA CON MANCUERNA': { build: wristWork({ pr: 0, gear: 'dumbbell', single: true }), focus: HANDS_FOCUS },
  'EXTENSION DE MUÑECA CON MANCUERNA': { build: wristWork({ pr: 180, gear: 'dumbbell', single: true, from: 50, to: -50 }), focus: HANDS_FOCUS },
  'CURL DE MUÑECA EN POLEA': { build: wristWork({ pr: 0, gear: 'cable', from: -45, to: 60 }), focus: HANDS_FOCUS },
  'CURL DE DEDOS CON BARRA': { build: wristWork({ pr: 0, fingers: true }), focus: HANDS_FOCUS },
  'CURL DE MUÑECA TRAS LA ESPALDA': { build: behindBackWrist, focus: [...HANDS_FOCUS, 'upperArmL', 'upperArmR'] },
  'PRONOSUPINACION CON MANCUERNA': { build: forearmTilt({ mode: 'rotate', seatedForearm: true }), focus: HANDS_FOCUS, view: 'front' },
  'DESVIACION RADIAL CON MANCUERNA': { build: forearmTilt({ mode: 'radial' }), focus: [...HANDS_FOCUS, 'upperArmL'] },
  'DESVIACION CUBITAL CON MANCUERNA': { build: forearmTilt({ mode: 'ulnar' }), focus: [...HANDS_FOCUS, 'upperArmL'] },
  'RODILLO DE MUÑECA': { build: wristRoller },
  'COLGADO EN BARRA': { build: hang({}), view: 'front' },
  'COLGADO CON TOALLA': { build: hang({ towel: true }), view: 'front' },
  'COLGADO A UNA MANO': { build: hang({ single: true }), view: 'front' },
  'AGARRE ESTATICO CON MANCUERNAS': { build: staticHold({}), view: 'front' },
  'AGARRE DE BARRA GRUESA': { build: staticHold({ front: true }), view: 'front' },
  'PINZA CON DISCOS': { build: staticHold({ pinch: true }), view: 'front' },
  'HAND GRIP': { build: handWork({ mode: 'gripper' }), focus: ['forearmL', 'handL'] },
  'APRETAR PELOTA': { build: handWork({ mode: 'ball' }), focus: ['forearmL', 'handL'] },
  'EXTENSION DE DEDOS CON BANDA': { build: handWork({ mode: 'band' }), focus: ['forearmL', 'handL'], view: 'front' },
  'CUBO DE ARROZ': { build: handWork({ mode: 'rice' }) },
};
