import * as E from '../../utils/figure/equipment';
import { add, ANKLE_Y, arms, BENCH_TOP, BODY, chestPoint, fist, fistMid, FLOOR_Y, grab, lerp, madd, mix, norm, palmDown, pelvisFromShoulders, scale, scene, shoulderOf, sideSign, STAND_HIP_Y, track, withBody } from './common';
import { deadlift } from './back';
import { seated, standing } from './setups';

/*
 * Piernas, glúteos y pantorrillas: sentadillas, máquinas (hack, prensas, sillones, camillas), bisagras,
 * estocadas, hip thrust, puentes, patadas, aductores/abductores y elevaciones de talones.
 * Fase 0 = de pie / piernas estiradas; 1 = punto más profundo del movimiento (salvo que se indique otra cosa).
 */

const rad = (deg) => (deg * Math.PI) / 180;
const handsOnHips = (sk) => arms(
  { arm: { to: chestPoint(sk, 6, 2, 13), pole: [-0.6, 0, 1] }, hand: { pr: 90, grip: 'flat', flex: 10 } },
  { arm: { to: chestPoint(sk, 6, 2, -13), pole: [-0.6, 0, -1] }, hand: { pr: 90, grip: 'flat', flex: 10 } },
);
const armsForward = { armL: { e: 85, p: 8, b: 5 }, armR: { e: 85, p: 8, b: 5 }, handL: { pr: 180, grip: 'open' }, handR: { pr: 180, grip: 'open' } };

/*
 * Sentadilla. o.bar: 'high' | 'low' | 'front' | 'zercher' | 'goblet' | 'dumbbells' | 'kb' | 'none' | 'hack' (barra detrás de las piernas).
 * o.drop (descenso de cadera), o.pitch (inclinación del tronco abajo), o.stance, o.toeOut, o.box, o.smith, o.belt, o.wall.
 */
const squat = (o = {}) => (phase) => {
  const drop = mix(0, o.drop ?? 36, phase);
  const pitch = mix(o.pitch0 ?? 3, o.pitch ?? 40, phase);
  const back = mix(0, o.back ?? -16, phase);
  const base = standing({ x: back, drop, hinge: pitch, stance: o.stance ?? 14, toeOut: o.toeOut ?? 18, kneeOut: o.kneeOut ?? 0.35, footX: o.footX ?? 2 });
  base.neck = { flex: -pitch * 0.3 };
  const pose = withBody(base, (sk) => {
    switch (o.bar) {
      case 'high':
      case 'low': {
        const bar = o.bar === 'high' ? chestPoint(sk, 46.5, -8) : chestPoint(sk, 41.5, -10);
        return arms(grab(add(bar, [0, 0, 28]), [-0.2, 1, 0.8], 100), grab(add(bar, [0, 0, -28]), [-0.2, 1, -0.8], 100));
      }
      case 'front': {
        const bar = chestPoint(sk, 45, 9.5);
        return arms(grab(add(bar, [0, 0, 20]), [1, -0.2, 0.25], 40, { flex: -60, grip: 'open' }), grab(add(bar, [0, 0, -20]), [1, -0.2, -0.25], 40, { flex: -60, grip: 'open' }));
      }
      case 'zercher': {
        const bar = chestPoint(sk, 26, 18);
        return arms({ arm: { to: add(bar, [-4, -14, 9]), pole: [0.2, 1, 0.6] }, hand: { pr: 0, grip: 'fist' } }, { arm: { to: add(bar, [-4, -14, -9]), pole: [0.2, 1, -0.6] }, hand: { pr: 0, grip: 'fist' } });
      }
      case 'goblet': {
        const c = chestPoint(sk, 34, 16);
        return arms(grab(add(c, [0, 0, 4]), [0, 1, 0.4], 20, { grip: 'flat' }), grab(add(c, [0, 0, -4]), [0, 1, -0.4], 20, { grip: 'flat' }));
      }
      case 'dumbbells':
        return arms(grab(add(shoulderOf(sk, 'L'), [2, 50, 3]), [-1, 0, 0.2], 90), grab(add(shoulderOf(sk, 'R'), [2, 50, -3]), [-1, 0, -0.2], 90));
      case 'kb': {
        const c = madd(lerp(shoulderOf(sk, 'L'), shoulderOf(sk, 'R'), 0.5), [[0, 1, 0], 50], [[1, 0, 0], 2]);
        return arms(grab(add(c, [0, 0, 3.2]), [-0.4, 0, 0.6], 180), grab(add(c, [0, 0, -3.2]), [-0.4, 0, -0.6], 180));
      }
      case 'hack': {
        const c = madd(lerp(shoulderOf(sk, 'L'), shoulderOf(sk, 'R'), 0.5), [[0, 1, 0], 50], [[1, 0, 0], -8]);
        return arms(grab(add(c, [0, 0, 22]), [-1, 0, 0.3], 0), grab(add(c, [0, 0, -22]), [-1, 0, -0.3], 0));
      }
      case 'belt':
        return arms(grab(add(shoulderOf(sk, 'L'), [24, 40, 0]), [-0.5, 1, 0.5], 180), grab(add(shoulderOf(sk, 'R'), [24, 40, 0]), [-0.5, 1, -0.5], 180));
      default:
        return o.wall ? handsOnHips(sk) : armsForward;
    }
  });
  return scene(pose, (sk) => {
    const items = [];
    if (o.bar === 'high' || o.bar === 'low' || o.bar === 'front' || o.bar === 'zercher') {
      const c = o.bar === 'zercher' ? lerp(sk.arms.L.mid, sk.arms.R.mid, 0.5) : fistMid(sk);
      items.push(E.barbell(o.bar === 'front' ? chestPoint(sk, 45, 9.5) : c));
    }
    if (o.bar === 'goblet') items.push(E.dumbbell(add(fistMid(sk), [2, 5, 0]), [0, 1, 0], { r: 7 }));
    if (o.bar === 'dumbbells') ['L', 'R'].forEach((side) => items.push(E.dumbbell(fist(sk, side), [1, 0, 0])));
    if (o.bar === 'kb') items.push(E.kettlebell(fistMid(sk), { across: [0, 0, 1] }));
    if (o.bar === 'hack') items.push(E.barbell(fistMid(sk)));
    if (o.smith) items.push(E.smithRails(fistMid(sk)[0] - 2));
    if (o.box) items.push(E.plyoBox(-30, -6, 44));
    if (o.wall) items.push(E.line([sk.pelvis.o[0] - 10, FLOOR_Y, 0], [sk.pelvis.o[0] - 10, FLOOR_Y - 180, 0], { color: E.FRAME, width: 4, bias: -30 }));
    if (o.belt) {
      const hip = chestPoint(sk, -2, 0);
      items.push(E.line(add(hip, [0, 6, 0]), [hip[0], FLOOR_Y - 4, 0], { color: E.DARK, width: 1.8 }), E.disc([hip[0], FLOOR_Y - 8, 0], [0, 1, 0], 12, 4), E.aabb([-40, FLOOR_Y - 10, -40], [40, FLOOR_Y, 40], { fill: E.FRAME, bias: -20, opacity: 0.6 }), E.rod(add(fistMid(sk), [0, 0, -20]), add(fistMid(sk), [0, 0, 20]), 1.3), E.post(add(fistMid(sk), [6, 0, -20])), E.post(add(fistMid(sk), [6, 0, 20])));
    }
    return items;
  });
};

// Sentadilla hack / V / péndulo / hack inversa: espalda contra un respaldo que se desliza; pies en la plataforma.
const machineSquat = (o = {}) => (phase) => {
  const angle = o.angle ?? 45; // inclinación de los rieles sobre la horizontal
  const dir = [Math.cos(rad(angle)) * (o.facing === 'pad' ? 1 : -1), Math.sin(rad(angle)), 0];
  const travel = mix(0, o.travel ?? 38, phase);
  const pitch = o.facing === 'pad' ? mix(30, 52, phase) : mix(-18, -12, phase) + (o.lean ?? 0);
  const P0 = [o.facing === 'pad' ? 0 : -4, STAND_HIP_Y + 4, 0];
  const P = madd(P0, [dir, travel]);
  const footX = o.footX ?? 12;
  const footY = ANKLE_Y - (o.platform ?? 6);
  const pose = withBody({
    pelvis: { at: P, pitch },
    legL: { to: [footX, footY, 13], pole: [1, -0.2, 0.35] }, legR: { to: [footX, footY, -13], pole: [1, -0.2, -0.35] },
    footL: { flat: true, out: 14 }, footR: { flat: true, out: 14 },
  }, (sk) => arms(
    grab(add(shoulderOf(sk, 'L'), o.facing === 'pad' ? [8, 6, 4] : [6, -8, 2]), [-0.5, 1, 0.5], 90),
    grab(add(shoulderOf(sk, 'R'), o.facing === 'pad' ? [8, 6, -4] : [6, -8, -2]), [-0.5, 1, -0.5], 90),
  ));
  return scene(pose, (sk) => {
    const items = [];
    const backLine = o.facing === 'pad' ? chestPoint(sk, 20, BODY.chestFront + 1) : chestPoint(sk, 0, -10);
    const top = o.facing === 'pad' ? chestPoint(sk, 44, BODY.chestFront + 1) : chestPoint(sk, 46, -9.5);
    items.push(E.slantPad(backLine, top, o.facing === 'pad' ? scale(sk.pelvis.basis.fwd, -1) : sk.pelvis.basis.fwd, { halfW: 13 }));
    ['L', 'R'].forEach((side) => items.push(E.roller(add(shoulderOf(sk, side), o.facing === 'pad' ? [-4, -5, 0] : [3, -5, 0]), { axis: [1, 0, 0], half: 5, r: 3.4 })));
    items.push(E.aabb([footX - 18, footY + BODY.ankleH, -24], [footX + 18, footY + BODY.ankleH + 4, 24], { fill: E.FRAME, bias: -6 }));
    const railStart = madd(P0, [dir, -20], [[-1, 0, 0], 14]);
    if (o.kind === 'pendulum') items.push(E.lever(add(top, [-20, -40, 0]), top));
    else [-18, 18].forEach((z) => items.push(E.rod(add(railStart, [0, 0, z]), add(madd(railStart, [dir, 90]), [0, 0, z]), 1.4, { bias: -14, opacity: 0.7 })));
    if (o.plates) items.push(E.loadedPlate(add(top, [-14, -4, 24]), [0, 0, 1], 12));
    return items;
  });
};

// Prensas: sentado en el carro reclinado; la plataforma se mueve con los pies. o.kind: '45' | 'horizontal' | 'vertical'; o.single.
const legPress = (o = {}) => (phase) => {
  const kind = o.kind ?? '45';
  const back = { '45': -55, horizontal: -25, vertical: -90 }[kind];
  const slide = { '45': [Math.cos(rad(45)), -Math.sin(rad(45)), 0], horizontal: [1, 0, 0], vertical: [0, -1, 0] }[kind];
  const P = kind === 'vertical' ? [0, FLOOR_Y - 18, 0] : kind === 'horizontal' ? [0, FLOOR_Y - 52, 0] : [0, FLOOR_Y - 40, 0];
  const reach = mix(64, kind === 'vertical' ? 36 : 41, phase);
  const hipToPlate = madd(P, [slide, reach], [kind === 'vertical' ? [1, 0, 0] : [0, -1, 0], kind === 'vertical' ? 4 : 2]);
  const pose = withBody({
    pelvis: { at: P, pitch: back },
    legL: { to: add(hipToPlate, [0, 0, 12]), pole: kind === 'vertical' ? [-0.2, -1, 0.2] : [0.2, -1, 0.3] },
    legR: o.single ? { e: 90, p: 10, b: 90 } : { to: add(hipToPlate, [0, 0, -12]), pole: kind === 'vertical' ? [-0.2, -1, -0.2] : [0.2, -1, -0.3] },
    footL: { dir: kind === 'vertical' ? [1, 0, 0] : norm(add(scale(slide, -0.1), kind === '45' ? [-0.7, -0.7, 0] : [0, -1, 0])) },
    footR: o.single ? { plantar: 10 } : { dir: kind === 'vertical' ? [1, 0, 0] : norm(add(scale(slide, -0.1), kind === '45' ? [-0.7, -0.7, 0] : [0, -1, 0])) },
  }, (sk) => arms(grab(chestPoint(sk, -6, 2, 24), [-1, 0, 0.5], 90), grab(chestPoint(sk, -6, 2, -24), [-1, 0, -0.5], 90)));
  return scene(pose, (sk) => {
    const items = [];
    const backA = chestPoint(sk, -12, -10);
    const backB = chestPoint(sk, 50, -10);
    items.push(E.slantPad(backA, backB, sk.pelvis.basis.fwd, { halfW: 14 }));
    const plateCenter = madd(sk.legs.L.foot.ball, [[0, 0, 1], -12], [norm(slide), 2]);
    const plateNormal = scale(slide, 1);
    items.push(E.box(plateCenter, [plateNormal, norm([-plateNormal[1], plateNormal[0], 0]), [0, 0, 1]], [2, 16, 24], { fill: E.FRAME, bias: -4 }));
    [-22, 22].forEach((z) => items.push(E.rod(add(madd(P, [slide, 20]), [0, 0, z]), add(madd(P, [slide, 130]), [0, 0, z]), 1.5, { bias: -16, opacity: 0.6 })));
    items.push(E.loadedPlate(madd(plateCenter, [[0, 0, 1], 30]), [0, 0, 1], 12));
    return items;
  });
};

// Sillón de cuádriceps: sentado, el rodillo en la parte baja de la tibia sube hasta estirar las rodillas.
const legExtension = (o = {}) => (phase) => {
  const setup = seated({ lean: 14, seatY: FLOOR_Y - 50, feet: 'none' });
  const b = mix(92, 5, phase);
  const pose = withBody({ ...setup.pose, legL: { e: 88, p: 4, b }, legR: o.single ? { e: 88, p: 4, b: 92 } : { e: 88, p: 4, b }, footL: { plantar: -5 }, footR: { plantar: -5 } }, (sk) => arms(grab(chestPoint(sk, -6, 4, 24), [-1, 0, 0.5], 90), grab(chestPoint(sk, -6, 4, -24), [-1, 0, -0.5], 90)));
  return scene(pose, (sk) => {
    const items = [setup.props(sk)];
    const shin = sk.legs.L;
    const rollerAt = madd(lerp(shin.mid, shin.end, 0.86), [shin.a2, 4.5]);
    items.push(E.roller([rollerAt[0], rollerAt[1], 0], { half: o.single ? 6 : 14 }), E.lever(add(shin.mid, [0, 0, 22]), [rollerAt[0], rollerAt[1], 22]), E.weightStack(sk.pelvis.o[0] - 40, 0));
    return items;
  });
};

/*
 * Curl femoral. o.mode: 'lying' (camilla), 'seated', 'standing' (máquina de pie), 'cable', 'dumbbell' (acostado con mancuerna),
 * 'ball' (fitball), 'nordic', 'ghr', 'reverseNordic'.
 */
const legCurl = (o = {}) => (phase) => {
  const mode = o.mode ?? 'lying';
  if (mode === 'lying' || mode === 'dumbbell') {
    const P = [0, BENCH_TOP - 14, 0];
    const b = mix(4, 115, phase);
    const pose = withBody({ pelvis: { at: P, pitch: 90 }, spine: { flex: -6 }, neck: { flex: -15 }, legL: { e: 6, p: 0, b }, legR: { e: 6, p: 0, b }, footL: { plantar: mode === 'dumbbell' ? 0 : 20 }, footR: { plantar: mode === 'dumbbell' ? 0 : 20 } }, (sk) => arms(grab(chestPoint(sk, 58, 9, 18), [-0.3, -1, 0.5], 90), grab(chestPoint(sk, 58, 9, -18), [-0.3, -1, -0.5], 90)));
    return scene(pose, (sk) => {
      const items = [E.flatBench(-32, 74, BENCH_TOP)];
      const ankle = lerp(sk.legs.L.end, sk.legs.R.end, 0.5);
      if (mode === 'dumbbell') items.push(E.dumbbell(madd(ankle, [sk.legs.L.foot.dir, 4], [[0, 1, 0], -2]), [0, 0, 1], { r: 6.5 }));
      else items.push(E.roller(madd(ankle, [sk.legs.L.a2, -4.5]), { half: 13 }), E.lever(add(sk.legs.L.mid, [0, 2, 20]), add(madd(ankle, [sk.legs.L.a2, -4.5]), [0, 0, 20])), E.weightStack(-40, 0));
      return items;
    });
  }
  if (mode === 'seated') {
    const setup = seated({ lean: 10, seatY: FLOOR_Y - 48, feet: 'none' });
    const b = mix(8, 112, phase);
    const pose = withBody({ ...setup.pose, legL: { e: 86, p: 4, b }, legR: { e: 86, p: 4, b }, footL: { plantar: 0 }, footR: { plantar: 0 } }, (sk) => arms(grab(chestPoint(sk, -6, 4, 24), [-1, 0, 0.5], 90), grab(chestPoint(sk, -6, 4, -24), [-1, 0, -0.5], 90)));
    return scene(pose, (sk) => {
      const leg = sk.legs.L;
      const roller = madd(lerp(leg.mid, leg.end, 0.9), [leg.a2, -4.5]);
      return [setup.props(sk), E.roller(madd(lerp(leg.root, leg.mid, 0.75), [leg.a1, 7.5]), { half: 14 }), E.roller([roller[0], roller[1], 0], { half: 14 }), E.lever(add(leg.mid, [0, 0, 22]), [roller[0], roller[1], 22]), E.weightStack(sk.pelvis.o[0] - 40, 0)];
    });
  }
  if (mode === 'standing' || mode === 'cable') {
    const b = mix(6, 110, phase);
    const pose = withBody({ pelvis: { at: [0, STAND_HIP_Y + 1, 0], pitch: mode === 'cable' ? 8 : 16 }, legR: { to: [0, ANKLE_Y, -10], pole: [1, 0, -0.1] }, footR: { flat: true }, legL: { e: 10, p: 0, b: Math.max(b, 14) }, footL: { plantar: 10 } }, (sk) => arms(grab(add(shoulderOf(sk, 'L'), [30, 22, 0]), [-0.4, 1, 0.4], 180), grab(add(shoulderOf(sk, 'R'), [30, 22, 0]), [-0.4, 1, -0.4], 180)));
    return scene(pose, (sk) => {
      const ankle = sk.legs.L.end;
      if (mode === 'cable') return [E.cableColumn(ankle[0] + 50, 10, FLOOR_Y - 12), E.cable([ankle[0] + 50, FLOOR_Y - 12, 10], ankle), E.handle('strap', ankle), E.rod(add(fistMid(sk), [0, 0, -20]), add(fistMid(sk), [0, 0, 20]), 1.3), E.post(add(fistMid(sk), [4, 0, 20]))];
      return [E.roller(madd(ankle, [sk.legs.L.a2, -4]), { half: 6 }), E.lever(add(sk.legs.L.mid, [0, 0, 14]), add(madd(ankle, [sk.legs.L.a2, -4]), [0, 0, 14])), E.slantPad(chestPoint(sk, -10, 10), chestPoint(sk, 20, 11), [-1, 0, 0], { halfW: 10 }), E.weightStack(40, 0)];
    });
  }
  if (mode === 'ball') {
    const S = [0, FLOOR_Y - 9, 0];
    const lift = mix(0.15, 1, Math.min(1, phase * 2));
    const pitch = mix(-96, -112, lift);
    const P = pelvisFromShoulders(S, pitch);
    const ballX = mix(P[0] + 64, P[0] + 40, phase);
    const pose = { pelvis: { at: P, pitch }, neck: { flex: 30 }, legL: { to: [ballX, FLOOR_Y - 26, 9], pole: [0, -1, 0.1] }, legR: { to: [ballX, FLOOR_Y - 26, -9], pole: [0, -1, -0.1] }, footL: { plantar: 0 }, footR: { plantar: 0 }, armL: { e: 30, p: 60, b: 0 }, armR: { e: 30, p: 60, b: 0 }, handL: { pr: 180, grip: 'flat' }, handR: { pr: 180, grip: 'flat' } };
    return scene(pose, () => E.sphere([ballX + 2, FLOOR_Y - 16, 0], 16, { fill: E.GEAR, bias: -5 }));
  }
  // Nórdico / GHR / nórdico inverso: de rodillas, el cuerpo se inclina recto desde las rodillas.
  // El GHR se hace en la máquina elevada y arranca con el cuerpo horizontal (sube flexionando las rodillas).
  const ghr = mode === 'ghr';
  const knee = ghr ? [0, FLOOR_Y - 64, 0] : [0, FLOOR_Y - 4.5, 0];
  const lean = mode === 'reverseNordic' ? mix(0, -48, phase) : ghr ? mix(88, 0, phase) : mix(0, 62, phase);
  const thighDir = [Math.sin(rad(lean)), -Math.cos(rad(lean)), 0];
  const P = madd(knee, [thighDir, BODY.thigh]);
  const ankleY = ghr ? knee[1] - 4 : FLOOR_Y - 5;
  const pose = withBody({ pelvis: { at: P, pitch: lean }, legL: { to: [knee[0] - BODY.shin + 1, ankleY, 9], pole: [1, 0.5, 0] }, legR: { to: [knee[0] - BODY.shin + 1, ankleY, -9], pole: [1, 0.5, 0] }, footL: { dir: ghr ? [0, 1, 0] : [-1, 0.2, 0] }, footR: { dir: ghr ? [0, 1, 0] : [-1, 0.2, 0] } }, (sk) => (mode === 'reverseNordic'
    ? arms({ arm: { e: 10, p: 30, b: 10 }, hand: { pr: 90, grip: 'open' } }, { arm: { e: 10, p: 30, b: 10 }, hand: { pr: 90, grip: 'open' } })
    : arms({ arm: { to: chestPoint(sk, 40, 12, 12), pole: [0, 1, 1] }, hand: { pr: 90, grip: 'flat' } }, { arm: { to: chestPoint(sk, 40, 12, -12), pole: [0, 1, -1] }, hand: { pr: 90, grip: 'flat' } })));
  return scene(pose, (sk) => {
    if (ghr) {
      return [
        E.roller(add(knee, [3, 4, 0]), { half: 13, r: 5 }),
        E.aabb([knee[0] - BODY.shin - 6, knee[1] + 2, -18], [knee[0] - BODY.shin + 4, knee[1] + 6, 18], { fill: E.FRAME, bias: -6 }),
        E.roller(add(sk.legs.L.end, [3, -1, -9]), { half: 13, r: 2.6 }),
        E.frame([[knee[0] - 50, FLOOR_Y, 0], [knee[0] - 30, knee[1] + 8, 0], [knee[0] + 6, knee[1] + 8, 0], [knee[0] + 20, FLOOR_Y, 0]], { width: 4 }),
      ];
    }
    const items = [E.pad([-8, FLOOR_Y - 1, 0], [10, FLOOR_Y - 1, 0], 14, 3)];
    if (mode !== 'reverseNordic') items.push(E.roller(madd(sk.legs.L.end, [[0, -1, 0], 4]), { half: 12 }));
    return items;
  });
};

/*
 * Bisagras de cadera (peso muerto rumano y variantes). o.gear: 'barbell' | 'dumbbell' | 'kb'; o.single (a una pierna),
 * o.knee (flexión fija), o.pitch (inclinación final), o.sumo.
 */
const hinge = (o = {}) => (phase) => {
  const pitch = mix(2, o.pitch ?? 78, phase);
  const kneeDrop = o.knee ?? 5;
  const base = o.single
    ? { pelvis: { at: [mix(0, -10, phase), STAND_HIP_Y + 1.5, 0], pitch }, legR: { to: [2, ANKLE_Y, -9], pole: [1, -0.1, -0.1] }, footR: { flat: true, out: 6 }, legL: { e: mix(12, pitch - 30, phase), p: 180, b: mix(25, 6, phase) }, footL: { plantar: 10 } }
    : standing({ x: mix(0, -14, phase), drop: kneeDrop * phase + 1, hinge: pitch, stance: o.stance ?? 11, toeOut: o.toeOut ?? 8, kneeOut: o.kneeOut ?? 0.2 });
  base.neck = { flex: -pitch * 0.25 };
  const pose = withBody(base, (sk) => {
    const hand = (side) => {
      const sh = shoulderOf(sk, side);
      return [sh[0] + 1, sh[1] + 50.5, sideSign(side) * (o.grip ?? 21)];
    };
    const pr = o.gear === 'dumbbell' ? 180 : 180;
    if (o.single) return arms(grab(add(hand('L'), [0, 0, -8]), [-1, 0, 0.2], 90), grab(add(hand('R'), [0, 0, 8]), [-1, 0, -0.2], 90));
    return arms(grab(hand('L'), [-1, 0, 0.15], pr), grab(hand('R'), [-1, 0, -0.15], pr));
  });
  return scene(pose, (sk) => {
    if (o.gear === 'dumbbell' || o.single) return ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), sk.arms[side].hand.thumb));
    if (o.gear === 'kb') return E.kettlebell(fistMid(sk), { across: [0, 0, 1] });
    return E.barbell(fistMid(sk));
  });
};

// Pull through: de espaldas a la polea baja, la soga pasa entre las piernas.
const pullThrough = (phase) => {
  const pitch = mix(70, 2, phase);
  const base = standing({ x: mix(-12, 0, phase), drop: mix(8, 1, phase), hinge: pitch, stance: 16, toeOut: 16, kneeOut: 0.4 });
  const pose = withBody(base, (sk) => {
    const c = phase < 0.5 ? madd(chestPoint(sk, -6, 0), [[0, 1, 0], 16], [[-1, 0, 0], 10]) : chestPoint(sk, -10, 12);
    return arms(grab(add(c, [0, 0, 4]), [-0.5, 0.3, 0.5], 90), grab(add(c, [0, 0, -4]), [-0.5, 0.3, -0.5], 90));
  });
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    const pulley = [-70, FLOOR_Y - 12, 0];
    return [E.cableColumn(pulley[0] - 5, 0, pulley[1]), E.cable(pulley, h), E.polyline([fist(sk, 'L'), add(h, [-3, 3, 0]), fist(sk, 'R')], { color: E.DARK, width: 2.4 })];
  });
};

/*
 * Estocadas y sentadillas divididas. o.mode: 'forward' | 'walking' | 'reverse' | 'static' | 'bulgarian' | 'curtsy' | 'lateral' |
 * 'cossack' | 'skater' | 'stepUp'. o.gear: 'dumbbells' | 'barbell' | 'smith' | 'none'.
 */
const lunge = (o = {}) => (phase) => {
  const mode = o.mode ?? 'forward';
  const t = mode === 'walking' ? Math.min(1, phase * 1.4) : phase;
  let pose;
  if (mode === 'lateral' || mode === 'cossack') {
    const shift = mix(0, mode === 'cossack' ? 30 : 24, t);
    const drop = mix(0, mode === 'cossack' ? 46 : 34, t);
    pose = {
      pelvis: { at: [mix(0, -10, t), STAND_HIP_Y + 1 + drop, shift], pitch: mix(2, 34, t) },
      legL: { to: [2, ANKLE_Y, 34], pole: [1, -0.2, 0.3] }, legR: { to: [2, ANKLE_Y, -34], pole: [1, -0.2, -0.2] },
      footL: { flat: true, out: 14 }, footR: mode === 'cossack' ? { plantar: -40, out: 70 } : { flat: true, out: 10 },
    };
  } else if (mode === 'skater') {
    pose = {
      pelvis: { at: [mix(0, -8, t), STAND_HIP_Y + 1 + mix(0, 36, t), 0], pitch: mix(4, 44, t) },
      legL: { to: [4, ANKLE_Y, 9], pole: [1, -0.1, 0.1] }, footL: { flat: true, out: 6 },
      legR: { e: mix(10, 20, t), p: 180, b: mix(70, 95, t) }, footR: { plantar: 30 },
    };
  } else if (mode === 'stepUp') {
    const boxTop = FLOOR_Y - 44;
    const up = t;
    pose = {
      pelvis: { at: [mix(-10, 18, up), mix(STAND_HIP_Y + 14, boxTop - 69 - 5 + 1, up), 0], pitch: mix(10, 2, up) },
      legL: { to: [26, boxTop - BODY.ankleH, 10], pole: [1, -0.3, 0.2] }, footL: { flat: true },
      legR: up < 0.5 ? { to: [-14, ANKLE_Y - mix(0, 6, up * 2), -10], pole: [1, 0, -0.2] } : { e: mix(0, 20, (up - 0.5) * 2), p: 0, b: mix(20, 70, (up - 0.5) * 2) },
      footR: up < 0.5 ? { flat: up < 0.2, plantar: 20 } : { plantar: 20 },
    };
  } else {
    const frontX = { forward: mix(0, 32, t), walking: mix(0, 34, t), reverse: 6, static: 22, bulgarian: 20, curtsy: 4 }[mode];
    const backX = { forward: -4, walking: -4, reverse: mix(0, -40, t), static: -26, bulgarian: -40, curtsy: mix(0, -26, t) }[mode];
    const backZ = mode === 'curtsy' ? mix(-9, 22, t) : -9;
    const backY = mode === 'bulgarian' ? BENCH_TOP - 1 : ANKLE_Y - mix(0, 5, t);
    const drop = mix(0, mode === 'bulgarian' ? 40 : 36, t);
    const hipX = (frontX + backX) / 2 + (mode === 'bulgarian' ? 2 : 0);
    pose = {
      pelvis: { at: [hipX, STAND_HIP_Y + 1 + drop, mode === 'curtsy' ? mix(0, 4, t) : 0], pitch: mix(2, mode === 'bulgarian' ? 16 : 6, t), yaw: mode === 'curtsy' ? mix(0, 14, t) : 0 },
      legL: { to: [frontX, ANKLE_Y, 10], pole: [1, -0.2, 0.15] }, footL: { flat: true, out: 6 },
      legR: { to: [backX, backY, backZ], pole: [1, 0.5, 0] }, footR: mode === 'bulgarian' ? { dir: [-0.9, 0.45, 0] } : { plantar: mix(0, 40, t) },
    };
  }
  pose.neck = { flex: -4 };
  const gear = o.gear ?? 'dumbbells';
  const full = withBody(pose, (sk) => {
    if (gear === 'barbell' || gear === 'smith') {
      const bar = chestPoint(sk, 46.5, -8);
      return arms(grab(add(bar, [0, 0, 28]), [-0.2, 1, 0.8], 100), grab(add(bar, [0, 0, -28]), [-0.2, 1, -0.8], 100));
    }
    if (gear === 'none') return mode === 'cossack' || mode === 'skater' ? armsForward : handsOnHips(sk);
    if (gear === 'goblet') {
      const c = chestPoint(sk, 34, 16);
      return arms(grab(add(c, [0, 0, 4]), [0, 1, 0.4], 20, { grip: 'flat' }), grab(add(c, [0, 0, -4]), [0, 1, -0.4], 20, { grip: 'flat' }));
    }
    return arms(grab(add(shoulderOf(sk, 'L'), [1, 50.5, 4]), [-1, 0, 0.2], 90), grab(add(shoulderOf(sk, 'R'), [1, 50.5, -4]), [-1, 0, -0.2], 90));
  });
  return scene(full, (sk) => {
    const items = [];
    if (gear === 'barbell' || gear === 'smith') items.push(E.barbell(fistMid(sk)));
    if (gear === 'smith') items.push(E.smithRails(fistMid(sk)[0] - 2));
    if (gear === 'dumbbells') ['L', 'R'].forEach((side) => items.push(E.dumbbell(fist(sk, side), [1, 0, 0])));
    if (gear === 'goblet') items.push(E.dumbbell(add(fistMid(sk), [2, 5, 0]), [0, 1, 0], { r: 7 }));
    if (mode === 'bulgarian') items.push(E.flatBench(-90, -32, BENCH_TOP));
    if (mode === 'stepUp') items.push(E.plyoBox(8, 50, 44));
    return items;
  });
};

// Sissy squat: talones elevados, rodillas hacia adelante y el tronco recto hacia atrás.
const sissySquat = (phase) => {
  const ankle = [0, ANKLE_Y - 3, 0];
  const kneeBend = mix(5, 120, phase);
  const pose = withBody({
    pelvis: { at: [mix(0, 22, phase), STAND_HIP_Y + mix(1, 32, phase), 0], pitch: mix(0, -40, phase) },
    legL: { to: add(ankle, [0, 0, 9]), pole: [1, 0, 0.1] }, legR: { to: add(ankle, [0, 0, -9]), pole: [1, 0, -0.1] },
    footL: { plantar: 35 }, footR: { plantar: 35 },
  }, (sk) => arms({ arm: { to: add(shoulderOf(sk, 'L'), [10, 30, 22]), pole: [0, 1, 1] }, hand: { pr: 90, grip: 'fist' } }, { arm: { e: 70, p: 10, b: 10 + kneeBend * 0 }, hand: { pr: 90, grip: 'open' } }));
  return scene(pose, (sk) => E.post([fist(sk, 'L')[0], fist(sk, 'L')[1] - 30, fist(sk, 'L')[2] + 3], { r: 2 }));
};

// Sentadilla española: banda detrás de las rodillas anclada adelante; tibias verticales y cadera hacia atrás.
const spanishSquat = (phase) => {
  const base = standing({ x: mix(0, -26, phase), drop: mix(0, 36, phase), hinge: mix(2, 14, phase), stance: 12, kneeOut: 0.2 });
  const pose = { ...base, ...armsForward };
  return scene(pose, (sk) => {
    const knee = lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5);
    return [E.band(add(sk.legs.L.mid, [-5, 0, 0]), [knee[0] + 60, knee[1] + 4, 14]), E.band(add(sk.legs.R.mid, [-5, 0, 0]), [knee[0] + 60, knee[1] + 4, -14]), E.post([knee[0] + 62, knee[1], 0], { r: 2 })];
  });
};

/*
 * Glúteos: hip thrust (o.gear 'barbell' | 'machine' | 'smith' | 'none', o.single), puente en el piso (o.floor),
 * frog pump (o.frog).
 */
const hipThrust = (o = {}) => (phase) => {
  const floor = o.floor;
  const S = floor ? [0, FLOOR_Y - 9, 0] : [0, BENCH_TOP - 5, 0];
  const pitch = floor ? mix(-92, -122, phase) : mix(-52, -92, phase);
  const P = pelvisFromShoulders(S, pitch);
  const footX = floor ? P[0] + (o.frog ? 22 : 30) : S[0] + 76;
  const pose = withBody({
    pelvis: { at: P, pitch },
    legL: { to: [footX, ANKLE_Y, o.frog ? 4 : 14], pole: o.frog ? [0, -0.3, 1] : [0.3, -1, 0.3] },
    legR: o.single ? { e: mix(80, 110, phase), p: 0, b: 90 } : { to: [footX, ANKLE_Y, o.frog ? -4 : -14], pole: o.frog ? [0, -0.3, -1] : [0.3, -1, -0.3] },
    footL: o.frog ? { dir: [0.3, 0.3, -1] } : { flat: true, out: 10 }, footR: o.single ? { plantar: 0 } : o.frog ? { dir: [0.3, 0.3, 1] } : { flat: true, out: 10 },
    neck: { flex: floor ? 35 : 25 },
  }, (sk) => {
    if (o.gear === 'barbell' || o.gear === 'smith') {
      const bar = chestPoint(sk, -2, 13);
      return arms(grab(add(bar, [0, 0, 24]), [0, -1, 0.4], 180), grab(add(bar, [0, 0, -24]), [0, -1, -0.4], 180));
    }
    if (o.gear === 'machine') return arms(grab(chestPoint(sk, 0, 4, 22), [-0.5, -1, 0.5], 90), grab(chestPoint(sk, 0, 4, -22), [-0.5, -1, -0.5], 90));
    return floor ? arms({ arm: { e: 20, p: 30, b: 0 }, hand: { pr: 180, grip: 'flat' } }, { arm: { e: 20, p: 30, b: 0 }, hand: { pr: 180, grip: 'flat' } }) : arms({ arm: { e: 95, p: 80, b: 70 }, hand: { pr: 90, grip: 'flat' } }, { arm: { e: 95, p: 80, b: 70 }, hand: { pr: 90, grip: 'flat' } });
  });
  return scene(pose, (sk) => {
    const items = [];
    if (!floor) items.push(E.flatBench(-50, 8, BENCH_TOP - 4, { halfW: 30 }));
    if (o.gear === 'barbell' || o.gear === 'smith') items.push(E.barbell(chestPoint(sk, -2, 13)));
    if (o.gear === 'smith') items.push(E.smithRails(chestPoint(sk, -2, 13)[0]));
    if (o.gear === 'machine') items.push(E.slantPad(chestPoint(sk, -8, 13), chestPoint(sk, 8, 13), scale(sk.pelvis.basis.fwd, 1), { halfW: 16 }), E.lever(add(chestPoint(sk, 0, 14), [-40, 24, 0]), chestPoint(sk, 0, 14)), E.loadedPlate(add(chestPoint(sk, 0, 14), [-40, 24, 30]), [0, 0, 1], 12));
    if (o.gear === 'band') items.push(E.band(add(sk.legs.L.mid, [0, 0, 5]), add(sk.legs.R.mid, [0, 0, -5])));
    return items;
  });
};

// Cuadrupedia: patada de glúteo (o.kick 'back'), hidrante (o.kick 'side'), en polea o máquina.
const quadruped = (o = {}) => (phase) => {
  const P = [0, FLOOR_Y - 4.5 - BODY.thigh, 0];
  const base = {
    pelvis: { at: P, pitch: 88 },
    legR: { e: 90, p: 0, b: 92 }, footR: { plantar: 40 },
    neck: { flex: -25 },
  };
  if (o.kick === 'side') Object.assign(base, { legL: { e: 90, p: mix(0, 62, phase), b: 92, r: mix(0, -20, phase) }, footL: { plantar: 40 } });
  else Object.assign(base, { legL: { e: mix(90, 4, phase), p: 0, b: o.straight ? mix(92, 6, phase) : 92 }, footL: { plantar: o.straight ? 20 : 0 } });
  const pose = withBody(base, (sk) => arms(palmDown([shoulderOf(sk, 'L')[0] + 2, FLOOR_Y - 2.6, 15], [-1, 0, 0.3], 100), palmDown([shoulderOf(sk, 'R')[0] + 2, FLOOR_Y - 2.6, -15], [-1, 0, -0.3], 100)));
  return scene(pose, (sk) => {
    if (o.gear === 'cable') return [E.cableColumn(-80, 9, FLOOR_Y - 12), E.cable([-80, FLOOR_Y - 12, 9], sk.legs.L.end), E.handle('strap', sk.legs.L.end)];
    return [];
  });
};

// Patada de glúteo de pie (polea al tobillo, multicadera o máquina con apoyo de pecho).
const standingKick = (o = {}) => (phase) => {
  const machine = o.gear === 'machine';
  const base = {
    pelvis: { at: [0, STAND_HIP_Y + (machine ? 8 : 1), 0], pitch: machine ? 40 : o.gear === 'cable' ? 14 : 6 },
    legR: { to: [machine ? -6 : 0, ANKLE_Y, -10], pole: [1, -0.1, -0.1] }, footR: { flat: true },
    legL: o.abduct ? { e: mix(8, 42, phase), p: 90, b: 6 } : { e: mix(o.gear === 'multi' ? 30 : 10, o.gear === 'multi' ? 4 : 40, phase), p: o.gear === 'multi' ? (phase < 0.5 ? 0 : 180) : 180, b: o.gear === 'multi' ? 10 : 14 },
    footL: { plantar: 10 },
  };
  if (o.gear === 'multi' && !o.abduct) base.legL = { e: mix(35, 30, phase), p: mix(0, 180, phase), b: 8 };
  const pose = withBody(base, (sk) => arms(grab(add(shoulderOf(sk, 'L'), machine ? [18, 30, 0] : [26, 18, 0]), [-0.4, 1, 0.4], 180), grab(add(shoulderOf(sk, 'R'), machine ? [18, 30, 0] : [26, 18, 0]), [-0.4, 1, -0.4], 180)));
  return scene(pose, (sk) => {
    const items = [];
    const ankle = sk.legs.L.end;
    const knee = sk.legs.L.mid;
    if (o.gear === 'cable') items.push(E.cableColumn(ankle[0] + 60, 10, FLOOR_Y - 12), E.cable([ankle[0] + 60, FLOOR_Y - 12, 10], ankle), E.handle('strap', ankle));
    if (o.gear === 'multi') items.push(E.roller(madd(lerp(sk.legs.L.root, knee, 0.85), [o.abduct ? [0, 0, 1] : sk.legs.L.a1, o.abduct ? 6 : -6]), { half: 5, axis: o.abduct ? [1, 0, 0] : [0, 0, 1] }), E.lever(add(sk.legs.L.root, [0, 0, 14]), add(madd(lerp(sk.legs.L.root, knee, 0.85), [sk.legs.L.a1, -6]), [0, 0, 6])), E.weightStack(-50, 0));
    if (machine) items.push(E.slantPad(chestPoint(sk, 10, BODY.chestFront + 1), chestPoint(sk, 40, BODY.chestFront + 1), scale(sk.pelvis.basis.fwd, -1), { halfW: 12 }), E.lever(add(sk.legs.L.root, [0, 0, 16]), add(sk.legs.L.foot.heel, [0, 0, 6])), E.weightStack(60, 0));
    items.push(E.rod(add(fistMid(sk), [0, 0, -20]), add(fistMid(sk), [0, 0, 20]), 1.3), E.post(add(fistMid(sk), [2, 0, 20])));
    return items;
  });
};

// Máquinas sentado de aductores / abductores: rodillas que se juntan o se separan contra los apoyos.
const seatedAbAd = (o = {}) => (phase) => {
  const setup = seated({ lean: 18, seatY: FLOOR_Y - 46, feet: 'none' });
  const open = o.out ? mix(10, 42, phase) : mix(42, 10, phase);
  const pose = withBody({ ...setup.pose, legL: { e: 88, p: open, b: 92, r: -open * 0.4 }, legR: { e: 88, p: open, b: 92, r: -open * 0.4 }, footL: { plantar: 0 }, footR: { plantar: 0 } }, (sk) => arms(grab(chestPoint(sk, -6, 4, 24), [-1, 0, 0.5], 90), grab(chestPoint(sk, -6, 4, -24), [-1, 0, -0.5], 90)));
  return scene(pose, (sk) => {
    const items = [setup.props(sk), E.weightStack(sk.pelvis.o[0] - 40, 0)];
    ['L', 'R'].forEach((side) => {
      const knee = sk.legs[side].mid;
      const off = sideSign(side) * (o.out ? 6 : -6);
      items.push(E.pad(add(knee, [-14, 0, off]), add(knee, [6, 0, off]), 2.5, 5, [0, 0, -sideSign(side) * (o.out ? -1 : 1)]), E.lever(add(sk.pelvis.o, [0, 10, 0]), add(knee, [-4, 6, off])));
    });
    return items;
  });
};

// Aducción / abducción de pie en polea (tobillera), de costado a la columna.
const cableHip = (o = {}) => (phase) => {
  const pose = withBody({
    pelvis: { at: [0, STAND_HIP_Y + 1, 0], pitch: 2, roll: o.out ? -4 : 4 },
    legR: { to: [0, ANKLE_Y, -11], pole: [1, -0.1, -0.1] }, footR: { flat: true },
    legL: { e: o.out ? mix(10, 40, phase) : mix(30, 8, phase), p: o.out ? 90 : mix(90, -60, phase), b: o.out ? mix(22, 6, phase) : 10 }, footL: { plantar: 10 },
  }, (sk) => arms({ arm: { e: 8, p: 60, b: 30 }, hand: { pr: 90, grip: 'flat' } }, grab(add(shoulderOf(sk, 'R'), [6, 20, -18]), [-0.4, 1, -0.4], 90)));
  return scene(pose, (sk) => {
    const ankle = sk.legs.L.end;
    const pulley = [ankle[0], FLOOR_Y - 12, o.out ? -80 : 80];
    return [E.cableColumn(pulley[0], pulley[2], pulley[1]), E.cable(pulley, ankle), E.handle('strap', ankle), E.post(add(fist(sk, 'R'), [0, -10, -3]), { r: 2 })];
  });
};

// Acostado de costado: almeja (rodillas flexionadas que se abren) y elevación lateral de pierna estirada.
const sideLying = (o = {}) => (phase) => {
  // Acostado de costado: el hombro de abajo sostiene el tronco unos 17 cm sobre el piso.
  const P = [0, FLOOR_Y - 17, 0];
  const legs = o.clam
    ? { legL: { e: 45, p: mix(0, 45, phase), b: 85, r: mix(0, -40, phase) }, legR: { e: 45, p: 0, b: 85 }, footL: { plantar: 10 }, footR: { plantar: 10 } }
    : { legL: { e: mix(4, 40, phase), p: 90, b: 0 }, legR: { e: 10, p: 0, b: 25 }, footL: { plantar: 15 }, footR: { plantar: 15 } };
  const pose = { pelvis: { at: P, pitch: -90, roll: 90 }, ...legs, armL: { e: 30, p: 60, b: 80 }, handL: { pr: 90, grip: 'flat' }, armR: { e: 150, p: 8, b: 115 }, handR: { pr: 90, grip: 'open' }, neck: { side: 15 } };
  return scene(pose, (sk) => (o.band ? E.band(add(sk.legs.L.mid, [0, 2, 0]), add(sk.legs.R.mid, [0, -2, 0])) : []));
};

// Caminata lateral con banda: media sentadilla con pasos laterales.
const bandWalk = (phase) => {
  const step = track(phase, [[0, 0], [0.5, 12], [1, 0]]);
  const pose = { ...standing({ drop: 12, hinge: 18, stance: 13 + step, kneeOut: 0.5 }), ...armsForward };
  pose.pelvis.at = add(pose.pelvis.at, [0, 0, step / 2]);
  pose.legL.to = add(pose.legL.to, [0, 0, step]);
  return scene(pose, (sk) => E.band(add(sk.legs.L.mid, [0, 2, -3]), add(sk.legs.R.mid, [0, 2, 3])));
};

// Hiperextensión inversa: boca abajo en la máquina, las piernas suben por detrás hasta la horizontal.
const reverseHyper = (phase) => {
  const P = [0, FLOOR_Y - 84, 0];
  const pose = withBody({ pelvis: { at: P, pitch: 90 }, legL: { e: mix(88, 4, phase), p: 0, b: 6 }, legR: { e: mix(88, 4, phase), p: 0, b: 6 }, footL: { plantar: 20 }, footR: { plantar: 20 }, neck: { flex: -20 } }, (sk) => arms(grab(chestPoint(sk, 58, 9, 18), [-0.3, -1, 0.5], 90), grab(chestPoint(sk, 58, 9, -18), [-0.3, -1, -0.5], 90)));
  return scene(pose, (sk) => [E.slantPad(chestPoint(sk, 0, -BODY.chestFront - 0.5), chestPoint(sk, 46, -BODY.chestFront - 0.5), [0, -1, 0], { halfW: 13 }), E.post(chestPoint(sk, 20, -16), { r: 2 }), E.roller(madd(lerp(sk.legs.L.end, sk.legs.R.end, 0.5), [[0, 1, 0], 0]), { half: 12 }), E.lever(add(chestPoint(sk, -6, -14), [0, 0, 0]), lerp(sk.legs.L.end, sk.legs.R.end, 0.5))]);
};

/*
 * Pantorrillas. o.mode: 'step' (de pie en escalón), 'machine', 'smith', 'dumbbells', 'single', 'donkey', 'hack', 'press' (prensa),
 * 'seated' (sóleo), 'tibial' (elevación de puntas).
 */
const calfRaise = (o = {}) => (phase) => {
  const mode = o.mode ?? 'step';
  if (mode === 'press') {
    const back = -55;
    const P = [0, FLOOR_Y - 40, 0];
    const plantar = mix(-12, 32, phase);
    const plate = madd(P, [[Math.cos(rad(45)), -Math.sin(rad(45)), 0], 66]);
    const fd = norm([Math.cos(rad(45 + 90 - plantar)) * -1, -Math.sin(rad(45 + 90 - plantar)), 0]);
    const ankle = madd(plate, [fd, -12], [[Math.cos(rad(45)), -Math.sin(rad(45)), 0], -5]);
    const pose = withBody({ pelvis: { at: P, pitch: back }, legL: { to: add(ankle, [0, 0, 11]), pole: [0, -1, 0.2] }, legR: { to: add(ankle, [0, 0, -11]), pole: [0, -1, -0.2] }, footL: { dir: fd }, footR: { dir: fd } }, (sk) => arms(grab(chestPoint(sk, -6, 2, 24), [-1, 0, 0.5], 90), grab(chestPoint(sk, -6, 2, -24), [-1, 0, -0.5], 90)));
    return scene(pose, (sk) => {
      const ball = lerp(sk.legs.L.foot.ball, sk.legs.R.foot.ball, 0.5);
      const slideDir = [Math.cos(rad(45)), -Math.sin(rad(45)), 0];
      return [E.slantPad(chestPoint(sk, -12, -10), chestPoint(sk, 50, -10), sk.pelvis.basis.fwd, { halfW: 14 }), E.box(madd(ball, [slideDir, 4.5], [[0.707, 0.707, 0], 6]), [slideDir, [0.707, 0.707, 0], [0, 0, 1]], [2, 16, 24], { fill: E.FRAME, bias: -4 })];
    });
  }
  if (mode === 'seated') {
    const setup = seated({ lean: 0, seatY: FLOOR_Y - 44, feet: 'none' });
    const plantar = mix(-15, 30, phase);
    const ball = [30, FLOOR_Y - 12, 0];
    const fd = [Math.cos(rad(plantar)), Math.sin(rad(plantar)), 0];
    const fu = [Math.sin(rad(plantar)), -Math.cos(rad(plantar)), 0];
    const ankle = madd(ball, [fd, -12], [fu, 5]);
    const pose = withBody({ ...setup.pose, legL: { to: add(ankle, [0, 0, 10]), pole: [1, -1, 0.1] }, legR: { to: add(ankle, [0, 0, -10]), pole: [1, -1, -0.1] }, footL: { dir: fd }, footR: { dir: fd } }, (sk) => arms(grab(add(sk.legs.L.mid, [2, -8, 0]), [-1, 0, 0.5], 180), grab(add(sk.legs.R.mid, [2, -8, 0]), [-1, 0, -0.5], 180)));
    return scene(pose, (sk) => [setup.props(sk), E.pad(add(sk.legs.L.mid, [-14, -5, -16]), add(sk.legs.L.mid, [6, -5, -16]), 1, 1), E.roller(add(lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5), [-4, -6, 0]), { half: 16 }), E.aabb([ball[0] - 10, FLOOR_Y - 12, -18], [ball[0] + 6, FLOOR_Y, 18], { fill: E.FRAME, bias: -8 }), E.lever(add(lerp(sk.legs.L.mid, sk.legs.R.mid, 0.5), [-4, -6, 22]), [-30, FLOOR_Y - 14, 22]), E.loadedPlate([-30, FLOOR_Y - 14, 26], [0, 0, 1], 11)]);
  }
  if (mode === 'tibial') {
    const plantar = mix(15, -28, phase);
    const heel = [0, FLOOR_Y - 12, 0];
    const fd = [Math.cos(rad(plantar)), Math.sin(rad(plantar)), 0];
    const fu = [Math.sin(rad(plantar)), -Math.cos(rad(plantar)), 0];
    const ankle = madd(heel, [fd, BODY.heel], [fu, BODY.ankleH]);
    const pose = withBody({ pelvis: { at: [ankle[0] - 14, ankle[1] - 68, 0], pitch: -10 }, legL: { to: add(ankle, [0, 0, 10]), pole: [1, 0, 0.1] }, legR: { to: add(ankle, [0, 0, -10]), pole: [1, 0, -0.1] }, footL: { dir: fd }, footR: { dir: fd } }, () => ({}));
    return scene({ ...pose, armL: { e: 10, p: 40, b: 20 }, armR: { e: 10, p: 40, b: 20 } }, (sk) => [E.aabb([-14, FLOOR_Y - 12, -20], [6, FLOOR_Y, 20], { fill: E.FRAME, bias: -8 }), E.line([sk.pelvis.o[0] - 12, FLOOR_Y, 0], [sk.pelvis.o[0] - 12, FLOOR_Y - 180, 0], { color: E.FRAME, width: 4, bias: -30 })]);
  }
  // De pie (escalón, máquina, multipower, mancuernas, una pierna, burro, hack).
  const plantar = mix(-14, 34, phase);
  const stepTop = FLOOR_Y - 10;
  const ball = [10, stepTop, 0];
  const fd = [Math.cos(rad(plantar)), Math.sin(rad(plantar)), 0];
  const fu = [Math.sin(rad(plantar)), -Math.cos(rad(plantar)), 0];
  const ankle = madd(ball, [fd, -12], [fu, 5]);
  const donkey = mode === 'donkey';
  const hack = mode === 'hack';
  const pitch = donkey ? 88 : hack ? -14 : mode === 'single' ? 4 : 2;
  const legLen = BODY.thigh + BODY.shin - 0.4;
  const legDir = donkey ? [0.05, -1, 0] : [Math.sin(rad(hack ? -14 : 0)), -1, 0];
  const P = madd(ankle, [norm(legDir), legLen]);
  const base = { pelvis: { at: P, pitch }, legL: { to: add(ankle, [0, 0, 10]), pole: [1, 0, 0.1] }, footL: { dir: fd } };
  if (mode === 'single') Object.assign(base, { legR: { e: 4, p: 180, b: 80 }, footR: { plantar: 20 } });
  else Object.assign(base, { legR: { to: add(ankle, [0, 0, -10]), pole: [1, 0, -0.1] }, footR: { dir: fd } });
  const pose = withBody(base, (sk) => {
    if (mode === 'smith' || mode === 'machine') {
      const bar = chestPoint(sk, 46.5, -8);
      return arms(grab(add(bar, [0, 0, 26]), [-0.2, 1, 0.8], 100), grab(add(bar, [0, 0, -26]), [-0.2, 1, -0.8], 100));
    }
    if (mode === 'dumbbells') return arms(grab(add(shoulderOf(sk, 'L'), [1, 50.5, 4]), [-1, 0, 0.2], 90), grab(add(shoulderOf(sk, 'R'), [1, 50.5, -4]), [-1, 0, -0.2], 90));
    if (mode === 'single') return arms(grab(add(shoulderOf(sk, 'L'), [1, 50.5, 4]), [-1, 0, 0.2], 90), grab(add(shoulderOf(sk, 'R'), [24, 26, -6]), [-0.4, 1, -0.4], 90));
    if (donkey) return arms(palmDown([shoulderOf(sk, 'L')[0] + 2, FLOOR_Y - 60, 15], [-1, 0, 0.3], 100), palmDown([shoulderOf(sk, 'R')[0] + 2, FLOOR_Y - 60, -15], [-1, 0, -0.3], 100));
    if (hack) return arms(grab(add(shoulderOf(sk, 'L'), [6, -8, 2]), [-0.5, 1, 0.5], 90), grab(add(shoulderOf(sk, 'R'), [6, -8, -2]), [-0.5, 1, -0.5], 90));
    return arms(grab(add(shoulderOf(sk, 'L'), [24, 26, 6]), [-0.4, 1, 0.4], 90), { arm: { e: 8, p: 40, b: 20 }, hand: { pr: 90, grip: 'open' } });
  });
  return scene(pose, (sk) => {
    const items = [E.aabb([-6, stepTop, -22], [14, FLOOR_Y, 22], { fill: E.FRAME, bias: -8 })];
    if (mode === 'smith') items.push(E.barbell(chestPoint(sk, 46.5, -8)), E.smithRails(chestPoint(sk, 46.5, -8)[0] - 2));
    if (mode === 'machine') {
      ['L', 'R'].forEach((side) => items.push(E.roller(add(shoulderOf(sk, side), [0, -4, 0]), { axis: [1, 0, 0], half: 5, r: 3.4 })));
      items.push(E.weightStack(-36, 0), E.lever(add(shoulderOf(sk, 'L'), [-30, -6, 0]), add(shoulderOf(sk, 'L'), [0, -6, 0])));
    }
    if (mode === 'dumbbells' || mode === 'single') (mode === 'single' ? ['L'] : ['L', 'R']).forEach((side) => items.push(E.dumbbell(fist(sk, side), [1, 0, 0])));
    if (mode === 'single' || mode === 'step') items.push(E.post([fist(sk, mode === 'single' ? 'R' : 'L')[0] + 2, fist(sk, mode === 'single' ? 'R' : 'L')[1] - 30, fist(sk, mode === 'single' ? 'R' : 'L')[2]], { r: 2 }));
    if (donkey) items.push(E.aabb([shoulderOf(sk, 'L')[0] - 12, FLOOR_Y - 58, -22], [shoulderOf(sk, 'L')[0] + 14, FLOOR_Y, 22], { fill: E.FRAME, bias: -10, opacity: 0.7 }), E.slantPad(chestPoint(sk, -12, -10), chestPoint(sk, 8, -10), sk.pelvis.basis.fwd, { halfW: 12 }));
    if (hack) {
      items.push(E.slantPad(chestPoint(sk, 0, -10), chestPoint(sk, 46, -9.5), sk.pelvis.basis.fwd, { halfW: 13 }));
      ['L', 'R'].forEach((side) => items.push(E.roller(add(shoulderOf(sk, side), [3, -5, 0]), { axis: [1, 0, 0], half: 5, r: 3.4 })));
    }
    return items;
  });
};

// Saltos de tobillo (pogo): rebotes cortos con las rodillas casi estiradas.
const pogo = (phase) => {
  const air = track(phase, [[0, 0], [0.5, 12], [1, 0]]);
  const plantar = track(phase, [[0, 5], [0.5, 40], [1, 20]]);
  const pose = { pelvis: { at: [0, STAND_HIP_Y + 1 - air + (plantar > 20 ? -4 : 0), 0] }, legL: { e: 2, p: 0, b: 6 }, legR: { e: 2, p: 0, b: 6 }, footL: { plantar }, footR: { plantar }, armL: { e: 20, p: 10, b: 80 }, armR: { e: 20, p: 10, b: 80 }, handL: { pr: 90, grip: 'fist' }, handR: { pr: 90, grip: 'fist' } };
  const sk = scene(pose);
  const lowest = Math.max(sk.skeleton.legs.L.foot.toe[1], sk.skeleton.legs.L.foot.heel[1]);
  const lift = FLOOR_Y - 0.5 - lowest - air;
  pose.pelvis.at = add(pose.pelvis.at, [0, lift, 0]);
  return scene(pose);
};

// Caminata en puntas de pie con mancuernas.
const tiptoeWalk = (phase) => {
  const stride = track(phase, [[0, 0], [0.5, 1], [1, 0]]);
  const pose = withBody({
    pelvis: { at: [0, STAND_HIP_Y - 6, 0], pitch: 2 },
    legL: { to: [mix(-8, 12, stride), ANKLE_Y - 7, 9], pole: [1, 0, 0.1] }, legR: { to: [mix(12, -8, stride), ANKLE_Y - 7, -9], pole: [1, 0, -0.1] },
    footL: { plantar: 40 }, footR: { plantar: 40 },
  }, (sk) => arms(grab(add(shoulderOf(sk, 'L'), [1, 50.5, 4]), [-1, 0, 0.2], 90), grab(add(shoulderOf(sk, 'R'), [1, 50.5, -4]), [-1, 0, -0.2], 90)));
  return scene(pose, (sk) => ['L', 'R'].map((side) => E.dumbbell(fist(sk, side), [1, 0, 0])));
};

export const LEG_FIGURES = {
  // Sentadillas
  SENTADILLA: { build: squat({ bar: 'high', pitch: 36, drop: 38 }) },
  'SENTADILLA BARRA BAJA': { build: squat({ bar: 'low', pitch: 50, drop: 34, back: -20, stance: 16 }) },
  'SENTADILLA FRONTAL': { build: squat({ bar: 'front', pitch: 18, drop: 40, back: -8 }) },
  'SENTADILLA ZERCHER': { build: squat({ bar: 'zercher', pitch: 22, drop: 38, back: -10 }) },
  'SENTADILLA GOBLET': { build: squat({ bar: 'goblet', pitch: 22, drop: 40, back: -10 }) },
  'SENTADILLA CON MANCUERNAS': { build: squat({ bar: 'dumbbells', pitch: 30, drop: 34, back: -12, stance: 12 }), view: 'front' },
  'SENTADILLA SUMO': { build: squat({ bar: 'kb', pitch: 14, drop: 36, back: -8, stance: 26, toeOut: 38, kneeOut: 1 }), view: 'front' },
  'SENTADILLA EN MULTIPOWER': { build: squat({ bar: 'high', smith: true, pitch: 18, drop: 36, back: -4, footX: 12 }) },
  'SENTADILLA EN CAJON': { build: squat({ bar: 'high', box: true, pitch: 42, drop: 34, back: -22, stance: 18 }) },
  'SENTADILLA SIN PESO': { build: squat({ bar: 'none', pitch: 30, drop: 40 }) },
  'SENTADILLA ISOMETRICA EN PARED': { build: squat({ bar: 'none', wall: true, pitch: 0, pitch0: 0, drop: 36, back: 0, footX: 32 }) },
  'SENTADILLA BELT': { build: squat({ bar: 'belt', belt: true, pitch: 12, drop: 38, back: -8, stance: 16 }) },
  'SENTADILLA HACK CON BARRA': { build: squat({ bar: 'hack', pitch: 26, drop: 36, back: -10, stance: 11 }) },
  'SENTADILLA HACK': { build: machineSquat({ angle: 45 }) },
  'SENTADILLA V': { build: machineSquat({ angle: 52, lean: 10, plates: true, footX: 16 }) },
  'SENTADILLA PENDULAR': { build: machineSquat({ angle: 70, kind: 'pendulum', travel: 34, footX: 8 }) },
  'HACK INVERSA': { build: machineSquat({ angle: 45, facing: 'pad', footX: 22, travel: 30 }) },
  'PRENSA 45': { build: legPress({ kind: '45' }) },
  'PRENSA HORIZONTAL': { build: legPress({ kind: 'horizontal' }) },
  'PRENSA VERTICAL': { build: legPress({ kind: 'vertical' }) },
  'PRENSA UNILATERAL': { build: legPress({ kind: '45', single: true }) },
  'SILLON DE CUADRICEPS': { build: legExtension({}) },
  'SILLON DE CUADRICEPS UNILATERAL': { build: legExtension({ single: true }), view: 'front' },
  'SISSY SQUAT': { build: sissySquat },
  'SENTADILLA ESPAÑOLA': { build: spanishSquat },
  // Isquiotibiales
  'CAMILLA DE ISQUIOTIBIALES': { build: legCurl({ mode: 'lying' }) },
  'CURL FEMORAL CON MANCUERNA': { build: legCurl({ mode: 'dumbbell' }) },
  'CURL FEMORAL SENTADO': { build: legCurl({ mode: 'seated' }) },
  'CURL FEMORAL PARADO': { build: legCurl({ mode: 'standing' }) },
  'CURL FEMORAL EN POLEA': { build: legCurl({ mode: 'cable' }) },
  'CURL FEMORAL CON FITBALL': { build: legCurl({ mode: 'ball' }) },
  'CURL NORDICO': { build: legCurl({ mode: 'nordic' }) },
  'GLUTE HAM RAISE': { build: legCurl({ mode: 'ghr' }) },
  'NORDICO INVERSO': { build: legCurl({ mode: 'reverseNordic' }) },
  'PESO MUERTO RUMANO': { build: hinge({ pitch: 72, knee: 8 }) },
  'PESO MUERTO PIERNAS RIGIDAS': { build: hinge({ pitch: 92, knee: 1 }) },
  'PESO MUERTO RUMANO CON MANCUERNAS': { build: hinge({ gear: 'dumbbell', pitch: 70, knee: 8, grip: 14 }) },
  'PESO MUERTO RUMANO UNILATERAL': { build: hinge({ single: true, pitch: 82 }) },
  'PESO MUERTO SUMO': { build: deadlift({ stance: 27, toeOut: 36, grip: 12, pitch0: 40, kneeOut: 1.1 }), view: 'front' },
  // Estocadas
  ESTOCADAS: { build: lunge({ mode: 'forward' }) },
  'ESTOCADAS CAMINANDO': { build: lunge({ mode: 'walking', gear: 'none' }), phases: [0, 0.4, 0.8] },
  'ESTOCADAS INVERSAS': { build: lunge({ mode: 'reverse' }) },
  'ESTOCADA ESTATICA': { build: lunge({ mode: 'static', gear: 'goblet' }) },
  'ESTOCADAS CON BARRA': { build: lunge({ mode: 'static', gear: 'barbell' }) },
  'ESTOCADAS EN MULTIPOWER': { build: lunge({ mode: 'static', gear: 'smith' }) },
  'SENTADILLA BULGARA': { build: lunge({ mode: 'bulgarian' }) },
  'ESTOCADA CRUZADA': { build: lunge({ mode: 'curtsy', gear: 'goblet' }), view: 'front' },
  'ESTOCADA LATERAL': { build: lunge({ mode: 'lateral', gear: 'goblet' }), view: 'front' },
  'SENTADILLA COSACA': { build: lunge({ mode: 'cossack', gear: 'none' }), view: 'front' },
  'SENTADILLA DEL PATINADOR': { build: lunge({ mode: 'skater', gear: 'none' }) },
  'SUBIDAS AL CAJON': { build: lunge({ mode: 'stepUp' }) },
  // Aductores
  ADUCTOR: { build: seatedAbAd({ out: false }), view: 'front' },
  'ADUCCION EN POLEA': { build: cableHip({ out: false }), view: 'front' },
  // Glúteos
  'HIP THRUST': { build: hipThrust({ gear: 'barbell' }) },
  'HIP THRUST EN MAQUINA': { build: hipThrust({ gear: 'machine' }) },
  'HIP THRUST EN MULTIPOWER': { build: hipThrust({ gear: 'smith' }) },
  'HIP THRUST UNILATERAL': { build: hipThrust({ gear: 'none', single: true }) },
  'PUENTE DE GLUTEOS': { build: hipThrust({ floor: true }) },
  'PUENTE DE GLUTEOS CON BARRA': { build: hipThrust({ floor: true, gear: 'barbell' }) },
  'PUENTE DE GLUTEOS A UNA PIERNA': { build: hipThrust({ floor: true, single: true }) },
  'FROG PUMP': { build: hipThrust({ floor: true, frog: true }), view: 'top' },
  'PATADA DE GLUTEO': { build: quadruped({ kick: 'back' }) },
  HIDRANTE: { build: quadruped({ kick: 'side' }), view: 'front' },
  'PATADA DE GLUTEO EN POLEA': { build: standingKick({ gear: 'cable' }) },
  'PATADA DE GLUTEO EN MAQUINA': { build: standingKick({ gear: 'machine' }) },
  MULTICADERA: { build: standingKick({ gear: 'multi' }) },
  'MULTICADERA ABDUCCION': { build: standingKick({ gear: 'multi', abduct: true }), view: 'front' },
  ABDUCTOR: { build: seatedAbAd({ out: true }), view: 'front' },
  'ABDUCCION EN POLEA': { build: cableHip({ out: true }), view: 'front' },
  'CAMINATA LATERAL CON BANDA': { build: bandWalk, view: 'front' },
  ALMEJA: { build: sideLying({ clam: true, band: true }) },
  'ELEVACION LATERAL DE PIERNA ACOSTADO': { build: sideLying({}) },
  'PULL THROUGH': { build: pullThrough },
  'HIPEREXTENSION INVERSA': { build: reverseHyper },
  'PESO MUERTO CON KETTLEBELL': { build: hinge({ gear: 'kb', pitch: 60, knee: 16, grip: 3.5, stance: 14, kneeOut: 0.4 }) },
  // Pantorrillas
  'GEMELOS PARADO': { build: calfRaise({ mode: 'step' }) },
  'GEMELOS EN MAQUINA': { build: calfRaise({ mode: 'machine' }) },
  'GEMELOS EN MULTIPOWER': { build: calfRaise({ mode: 'smith' }) },
  'GEMELOS CON MANCUERNAS': { build: calfRaise({ mode: 'dumbbells' }) },
  'GEMELOS A UNA PIERNA': { build: calfRaise({ mode: 'single' }) },
  'GEMELOS BURRO': { build: calfRaise({ mode: 'donkey' }) },
  'GEMELOS EN HACK': { build: calfRaise({ mode: 'hack' }) },
  'GEMELOS EN PRENSA': { build: calfRaise({ mode: 'press' }) },
  'SOLEO SENTADO': { build: calfRaise({ mode: 'seated' }) },
  'ELEVACION DE PUNTAS': { build: calfRaise({ mode: 'tibial' }) },
  'SALTOS DE TOBILLO': { build: pogo },
  'CAMINATA EN PUNTAS DE PIE': { build: tiptoeWalk },
};

export { squat, lunge, hinge, hipThrust };
