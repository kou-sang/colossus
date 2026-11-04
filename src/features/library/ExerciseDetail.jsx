import { Activity, AlertTriangle, ArrowLeft, Camera, GraduationCap, Lightbulb, ListOrdered, Plus, Shuffle } from 'lucide-react';
import { useState } from 'react';
import { SectionCard } from '../../components/ui';
import { CATEGORY_LABELS, EXERCISE_CATALOG, MUSCLE_LABELS } from '../../constants/exercises';
import { getExerciseGuide } from '../../constants/exerciseGuides';
import { useTheme } from '../../context/ThemeContext';
import { playClick } from '../../utils/audio';
import { AddToRoutineDialog } from './AddToRoutineDialog';
import { ExerciseFigure } from './ExerciseFigure';
import { ExerciseMuscleMap } from './ExerciseMuscleMap';

const MAX_ALTERNATIVES = 6;

// Ejercicios cuyo músculo principal coincide (dato real del diccionario; no requiere contenido editorial).
const findAlternatives = (exercise) =>
  Object.values(EXERCISE_CATALOG)
    .filter((candidate) => candidate.name !== exercise.name && candidate.primaryMuscle === exercise.primaryMuscle)
    .slice(0, MAX_ALTERNATIVES);

// Bloque de la ficha con título e ícono; `ordered` numera los pasos (son una secuencia real).
const GuideSection = ({ icon: Icon, title, items, ordered = false, tone }) => {
  const List = ordered ? 'ol' : 'ul';
  return (
    <section className="rounded-xl border divider p-3 md:p-4">
      <h4 className={`mb-2 flex items-center gap-2 text-sm font-bold ${tone === 'warning' ? 'text-accent' : ''}`}>
        <Icon size={16} aria-hidden /> {title}
      </h4>
      <List className={`space-y-1.5 pl-5 text-sm text-secondary ${ordered ? 'list-decimal' : 'list-disc'}`}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </List>
    </section>
  );
};

/**
 * Ficha completa de un ejercicio: ejecución en 3 vistas, músculos, técnica, consejos, errores y alternativas.
 * La usan la pestaña Ejercicios y la ventana de ficha de Inicio. `showTitle={false}` cuando el contenedor ya
 * muestra el nombre (ventana); `onBack` agrega "Volver a la lista"; `onSelect` hace navegables las alternativas.
 */
export const ExerciseDetail = ({ exercise, onBack, onSelect, showTitle = true }) => {
  const { chart } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const guide = getExerciseGuide(exercise.name);
  const muscles = Object.entries(exercise.distribution).sort((a, b) => b[1] - a[1]);
  const alternatives = findAlternatives(exercise);
  // Los alias sin Ñ (compatibilidad con historial viejo) no se muestran si ya aparece la versión con Ñ.
  const withN = (label) => label.replace(/Ñ/g, 'N');
  const enyeLabels = [exercise.name, ...exercise.aliases].filter((label) => label.includes('Ñ')).map(withN);
  const visibleAliases = exercise.aliases.filter((alias) => !enyeLabels.includes(alias));

  return (
    <div className="min-w-0 space-y-4">
      {onBack && (
        <button type="button" className="btn btn-ghost" onClick={onBack}><ArrowLeft size={16} aria-hidden /> Volver a la lista</button>
      )}
      <header>
        <p className="text-xs font-bold text-muted">{CATEGORY_LABELS[exercise.category]}</p>
        {showTitle && <h2 className="text-xl font-black md:text-2xl">{exercise.name}</h2>}
        {visibleAliases.length > 0 && (
          <p className="mt-1 text-sm text-secondary">También conocido como: {visibleAliases.slice(0, 4).join(', ')}</p>
        )}
        <button type="button" className="btn btn-primary mt-3" onClick={() => { playClick(); setIsAdding(true); }}>
          <Plus size={16} aria-hidden /> Añadir a rutina
        </button>
      </header>
      {isAdding && <AddToRoutineDialog exerciseName={exercise.name} onClose={() => setIsAdding(false)} />}

      <SectionCard title={<span className="flex items-center gap-2"><Camera size={18} aria-hidden /> Ejecución</span>} subtitle="Inicio, mitad y final del movimiento">
        <ExerciseFigure key={exercise.name} exerciseName={exercise.name} />
      </SectionCard>

      <SectionCard title={<span className="flex items-center gap-2"><Activity size={18} aria-hidden /> Músculos que trabaja</span>} subtitle="Cuánto trabaja cada músculo en este ejercicio">
        <div className="grid gap-4 lg:grid-cols-2">
          <ExerciseMuscleMap distribution={exercise.distribution} />
          <ul className="space-y-2">
            {muscles.map(([muscleId, percent]) => (
              <li key={muscleId} className="text-sm">
                <div className="flex justify-between gap-2">
                  <span className="min-w-0 font-semibold">{MUSCLE_LABELS[muscleId]}</span>
                  <span className="shrink-0 font-bold">{percent}%</span>
                </div>
                <div className="mt-0.5 h-1.5 overflow-hidden rounded-full surface-2" aria-hidden>
                  <div className="h-full rounded-full" style={{ width: `${percent}%`, background: chart.stimulus[4] }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SectionCard>

      {guide && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2"><GuideSection icon={ListOrdered} title="Técnica paso a paso" items={guide.steps} ordered /></div>
          <GuideSection icon={Lightbulb} title="Consejos" items={guide.tips} />
          <GuideSection icon={AlertTriangle} title="Errores comunes" items={guide.mistakes} tone="warning" />
          {guide.coachCues.length > 0 && (
            <section className="rounded-xl border divider p-3 md:col-span-2 md:p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-bold"><GraduationCap size={16} aria-hidden /> Claves de entrenadores e investigación</h4>
              <ul className="space-y-2.5">
                {guide.coachCues.map((cue) => (
                  <li key={cue.text} className="text-sm">
                    <p className="text-secondary">{cue.text}</p>
                    <p className="mt-0.5 text-xs font-semibold text-muted">— {cue.by}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <section className="rounded-xl border divider p-3 md:p-4">
        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold"><Shuffle size={16} aria-hidden /> Alternativas (mismo músculo principal)</h4>
        {alternatives.length ? (
          <div className="flex flex-wrap gap-1.5">
            {alternatives.map((alternative) => (
              <button key={alternative.name} type="button" className="chip max-w-full truncate" onClick={() => onSelect(alternative.name)}>{alternative.name}</button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Sin alternativas con el mismo músculo principal.</p>
        )}
      </section>
    </div>
  );
};
