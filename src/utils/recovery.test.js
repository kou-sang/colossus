import { describe, expect, it } from 'vitest';
import { buildMuscleRecovery, classifyRecovery } from './recovery';

const NOW = new Date(2026, 10, 4, 12);
const hoursAgo = (hours) => new Date(NOW.getTime() - hours * 3_600_000);
const log = (exercise, hours, sets = 4, extra = {}) => ({ userId: 'u1', exercise, performedAt: hoursAgo(hours), sets, ...extra });

// Sesión de pecho exigente: 4 press banca + 4 press inclinado + 3 aperturas, cerca del fallo.
const chestDay = (hours) => [log('PRESS BANCA', hours, 4, { rir: 1 }), log('PRESS INCLINADO', hours, 4, { rir: 1 }), log('APERTURAS CON MANCUERNAS', hours, 3, { rir: 1 })];

describe('mapa de Recuperación', () => {
  it('a las 48 h de una sesión exigente el músculo sigue fatigado (no "recuperado")', () => {
    const state = buildMuscleRecovery(chestDay(48), { userIds: ['u1'], now: NOW });
    expect(classifyRecovery(state.pecho_medio.percent).key).not.toBe('fresh');
    expect(state.pecho_medio.percent).toBeGreaterThanOrEqual(45);
    expect(state.pecho_medio.hoursToRecover).toBeGreaterThan(24);
  });

  it('se recupera en unos 4–5 días', () => {
    expect(classifyRecovery(buildMuscleRecovery(chestDay(24 * 5), { userIds: ['u1'], now: NOW }).pecho_medio.percent).key).toBe('fresh');
  });

  it('mucho volumen en la semana hace la recuperación más lenta', () => {
    const single = buildMuscleRecovery(chestDay(60), { userIds: ['u1'], now: NOW }).pecho_medio.percent;
    const heavyWeek = buildMuscleRecovery([...chestDay(60), ...chestDay(110), ...chestDay(150)], { userIds: ['u1'], now: NOW }).pecho_medio;
    expect(heavyWeek.weeklyLoad).toBeGreaterThan(20);
    expect(heavyWeek.percent).toBeGreaterThan(single);
  });

  it('un músculo que solo ayuda se fatiga menos que el principal', () => {
    const state = buildMuscleRecovery(chestDay(24), { userIds: ['u1'], now: NOW });
    expect(state.pecho_medio.percent).toBeGreaterThan(state.serrato.percent);
    expect(state.gemelos.percent).toBe(0);
  });
});
