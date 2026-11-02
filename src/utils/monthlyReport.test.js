import { describe, expect, it } from 'vitest';
import { buildMonthlyReport } from './monthlyReport';

const now = new Date('2026-11-02T12:00:00');
const sessions = (extra) => Array.from({ length: 30 }, (_, index) => ({
  userId: 'a', exercise: 'PRESS BANCA', sets: 3, reps: 12, weight: 60, e1rm: 84, isPr: false, performedAt: new Date(now - index * 2 * 864e5), ...extra,
}));

describe('buildMonthlyReport', () => {
  it('sin registros devuelve un informe vacío', () => {
    expect(buildMonthlyReport([], 'a', now).isEmpty).toBe(true);
  });

  it('estancado en el tope de repeticiones → aumentar kilogramos', () => {
    const titles = buildMonthlyReport(sessions(), 'a', now).recommendations.map((item) => item.title);
    expect(titles).toContain('Aumentar kilogramos en PRESS BANCA');
    expect(titles).toContain('Hacer ejercicios de abdomen');
  });

  it('estancado lejos del fallo (RIR ≥ 3) → acercarse al fallo antes de subir peso', () => {
    const titles = buildMonthlyReport(sessions({ rir: 4 }), 'a', now).recommendations.map((item) => item.title);
    expect(titles).toContain('Acercarte más al fallo en PRESS BANCA');
    expect(titles).toContain('Entrenar más cerca del fallo');
  });
});
