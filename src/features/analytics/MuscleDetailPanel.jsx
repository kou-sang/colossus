import { X } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartLegend, ChartTooltip } from '../../components/charts';
import { useAxisProps } from '../../components/useAxisProps';
import { ChartInfo } from '../../components/ChartInfo';
import { IconButton } from '../../components/ui';
import { CATEGORY_LABELS, MUSCLE_BY_ID } from '../../constants/muscles';
import { useTheme } from '../../context/ThemeContext';
import { describeWeek, formatRelativeDays, formatShortDate } from '../../utils/dates';
import { buildExerciseContributions, buildMuscleTimeline, buildWeeklyMuscleSeries, classifyRecency, round1 } from '../../utils/metrics';
import { WEEKLY_SET_TARGET } from './analyticsConstants';
import { CHART_INFO } from './chartInfo';

const MAX_CONTRIBUTORS = 8;
const MAX_TIMELINE = 12;

// Barra de proporción (0–1) usada en las listas de ejercicios.
const ShareBar = ({ ratio, color }) => (
  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full surface-2" aria-hidden>
    <div className="h-full rounded-full" style={{ width: `${Math.round(Math.min(1, ratio) * 100)}%`, background: color }} />
  </div>
);

/*
 * Detalle temporal del mapa de Recuperación: cada vez que el músculo recibió estímulo (más reciente primero),
 * con qué ejercicio y qué % de ese ejercicio recae en él.
 */
const RecoveryTimeline = ({ entries, users, color }) => {
  const nameOf = (userId) => users.find((user) => user.userId === userId)?.name;
  if (!entries.length) return <p className="py-6 text-center text-sm text-muted">Sin estímulos registrados para este músculo con los filtros actuales.</p>;
  return (
    <div>
      <h5 className="mb-2 text-sm font-bold">Cuándo y con qué lo entrenaste</h5>
      <ol className="space-y-2">
        {entries.map((entry) => {
          const recency = classifyRecency(entry.date);
          return (
            <li key={entry.id} className="min-w-0 text-sm">
              <div className="flex min-w-0 items-baseline justify-between gap-2">
                <span className="min-w-0 truncate font-semibold">{entry.exercise}</span>
                <span className="shrink-0 text-xs font-bold">{Math.round(entry.share * 100)}%</span>
              </div>
              <p className="text-xs text-secondary">
                {formatRelativeDays(recency.days)} · {formatShortDate(entry.date)} · {entry.effectiveSets} series ef.
                {users.length > 1 && nameOf(entry.userId) ? ` · ${nameOf(entry.userId)}` : ''}
              </p>
              <ShareBar ratio={entry.share} color={color} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-muted">% = parte del ejercicio que recae en este músculo. Se listan los últimos {MAX_TIMELINE} estímulos.</p>
    </div>
  );
};

/**
 * Detalle al tocar un músculo.
 *  - Modo Estímulo: series efectivas semanales por perfil + qué ejercicios lo trabajaron en el rango.
 *  - Modo Recuperación: historial de estímulos (fecha, ejercicio y % del ejercicio sobre ese músculo).
 */
export const MuscleDetailPanel = ({ mode = 'stimulus', muscleId, logs, recencyLogs = [], users, rangeStart, rangeEnd, weeklyAverage, lastTrained, onClose }) => {
  const { chart } = useTheme();
  const { grid, axis } = useAxisProps();
  const muscle = MUSCLE_BY_ID[muscleId];
  const userIds = useMemo(() => users.map((user) => user.userId), [users]);

  const rows = useMemo(
    () => buildWeeklyMuscleSeries(logs, muscleId, userIds, rangeStart, rangeEnd),
    [logs, muscleId, userIds, rangeStart, rangeEnd],
  );
  const contributions = useMemo(() => buildExerciseContributions(logs, muscleId, userIds).slice(0, MAX_CONTRIBUTORS), [logs, muscleId, userIds]);
  const timeline = useMemo(() => buildMuscleTimeline(recencyLogs, muscleId, userIds, MAX_TIMELINE), [recencyLogs, muscleId, userIds]);
  const isRecovery = mode === 'recency';
  const hasData = rows.some((row) => userIds.some((id) => row[id] > 0));
  const recency = classifyRecency(lastTrained?.date);
  const maxValue = Math.max(WEEKLY_SET_TARGET.max + 2, ...rows.flatMap((row) => userIds.map((id) => row[id] ?? 0)));

  if (!muscle) return null;

  return (
    <div className="min-w-0 rounded-xl border divider p-3 md:p-4" aria-live="polite">
      <header className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{CATEGORY_LABELS[muscle.category]}</p>
          {/* Un nombre largo sin espacios se corta en lugar de ensanchar el panel (y el mapa) más que la pantalla. */}
          <h4 className="text-base font-black [overflow-wrap:anywhere] md:text-lg">{muscle.label}</h4>
          <p className="text-sm text-secondary [overflow-wrap:anywhere]">
            {round1(weeklyAverage)} series efectivas/semana · último estímulo: {formatRelativeDays(recency.days).toLowerCase()}
            {lastTrained?.exercise && ` (${lastTrained.exercise})`}
          </p>
        </div>
        <div className="flex shrink-0">
          <ChartInfo info={isRecovery ? CHART_INFO.muscleRecoveryDetail : CHART_INFO.muscleDetail} />
          <IconButton label="Cerrar detalle" icon={X} onClick={onClose} />
        </div>
      </header>

      {isRecovery ? <RecoveryTimeline entries={timeline} users={users} color={chart.stimulus[4]} /> : hasData ? (
        <>
          {users.length > 1 && <ChartLegend items={users.map((user) => ({ key: user.userId, label: user.name, color: user.color }))} />}
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 4, left: 0 }} barGap={2}>
                <CartesianGrid {...grid} />
                <ReferenceArea y1={WEEKLY_SET_TARGET.min} y2={WEEKLY_SET_TARGET.max} fill={chart.targetBand} ifOverflow="extendDomain" />
                <XAxis {...axis} dataKey="weekKey" tickFormatter={(key) => formatShortDate(rows.find((row) => row.weekKey === key)?.time)} minTickGap={16} />
                <YAxis {...axis} width={36} domain={[0, Math.ceil(maxValue)]} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: chart.grid, opacity: 0.4 }}
                  content={<ChartTooltip labelFormatter={(_, payload) => describeWeek(payload?.[0]?.payload.time, rangeStart, rangeEnd)} valueFormatter={(value) => `${round1(value)} series`} />}
                />
                {users.map((user) => (
                  <Bar key={user.userId} dataKey={user.userId} name={user.name} fill={user.color} radius={[4, 4, 0, 0]} maxBarSize={26} isAnimationActive={false} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-xs text-muted">Franja verde = {WEEKLY_SET_TARGET.min}–{WEEKLY_SET_TARGET.max} series semanales (rango orientativo de hipertrofia).</p>
        </>
      ) : (
        <p className="py-8 text-center text-sm text-muted">Sin series para este músculo con los filtros actuales.</p>
      )}

      {!isRecovery && contributions.length > 0 && (
        <div className="mt-4">
          <h5 className="mb-2 text-sm font-bold">Ejercicios que lo trabajaron</h5>
          <ul className="space-y-1.5">
            {contributions.map((entry) => (
              <li key={entry.exercise} className="min-w-0 text-sm">
                <div className="flex min-w-0 items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate font-semibold">{entry.exercise}</span>
                  <span className="shrink-0 text-xs font-bold">{entry.effectiveSets} series ef.</span>
                </div>
                <p className="text-xs text-secondary">{Math.round(entry.share * 100)}% del ejercicio · {Math.round(entry.ratio * 100)}% del total del músculo</p>
                {/* Barra = aporte de este ejercicio al total del músculo en el rango. */}
                <ShareBar ratio={entry.ratio} color={chart.stimulus[4]} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
