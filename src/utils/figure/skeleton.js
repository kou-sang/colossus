import { add, angleBetween, cross, dot, len, madd, norm, perp, rotate, scale, sub, v } from './vec';

/*
 * Esqueleto 3D del motor de figuras (desde 4.6.0).
 * Mundo: x = adelante (la figura mira a +x por defecto), y = abajo (como el lienzo SVG), z = lado izquierdo de la figura.
 * Unidad ≈ 1,2 cm: una persona de 1,75 m mide ~145 unidades; el piso está en y = FLOOR_Y.
 *
 * Una pose se describe con:
 *  - pelvis: { at: [x, y, z], pitch, yaw, roll } — pitch = inclinación del tronco desde la vertical (+ hacia adelante,
 *    90 = boca abajo, -90 = boca arriba con la cabeza hacia -x); yaw = giro sobre la vertical; roll = inclinación lateral.
 *  - spine: { flex, side, twist } — tórax respecto de la pelvis (flexión + = encorvarse hacia adelante).
 *  - neck: { flex, turn, side } — cabeza respecto del tórax.
 *  - shoulders: { L: { elev, protract }, R } — elevación (encogerse) y protracción escapular.
 *  - armL/armR, legL/legR: por ángulos { e, p, b, r } o por objetivo { to, pole }.
 *      e = elevación del segmento proximal (0 = abajo junto al cuerpo, 90 = horizontal, 180 = arriba),
 *      p = plano (0 = adelante, 90 = hacia afuera, 180 = atrás, -90 = cruzando el cuerpo),
 *      b = flexión de codo/rodilla (0 = estirado), r = rotación (+ externa).
 *      `to` = posición de la muñeca / tobillo en el mundo y `pole` = hacia dónde apunta el codo / la rodilla.
 *  - handL/handR: { pr, flex, dev, grip } — pr = pronación (0 supino, 90 neutro, 180 prono), grip: 'fist' | 'open' | 'flat'.
 *  - footL/footR: { flat, plantar, out, dir } — flat = apoyado en el piso; plantar = flexión plantar (+ punta abajo).
 * Codo y rodilla son bisagras: por construcción solo flexionan hacia el lado anatómico correcto.
 * `checkAnatomy` valida rangos articulares (lo usan las pruebas para que no haya posturas imposibles).
 */

export const FLOOR_Y = 148;

export const BODY = Object.freeze({
  hipHalf: 7.5,
  pelvisLen: 14,
  chestLen: 30,
  shoulderHalf: 16,
  neckLen: 7.5,
  headCenter: 7.2,
  upperArm: 26,
  forearm: 22,
  palm: 8.5,
  fingers: 6.5,
  thigh: 35,
  shin: 34,
  ankleH: 5,
  heel: 4.5,
  toe: 15.5,
  // Medias profundidades útiles para apoyar el cuerpo en bancos y en el piso.
  backDepth: 8.5,
  pelvisDepth: 8,
  chestFront: 10.5,
});

export const STAND_HIP_Y = FLOOR_Y - BODY.ankleH - BODY.shin - BODY.thigh;

const UP = Object.freeze([0, -1, 0]);
const FWD = Object.freeze([1, 0, 0]);
const LAT = Object.freeze([0, 0, 1]);

// Base (up, fwd, lat) orientada por pitch/yaw/roll.
export const orientBasis = ({ pitch = 0, yaw = 0, roll = 0 } = {}) => {
  let up = [...UP];
  let fwd = [...FWD];
  let lat = [...LAT];
  if (roll) { up = rotate(up, fwd, roll); lat = rotate(lat, fwd, roll); }
  if (pitch) { up = rotate(up, lat, pitch); fwd = rotate(fwd, lat, pitch); }
  if (yaw) { const axis = [0, -1, 0]; up = rotate(up, axis, yaw); fwd = rotate(fwd, axis, yaw); lat = rotate(lat, axis, yaw); }
  return { up, fwd, lat };
};

// Rota una base hija respecto de su padre: flexión (sobre lat), inclinación lateral (sobre fwd) y giro (sobre up).
const childBasis = (parent, { flex = 0, side = 0, twist = 0, turn = 0 } = {}) => {
  let { up, fwd, lat } = parent;
  if (flex) { up = rotate(up, lat, flex); fwd = rotate(fwd, lat, flex); }
  if (side) { up = rotate(up, fwd, -side); lat = rotate(lat, fwd, -side); }
  const spin = twist + turn;
  if (spin) { fwd = rotate(fwd, up, -spin); lat = rotate(lat, up, -spin); }
  return { up, fwd, lat };
};

const outward = (basis, side) => (side === 'L' ? basis.lat : scale(basis.lat, -1));

// Transporta el marco neutro del segmento proximal (dirección abajo, anterior = fwd) a la elevación e en el plano p.
const transport = (basis, side, e, p) => {
  const down = scale(basis.up, -1);
  const planeDir = norm(add(scale(basis.fwd, Math.cos((p * Math.PI) / 180)), scale(outward(basis, side), Math.sin((p * Math.PI) / 180))));
  let axis = cross(down, planeDir);
  if (len(axis) < 1e-6) axis = basis.lat;
  axis = norm(axis);
  return { d: norm(rotate(down, axis, e)), a: norm(rotate(basis.fwd, axis, e)) };
};

// Segmento distal: el codo flexiona hacia anterior, la rodilla hacia posterior.
const bendDistal = (d1, a1, bend, kind) => {
  const hinge = norm(cross(d1, a1));
  const signed = kind === 'arm' ? bend : -bend;
  return { d2: norm(rotate(d1, hinge, signed)), a2: norm(rotate(a1, hinge, signed)) };
};

const limbByAngles = (root, basis, side, spec, kind, L1, L2) => {
  const { e = 0, p = 0, b = 0, r = 0 } = spec;
  const t = transport(basis, side, e, p);
  const d1 = t.d;
  const a1 = norm(rotate(t.a, d1, side === 'L' ? -r : r));
  const { d2, a2 } = bendDistal(d1, a1, b, kind);
  const mid = madd(root, [d1, L1]);
  return { root, mid, end: madd(mid, [d2, L2]), d1, a1, d2, a2 };
};

const limbByTarget = (root, basis, side, spec, kind, L1, L2) => {
  const toTarget = sub(spec.to, root);
  const reach = len(toTarget);
  const u = reach > 1e-6 ? scale(toTarget, 1 / reach) : scale(basis.up, -1);
  const d = Math.min(Math.max(reach, Math.abs(L1 - L2) + 0.5), L1 + L2 - 0.02);
  const fallbackPole = kind === 'arm' ? scale(basis.fwd, -1) : basis.fwd;
  let pole = perp(spec.pole ?? fallbackPole, u);
  if (len(pole) < 0.5) pole = perp(fallbackPole, u);
  if (len(pole) < 0.5) pole = perp(basis.up, u);
  const x = (L1 * L1 - L2 * L2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, L1 * L1 - x * x));
  const mid = madd(root, [u, x], [pole, h]);
  const end = madd(root, [u, d]);
  const d1 = norm(sub(mid, root));
  const d2 = norm(sub(end, mid));
  // Anterior del segmento proximal: el codo apunta al polo (antebrazo hacia el otro lado); la rodilla apunta al polo.
  const bendDir = perp(d2, d1);
  const straight = angleBetween(d1, d2) < 2;
  let a1;
  if (kind === 'arm') a1 = straight ? perp(scale(pole, -1), d1) : bendDir;
  else a1 = straight ? perp(pole, d1) : scale(bendDir, -1);
  if (len(a1) < 0.5) a1 = perp(basis.fwd, d1);
  const bend = angleBetween(d1, d2);
  const { a2 } = bendDistal(d1, a1, bend, kind);
  return { root, mid, end, d1, a1, d2, a2, reached: reach <= L1 + L2 - 0.02 + 0.6 };
};

const buildLimb = (root, basis, side, spec, kind, L1, L2) =>
  (spec?.to ? limbByTarget : limbByAngles)(root, basis, side, spec ?? {}, kind, L1, L2);

// Mano: dirección, normal de la palma y dirección del pulgar a partir de la pronación y la muñeca.
const buildHand = (limb, side, spec = {}) => {
  const { pr = 90, flex = 0, dev = 0, grip = 'open' } = spec;
  const o2 = side === 'L' ? norm(cross(limb.a2, limb.d2)) : norm(cross(limb.d2, limb.a2));
  const c = Math.cos((pr * Math.PI) / 180);
  const s = Math.sin((pr * Math.PI) / 180);
  let palm = norm(add(scale(limb.a2, c), scale(o2, -s)));
  let thumb = norm(add(scale(o2, c), scale(limb.a2, s)));
  let dir = limb.d2;
  if (flex) {
    const axis = norm(cross(dir, palm));
    dir = norm(rotate(dir, axis, flex));
    palm = norm(rotate(palm, axis, flex));
  }
  if (dev) {
    const axis = norm(cross(dir, thumb));
    dir = norm(rotate(dir, axis, dev));
    thumb = norm(rotate(thumb, axis, dev));
  }
  return { wrist: limb.end, dir, palm, thumb, foreThumb: norm(add(scale(o2, c), scale(limb.a2, s))), forePalm: norm(add(scale(limb.a2, c), scale(o2, -s))), grip, pr };
};

// Pie: apoyado (suela horizontal) o libre (perpendicular a la pierna + flexión plantar).
const buildFoot = (limb, basis, side, spec = {}) => {
  const { flat = false, plantar = 0, out = 8, dir } = spec;
  let fd;
  let fu;
  if (dir) {
    fd = norm(dir);
    fu = perp(scale(limb.d2, -1), fd);
  } else if (flat) {
    let base = [limb.a1[0], 0, limb.a1[2]];
    if (len(base) < 0.3) base = [basis.fwd[0], 0, basis.fwd[2]];
    if (len(base) < 0.3) base = [1, 0, 0];
    base = norm(base);
    fd = norm(rotate(base, [0, -1, 0], side === 'L' ? out : -out));
    fu = [0, -1, 0];
  } else {
    fd = perp(limb.a2, limb.d2);
    fu = scale(limb.d2, -1);
    const axis = norm(cross(fd, fu));
    fd = norm(rotate(fd, axis, -plantar));
    fu = norm(rotate(fu, axis, -plantar));
    if (spec.out) fd = norm(rotate(fd, fu, side === 'L' ? spec.out : -spec.out));
  }
  // Guarda de piso: si la punta o el talón quedarían bajo el piso, se gira el pie lo mínimo (sobre su eje lateral) para apoyarlo.
  if (limb.end[1] < FLOOR_Y - 1) {
    const axis = norm(cross(fd, fu));
    const lowest = (d, u) => {
      const so = madd(limb.end, [u, -BODY.ankleH]);
      return Math.max(madd(so, [d, -BODY.heel])[1], madd(so, [d, BODY.toe])[1]);
    };
    if (lowest(fd, fu) > FLOOR_Y + 0.5) {
      for (let step = 1; step <= 80; step += 1) {
        const found = [step, -step].find((angle) => lowest(rotate(fd, axis, angle), rotate(fu, axis, angle)) <= FLOOR_Y + 0.5);
        if (found !== undefined) { fd = norm(rotate(fd, axis, found)); fu = norm(rotate(fu, axis, found)); break; }
      }
    }
  }
  const fl = norm(cross(fd, fu));
  const sole = madd(limb.end, [fu, -BODY.ankleH]);
  return { ankle: limb.end, dir: fd, up: fu, lat: fl, heel: madd(sole, [fd, -BODY.heel]), toe: madd(sole, [fd, BODY.toe]), ball: madd(sole, [fd, BODY.toe - 3.5]) };
};

/**
 * Esqueleto completo a partir de una pose. Devuelve articulaciones y marcos (todo en coordenadas de mundo).
 */
export const createSkeleton = (pose) => {
  const pelvisSpec = pose.pelvis ?? {};
  // basis explícita (up/fwd/lat) para posturas de costado que no se expresan bien con pitch/yaw/roll.
  const pelvisBasis = pelvisSpec.basis ?? orientBasis(pelvisSpec);
  const P = pelvisSpec.at ?? [0, STAND_HIP_Y, 0];
  const waist = madd(P, [pelvisBasis.up, BODY.pelvisLen]);
  const chestBasis = childBasis(pelvisBasis, pose.spine);
  const chestCenter = madd(waist, [chestBasis.up, BODY.chestLen]);
  const shoulderOf = (side) => {
    const s = pose.shoulders?.[side] ?? {};
    return madd(chestCenter, [outward(chestBasis, side), BODY.shoulderHalf - (s.protract ?? 0) * 0.35], [chestBasis.up, s.elev ?? 0], [chestBasis.fwd, (s.protract ?? 0) - 1]);
  };
  const neckBase = madd(chestCenter, [chestBasis.up, 2.5], [chestBasis.fwd, -1.5]);
  const headBasis = childBasis(chestBasis, pose.neck);
  const neckTop = madd(neckBase, [headBasis.up, BODY.neckLen]);
  const headCenter = madd(neckTop, [headBasis.up, BODY.headCenter], [headBasis.fwd, 1.2]);

  const arms = {};
  const legs = {};
  ['L', 'R'].forEach((side) => {
    const shoulder = shoulderOf(side);
    const armSpec = pose[`arm${side}`];
    const handSpec = pose[`hand${side}`];
    let arm;
    if (armSpec?.grip) {
      // Objetivo = centro del puño (donde va la barra o la manija): se corrige la muñeca en 3 pasadas.
      let target = armSpec.grip;
      for (let pass = 0; pass < 3; pass += 1) {
        arm = limbByTarget(shoulder, chestBasis, side, { to: target, pole: armSpec.pole }, 'arm', BODY.upperArm, BODY.forearm);
        arm.hand = buildHand(arm, side, handSpec);
        const fist = madd(arm.hand.wrist, [arm.hand.dir, 4.2], [arm.hand.palm, 2.2]);
        target = add(target, sub(armSpec.grip, fist));
      }
    } else {
      arm = buildLimb(shoulder, chestBasis, side, armSpec, 'arm', BODY.upperArm, BODY.forearm);
      arm.hand = buildHand(arm, side, handSpec);
    }
    arms[side] = arm;
    const hip = madd(P, [outward(pelvisBasis, side), BODY.hipHalf]);
    const leg = buildLimb(hip, pelvisBasis, side, pose[`leg${side}`], 'leg', BODY.thigh, BODY.shin);
    leg.foot = buildFoot(leg, pelvisBasis, side, pose[`foot${side}`]);
    legs[side] = leg;
  });

  return { pelvis: { o: P, basis: pelvisBasis }, waist, chest: { o: chestCenter, basis: chestBasis }, neckBase, neckTop, head: { o: headCenter, basis: headBasis }, arms, legs, pose };
};

// Punto de agarre (centro del puño) de una mano: donde se ubica la barra o la manija.
export const gripPoint = (skeleton, side) => {
  const hand = skeleton.arms[side].hand;
  return madd(hand.wrist, [hand.dir, 4.2], [hand.palm, 2.2]);
};

// Desplaza todas las posiciones del esqueleto (útil para apoyar en el piso tras construir).
export const translateSkeleton = (sk, delta) => {
  const t = (p) => add(p, delta);
  const limb = (l) => ({ ...l, root: t(l.root), mid: t(l.mid), end: t(l.end) });
  const arms = Object.fromEntries(Object.entries(sk.arms).map(([k, a]) => [k, { ...limb(a), hand: { ...a.hand, wrist: t(a.hand.wrist) } }]));
  const legs = Object.fromEntries(Object.entries(sk.legs).map(([k, l]) => [k, { ...limb(l), foot: { ...l.foot, ankle: t(l.foot.ankle), heel: t(l.foot.heel), toe: t(l.foot.toe), ball: t(l.foot.ball) } }]));
  return { ...sk, pelvis: { ...sk.pelvis, o: t(sk.pelvis.o) }, waist: t(sk.waist), chest: { ...sk.chest, o: t(sk.chest.o) }, neckBase: t(sk.neckBase), neckTop: t(sk.neckTop), head: { ...sk.head, o: t(sk.head.o) }, arms, legs };
};

// ───────── Validación anatómica ─────────

// Ángulo de elevación y plano de un segmento respecto de la base del padre (para validar rangos).
const elevationPlane = (dir, basis, side) => {
  const down = scale(basis.up, -1);
  const e = angleBetween(dir, down);
  const out = outward(basis, side);
  const p = (Math.atan2(dot(dir, out), dot(dir, basis.fwd)) * 180) / Math.PI;
  return { e, p };
};

// Rotación axial implícita del segmento proximal (diferencia entre el anterior real y el transportado).
const impliedRotation = (limb, basis, side) => {
  const { e, p } = elevationPlane(limb.d1, basis, side);
  const neutral = transport(basis, side, e, p).a;
  const a = perp(limb.a1, limb.d1);
  const n = perp(neutral, limb.d1);
  const sign = Math.sign(dot(cross(n, a), limb.d1)) || 1;
  const angle = angleBetween(n, a) * sign;
  return side === 'L' ? -angle : angle;
};

/**
 * Lista de problemas anatómicos de un esqueleto (vacía si la postura es posible).
 * Rangos amplios (personas entrenadas y flexibles), pero excluyen hiperextensiones y torsiones imposibles.
 */
export const checkAnatomy = (sk, { floorY = FLOOR_Y } = {}) => {
  const issues = [];
  const pose = sk.pose ?? {};
  const spine = pose.spine ?? {};
  if ((spine.flex ?? 0) > 90 || (spine.flex ?? 0) < -40) issues.push(`columna: flexión ${spine.flex}`);
  if (Math.abs(spine.twist ?? 0) > 60) issues.push(`columna: giro ${spine.twist}`);
  if (Math.abs(spine.side ?? 0) > 45) issues.push(`columna: inclinación ${spine.side}`);
  const neck = pose.neck ?? {};
  if ((neck.flex ?? 0) > 60 || (neck.flex ?? 0) < -55 || Math.abs(neck.turn ?? 0) > 75) issues.push('cuello fuera de rango');

  ['L', 'R'].forEach((side) => {
    const arm = sk.arms[side];
    const elbow = angleBetween(arm.d1, arm.d2);
    if (elbow > 165) issues.push(`codo ${side}: ${Math.round(elbow)}°`);
    if (dot(arm.d2, arm.a1) < -0.08 && elbow > 5) issues.push(`codo ${side}: dobla hacia atrás`);
    const ap = elevationPlane(arm.d1, sk.chest.basis, side);
    // Con el brazo por encima de ~100° la rotación implícita degenera (gimbal): solo se evalúa por debajo.
    const armRot = impliedRotation(arm, sk.chest.basis, side);
    if (ap.e < 100 && (armRot > 160 || armRot < -160)) issues.push(`hombro ${side}: rotación ${Math.round(armRot)}°`);
    const behind = -dot(arm.d1, sk.chest.basis.fwd);
    if (behind > 0.94) issues.push(`hombro ${side}: extensión excesiva`);
    if (ap.e > 150 && Math.abs(ap.p) > 150) issues.push(`hombro ${side}: posición imposible`);
    const hand = arm.hand;
    const wristFlex = pose[`hand${side}`]?.flex ?? 0;
    if (Math.abs(wristFlex) > 85) issues.push(`muñeca ${side}: ${wristFlex}°`);
    if (hand.pr < -20 || hand.pr > 200) issues.push(`antebrazo ${side}: pronación ${hand.pr}`);

    const leg = sk.legs[side];
    const knee = angleBetween(leg.d1, leg.d2);
    if (knee > 162) issues.push(`rodilla ${side}: ${Math.round(knee)}°`);
    if (dot(leg.d2, leg.a1) > 0.08 && knee > 5) issues.push(`rodilla ${side}: dobla hacia adelante`);
    const legRot = impliedRotation(leg, sk.pelvis.basis, side);
    if (Math.abs(legRot) > 100) issues.push(`cadera ${side}: rotación ${Math.round(legRot)}°`);
    const lp = elevationPlane(leg.d1, sk.pelvis.basis, side);
    const back = -dot(leg.d1, sk.pelvis.basis.fwd);
    if (back > 0.82) issues.push(`cadera ${side}: extensión excesiva`);
    if (lp.e > 150) issues.push(`cadera ${side}: flexión ${Math.round(lp.e)}°`);
    const across = dot(leg.d1, outward(sk.pelvis.basis, side));
    if (across < -0.62) issues.push(`cadera ${side}: aducción excesiva`);
    if (across > 0.96 && lp.e > 70) issues.push(`cadera ${side}: abducción excesiva`);
    const foot = leg.foot;
    const ankle = angleBetween(foot.dir, scale(leg.d2, -1));
    if (ankle < 35 || ankle > 172) issues.push(`tobillo ${side}: ${Math.round(ankle)}°`);
    [leg.mid, foot.heel, foot.toe, arm.mid, hand.wrist].forEach((point) => { if (point[1] > floorY + 2) issues.push(`${side}: atraviesa el piso`); });
  });
  if (sk.head.o[1] > floorY - 4.5) issues.push('cabeza atraviesa el piso');
  return [...new Set(issues)];
};

// Utilidad para builders: posición del hombro ya calculada (para IK de la mano relativa a él).
export const shoulderPoint = (sk, side) => sk.arms[side].root;
export { v as vec3 };
