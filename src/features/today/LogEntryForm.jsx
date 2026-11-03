import { ClipboardCheck, Plus, Rows3, Trash2, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { ExercisePicker } from '../../components/ExercisePicker';
import { InlineSpinner } from '../../components/ui';
import { playClick } from '../../utils/audio';
import { logError } from '../../utils/errors';
import { MAX_SET_DETAILS, pickBestSet, RIR_OPTIONS } from '../../utils/sets';
import { readFormDraft, writeFormDraft } from './logDrafts';

const FIELDS = Object.freeze([
  { key: 'sets', label: 'Series', inputMode: 'numeric', step: '1' },
  { key: 'reps', label: 'Reps', inputMode: 'numeric', step: '1' },
  { key: 'weight', label: 'Peso (kg)', inputMode: 'decimal', step: '0.5' },
]);

const DETAIL_PREFERENCE_KEY = 'colossus:log-set-details';
const MAX_INITIAL_ROWS = 10;

const toFieldValue = (value) => (value === null || value === undefined ? '' : String(value));
const toRir = (value) => (Number.isInteger(value) ? value : null);

let rowCounter = 0;
const newRow = ({ reps = '', weight = '', rir = null } = {}) => {
  rowCounter += 1;
  return { id: `row-${rowCounter}`, reps: toFieldValue(reps), weight: toFieldValue(weight), rir: toRir(rir) };
};

// Filas a partir de valores resumidos (N series iguales).
const rowsFromSummary = ({ sets, reps, weight, rir }) => {
  const count = Math.min(MAX_INITIAL_ROWS, Math.max(1, Number.parseInt(sets, 10) || 1));
  return Array.from({ length: count }, () => newRow({ reps, weight, rir }));
};

const readDetailPreference = () => {
  try {
    return localStorage.getItem(DETAIL_PREFERENCE_KEY) === 'true';
  } catch {
    return false;
  }
};

const writeDetailPreference = (value) => {
  try {
    localStorage.setItem(DETAIL_PREFERENCE_KEY, String(value));
  } catch (storageError) {
    logError('log-form:preference', storageError);
  }
};

// Selector de RIR con chips (opcional: tocar el elegido lo quita).
const RirPicker = ({ value, onChange, idPrefix }) => (
  <fieldset className="min-w-0">
    <legend className="mb-1 text-xs font-bold text-secondary">Esfuerzo · RIR (opcional)</legend>
    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-describedby={`${idPrefix}-rir-help`}>
      {RIR_OPTIONS.map((option) => (
        <button key={option.value} type="button" role="radio" aria-checked={value === option.value} aria-pressed={value === option.value}
          className="chip min-w-[44px]" title={option.hint} onClick={() => onChange(value === option.value ? null : option.value)}>
          {option.label}
        </button>
      ))}
    </div>
    <p id={`${idPrefix}-rir-help`} className="mt-1 text-[11px] text-muted">
      ¿Cuántas repeticiones más podías hacer? 0 = no podías ni una más. Es opcional y mejora las sugerencias.
    </p>
  </fieldset>
);

// Una fila por serie: reps, kg y RIR. Grilla compacta para que entre en pantallas de 320 px.
const SetRows = ({ rows, onChange, onRemove, onAdd, idPrefix }) => (
  <div className="space-y-1.5">
    <div className="grid grid-cols-[1rem_minmax(0,1fr)_minmax(0,1.25fr)_3.25rem_2.25rem] gap-1 px-0.5 text-[11px] font-bold text-muted" aria-hidden>
      <span>#</span><span>Reps</span><span>Kg</span><span>RIR</span><span />
    </div>
    <ol className="space-y-1.5">
      {rows.map((row, index) => (
        <li key={row.id} className="grid grid-cols-[1rem_minmax(0,1fr)_minmax(0,1.25fr)_3.25rem_2.25rem] items-center gap-1">
          <span className="text-center text-xs font-bold text-secondary">{index + 1}</span>
          <input aria-label={`Repeticiones de la serie ${index + 1}`} id={`${idPrefix}-reps-${index}`} type="number" min="0" step="1" inputMode="numeric"
            className="input no-spin px-2 text-center" value={row.reps} onChange={(event) => onChange(row.id, { reps: event.target.value })} />
          <input aria-label={`Kilos de la serie ${index + 1}`} type="number" min="0" step="0.5" inputMode="decimal" placeholder="PC"
            className="input no-spin px-2 text-center" value={row.weight} onChange={(event) => onChange(row.id, { weight: event.target.value })} />
          <select aria-label={`RIR de la serie ${index + 1}`} className="input px-1 text-center" value={row.rir ?? ''}
            onChange={(event) => onChange(row.id, { rir: event.target.value === '' ? null : Number(event.target.value) })}>
            <option value="">—</option>
            {RIR_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <button type="button" className="flex h-10 w-9 items-center justify-center rounded-lg text-[var(--critical)] hover:bg-[var(--surface)] disabled:opacity-40"
            aria-label={`Quitar la serie ${index + 1}`} disabled={rows.length === 1} onClick={() => onRemove(row.id)}>
            <Trash2 size={16} aria-hidden />
          </button>
        </li>
      ))}
    </ol>
    <button type="button" className="btn btn-ghost min-h-[38px] w-full text-xs" disabled={rows.length >= MAX_SET_DETAILS} onClick={onAdd}>
      <Plus size={14} aria-hidden /> Serie (copia la anterior)
    </button>
    <p className="text-[11px] text-muted">Kg vacío = peso corporal. RIR: repeticiones que te quedaban (0 = fallo).</p>
  </div>
);

/*
 * Registro / confirmación de un ejercicio. Dos modos:
 *  - Resumen: series × reps × kg iguales para todas (como siempre) + RIR opcional.
 *  - Serie por serie: cada serie con sus reps, kg y RIR (p. ej. 60×10, 62,5×8, 65×6). Se recuerda la preferencia.
 * Todo es opcional y llega prellenado con lo último que hiciste. `routineValues` ({ label, values }) agrega
 * el botón "Completar con valores de rutina".
 */
export const LogEntryForm = ({
  defaults,
  onSubmit,
  onCancel,
  showExerciseField = false,
  exerciseOptions = [],
  routineValues = null,
  submitLabel = 'Guardar',
  heading = null,
  draftKey = null,
}) => {
  const formId = useId();
  // Borrador guardado (si saliste de la pestaña o abriste el reloj con el formulario a medio llenar).
  const [draft] = useState(() => readFormDraft(draftKey));
  const [exercise, setExercise] = useState(draft?.exercise ?? defaults.exercise ?? '');
  const [values, setValues] = useState(() => draft?.values ?? {
    weight: toFieldValue(defaults.weight),
    reps: toFieldValue(defaults.reps),
    sets: toFieldValue(defaults.sets),
    rir: toRir(defaults.rir),
  });
  const [isDetailed, setIsDetailed] = useState(() => draft?.isDetailed ?? (Boolean(defaults.setDetails?.length) || readDetailPreference()));
  const [rows, setRows] = useState(() => {
    if (draft?.rows?.length) return draft.rows.map(newRow);
    return defaults.setDetails?.length
      ? defaults.setDetails.slice(0, MAX_SET_DETAILS).map(newRow)
      : rowsFromSummary({ sets: defaults.sets || defaults.fallbackSets, reps: defaults.reps, weight: defaults.weight, rir: defaults.rir });
  });

  // Cada cambio se guarda como borrador (localStorage es un sistema externo: escribirlo en un efecto es correcto).
  useEffect(() => {
    writeFormDraft(draftKey, { exercise, values, isDetailed, rows: rows.map(({ reps, weight, rir }) => ({ reps, weight, rir })) });
  }, [draftKey, exercise, values, isDetailed, rows]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field) => (event) => setValues((previous) => ({ ...previous, [field]: event.target.value }));

  const toggleDetailed = () => {
    playClick();
    if (isDetailed) {
      // Serie por serie → resumen: cantidad de series y la mejor serie.
      const filled = rows.map((row) => ({ reps: Number(row.reps) || null, weight: row.weight === '' ? null : Number(row.weight), rir: row.rir })).filter((row) => row.reps || row.weight !== null);
      const best = pickBestSet(filled);
      setValues((previous) => ({
        ...previous,
        sets: String(rows.length),
        reps: toFieldValue(best?.reps),
        weight: toFieldValue(best?.weight),
        rir: filled.reduce((min, row) => (Number.isInteger(row.rir) && (min === null || row.rir < min) ? row.rir : min), null) ?? previous.rir,
      }));
    } else {
      setRows(rowsFromSummary({ sets: values.sets || defaults.fallbackSets, reps: values.reps, weight: values.weight, rir: values.rir }));
    }
    setIsDetailed(!isDetailed);
    writeDetailPreference(!isDetailed);
  };

  const fillWithRoutine = () => {
    playClick();
    const { sets, reps, weight } = routineValues.values;
    setValues((previous) => ({ ...previous, sets: toFieldValue(sets), reps: toFieldValue(reps), weight: toFieldValue(weight) }));
    setRows(rowsFromSummary({ sets, reps, weight, rir: null }));
  };

  const changeRow = (rowId, patch) => setRows((previous) => previous.map((row) => (row.id === rowId ? { ...row, ...patch } : row)));
  const removeRow = (rowId) => setRows((previous) => (previous.length > 1 ? previous.filter((row) => row.id !== rowId) : previous));
  const addRow = () => {
    playClick();
    setRows((previous) => [...previous, newRow(previous[previous.length - 1] ?? {})]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return; // Guard contra doble envío (antes generaba registros duplicados)
    setIsSubmitting(true);
    try {
      await onSubmit(isDetailed
        ? { exercise, muscle: defaults.muscle, setDetails: rows.map(({ reps, weight, rir }) => ({ reps, weight, rir })) }
        : { exercise, ...values, sets: values.sets === '' ? defaults.fallbackSets ?? '' : values.sets, muscle: defaults.muscle });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-xl surface-2 p-3">
      <div className="flex items-center justify-between gap-2">
        {heading ? <p className="min-w-0 text-xs font-bold text-secondary">{heading}</p> : <span />}
        <button type="button" className="flex shrink-0 items-center gap-1 text-xs font-bold text-accent" aria-pressed={isDetailed} onClick={toggleDetailed}>
          <Rows3 size={14} aria-hidden /> {isDetailed ? 'Resumen' : 'Serie por serie'}
        </button>
      </div>
      {showExerciseField && (
        <div>
          <label htmlFor={`${formId}-exercise`} className="mb-1 block text-xs font-bold text-secondary">Ejercicio</label>
          <ExercisePicker id={`${formId}-exercise`} required value={exercise} extraNames={exerciseOptions} onChange={setExercise} />
        </div>
      )}
      {isDetailed ? (
        <SetRows rows={rows} onChange={changeRow} onRemove={removeRow} onAdd={addRow} idPrefix={formId} />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {FIELDS.map((field) => (
              <div key={field.key} className="min-w-0">
                <label htmlFor={`${formId}-${field.key}`} className="mb-1 block truncate text-xs font-bold text-secondary">{field.label}</label>
                <input
                  id={`${formId}-${field.key}`}
                  type="number"
                  min="0"
                  className="input"
                  inputMode={field.inputMode}
                  step={field.step}
                  placeholder={field.key === 'sets' ? String(defaults.fallbackSets ?? 1) : 'Opcional'}
                  value={values[field.key]}
                  onChange={update(field.key)}
                />
              </div>
            ))}
          </div>
          <RirPicker value={values.rir} idPrefix={formId} onChange={(rir) => setValues((previous) => ({ ...previous, rir }))} />
        </>
      )}
      {routineValues && (
        <button type="button" className="btn btn-ghost w-full text-xs" onClick={fillWithRoutine}>
          <ClipboardCheck size={14} aria-hidden /> Completar con valores de rutina: {routineValues.label}
        </button>
      )}
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary flex-1" disabled={isSubmitting}>
          {isSubmitting ? <><InlineSpinner /> Guardando…</> : submitLabel}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel} aria-label="Cancelar">
          <X size={18} aria-hidden />
        </button>
      </div>
    </form>
  );
};
