import { Info, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Dialog } from './Dialog';
import { IconButton } from './ui';
import { playClick } from '../utils/audio';

/*
 * Botón (i) de cada gráfico: qué muestra, cómo leerlo, un consejo y, plegado, cómo se calcula (con fuentes).
 * Ventana modal (no tooltip): en el celular un tooltip se sale de la pantalla y no se puede leer con calma.
 * `info`: { title, summary, read: string[], tip, how: string[], sources?: string[] }
 */
export const ChartInfo = ({ info }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!info) return null;

  return (
    <>
      <IconButton label={`Cómo leer: ${info.title}`} icon={Info} onClick={() => { playClick(); setIsOpen(true); }} />
      {isOpen && (
        <Dialog title={info.title} onClose={() => setIsOpen(false)} bodyClassName="px-5 pb-5 pt-3 text-left font-normal normal-case tracking-normal">
          {info.summary && <p className="mb-4 text-sm">{info.summary}</p>}
          {info.read?.length > 0 && (
            <>
              <h3 className="mb-1 text-sm font-bold">Cómo leerlo</h3>
              <ul className="mb-4 list-disc space-y-1.5 pl-5 text-sm text-secondary">
                {info.read.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </>
          )}
          {info.tip && (
            <p className="mb-4 flex gap-2 rounded-xl bg-[var(--accent-soft)] p-3 text-sm">
              <Lightbulb size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <span><strong>Consejo:</strong> {info.tip}</span>
            </p>
          )}
          {info.how?.length > 0 && (
            <details className="rounded-xl border divider p-3 text-sm">
              <summary className="cursor-pointer font-bold">Cómo se calcula</summary>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-secondary">
                {info.how.map((line) => <li key={line}>{line}</li>)}
              </ul>
              {info.sources?.length > 0 && (
                <p className="mt-3 text-xs text-muted">Fuentes: {info.sources.join(' · ')}</p>
              )}
            </details>
          )}
        </Dialog>
      )}
    </>
  );
};
