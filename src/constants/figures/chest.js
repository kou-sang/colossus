import * as E from '../../utils/figure/equipment';
import { add, ANKLE_Y, arms, chestPoint, fist, fistMid, FLOOR_Y, grab, lerp, madd, mix, norm, palmDown, pelvisFromShoulders, scale, scene, shoulderOf, sideSign, sub, withBody } from './common';
import { plankBody, seated, splitStance, supineBench } from './setups';

/*
 * Pecho: press en banco (barra, mancuernas, multipower), máquinas, aperturas, poleas, flexiones y fondos.
 * Convención: fase 0 = posición inicial, 1 = punto de máximo recorrido (pecho estirado o contraído según el ejercicio).
 */

const midShoulder = (sk) => lerp(shoulderOf(sk, 'L'), shoulderOf(sk, 'R'), 0.5);

// Codos hacia el piso y afuera (en press acostado): `flare` 0 = pegados, 1 = a 90°.
const pressPole = (sk, side, flare, tuck = 0.25) => add(add(scale(sk.chest.basis.fwd, -1), scale(sk.chest.basis.lat, sideSign(side) * flare)), scale(sk.chest.basis.up, -tuck));


/*
 * Press acostado. o.gear: 'barbell' | 'dumbbell' | 'smith'. o.grip = media separación de manos (z) abajo;
 * o.gripTop arriba; o.touch = altura del tronco donde baja la barra; o.pr = pronación; o.flare = apertura de codos.
 */
const lyingPress = (o) => (phase) => {
  const setup = supineBench({ angle: o.angle ?? 0, feet: o.feet ?? ((o.angle ?? 0) < 0 ? 'hooked' : 'floor'), floor: o.floor });
  const pose = withBody(setup.pose, (sk) => {
    const s = midShoulder(sk);
    const grip = (side) => {
      const bottom = chestPoint(sk, o.touch ?? 30, o.depth ?? 13, sideSign(side) * o.grip);
      const top = o.gear === 'smith' ? [bottom[0], s[1] - 45, sideSign(side) * o.grip] : [s[0] + (o.topShift ?? 1), s[1] - 46, sideSign(side) * (o.gripTop ?? o.grip)];
      return lerp(top, bottom, phase);
    };
    return arms(grab(grip('L'), pressPole(sk, 'L', o.flare ?? 0.75, o.tuck), o.pr ?? 90), grab(grip('R'), pressPole(sk, 'R', o.flare ?? 0.75, o.tuck), o.pr ?? 90));
  });
  return scene(pose, (sk) => {
    const items = [setup.props(sk)];
    if (o.gear === 'dumbbell') ['L', 'R'].forEach((side) => items.push(E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb)));
    else items.push(E.barbell(fistMid(sk), { plateR: o.floor ? 19 : 17 }));
    if (o.gear === 'smith') items.push(E.smithRails(fistMid(sk)[0] - 2));
    else if (o.gear === 'barbell' && !o.floor) items.push(E.rack(midShoulder(sk)[0] - 8, midShoulder(sk)[1] - 50));
    return items;
  });
};

// Aperturas acostado: brazos casi estirados que se abren en arco (mancuernas o poleas bajas).
const lyingFly = (o) => (phase) => {
  const setup = supineBench({ angle: o.angle ?? 0, feet: (o.angle ?? 0) < 0 ? 'hooked' : 'floor' });
  const pose = withBody(setup.pose, (sk) => {
    const hand = (side) => {
      const sh = shoulderOf(sk, side);
      const theta = mix(6, o.open ?? 78, phase) * (Math.PI / 180);
      const r = 43;
      const out = sideSign(side);
      return madd(sh, [[0, -1, 0], Math.cos(theta) * r], [[0, 0, 1], out * Math.sin(theta) * r], [[1, 0, 0], 2]);
    };
    const pole = (side) => add(scale(sk.chest.basis.fwd, -0.6), scale([0, 0, 1], sideSign(side) * 0.3));
    return arms(grab(hand('L'), pole('L'), 90), grab(hand('R'), pole('R'), 90));
  });
  return scene(pose, (sk) => {
    const items = [setup.props(sk)];
    if (o.gear === 'cable') {
      ['L', 'R'].forEach((side) => {
        const pulley = [fist(sk, side)[0], FLOOR_Y - 12, sideSign(side) * 64];
        items.push(E.cableColumn(pulley[0], pulley[2], pulley[1]), E.cable(pulley, fist(sk, side)), E.handle('D', fist(sk, side), sk.arms[side].hand.thumb));
      });
    } else ['L', 'R'].forEach((side) => items.push(E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb)));
    return items;
  });
};

// Pullover: una mancuerna con ambas manos, del pecho hacia atrás de la cabeza.
const pullover = (phase) => {
  const setup = supineBench({});
  const pose = withBody(setup.pose, (sk) => {
    const s = midShoulder(sk);
    const theta = mix(4, 112, phase) * (Math.PI / 180);
    const r = 41;
    const target = (side) => [s[0] - Math.sin(theta) * r, s[1] - Math.cos(theta) * r, sideSign(side) * 3.5];
    const pole = (side) => add(scale(sk.chest.basis.up, -0.4), [0, 0, sideSign(side)]);
    return arms(grab(target('L'), pole('L'), 120, { grip: 'open', flex: -10 }), grab(target('R'), pole('R'), 120, { grip: 'open', flex: -10 }));
  });
  return scene(pose, (sk) => {
    const dir = norm(sub(fistMid(sk), lerp(sk.arms.L.mid, sk.arms.R.mid, 0.5)));
    return [setup.props(sk), E.dumbbell(madd(fistMid(sk), [dir, 6]), dir, { r: 6.5 })];
  });
};

// Máquinas sentado: manijas que se mueven del pecho hacia adelante (o arriba/abajo según la máquina).
const machinePress = (o) => (phase) => {
  const setup = seated({ lean: o.lean ?? 10, seatY: FLOOR_Y - 44 });
  const pose = withBody(setup.pose, (sk) => {
    const hand = (side) => {
      const start = chestPoint(sk, o.startH ?? 32, 6, sideSign(side) * (o.grip ?? 24));
      const dir = norm(o.dir ?? [1, 0, 0]);
      const conv = o.converge ? sideSign(side) * -10 : 0;
      return add(start, add(scale(dir, phase * (o.reach ?? 34)), [0, 0, conv * phase]));
    };
    const pole = (side) => [-0.8, 0.5, sideSign(side) * (o.flare ?? 0.8)];
    return arms(grab(hand('L'), pole('L'), o.pr ?? 180), grab(hand('R'), pole('R'), o.pr ?? 180));
  });
  return scene(pose, (sk) => {
    const items = [setup.props(sk)];
    ['L', 'R'].forEach((side) => {
      const h = fist(sk, side);
      const pivot = add(shoulderOf(sk, side), o.pivot ?? [-8, -34, sideSign(side) * 6]);
      items.push(E.lever(pivot, h), E.handle('D', h, sk.arms[side].hand.thumb));
      if (o.plates) {
        const horn = add(pivot, [-12, 4, sideSign(side) * 8]);
        items.push(E.rod(pivot, horn, 1.4, { fill: E.FRAME }), E.disc(horn, [0, 0, 1], 12, 3));
      }
    });
    if (!o.plates) items.push(E.weightStack(sk.pelvis.o[0] - 30, 0));
    items.push(E.frame([[sk.pelvis.o[0] - 22, FLOOR_Y, 0], [sk.pelvis.o[0] - 22, shoulderOf(sk, 'L')[1] - 40, 0], [shoulderOf(sk, 'L')[0] - 6, shoulderOf(sk, 'L')[1] - 40, 0]]));
    return items;
  });
};

// Mariposa (pec deck): sentado, brazos abiertos a la altura de los hombros que se juntan al frente.
const pecDeck = (phase) => {
  const setup = seated({ lean: 4, seatY: FLOOR_Y - 44 });
  const pose = withBody(setup.pose, (sk) => {
    const hand = (side) => {
      const sh = shoulderOf(sk, side);
      const theta = mix(100, 12, phase) * (Math.PI / 180);
      return madd(sh, [[1, 0, 0], Math.cos(theta) * 40 + 4], [[0, 0, 1], sideSign(side) * Math.sin(theta) * 40], [[0, 1, 0], 4]);
    };
    const pole = (side) => [-0.4, 0.8, sideSign(side) * 0.4];
    return arms(grab(hand('L'), pole('L'), 90), grab(hand('R'), pole('R'), 90));
  });
  return scene(pose, (sk) => {
    const items = [setup.props(sk), E.weightStack(sk.pelvis.o[0] - 32, 0)];
    ['L', 'R'].forEach((side) => {
      const h = fist(sk, side);
      const pivot = add(shoulderOf(sk, side), [0, -26, sideSign(side) * 2]);
      items.push(E.lever(pivot, [h[0], pivot[1], h[2]], { axis: [0, 1, 0] }), E.rod([h[0], pivot[1], h[2]], [h[0], h[1] + 6, h[2]], 1.4, { fill: E.FRAME }));
    });
    items.push(E.frame([[sk.pelvis.o[0] - 24, FLOOR_Y, 0], [sk.pelvis.o[0] - 24, shoulderOf(sk, 'L')[1] - 28, 0], [shoulderOf(sk, 'L')[0], shoulderOf(sk, 'L')[1] - 28, 0]]));
    return items;
  });
};

// Cruces de polea de pie: `from` y `to` = posición de las manos relativa al hombro (x adelante, y abajo, z afuera).
const cableCross = (o) => (phase) => {
  const base = splitStance({ hinge: o.hinge ?? 14, drop: 3 });
  const pose = withBody(base, (sk) => {
    const hand = (side) => {
      const sh = shoulderOf(sk, side);
      const rel = lerp(o.from, o.to, phase);
      return add(sh, [rel[0], rel[1], sideSign(side) * rel[2]]);
    };
    const pole = (side) => [-0.5, 0.3, sideSign(side) * 0.9];
    const single = o.single;
    const left = grab(hand('L'), pole('L'), 90);
    const right = single ? { arm: { e: 12, p: 30, b: 70, r: -10 }, hand: { pr: 90, grip: 'open' } } : grab(hand('R'), pole('R'), 90);
    if (single) left.arm.grip = add(shoulderOf(sk, 'L'), lerp(o.from, o.to, phase).map((value, index) => (index === 2 ? value : value)));
    return arms(left, right);
  });
  return scene(pose, (sk) => {
    const items = [];
    (o.single ? ['L'] : ['L', 'R']).forEach((side) => {
      const pulley = [-14, o.pulleyY, (o.single ? 1 : sideSign(side)) * 70];
      const h = fist(sk, side);
      items.push(E.cableColumn(pulley[0], pulley[2], pulley[1]), E.cable(pulley, h), E.handle('D', h, sk.arms[side].hand.thumb));
    });
    return items;
  });
};

// Press de pecho de pie con poleas detrás (empuje recto, codos que se estiran).
const cablePress = (phase) => {
  const base = splitStance({ hinge: 12, drop: 3 });
  const pose = withBody(base, (sk) => {
    const hand = (side) => {
      const start = chestPoint(sk, 33, 6, sideSign(side) * 23);
      return madd(start, [sk.chest.basis.fwd, phase * 32], [[0, 0, 1], -sideSign(side) * phase * 12]);
    };
    const pole = (side) => [-0.8, 0.5, sideSign(side) * 0.8];
    return arms(grab(hand('L'), pole('L'), 180), grab(hand('R'), pole('R'), 180));
  });
  return scene(pose, (sk) => ['L', 'R'].map((side) => {
    const pulley = [-40, shoulderOf(sk, side)[1] + 4, sideSign(side) * 62];
    return [E.cableColumn(pulley[0], pulley[2], pulley[1]), E.cable(pulley, fist(sk, side)), E.handle('D', fist(sk, side), sk.arms[side].hand.thumb)];
  }));
};

// Press Svend: discos apretados entre las palmas, de pie.
const svend = (phase) => {
  const base = { pelvis: { at: [0, 74.6, 0] }, legL: { to: [0, ANKLE_Y, 10.5], pole: [1, 0, 0.2] }, legR: { to: [0, ANKLE_Y, -10.5], pole: [1, 0, -0.2] }, footL: { flat: true }, footR: { flat: true } };
  const pose = withBody(base, (sk) => {
    const center = chestPoint(sk, 34, 12 + phase * 28);
    const hand = (side) => add(center, [0, 0, sideSign(side) * 3.2]);
    const pole = (side) => [-0.3, 1, sideSign(side) * 0.6];
    return arms(grab(hand('L'), pole('L'), 95, { grip: 'flat' }), grab(hand('R'), pole('R'), 95, { grip: 'flat' }));
  });
  return scene(pose, (sk) => E.plate(madd(lerp(sk.arms.L.hand.wrist, sk.arms.R.hand.wrist, 0.5), [lerp(sk.arms.L.hand.dir, sk.arms.R.hand.dir, 0.5), 4]), [0, 0, 1], 11));
};

/*
 * Flexiones. o: { width (z de las manos), handX (desplazamiento respecto del hombro), knees, feetY (cajón),
 * handY (manos elevadas), rings, diamond, archer, spider, plyo, pseudo, fingertips }.
 */
const pushUp = (o = {}) => (phase) => {
  const top = 50 + (o.handY ? FLOOR_Y - o.handY : 0);
  const bottom = (o.diamond ? 21 : 17) + (o.handY ? FLOOR_Y - o.handY : 0);
  let shoulderH = mix(top, bottom, Math.min(1, phase * (o.plyo ? 2 : 1)));
  if (o.plyo) shoulderH = phase <= 0.5 ? mix(top, bottom, phase * 2) : mix(bottom, top + 10, (phase - 0.5) * 2);
  const body = plankBody({ shoulderH, toeX: o.knees ? -20 : -60, feetY: o.feetY ?? FLOOR_Y, knees: o.knees });
  const handY = o.handY ?? FLOOR_Y;
  const airborne = o.plyo && phase > 0.6;
  const pose = withBody(body.pose, (sk) => {
    const shift = o.archer ? mix(0, 14, phase) : 0;
    const hand = (side) => {
      const s = sideSign(side);
      const width = o.diamond ? 4 : o.width ?? 21;
      const x = body.shoulderX + (o.handX ?? 2) + (o.diamond ? 10 : 0);
      if (airborne) return [x + 4, handY - 14, s * 16];
      return [x, handY - (o.rings ? 6 : 2.6), s * width];
    };
    const pole = (side) => (o.diamond ? [-1, -0.1, sideSign(side) * 0.25] : o.pseudo ? [-1, -0.3, sideSign(side) * 0.2] : [-0.7, -0.3, sideSign(side) * 0.85]);
    const handSpec = (side) => {
      if (airborne) return { arm: { to: hand(side), pole: pole(side) }, hand: { pr: 160, grip: 'open', flex: -20 } };
      if (o.rings) return grab(hand(side), pole(side), 90);
      const spec = palmDown(hand(side), pole(side), o.pseudo ? 40 : o.diamond ? 140 : 100);
      if (o.fingertips) {
        // Sobre la punta de los dedos: la palma no toca el piso, la mano queda casi vertical y abierta.
        spec.arm.to = add(hand(side), [0, -8, 0]);
        spec.hand = { pr: 100, grip: 'open', flex: -8 };
      }
      return spec;
    };
    const left = handSpec('L');
    const right = handSpec('R');
    if (o.archer) {
      left.arm.to = left.arm.to ? add(left.arm.to, [0, 0, 0]) : left.arm.to;
      right.arm.to = right.arm.to ? right.arm.to : right.arm.to;
    }
    const extra = {};
    if (shift) extra.pelvis = { ...sk.pose.pelvis, at: add(sk.pose.pelvis.at, [0, 0, shift]) };
    if (o.spider && phase > 0.2) {
      const t = (phase - 0.2) / 0.8;
      extra.legL = { e: mix(5, 70, t), p: mix(0, 70, t), b: mix(0, 90, t) };
      extra.footL = { plantar: 20 };
    }
    return { ...arms(left, right), ...extra };
  });
  return scene(pose, (sk) => {
    const items = [];
    if (o.feetY) items.push(E.plyoBox(-72, -46, FLOOR_Y - o.feetY));
    if (o.handY) items.push(E.flatBench(sk.arms.L.hand.wrist[0] - 14, sk.arms.L.hand.wrist[0] + 60, o.handY));
    if (o.rings) items.push(E.straps([sk.arms.L.hand.wrist[0] + 6, FLOOR_Y - 200, 0], [fist(sk, 'L'), fist(sk, 'R')], { rings: true }));
    if (o.plyo && phase > 0.6) items.push(E.line([sk.arms.L.hand.wrist[0], FLOOR_Y - 4, 22], [sk.arms.L.hand.wrist[0], FLOOR_Y - 10, 22], { color: E.GEAR, width: 1.2, dash: true }));
    return items;
  });
};

// Fondos en paralelas: manos fijas en las barras, el cuerpo baja entre ellas.
export const dips = (o = {}) => (phase) => {
  const barY = FLOOR_Y - (o.gear === 'rings' ? 114 : 100);
  const barX = 0;
  const lean = mix(o.leanTop ?? 6, o.leanBottom ?? 12, phase);
  const shoulderY = mix(barY - 44, barY - 14, phase);
  const shoulderX = barX - mix(2, o.back ?? 10, phase);
  const pelvisAt = pelvisFromShoulders([shoulderX, shoulderY, 0], lean);
  const pose = {
    pelvis: { at: pelvisAt, pitch: lean },
    legL: { e: o.legsForward ?? 12, p: 0, b: o.kneeBend ?? 85 }, legR: { e: (o.legsForward ?? 12) + 4, p: 0, b: (o.kneeBend ?? 85) + 10 },
    footL: { plantar: 25 }, footR: { plantar: 25 },
    ...arms(grab([barX + 3, barY, o.half ?? 22], [-1, -0.2, o.flare ?? 0.25], 90), grab([barX + 3, barY, -(o.half ?? 22)], [-1, -0.2, -(o.flare ?? 0.25)], 90)),
    neck: { flex: 5 },
  };
  return scene(pose, () => (o.gear === 'rings' ? E.straps([barX + 3, FLOOR_Y - 230, 0], [[barX + 3, barY, 22], [barX + 3, barY, -22]], { rings: true }) : o.gear === 'bar' ? [E.rod([barX + 3, barY, -40], [barX + 3, barY, 40], 1.3), E.post([barX + 3, barY, -40]), E.post([barX + 3, barY, 40])] : E.dipBars(barX + 3, barY, { half: o.half ?? 22 })));
};

export const CHEST_FIGURES = {
  'PRESS BANCA': { build: lyingPress({ gear: 'barbell', grip: 26, touch: 31 }) },
  'PRESS BANCA CON MANCUERNAS': { build: lyingPress({ gear: 'dumbbell', grip: 27, gripTop: 12, touch: 33, depth: 8 }) },
  'PRESS INCLINADO': { build: lyingPress({ gear: 'barbell', grip: 25, touch: 39, angle: 35 }) },
  'PRESS INCLINADO CON MANCUERNAS': { build: lyingPress({ gear: 'dumbbell', grip: 26, gripTop: 11, touch: 39, depth: 8, angle: 35 }) },
  'PRESS DECLINADO': { build: lyingPress({ gear: 'barbell', grip: 26, touch: 26, angle: -20 }) },
  'PRESS DECLINADO CON MANCUERNAS': { build: lyingPress({ gear: 'dumbbell', grip: 26, gripTop: 12, touch: 27, depth: 8, angle: -20 }) },
  'PRESS EN MULTIPOWER': { build: lyingPress({ gear: 'smith', grip: 27, touch: 29 }) },
  'PRESS INCLINADO EN MULTIPOWER': { build: lyingPress({ gear: 'smith', grip: 25, touch: 38, angle: 35 }) },
  'PRESS HEX': { build: lyingPress({ gear: 'dumbbell', grip: 7, gripTop: 7, touch: 30, depth: 13, pr: 0, flare: 0.15, tuck: 0.8 }) },
  'PRESS DE PISO': { build: lyingPress({ gear: 'barbell', grip: 25, touch: 30, floor: true, flare: 0.55 }) },
  'PRESS GUILLOTINA': { build: lyingPress({ gear: 'barbell', grip: 33, touch: 43, flare: 1.4, depth: 11 }) },
  'PRESS BANCA AGARRE INVERSO': { build: lyingPress({ gear: 'barbell', grip: 22, touch: 25, pr: 0, flare: 0.25, tuck: 1.2 }) },
  'PRESS CERRADO': { build: lyingPress({ gear: 'barbell', grip: 15, touch: 27, flare: 0.25, tuck: 0.9 }) },
  'PRESS CERRADO EN MULTIPOWER': { build: lyingPress({ gear: 'smith', grip: 15, touch: 27, flare: 0.25, tuck: 0.9 }) },
  'APERTURAS CON MANCUERNAS': { build: lyingFly({ open: 76 }), view: 'front' },
  'APERTURAS INCLINADAS': { build: lyingFly({ open: 74, angle: 32 }), view: 'front' },
  'APERTURAS DECLINADAS': { build: lyingFly({ open: 74, angle: -20 }), view: 'front' },
  'APERTURAS EN POLEA': { build: lyingFly({ open: 80, gear: 'cable' }), view: 'front' },
  PULLOVER: { build: pullover },
  'PRESS DE PECHO EN MAQUINA': { build: machinePress({ lean: 10, startH: 32, dir: [1, 0.02, 0] }) },
  'PRESS INCLINADO EN MAQUINA': { build: machinePress({ lean: 28, startH: 38, dir: [0.75, -0.66, 0], reach: 32, pivot: [-14, -10, 8] }) },
  'PRESS DECLINADO EN MAQUINA': { build: machinePress({ lean: 6, startH: 26, dir: [0.9, 0.42, 0], reach: 30, pivot: [-6, -36, 6] }) },
  'PRESS DE PECHO HAMMER': { build: machinePress({ lean: 14, startH: 31, grip: 27, dir: [1, 0.1, 0], converge: true, plates: true, pr: 100, flare: 0.5, pivot: [-24, 46, 8] }), view: 'top' },
  MARIPOSA: { build: pecDeck, view: 'top' },
  'CRUCE DE POLEAS': { build: cableCross({ pulleyY: FLOOR_Y - 196, from: [-6, -24, 38], to: [30, 38, 3] }), view: 'front' },
  'CRUCE DE POLEAS BAJAS': { build: cableCross({ pulleyY: FLOOR_Y - 14, from: [4, 36, 34], to: [34, -6, 4], hinge: 4 }), view: 'front' },
  'CRUCE DE POLEAS MEDIAS': { build: cableCross({ pulleyY: FLOOR_Y - 110, from: [-10, 6, 42], to: [38, 8, 3], hinge: 8 }), view: 'top' },
  'CRUCE DE POLEAS UNILATERAL': { build: cableCross({ pulleyY: FLOOR_Y - 196, from: [-6, -26, 36], to: [26, 36, -22], single: true }), view: 'front' },
  'PRESS DE PECHO EN POLEA': { build: cablePress, view: 'top' },
  'PRESS SVEND': { build: svend },
  FLEXIONES: { build: pushUp({}) },
  'FLEXIONES DE RODILLAS': { build: pushUp({ knees: true }) },
  'FLEXIONES DECLINADAS': { build: pushUp({ feetY: FLOOR_Y - 40 }) },
  'FLEXIONES INCLINADAS': { build: pushUp({ handY: FLOOR_Y - 40, width: 20 }) },
  'FLEXIONES DIAMANTE': { build: pushUp({ diamond: true }), view: 'front' },
  'FLEXIONES ARQUERAS': { build: pushUp({ width: 36, archer: true }), view: 'front' },
  'FLEXIONES PLIOMETRICAS': { build: pushUp({ plyo: true }) },
  'FLEXIONES SPIDERMAN': { build: pushUp({ spider: true }), view: 'top' },
  'FLEXIONES EN ANILLAS': { build: pushUp({ rings: true, width: 19 }) },
  'FLEXIONES PSEUDO PLANCHA': { build: pushUp({ pseudo: true, handX: -16, width: 18 }) },
  'FONDOS PARA PECHO': { build: dips({ leanTop: 18, leanBottom: 34, flare: 0.7, back: 6 }) },
  'FLEXIONES SOBRE LOS DEDOS': { build: pushUp({ fingertips: true }) },
};
