import { AlertTriangle, CheckCircle2, Moon, RotateCcw, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ColorPicker } from '../../components/ColorPicker';
import { InlineSpinner, SegmentedControl } from '../../components/ui';
import { useAppData } from '../../context/AppDataContext';
import { colorsKey, contrastRatio, CUSTOM_COLOR_FIELDS, markLocalColorsWrite, sanitizeRecentColors, useTheme } from '../../context/ThemeContext';
import { savePreferences } from '../../services/userService';
import { playClick } from '../../utils/audio';
import { logError } from '../../utils/errors';

const MIN_TEXT_CONTRAST = 4.5; // WCAG AA para texto normal

const AUTOSAVE_DELAY_MS = 1200;

/*
 * Autoguardado de colores y recientes en la cuenta (antes había que tocar "Guardar" y, si no, al recargar
 * los colores de la cuenta pisaban los últimos elegidos). Debounce para no escribir en cada arrastre del selector;
 * si se sale de Perfil con cambios pendientes, se guardan igual.
 */
const useColorAutosave = () => {
  const { user } = useAppData();
  const { customColors, recentColors } = useTheme();
  // Clave local cuyo último guardado falló (null = sin error). El estado visible se DERIVA en el render:
  // así ningún efecto llama setState de forma síncrona (regla react-hooks/set-state-in-effect).
  const [failedKey, setFailedKey] = useState(null);
  const pendingSaveRef = useRef(null);

  const localKey = JSON.stringify({ colors: colorsKey(customColors), recent: sanitizeRecentColors(recentColors) });
  const remoteKey = JSON.stringify({ colors: colorsKey(user.preferences?.colors), recent: sanitizeRecentColors(user.preferences?.recentColors) });
  const isSynced = localKey === remoteKey;

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (isSynced) {
      pendingSaveRef.current = null;
      return undefined;
    }
    const save = async () => {
      pendingSaveRef.current = null;
      const { colors, recent } = JSON.parse(localKey);
      try {
        markLocalColorsWrite(colors);
        await savePreferences(userRef.current.id, { ...userRef.current.preferences, colors: JSON.parse(colors), recentColors: recent });
        setFailedKey(null);
      } catch (saveError) {
        logError('profile:colors-autosave', saveError);
        setFailedKey(localKey);
      }
    };
    pendingSaveRef.current = save;
    const timer = setTimeout(save, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [localKey, isSynced]);

  // Al salir de Perfil: guarda lo pendiente en vez de perderlo (se lee el ref al desmontar a propósito).
  useEffect(() => () => pendingSaveRef.current?.(), []);

  if (isSynced) return 'saved';
  return failedKey === localKey ? 'error' : 'pending';
};

const AutosaveStatus = ({ status }) => {
  if (status === 'pending') return <span className="flex items-center gap-1.5 text-xs font-semibold text-muted"><InlineSpinner /> Guardando en tu cuenta…</span>;
  if (status === 'error') return <span className="flex items-center gap-1.5 text-xs font-semibold text-accent"><AlertTriangle size={14} aria-hidden /> No se pudo guardar; se reintentará con el próximo cambio.</span>;
  return <span className="flex items-center gap-1.5 text-xs font-semibold text-muted"><CheckCircle2 size={14} aria-hidden /> Guardado en tu cuenta</span>;
};

export const AppearanceSettings = () => {
  const { theme, toggleTheme, customColors, setCustomColor, resetCustomColors, replaceCustomColors, recentColors, rememberColor } = useTheme();
  const saveStatus = useColorAutosave();
  const [editMode, setEditMode] = useState(theme);
  const modeColors = customColors[editMode] ?? {};
  const resolved = Object.fromEntries(CUSTOM_COLOR_FIELDS.map((field) => [field.key, modeColors[field.key] ?? field.defaults[editMode]]));

  // Avisos de legibilidad: el usuario puede elegir cualquier color, pero se le advierte si el texto no se lee.
  const contrastChecks = [
    { label: 'Texto sobre fondo', ratio: contrastRatio(resolved.text, resolved.bg) },
    { label: 'Texto sobre tarjetas', ratio: contrastRatio(resolved.text, resolved.surface) },
    { label: 'Texto secundario sobre tarjetas', ratio: contrastRatio(resolved['text-2'], resolved.surface) },
  ];
  const failingChecks = contrastChecks.filter(({ ratio }) => ratio !== null && ratio < MIN_TEXT_CONTRAST);

  const resetField = (key) => {
    playClick();
    const next = { ...customColors, [editMode]: { ...modeColors } };
    delete next[editMode][key];
    replaceCustomColors(next);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 flex-1 basis-48 text-sm text-secondary">Los cambios se ven al momento y se guardan solos en tu cuenta.</p>
        <button type="button" className="btn btn-ghost" onClick={() => { playClick(); toggleTheme(); setEditMode(theme === 'dark' ? 'light' : 'dark'); }}>
          {theme === 'dark' ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />} Pasar a modo {theme === 'dark' ? 'claro' : 'oscuro'}
        </button>
      </div>
      <SegmentedControl label="Modo a personalizar" value={editMode} onChange={setEditMode}
        options={[{ value: 'light', label: 'Modo claro' }, { value: 'dark', label: 'Modo oscuro' }]} />
      {editMode !== theme && (
        <p className="mt-2 text-xs text-muted">Estás editando el modo {editMode === 'dark' ? 'oscuro' : 'claro'}. Para ver cómo queda, pasa a ese modo.</p>
      )}

      <div className="mt-3 divide-y divide-[var(--border)]">
        {CUSTOM_COLOR_FIELDS.map((field) => (
          <ColorPicker
            key={`${editMode}-${field.key}`}
            label={field.label}
            value={resolved[field.key]}
            isCustom={Boolean(modeColors[field.key])}
            recentColors={recentColors}
            onChange={(hex) => setCustomColor(editMode, field.key, hex)}
            onCommit={rememberColor}
            onReset={() => resetField(field.key)}
          />
        ))}
      </div>

      {failingChecks.length > 0 && (
        <div role="status" className="mt-3 flex gap-2 rounded-xl bg-[var(--accent-soft)] p-3 text-sm">
          <AlertTriangle size={18} className="shrink-0 text-accent" aria-hidden />
          <p>
            Contraste bajo (mínimo recomendado {MIN_TEXT_CONTRAST}:1):{' '}
            {failingChecks.map(({ label, ratio }) => `${label} ${ratio}:1`).join(', ')}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <AutosaveStatus status={saveStatus} />
        <button type="button" className="btn btn-ghost" onClick={() => { playClick(); resetCustomColors(editMode); }}>
          <RotateCcw size={16} aria-hidden /> Restablecer modo {editMode === 'dark' ? 'oscuro' : 'claro'}
        </button>
      </div>
    </div>
  );
};

