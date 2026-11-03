import { createContext, useContext } from 'react';

// Contexto separado del proveedor (.jsx): react-refresh exige que los .jsx exporten solo componentes.
export const TimerContext = createContext(null);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error('useTimer debe usarse dentro de <TimerProvider>');
  return context;
};
