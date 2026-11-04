import { ArrowDownRight, ArrowUpRight, CalendarCheck, Dumbbell, HeartPulse, Layers, Lightbulb, Minus, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { useMemo } from 'react';
import { ChartInfo } from '../../components/ChartInfo';
import { SectionCard, Spinner } from '../../components/ui';
import { useSubscription } from '../../hooks/useSubscription';
import { subscribeToLogs } from '../../services/logService';
import { addDays, endOfDay, formatShortDate, parseDateKey } from '../../utils/dates';
import { toUserMessage } from '../../utils/errors';
import { buildMonthlyReport, REPORT_DAYS } from '../../utils/monthlyReport';
import { CHART_INFO } from './chartInfo';

const formatTonnage = (value) => (value >= 1000 ? `${(value / 1000).toFixed(1)} t` : `${Math.round(value)} kg`);

const Delta = ({ value }) => {
  if (value === null || value === undefined) return <span className="text-[11px] text-muted">sin datos previos</span>;
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  const tone = value > 0 ? 'text-[var(--good)]' : value < 0 ? 'text-accent' : 'text-muted';
  return <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${tone}`}><Icon size={12} aria-hidden />{value > 0 ? '+' : ''}{value}% vs mes anterior</span>;
};

const SummaryTile = ({ icon: Icon, label, value, delta }) => (
  <div className="min-w-0 rounded-xl surface-2 p-3">
    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted"><Icon size={13} aria-hidden /> {label}</span>
    <span className="block text-xl font-black leading-tight">{value}</span>
    <Delta value={delta} />
  </div>
);

const TREND_STYLES = Object.freeze({
  progress: { icon: TrendingUp, label: 'Progresa', className: 'text-[var(--good)]' },
  plateau: { icon: Minus, label: 'Estancado', className: 'text-[var(--warning)]' },
  regress: { icon: TrendingDown, label: 'Retrocede', className: 'text-accent' },
});

/**
 * Resumen de los últimos 30 días + recomendaciones concretas (series, kg, días, repeticiones, core, cardio).
 */
export const MonthlySummaryCard = ({ userId, focusName, todayKey }) => {
  // Consulta propia de UN perfil y 60 días (mes actual + anterior para comparar): ~1 lectura por registro,
  // independiente del rango/grupo elegido en los filtros (no multiplica lecturas por cada integrante).
  const logsState = useSubscription(
    (onData, onError) => subscribeToLogs({ since: addDays(parseDateKey(todayKey), -2 * REPORT_DAYS), userIds: [userId] }, onData, onError),
    [userId, todayKey],
    [],
  );
  const logs = logsState.data;
  // Referencia = fin del día actual: estable durante el día (no se recalcula en cada render).
  const report = useMemo(() => buildMonthlyReport(logs, userId, endOfDay(parseDateKey(todayKey))), [logs, userId, todayKey]);

  return (
    <SectionCard
      title="Resumen del mes"
      collapseKey="analytics:monthly"
      subtitle={`${focusName} · ${formatShortDate(report.start)} al ${formatShortDate(report.end)} (últimos 30 días)`}
      info={<ChartInfo info={CHART_INFO.monthly} />}
    >
      {logsState.loading ? (
        <div className="py-6"><Spinner size="sm" label="Armando tu resumen del mes…" hint="Comparamos los últimos 30 días con los 30 anteriores." /></div>
      ) : logsState.error ? (
        <p className="text-sm text-accent">{toUserMessage(logsState.error)}</p>
      ) : report.isEmpty ? (
        <p className="text-sm text-secondary">No hay registros en los últimos 30 días. Cuando entrenes, acá verás tu resumen.</p>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 [&>*]:min-w-0">
            <SummaryTile icon={CalendarCheck} label="Días" value={`${report.current.trainingDays} (${report.current.daysPerWeek}/sem)`} delta={report.deltas.trainingDays} />
            <SummaryTile icon={Dumbbell} label="Ejercicios" value={report.current.exercises} delta={report.deltas.exercises} />
            <SummaryTile icon={Layers} label="Series" value={report.current.sets} delta={report.deltas.sets} />
            <SummaryTile icon={Dumbbell} label="Tonelaje" value={formatTonnage(report.current.tonnage)} delta={report.deltas.tonnage} />
            <SummaryTile icon={Trophy} label="Récords" value={report.current.prs} delta={report.deltas.prs} />
            <SummaryTile icon={HeartPulse} label="Cardio" value={`${report.current.cardioMinutes} min`} delta={report.deltas.cardioMinutes} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
            <div className="min-w-0">
              <h4 className="mb-2 text-sm font-bold">Lo que más hiciste</h4>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {report.current.topExercises.map((item) => (
                  <li key={item.exercise}><span className="font-semibold">{item.exercise}</span> <span className="text-secondary">· {item.count} {item.count === 1 ? 'vez' : 'veces'}</span></li>
                ))}
              </ol>
              {report.strongest.length > 0 && (
                <p className="mt-2 text-xs text-muted">Grupos con más volumen: {report.strongest.map((group) => `${group.label} (${group.weeklySets}/sem)`).join(', ')}.</p>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="mb-2 text-sm font-bold">Progresión de cargas</h4>
              {report.trends.length ? (
                <ul className="space-y-1.5">
                  {report.trends.slice(0, 6).map((trend) => {
                    const style = TREND_STYLES[trend.status];
                    const Icon = style.icon;
                    return (
                      <li key={trend.exercise} className="flex items-start justify-between gap-2 text-sm">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{trend.exercise}</span>
                          <span className="block text-xs text-muted">{trend.first.weight} kg × {trend.first.reps ?? '—'} → {trend.last.weight} kg × {trend.last.reps ?? '—'} · {trend.sessions} sesiones</span>
                        </span>
                        <span className={`flex shrink-0 items-center gap-1 text-xs font-bold ${style.className}`}>
                          <Icon size={14} aria-hidden /> {trend.change > 0 ? '+' : ''}{trend.change}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-secondary">Para ver cómo progresa un ejercicio, regístralo con kg y repeticiones en 2 sesiones o más.</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold"><Lightbulb size={16} aria-hidden /> Recomendaciones para el próximo mes</h4>
            {report.recommendations.length ? (
              <ol className="space-y-2">
                {report.recommendations.slice(0, 8).map((item) => (
                  <li key={item.title} className={`rounded-xl border divider p-3 ${item.priority === 1 ? 'bg-[var(--accent-soft)]' : ''}`}>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="mt-0.5 text-sm text-secondary">{item.detail}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-secondary">Buen mes, nada que corregir. Sigue sumando peso o repeticiones de a poco.</p>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
};
