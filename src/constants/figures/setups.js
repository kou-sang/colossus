import * as E from '../../utils/figure/equipment';
import { add, ANKLE_Y, BENCH_TOP, BODY, chestPoint, FLOOR_Y, madd, mix, norm, scale, shoulderOf, STAND_HIP_Y } from './common';

/*
 * Posturas base reutilizables (acostado en banco plano/inclinado/declinado, sentado en máquina, de pie, en plancha…).
 * Cada una devuelve la parte de la pose que define pelvis, tronco y piernas, más los implementos que la sostienen.
 */

const rad = (deg) => (deg * Math.PI) / 180;

// Línea de apoyo de la espalda: tapizado que sigue al tronco desde debajo de la cadera hasta detrás de la cabeza.
export const backPadFor = (sk, { from = -14, to = 64, depth = 9.6, halfW = 12, thick = 5, bias } = {}) => {
  const a = chestPoint(sk, from, -depth);
  const b = madd(sk.pelvis.o, [sk.pelvis.basis.up, to], [sk.pelvis.basis.fwd, -depth]);
  // El tórax puede estar flexionado: se usa la línea pelvis→hombros.
  const shoulderBack = chestPoint(sk, 44, -depth + 1.2);
  const dir = norm(add(shoulderBack, scale(a, -1)));
  const end = madd(a, [dir, to - from]);
  return E.slantPad(a, Math.abs(to - from) > 0 ? end : b, sk.pelvis.basis.fwd, { halfW, thick, bias });
};

/*
 * Acostado boca arriba en un banco. angle: 0 plano, + inclinado (grados sobre la horizontal), − declinado.
 * Devuelve { pose, props(sk) }. La pelvis se ubica para que glúteos y espalda apoyen en el tapizado.
 */
export const supineBench = ({ angle = 0, pelvisX = 18, feet = 'floor', floor = false } = {}) => {
  const pitch = -(90 - angle);
  const surface = floor ? FLOOR_Y : BENCH_TOP;
  let pelvisAt;
  if (angle === 0) pelvisAt = [pelvisX, surface - 9.4, 0];
  else if (angle > 0) pelvisAt = [pelvisX, FLOOR_Y - 46 - 9 * Math.cos(rad(angle)), 0];
  else pelvisAt = [pelvisX, FLOOR_Y - 58, 0];
  const pose = { pelvis: { at: pelvisAt, pitch }, neck: { flex: angle < 0 ? 8 : 0 } };
  if (feet === 'floor' && !floor) {
    const fx = pelvisAt[0] + (angle > 0 ? 34 : 30);
    Object.assign(pose, {
      legL: { to: [fx, ANKLE_Y, 20], pole: [0.5, -1, 0.35] }, legR: { to: [fx, ANKLE_Y, -20], pole: [0.5, -1, -0.35] },
      footL: { flat: true, out: 12 }, footR: { flat: true, out: 12 },
    });
  } else if (feet === 'floor' && floor) {
    Object.assign(pose, {
      legL: { to: [pelvisAt[0] + 28, ANKLE_Y, 14], pole: [0.2, -1, 0.2] }, legR: { to: [pelvisAt[0] + 28, ANKLE_Y, -14], pole: [0.2, -1, -0.2] },
      footL: { flat: true, out: 6 }, footR: { flat: true, out: 6 },
    });
  } else if (feet === 'hooked') {
    // Declinado: muslos sobre el banco, rodillas en el borde y tobillos trabados bajo el rodillo.
    const ankle = (z) => [pelvisAt[0] + 40, pelvisAt[1] + 14, z];
    Object.assign(pose, { legL: { to: ankle(9), pole: [0.3, -1, 0.1] }, legR: { to: ankle(-9), pole: [0.3, -1, -0.1] }, footL: { plantar: 20 }, footR: { plantar: 20 } });
  } else if (feet === 'up') {
    Object.assign(pose, { legL: { e: 90, p: 3, b: 90 }, legR: { e: 90, p: 3, b: 90 }, footL: { plantar: 15 }, footR: { plantar: 15 } });
  }
  const props = (sk) => {
    if (floor) return [];
    if (angle === 0) {
      const headX = sk.head.o[0];
      return E.flatBench(Math.min(headX - 10, sk.pelvis.o[0] - 66), sk.pelvis.o[0] + 22, BENCH_TOP);
    }
    const items = [backPadFor(sk, { from: -12, to: 70 })];
    if (angle > 0) {
      const seatY = sk.pelvis.o[1] + 9.5;
      items.push(E.pad([sk.pelvis.o[0] - 6, seatY, 0], [sk.pelvis.o[0] + 22, seatY, 0], 12, 5));
      items.push(E.post([sk.pelvis.o[0] + 8, seatY + 5, 0], { r: 2 }));
      items.push(E.post([sk.pelvis.o[0] - 26, FLOOR_Y - 30, 0], { r: 2 }));
      items.push(E.rod([sk.pelvis.o[0] - 34, FLOOR_Y - 1, 0], [sk.pelvis.o[0] + 20, FLOOR_Y - 1, 0], 1.8, { bias: -8 }));
    } else {
      // Declinado: el tapizado sigue bajo los muslos hasta las rodillas; rodillo delante de los tobillos.
      items.length = 0;
      items.push(backPadFor(sk, { from: -44, to: 70 }));
      const knee = sk.legs.L.mid;
      const ankle = sk.legs.L.end;
      items.push(E.roller([ankle[0] + 5, ankle[1] - 1, 0], { half: 11 }));
      items.push(E.rod([knee[0] + 2, knee[1] + 8, 0], [ankle[0] + 5, ankle[1] + 3, 0], 1.6, { bias: -6 }));
      items.push(E.post([knee[0] - 6, knee[1] + 8, 0], { r: 2 }));
      items.push(E.post([sk.head.o[0] + 6, sk.head.o[1] + 12, 0], { r: 2 }));
    }
    return items;
  };
  return { pose, props };
};

/*
 * Sentado en máquina o banco con respaldo. lean = inclinación del respaldo hacia atrás (grados desde la vertical).
 * seatY = altura del asiento. feet: 'floor' | [x, y] (tobillo) | 'none'.
 */
export const seated = ({ seatX = 0, seatY = FLOOR_Y - 46, lean = 8, feet = 'floor', footX, stance = 12, back = true, knee } = {}) => {
  const pelvisAt = [seatX, seatY - 9, 0];
  const pose = { pelvis: { at: pelvisAt, pitch: -lean } };
  if (feet === 'floor') {
    const fx = footX ?? seatX + 36;
    Object.assign(pose, {
      legL: { to: [fx, ANKLE_Y, stance], pole: [1, -0.5, 0.15] }, legR: { to: [fx, ANKLE_Y, -stance], pole: [1, -0.5, -0.15] },
      footL: { flat: true, out: 8 }, footR: { flat: true, out: 8 },
    });
  } else if (Array.isArray(feet)) {
    Object.assign(pose, {
      legL: { to: [feet[0], feet[1], stance], pole: knee ?? [0.6, -1, 0.1] }, legR: { to: [feet[0], feet[1], -stance], pole: knee ?? [0.6, -1, -0.1] },
      footL: { dir: [0.2, -1, 0] }, footR: { dir: [0.2, -1, 0] },
    });
  }
  const props = (sk) => {
    const items = [E.pad([seatX - 16, seatY, 0], [seatX + 14, seatY, 0], 13, 5)];
    if (back) {
      const a = chestPoint(sk, 2, -10.5);
      const b = chestPoint(sk, 44, -10.5);
      items.push(E.slantPad(a, madd(b, [norm(add(b, scale(a, -1))), 4]), sk.pelvis.basis.fwd, { halfW: 13 }));
    }
    return items;
  };
  return { pose, props };
};

// De pie: pelvis + piernas apoyadas. hinge = inclinación del tronco (bisagra de cadera) y knee = descenso de cadera.
export const standing = ({ x = 0, drop = 0, hinge = 0, stance = 10.5, footX = 0, toeOut = 8, kneeOut = 0.2, stagger = 0, yaw = 0 } = {}) => ({
  pelvis: { at: [x, STAND_HIP_Y + 0.6 + drop, 0], pitch: hinge, yaw },
  legL: { to: [footX + stagger, ANKLE_Y, stance], pole: [1, -0.1, kneeOut] },
  legR: { to: [footX - stagger, ANKLE_Y, -stance], pole: [1, -0.1, -kneeOut] },
  footL: { flat: true, out: toeOut },
  footR: { flat: true, out: toeOut },
});

// Postura escalonada (un pie adelante): para cruces de polea, press de pie, etc.
export const splitStance = ({ x = 0, drop = 2, hinge = 0, front = 14, back = -16, stance = 8 } = {}) => ({
  pelvis: { at: [x, STAND_HIP_Y + 0.6 + drop, 0], pitch: hinge },
  legL: { to: [front, ANKLE_Y, stance], pole: [1, -0.1, 0.1] },
  legR: { to: [back, ANKLE_Y - 1.5, -stance], pole: [1, 0, -0.1] },
  footL: { flat: true, out: 6 },
  footR: { plantar: 28 },
});

/*
 * Plancha / flexión: cuerpo recto de los pies a los hombros. shoulderH = altura del hombro sobre el piso.
 * knees = apoyo en rodillas. feetY = altura de los pies (cajón). Devuelve pose + puntos útiles.
 */
export const plankBody = ({ shoulderH = 48, toeX = -60, feetY = FLOOR_Y, knees = false, roll = 0, yaw = 0 } = {}) => {
  const legLen = knees ? BODY.thigh + 4 : BODY.thigh + BODY.shin + 4;
  const bodyLen = BODY.pelvisLen + BODY.chestLen + legLen;
  // En punta de pie el tobillo queda ~12 cm sobre el apoyo (pie casi vertical, dedos en el piso).
  const supportY = knees ? FLOOR_Y - 4.5 : feetY - 12;
  const shoulderY = FLOOR_Y - shoulderH;
  const rise = supportY - shoulderY;
  const angle = Math.asin(Math.max(-0.95, Math.min(0.95, rise / bodyLen)));
  const pitch = 90 - (angle * 180) / Math.PI;
  const hip = [toeX + legLen * Math.cos(angle), supportY - legLen * Math.sin(angle), 0];
  const pose = { pelvis: { at: hip, pitch, roll, yaw }, neck: { flex: -12 } };
  if (knees) Object.assign(pose, { legL: { e: 0, p: 0, b: 100 }, legR: { e: 0, p: 0, b: 100 }, footL: { plantar: 30 }, footR: { plantar: 30 } });
  else Object.assign(pose, { legL: { e: 0, p: 2, b: 0 }, legR: { e: 0, p: 2, b: 0 }, footL: { plantar: -12 }, footR: { plantar: -12 } });
  const shoulderX = hip[0] + 44 * Math.cos(angle);
  return { pose, shoulderX, shoulderY, hip };
};

// Hombro aproximado sin brazos (para apuntar las manos antes de construir).
export const shoulders = (sk) => ({ L: shoulderOf(sk, 'L'), R: shoulderOf(sk, 'R') });
export { mix };
