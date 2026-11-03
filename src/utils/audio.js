// Bug original: se creaba un AudioContext nuevo por cada click y nunca se cerraba.
// Chrome limita los contextos simultáneos y emite warnings; aquí se reutiliza uno solo.

const LEGACY_ENABLED_KEY = 'colossus:sound-enabled'; // hasta 4.4: solo encendido/apagado
const SETTINGS_KEY = 'colossus:audio:v1';
let audioContext = null;

/*
 * Volúmenes por canal (0 a 1), multiplicados por el volumen general. Se guardan en el dispositivo:
 * cada celular/computadora suena distinto y conviene ajustarlo en cada uno.
 */
export const SOUND_CHANNELS = Object.freeze([
  { id: 'click', label: 'Botones', hint: 'El "tic" al tocar botones y pestañas.' },
  { id: 'timer', label: 'Reloj', hint: 'Pitidos de cuenta regresiva y de cambio de fase.' },
  { id: 'celebration', label: 'Festejos', hint: 'Al registrar un ejercicio o batir un récord.' },
]);

const DEFAULT_SETTINGS = Object.freeze({ enabled: true, master: 0.8, click: 0.6, timer: 1, celebration: 0.8, vibration: true });

const clamp01 = (value, fallback) => (Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : fallback);

const readSettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null');
    const legacyMuted = localStorage.getItem(LEGACY_ENABLED_KEY) === 'false';
    const base = { ...DEFAULT_SETTINGS, enabled: !legacyMuted };
    if (!stored) return base;
    return {
      enabled: typeof stored.enabled === 'boolean' ? stored.enabled : base.enabled,
      vibration: typeof stored.vibration === 'boolean' ? stored.vibration : base.vibration,
      ...Object.fromEntries(['master', ...SOUND_CHANNELS.map(({ id }) => id)].map((key) => [key, clamp01(stored[key], base[key])])),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

let settings = readSettings();
const listeners = new Set();

export const getSoundSettings = () => settings;

export const updateSoundSettings = (patch) => {
  settings = { ...settings, ...patch };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage bloqueado (modo privado): la preferencia vive solo en memoria.
  }
  listeners.forEach((listener) => listener(settings));
  return settings;
};

// Para que la UI (configuración, botón de silencio) se entere de cambios hechos en otro lugar.
export const subscribeToSoundSettings = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Compatibilidad con el resto de la app (silenciar todo).
export const isSoundEnabled = () => settings.enabled;
export const setSoundEnabled = (enabled) => updateSoundSettings({ enabled });
export const isVibrationEnabled = () => settings.vibration;

const getAudioContext = () => {
  if (audioContext) return audioContext;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext = new AudioContextClass();
  return audioContext;
};

const playTones = (frequencies, { type = 'sine', gain = 0.03, step = 0.08, duration = 0.18, delay = 0, channel = 'click' } = {}) => {
  const volume = settings.enabled ? settings.master * (settings[channel] ?? 1) : 0;
  if (volume <= 0.001) return;
  const scaledGain = Math.max(0.0005, gain * volume * 1.6); // 1,6: al 80% general queda como antes de 4.5
  try {
    const context = getAudioContext();
    if (!context) return;
    // Política de autoplay: el contexto puede nacer suspendido hasta una interacción.
    if (context.state === 'suspended') context.resume().catch(() => {});

    frequencies.forEach((frequency, index) => {
      const startAt = context.currentTime + delay + index * step;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startAt);
      gainNode.gain.setValueAtTime(scaledGain, startAt);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
      oscillator.connect(gainNode).connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration);
    });
  } catch {
    // El audio es decorativo: un fallo nunca debe interrumpir el flujo.
  }
};

export const playClick = () => playTones([440], { gain: 0.02, duration: 0.05 });

export const playSuccess = (isPersonalRecord = false) =>
  playTones(isPersonalRecord ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25], { type: 'triangle', gain: 0.05, channel: 'celebration' });

/*
 * Un motivo sonoro por festejo (mismo índice que CELEBRATION_VARIANTS). Volumen bajo y < 0.5 s:
 * satisfactorio sin ser invasivo. Usan el canal "Festejos" de la configuración de sonido.
 */
const CELEBRATION_SOUNDS = [
  () => playTones([880, 1174.66, 1567.98], { channel: 'celebration', type: 'sine', gain: 0.035, step: 0.05, duration: 0.14 }), // Chispas
  () => playTones([659.25, 987.77], { channel: 'celebration', type: 'triangle', gain: 0.05, step: 0.09, duration: 0.2 }), // Check
  () => playTones([523.25, 659.25, 783.99, 1046.5], { channel: 'celebration', type: 'square', gain: 0.012, step: 0.035, duration: 0.08 }), // Confeti
  () => playTones([523.25, 659.25, 783.99], { channel: 'celebration', type: 'sine', gain: 0.025, step: 0, duration: 0.4 }), // Insignia (acorde)
  () => { // Pulso: golpe grave + campanita
    playTones([130.81], { channel: 'celebration', type: 'sine', gain: 0.08, duration: 0.12 });
    playTones([783.99], { channel: 'celebration', type: 'sine', gain: 0.03, duration: 0.25, delay: 0.08 });
  },
];

export const playCelebration = (variantIndex, isPersonalRecord = false) => {
  CELEBRATION_SOUNDS[variantIndex % CELEBRATION_SOUNDS.length]?.();
  // Récord: remate ascendente breve después del motivo base.
  if (isPersonalRecord) playTones([1046.5, 1318.51, 1567.98, 2093], { channel: 'celebration', type: 'triangle', gain: 0.035, step: 0.07, duration: 0.18, delay: 0.3 });
};

// ───────── Reloj de entrenamiento ─────────
// Más volumen que los clicks: se escuchan con música en el gimnasio. Usan el canal "Reloj".
export const playCountdownTick = () => playTones([880], { channel: 'timer', type: 'square', gain: 0.03, duration: 0.09 });
export const playWorkStart = () => playTones([660, 990], { channel: 'timer', type: 'square', gain: 0.04, step: 0.1, duration: 0.16 });
export const playRestStart = () => playTones([660, 440], { channel: 'timer', type: 'triangle', gain: 0.05, step: 0.12, duration: 0.2 });
export const playTimerFinish = () => playTones([523.25, 659.25, 783.99, 1046.5], { channel: 'timer', type: 'square', gain: 0.035, step: 0.12, duration: 0.22 });
