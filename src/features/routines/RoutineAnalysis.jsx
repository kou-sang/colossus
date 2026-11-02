import { AlertTriangle, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { playClick } from '../../utils/audio';
import { analyzeRoutine, WEEKLY_TARGET } from '../../utils/routineAnalysis';

const TOP_CATEGORIES = 4;

// Barra horizontal con porcentaje (accesible: el texto da el valor, la barra es decorativa).
const ShareBar = ({ label, percent, detail, color }) => (
  <li className="text-sm">
    <div className="flex justify-between gap-2">
      <span className="min-w-0 truncate font-semibold">{label}</span>
      <span className="shrink-0 font-bold tabular-nums">{percent}%</span>
    </div>
    <div className="mt-0.5 h-1.5 overflow-hidden rounded-full surface-2" aria-hidden>
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, percent)}%`, background: color }} />
    </div>
    {detail && <p className="mt-0.5 text-[11px] text-muted">{detail}</p>}
  </li>
);

/**
 * Resumen de músculos que trabaja una rutina: % por categoría, detalle por músculo y músculos sin trabajar.
 * Vista compacta siempre visible en la tarjeta + detalle desplegable.
 */
export const RoutineAnalysis = ({ routine }) => {
  const { chart } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const analysis = useMemo(() => analyzeRoutine(routine), [routine]);
  const workedCategories = analysis.byCategory.filter((category) => category.percent > 0);

  if (analysis.exerciseCount === 0) return null;

  return (
    <section className="mt-3 rounded-xl border divider p-3" aria-label={`Análisis de ${routine.name}`}>
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wide text-muted">Análisis muscular</h4>
        <button type="button" className="text-xs font-bold text-accent underline-offset-2 hover:underline" aria-expanded={isOpen}
          onClick={() => { playClick(); setIsOpen((open) => !open); }}>
          {isOpen ? 'Ocultar detalle' : 'Ver detalle'}
        </button>
      </div>

      {/* Barra apilada: reparto del estímulo semanal entre categorías. */}
      <div className="mt-2 flex h-2.5 overflow-hidden rounded-full surface-2" aria-hidden>
        {workedCategories.map((category, index) => (
          <div key={category.id} style={{ width: `${category.percent}%`, background: chart.series[index % chart.series.length] }} title={`${category.label} ${category.percent}%`} />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-secondary">
        {workedCategories.slice(0, isOpen ? undefined : TOP_CATEGORIES).map((category, index) => (
          <li key={category.id} className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: chart.series[index % chart.series.length] }} aria-hidden />
            {category.label} {category.percent}%
          </li>
        ))}
        {!isOpen && workedCategories.length > TOP_CATEGORIES && <li className="text-muted">+{workedCategories.length - TOP_CATEGORIES} más</li>}
      </ul>

      {analysis.untrained.length > 0 && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-secondary">
          <AlertTriangle size={14} className="mt-px shrink-0 text-accent" aria-hidden />
          <span>
            <strong>Sin trabajar:</strong>{' '}
            {analysis.untrainedCategories.length
              ? analysis.untrainedCategories.map((category) => category.label).join(', ')
              : `${analysis.untrained.length} músculo(s)`}
            {analysis.untrainedCategories.length > 0 && ` (${analysis.untrained.length} músculos en total)`}
          </span>
        </p>
      )}

      {isOpen && (
        <div className="mt-3 space-y-4">
          <p className="text-xs text-muted">
            {analysis.totalSets} series en {analysis.trainingDays.length} día(s). El porcentaje reparte cada serie entre los músculos que trabaja
            (series efectivas); el rango orientativo para crecer es {WEEKLY_TARGET.min}–{WEEKLY_TARGET.max} series efectivas por músculo y semana.
          </p>

          <div>
            <h5 className="mb-2 text-sm font-bold">Por categoría</h5>
            <ul className="space-y-2">
              {workedCategories.map((category, index) => (
                <ShareBar key={category.id} label={category.label} percent={category.percent} color={chart.series[index % chart.series.length]}
                  detail={`${category.sets} series efectivas / semana`} />
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-2 text-sm font-bold">Por músculo</h5>
            <ul className="grid gap-2 sm:grid-cols-2">
              {analysis.byMuscle.filter((muscle) => muscle.sets >= 0.1).map((muscle) => (
                <ShareBar key={muscle.id} label={muscle.label} percent={muscle.percent} color={chart.stimulus[4]}
                  detail={`${muscle.sets} series / semana${muscle.sets >= WEEKLY_TARGET.min && muscle.sets <= WEEKLY_TARGET.max ? ' · en rango' : ''}`} />
              ))}
            </ul>
          </div>

          {analysis.untrained.length > 0 && (
            <div>
              <h5 className="mb-1 text-sm font-bold">Músculos que esta rutina no trabaja</h5>
              <p className="mb-2 text-[11px] text-muted">Ningún ejercicio los estimula al menos un 15%.</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.untrained.map((muscle) => (
                  <span key={muscle.id} className="badge badge-accent" title={muscle.fullLabel}>{muscle.label}</span>
                ))}
              </div>
            </div>
          )}

          {analysis.undertrained.length > 0 && (
            <p className="text-xs text-secondary">
              <strong>Poco volumen</strong> (menos de {WEEKLY_TARGET.min / 2} series/semana): {analysis.undertrained.map((muscle) => muscle.label).join(', ')}.
            </p>
          )}

          {analysis.insights.length > 0 && (
            <ul className="space-y-1.5">
              {analysis.insights.map((insight) => (
                <li key={insight.text} className="flex gap-2 rounded-lg bg-[var(--accent-soft)] p-2 text-xs">
                  {insight.tone === 'warning' ? <AlertTriangle size={14} className="mt-px shrink-0 text-accent" aria-hidden /> : <Info size={14} className="mt-px shrink-0" aria-hidden />}
                  <span>{insight.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};
