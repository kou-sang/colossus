import { useState } from 'react';
import { SegmentedControl } from '../../components/ui';
import { buildExerciseFrames, defaultViewFor, FRAME_LABELS, VIEW_OPTIONS } from '../../utils/exerciseFrames';

/*
 * Tres fotogramas del movimiento (inicio, mitad y final) en tres vistas: lateral, frontal y superior.
 * Se dibujan por código desde un esqueleto 3D (utils/poseFigure.js). El SVG lo genera la propia app a partir
 * de datos fijos (sin entrada del usuario): es seguro inyectarlo. Usa las variables de color del tema.
 * `key={exerciseName}` en el padre reinicia la vista al cambiar de ejercicio.
 */
export const ExerciseFigure = ({ exerciseName }) => {
  const [view, setView] = useState(() => defaultViewFor(exerciseName));
  const frames = buildExerciseFrames(exerciseName, view);
  return (
    <div className="space-y-2">
      <SegmentedControl label="Vista de la ilustración" options={VIEW_OPTIONS} value={view} onChange={setView} />
      {frames ? (
        <ol className="grid grid-cols-3 gap-2">
          {frames.map((svg, index) => (
            <li key={FRAME_LABELS[index]} className="overflow-hidden rounded-xl border divider surface-2">
              <div className="aspect-[200/196] w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
              <p className="border-t divider py-1 text-center text-xs font-bold text-secondary">{index + 1}. {FRAME_LABELS[index]}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted">Sin ilustración para este ejercicio.</p>
      )}
    </div>
  );
};
