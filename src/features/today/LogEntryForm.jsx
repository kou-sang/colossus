import { ClipboardCheck, X } from 'lucide-react';
import { useId, useState } from 'react';
import { ExercisePicker } from '../../components/ExercisePicker';
import { InlineSpinner } from '../../components/ui';
import { playClick } from '../../utils/audio';

const FIELDS = Object.freeze([
  { key: 'sets', label: 'Series', inputMode: 'numeric', step: '1' },
  { key: 'reps', label: 'Reps', inputMode: 'numeric', step: '1' },
  { key: 'weight', label: 'Peso (kg)', inputMode: 'decimal', step: '0.5' },
]);

const toFieldValue = (value) => (value === null || value === undefined ? '' : String(value));

/*
 * Registro / confirmación de un ejercicio: kg, reps y series son OPCIONALES.
 * Llegan prellenados con lo último que hiciste (o con la rutina si nunca lo registraste).
 * `routineValues` ({ label, values }) agrega el botón "Completar con valores de rutina" para volver al plan
 * después de una sesión distinta. Vacío = valor sugerido (placeholder) para series; "sin dato" para kg/reps.
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
}) => {
  const formId = useId();
  const [values, setValues] = useState({
    exercise: defaults.exercise ?? '',
    weight: toFieldValue(defaults.weight),
    reps: toFieldValue(defaults.reps),
    sets: toFieldValue(defaults.sets),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field) => (event) => setValues((previous) => ({ ...previous, [field]: event.target.value }));

  const fillWithRoutine = () => {
    playClick();
    setValues((previous) => ({
      ...previous,
      sets: toFieldValue(routineValues.values.sets),
      reps: toFieldValue(routineValues.values.reps),
      weight: toFieldValue(routineValues.values.weight),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return; // Guard contra doble envío (antes generaba registros duplicados)
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...values,
        sets: values.sets === '' ? defaults.fallbackSets ?? '' : values.sets,
        muscle: defaults.muscle,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-xl surface-2 p-3">
      {heading && <p className="text-xs font-bold text-secondary">{heading}</p>}
      {showExerciseField && (
        <div>
          <label htmlFor={`${formId}-exercise`} className="mb-1 block text-xs font-bold text-secondary">Ejercicio</label>
          <ExercisePicker id={`${formId}-exercise`} required value={values.exercise} extraNames={exerciseOptions}
            onChange={(exercise) => setValues((previous) => ({ ...previous, exercise }))} />
        </div>
      )}
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
