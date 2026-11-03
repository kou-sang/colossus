import { useMemo, useState } from 'react';
import { ChartInfo } from '../../components/ChartInfo';
import { SectionCard } from '../../components/ui';
import { MUSCLE_BY_ID } from '../../constants/muscles';
import { useTheme } from '../../context/ThemeContext';
import { interpolateColorStops } from '../../utils/colors';
import { buildMuscleFatigue, classifyFatigue, FATIGUE_LEVELS } from '../../utils/fatigue';
import { CHART_INFO } from './chartInfo';
import { MuscleMap } from './MuscleMap';
import { CRITICAL_RECENCY_DAYS } from './analyticsConstants';

const TOP_FATIGUED = 5;

// Reutiliza el degradado verde → rojo del mapa de Recuperación (0% = verde, 100% = rojo).
const colorForPercent = (stops, percent) => interpolateColorStops(stops, (percent / 100) * CRITICAL_RECENCY_DAYS);

const formatHours = (hours) => (hours >= 24 ? `${Math.round(hours / 24 * 10) / 10} d` : `${hours} h`);

/**
 * Mapa de fatiga muscular "ahora": cuánto le falta a cada músculo para recuperarse según lo entrenado en los últimos días.
 * `logs` ya filtrados por categoría/músculo; `userIds` = perfil foco (o la selección, promediada).
 */
export const FatigueMapCard = ({ logs, userIds, gender, focusName, enabledMuscles }) => {
  const { chart } = useTheme();
  const [selected, setSelected] = useState(null);
  // `now` se fija al montar (la pestaña se re-monta al volver): evita recalcular en cada render.
  const [now] = useState(() => new Date());
  const fatigue = useMemo(() => buildMuscleFatigue(logs, { userIds, now }), [logs, userIds, now]);

  const ranked = useMemo(
    () => Object.entries(fatigue).filter(([, value]) => value.percent > 0).sort((a, b) => b[1].percent - a[1].percent),
    [fatigue],
  );
  const fatigued = ranked.filter(([, value]) => value.percent >= FATIGUE_LEVELS[0].max).slice(0, TOP_FATIGUED);
  const describe = (muscleId) => {
    const value = fatigue[muscleId];
    const label = MUSCLE_BY_ID[muscleId]?.label ?? muscleId;
    return `${label}: ${value?.percent ?? 0}% de fatiga${value?.hoursToRecover ? ` · recuperado en ~${formatHours(value.hoursToRecover)}` : ''}`;
  };

  const legend = (
    <div className="mx-auto w-full max-w-xs">
      <div className="h-2.5 rounded-full" style={{ background: `linear-gradient(90deg, ${[0, 25, 50, 75, 100].map((p) => `${colorForPercent(chart.recencyStops, p)} ${p}%`).join(', ')})` }} />
      <div className="mt-1 flex justify-between text-[11px] font-semibold text-secondary">
        <span>0% fresco</span><span>50%</span><span>100% agotado</span>
      </div>
    </div>
  );

  return (
    <SectionCard
      title="Mapa de fatiga muscular"
      subtitle={`${focusName} · cómo están tus músculos hoy`}
      actions={<ChartInfo info={CHART_INFO.fatigue} />}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <MuscleMap
          gender={gender}
          mode="stimulus"
          selectedMuscle={selected}
          enabledMuscles={enabledMuscles}
          onSelect={setSelected}
          colorFor={(muscleId) => colorForPercent(chart.recencyStops, fatigue[muscleId]?.percent ?? 0)}
          describe={describe}
          legend={legend}
          hint="Toca un músculo para ver su fatiga y cuándo estará recuperado."
        />
        <div className="min-w-0 space-y-3">
          {selected && (
            <p role="status" className="rounded-xl surface-2 p-3 text-sm">
              <strong>{MUSCLE_BY_ID[selected]?.label}</strong>: {fatigue[selected]?.percent ?? 0}% ({classifyFatigue(fatigue[selected]?.percent ?? 0).label.toLowerCase()})
              {fatigue[selected]?.hoursToRecover > 0 && <> · recuperado en ~{formatHours(fatigue[selected].hoursToRecover)}</>}
              {fatigue[selected]?.last && <span className="block text-xs text-muted">Último ejercicio: {fatigue[selected].last.exercise}</span>}
            </p>
          )}
          <div>
            <h4 className="mb-2 text-sm font-bold">Más fatigados</h4>
            {fatigued.length ? (
              <ul className="space-y-2">
                {fatigued.map(([muscleId, value]) => (
                  <li key={muscleId} className="text-sm">
                    <div className="flex justify-between gap-2">
                      <span className="min-w-0 truncate font-semibold">{MUSCLE_BY_ID[muscleId]?.short}</span>
                      <span className="shrink-0 text-xs text-secondary">{value.percent}% · ~{formatHours(value.hoursToRecover)}</span>
                    </div>
                    <div className="mt-0.5 h-1.5 overflow-hidden rounded-full surface-2" aria-hidden>
                      <div className="h-full rounded-full" style={{ width: `${value.percent}%`, background: colorForPercent(chart.recencyStops, value.percent) }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-secondary">Todo recuperado. Buen día para una sesión fuerte.</p>
            )}
          </div>
          {fatigued.length > 0 && (
            <p className="text-xs text-muted">
              Para hoy conviene priorizar músculos en verde. Entrenar un músculo con fatiga alta no está prohibido, pero rinde menos y suma riesgo.
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
};
