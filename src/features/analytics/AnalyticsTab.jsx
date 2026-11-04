import { CalendarDays, ChevronDown, ChevronUp, Dumbbell, Flame, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ChartInfo } from '../../components/ChartInfo';
import { IconButton, LoadingState, SectionCard, SegmentedControl, StatTile } from '../../components/ui';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useSubscription } from '../../hooks/useSubscription';
import { useToday } from '../../hooks/useToday';
import { subscribeToLogs } from '../../services/logService';
import { addDays, diffInCalendarDays, endOfDay, parseDateKey, toDateKey } from '../../utils/dates';
import { playClick } from '../../utils/audio';
import { toUserMessage } from '../../utils/errors';
import { buildMuscleRecovery } from '../../utils/recovery';
import {
  buildConsistencySeries,
  buildEffectiveSetsByMuscle,
  activeWeeks,
  buildMuscleLastTrained,
  buildStrengthIndexSeries,
  buildStrengthSeries,
  buildWeeklyTonnage,
  computeTonnage,
  computeWeekStreak,
  countTrainingDays,
  filterLogs,
} from '../../utils/metrics';
import { AnalyticsFilters } from './AnalyticsFilters';
import { CRITICAL_RECENCY_DAYS, DATE_PRESETS, MAP_MODES } from './analyticsConstants';
import { selectionMuscles, selectionScope, summarizeSelection } from './bodySelection';
import { CHART_INFO } from './chartInfo';
import { ConsistencyChart } from './ConsistencyChart';
import { EnergyCard } from './EnergyCard';
import { MonthlySummaryCard } from './MonthlySummaryCard';
import { MuscleMap } from './MuscleMap';
import { MuscleDetailPanel } from './MuscleDetailPanel';
import { StrengthProgressChart } from './StrengthProgressChart';
import { WeeklyVolumeChart } from './WeeklyVolumeChart';

// Máximo de perfiles en gráficos comparativos = slots de la paleta categórica (nunca se generan colores extra).
const MAX_COMPARED_USERS = 8;
const AGGREGATE_FOCUS = 'aggregate';
const LONG_RANGE_DAYS = 120;
// Opción del selector de Progresión de fuerza que promedia todos los ejercicios de la selección.
const STRENGTH_AVERAGE = '__average__';

const formatTonnage = (value) => (value >= 1000 ? `${(value / 1000).toFixed(1)} t` : `${Math.round(value)} kg`);

// Rango de fechas → { since, until }. `until` null = abierto (incluye lo que se registre en vivo).
const resolveDateRange = (preset, customRange, todayKey) => {
  const today = parseDateKey(todayKey);
  switch (preset) {
    case 'week': return { since: addDays(today, -6), until: null };
    case '30d': return { since: addDays(today, -29), until: null };
    case '90d': return { since: addDays(today, -89), until: null };
    case 'year': return { since: new Date(today.getFullYear(), 0, 1), until: null };
    case 'custom': {
      const from = parseDateKey(customRange.from);
      const to = parseDateKey(customRange.to);
      if (!from || !to || from > to) return { since: addDays(today, -29), until: null, invalid: true };
      return { since: from, until: endOfDay(to) };
    }
    default: return { since: addDays(today, -29), until: null };
  }
};

export const AnalyticsTab = () => {
  const { user, groups, profilesById, visibleIds } = useAppData();
  const { chart } = useTheme();
  const todayKey = useToday();

  // ───────── Estado de filtros ─────────
  const [scopeChoice, setScopeChoice] = useState(null); // null = automático (primer grupo o "Solo yo")
  const [userSelection, setUserSelection] = useState({ scopeId: null, ids: null });
  const [bodySelection, setBodySelection] = useState(null); // músculos y categorías (null = todo)
  const [datePreset, setDatePreset] = useState('30d');
  const [customRange, setCustomRange] = useState(() => ({ from: toDateKey(addDays(new Date(), -29)), to: toDateKey() }));
  const [focusChoice, setFocusChoice] = useState(null);
  const [mapMode, setMapMode] = useState('recency');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(STRENGTH_AVERAGE);
  // Se recuerda si los filtros quedaron ocultos (por dispositivo).
  const [filtersOpen, setFiltersOpen] = usePersistentState('analytics:filters-open', true, (value) => typeof value === 'boolean');
  const [unifyDays, setUnifyDays] = useState(true); // false → gráficos temporales con hora y minuto

  const activeGroup = scopeChoice === 'self' ? null : groups.find((group) => group.id === scopeChoice) ?? (scopeChoice ? null : groups[0] ?? null);
  const scopeId = activeGroup?.id ?? 'self';

  // Solo miembros del grupo elegido y ya confirmados como amigos (las reglas rechazan la consulta entera si
  // incluye a alguien no permitido; un recién llegado aparece apenas se sincroniza su alta).
  const memberIds = useMemo(() => {
    const ids = activeGroup ? activeGroup.memberIds.filter((id) => visibleIds.has(id)) : [user.id];
    return [...ids].sort((a, b) => (a === user.id ? -1 : b === user.id ? 1 : (profilesById[a]?.username ?? '').localeCompare(profilesById[b]?.username ?? '', 'es')));
  }, [activeGroup, user.id, profilesById, visibleIds]);

  // El color sigue a la persona (posición estable en el grupo), no a la selección: filtrar no repinta.
  const colorByUser = useMemo(
    () => Object.fromEntries(memberIds.slice(0, MAX_COMPARED_USERS).map((id, index) => [id, chart.series[index]])),
    [memberIds, chart],
  );

  // Memoizados: referencias estables → los useMemo dependientes no se recalculan en cada render.
  const selectedIds = useMemo(
    () => (userSelection.scopeId === scopeId && userSelection.ids ? userSelection.ids.filter((id) => memberIds.includes(id)) : null),
    [userSelection, scopeId, memberIds],
  );
  const effectiveUserIds = useMemo(() => (selectedIds?.length ? selectedIds : memberIds), [selectedIds, memberIds]);

  const range = useMemo(() => resolveDateRange(datePreset, customRange, todayKey), [datePreset, customRange, todayKey]);
  // Rango abierto → fin del día actual (estable durante el día, a diferencia de new Date()).
  const rangeEnd = useMemo(() => range.until ?? endOfDay(parseDateKey(todayKey)), [range.until, todayKey]);
  const rangeDays = diffInCalendarDays(rangeEnd, range.since) + 1;

  // El mapa de recuperación necesita ≥ 30 días de historia aunque el rango elegido sea más corto
  // (si no, un músculo entrenado hace 10 días figuraría como "nunca"). Solo agrega lecturas en rangos < 30 días.
  const querySince = useMemo(() => {
    const recencyStart = addDays(parseDateKey(todayKey), -CRITICAL_RECENCY_DAYS);
    return range.since < recencyStart ? range.since : recencyStart;
  }, [range.since, todayKey]);

  // Una consulta por grupo + rango. Perfiles/categorías/músculos/fechas se filtran en memoria (0 lecturas extra).
  const memberKey = memberIds.join('|');
  const sinceTime = querySince.getTime();
  const untilTime = range.until?.getTime() ?? 0;
  const logsState = useSubscription(
    (onData, onError) => subscribeToLogs({ since: querySince, until: range.until, userIds: memberIds }, onData, onError),
    [memberKey, sinceTime, untilTime],
    [],
  );

  // Filtro unificado: `scope` decide qué registros entran; `muscles` recorta los gráficos por músculo.
  const scope = useMemo(() => selectionScope(bodySelection), [bodySelection]);
  const muscles = useMemo(() => selectionMuscles(bodySelection), [bodySelection]);
  const enabledMuscles = useMemo(() => (muscles ? new Set(muscles) : null), [muscles]);
  const filteredLogs = useMemo(
    () => filterLogs(logsState.data, { userIds: effectiveUserIds, scope, since: range.since }),
    [logsState.data, effectiveUserIds, scope, range.since],
  );

  // ───────── Perfil foco (mapa y KPIs) ─────────
  const focusId = focusChoice === AGGREGATE_FOCUS && effectiveUserIds.length > 1
    ? AGGREGATE_FOCUS
    : effectiveUserIds.includes(focusChoice) ? focusChoice : effectiveUserIds.includes(user.id) ? user.id : effectiveUserIds[0];
  const focusIds = useMemo(() => (focusId === AGGREGATE_FOCUS ? effectiveUserIds : [focusId]), [focusId, effectiveUserIds]);
  const focusName = focusId === AGGREGATE_FOCUS ? 'Promedio de la selección' : profilesById[focusId]?.username ?? '—';
  // El mapa usa el sexo del perfil foco (el selector manual se quitó en 4.2.0).
  const mapGender = focusId === AGGREGATE_FOCUS ? user.gender : profilesById[focusId]?.gender ?? user.gender;

  const focusLogs = useMemo(() => filteredLogs.filter((log) => focusIds.includes(log.userId)), [filteredLogs, focusIds]);
  const focusMetrics = useMemo(() => {
    const divisor = focusIds.length;
    // Promedio semanal por perfil (cada uno desde que empezó a registrar dentro del rango) y luego entre perfiles.
    const weeklySetsByMuscle = {};
    let tonnagePerWeek = 0;
    focusIds.forEach((id) => {
      const weeks = activeWeeks(logsState.data, id, range.since, rangeEnd);
      const ownLogs = focusLogs.filter((log) => log.userId === id);
      Object.entries(buildEffectiveSetsByMuscle(ownLogs, { muscles })).forEach(([muscleId, value]) => {
        weeklySetsByMuscle[muscleId] = (weeklySetsByMuscle[muscleId] ?? 0) + value / weeks / divisor;
      });
      tonnagePerWeek += ownLogs.reduce((sum, log) => sum + (computeTonnage(log) ?? 0), 0) / weeks / divisor;
    });
    const trainingDays = focusIds.reduce((sum, id) => sum + countTrainingDays(focusLogs, id, range.since), 0) / divisor;
    return {
      weeklySetsByMuscle,
      trainingDays: Math.round(trainingDays * 10) / 10,
      tonnagePerWeek,
      records: focusLogs.filter((log) => log.isPr).length,
      streak: divisor === 1 ? computeWeekStreak(logsState.data, focusIds[0]) : null,
    };
  }, [focusLogs, focusIds, muscles, range.since, rangeEnd, logsState.data]);

  // Recuperación: mismos filtros salvo la fecha de inicio (usa toda la historia descargada, ≥ 30 días).
  const recencyLogs = useMemo(
    () => filterLogs(logsState.data, { userIds: focusIds, scope }),
    [logsState.data, focusIds, scope],
  );
  const lastTrainedByMuscle = useMemo(() => buildMuscleLastTrained(recencyLogs, null), [recencyLogs]);
  // Estado de recuperación "ahora" (créditos de serie + esfuerzo + carga semanal; ver utils/recovery.js).
  const recoveryByMuscle = useMemo(() => buildMuscleRecovery(recencyLogs, { userIds: focusIds }), [recencyLogs, focusIds]);

  // Resumen mensual y plan de alimentación son individuales: con "Promedio de la selección" se muestran los tuyos.
  const personalId = focusId === AGGREGATE_FOCUS ? user.id : focusId;
  const personalName = profilesById[personalId]?.username ?? user.username;

  // ───────── Gráficos comparativos (máx. 8 perfiles con color propio) ─────────
  const chartUsers = useMemo(
    () => effectiveUserIds.filter((id) => colorByUser[id]).map((id) => ({ userId: id, name: profilesById[id]?.username ?? '—', color: colorByUser[id] })),
    [effectiveUserIds, colorByUser, profilesById],
  );
  const hiddenCompared = effectiveUserIds.length - chartUsers.length;

  const exerciseOptions = useMemo(() => {
    const counts = {};
    filteredLogs.forEach((log) => {
      if (log.e1rm) counts[log.exercise] = (counts[log.exercise] ?? 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([exercise]) => exercise);
  }, [filteredLogs]);
  const activeExercise = selectedExercise === STRENGTH_AVERAGE || exerciseOptions.includes(selectedExercise) ? selectedExercise : STRENGTH_AVERAGE;
  const isStrengthAverage = activeExercise === STRENGTH_AVERAGE;

  // Promedio de la selección: % de cambio de cada ejercicio, ponderado por los músculos elegidos en el filtro.
  const strengthSeries = useMemo(
    () => chartUsers.map((selected) => ({
      ...selected,
      points: isStrengthAverage
        ? buildStrengthIndexSeries(filteredLogs, selected.userId, { unifyDays, muscleScope: muscles })
        : buildStrengthSeries(filteredLogs, selected.userId, activeExercise, { unifyDays }),
    })),
    [chartUsers, filteredLogs, activeExercise, isStrengthAverage, unifyDays, muscles],
  );
  const consistencySeries = useMemo(
    () => chartUsers.map((selected) => ({ ...selected, ...buildConsistencySeries(filteredLogs, selected.userId, { unifyDays }) })),
    [chartUsers, filteredLogs, unifyDays],
  );
  const consistencyDomain = useMemo(() => [range.since.getTime(), rangeEnd.getTime()], [range.since, rangeEnd]);
  const weeklyRows = useMemo(
    () => buildWeeklyTonnage(filteredLogs, chartUsers.map(({ userId }) => userId), range.since, rangeEnd),
    [filteredLogs, chartUsers, range.since, rangeEnd],
  );

  const memberOptions = memberIds.map((id) => ({
    value: id,
    label: `${profilesById[id]?.username ?? 'Perfil'}${id === user.id ? ' (tú)' : ''}`,
    color: colorByUser[id],
  }));

  const handleScopeChange = (nextScope) => {
    setScopeChoice(nextScope);
    setFocusChoice(null);
    setSelectedMuscle(null);
  };

  // Resumen de una línea que reemplaza a los filtros cuando están ocultos.
  const filtersSummary = [
    activeGroup?.name ?? 'Solo yo',
    selectedIds?.length ? `${selectedIds.length} de ${memberIds.length} perfiles` : `${memberIds.length} ${memberIds.length === 1 ? 'perfil' : 'perfiles'}`,
    DATE_PRESETS.find((preset) => preset.value === datePreset)?.label,
    bodySelection ? summarizeSelection(bodySelection) : null,
  ].filter(Boolean).join(', ');

  const isLongRange = rangeDays > LONG_RANGE_DAYS;

  return (
    <div className="space-y-4 md:space-y-6">
      <SectionCard
        title="Filtros"
        subtitle={filtersOpen ? undefined : filtersSummary}
        info={
          <IconButton
            label={filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
            icon={filtersOpen ? ChevronUp : ChevronDown}
            onClick={() => { playClick(); setFiltersOpen((open) => !open); }}
          />
        }
      >
        {/* `hidden` (no desmontar): conserva los bloques desplegados cuando se vuelve a mostrar. */}
        <div hidden={!filtersOpen} aria-hidden={!filtersOpen}>
          <AnalyticsFilters
            groups={groups}
            scopeId={scopeId}
            onScopeChange={handleScopeChange}
            memberOptions={memberOptions}
            selectedUserIds={selectedIds?.length ? selectedIds : null}
            onUsersChange={(ids) => setUserSelection({ scopeId, ids })}
            bodySelection={bodySelection}
            onBodySelectionChange={setBodySelection}
            datePreset={datePreset}
            onDatePresetChange={setDatePreset}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
            todayKey={todayKey}
            unifyDays={unifyDays}
            onUnifyDaysChange={setUnifyDays}
          />
          {groups.length === 0 && (
            <p className="mt-3 text-xs text-muted">Crea o únete a un grupo en la pestaña Grupos para comparar tu progreso con amigos.</p>
          )}
          {isLongRange && (
            <p className="mt-2 text-xs text-muted">Los rangos largos tardan más en cargar.</p>
          )}
        </div>
        {logsState.meta?.isTruncated && (
          <p className="mt-2 text-xs text-muted">Solo se ven los registros más recientes. Acorta el rango para verlos todos.</p>
        )}
        {logsState.error && <p className="mt-2 text-sm text-accent">{toUserMessage(logsState.error)}</p>}
      </SectionCard>

      {logsState.loading ? (
        <LoadingState
          label={`Cargando registros de ${memberIds.length} perfil${memberIds.length === 1 ? '' : 'es'}…`}
          hint="Con esos datos calculamos el mapa muscular y los gráficos según tus filtros."
        />
      ) : (
        <>
          <SectionCard
            title="Consistencia"
            collapseKey="analytics:consistency"
            subtitle="Ejercicios acumulados en el período"
            info={<ChartInfo info={CHART_INFO.consistency} />}
          >
            <ConsistencyChart seriesList={consistencySeries} domain={consistencyDomain} unifyDays={unifyDays} />
          </SectionCard>

          {effectiveUserIds.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="focus-user" className="text-sm font-semibold text-secondary">Mapa e indicadores de:</label>
              <select id="focus-user" className="input w-auto min-w-0" value={focusId} onChange={(event) => setFocusChoice(event.target.value)}>
                <option value={AGGREGATE_FOCUS}>Promedio de la selección</option>
                {effectiveUserIds.map((id) => <option key={id} value={id}>{profilesById[id]?.username ?? '—'}</option>)}
              </select>
            </div>
          )}

          <div className="-mb-2 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-secondary">Indicadores de {focusName}</h3>
            <ChartInfo info={CHART_INFO.kpis} />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 [&>*]:min-w-0">
            <StatTile icon={CalendarDays} label="Días entrenados" value={focusMetrics.trainingDays} hint={`${focusName} · en el rango`} />
            <StatTile icon={Dumbbell} label="Tonelaje / semana" value={formatTonnage(focusMetrics.tonnagePerWeek)} hint="promedio en el rango" />
            <StatTile icon={Trophy} label="Récords" value={focusMetrics.records} hint="mejores marcas" />
            <StatTile icon={Flame} label="Racha" value={focusMetrics.streak === null ? '—' : `${focusMetrics.streak} sem`} hint={focusMetrics.streak === null ? 'solo por perfil individual' : 'semanas consecutivas'} />
          </div>

          <SectionCard
            title="Mapa muscular"
            collapseKey="analytics:muscle-map"
            subtitle={`${focusName} · ${mapMode === 'stimulus' ? 'más verde = más series por semana' : 'verde = recuperado · rojo = muy fatigado (hoy)'}`}
            info={<ChartInfo info={mapMode === 'stimulus' ? CHART_INFO.muscleMapStimulus : CHART_INFO.muscleMapRecency} />}
            actions={<SegmentedControl label="Modo del mapa" options={MAP_MODES} value={mapMode} onChange={setMapMode} />}
          >
            {/* min-w-0 en las columnas: un texto largo del detalle no puede ensanchar el mapa más que la pantalla. */}
            <div className={`grid min-w-0 gap-4 [&>*]:min-w-0 ${selectedMuscle ? 'lg:grid-cols-2' : ''}`}>
              <MuscleMap
                gender={mapGender}
                mode={mapMode}
                weeklySetsByMuscle={focusMetrics.weeklySetsByMuscle}
                recoveryByMuscle={recoveryByMuscle}
                selectedMuscle={selectedMuscle}
                enabledMuscles={enabledMuscles}
                onSelect={setSelectedMuscle}
              />
              {selectedMuscle && (
                <MuscleDetailPanel
                  mode={mapMode}
                  muscleId={selectedMuscle}
                  logs={filteredLogs}
                  recencyLogs={recencyLogs}
                  users={focusId === AGGREGATE_FOCUS ? chartUsers : chartUsers.filter((item) => item.userId === focusId)}
                  rangeStart={range.since}
                  rangeEnd={rangeEnd}
                  weeklyAverage={focusMetrics.weeklySetsByMuscle[selectedMuscle] ?? 0}
                  lastTrained={lastTrainedByMuscle[selectedMuscle]}
                  recovery={recoveryByMuscle[selectedMuscle]}
                  onClose={() => setSelectedMuscle(null)}
                />
              )}
            </div>
          </SectionCard>

          {hiddenCompared > 0 && (
            <p className="text-xs text-muted">
              Los gráficos comparativos muestran {MAX_COMPARED_USERS} perfiles como máximo; {hiddenCompared} quedan fuera (el promedio del mapa sí los incluye).
            </p>
          )}

          <SectionCard
            title="Progresión de fuerza"
            collapseKey="analytics:strength"
            subtitle={isStrengthAverage ? 'Cambio promedio de tu 1RM estimado en los ejercicios de la selección' : 'Tu mejor 1RM estimado de cada sesión'}
            info={<ChartInfo info={CHART_INFO.strength} />}
            actions={exerciseOptions.length > 0 && (
              <select aria-label="Ejercicio" className="input w-full min-w-0 sm:w-auto sm:max-w-[320px]" value={activeExercise} onChange={(event) => setSelectedExercise(event.target.value)}>
                <option value={STRENGTH_AVERAGE}>Promedio de la selección ({exerciseOptions.length})</option>
                {exerciseOptions.map((exercise) => <option key={exercise} value={exercise}>{exercise}</option>)}
              </select>
            )}
          >
            <StrengthProgressChart seriesList={strengthSeries} unifyDays={unifyDays} mode={isStrengthAverage ? 'average' : 'exercise'} />
          </SectionCard>

          <SectionCard title="Tonelaje semanal" collapseKey="analytics:weekly-volume" subtitle="Peso total movido por semana" info={<ChartInfo info={CHART_INFO.weeklyVolume} />}>
            <WeeklyVolumeChart rows={weeklyRows} users={chartUsers} rangeStart={range.since} rangeEnd={rangeEnd} />
          </SectionCard>

          <EnergyCard
            logs={focusId === AGGREGATE_FOCUS ? focusLogs.filter((log) => log.userId === user.id) : focusLogs}
            rangeStart={range.since}
            rangeEnd={rangeEnd}
            rangeDays={rangeDays}
            user={user}
            isSelf={personalId === user.id}
            focusName={personalName}
          />

          <MonthlySummaryCard userId={personalId} focusName={personalName} todayKey={todayKey} />
        </>
      )}
    </div>
  );
};
