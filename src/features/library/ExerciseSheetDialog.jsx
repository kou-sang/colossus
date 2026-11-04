import { ArrowLeft, BookOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Dialog } from '../../components/Dialog';
import { canonicalExerciseName, getExerciseMeta } from '../../constants/exercises';
import { playClick } from '../../utils/audio';
import { ExerciseDetail } from './ExerciseDetail';

/*
 * Ventana con la misma ficha de la pestaña Ejercicios, para abrirla desde otras pestañas (Inicio).
 * Las alternativas se recorren dentro de la ventana; "Volver" regresa al ejercicio anterior.
 * Si el nombre no está en el catálogo (ejercicio personalizado) se avisa en lugar de mostrar una ficha vacía.
 */
export const ExerciseSheetDialog = ({ exerciseName, onClose }) => {
  // Pila de nombres visitados: el último es el que se muestra.
  const [trail, setTrail] = useState(() => [canonicalExerciseName(exerciseName)]);
  const currentName = trail[trail.length - 1];
  const exercise = getExerciseMeta(currentName);
  const contentRef = useRef(null);

  // Al cambiar de ejercicio la ficha nueva arranca desde arriba (el cuerpo de la ventana tiene scroll propio).
  useEffect(() => {
    contentRef.current?.parentElement?.scrollTo({ top: 0 });
  }, [currentName]);

  const openAlternative = (name) => {
    playClick();
    setTrail((previous) => [...previous, name]);
  };
  const goBack = () => {
    playClick();
    setTrail((previous) => previous.slice(0, -1));
  };

  return (
    <Dialog title={exercise?.name ?? exerciseName} icon={BookOpen} size="lg" onClose={onClose} bodyClassName="max-h-[78dvh] overflow-y-auto overscroll-contain px-4 pb-5 pt-3 md:px-5">
      <div ref={contentRef}>
        {trail.length > 1 && (
          <button type="button" className="btn btn-ghost mb-2" onClick={goBack}>
            <ArrowLeft size={16} aria-hidden /> Volver a {trail[trail.length - 2]}
          </button>
        )}
        {exercise ? (
          <ExerciseDetail key={exercise.name} exercise={exercise} onSelect={openAlternative} showTitle={false} />
        ) : (
          <p className="text-sm text-secondary">
            Este ejercicio no está en la biblioteca (lo agregaste con un nombre propio), así que no tiene ficha. Puedes buscar uno parecido en la pestaña Ejercicios.
          </p>
        )}
      </div>
    </Dialog>
  );
};
