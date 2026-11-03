import { Vibrate, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { getSoundSettings, playCelebration, playClick, playCountdownTick, SOUND_CHANNELS, subscribeToSoundSettings, updateSoundSettings } from '../../utils/audio';

// Sonido de muestra de cada canal (se reproduce al soltar el control).
const PREVIEW = Object.freeze({ master: () => playCountdownTick(), click: () => playClick(), timer: () => playCountdownTick(), celebration: () => playCelebration(1) });

const VolumeSlider = ({ id, label, hint, value, disabled, onChange, onPreview }) => (
  <div className="py-2.5">
    <div className="flex items-baseline justify-between gap-2">
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      <span className="text-xs font-bold tabular-nums text-secondary">{Math.round(value * 100)}%</span>
    </div>
    {hint && <p className="text-xs text-muted">{hint}</p>}
    <input id={id} type="range" min="0" max="100" step="5" className="mt-1.5 w-full accent-[var(--accent)]" disabled={disabled}
      value={Math.round(value * 100)} onChange={(event) => onChange(Number(event.target.value) / 100)}
      onPointerUp={onPreview} onKeyUp={(event) => event.key.startsWith('Arrow') && onPreview()} />
  </div>
);

/**
 * Volúmenes por canal (general, botones, reloj y festejos) y vibración del reloj. Se guardan en este dispositivo.
 */
export const SoundSettings = () => {
  const id = useId();
  const [settings, setSettings] = useState(getSoundSettings);
  useEffect(() => subscribeToSoundSettings(setSettings), []);
  const set = (patch) => updateSoundSettings(patch);

  return (
    <div>
      <button type="button" className={`btn w-full ${settings.enabled ? 'btn-ghost' : 'btn-outline'}`} aria-pressed={!settings.enabled}
        onClick={() => { set({ enabled: !settings.enabled }); if (!settings.enabled) setTimeout(playClick, 0); }}>
        {settings.enabled ? <><Volume2 size={16} aria-hidden /> Sonido activado · tocar para silenciar todo</> : <><VolumeX size={16} aria-hidden /> Todo en silencio · tocar para activar</>}
      </button>

      <div className="mt-2 divide-y divide-[var(--border)]">
        <VolumeSlider id={`${id}-master`} label="Volumen general" value={settings.master} disabled={!settings.enabled}
          onChange={(master) => set({ master })} onPreview={PREVIEW.master} />
        {SOUND_CHANNELS.map((channel) => (
          <VolumeSlider key={channel.id} id={`${id}-${channel.id}`} label={channel.label} hint={channel.hint} value={settings[channel.id]}
            disabled={!settings.enabled} onChange={(value) => set({ [channel.id]: value })} onPreview={PREVIEW[channel.id]} />
        ))}
      </div>

      <label className="mt-2 flex cursor-pointer items-center justify-between gap-3 rounded-xl surface-2 p-3">
        <span className="flex items-center gap-2 text-sm font-semibold"><Vibrate size={16} aria-hidden /> Vibrar con el reloj</span>
        <input type="checkbox" className="h-5 w-5 accent-[var(--accent)]" checked={settings.vibration} onChange={(event) => set({ vibration: event.target.checked })} />
      </label>
      <p className="mt-2 text-xs text-muted">Se guarda solo en este dispositivo. También depende del volumen de tu celular.</p>
    </div>
  );
};
