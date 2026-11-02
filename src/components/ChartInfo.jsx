import { Info, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Dialog } from './Dialog';
import { IconButton } from './ui';
import { playClick } from '../utils/audio';

/*
 * Botón (i) de cada gráfico: abre una ventana con cómo se calcula, cómo leerlo y un consejo.
 * Ventana modal (no tooltip): en el celular un tooltip se sale de la pantalla y no se puede leer con calma.
 * `info`: { title, how: string[], read: string[], tip: string }
 */
export const ChartInfo = ({ info }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!info) return null;

  return (
    <>
      <IconButton label={`Cómo leer: ${info.title}`} icon={Info} onClick={() => { playClick(); setIsOpen(true); }} />
      {isOpen && (
        <Dialog title={info.title} onClose={() => setIsOpen(false)} bodyClassName="px-5 pb-5 pt-3 text-left font-normal normal-case tracking-normal">
            <h3 className="mb-1 text-sm font-bold">Cómo se calcula</h3>
            <ul className="mb-4 list-disc space-y-1.5 pl-5 text-sm text-secondary">
              {info.how.map((line) => <li key={line}>{line}</li>)}
            </ul>
            <h3 className="mb-1 text-sm font-bold">Cómo interpretarlo</h3>
            <ul className="mb-4 list-disc space-y-1.5 pl-5 text-sm text-secondary">
              {info.read.map((line) => <li key={line}>{line}</li>)}
            </ul>
            <p className="flex gap-2 rounded-xl bg-[var(--accent-soft)] p-3 text-sm">
              <Lightbulb size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <span><strong>Consejo:</strong> {info.tip}</span>
            </p>
        </Dialog>
      )}
    </>
  );
};
