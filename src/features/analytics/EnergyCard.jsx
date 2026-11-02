import { Droplets, Flame, Pencil, Timer, Utensils } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ChartInfo } from '../../components/ChartInfo';
import { SectionCard, StatTile } from '../../components/ui';
import { CATEGORY_LABELS } from '../../constants/muscles';
import { useTheme } from '../../context/ThemeContext';
import { BodyStatsForm } from '../profile/BodyStatsForm';
import { playClick } from '../../utils/audio';
import { buildEnergyReport, buildNutritionPlan, DEFAULT_BODY_WEIGHT } from '../../utils/energy';
import { CHART_INFO } from './chartInfo';

const formatKcal = (value) => `${Math.round(value).toLocaleString('es-AR')} kcal`;

const MacroRow = ({ label, grams, kcalPerGram, total, color, detail }) => {
  const kcal = grams * kcalPerGram;
  const percent = total ? Math.round((kcal / total) * 100) : 0;
  return (
    <li className="text-sm">
      <div className="flex justify-between gap-2">
        <span className="font-semibold">{label}</span>
        <span className="shrink-0 font-bold tabular-nums">{grams} g <span className="font-normal text-muted">· {percent}%</span></span>
      </div>
      <div className="mt-0.5 h-1.5 overflow-hidden rounded-full surface-2" aria-hidden>
        <div className="h-full rounded-full" style={{ width: `${percent}%`, background: color }} />
      </div>
      {detail && <p className="mt-0.5 text-[11px] text-muted">{detail}</p>}
    </li>
  );
};

/**
 * Informe de calorías quemadas (estimadas por MET) y plan de alimentación orientativo según datos corporales.
 * El plan solo se muestra para el perfil propio: los datos corporales de otros perfiles son privados.
 */
export const EnergyCard = ({ logs, rangeStart, rangeEnd, rangeDays, user, isSelf, focusName }) => {
  const { chart } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const stats = useMemo(() => (isSelf && user.bodyStats ? { ...user.bodyStats, sex: user.gender } : null), [isSelf, user.bodyStats, user.gender]);
  const bodyWeight = stats?.weightKg ?? DEFAULT_BODY_WEIGHT;

  const report = useMemo(
    () => buildEnergyReport(logs, { bodyWeightKg: bodyWeight, since: rangeStart, until: rangeEnd, days: rangeDays }),
    [logs, bodyWeight, rangeStart, rangeEnd, rangeDays],
  );
  const plan = useMemo(
    () => (stats ? buildNutritionPlan(stats, report.perDay, rangeDays ? report.minutes / rangeDays : 0) : null),
    [stats, report, rangeDays],
  );
  const maxCategory = report.byCategory[0]?.kcal ?? 1;

  return (
    <SectionCard
      title="Calorías y alimentación"
      subtitle={`${focusName} · gasto estimado del entrenamiento en el rango elegido`}
      actions={<ChartInfo info={CHART_INFO.energy} />}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Flame} label="Gastadas" value={formatKcal(report.total)} hint="entrenando, en el rango" />
        <StatTile icon={Flame} label="Por día entrenado" value={formatKcal(report.perActiveDay)} hint={`${report.activeDays} día(s) con registros`} />
        <StatTile icon={Timer} label="Tiempo activo" value={`${Math.round(report.minutes / 60 * 10) / 10} h`} hint="estimado por series y minutos" />
        <StatTile icon={Flame} label="Promedio diario" value={formatKcal(report.perDay)} hint="repartido en todos los días" />
      </div>
      {!stats && (
        <p className="mt-2 text-xs text-muted">
          {isSelf ? `Calculado con ${DEFAULT_BODY_WEIGHT} kg de peso corporal: carga tus datos abajo para afinarlo.` : `Calculado con ${DEFAULT_BODY_WEIGHT} kg (los datos corporales de cada perfil son privados).`}
        </p>
      )}

      {report.total > 0 && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="min-w-0">
            <h4 className="mb-2 text-sm font-bold">Por categoría</h4>
            <ul className="space-y-2">
              {report.byCategory.slice(0, 6).map((category, index) => (
                <li key={category.id} className="text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="min-w-0 truncate font-semibold">{CATEGORY_LABELS[category.id] ?? category.id}</span>
                    <span className="shrink-0 tabular-nums">{formatKcal(category.kcal)}</span>
                  </div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full surface-2" aria-hidden>
                    <div className="h-full rounded-full" style={{ width: `${(category.kcal / maxCategory) * 100}%`, background: chart.series[index % chart.series.length] }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h4 className="mb-2 text-sm font-bold">Ejercicios que más gastaron</h4>
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {report.topExercises.map((item) => (
                <li key={item.exercise}><span className="font-semibold">{item.exercise}</span> <span className="text-secondary">· {formatKcal(item.kcal)}</span></li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {isSelf && (
        <div className="mt-5 border-t divider pt-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h4 className="flex items-center gap-2 text-base font-bold"><Utensils size={18} aria-hidden /> Alimentación recomendada</h4>
            {stats && !isEditing && (
              <button type="button" className="btn btn-ghost min-h-[36px] px-3 text-xs" onClick={() => { playClick(); setIsEditing(true); }}>
                <Pencil size={14} aria-hidden /> Mis datos
              </button>
            )}
          </div>

          {(!stats || isEditing) && (
            <>
              {!stats && <p className="mb-3 text-sm text-secondary">Carga tu peso, altura, edad y objetivo para calcular calorías y macronutrientes diarios.</p>}
              <BodyStatsForm uid={user.id} stats={user.bodyStats} onSaved={() => setIsEditing(false)} />
            </>
          )}

          {plan && !isEditing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <StatTile icon={Utensils} label={`Objetivo · ${plan.goal.label}`} value={formatKcal(plan.target)} hint="por día" />
                <StatTile icon={Flame} label="Mantenimiento" value={formatKcal(plan.maintenance)} hint={`basal ${plan.bmr} + actividad + entrenamiento`} />
                <StatTile icon={Droplets} label="Agua" value={`${(plan.waterMl / 1000).toLocaleString('es-AR')} L`} hint="por día (+ lo que transpires)" />
              </div>
              <ul className="space-y-2">
                <MacroRow label="Proteína" grams={plan.macros.protein} kcalPerGram={4} total={plan.target} color={chart.series[0]}
                  detail={`Rango útil ${plan.proteinRange[0]}–${plan.proteinRange[1]} g/día. Repártela en 3–5 comidas de ${plan.proteinPerMeal[0]}–${plan.proteinPerMeal[1]} g.`} />
                <MacroRow label="Carbohidratos" grams={plan.macros.carbs} kcalPerGram={4} total={plan.target} color={chart.series[3]}
                  detail="La energía del entrenamiento: prioriza avena, arroz, papa, frutas y legumbres alrededor de la sesión." />
                <MacroRow label="Grasas" grams={plan.macros.fat} kcalPerGram={9} total={plan.target} color={chart.series[1]}
                  detail="No bajes de ~0,8 g/kg: son necesarias para las hormonas. Aceite de oliva, palta, frutos secos, pescado." />
              </ul>
              <div className="rounded-xl surface-2 p-3">
                <h5 className="mb-1.5 text-sm font-bold">Consejos para tu objetivo</h5>
                <ul className="list-disc space-y-1 pl-5 text-sm text-secondary">
                  {plan.goal.value === 'lose' && <li>Déficit moderado (≈ 0,5–1% del peso por semana): conserva el músculo si mantienes la fuerza y la proteína alta.</li>}
                  {plan.goal.value === 'muscle' && <li>Superávit chico: ganar 0,25–0,5% del peso por semana minimiza la grasa ganada.</li>}
                  {plan.goal.value === 'maintain' && <li>Pésate 2–3 veces por semana y ajusta 100–200 kcal si la tendencia se mueve más de 1 kg al mes.</li>}
                  <li>Comida con proteína y carbohidratos 1–3 h antes de entrenar; otra con 0,4 g/kg de proteína dentro de las 2–3 h siguientes.</li>
                  <li>Fibra: unos {plan.fiber} g/día (verduras, frutas, legumbres, integrales).</li>
                  <li>La creatina monohidrato (3–5 g/día) es el suplemento con más evidencia para fuerza; no es obligatoria.</li>
                </ul>
              </div>
              <p className="text-[11px] text-muted">
                Estimación orientativa (Mifflin-St Jeor + gasto registrado). No reemplaza la consulta con un/a nutricionista,
                sobre todo si tienes alguna condición médica.
              </p>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
};
