import * as E from '../../utils/figure/equipment';
import { add, ANKLE_Y, arms, BENCH_TOP, BODY, chestPoint, fist, fistMid, FLOOR_Y, grab, lerp, madd, mix, norm, palmDown, pelvisFromShoulders, scale, scene, shoulderOf, sideSign, STAND_HIP_Y, sub, track, withBody } from './common';
import { seated, splitStance } from './setups';

/*
 * Espalda: pesos muertos, jalones, dominadas, remos, extensiones lumbares y encogimientos.
 * Bisagras: la barra sube en vertical sobre el medio pie y los brazos cuelgan rectos (hombros apenas por delante).
 */

const ARM_HANG = 51.5; // hombro → centro del puño con el brazo estirado
const crossedArms = (sk) => arms(
  grab(chestPoint(sk, 40, 10, -9), [0.2, 1, 1], 170, { grip: 'flat' }),
  grab(chestPoint(sk, 38, 11.5, 9), [0.2, 1, -1], 170, { grip: 'flat' }),
);

// Piernas con los pies fijos en el piso (o sobre una plataforma).
const planted = ({ x = 0, stance = 11, toeOut = 10, kneeOut = 0.3, footY = ANKLE_Y } = {}) => ({
  legL: { to: [x, footY, stance], pole: [1, -0.15, kneeOut] },
  legR: { to: [x, footY, -stance], pole: [1, -0.15, -kneeOut] },
  footL: { flat: true, out: toeOut },
  footR: { flat: true, out: toeOut },
});

/*
 * Peso muerto y variantes. Fase 0 = abajo (implemento en el piso o en los soportes), 1 = de pie bloqueado.
 * o.gear: 'barbell' | 'trap' | 'dumbbell' | 'kettlebell'; o.startY = altura del agarre al inicio; o.pitch0 = inclinación inicial.
 */
const deadlift = (o = {}) => (phase) => {
  const footY = ANKLE_Y - (o.platform ?? 0);
  const barX = o.barX ?? 3;
  const startY = o.startY ?? FLOOR_Y - 19;
  const endY = STAND_HIP_Y + 0.6 - BODY.pelvisLen - BODY.chestLen + ARM_HANG;
  const pitch = track(phase, [[0, o.pitch0 ?? 56], [0.5, (o.pitch0 ?? 56) * 0.72], [1, 0]]);
  const barY = mix(startY, endY, phase);
  const S = [barX + mix(3, -1, phase), barY - ARM_HANG, 0];
  const pose = {
    pelvis: { at: pelvisFromShoulders(S, pitch), pitch },
    ...planted({ stance: o.stance ?? 11, toeOut: o.toeOut ?? 10, kneeOut: o.kneeOut ?? 0.3, footY }),
    neck: { flex: -pitch * 0.25 },
  };
  const grip = o.grip ?? 23;
  const pr = o.pr ?? 180;
  const pole = (side) => [-1, -0.1, sideSign(side) * 0.15];
  Object.assign(pose, arms(grab([barX, barY, grip], pole('L'), pr), grab([barX, barY, -grip], pole('R'), pr)));
  return scene(pose, (sk) => {
    const items = [];
    if (o.platform) items.push(E.aabb([-14, FLOOR_Y - o.platform, -30], [26, FLOOR_Y, 30], { fill: E.FRAME, bias: -10, opacity: 0.8 }));
    if (o.gear === 'trap') items.push(E.trapBar(fistMid(sk), { plateR: 19 }));
    else if (o.gear === 'dumbbell') ['L', 'R'].forEach((side) => items.push(E.dumbbell(fist(sk, side), [1, 0, 0])));
    else if (o.gear === 'kettlebell') items.push(E.kettlebell(fistMid(sk), { across: [0, 0, 1] }));
    else items.push(E.barbell(fistMid(sk)));
    if (o.pins) items.push(E.rack(barX - 4, FLOOR_Y - 50 + 2), [-1, 1].map((s) => E.rod([barX - 12, FLOOR_Y - 47, s * 50], [barX + 12, FLOOR_Y - 47, s * 50], 1.2)));
    return items;
  });
};

// Buenos días: barra en la espalda alta, rodillas apenas flexionadas y bisagra hasta casi la horizontal.
const goodMorning = (phase) => {
  const pitch = mix(2, 78, phase);
  const pose = withBody({ pelvis: { at: [mix(0, -14, phase), STAND_HIP_Y + mix(1, 4, phase), 0], pitch }, ...planted({ stance: 12 }), neck: { flex: -pitch * 0.3 } }, (sk) => {
    const bar = chestPoint(sk, 46, -7.5);
    return arms(grab(add(bar, [0, 0, 30]), [-0.2, 1, 0.7], 100), grab(add(bar, [0, 0, -30]), [-0.2, 1, -0.7], 100));
  });
  return scene(pose, (sk) => E.barbell(fistMid(sk)));
};

/*
 * Remos inclinados con barra/mancuernas/kettlebells. o.pitch = inclinación del tronco, o.to = altura del tronco a la que llega
 * el agarre (20 = ombligo, 34 = pecho), o.pr, o.grip, o.smith, o.floor (Pendlay: la barra vuelve al piso).
 */
const bentRow = (o = {}) => (phase) => {
  const pitch = o.pitch ?? 45;
  const base = { pelvis: { at: [o.hipX ?? -16, STAND_HIP_Y + (o.drop ?? 9), 0], pitch }, ...planted({ stance: o.stance ?? 12, kneeOut: 0.25 }), neck: { flex: -pitch * 0.35 } };
  const pose = withBody(base, (sk) => {
    const hand = (side) => {
      const sh = shoulderOf(sk, side);
      const z = sideSign(side) * (o.grip ?? 22);
      const hangY = o.floor ? FLOOR_Y - 19 : sh[1] + ARM_HANG - 1;
      const low = [sh[0] + 2, hangY, z];
      const high = chestPoint(sk, o.to ?? 22, 13, z);
      return lerp(low, high, phase);
    };
    const pole = (side) => [-0.7, -0.7, sideSign(side) * (o.flare ?? 0.35)];
    return arms(grab(hand('L'), pole('L'), o.pr ?? 180), grab(hand('R'), pole('R'), o.pr ?? 180));
  });
  return scene(pose, (sk) => {
    const items = [E.barbell(fistMid(sk))];
    if (o.smith) items.push(E.smithRails(fistMid(sk)[0] - 2));
    return items;
  });
};

// Remo en T (landmine con triángulo): pivote en el piso detrás, discos adelante.
const tBarRow = (phase) => {
  const pitch = 50;
  const pose = withBody({ pelvis: { at: [-14, STAND_HIP_Y + 10, 0], pitch }, ...planted({ stance: 15, kneeOut: 0.4 }), neck: { flex: -15 } }, (sk) => {
    const sh = lerp(shoulderOf(sk, 'L'), shoulderOf(sk, 'R'), 0.5);
    const grip = lerp([sh[0] + 3, sh[1] + ARM_HANG - 1, 0], chestPoint(sk, 24, 14), phase);
    return arms(grab(add(grip, [0, 0, 3.5]), [-0.8, -0.6, 0.3], 90), grab(add(grip, [0, 0, -3.5]), [-0.8, -0.6, -0.3], 90));
  });
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    const pivot = [-90, FLOOR_Y - 2, 0];
    const dir = norm(sub(h, pivot));
    const end = madd(h, [dir, 14]);
    return [E.rod(pivot, end, 1.6, { fill: E.FRAME }), E.loadedPlate(madd(h, [dir, 8]), dir, 11), E.handle('v', h, [0, 0, 1], { down: [0, -1, 0] }), E.sphere(pivot, 3, { fill: E.FRAME })];
  });
};

// Remo a un brazo con rodilla y mano apoyadas en el banco.
const oneArmRow = (o = {}) => (phase) => {
  const benchTop = BENCH_TOP;
  const pitch = o.pitch ?? 84;
  const P = [-22, benchTop - BODY.thigh - 4.5, 0];
  const base = {
    pelvis: { at: P, pitch },
    legR: { e: 90 - (90 - pitch), p: 0, b: 92 }, footR: { plantar: 30 },
    legL: { to: [P[0] + 4, ANKLE_Y, 24], pole: [1, -0.1, 0.2] }, footL: { flat: true, out: 6 },
    neck: { flex: -30 },
  };
  const pose = withBody(base, (sk) => {
    const shL = shoulderOf(sk, 'L');
    const shR = shoulderOf(sk, 'R');
    const low = [shL[0] + 2, shL[1] + ARM_HANG - 2, shL[2] + 2];
    const high = chestPoint(sk, 8, 4, 18);
    return arms(grab(lerp(low, high, phase), [-0.6, -0.9, 0.2], 90), palmDown([shR[0] + 3, benchTop - 2.6, shR[2] + 2], [-0.6, -0.3, -0.6], 100));
  });
  return scene(pose, (sk) => [E.flatBench(-58, 30, benchTop, { z: -10 }), E.dumbbell(fist(sk, 'L'), [1, 0, 0], { r: 7 })]);
};

// Remo Kroc: de pie con un pie adelante, mano libre apoyada, mancuerna pesada con más recorrido.
const krocRow = (phase) => {
  const pose = withBody({ pelvis: { at: [-12, STAND_HIP_Y + 8, 0], pitch: 62 }, legR: { to: [16, ANKLE_Y, -12], pole: [1, -0.2, -0.2] }, legL: { to: [-26, ANKLE_Y, 12], pole: [1, 0, 0.2] }, footR: { flat: true }, footL: { flat: true, out: 14 }, neck: { flex: -20 } }, (sk) => {
    const shL = shoulderOf(sk, 'L');
    const low = [shL[0] + 4, shL[1] + ARM_HANG - 1, shL[2]];
    const high = chestPoint(sk, 10, 3, 19);
    return arms(grab(lerp(low, high, phase), [-0.5, -1, 0.2], 90), palmDown([shoulderOf(sk, 'R')[0] + 8, FLOOR_Y - 62, -16], [-0.6, -0.3, -0.5], 100));
  });
  return scene(pose, (sk) => [E.aabb([sk.arms.R.hand.wrist[0] - 10, FLOOR_Y - 60, -28], [sk.arms.R.hand.wrist[0] + 14, FLOOR_Y, -6], { fill: E.FRAME, bias: -10, opacity: 0.8 }), E.dumbbell(fist(sk, 'L'), [1, 0, 0], { r: 8 })]);
};

// Remo Meadows: landmine perpendicular al cuerpo, agarre prono en la punta de la barra.
const meadowsRow = (phase) => {
  const pose = withBody({ pelvis: { at: [-12, STAND_HIP_Y + 9, 0], pitch: 55 }, legR: { to: [12, ANKLE_Y, -14], pole: [1, -0.2, -0.3] }, legL: { to: [-24, ANKLE_Y, 12], pole: [1, 0, 0.2] }, footR: { flat: true }, footL: { flat: true, out: 12 }, neck: { flex: -15 } }, (sk) => {
    const shL = shoulderOf(sk, 'L');
    const low = [shL[0] + 6, shL[1] + ARM_HANG - 2, shL[2] + 4];
    const high = chestPoint(sk, 16, 6, 20);
    return arms(grab(lerp(low, high, phase), [-0.6, -1, 0.3], 170), { arm: { e: 40, p: 30, b: 40 }, hand: { pr: 90, grip: 'open' } });
  });
  return scene(pose, (sk) => {
    const h = fist(sk, 'L');
    const pivot = [h[0] + 4, FLOOR_Y - 2, -90];
    const dir = norm(sub(h, pivot));
    return [E.rod(pivot, madd(h, [dir, 8]), 1.5, { fill: E.FRAME }), E.loadedPlate(madd(h, [dir, -6]), dir, 12), E.sphere(pivot, 3, { fill: E.FRAME })];
  });
};

// Remo gorila: piernas abiertas, dos kettlebells en el piso, remo alternado.
const gorillaRow = (phase) => {
  const pose = withBody({ pelvis: { at: [-16, STAND_HIP_Y + 16, 0], pitch: 70 }, ...planted({ stance: 24, toeOut: 20, kneeOut: 0.8 }), neck: { flex: -25 } }, (sk) => {
    const hand = (side, up) => {
      const sh = shoulderOf(sk, side);
      const low = [sh[0] + 2, FLOOR_Y - 13, sideSign(side) * 10];
      return lerp(low, chestPoint(sk, 10, 5, sideSign(side) * 17), up);
    };
    const upL = phase <= 0.5 ? phase * 2 : 2 - phase * 2;
    const upR = phase <= 0.5 ? 0 : (phase - 0.5) * 2;
    return arms(grab(hand('L', upL), [-0.5, -1, 0.3], 90), grab(hand('R', upR), [-0.5, -1, -0.3], 90));
  });
  return scene(pose, (sk) => ['L', 'R'].map((side) => E.kettlebell(fist(sk, side), { across: [1, 0, 0] })));
};

// Remo boca abajo sobre banco (seal alto o inclinado con mancuernas) y máquina con apoyo de pecho.
const proneRow = (o = {}) => (phase) => {
  const angle = o.angle ?? 0; // inclinación del apoyo sobre la horizontal
  const pitch = 90 - angle;
  const padTop = o.padY ?? FLOOR_Y - 72;
  const P = o.hip ?? [-16, padTop - BODY.chestFront + 1.5, 0];
  const base = { pelvis: { at: P, pitch }, neck: { flex: -20 } };
  if (o.feet === 'floor') Object.assign(base, planted({ x: P[0] - 22, stance: 13, kneeOut: 0.4 }));
  else Object.assign(base, { legL: { e: 0, p: 0, b: 0 }, legR: { e: 0, p: 0, b: 0 }, footL: { plantar: 20 }, footR: { plantar: 20 } });
  const pose = withBody(base, (sk) => {
    const hand = (side) => {
      const sh = shoulderOf(sk, side);
      const low = [sh[0] + 2, sh[1] + ARM_HANG - 1, sideSign(side) * (o.grip ?? 22)];
      const high = chestPoint(sk, o.to ?? 30, -1, sideSign(side) * (o.grip ?? 22));
      return lerp(low, high, phase);
    };
    const pole = (side) => [-0.6, -1, sideSign(side) * (o.flare ?? 0.4)];
    return arms(grab(hand('L'), pole('L'), o.pr ?? 180), grab(hand('R'), pole('R'), o.pr ?? 180));
  });
  return scene(pose, (sk) => {
    const items = [E.slantPad(chestPoint(sk, -12, -BODY.chestFront - 0.5), chestPoint(sk, 46, -BODY.chestFront - 0.5), scale(sk.pelvis.basis.fwd, -1), { halfW: 12 })];
    const padLow = chestPoint(sk, 8, -BODY.chestFront - 6);
    items.push(E.post([padLow[0], padLow[1] + 2, 0], { r: 2 }));
    if (o.gear === 'dumbbell') ['L', 'R'].forEach((side) => items.push(E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb)));
    else if (o.gear === 'machine') ['L', 'R'].forEach((side) => items.push(E.lever(add(shoulderOf(sk, side), [-6, 60, 0]), fist(sk, side)), E.handle('D', fist(sk, side), sk.arms[side].hand.thumb)));
    else items.push(E.barbell(fistMid(sk), { plateR: 15 }));
    if (o.gear === 'machine') items.push(E.disc(add(shoulderOf(sk, 'L'), [-6, 60, 22]), [0, 0, 1], 12, 3), E.aabb([P[0] - 40, FLOOR_Y - 8, -16], [P[0] - 14, FLOOR_Y, 16], { fill: E.FRAME, bias: -10 }));
    return items;
  });
};

// Remo con barra en plancha / renegado: plancha alta sobre dos mancuernas, rema un brazo.
const renegadeRow = (phase) => {
  const shoulderH = 50;
  const toeX = -62;
  const legLen = BODY.thigh + BODY.shin + 4;
  const bodyLen = 44 + legLen;
  const supportY = FLOOR_Y - 12;
  const angle = Math.asin((supportY - (FLOOR_Y - shoulderH - 6)) / bodyLen);
  const hip = [toeX + legLen * Math.cos(angle), supportY - legLen * Math.sin(angle), 0];
  const pitch = 90 - (angle * 180) / Math.PI;
  const shX = hip[0] + 44 * Math.cos(angle);
  const pose = withBody({ pelvis: { at: hip, pitch, roll: mix(0, -8, phase) }, legL: { e: 0, p: 14 }, legR: { e: 0, p: 14 }, footL: { plantar: -20 }, footR: { plantar: -20 }, neck: { flex: -15 } }, (sk) => {
    const support = [shX + 2, FLOOR_Y - 7, 18];
    const lift = lerp([shX + 2, FLOOR_Y - 7, -18], chestPoint(sk, 16, 2, -18), phase);
    return arms(grab(support, [-0.7, -0.3, 0.6], 90), grab(lift, [-0.6, -1, -0.3], 90));
  });
  return scene(pose, (sk) => ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), [1, 0, 0], { r: 6.5 })));
};

// Sentado en polea baja (remo bajo): pies en la plataforma, cable desde abajo al frente.
const seatedCableRow = (o = {}) => (phase) => {
  const seatY = FLOOR_Y - 18;
  const pitch = mix(o.lean0 ?? 18, -6, phase);
  const P = [0, seatY - 9, 0];
  const feet = [44, FLOOR_Y - 20];
  const base = {
    pelvis: { at: P, pitch },
    legL: { to: [feet[0], feet[1], 10], pole: [0.3, -1, 0.2] }, legR: { to: [feet[0], feet[1], -10], pole: [0.3, -1, -0.2] },
    footL: { dir: [0.35, -1, 0] }, footR: { dir: [0.35, -1, 0] },
    neck: { flex: -pitch * 0.4 },
  };
  const pose = withBody(base, (sk) => {
    const z = o.wide ? 24 : 3.5;
    const reach = chestPoint(sk, 30, 14 + 36, 0);
    const end = chestPoint(sk, o.wide ? 34 : 22, 13, 0);
    const grip = lerp([reach[0], reach[1] + 6, 0], end, phase);
    const pole = (side) => [-1, -0.1, sideSign(side) * (o.wide ? 0.9 : 0.25)];
    return arms(grab(add(grip, [0, 0, z]), pole('L'), o.wide ? 180 : 90), grab(add(grip, [0, 0, -z]), pole('R'), o.wide ? 180 : 90));
  });
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    const pulley = [feet[0] + 14, FLOOR_Y - 30, 0];
    return [E.pad([-18, seatY, 0], [30, seatY, 0], 12, 5), E.post([6, seatY + 5, 0], { r: 2 }), E.aabb([feet[0] + 4, FLOOR_Y - 34, -16], [feet[0] + 8, FLOOR_Y, 16], { fill: E.FRAME, bias: -6 }), E.cableColumn(pulley[0] + 6, 0, pulley[1]), E.cable(pulley, h), E.handle(o.wide ? 'bar' : 'v', h, [0, 0, 1], { half: 26, down: [1, 0, 0] })];
  });
};

// Remo a una mano en polea de pie: polea a media altura, paso adelante y leve rotación.
const standingCableRow = (phase) => {
  const pose = withBody({ ...splitStance({ hinge: 18, drop: 4, front: 14, back: -18 }), spine: { twist: mix(10, -14, phase) } }, (sk) => {
    const shR = shoulderOf(sk, 'R');
    const reach = add(shR, [44, 10, 4]);
    const end = chestPoint(sk, 22, 6, -20);
    return arms({ arm: { e: 10, p: 20, b: 80 }, hand: { pr: 90, grip: 'open' } }, grab(lerp(reach, end, phase), [-1, -0.2, -0.4], 90));
  });
  return scene(pose, (sk) => {
    const pulley = [80, FLOOR_Y - 92, -16];
    return [E.cableColumn(pulley[0] + 5, pulley[2], pulley[1]), E.cable(pulley, fist(sk, 'R')), E.handle('D', fist(sk, 'R'), sk.arms.R.hand.thumb)];
  });
};

// Máquina de remo sentado (con apoyo de pecho) o remo alto (tira de arriba hacia abajo).
const machineRow = (o = {}) => (phase) => {
  const setup = seated({ lean: o.lean ?? -6, seatY: FLOOR_Y - 46, back: false });
  const pose = withBody(setup.pose, (sk) => {
    const hand = (side) => {
      const sh = shoulderOf(sk, side);
      const reach = add(sh, o.reach ?? [46, 6, sideSign(side) * 4]);
      const end = o.high ? chestPoint(sk, 36, 6, sideSign(side) * 22) : chestPoint(sk, 30, 4, sideSign(side) * 21);
      return lerp(reach, end, phase);
    };
    const pole = (side) => [-1, o.high ? 0.6 : -0.1, sideSign(side) * 0.5];
    return arms(grab(hand('L'), pole('L'), o.pr ?? 90), grab(hand('R'), pole('R'), o.pr ?? 90));
  });
  return scene(pose, (sk) => {
    const items = [setup.props(sk)];
    if (!o.high) items.push(E.slantPad(chestPoint(sk, 18, 12), chestPoint(sk, 44, 12), [-1, 0, 0], { halfW: 11, bias: -2 }));
    ['L', 'R'].forEach((side) => {
      const h = fist(sk, side);
      const pivot = o.high ? add(h, [8, -30, 0]) : [h[0] + 12, FLOOR_Y - 20, h[2]];
      items.push(E.lever(o.high ? add(shoulderOf(sk, side), [26, -46, 0]) : pivot, h), E.handle('D', h, sk.arms[side].hand.thumb));
    });
    items.push(o.high ? E.loadedPlate(add(shoulderOf(sk, 'L'), [22, -42, 14]), [0, 0, 1], 9) : E.weightStack(sk.pelvis.o[0] + 70, 0));
    return items;
  });
};

// Jalón en polea alta (sentado con las rodillas bajo el rodillo). o.grip, o.pr, o.behind, o.handle, o.single, o.machine.
const pulldown = (o = {}) => (phase) => {
  const setup = seated({ lean: mix(4, o.behind ? -2 : 14, phase) * 1, seatY: FLOOR_Y - 48, back: false, footX: 30 });
  const pose = withBody({ ...setup.pose, neck: { flex: o.behind ? mix(0, 25, phase) : mix(-10, -14, phase) } }, (sk) => {
    const hand = (side) => {
      const sh = shoulderOf(sk, side);
      const z = sideSign(side) * (o.grip ?? 34);
      const top = [sh[0] + 6, sh[1] - 48, z];
      const bottom = o.behind ? chestPoint(sk, 48, -11, z) : chestPoint(sk, o.to ?? 39, 13, z);
      return lerp(top, bottom, phase);
    };
    const pole = (side) => [o.behind ? 0.2 : -0.5, 1, sideSign(side) * (o.flare ?? 1)];
    if (o.single) return arms({ arm: { e: 20, p: 40, b: 80 }, hand: { pr: 90, grip: 'open' } }, grab(hand('R'), pole('R'), 90));
    return arms(grab(hand('L'), pole('L'), o.pr ?? 90), grab(hand('R'), pole('R'), o.pr ?? 90));
  });
  return scene(pose, (sk) => {
    const h = o.single ? fist(sk, 'R') : fistMid(sk);
    const items = [setup.props(sk), E.roller([sk.legs.L.mid[0] - 2, sk.legs.L.mid[1] - 8, 0], { half: 14, r: 3.6 })];
    const pulley = [sk.pelvis.o[0] + 12, FLOOR_Y - 214, 0];
    if (o.machine) {
      ['L', 'R'].forEach((side) => items.push(E.lever(add(shoulderOf(sk, side), [-14, -54, 0]), fist(sk, side)), E.handle('D', fist(sk, side), sk.arms[side].hand.thumb)));
      items.push(E.loadedPlate(add(shoulderOf(sk, 'L'), [-14, -54, 14]), [0, 0, 1], 9));
    } else {
      items.push(E.cable(pulley, h), E.cableColumn(pulley[0] + 18, 0, pulley[1]));
      items.push(E.handle(o.handle ?? 'bar', h, [0, 0, 1], { half: o.grip ? o.grip + 8 : 42, down: [0, 1, 0] }));
      items.push(E.frame([[pulley[0] + 18, pulley[1], 0], [pulley[0], pulley[1], 0]]));
    }
    return items;
  });
};

// Jalón con brazos rectos (de pie, bisagra leve): de la altura de la cabeza a los muslos.
const straightArmPulldown = (phase) => {
  const pose = withBody({ pelvis: { at: [-8, STAND_HIP_Y + 5, 0], pitch: 28 }, ...planted({ stance: 11 }), neck: { flex: -10 } }, (sk) => {
    const hand = (side) => {
      const sh = shoulderOf(sk, side);
      const theta = mix(118, 12, phase) * (Math.PI / 180);
      return [sh[0] + Math.sin(theta) * 49, sh[1] + Math.cos(theta) * 49 * -1 * -1, sideSign(side) * 15];
    };
    return arms(grab(hand('L'), [-0.4, 1, 0.5], 180), grab(hand('R'), [-0.4, 1, -0.5], 180));
  });
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    const pulley = [64, FLOOR_Y - 196, 0];
    return [E.cable(pulley, h), E.cableColumn(pulley[0] + 6, 0, pulley[1]), E.handle('bar', h, [0, 0, 1], { half: 22 })];
  });
};

/*
 * Colgado de la barra fija. o.grip (z), o.pr, o.drop0/drop1 (distancia vertical barra→hombros al inicio y al final),
 * o.lean (inclinación), o.shift (arqueras), o.extra (lastre: 'belt' | 'band' | 'machine'), o.legs.
 */
const BAR_Y = FLOOR_Y - 210;
export const hangPull = (o = {}) => (phase) => {
  const drop = mix(o.drop0 ?? 49, o.drop1 ?? 16, phase);
  const pitch = mix(o.lean0 ?? -3, o.lean1 ?? -12, phase);
  const shift = o.shift ? mix(0, o.shift, phase) : 0;
  const S = [-3, BAR_Y + drop, shift];
  const pose = {
    pelvis: { at: pelvisFromShoulders(S, pitch), pitch },
    shoulders: { L: { elev: o.elev ? mix(o.elev[0], o.elev[1], phase) : mix(3, -1, phase) }, R: { elev: o.elev ? mix(o.elev[0], o.elev[1], phase) : mix(3, -1, phase) } },
    legL: o.legs ?? { e: 14, p: 0, b: 55 }, legR: o.legs ?? { e: 18, p: 0, b: 70 },
    footL: { plantar: 25 }, footR: { plantar: 25 },
    neck: { flex: -8 },
  };
  if (o.extra === 'machine') Object.assign(pose, { legL: { e: 85, p: 0, b: 95 }, legR: { e: 85, p: 0, b: 95 } });
  const grip = o.grip ?? 30;
  const pole = (side) => [o.pr === 0 ? 0.6 : -0.3, 0.6, sideSign(side) * (o.pr === 0 ? 0.3 : 1)];
  Object.assign(pose, arms(grab([2, BAR_Y, grip], pole('L'), o.pr ?? 180), grab([2, BAR_Y, -grip], pole('R'), o.pr ?? 180)));
  return scene(pose, (sk) => {
    const items = [o.handles ? [E.rod([2, BAR_Y, 8], [2, BAR_Y, 22], 1.2), E.rod([2, BAR_Y, -8], [2, BAR_Y, -22], 1.2), E.pullUpBar(2, BAR_Y - 8, { half: 44 })] : E.pullUpBar(2, BAR_Y, { half: Math.max(44, grip + 10) })];
    if (o.extra === 'belt') {
      const front = chestPoint(sk, 2, 9);
      items.push(E.line(front, add(front, [6, 22, 0]), { color: E.FRAME, width: 1.2 }), E.plate(add(front, [6, 28, 0]), [1, 0, 0.3], 10));
    }
    if (o.extra === 'band') {
      const knee = lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5);
      items.push(E.band([2, BAR_Y, 6], add(knee, [2, 3, 0])), E.band([2, BAR_Y, -6], add(knee, [2, 3, 0])));
    }
    if (o.extra === 'machine') {
      const knee = lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5);
      items.push(E.pad(add(knee, [-14, 5, 0]), add(knee, [10, 5, 0]), 12, 4), E.lever(add(knee, [-40, 20, 0]), add(knee, [-14, 7, 0])), E.weightStack(-44, 0, { h: 150 }));
    }
    return items;
  });
};

// Front lever: de colgado a palanca agrupada y palanca completa (cuerpo horizontal con brazos estirados).
const frontLever = (phase) => {
  const pitch = track(phase, [[0, 0], [0.5, -88], [1, -90]]);
  const S = [mix(-3, -8, phase), BAR_Y + mix(49, 43, phase), 0];
  const legBend = track(phase, [[0, 0], [0.5, 120], [1, 0]]);
  const hipFlex = track(phase, [[0, 0], [0.5, 110], [1, 0]]);
  const pose = {
    pelvis: { at: pelvisFromShoulders(S, pitch), pitch },
    shoulders: { L: { elev: -2 }, R: { elev: -2 } },
    legL: { e: hipFlex, p: 0, b: legBend }, legR: { e: hipFlex, p: 0, b: legBend },
    footL: { plantar: 30 }, footR: { plantar: 30 },
    ...arms(grab([2, BAR_Y, 26], [-1, 0, 0.3], 180), grab([2, BAR_Y, -26], [-1, 0, -0.3], 180)),
  };
  return scene(pose, () => E.pullUpBar(2, BAR_Y, { half: 44 }));
};

// Remo invertido: talones en el piso, cuerpo recto bajo una barra. Fase 1 = pecho en la barra.
const invertedRow = (phase) => {
  const heel = [64, FLOOR_Y - 4];
  const legLen = BODY.thigh + BODY.shin + 3;
  const shoulderAt = (alpha) => [heel[0] - Math.cos(alpha) * (legLen + 44), heel[1] - Math.sin(alpha) * (legLen + 44)];
  const alphaEnd = 0.52;
  const sEnd = shoulderAt(alphaEnd);
  const bar = [sEnd[0] + 3, sEnd[1] - 15];
  // Inicio: ángulo menor con los brazos estirados (distancia hombro → barra = brazo extendido).
  let lo = 0.02;
  let hi = alphaEnd;
  for (let index = 0; index < 40; index += 1) {
    const mid = (lo + hi) / 2;
    const s0 = shoulderAt(mid);
    if (Math.hypot(s0[0] - bar[0], s0[1] - bar[1]) > ARM_HANG - 1.5) lo = mid; else hi = mid;
  }
  const alpha = mix((lo + hi) / 2, alphaEnd, phase);
  const hip = [heel[0] - Math.cos(alpha) * legLen, heel[1] - Math.sin(alpha) * legLen, 0];
  const pose = {
    pelvis: { at: hip, pitch: -(90 - (alpha * 180) / Math.PI) },
    legL: { e: 0, p: 2 }, legR: { e: 0, p: 2 }, footL: { plantar: -5 }, footR: { plantar: -5 },
    ...arms(grab([bar[0], bar[1], 27], [0.6, 1, 0.7], 90), grab([bar[0], bar[1], -27], [0.6, 1, -0.7], 90)),
  };
  return scene(pose, () => [E.rack(bar[0] - 3, bar[1] + 2), E.barbell([bar[0], bar[1], 0], { plateR: 0 })]);
};

// Extensiones lumbares. o.angle: 45 (banco romano) | 0 (horizontal, GHD). Fase 0 = abajo, 1 = cuerpo alineado.
const hyperextension = (o = {}) => (phase) => {
  const angle = o.angle ?? 45;
  const rad = (angle * Math.PI) / 180;
  const legLen = BODY.thigh + BODY.shin;
  // A 90° el tronco cuelga vertical: la máquina es más alta para que la cabeza no toque el piso.
  const hip = [0, FLOOR_Y - 44 - legLen * Math.sin(rad) * 0.62 - (angle < 30 ? 44 : 0), 0];
  const ankle = [hip[0] - Math.cos(rad) * legLen, hip[1] + Math.sin(rad) * legLen, 0];
  const bodyPitch = 90 - angle;
  const pitch = mix(bodyPitch + 80, bodyPitch, phase);
  const base = { pelvis: { at: hip, pitch }, legL: { to: [ankle[0], ankle[1], 9], pole: [Math.sin(rad), Math.cos(rad), 0] }, legR: { to: [ankle[0], ankle[1], -9], pole: [Math.sin(rad), Math.cos(rad), 0] }, footL: { dir: [-Math.sin(rad), -Math.cos(rad), 0] }, footR: { dir: [-Math.sin(rad), -Math.cos(rad), 0] }, neck: { flex: -10 } };
  const pose = withBody(base, (sk) => crossedArms(sk));
  return scene(pose, (sk) => {
    const thighFront = madd(lerp(sk.legs.L.root, sk.legs.L.mid, 0.25), [[Math.sin(rad), Math.cos(rad), 0], 7]);
    return [
      E.slantPad(madd(thighFront, [[-Math.cos(rad), Math.sin(rad), 0], 8]), madd(thighFront, [[Math.cos(rad), -Math.sin(rad), 0], 10]), [-Math.sin(rad), -Math.cos(rad), 0], { halfW: 13 }),
      E.roller(madd(sk.legs.L.end, [[-Math.sin(rad), -Math.cos(rad), 0], -5]), { half: 11 }),
      E.frame([[ankle[0] - 6, FLOOR_Y, 0], [ankle[0] - 2, ankle[1] + 6, 0], [thighFront[0] + 6, thighFront[1] + 8, 0], [thighFront[0] + 10, FLOOR_Y, 0]], { bias: -14 }),
    ];
  });
};

// Máquina de extensión lumbar sentado: rodillo en la espalda alta, del tronco inclinado a erguido.
const backExtensionMachine = (phase) => {
  const setup = seated({ lean: mix(34, -12, phase), seatY: FLOOR_Y - 46, back: false });
  const pose = withBody(setup.pose, (sk) => crossedArms(sk));
  return scene(pose, (sk) => [setup.props(sk), E.roller(chestPoint(sk, 34, -13), { half: 13 }), E.lever(add(sk.pelvis.o, [-8, 4, 0]), chestPoint(sk, 34, -14)), E.weightStack(sk.pelvis.o[0] - 40, 0)]);
};

// Superman: boca abajo en el piso, eleva brazos y piernas.
const superman = (phase) => {
  const pose = {
    pelvis: { at: [0, FLOOR_Y - 8.4 - phase * 1.5, 0], pitch: 90 },
    spine: { flex: mix(0, -18, phase) },
    neck: { flex: mix(-5, -10, phase) },
    legL: { e: mix(4, 22, phase), p: 180, b: 0 }, legR: { e: mix(4, 22, phase), p: 180, b: 0 },
    footL: { plantar: 40 }, footR: { plantar: 40 },
    armL: { e: mix(170, 172, phase), p: mix(20, 30, phase), b: 5 }, armR: { e: mix(170, 172, phase), p: mix(20, 30, phase), b: 5 },
    handL: { pr: 180, grip: 'flat' }, handR: { pr: 180, grip: 'flat' },
  };
  return scene(pose);
};

// Encogimientos: hombros arriba sin flexionar los codos. o.gear: 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'behind'.
const shrug = (o = {}) => (phase) => {
  const elev = mix(-2, 9, phase);
  const base = { pelvis: { at: [0, STAND_HIP_Y + 0.8, 0], pitch: o.gear === 'behind' ? 4 : 2 }, ...planted({ stance: 11 }), shoulders: { L: { elev }, R: { elev } } };
  const pose = withBody(base, (sk) => {
    const hand = (side) => {
      const sh = shoulderOf(sk, side);
      if (o.gear === 'dumbbell' || o.gear === 'machine') return [sh[0], sh[1] + ARM_HANG - 1, sideSign(side) * 21];
      if (o.gear === 'behind') return [sh[0] - 12, sh[1] + ARM_HANG - 3, sideSign(side) * 22];
      return [sh[0] + 9, sh[1] + ARM_HANG - 3, sideSign(side) * 22];
    };
    const pr = o.gear === 'dumbbell' || o.gear === 'machine' ? 90 : o.gear === 'behind' ? 0 : 180;
    const pole = (side) => [-1, 0, sideSign(side) * 0.3];
    return arms(grab(hand('L'), pole('L'), pr), grab(hand('R'), pole('R'), pr));
  });
  return scene(pose, (sk) => {
    if (o.gear === 'dumbbell') return ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), [1, 0, 0]));
    if (o.gear === 'machine') return [['L', 'R'].map((side) => [E.handle('D', fist(sk, side), [1, 0, 0]), E.lever(add(fist(sk, side), [-30, -4, 0]), fist(sk, side))]), E.weightStack(-36, 0)];
    if (o.gear === 'cable') {
      const h = fistMid(sk);
      return [E.cable([h[0] + 14, FLOOR_Y - 10, 0], h), E.cableColumn(h[0] + 20, 0, FLOOR_Y - 10), E.handle('bar', h, [0, 0, 1], { half: 24 })];
    }
    return E.barbell(fistMid(sk));
  });
};

// Pullover en máquina: codos contra los apoyos, de arriba de la cabeza hacia los costados del tronco.
const machinePullover = (phase) => {
  const setup = seated({ lean: 6, seatY: FLOOR_Y - 46 });
  const e = mix(165, 25, phase);
  const pose = { ...setup.pose, armL: { e, p: 12, b: 95, r: -20 }, armR: { e, p: 12, b: 95, r: -20 }, handL: { pr: 90, grip: 'fist' }, handR: { pr: 90, grip: 'fist' } };
  return scene(pose, (sk) => {
    const items = [setup.props(sk), E.weightStack(sk.pelvis.o[0] - 34, 0)];
    ['L', 'R'].forEach((side) => {
      const elbow = sk.arms[side].mid;
      const pivot = add(shoulderOf(sk, side), [0, 0, sideSign(side) * 10]);
      items.push(E.lever(pivot, add(elbow, [0, 0, sideSign(side) * 5])), E.roller(add(elbow, [0, 0, sideSign(side) * 5]), { axis: norm(sub(elbow, sk.arms[side].root)), half: 5, r: 3 }));
    });
    items.push(E.handle('bar', fistMid(sk), [0, 0, 1], { half: 22 }));
    return items;
  });
};

export const BACK_FIGURES = {
  'PESO MUERTO': { build: deadlift({}) },
  'PESO MUERTO DEFICIT': { build: deadlift({ platform: 7, pitch0: 60 }) },
  'RACK PULL': { build: deadlift({ startY: FLOOR_Y - 52, pitch0: 34, pins: true }) },
  'PESO MUERTO CON BARRA HEXAGONAL': { build: deadlift({ gear: 'trap', grip: 25, pr: 90, pitch0: 42, barX: 0 }) },
  'PESO MUERTO CON MANCUERNAS': { build: deadlift({ gear: 'dumbbell', grip: 17, pr: 90, startY: FLOOR_Y - 7, pitch0: 52 }) },
  'BUENOS DIAS': { build: goodMorning },
  'REMO CON BARRA': { build: bentRow({ pitch: 48 }) },
  'REMO PENDLAY': { build: bentRow({ pitch: 82, floor: true, to: 28, hipX: -24, drop: 14 }) },
  'REMO YATES': { build: bentRow({ pitch: 28, pr: 0, grip: 19, to: 14, flare: 0.15, drop: 6 }) },
  'REMO EN MULTIPOWER': { build: bentRow({ pitch: 52, smith: true }) },
  'REMO EN T': { build: tBarRow },
  'REMO UNILATERAL': { build: oneArmRow({}) },
  'REMO KROC': { build: krocRow },
  'REMO MEADOWS': { build: meadowsRow },
  'REMO GORILA': { build: gorillaRow, view: 'front' },
  'REMO SEAL': { build: proneRow({ padY: FLOOR_Y - 82, grip: 22, to: 26 }) },
  'REMO CON MANCUERNAS EN BANCO INCLINADO': { build: proneRow({ angle: 32, padY: FLOOR_Y - 70, gear: 'dumbbell', grip: 20, pr: 90, feet: 'floor', hip: [-16, FLOOR_Y - 70, 0], to: 24, flare: 0.2 }) },
  'REMO CON APOYO EN PECHO': { build: proneRow({ angle: 42, gear: 'machine', grip: 20, pr: 90, feet: 'floor', hip: [-14, FLOOR_Y - 66, 0], to: 26, flare: 0.2 }) },
  'REMO RENEGADO': { build: renegadeRow, view: 'front' },
  'REMO BAJO': { build: seatedCableRow({}) },
  'REMO BAJO AGARRE ABIERTO': { build: seatedCableRow({ wide: true, lean0: 14 }), view: 'top' },
  'REMO UNILATERAL EN POLEA': { build: standingCableRow, view: 'top' },
  'REMO EN MAQUINA': { build: machineRow({}) },
  'REMO ALTO EN MAQUINA': { build: machineRow({ high: true, reach: [34, -34, 0], lean: 6 }) },
  'JALON AL PECHO': { build: pulldown({ grip: 36, pr: 90 }), view: 'front' },
  'JALON AL PECHO AGARRE CERRADO': { build: pulldown({ grip: 4, handle: 'v', pr: 0, flare: 0.2 }) },
  'JALON AL PECHO AGARRE SUPINO': { build: pulldown({ grip: 16, pr: 0, flare: 0.2, to: 37 }) },
  'JALON TRAS NUCA': { build: pulldown({ grip: 38, pr: 90, behind: true }), view: 'front' },
  'JALON UNILATERAL': { build: pulldown({ single: true, grip: 14 }), view: 'front' },
  'JALON AL PECHO EN MAQUINA': { build: pulldown({ machine: true, grip: 30, pr: 60 }) },
  'JALON CON BRAZOS RECTOS': { build: straightArmPulldown },
  DOMINADAS: { build: hangPull({ grip: 30 }), view: 'front' },
  'DOMINADAS SUPINAS': { build: hangPull({ grip: 17, pr: 0 }), view: 'front' },
  'DOMINADAS AGARRE NEUTRO': { build: hangPull({ grip: 15, pr: 90, handles: true }), view: 'front' },
  'DOMINADAS ASISTIDAS': { build: hangPull({ grip: 30, extra: 'machine' }) },
  'DOMINADAS CON BANDA': { build: hangPull({ grip: 30, extra: 'band', legs: { e: 4, p: 0, b: 80 } }) },
  'DOMINADAS LASTRADAS': { build: hangPull({ grip: 28, extra: 'belt' }) },
  'DOMINADAS ARQUERAS': { build: hangPull({ grip: 44, shift: 16, drop1: 20 }), view: 'front' },
  'DOMINADAS ESCAPULARES': { build: hangPull({ grip: 30, drop0: 51, drop1: 45, elev: [5, -4], lean1: -6, legs: { e: 0, p: 0, b: 10 } }), view: 'front' },
  'FRONT LEVER': { build: frontLever },
  'REMO INVERTIDO': { build: invertedRow },
  HIPEREXTENSIONES: { build: hyperextension({ angle: 45 }) },
  'HIPEREXTENSIONES A 90 GRADOS': { build: hyperextension({ angle: 0 }) },
  'EXTENSION LUMBAR EN MAQUINA': { build: backExtensionMachine },
  SUPERMAN: { build: superman },
  'ENCOGIMIENTOS CON BARRA': { build: shrug({}), view: 'front' },
  'ENCOGIMIENTOS CON MANCUERNAS': { build: shrug({ gear: 'dumbbell' }), view: 'front' },
  'ENCOGIMIENTOS EN MAQUINA': { build: shrug({ gear: 'machine' }), view: 'front' },
  'ENCOGIMIENTOS EN POLEA': { build: shrug({ gear: 'cable' }), view: 'front' },
  'ENCOGIMIENTOS TRAS LA ESPALDA': { build: shrug({ gear: 'behind' }) },
  'PULLOVER EN MAQUINA': { build: machinePullover },
};
export { deadlift, bentRow, seatedCableRow };
