import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from './ui';

/*
 * Ventana modal única de la app. Resuelve en un solo lugar lo que antes cada ventana hacía (o no) por su cuenta:
 *  - Portal en <body>: un ancestro con transform (animación de pestañas) ya no puede ensanchar la pantalla.
 *  - Escape cierra (salvo `dismissible={false}`, p. ej. con el reloj corriendo).
 *  - Foco atrapado: Tab / Shift+Tab recorren solo la ventana; al cerrar, el foco vuelve al botón que la abrió.
 *  - Botón "atrás" del celular: cierra la ventana en lugar de salir de la app (entrada propia en el historial).
 *  - Scroll de la página bloqueado mientras está abierta (con contador: hay ventanas dentro de ventanas).
 *  - role="dialog" / "alertdialog", aria-modal y aria-labelledby siempre presentes.
 */

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Pila de ventanas abiertas: Escape, Tab y "atrás" solo los atiende la de arriba.
const dialogStack = [];
let scrollLocks = 0;
// `history.back()` es asíncrono: su popstate llega después y no debe cerrar la ventana siguiente
// (pasa al cerrar una y abrir otra enseguida, y con el doble montaje de StrictMode en desarrollo).
let pendingBacks = 0;
let savedOverflow = '';

const lockScroll = () => {
  if (scrollLocks === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLocks += 1;
};

const unlockScroll = () => {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) document.body.style.overflow = savedOverflow;
};

const SIZES = Object.freeze({ sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' });

export const Dialog = ({
  title,
  subtitle,
  icon: Icon,
  onClose,
  children,
  size = 'md',
  dismissible = true,
  role = 'dialog',
  closeLabel = 'Cerrar',
  sheet = true, // en el celular sale desde abajo (más cómodo para el pulgar)
  bodyClassName = 'p-5',
  hideHeader = false,
}) => {
  const titleId = useId();
  const panelRef = useRef(null);
  const tokenRef = useRef(null);
  // Refs con los valores más recientes: los efectos se montan una sola vez (el historial no se duplica).
  const onCloseRef = useRef(onClose);
  const dismissibleRef = useRef(dismissible);
  useEffect(() => {
    onCloseRef.current = onClose;
    dismissibleRef.current = dismissible;
  }, [onClose, dismissible]);

  useEffect(() => {
    const token = Symbol('dialog');
    tokenRef.current = token;
    dialogStack.push(token);
    const isTop = () => dialogStack[dialogStack.length - 1] === token;
    const previouslyFocused = document.activeElement;
    lockScroll();

    // Foco inicial: el primer elemento con autofocus o el primer enfocable (sino, el panel).
    const panel = panelRef.current;
    // Si un hijo ya tomó el foco (autoFocus de React), se respeta.
    if (!panel?.contains(document.activeElement)) {
      const initial = panel?.querySelector('[autofocus]') ?? panel?.querySelector(FOCUSABLE) ?? panel;
      initial?.focus({ preventScroll: true });
    }

    // Entrada en el historial: el botón atrás del celular dispara popstate y cierra la ventana.
    let closedByHistory = false;
    try {
      window.history.pushState({ ...(window.history.state ?? {}), colossusDialog: true }, '');
    } catch {
      // Historial no disponible (iframe con restricciones): la ventana funciona igual.
    }
    const handlePopState = () => {
      if (pendingBacks > 0) {
        pendingBacks -= 1;
        return;
      }
      if (!isTop()) return;
      closedByHistory = true;
      if (dismissibleRef.current) onCloseRef.current?.();
      else window.history.pushState({ ...(window.history.state ?? {}), colossusDialog: true }, ''); // No se puede cerrar: se repone la entrada
    };

    const handleKeyDown = (event) => {
      if (!isTop()) return;
      if (event.key === 'Escape' && dismissibleRef.current) {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((element) => element.offsetParent !== null || element === document.activeElement);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panelRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panelRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('keydown', handleKeyDown, true);
      const index = dialogStack.indexOf(token);
      if (index >= 0) dialogStack.splice(index, 1);
      unlockScroll();
      // Cerrada con la X / Escape / acción: se descarta la entrada del historial que agregó esta ventana.
      if (!closedByHistory && window.history.state?.colossusDialog) {
        try {
          pendingBacks += 1;
          window.history.back();
        } catch {
          pendingBacks = Math.max(0, pendingBacks - 1);
          // Sin historial: nada que limpiar.
        }
      }
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) previouslyFocused.focus({ preventScroll: true });
    };
  }, []);

  const handleBackdrop = (event) => {
    if (event.target === event.currentTarget && dismissible) onClose?.();
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[70] flex justify-center overflow-hidden bg-black/50 ${sheet ? 'items-end sm:items-center sm:p-4' : 'items-center p-4'}`}
      onMouseDown={handleBackdrop}
    >
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`dialog-panel card flex w-full min-w-0 flex-col ${SIZES[size] ?? SIZES.md} ${sheet ? 'rounded-b-none sm:rounded-2xl' : ''} outline-none`}
      >
        {hideHeader ? (
          <h2 id={titleId} className="sr-only">{title}</h2>
        ) : (
          <div className="flex items-start justify-between gap-2 px-5 pt-4">
            <div className="min-w-0">
              <h2 id={titleId} className="flex items-center gap-2 text-lg font-bold">
                {Icon && <Icon size={20} aria-hidden />} <span className="min-w-0 break-words">{title}</span>
              </h2>
              {subtitle && <p className="truncate text-sm font-semibold text-secondary">{subtitle}</p>}
            </div>
            {dismissible && <IconButton label={closeLabel} icon={X} onClick={onClose} />}
          </div>
        )}
        <div className={`min-w-0 ${bodyClassName}`}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};
