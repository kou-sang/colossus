import { BODY, createSkeleton, FLOOR_Y, gripPoint, orientBasis, STAND_HIP_Y } from '../../utils/figure/skeleton';
import { add, cross, dot, lerp, madd, mix, mixV, norm, scale, sub } from '../../utils/figure/vec';

/*
 * Ayudas para armar posturas (de pie, sentado, acostado, colgado, en plancha…) con las piernas y los brazos
 * resueltos por cinemática inversa: los pies quedan apoyados y las manos llegan exactamente a la barra o manija.
 * Cada ejercicio es una función `fase (0 → 1) → escena`, así el fotograma "mitad" sale del mismo movimiento.
 */

export { BODY, FLOOR_Y, STAND_HIP_Y, gripPoint, add, cross, dot, lerp, madd, mix, mixV, norm, scale, sub };
export const ANKLE_Y = FLOOR_Y - BODY.ankleH;
export const BENCH_TOP = FLOOR_Y - 36;

// Escena a partir de una pose y una función de implementos que recibe el esqueleto.
export const scene = (pose, props = () => []) => {
  const skeleton = createSkeleton(pose);
  return { skeleton, props: [props(skeleton)].flat(Infinity).filter(Boolean) };
};

// Piernas de pie con los pies apoyados (rodillas hacia adelante y apenas afuera).
export const standLegs = ({ footX = 0, stance = 10.5, toeOut = 8, kneeOut = 0.2, stagger = 0, lift } = {}) => ({
  legL: { to: [footX + stagger, ANKLE_Y - (lift?.L ?? 0), stance], pole: [1, -0.1, kneeOut] },
  legR: { to: [footX - stagger, ANKLE_Y - (lift?.R ?? 0), -stance], pole: [1, -0.1, -kneeOut] },
  footL: { flat: !(lift?.L), out: toeOut, plantar: lift?.L ? 25 : 0 },
  footR: { flat: !(lift?.R), out: toeOut, plantar: lift?.R ? 25 : 0 },
});

// Pelvis de pie: altura según flexión de rodillas (0 = parado), inclinación del tronco y retroceso de cadera.
export const standPelvis = ({ x = 0, drop = 0, pitch = 0, yaw = 0, roll = 0, z = 0 } = {}) => ({ at: [x, STAND_HIP_Y + 0.6 + drop, z], pitch, yaw, roll });

// Brazo que toma algo en `point` (centro del puño). `pole` = hacia dónde apunta el codo.
export const grab = (point, pole, pr = 180, extra = {}) => ({ arm: { grip: point, pole }, hand: { pr, grip: 'fist', ...extra } });

// Asigna brazos/manos de ambos lados: `both(spec(L), spec(R))`.
export const arms = (left, right = left) => ({ armL: left.arm, handL: left.hand, armR: right.arm, handR: right.hand });

// Brazo por ángulos con mano.
export const armAngles = (e, p, b = 0, r = 0, hand = {}) => ({ arm: { e, p, b, r }, hand: { pr: 90, grip: 'open', ...hand } });

// Piernas por ángulos (colgado, en el aire).
export const legAngles = (e, p, b = 0, r = 0, foot = {}) => ({ leg: { e, p, b, r }, foot });
export const legs = (left, right = left) => ({ legL: left.leg, footL: left.foot, legR: right.leg, footR: right.foot });

// Piernas con los tobillos en puntos dados (rodilla hacia `pole`).
export const legTo = (ankle, pole = [1, 0, 0], foot = { flat: true }) => ({ leg: { to: ankle, pole }, foot });

// Centro entre dos puños (para ubicar barras).
export const fistMid = (sk) => lerp(gripPoint(sk, 'L'), gripPoint(sk, 'R'), 0.5);
export const fist = (sk, side) => gripPoint(sk, side);

// Interpola números o vectores de una tabla de fases [[0, a], [0.5, b], [1, c]].
export const track = (phase, keys) => {
  for (let index = 0; index < keys.length - 1; index += 1) {
    const [p0, a] = keys[index];
    const [p1, b] = keys[index + 1];
    if (phase <= p1) {
      const t = p1 === p0 ? 0 : (phase - p0) / (p1 - p0);
      return Array.isArray(a) ? mixV(a, b, t) : mix(a, b, t);
    }
  }
  return keys[keys.length - 1][1];
};

// Altura de la pelvis acostado boca arriba sobre una superficie (banco o piso).
export const supineY = (surfaceY) => surfaceY - BODY.backDepth;
export const proneY = (surfaceY) => surfaceY - BODY.chestFront + 1;

// Pose en dos pasadas: primero el tronco (sin brazos) para ubicar puntos del cuerpo, después los brazos.
export const withBody = (pose, extra) => {
  const first = createSkeleton(pose);
  return { ...pose, ...extra(first) };
};

// Punto en el marco del tórax: altura desde la cadera (h), adelante (f, + pecho / − espalda) y lateral (l, + izquierda).
export const chestPoint = (sk, h, f = 0, l = 0) => {
  const { basis } = sk.chest;
  const base = h <= BODY.pelvisLen ? madd(sk.pelvis.o, [sk.pelvis.basis.up, h]) : madd(sk.waist, [basis.up, h - BODY.pelvisLen]);
  const b = h <= BODY.pelvisLen ? sk.pelvis.basis : basis;
  return madd(base, [b.fwd, f], [b.lat, l]);
};

// Pelvis ubicada para que el centro de los hombros quede en S con la orientación dada (colgado, fondos, bisagras).
export const pelvisFromShoulders = (S, pitch, extra = {}) => madd(S, [orientBasis({ pitch, ...extra }).up, -(BODY.pelvisLen + BODY.chestLen)]);

export const sideSign = (side) => (side === 'L' ? 1 : -1);

// Puntos de referencia frecuentes.
export const shoulderOf = (sk, side) => sk.arms[side].root;
export const hipOf = (sk, side) => sk.legs[side].root;
export const kneeOf = (sk, side) => sk.legs[side].mid;
export const ankleOf = (sk, side) => sk.legs[side].end;

// Mano sobre el piso/apoyo (palma plana).
export const palmDown = (point, pole, pr = 180) => ({ arm: { to: point, pole }, hand: { pr, grip: 'flat', flex: -70 } });
