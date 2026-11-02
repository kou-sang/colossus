import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/*
 * Capa modal montada en <body> con un portal.
 * Motivo: las pestañas se animan con transform (framer-motion) y un `position: fixed` dentro de un ancestro con
 * transform deja de medirse contra la pantalla: el fondo oscuro y la ventana quedaban del ancho del contenedor
 * y, en el celular, la página se ensanchaba (botón "i" de Analíticas). En <body> eso no puede pasar.
 * También bloquea el scroll de la página mientras está abierta.
 */
export const Modal = ({ children, onBackdropClick, align = 'bottom', padded = true }) => {
  useEffect(() => {
    const { style } = document.body;
    const previous = style.overflow;
    style.overflow = 'hidden';
    return () => {
      style.overflow = previous;
    };
  }, []);

  return createPortal(
    <div
      className={`fixed inset-0 z-[70] flex justify-center overflow-hidden bg-black/50 ${align === 'bottom' ? 'items-end sm:items-center' : 'items-center'} ${padded ? 'p-4' : 'sm:p-4'}`}
      onClick={onBackdropClick}
    >
      {children}
    </div>,
    document.body,
  );
};
