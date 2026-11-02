import { Lock } from 'lucide-react';
import { useId, useState } from 'react';
import { InlineSpinner } from '../../components/ui';
import { useFeedback } from '../../context/FeedbackContext';
import { saveBodyStats } from '../../services/userService';
import { playClick } from '../../utils/audio';
import { ACTIVITY_LEVELS, GOALS } from '../../utils/energy';
import { logError, toUserMessage } from '../../utils/errors';

const toText = (value) => (value === null || value === undefined ? '' : String(value));

/**
 * Datos corporales para estimar calorías y alimentación. Se guardan en la cuenta privada (users/{uid}):
 * nadie más los ve, ni siquiera los amigos del grupo.
 */
export const BodyStatsForm = ({ uid, stats, onSaved, compact = false }) => {
  const formId = useId();
  const { notify } = useFeedback();
  const [values, setValues] = useState(() => ({
    weightKg: toText(stats?.weightKg),
    heightCm: toText(stats?.heightCm),
    age: toText(stats?.age),
    activity: stats?.activity ?? 'light',
    goal: stats?.goal ?? 'maintain',
  }));
  const [isSaving, setIsSaving] = useState(false);
  const update = (field) => (event) => setValues((previous) => ({ ...previous, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    playClick();
    setIsSaving(true);
    try {
      await saveBodyStats(uid, values);
      notify('Datos corporales guardados', 'success');
      onSaved?.();
    } catch (saveError) {
      logError('profile:body-stats', saveError);
      notify(toUserMessage(saveError), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const numberFields = [
    { key: 'weightKg', label: 'Peso (kg)', step: '0.1', inputMode: 'decimal' },
    { key: 'heightCm', label: 'Altura (cm)', step: '1', inputMode: 'numeric' },
    { key: 'age', label: 'Edad', step: '1', inputMode: 'numeric' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {numberFields.map((field) => (
          <div key={field.key} className="min-w-0">
            <label htmlFor={`${formId}-${field.key}`} className="mb-1 block truncate text-xs font-bold text-secondary">{field.label}</label>
            <input id={`${formId}-${field.key}`} type="number" min="0" required className="input" step={field.step} inputMode={field.inputMode}
              value={values[field.key]} onChange={update(field.key)} />
          </div>
        ))}
      </div>
      <div className={`grid gap-2 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <div className="min-w-0">
          <label htmlFor={`${formId}-activity`} className="mb-1 block text-xs font-bold text-secondary">Actividad diaria fuera del gimnasio</label>
          <select id={`${formId}-activity`} className="input" value={values.activity} onChange={update('activity')}>
            {ACTIVITY_LEVELS.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor={`${formId}-goal`} className="mb-1 block text-xs font-bold text-secondary">Objetivo</label>
          <select id={`${formId}-goal`} className="input" value={values.goal} onChange={update('goal')}>
            {GOALS.map((goal) => <option key={goal.value} value={goal.value}>{goal.label}</option>)}
          </select>
        </div>
      </div>
      <p className="flex items-start gap-1.5 text-xs text-muted">
        <Lock size={12} className="mt-0.5 shrink-0" aria-hidden /> Privado: solo tú puedes ver estos datos. El sexo se toma de tu perfil.
      </p>
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isSaving}>
        {isSaving ? <><InlineSpinner /> Guardando…</> : 'Guardar datos'}
      </button>
    </form>
  );
};
