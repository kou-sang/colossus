// Álgebra 3D mínima para el motor de figuras (módulo puro, sin dependencias).
export const v = (x = 0, y = 0, z = 0) => [x, y, z];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = (a) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a) => { const l = len(a); return l < 1e-9 ? [0, 0, 0] : scale(a, 1 / l); };
export const lerp = (a, b, t) => add(a, scale(sub(b, a), t));
export const dist = (a, b) => len(sub(a, b));
export const rad = (deg) => (deg * Math.PI) / 180;
export const deg = (r) => (r * 180) / Math.PI;
// Suma ponderada de vectores: madd(p, [v1, s1], [v2, s2]...)
export const madd = (base, ...terms) => terms.reduce((acc, [vec, s]) => add(acc, scale(vec, s)), base);

// Rotación de Rodrigues de un vector alrededor de un eje unitario.
export const rotate = (vec, axis, degrees) => {
  const a = rad(degrees);
  const c = Math.cos(a);
  const s = Math.sin(a);
  return add(add(scale(vec, c), scale(cross(axis, vec), s)), scale(axis, dot(axis, vec) * (1 - c)));
};

// Componente de `a` perpendicular a la dirección unitaria `d`, normalizada.
export const perp = (a, d) => norm(sub(a, scale(d, dot(a, d))));

// Ángulo en grados entre dos vectores.
export const angleBetween = (a, b) => deg(Math.acos(Math.max(-1, Math.min(1, dot(norm(a), norm(b))))));

// Interpolación suave (ease in-out) para fases de movimiento.
export const ease = (t) => t * t * (3 - 2 * t);
export const mix = (a, b, t) => a + (b - a) * t;
// Interpolación de vectores de cualquier largo (keyframes de varios ángulos).
export const mixV = (a, b, t) => a.map((value, index) => value + (b[index] - value) * t);
