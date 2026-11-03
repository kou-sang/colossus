import { AddToRoutineDialog } from '../library/AddToRoutineDialog';

/*
 * "Agregar a rutina" desde Registrado hoy: propone tu rutina activa y el día de hoy, con las series,
 * repeticiones y kilos que acabas de hacer (con series detalladas, la mejor serie).
 */
export const AddLogToRoutineDialog = ({ log, onClose }) => (
  <AddToRoutineDialog
    title="Agregar a una rutina"
    exerciseName={log.exercise}
    initialValues={{ sets: log.sets, reps: log.reps, weight: log.weight }}
    onClose={onClose}
  />
);
