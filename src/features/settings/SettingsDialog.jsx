import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Dialog } from '../../components/Dialog';
import { SegmentedControl } from '../../components/ui';
import { AppearanceSettings } from './AppearanceSettings';
import { SoundSettings } from './SoundSettings';

const SECTIONS = Object.freeze([
  { value: 'sound', label: 'Sonido' },
  { value: 'appearance', label: 'Colores y tema' },
]);

// Configuración (engranaje del encabezado): volúmenes por canal y personalización de colores.
export const SettingsDialog = ({ onClose, initialSection = 'sound' }) => {
  const [section, setSection] = useState(initialSection);
  return (
    <Dialog title="Configuración" icon={Settings} onClose={onClose} size="lg" bodyClassName="px-5 pb-5 pt-3">
      <SegmentedControl label="Sección" options={SECTIONS} value={section} onChange={setSection} />
      <div className="mt-4">{section === 'sound' ? <SoundSettings /> : <AppearanceSettings />}</div>
    </Dialog>
  );
};
