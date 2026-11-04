import * as E from '../../utils/figure/equipment';
import { add, ANKLE_Y, arms, BENCH_TOP, BODY, chestPoint, fist, fistMid, FLOOR_Y, grab, lerp, madd, mix, norm, palmDown, scale, scene, shoulderOf, sideSign, STAND_HIP_Y, sub, track, withBody } from './common';
import { plankBody, seated, splitStance, supineBench } from './setups';

/*
 * Hombros: press por encima de la cabeza, vuelos (laterales, frontales, posteriores), face pull, remo al mentón,
 * rotadores, parada de manos y variantes en máquina/polea.
 */

const stand = (extra = {}) => ({
  pelvis: { at: [0, STAND_HIP_Y + 0.6 + (extra.drop ?? 0), 0], pitch: extra.pitch ?? 0, roll: extra.roll ?? 0 },
  legL: { to: [extra.footX ?? 0, ANKLE_Y, extra.stance ?? 11], pole: [1, -0.1, 0.2] },
  legR: { to: [extra.footX ?? 0, ANKLE_Y, -(extra.stance ?? 11)], pole: [1, -0.1, -0.2] },
  footL: { flat: true, out: 8 }, footR: { flat: true, out: 8 },
});

const benchSeat = (lean = 0) => {
  const setup = seated({ lean, seatY: FLOOR_Y - 44, back: lean !== 0 || undefined });
  return setup;
};

/*
 * Press por encima de la cabeza. o.gear: 'barbell' | 'dumbbell' | 'smith' | 'machine' | 'kettlebell';
 * o.seated (banco con respaldo), o.floor (press Z), o.behind (tras nuca), o.arnold, o.grip.
 */
const overheadPress = (o = {}) => (phase) => {
  let setup;
  if (o.floor) {
    setup = { pose: { pelvis: { at: [0, FLOOR_Y - 8.5, 0], pitch: 0 }, legL: { e: 88, p: 4, b: 0 }, legR: { e: 88, p: 4, b: 0 }, footL: { plantar: 10 }, footR: { plantar: 10 } }, props: () => [] };
  } else if (o.seated) setup = benchSeat(-4);
  else setup = { pose: stand({ stance: 12 }), props: () => [] };
  const pose = withBody(setup.pose, (sk) => {
    const hand = (side) => {
      const s = sideSign(side);
      const sh = shoulderOf(sk, side);
      const center = lerp(shoulderOf(sk, 'L'), shoulderOf(sk, 'R'), 0.5);
      if (o.gear === 'barbell' || o.gear === 'smith' || o.gear === 'machine') {
        const start = o.behind ? chestPoint(sk, 48, -9, s * (o.grip ?? 24)) : chestPoint(sk, 45, o.gear === 'machine' ? 6 : 10, s * (o.grip ?? 23));
        const top = [o.gear === 'smith' ? start[0] : center[0] - 1, center[1] - 49, s * (o.gripTop ?? o.grip ?? 22)];
        return lerp(start, top, phase);
      }
      if (o.arnold) {
        const start = chestPoint(sk, 46, 12, s * 9);
        const top = [sh[0], sh[1] - 48, s * 13];
        return track(phase, [[0, start], [0.5, [sh[0] + 4, sh[1] - 14, s * 22]], [1, top]]);
      }
      const start = [sh[0] + 2, sh[1] - 6, s * 25];
      const top = [sh[0], sh[1] - 48, s * 13];
      return lerp(start, top, phase);
    };
    const pole = (side) => (o.arnold ? lerp([1, 0.7, sideSign(side) * 0.2], [0, 0.6, sideSign(side) * 1], phase) : o.gear === 'barbell' || o.gear === 'smith' ? [0.5, 1, sideSign(side) * 0.7] : [0, 1, sideSign(side) * 1]);
    const pr = o.arnold ? mix(-10, 90, phase) : 90;
    if (o.single) return arms(grab(hand('L'), pole('L'), pr), { arm: { e: 14, p: 70, b: 35, r: 10 }, hand: { pr: 90, grip: 'open' } });
    return arms(grab(hand('L'), pole('L'), pr), grab(hand('R'), pole('R'), pr));
  });
  return scene(pose, (sk) => {
    const items = [setup.props(sk)];
    if (o.gear === 'barbell' || o.gear === 'smith') items.push(E.barbell(fistMid(sk), { plateR: 17 }));
    if (o.gear === 'smith') items.push(E.smithRails(fistMid(sk)[0] - 2));
    if (o.gear === 'dumbbell' || !o.gear) ['L', 'R'].forEach((side) => items.push(E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb)));
    if (o.gear === 'kettlebell') items.push(E.kettlebell(fist(sk, 'L'), { up: scale(sk.arms.L.hand.dir, -1), across: sk.arms.L.hand.thumb }));
    if (o.gear === 'machine') ['L', 'R'].forEach((side) => items.push(E.lever(add(shoulderOf(sk, side), [-26, 6, sideSign(side) * 8]), fist(sk, side)), E.handle('D', fist(sk, side), sk.arms[side].hand.thumb)));
    if (o.gear === 'machine') items.push(E.weightStack(sk.pelvis.o[0] - 36, 0));
    return items;
  });
};

// Landmine press: barra anclada en el piso, empuje a una mano en diagonal hacia arriba y adelante.
const landminePress = (phase) => {
  const pose = withBody(splitStance({ hinge: 10, front: 16, back: -20, drop: 4 }), (sk) => {
    const start = chestPoint(sk, 44, 11, 10);
    const end = add(shoulderOf(sk, 'L'), [32, -36, -6]);
    return arms(grab(lerp(start, end, phase), [0.3, 1, 0.6], 60), { arm: { e: 20, p: 60, b: 80 }, hand: { pr: 90, grip: 'open' } });
  });
  return scene(pose, (sk) => {
    const h = fist(sk, 'L');
    const pivot = [-90, FLOOR_Y - 2, 4];
    const dir = norm(sub(h, pivot));
    return [E.rod(pivot, madd(h, [dir, 16]), 1.6, { fill: E.FRAME }), E.loadedPlate(madd(h, [dir, 8]), dir, 12), E.sphere(pivot, 3, { fill: E.FRAME })];
  });
};

/*
 * Vuelos (elevaciones) con los brazos casi estirados. o.plane: 90 lateral, 0 frontal, 'rear' posterior.
 * o.gear: 'dumbbell' | 'cable' | 'machine' | 'plate' | 'barbell'. o.seated, o.lean (inclinado), o.single.
 */
const raise = (o = {}) => (phase) => {
  let base;
  if (o.seated) base = benchSeat(0).pose;
  else base = stand({ roll: o.lean ? -20 : 0, stance: o.lean ? 8 : 11 });
  const setupProps = o.seated ? benchSeat(0).props : () => [];
  const plane = o.plane ?? 90;
  const e = mix(o.e0 ?? 12, o.e1 ?? 86, phase);
  const pr = o.pr ?? (plane === 90 ? 90 : 180);
  const armSpec = { arm: { e, p: plane, b: o.bend ?? 14, r: 0 }, hand: { pr, grip: 'fist' } };
  let left = armSpec;
  let right = armSpec;
  if (o.single) right = o.lean ? { arm: { e: 50, p: 70, b: 10 }, hand: { pr: 90, grip: 'fist' } } : { arm: { e: 8, p: 30, b: 60 }, hand: { pr: 90, grip: 'open' } };
  if (o.alternate) {
    left = { arm: { e: track(phase, [[0, 10], [0.5, 88], [1, 10]]), p: plane, b: 12 }, hand: { pr, grip: 'fist' } };
    right = { arm: { e: track(phase, [[0, 10], [0.5, 10], [1, 88]]), p: plane, b: 12 }, hand: { pr, grip: 'fist' } };
  }
  const pose = { ...base, ...arms(left, right) };
  return scene(pose, (sk) => {
    const items = [setupProps(sk)];
    const sides = o.single ? ['L'] : ['L', 'R'];
    if (o.gear === 'cable') {
      sides.forEach((side) => {
        const pulley = [shoulderOf(sk, side)[0] + (plane === 0 ? -16 : 4), FLOOR_Y - 10, (o.single ? -1 : sideSign(side) * -1) * 26];
        items.push(E.cableColumn(pulley[0], pulley[2], pulley[1]), E.cable(pulley, fist(sk, side)), E.handle('D', fist(sk, side), sk.arms[side].hand.thumb));
      });
    } else if (o.gear === 'machine') {
      sides.forEach((side) => {
        const elbow = sk.arms[side].mid;
        items.push(E.roller(add(elbow, [0, -2, sideSign(side) * 4]), { axis: [1, 0, 0], half: 6, r: 3 }), E.lever(add(shoulderOf(sk, side), [-8, 0, 0]), add(elbow, [-8, 0, sideSign(side) * 4])));
      });
      items.push(E.weightStack(sk.pelvis.o[0] - 34, 0));
    } else if (o.gear === 'plate') {
      items.push(E.plate(madd(fistMid(sk), [[0, -1, 0], 3]), [1, 0, 0], 13));
    } else if (o.gear === 'barbell') {
      items.push(E.barbell(fistMid(sk), { plateR: 12, half: 60, inner: 44 }));
    } else sides.forEach((side) => items.push(E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb)));
    if (o.lean) items.push(E.post([fist(sk, 'R')[0] + 2, fist(sk, 'R')[1] - 40, fist(sk, 'R')[2] - 3], { r: 2 }));
    return items;
  });
};

// Vuelo lateral en máquina: sentado, codos flexionados contra los apoyos.
const machineLateral = (phase) => {
  const setup = benchSeat(0);
  const e = mix(14, 84, phase);
  const pose = { ...setup.pose, armL: { e, p: 90, b: 95, r: -10 }, armR: { e, p: 90, b: 95, r: -10 }, handL: { pr: 90, grip: 'fist' }, handR: { pr: 90, grip: 'fist' } };
  return scene(pose, (sk) => {
    const items = [setup.props(sk), E.weightStack(sk.pelvis.o[0] - 34, 0)];
    ['L', 'R'].forEach((side) => {
      const elbow = sk.arms[side].mid;
      const pivot = add(shoulderOf(sk, side), [-10, 0, 0]);
      items.push(E.lever(pivot, add(elbow, [-10, 0, sideSign(side) * 5])), E.roller(add(elbow, [-2, 0, sideSign(side) * 5]), { axis: [1, 0, 0], half: 7, r: 3 }), E.handle('D', fist(sk, side), [0, 0, 1]));
    });
    return items;
  });
};

// Vuelo lateral acostado de costado sobre un banco: el brazo de arriba sube de la cadera a la vertical.
const lyingLateral = (phase) => {
  const pose = {
    pelvis: { at: [10, BENCH_TOP - 12, 0], pitch: -90, roll: 90 },
    legL: { e: 20, p: 0, b: 40 }, legR: { e: 10, p: 0, b: 20 }, footL: { plantar: 10 }, footR: { plantar: 10 },
    armL: { e: mix(8, 95, phase), p: 90, b: 10 }, handL: { pr: 90, grip: 'fist' },
    armR: { e: 160, p: 90, b: 110 }, handR: { pr: 90, grip: 'open' },
    neck: { side: 15 },
  };
  return scene(pose, (sk) => [E.flatBench(-56, 44, BENCH_TOP), E.dumbbell(fist(sk, 'L'), sk.arms.L.hand.thumb)]);
};

/*
 * Vuelos posteriores. o.mode: 'bent' (de pie inclinado) | 'seated' (sentado inclinado sobre los muslos) |
 * 'prone' (boca abajo en banco inclinado) | 'machine' (pec deck invertido) | 'cable' (cruce en polea) | 'y' (elevación en Y).
 */
const rearDelt = (o = {}) => (phase) => {
  let base;
  let props = () => [];
  if (o.mode === 'seated') {
    const setup = seated({ lean: -62, seatY: FLOOR_Y - 44, back: false, footX: 30 });
    base = setup.pose;
    props = setup.props;
  } else if (o.mode === 'prone' || o.mode === 'y') {
    base = { pelvis: { at: [-16, FLOOR_Y - 70, 0], pitch: 58 }, legL: { to: [-40, ANKLE_Y, 13], pole: [1, 0, 0.4] }, legR: { to: [-40, ANKLE_Y, -13], pole: [1, 0, -0.4] }, footL: { flat: true }, footR: { flat: true }, neck: { flex: -10 } };
    props = (sk) => [E.slantPad(chestPoint(sk, -12, -BODY.chestFront - 0.5), chestPoint(sk, 46, -BODY.chestFront - 0.5), scale(sk.pelvis.basis.fwd, -1), { halfW: 12 }), E.post([chestPoint(sk, 6, -16)[0], chestPoint(sk, 6, -16)[1], 0], { r: 2 })];
  } else if (o.mode === 'machine') {
    const setup = seated({ lean: -2, seatY: FLOOR_Y - 44, back: false });
    base = setup.pose;
    props = (sk) => [setup.props(sk), E.slantPad(chestPoint(sk, 16, 12), chestPoint(sk, 42, 12), [-1, 0, 0], { halfW: 11 }), E.weightStack(sk.pelvis.o[0] + 50, 0)];
  } else if (o.mode === 'cable') {
    base = stand({ stance: 12, drop: 2 });
  } else {
    base = { pelvis: { at: [-16, STAND_HIP_Y + 9, 0], pitch: 72 }, legL: { to: [0, ANKLE_Y, 12], pole: [1, -0.1, 0.3] }, legR: { to: [0, ANKLE_Y, -12], pole: [1, -0.1, -0.3] }, footL: { flat: true }, footR: { flat: true }, neck: { flex: -25 } };
  }
  const pose = withBody(base, (sk) => {
    const hand = (side) => {
      const s = sideSign(side);
      const sh = shoulderOf(sk, side);
      const fwd = sk.chest.basis.fwd;
      if (o.mode === 'y') {
        const up = sk.chest.basis.up;
        const low = madd(sh, [fwd, 46], [up, 6], [[0, 0, 1], s * -2]);
        const high = madd(sh, [up, 38], [[0, 0, 1], s * 28], [fwd, 4]);
        return lerp(low, high, phase);
      }
      if (o.mode === 'machine' || o.mode === 'cable') {
        const front = add(sh, [44, 2, -s * (o.mode === 'cable' ? 10 : 4)]);
        const wide = add(sh, [-2, 2, s * 44]);
        return lerp(front, wide, phase);
      }
      const low = madd(sh, [fwd, 46], [[0, 0, 1], -s * 4]);
      const wide = madd(sh, [[0, 0, 1], s * 44], [fwd, 6]);
      return lerp(low, wide, phase);
    };
    const pole = (side) => (o.mode === 'machine' || o.mode === 'cable' ? [-0.5, -0.5, sideSign(side)] : add(scale(sk.chest.basis.fwd, -1), [0, 0, sideSign(side) * 0.8]));
    const pr = o.mode === 'y' ? 90 : o.mode === 'machine' ? 180 : 180;
    return arms(grab(hand('L'), pole('L'), pr), grab(hand('R'), pole('R'), pr));
  });
  return scene(pose, (sk) => {
    const items = [props(sk)];
    if (o.mode === 'machine') ['L', 'R'].forEach((side) => items.push(E.lever(add(shoulderOf(sk, side), [16, -24, sideSign(side) * 2]), add(fist(sk, side), [0, -6, 0])), E.rod(add(fist(sk, side), [0, -6, 0]), add(fist(sk, side), [0, 4, 0]), 1.3)));
    else if (o.mode === 'cable') ['L', 'R'].forEach((side) => {
      const pulley = [shoulderOf(sk, side)[0] + 40, shoulderOf(sk, side)[1], -sideSign(side) * 66];
      items.push(E.cableColumn(pulley[0], pulley[2], pulley[1]), E.cable(pulley, fist(sk, side)));
    });
    else ['L', 'R'].forEach((side) => items.push(E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb, { r: 5 })));
    return items;
  });
};

// Face pull: soga a la altura de la cara, se tira separando las manos con los codos altos.
const facePull = (phase) => {
  const pose = withBody(stand({ stance: 12, drop: 2, pitch: -4 }), (sk) => {
    const hand = (side) => {
      const s = sideSign(side);
      const sh = shoulderOf(sk, side);
      const reach = add(sh, [46, -4, -s * 12]);
      const end = add(sh, [6, -14, s * 6]);
      return lerp(reach, end, phase);
    };
    return arms(grab(hand('L'), [-0.5, -0.2, 1], 90), grab(hand('R'), [-0.5, -0.2, -1], 90));
  });
  return scene(pose, (sk) => {
    const pulley = [shoulderOf(sk, 'L')[0] + 70, shoulderOf(sk, 'L')[1] - 10, 0];
    const mid = fistMid(sk);
    return [E.cableColumn(pulley[0] + 6, 0, pulley[1]), E.cable(pulley, add(mid, [4, 0, 0])), E.polyline([fist(sk, 'L'), add(mid, [6, 0, 0]), fist(sk, 'R')], { color: E.DARK, width: 2.4 })];
  });
};

// Remo al mentón (barra o polea): de los muslos a la altura del pecho con los codos altos.
const uprightRow = (o = {}) => (phase) => {
  const pose = withBody(stand({ stance: 11 }), (sk) => {
    const hand = (side) => {
      const s = sideSign(side);
      const sh = shoulderOf(sk, side);
      const low = [sh[0] + 8, sh[1] + 49, s * 12];
      const high = chestPoint(sk, 38, 11, s * 10);
      return lerp(low, high, phase);
    };
    return arms(grab(hand('L'), [-0.3, -0.6, 1], 180), grab(hand('R'), [-0.3, -0.6, -1], 180));
  });
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    if (o.gear === 'cable') return [E.cable([h[0] + 10, FLOOR_Y - 10, 0], h), E.cableColumn(h[0] + 16, 0, FLOOR_Y - 10), E.handle('bar', h, [0, 0, 1], { half: 22 })];
    return E.ezBar(h, { bendDir: [0, 1, 0] });
  });
};

// Press cubano: remo al mentón → rotación externa (codos a 90°) → press arriba.
const cubanPress = (phase) => {
  const e = track(phase, [[0, 10], [0.5, 85], [1, 168]]);
  const b = track(phase, [[0, 10], [0.5, 90], [1, 8]]);
  const r = track(phase, [[0, 0], [0.5, 90], [1, 90]]);
  const pose = { ...stand({ stance: 11 }), armL: { e, p: 88, b, r }, armR: { e, p: 88, b, r }, handL: { pr: 90, grip: 'fist' }, handR: { pr: 90, grip: 'fist' } };
  return scene(pose, (sk) => ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb, { r: 5 })));
};

/*
 * Rotadores. o.mode: 'ext' (polea, rotación externa), 'int' (polea, rotación interna), 'lying' (mancuerna acostado de costado).
 */
const rotation = (o = {}) => (phase) => {
  if (o.mode === 'lying') {
    const pose = {
      pelvis: { at: [0, FLOOR_Y - 17, 0], pitch: -90, roll: 90 },
      legL: { e: 40, p: 0, b: 70 }, legR: { e: 40, p: 0, b: 70 }, footL: { plantar: 10 }, footR: { plantar: 10 },
      armL: { e: 4, p: 90, b: 90, r: mix(-70, 50, phase) }, handL: { pr: 90, grip: 'fist' },
      armR: { e: 150, p: 8, b: 115 }, handR: { pr: 90, grip: 'open' },
      neck: { side: 18 },
    };
    return scene(pose, (sk) => [E.dumbbell(fist(sk, 'L'), sk.arms.L.hand.thumb, { r: 4.5 })]);
  }
  const ext = o.mode !== 'int';
  const r = ext ? mix(-50, 55, phase) : mix(55, -50, phase);
  const pose = { ...stand({ stance: 11 }), armL: { e: 6, p: 70, b: 90, r }, handL: { pr: 90, grip: 'fist' }, armR: { e: 6, p: 40, b: 70 }, handR: { pr: 90, grip: 'open' } };
  return scene(pose, (sk) => {
    const h = fist(sk, 'L');
    const pulley = [h[0] + 6, h[1], ext ? -60 : 70];
    return [E.cableColumn(pulley[0], pulley[2], pulley[1]), E.cable(pulley, h), E.handle('D', h, sk.arms.L.hand.thumb), E.roller(add(sk.arms.L.mid, [0, 0, -4]), { axis: [1, 0, 0], half: 3, r: 2.4 })];
  });
};

// Flexiones pike: cadera alta en V invertida, la cabeza baja entre las manos.
const pikePushUp = (phase) => {
  const hands = [22, FLOOR_Y - 2.6];
  const shoulderY = mix(FLOOR_Y - 48, FLOOR_Y - 25, phase);
  const pitch = mix(146, 160, phase);
  const S = [hands[0] - mix(4, 10, phase), shoulderY, 0];
  const pose = withBody({ pelvis: { at: madd(S, [[-Math.sin((pitch * Math.PI) / 180) * -1, Math.cos((pitch * Math.PI) / 180) * -1 * -1, 0], 0]), pitch }, neck: { flex: 10 } }, () => ({}));
  const P = add(S, [-Math.sin((pitch * Math.PI) / 180) * 44, Math.cos((pitch * Math.PI) / 180) * 44, 0]);
  Object.assign(pose, {
    pelvis: { at: P, pitch },
    legL: { to: [-44, ANKLE_Y - 1, 11], pole: [1, -1, 0.1] }, legR: { to: [-44, ANKLE_Y - 1, -11], pole: [1, -1, -0.1] },
    footL: { plantar: 30 }, footR: { plantar: 30 },
    ...arms(palmDown([hands[0], hands[1], 19], [-0.4, -1, 0.6], 100), palmDown([hands[0], hands[1], -19], [-0.4, -1, -0.6], 100)),
  });
  return scene(pose);
};

// Parada de manos contra la pared: de la V con pies en el piso a la vertical.
const handstand = (phase) => {
  const handsX = 0;
  const wallX = -36;
  const pitch = track(phase, [[0, 140], [0.5, 165], [1, 180]]);
  const S = [handsX - 2, FLOOR_Y - 50.5, 0];
  const P = add(S, [-Math.sin((pitch * Math.PI) / 180) * 44, Math.cos((pitch * Math.PI) / 180) * 44, 0]);
  const legs = phase < 0.3
    ? { legL: { to: [handsX - 40, ANKLE_Y - 1, 11], pole: [1, -1, 0.1] }, legR: { to: [handsX - 40, ANKLE_Y - 1, -11], pole: [1, -1, -0.1] }, footL: { plantar: 30 }, footR: { plantar: 30 } }
    : { legL: { e: track(phase, [[0.3, 60], [0.5, 30], [1, 0]]), p: 0, b: track(phase, [[0.3, 60], [0.5, 50], [1, 0]]) }, legR: { e: track(phase, [[0.3, 90], [0.5, 60], [1, 0]]), p: 0, b: 0 }, footL: { plantar: 30 }, footR: { plantar: 30 } };
  const pose = { pelvis: { at: P, pitch }, ...legs, neck: { flex: -25 }, ...arms(palmDown([handsX + 2, FLOOR_Y - 2.6, 18], [-1, 0, 0.4], 100), palmDown([handsX + 2, FLOOR_Y - 2.6, -18], [-1, 0, -0.4], 100)) };
  return scene(pose, () => [E.line([wallX, FLOOR_Y, -40], [wallX, FLOOR_Y - 190, -40], { color: E.FRAME, width: 2.6, bias: -30 }), E.line([wallX, FLOOR_Y, 40], [wallX, FLOOR_Y - 190, 40], { color: E.FRAME, width: 2.6, bias: -30 }), E.line([wallX, FLOOR_Y - 190, -40], [wallX, FLOOR_Y - 190, 40], { color: E.FRAME, width: 2.6, bias: -30 })]);
};

// Volante con disco: brazos estirados al frente girando el disco como un volante.
const busDriver = (phase) => {
  const angle = mix(-45, 45, phase) * (Math.PI / 180);
  const pose = withBody(stand({ stance: 11 }), (sk) => {
    const center = chestPoint(sk, 42, 40);
    const hand = (side) => add(center, [0, Math.sin(angle) * 11 * sideSign(side) * -1, Math.cos(angle) * 11 * sideSign(side)]);
    return arms(grab(hand('L'), [-0.3, 1, 0.6], 90), grab(hand('R'), [-0.3, 1, -0.6], 90));
  });
  return scene(pose, (sk) => E.plate(add(fistMid(sk), [2, 0, 0]), [1, 0, 0], 14));
};

export const SHOULDER_FIGURES = {
  'PRESS MILITAR': { build: overheadPress({ gear: 'barbell', grip: 23 }) },
  'PRESS MILITAR SENTADO': { build: overheadPress({ gear: 'barbell', grip: 23, seated: true }) },
  'PRESS MILITAR EN MULTIPOWER': { build: overheadPress({ gear: 'smith', grip: 24, seated: true }) },
  'PRESS TRAS NUCA': { build: overheadPress({ gear: 'barbell', grip: 27, seated: true, behind: true }), view: 'front' },
  'PRESS Z': { build: overheadPress({ gear: 'barbell', grip: 23, floor: true }) },
  'PRESS DE HOMBROS CON MANCUERNAS': { build: overheadPress({ gear: 'dumbbell', seated: true }), view: 'front' },
  'PRESS DE HOMBROS CON MANCUERNAS DE PIE': { build: overheadPress({ gear: 'dumbbell' }), view: 'front' },
  'PRESS ARNOLD': { build: overheadPress({ gear: 'dumbbell', seated: true, arnold: true }), view: 'front' },
  'PRESS DE HOMBROS EN MAQUINA': { build: overheadPress({ gear: 'machine', seated: true, grip: 25 }) },
  'PRESS DE HOMBROS CON KETTLEBELL': { build: overheadPress({ gear: 'kettlebell', single: true }), view: 'front' },
  'LANDMINE PRESS': { build: landminePress },
  'VUELOS LATERALES': { build: raise({}), view: 'front' },
  'VUELOS LATERALES SENTADO': { build: raise({ seated: true }), view: 'front' },
  'VUELOS LATERALES EN POLEA': { build: raise({ gear: 'cable', single: true }), view: 'front' },
  'VUELOS LATERALES EN MAQUINA': { build: machineLateral, view: 'front' },
  'VUELO LATERAL INCLINADO': { build: raise({ single: true, lean: true, e0: 18, e1: 90 }), view: 'front' },
  'VUELO LATERAL ACOSTADO': { build: lyingLateral, view: 'front' },
  'VUELOS ANTERIORES': { build: raise({ plane: 0, alternate: true }) },
  'VUELOS ANTERIORES EN POLEA': { build: raise({ plane: 0, gear: 'cable', single: true, e1: 92 }) },
  'VUELOS ANTERIORES CON DISCO': { build: raise({ plane: 0, gear: 'plate', pr: 90, bend: 6, e1: 95 }) },
  'VUELOS ANTERIORES CON BARRA': { build: raise({ plane: 0, gear: 'barbell', e1: 88, bend: 8 }) },
  'VUELOS POSTERIORES': { build: rearDelt({ mode: 'bent' }), view: 'front' },
  'VUELOS POSTERIORES SENTADO': { build: rearDelt({ mode: 'seated' }), view: 'front' },
  'VUELOS POSTERIORES EN BANCO INCLINADO': { build: rearDelt({ mode: 'prone' }), view: 'front' },
  'ELEVACIONES EN Y': { build: rearDelt({ mode: 'y' }), view: 'front' },
  'PEC DECK INVERTIDO': { build: rearDelt({ mode: 'machine' }), view: 'top' },
  'CRUCE POSTERIOR EN POLEA': { build: rearDelt({ mode: 'cable' }), view: 'top' },
  'FACE PULL': { build: facePull, view: 'top' },
  'REMO MENTON': { build: uprightRow({}), view: 'front' },
  'REMO MENTON EN POLEA': { build: uprightRow({ gear: 'cable' }) },
  'PRESS CUBANO': { build: cubanPress, view: 'front' },
  'ROTACION EXTERNA EN POLEA': { build: rotation({ mode: 'ext' }), view: 'top' },
  'ROTACION INTERNA EN POLEA': { build: rotation({ mode: 'int' }), view: 'top' },
  'ROTACION EXTERNA CON MANCUERNA': { build: rotation({ mode: 'lying' }), view: 'front' },
  'FLEXIONES PIKE': { build: pikePushUp },
  'PARADA DE MANOS': { build: handstand },
  'VOLANTE CON DISCO': { build: busDriver, view: 'front' },
};
export { overheadPress, plankBody, supineBench, palmDown };
