import * as E from '../../utils/figure/equipment';
import { add, ANKLE_Y, arms, BENCH_TOP, BODY, chestPoint, fist, fistMid, FLOOR_Y, grab, lerp, madd, mix, norm, palmDown, pelvisFromShoulders, scale, scene, shoulderOf, sideSign, STAND_HIP_Y, sub, track, withBody } from './common';
import { hangPull } from './back';
import { dips } from './chest';
import { seated, splitStance, standing } from './setups';

/*
 * Core: abdominales en el piso, planchas, colgados, poleas, máquinas y anti-rotación.
 * Acostado boca arriba la cabeza queda hacia −x (izquierda en la vista lateral) y los pies hacia +x.
 */

const LIE_Y = FLOOR_Y - BODY.backDepth;
const handsBehindHead = (sk) => arms(
  { arm: { to: chestPoint(sk, 54, -3, 7), pole: [0, -0.3, 1] }, hand: { pr: 90, grip: 'flat', flex: 30 } },
  { arm: { to: chestPoint(sk, 54, -3, -7), pole: [0, -0.3, -1] }, hand: { pr: 90, grip: 'flat', flex: 30 } },
);
const armsAlongside = { armL: { e: 8, p: 30, b: 0 }, armR: { e: 8, p: 30, b: 0 }, handL: { pr: 180, grip: 'flat' }, handR: { pr: 180, grip: 'flat' } };
const kneesBent = (footX) => ({ legL: { to: [footX, ANKLE_Y, 10], pole: [0.2, -1, 0.15] }, legR: { to: [footX, ANKLE_Y, -10], pole: [0.2, -1, -0.15] }, footL: { flat: true, out: 4 }, footR: { flat: true, out: 4 } });

// Acostado boca arriba en el piso: o.flex (columna), o.twist, o.side, o.legs (spec de piernas), o.arms ('head' | 'side' | 'up' | spec).
const supine = (o) => {
  const pelvisPitch = o.pelvisPitch ?? -90;
  const base = {
    pelvis: { at: [0, LIE_Y - (o.lift ?? 0), 0], pitch: pelvisPitch },
    spine: { flex: o.flex ?? 0, twist: o.twist ?? 0, side: o.side ?? 0 },
    neck: { flex: o.neck ?? (o.flex ?? 0) * 0.4 },
    ...(o.legs ?? kneesBent(30)),
  };
  if (o.arms === 'head') return withBody(base, handsBehindHead);
  if (o.arms === 'up') return { ...base, armL: { e: 90, p: 5, b: 0 }, armR: { e: 90, p: 5, b: 0 }, handL: { pr: 90, grip: 'open' }, handR: { pr: 90, grip: 'open' } };
  if (o.arms === 'over') return { ...base, armL: { e: 170, p: 10, b: 0 }, armR: { e: 170, p: 10, b: 0 }, handL: { pr: 180, grip: 'open' }, handR: { pr: 180, grip: 'open' } };
  if (o.arms && typeof o.arms === 'object') return { ...base, ...o.arms };
  return { ...base, ...armsAlongside };
};

const crunch = (phase) => scene(supine({ flex: mix(0, 34, phase), arms: 'head', legs: kneesBent(28) }));
const sitUp = (phase) => {
  const pitch = mix(-90, -12, phase);
  return scene(supine({ pelvisPitch: pitch, flex: track(phase, [[0, 0], [0.5, 30], [1, 10]]), arms: 'head', legs: kneesBent(30) }));
};
const reverseCrunch = (phase) => {
  const pitch = mix(-90, -126, phase);
  return scene(supine({ pelvisPitch: pitch, flex: -90 - pitch, lift: phase * 3, legs: { legL: { e: mix(70, 110, phase), p: 0, b: 100 }, legR: { e: mix(70, 110, phase), p: 0, b: 100 }, footL: { plantar: 20 }, footR: { plantar: 20 } } }));
};
const bicycle = (phase) => {
  const side = phase < 0.5 ? 1 : -1;
  const t = phase < 0.5 ? phase * 2 : (phase - 0.5) * 2;
  const amt = Math.sin(t * Math.PI);
  return scene(supine({
    flex: 26, twist: side * 30 * amt, arms: 'head',
    legs: { legL: { e: side > 0 ? mix(40, 100, amt) : 34, p: 0, b: side > 0 ? mix(30, 100, amt) : 10 }, legR: { e: side > 0 ? 34 : mix(40, 100, amt), p: 0, b: side > 0 ? 10 : mix(30, 100, amt) }, footL: { plantar: 20 }, footR: { plantar: 20 } },
  }));
};
const obliqueCrunch = (phase) => scene(supine({
  flex: mix(4, 28, phase), twist: mix(0, -32, phase), arms: 'head',
  legs: { legL: { to: [28, ANKLE_Y, 10], pole: [0.2, -1, 0.15] }, footL: { flat: true }, legR: { e: 60, p: -30, b: 95, r: 50 }, footR: { plantar: 10 } },
}));
const toeTouchCrunch = (phase) => {
  const pose = supine({ flex: mix(4, 36, phase), legs: { legL: { e: 92, p: 0, b: 4 }, legR: { e: 92, p: 0, b: 4 }, footL: { plantar: 10 }, footR: { plantar: 10 } }, arms: { armL: { e: mix(150, 90, phase), p: 5, b: 0 }, armR: { e: mix(150, 90, phase), p: 5, b: 0 }, handL: { pr: 90, grip: 'open' }, handR: { pr: 90, grip: 'open' } } });
  return scene(pose);
};
const heelTouches = (phase) => {
  const side = track(phase, [[0, 0], [0.5, 1], [1, -1]]);
  return scene(supine({ flex: 16, side: side * 22, legs: kneesBent(34), arms: { armL: { e: 18, p: 20, b: 0 }, armR: { e: 18, p: 20, b: 0 }, handL: { pr: 90, grip: 'open' }, handR: { pr: 90, grip: 'open' } } }));
};
const legRaise = (phase) => scene(supine({ legs: { legL: { e: mix(8, 90, phase), p: 0, b: 2 }, legR: { e: mix(8, 90, phase), p: 0, b: 2 }, footL: { plantar: 20 }, footR: { plantar: 20 } }, arms: { armL: { e: 12, p: 20, b: 0 }, armR: { e: 12, p: 20, b: 0 }, handL: { pr: 180, grip: 'flat' }, handR: { pr: 180, grip: 'flat' } } }));
const flutterKicks = (phase) => {
  const a = track(phase, [[0, 0], [0.5, 1], [1, -1]]);
  return scene(supine({ flex: 10, legs: { legL: { e: 22 + a * 14, p: 0, b: 2 }, legR: { e: 22 - a * 14, p: 0, b: 2 }, footL: { plantar: 30 }, footR: { plantar: 30 } } }));
};
const deadBug = (phase) => {
  const t = track(phase, [[0, 0], [0.5, 1], [1, 0]]);
  const u = track(phase, [[0, 0], [0.5, 0], [1, 0]]);
  const s = phase > 0.5 ? (phase - 0.5) * 2 : 0;
  return scene(supine({
    legs: { legL: { e: mix(90, 15, t), p: 0, b: mix(90, 5, t) }, legR: { e: mix(90, 15, s * (1 - u)), p: 0, b: mix(90, 5, s) }, footL: { plantar: 0 }, footR: { plantar: 0 } },
    arms: { armL: { e: 90, p: 5, b: 0 }, armR: { e: mix(90, 170, t), p: 5, b: 0 }, handL: { pr: 90, grip: 'open' }, handR: { pr: 90, grip: 'open' } },
  }));
};
const hollow = (phase) => scene(supine({ flex: mix(0, 22, phase), neck: 10, legs: { legL: { e: mix(4, 28, phase), p: 0, b: 0 }, legR: { e: mix(4, 28, phase), p: 0, b: 0 }, footL: { plantar: 30 }, footR: { plantar: 30 } }, arms: 'over' }));
const vUp = (phase) => {
  const t = track(phase, [[0, 0], [0.5, 0.5], [1, 1]]);
  const pitch = mix(-90, -45, t);
  return scene(supine({ pelvisPitch: pitch, flex: mix(0, 18, t), legs: { legL: { e: mix(10, 95, t), p: 0, b: 0 }, legR: { e: mix(10, 95, t), p: 0, b: 0 }, footL: { plantar: 30 }, footR: { plantar: 30 } }, arms: { armL: { e: mix(170, 100, t), p: 5, b: 0 }, armR: { e: mix(170, 100, t), p: 5, b: 0 }, handL: { pr: 90, grip: 'open' }, handR: { pr: 90, grip: 'open' } } }));
};
const curlUp = (phase) => scene(supine({ flex: mix(0, 9, phase), neck: 0, legs: { legL: { to: [26, ANKLE_Y, 10], pole: [0.2, -1, 0.15] }, footL: { flat: true }, legR: { e: 4, p: 0, b: 0 }, footR: { plantar: 10 } }, arms: { armL: { e: 20, p: 5, b: 120, r: -60 }, armR: { e: 20, p: 5, b: 120, r: -60 }, handL: { pr: 180, grip: 'flat' }, handR: { pr: 180, grip: 'flat' } } }));
const wipers = (phase) => {
  const roll = track(phase, [[0, 0], [0.5, 50], [1, -50]]);
  // La pelvis rota con las piernas y el tronco contra-rota para dejar la espalda alta y los brazos en el piso.
  const pose = supine({ twist: roll, legs: { legL: { e: 90, p: 0, b: 4 }, legR: { e: 90, p: 0, b: 4 }, footL: { plantar: 10 }, footR: { plantar: 10 } }, arms: { armL: { e: 90, p: 90, b: 0 }, armR: { e: 90, p: 90, b: 0 }, handL: { pr: 180, grip: 'flat' }, handR: { pr: 180, grip: 'flat' } } });
  pose.pelvis.roll = -roll;
  return scene(pose);
};

// Russian twist: sentado en V con los pies elevados, giro del tronco con un disco.
const russianTwist = (phase) => {
  const twist = track(phase, [[0, 0], [0.5, 40], [1, -40]]);
  const pose = withBody({ pelvis: { at: [0, FLOOR_Y - 8.5, 0], pitch: -45 }, spine: { flex: 12, twist }, neck: { flex: 0 }, legL: { e: 105, p: 0, b: 85 }, legR: { e: 105, p: 0, b: 85 }, footL: { plantar: 10 }, footR: { plantar: 10 } }, (sk) => {
    const c = chestPoint(sk, 32, 26);
    return arms(grab(add(c, [0, 0, 5]), [0, 1, 0.5], 90, { grip: 'flat' }), grab(add(c, [0, 0, -5]), [0, 1, -0.5], 90, { grip: 'flat' }));
  });
  return scene(pose, (sk) => E.plate(madd(fistMid(sk), [norm(sk.chest.basis.fwd), 2]), sk.chest.basis.fwd, 10));
};

// Sit up declinado: tobillos trabados en el banco declinado.
const declineSitUp = (phase) => {
  const pitch = mix(-110, -20, phase);
  const P = [20, FLOOR_Y - 56, 0];
  const pose = withBody({ pelvis: { at: P, pitch }, spine: { flex: track(phase, [[0, 0], [0.5, 30], [1, 12]]) }, neck: { flex: 10 }, legL: { to: [P[0] + 40, P[1] - 14, 9], pole: [0.3, -1, 0.1] }, legR: { to: [P[0] + 40, P[1] - 14, -9], pole: [0.3, -1, -0.1] }, footL: { plantar: 20 }, footR: { plantar: 20 } }, handsBehindHead);
  return scene(pose, (sk) => [E.slantPad(add(P, [-60, 30, 0]), add(P, [36, -4, 0]), [0.33, -0.94, 0], { halfW: 12 }), E.roller(add(sk.legs.L.end, [4, -1, -9]), { half: 11 }), E.post(add(P, [-40, 30, 0]), { r: 2 }), E.post(add(P, [20, 8, 0]), { r: 2 })]);
};


// Base de un cuerpo acostado sobre el lado derecho, mirando a cámara (+z), con la cabeza hacia +x elevada theta grados.
const sideBasis = (theta) => {
  const c = Math.cos((theta * Math.PI) / 180);
  const sn = Math.sin((theta * Math.PI) / 180);
  return { up: [c, -sn, 0], fwd: [0, 0, 1], lat: [-sn, -c, 0] };
};
const LEG_LEN = BODY.thigh + BODY.shin;
const TRUNK_LEN = BODY.pelvisLen + BODY.chestLen;

// Plancha lateral (pies en el piso) o Copenhague (tobillo de arriba sobre el banco): antebrazo derecho bajo el hombro.
const sidePlank = (o, phase) => {
  const shoulderY = FLOOR_Y - 30;
  const S = [40, shoulderY, 0];
  // Busca el ángulo en que el tobillo de apoyo (derecho en el piso o izquierdo en el banco) queda a la altura justa.
  const ankleY = (theta) => {
    const b = sideBasis(theta);
    const hip = madd(S, [b.lat, BODY.shoulderHalf], [b.up, -TRUNK_LEN]);
    return madd(hip, [b.lat, o.copenhagen ? BODY.hipHalf : -BODY.hipHalf], [b.up, -LEG_LEN])[1];
  };
  const targetY = o.copenhagen ? BENCH_TOP - 3 : FLOOR_Y - 4.5;
  let theta = 0;
  for (let t = 0; t <= 40; t += 0.1) if (Math.abs(ankleY(t) - targetY) < Math.abs(ankleY(theta) - targetY)) theta = t;
  const basis = sideBasis(theta);
  const P = madd(S, [basis.lat, BODY.shoulderHalf], [basis.up, -TRUNK_LEN]);
  const pose = withBody({
    pelvis: { at: P, basis }, neck: { flex: 0 },
    legL: { e: 0, p: 0, b: 0 }, footL: { plantar: 10 },
    legR: o.copenhagen ? { e: mix(10, 0, phase), p: mix(-14, 0, phase), b: mix(70, 0, phase) } : { e: 0, p: 0, b: 0 }, footR: { plantar: 10 },
  }, (sk) => arms(
    { arm: { e: o.copenhagen ? 10 : mix(10, 170, phase), p: 90, b: o.copenhagen ? 110 : 0 }, hand: { pr: 90, grip: o.copenhagen ? 'flat' : 'open' } },
    { arm: { to: add(shoulderOf(sk, 'R'), [1, 26, 20]), pole: [0.2, 0, -1] }, hand: { pr: 90, grip: 'fist' } },
  ));
  return scene(pose, (sk) => (o.copenhagen ? E.flatBench(sk.legs.L.end[0] - 22, sk.legs.L.end[0] + 18, BENCH_TOP, { z: sk.legs.L.end[2] }) : []));
};

/*
 * Planchas. o.side (lateral), o.copenhagen, o.legLift, o.ball (antebrazos en fitball), o.high (brazos estirados).
 */
const plank = (o = {}) => (phase) => {
  if (o.side || o.copenhagen) return sidePlank(o, phase);
  const elbowH = o.high ? 50 : 26;
  const legLen = BODY.thigh + BODY.shin + 4;
  const supportY = FLOOR_Y - 12;
  const shoulderY = FLOOR_Y - elbowH - (o.ball ? 30 : 0);
  const angle = Math.asin((supportY - shoulderY) / (legLen + 44));
  const toeX = -64;
  const hip = [toeX + legLen * Math.cos(angle), supportY - legLen * Math.sin(angle), 0];
  const pitch = 90 - (angle * 180) / Math.PI;
  const shX = hip[0] + 44 * Math.cos(angle);
  const stir = o.ball ? track(phase, [[0, 0], [0.5, 8], [1, -8]]) : 0;
  const pose = withBody({
    pelvis: { at: hip, pitch },
    neck: { flex: -10 },
    legL: o.legLift ? { e: mix(2, 20, phase), p: 180, b: 0 } : { e: 0, p: 2, b: 0 }, legR: { e: 0, p: 2, b: 0 },
    footL: { plantar: o.legLift ? 10 : -12 }, footR: { plantar: -12 },
  }, () => {
    if (o.high) return arms(palmDown([shX + 2, FLOOR_Y - 2.6, 18], [-1, 0, 0.3], 100), palmDown([shX + 2, FLOOR_Y - 2.6, -18], [-1, 0, -0.3], 100));
    const elbowY = o.ball ? FLOOR_Y - 32 : FLOOR_Y - 4;
    const hand = (side) => [shX + 22 + stir, elbowY - 1, sideSign(side) * 4 + stir * 0.6];
    return arms(
      { arm: { to: hand('L'), pole: [0, 1, 0.3] }, hand: { pr: 90, grip: 'fist' } },
      { arm: { to: hand('R'), pole: [0, 1, -0.3] }, hand: { pr: 90, grip: 'fist' } },
    );
  });
  return scene(pose, () => (o.ball ? E.sphere([shX + 12 + stir, FLOOR_Y - 18, 0], 18, { fill: E.GEAR, bias: -5 }) : []));
};

// Rodillas al pecho sobre fitball: manos en el piso, tibias sobre la pelota.
const ballKneeTuck = (phase) => {
  const shX = 40;
  const tuck = phase;
  const ballX = mix(-36, 4, tuck);
  const hip = [mix(-4, 8, tuck), FLOOR_Y - mix(44, 62, tuck), 0];
  const pitch = mix(84, 60, tuck);
  const pose = withBody({ pelvis: { at: hip, pitch }, neck: { flex: -10 }, legL: { to: [ballX - 6, FLOOR_Y - 34, 8], pole: [0, 1, 0] }, legR: { to: [ballX - 6, FLOOR_Y - 34, -8], pole: [0, 1, 0] }, footL: { plantar: 40 }, footR: { plantar: 40 } }, () => arms(palmDown([shX, FLOOR_Y - 2.6, 18], [-1, 0, 0.3], 100), palmDown([shX, FLOOR_Y - 2.6, -18], [-1, 0, -0.3], 100)));
  return scene(pose, () => E.sphere([ballX, FLOOR_Y - 17, 0], 17, { fill: E.GEAR, bias: -5 }));
};

// Rueda abdominal desde las rodillas.
const abWheel = (phase) => {
  const knee = [-20, FLOOR_Y - 4.5, 0];
  const pitch = mix(32, 82, phase);
  const thighDir = [Math.sin((pitch * Math.PI) / 180), -Math.cos((pitch * Math.PI) / 180), 0];
  const P = madd(knee, [thighDir, BODY.thigh]);
  const pose = withBody({ pelvis: { at: P, pitch: mix(52, 84, phase) }, spine: { flex: mix(18, 2, phase) }, neck: { flex: -10 }, legL: { to: [knee[0] - 32, FLOOR_Y - 5, 9], pole: [1, 0.5, 0] }, legR: { to: [knee[0] - 32, FLOOR_Y - 5, -9], pole: [1, 0.5, 0] }, footL: { dir: [-1, 0.2, 0] }, footR: { dir: [-1, 0.2, 0] } }, (sk) => {
    const sh = lerp(shoulderOf(sk, 'L'), shoulderOf(sk, 'R'), 0.5);
    const wheelX = sh[0] + mix(10, 40, phase);
    return arms(grab([wheelX, FLOOR_Y - 9, 6], [-1, -0.2, 0.2], 180), grab([wheelX, FLOOR_Y - 9, -6], [-1, -0.2, -0.2], 180));
  });
  return scene(pose, (sk) => [E.pad([knee[0] - 8, FLOOR_Y - 1, 0], [knee[0] + 8, FLOOR_Y - 1, 0], 12, 2), E.disc([fistMid(sk)[0], FLOOR_Y - 7.5, 0], [0, 0, 1], 7.5, 5, { fill: E.FRAME }), E.rod(add(fistMid(sk), [0, 0, -10]), add(fistMid(sk), [0, 0, 10]), 1.1)]);
};

// Colgado de la barra con elevación de piernas (estiradas) o rodillas.
const hangingRaise = (o = {}) => (phase) => {
  const legs = o.knees
    ? { e: mix(5, 110, phase), p: 0, b: mix(10, 115, phase) }
    : { e: mix(5, 95, phase), p: 0, b: 4 };
  return hangPull({ grip: 26, drop0: 50, drop1: 50, lean0: mix(-2, -8, phase), lean1: mix(-2, -8, phase), legs, elev: [2, 2] })(phase);
};

// Silla romana (capitán): antebrazos apoyados y espalda contra el respaldo; rodillas al pecho.
const captainChair = (phase) => {
  const base = dips({ leanTop: -4, leanBottom: -6, flare: 0.1, kneeBend: mix(10, 100, phase), legsForward: mix(4, 105, phase) })(0);
  const sk = base.skeleton;
  base.props.push(E.slantPad(chestPoint(sk, 0, -10), chestPoint(sk, 46, -10), sk.pelvis.basis.fwd, { halfW: 13 }));
  return base;
};

// L sit en paralelas: brazos estirados y piernas horizontales.
const lSit = (phase) => dips({ leanTop: mix(0, -6, phase), leanBottom: -6, flare: 0.05, kneeBend: mix(80, 0, phase), legsForward: mix(20, 90, phase), back: 0 })(0);

// Dragon flag: acostado en un banco tomado detrás de la cabeza, el cuerpo recto pivota sobre los hombros.
const dragonFlag = (phase) => {
  const S = [-30, BENCH_TOP - BODY.backDepth, 0];
  const pitch = track(phase, [[0, -175], [0.5, -130], [1, -100]]);
  const P = pelvisFromShoulders(S, pitch);
  const pose = withBody({ pelvis: { at: P, pitch }, neck: { flex: 20 }, legL: { e: 0, p: 0, b: 0 }, legR: { e: 0, p: 0, b: 0 }, footL: { plantar: 30 }, footR: { plantar: 30 } }, () => arms(grab([S[0] - 18, BENCH_TOP + 2, 9], [1, -0.5, 0.6], 180), grab([S[0] - 18, BENCH_TOP + 2, -9], [1, -0.5, -0.6], 180)));
  return scene(pose, () => [E.flatBench(-70, 40, BENCH_TOP), E.post([S[0] - 18, BENCH_TOP + 2, 12], { r: 1.6 })]);
};

// Crunch en polea alta de rodillas, con soga junto a la cabeza.
const cableCrunch = (phase) => {
  const knee = [0, FLOOR_Y - 4.5, 0];
  const P = madd(knee, [[0.15, -1, 0], BODY.thigh]);
  const pose = withBody({ pelvis: { at: P, pitch: mix(18, 30, phase) }, spine: { flex: mix(5, 55, phase) }, neck: { flex: mix(10, 25, phase) }, legL: { to: [knee[0] - 32, FLOOR_Y - 5, 9], pole: [1, 0.5, 0] }, legR: { to: [knee[0] - 32, FLOOR_Y - 5, -9], pole: [1, 0.5, 0] }, footL: { dir: [-1, 0.2, 0] }, footR: { dir: [-1, 0.2, 0] } }, (sk) => arms(grab(chestPoint(sk, 56, 6, 7), [0.6, 1, 0.5], 90), grab(chestPoint(sk, 56, 6, -7), [0.6, 1, -0.5], 90)));
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    const pulley = [h[0] + 30, FLOOR_Y - 200, 0];
    return [E.cableColumn(pulley[0] + 5, 0, pulley[1]), E.cable(pulley, add(h, [2, -2, 0])), E.polyline([fist(sk, 'L'), add(h, [2, -3, 0]), fist(sk, 'R')], { color: E.DARK, width: 2.4 }), E.pad([knee[0] - 8, FLOOR_Y - 1, 0], [knee[0] + 8, FLOOR_Y - 1, 0], 12, 2)];
  });
};

// Crunch en máquina sentado: se tira de las manijas sobre los hombros flexionando el tronco.
const machineCrunch = (phase) => {
  const setup = seated({ lean: mix(-2, 6, phase), seatY: FLOOR_Y - 46, back: false });
  const pose = withBody({ ...setup.pose, spine: { flex: mix(0, 42, phase) }, neck: { flex: 15 } }, (sk) => arms(grab(chestPoint(sk, 48, 6, 13), [0.5, 1, 0.6], 90), grab(chestPoint(sk, 48, 6, -13), [0.5, 1, -0.6], 90)));
  return scene(pose, (sk) => [setup.props(sk), E.slantPad(chestPoint(sk, 30, 11), chestPoint(sk, 44, 11), scale(sk.chest.basis.fwd, -1), { halfW: 12 }), ['L', 'R'].map((side) => E.lever(add(sk.pelvis.o, [-14, -60, sideSign(side) * 18]), add(fist(sk, side), [0, -2, 0]))), E.weightStack(sk.pelvis.o[0] - 40, 0)]);
};

// Rotación de tronco en máquina: sentado, la cadera gira contra la resistencia con el pecho fijo.
const rotaryTorso = (phase) => {
  const setup = seated({ lean: 0, seatY: FLOOR_Y - 46, back: false });
  const twist = mix(-35, 35, phase);
  const pose = withBody({ ...setup.pose, spine: { twist } }, (sk) => arms(grab(chestPoint(sk, 36, 16, 10), [0, 1, 0.8], 90), grab(chestPoint(sk, 36, 16, -10), [0, 1, -0.8], 90)));
  return scene(pose, (sk) => [setup.props(sk), E.slantPad(chestPoint(sk, 26, 12, 0), chestPoint(sk, 42, 12, 0), scale(sk.chest.basis.fwd, -1), { halfW: 12 }), E.weightStack(sk.pelvis.o[0] - 40, 0)]);
};

// Leñador en polea: de arriba (un hombro) hacia abajo (la cadera contraria) girando el tronco.
const woodchopper = (phase) => {
  const pose = withBody({ ...standing({ stance: 16, drop: mix(2, 10, phase), kneeOut: 0.3 }), spine: { twist: mix(-35, 30, phase), side: mix(-6, 8, phase) } }, (sk) => {
    const c = lerp(add(shoulderOf(sk, 'L'), [16, -24, 18]), chestPoint(sk, 0, 22, -26), phase);
    return arms(grab(add(c, [0, 0, 3]), [-0.3, 0.6, 0.6], 90), grab(add(c, [0, 0, -3]), [-0.3, 0.6, -0.6], 90));
  });
  return scene(pose, (sk) => {
    const pulley = [10, FLOOR_Y - 190, 80];
    return [E.cableColumn(pulley[0], pulley[2], pulley[1]), E.cable(pulley, fistMid(sk)), E.handle('D', fistMid(sk), [1, 0, 0])];
  });
};

// Pallof press: de costado a la polea, la manija se empuja al frente sin dejar que el tronco gire.
const pallof = (phase) => {
  const pose = withBody(standing({ stance: 14, drop: 6, kneeOut: 0.3 }), (sk) => {
    const c = chestPoint(sk, 32, mix(10, 46, phase));
    return arms(grab(add(c, [0, 0, 3]), [-0.3, 1, 0.4], 90), grab(add(c, [0, 0, -3]), [-0.3, 1, -0.4], 90));
  });
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    const pulley = [8, h[1], 80];
    return [E.cableColumn(pulley[0], pulley[2], pulley[1]), E.cable(pulley, h), E.handle('D', h, [0, 1, 0])];
  });
};

// Bird dog: en cuadrupedia, brazo y pierna contrarios se estiran.
const birdDog = (phase) => {
  const t = track(phase, [[0, 0], [0.5, 1], [1, 0]]);
  const s = phase > 0.5 ? (phase - 0.5) * 2 : 0;
  const amt = phase <= 0.5 ? t : 0;
  const amt2 = phase > 0.5 ? Math.sin(s * Math.PI / 2) : 0;
  const P = [0, FLOOR_Y - 4.5 - BODY.thigh, 0];
  const pose = withBody({
    pelvis: { at: P, pitch: 88 }, neck: { flex: -20 },
    legL: { e: mix(90, 2, amt), p: 0, b: mix(92, 0, amt) }, legR: { e: mix(90, 2, amt2), p: 0, b: mix(92, 0, amt2) }, footL: { plantar: 30 }, footR: { plantar: 30 },
  }, (sk) => arms(
    amt2 > 0 ? { arm: { e: mix(90, 175, amt2), p: 0, b: 0 }, hand: { pr: 90, grip: 'open' } } : palmDown([shoulderOf(sk, 'L')[0] + 2, FLOOR_Y - 2.6, 15], [-1, 0, 0.3], 100),
    amt > 0 ? { arm: { e: mix(90, 175, amt), p: 0, b: 0 }, hand: { pr: 90, grip: 'open' } } : palmDown([shoulderOf(sk, 'R')[0] + 2, FLOOR_Y - 2.6, -15], [-1, 0, -0.3], 100),
  ));
  return scene(pose);
};

// Flexión lateral con mancuerna (de pie) y en banco romano (de costado).
const sideBend = (phase) => {
  const side = mix(-16, 22, phase);
  const pose = { ...standing({ stance: 12 }), spine: { side }, armL: { e: 4, p: 20, b: 0 }, handL: { pr: 90, grip: 'fist' }, armR: { e: 6, p: 14, b: 8 }, handR: { pr: 90, grip: 'open' } };
  return scene(pose, (sk) => E.dumbbell(fist(sk, 'L'), [1, 0, 0]));
};
const romanSideBend = (phase) => {
  // Acostado sobre el lado izquierdo con la cadera en la almohadilla, cabeza hacia −x y pies trabados bajo el rodillo.
  const P = [0, FLOOR_Y - 70, 0];
  const basis = { up: [-1, 0, 0], fwd: [0, 0, 1], lat: [0, 1, 0] };
  const pose = withBody({ pelvis: { at: P, basis }, spine: { side: mix(30, -22, phase) }, neck: { side: mix(10, -10, phase) }, legL: { e: 0, p: 0, b: 0 }, legR: { e: 0, p: 0, b: 0 }, footL: { plantar: 0 }, footR: { plantar: 0 } }, (sk) => arms(
    { arm: { to: chestPoint(sk, 40, 9, 6), pole: [0, 0, 1] }, hand: { pr: 90, grip: 'flat' } },
    { arm: { to: chestPoint(sk, 40, 9, -6), pole: [0, 0, 1] }, hand: { pr: 90, grip: 'flat' } },
  ));
  return scene(pose, (sk) => [E.pad(add(P, [-4, 9, 0]), add(P, [22, 9, 0]), 12, 5), E.roller(add(sk.legs.R.end, [0, -6, 0]), { half: 10 }), E.roller(add(sk.legs.L.end, [0, 6, 0]), { half: 10 }), E.frame([[P[0] + 6, FLOOR_Y, 0], [P[0] + 8, P[1] + 14, 0], [sk.legs.L.end[0], P[1] + 14, 0], [sk.legs.L.end[0], sk.legs.L.end[1] + 6, 0]]), E.post([sk.legs.L.end[0], sk.legs.L.end[1] + 6, 0])]);
};

// Rotación con landmine: brazos estirados arriba, la punta de la barra dibuja un arco de cadera a cadera.
const landmineRotation = (phase) => {
  const a = track(phase, [[0, 0], [0.5, 1], [1, -1]]);
  const pose = withBody({ ...standing({ stance: 16, drop: 3, kneeOut: 0.3 }), spine: { twist: a * 28 } }, (sk) => {
    const top = add(lerp(shoulderOf(sk, 'L'), shoulderOf(sk, 'R'), 0.5), [26, -30 + Math.abs(a) * 36, a * 26]);
    return arms(grab(add(top, [0, 0, 3]), [-0.4, 1, 0.5], 90), grab(add(top, [0, 0, -3]), [-0.4, 1, -0.5], 90));
  });
  return scene(pose, (sk) => {
    const h = fistMid(sk);
    const pivot = [110, FLOOR_Y - 2, 0];
    const dir = norm(sub(h, pivot));
    return [E.rod(pivot, madd(h, [dir, 10]), 1.5, { fill: E.FRAME }), E.loadedPlate(madd(h, [dir, -8]), dir, 11), E.sphere(pivot, 3, { fill: E.FRAME })];
  });
};

// Molino con kettlebell: pesa arriba con el brazo estirado y bisagra lateral hasta tocar el piso con la otra mano.
const windmill = (phase) => {
  const pose = withBody({ pelvis: { at: [mix(0, -10, phase), STAND_HIP_Y + mix(1, 6, phase), 0], pitch: mix(0, 50, phase), yaw: mix(0, -30, phase) }, spine: { side: mix(0, 30, phase), flex: mix(0, 10, phase), twist: mix(0, 20, phase) }, legL: { to: [0, ANKLE_Y, 16], pole: [1, -0.1, 0.2] }, legR: { to: [0, ANKLE_Y, -16], pole: [1, -0.1, -0.2] }, footL: { flat: true, out: 30 }, footR: { flat: true, out: 10 }, neck: { turn: mix(0, -30, phase), flex: -20 } }, (sk) => ({
    // La pesa queda vertical sobre el hombro izquierdo durante toda la bajada.
    armL: { to: add(shoulderOf(sk, 'L'), [3, -BODY.upperArm - BODY.forearm - 3, 5]), pole: [-1, 0, 0.3] }, handL: { pr: 90, grip: 'fist' },
    armR: { e: mix(10, 60, phase), p: 10, b: 0 }, handR: { pr: 90, grip: 'open' },
  }));
  return scene(pose, (sk) => E.kettlebell(fist(sk, 'L'), { up: scale(sk.arms.L.hand.dir, -1), across: sk.arms.L.hand.thumb }));
};

export const CORE_FIGURES = {
  CRUNCH: { build: crunch },
  'SIT UP': { build: sitUp },
  'CRUNCH INVERSO': { build: reverseCrunch },
  'CRUNCH BICICLETA': { build: bicycle, view: 'top' },
  'CRUNCH OBLICUO': { build: obliqueCrunch, view: 'top' },
  'CRUNCH CON PIERNAS ELEVADAS': { build: toeTouchCrunch },
  'TOQUES DE TALON': { build: heelTouches, view: 'top' },
  'ELEVACION DE PIERNAS': { build: legRaise },
  'PATADAS DE TIJERA': { build: flutterKicks },
  'DEAD BUG': { build: deadBug },
  'HOLLOW HOLD': { build: hollow },
  'V UPS': { build: vUp },
  'CURL UP DE MCGILL': { build: curlUp },
  LIMPIAPARABRISAS: { build: wipers, view: 'top' },
  'RUSSIAN TWIST': { build: russianTwist, view: 'top' },
  'SIT UP EN BANCO DECLINADO': { build: declineSitUp },
  PLANCHA: { build: plank({}) },
  'PLANCHA LATERAL': { build: plank({ side: true }) },
  'PLANCHA COPENHAGUE': { build: plank({ copenhagen: true }) },
  'PLANCHA CON ELEVACION DE PIERNA': { build: plank({ legLift: true }) },
  'PLANCHA EN FITBALL': { build: plank({ ball: true }), view: 'top' },
  'RODILLAS AL PECHO EN FITBALL': { build: ballKneeTuck },
  'RUEDA ABDOMINAL': { build: abWheel },
  'ELEVACION DE PIERNAS COLGADO': { build: hangingRaise({}) },
  'ELEVACION DE RODILLAS COLGADO': { build: hangingRaise({ knees: true }) },
  'ELEVACION DE RODILLAS EN PARALELAS': { build: (phase) => captainChair(phase) },
  'L SIT': { build: lSit },
  'DRAGON FLAG': { build: dragonFlag },
  'CRUNCH EN POLEA': { build: cableCrunch },
  'CRUNCH EN MAQUINA': { build: machineCrunch },
  'ROTACION DE TRONCO EN MAQUINA': { build: rotaryTorso, view: 'top' },
  'LEÑADOR EN POLEA': { build: woodchopper, view: 'front' },
  'PALLOF PRESS': { build: pallof, view: 'top' },
  'BIRD DOG': { build: birdDog },
  'FLEXION LATERAL CON MANCUERNA': { build: sideBend, view: 'front' },
  'FLEXION LATERAL EN BANCO ROMANO': { build: romanSideBend },
  'ROTACION CON LANDMINE': { build: landmineRotation, view: 'front' },
  'MOLINO CON KETTLEBELL': { build: windmill, view: 'front' },
};
export { splitStance };
