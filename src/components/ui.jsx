import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { playClick } from '../utils/audio';

export const BRAND_NAME = 'Colossus';

/*
 * Isotipo de Colossus: una "C" sólida. Misma geometría que public/favicon.svg (fuente: public/brand/colossus-mark.svg).
 * Usa el color del texto: blanca en modo oscuro y oscura en modo claro, para que se lea sobre cualquier fondo.
 */
export const LogoMark = ({ size = 24, className = '' }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} className={className} aria-hidden focusable="false">
    <path transform="translate(23 0)" d="M370.9 352.4A150 150 0 1 1 370.9 159.6" fill="none" stroke="currentColor" strokeWidth="90" />
  </svg>
);

export const BrandMark = ({ size = 28, showName = true }) => (
  <div className="flex items-center gap-2">
    <LogoMark size={size} />
    {showName && <span className="text-lg font-black tracking-tight">{BRAND_NAME}</span>}
  </div>
);

// Pasado este tiempo se avisa que la operación sigue en curso (red lenta / primer arranque en frío).
const SLOW_LOADING_MS = 4000;

const useIsSlow = (delay = SLOW_LOADING_MS) => {
  const [isSlow, setIsSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return isSlow;
};

/**
 * Rueda + texto que explica QUÉ se está haciendo ("Cargando tus rutinas…") y, si tarda,
 * una aclaración para que el usuario sepa que no se colgó.
 */
export const Spinner = ({ label, hint, slowHint = 'Está tardando más de lo normal; seguimos intentando…', size = 'md' }) => {
  const isSlow = useIsSlow();
  const dimension = size === 'sm' ? 'h-6 w-6' : 'h-10 w-10';
  return (
    <div className="flex flex-col items-center gap-3 text-center" role="status" aria-live="polite">
      <div className={`${dimension} animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]`} aria-hidden />
      {label && <p className="text-sm font-semibold text-secondary">{label}</p>}
      {hint && <p className="max-w-xs text-xs text-muted">{hint}</p>}
      {isSlow && slowHint && <p className="max-w-xs text-xs text-muted">{slowHint}</p>}
    </div>
  );
};

export const LoadingState = ({ label, hint, className = '' }) => (
  <div className={`card flex justify-center px-4 py-10 ${className}`}>
    <Spinner label={label} hint={hint} />
  </div>
);

// Indicador compacto para botones: el texto del botón describe la acción en curso.
export const InlineSpinner = () => (
  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
);

export const FullScreenLoader = ({ label = 'Cargando…', hint }) => (
  <div className="flex min-h-[100dvh] items-center justify-center p-4">
    <Spinner label={label} hint={hint} />
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="card flex flex-col items-center gap-2 p-8 text-center">
    {Icon && <Icon size={32} className="text-muted" aria-hidden />}
    <h3 className="text-base font-bold">{title}</h3>
    {description && <p className="max-w-sm text-sm text-secondary">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export const SegmentedControl = ({ options, value, onChange, label }) => (
  <div className="segmented overflow-x-auto" role="tablist" aria-label={label}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="tab"
        aria-selected={value === option.value}
        onClick={() => {
          playClick();
          onChange(option.value);
        }}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export const IconButton = ({ label, icon: Icon, onClick, tone, disabled, size = 18 }) => (
  <button
    type="button"
    className={`icon-btn ${tone === 'danger' ? 'danger' : ''}`}
    aria-label={label}
    title={label}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon size={size} aria-hidden />
  </button>
);

export const StatTile = ({ label, value, hint, icon: Icon }) => (
  <div className="card flex min-w-0 flex-col gap-1 p-3 md:p-4">
    <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted md:text-xs">
      {Icon && <Icon size={14} className="shrink-0" aria-hidden />}
      <span className="truncate">{label}</span>
    </span>
    <span className="text-xl font-black leading-tight md:text-2xl">{value}</span>
    {hint && <span className="text-xs text-secondary">{hint}</span>}
  </div>
);

// Título con base mínima de 10rem: un botón (i) chico queda a la derecha; acciones anchas (selectores) bajan de línea.
/*
 * Encabezado de tarjeta: título (y subtítulo) a la izquierda; a la derecha, en la MISMA fila del título, el botón de
 * información y el de plegar. Los controles del gráfico (selector de submapa, de ejercicio…) van en una fila debajo,
 * así en el celular no se apilan desordenados al lado del título.
 */
const SectionHeader = ({ title, subtitle, info, toggle, actions, isCollapsed = false }) => (
  <header className={isCollapsed ? '' : 'mb-4'}>
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        {title && <h3 className="break-words text-base font-bold md:text-lg">{title}</h3>}
        {subtitle && <p className="mt-0.5 break-words text-xs text-secondary md:text-sm">{subtitle}</p>}
      </div>
      {(info || toggle) && <div className="-mr-1 -mt-1 flex shrink-0 items-center">{info}{toggle}</div>}
    </div>
    {actions && !isCollapsed && <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">{actions}</div>}
  </header>
);

// Tarjeta plegable que recuerda si quedó plegada (por dispositivo). Plegada no monta el contenido (gráficos livianos).
const CollapsibleCard = ({ title, subtitle, info, actions, children, className, collapseKey, collapseLabel }) => {
  const [isCollapsed, setIsCollapsed] = usePersistentState(`collapsed:${collapseKey}`, false, (value) => typeof value === 'boolean');
  const panelId = useId();
  const name = collapseLabel ?? (typeof title === 'string' ? title : 'sección');
  const toggle = (
    <button type="button" className="icon-btn" aria-expanded={!isCollapsed} aria-controls={panelId}
      aria-label={isCollapsed ? `Desplegar ${name}` : `Plegar ${name}`} title={isCollapsed ? 'Desplegar' : 'Plegar'}
      onClick={() => { playClick(); setIsCollapsed((collapsed) => !collapsed); }}>
      {isCollapsed ? <ChevronDown size={18} aria-hidden /> : <ChevronUp size={18} aria-hidden />}
    </button>
  );
  return (
    <section className={`card min-w-0 p-4 md:p-5 ${className}`}>
      <SectionHeader title={title} subtitle={subtitle} info={info} toggle={toggle} actions={actions} isCollapsed={isCollapsed} />
      {!isCollapsed && <div id={panelId} className="min-w-0">{children}</div>}
    </section>
  );
};

/**
 * Tarjeta de sección. `info` (botón de ayuda) va junto al título; `actions` (controles) en una fila debajo.
 * Con `collapseKey` se puede plegar y el estado se recuerda la próxima vez
 * (`collapseLabel` nombra la sección en el botón cuando el título no es texto).
 */
export const SectionCard = ({ title, subtitle, info, actions, children, className = '', collapseKey, collapseLabel }) => {
  if (collapseKey) {
    return <CollapsibleCard title={title} subtitle={subtitle} info={info} actions={actions} className={className} collapseKey={collapseKey} collapseLabel={collapseLabel}>{children}</CollapsibleCard>;
  }
  return (
    <section className={`card min-w-0 p-4 md:p-5 ${className}`}>
      {(title || actions || info) && <SectionHeader title={title} subtitle={subtitle} info={info} actions={actions} />}
      {children}
    </section>
  );
};

export const FieldLabel = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-xs font-bold text-secondary">
    {children}
  </label>
);

/*
 * Tarjeta plegable (cerrada por defecto). El contenido se monta recién al abrir: los formularios de adentro
 * arrancan con los datos actuales cada vez y la pestaña carga más liviana.
 */
export const CollapsibleSection = ({ title, icon: Icon, subtitle, children, defaultOpen = false, className = '' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <section className={`card ${className}`}>
      <h3>
        <button type="button" className="flex w-full min-w-0 items-center justify-between gap-3 p-4 text-left md:px-5" aria-expanded={isOpen} aria-controls={panelId}
          onClick={() => { playClick(); setIsOpen((open) => !open); }}>
          <span className="min-w-0">
            <span className="flex items-center gap-2 text-base font-bold md:text-lg">{Icon && <Icon size={18} aria-hidden />} {title}</span>
            {subtitle && <span className="mt-0.5 block text-xs font-normal text-secondary md:text-sm">{subtitle}</span>}
          </span>
          {isOpen ? <ChevronUp size={20} className="shrink-0 text-muted" aria-hidden /> : <ChevronDown size={20} className="shrink-0 text-muted" aria-hidden />}
        </button>
      </h3>
      {isOpen && <div id={panelId} className="px-4 pb-4 md:px-5 md:pb-5">{children}</div>}
    </section>
  );
};
