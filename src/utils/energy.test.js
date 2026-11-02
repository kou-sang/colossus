import { describe, expect, it } from 'vitest';
import { buildNutritionPlan, computeBmr, estimateCalories } from './energy';

describe('energía', () => {
  it('metabolismo basal con Mifflin-St Jeor', () => {
    expect(computeBmr({ weightKg: 80, heightCm: 180, age: 30, sex: 'masculino' })).toBe(1780);
    expect(computeBmr({ weightKg: 60, heightCm: 165, age: 30, sex: 'femenino' })).toBe(1320);
    expect(computeBmr({ weightKg: 0, heightCm: 165, age: 30 })).toBeNull();
  });

  it('calorías = MET × kg × horas (cardio usa las reps como minutos)', () => {
    expect(estimateCalories({ exercise: 'RUNNING', sets: 1, reps: 30 }, 70)).toBe(Math.round(9.8 * 70 * 0.5));
  });

  it('el objetivo de bajar grasa nunca queda por debajo del basal', () => {
    const plan = buildNutritionPlan({ weightKg: 80, heightCm: 180, age: 30, sex: 'masculino', activity: 'light', goal: 'lose' }, 300, 40);
    expect(plan.target).toBeLessThan(plan.maintenance);
    expect(plan.target).toBeGreaterThanOrEqual(plan.bmr);
    expect(plan.macros.protein).toBe(176); // 2,2 g/kg
  });
});
