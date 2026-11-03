import { KeyRound, LogOut, Mail, Scale, Settings, UserRound } from 'lucide-react';
import { useState } from 'react';
import { CollapsibleSection, FieldLabel, InlineSpinner } from '../../components/ui';
import { useAppData } from '../../context/AppDataContext';
import { useFeedback } from '../../context/FeedbackContext';
import { changeEmail, changePassword, hasPasswordProvider, logout, updateDisplayName } from '../../services/authService';
import { updateProfileData } from '../../services/userService';
import { playClick } from '../../utils/audio';
import { logError, toUserMessage, ValidationError } from '../../utils/errors';
import { BodyStatsForm } from './BodyStatsForm';

// Estado de envío + errores por formulario (cada sección es independiente).
const useFormAction = () => {
  const { notify } = useFeedback();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const submit = async (context, action, successMessage) => {
    playClick();
    setError('');
    setIsSubmitting(true);
    try {
      const result = await action();
      if (successMessage) notify(typeof successMessage === 'function' ? successMessage(result) : successMessage, 'success');
      return true;
    } catch (actionError) {
      if (actionError?.code === 'auth/popup-closed-by-user' || actionError?.code === 'auth/cancelled-popup-request') return false;
      logError(context, actionError);
      setError(toUserMessage(actionError));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  return { isSubmitting, error, submit };
};

const FormError = ({ message }) => (message ? <p role="alert" className="text-sm font-semibold text-accent">{message}</p> : null);

const ProfileDataSection = () => {
  const { user } = useAppData();
  const { isSubmitting, error, submit } = useFormAction();
  const [form, setForm] = useState({ username: user.username, gender: user.gender });
  const isDirty = form.username !== user.username || form.gender !== user.gender;

  const handleSubmit = (event) => {
    event.preventDefault();
    submit('profile:update', async () => {
      await updateProfileData(user.id, form);
      // displayName de Auth es secundario (el perfil público es la fuente de verdad): un fallo no revierte.
      updateDisplayName(form.username.trim()).catch((nameError) => logError('profile:display-name', nameError));
    }, 'Perfil actualizado');
  };

  return (
    <CollapsibleSection icon={UserRound} title="Datos del perfil"
      subtitle="Tus grupos ven este nombre.">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <FieldLabel htmlFor="profile-username">Nombre de usuario</FieldLabel>
          <input id="profile-username" className="input" maxLength={24} autoComplete="nickname" value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })} />
        </div>
        <div>
          <FieldLabel htmlFor="profile-gender">Sexo (define el mapa corporal)</FieldLabel>
          <select id="profile-gender" className="input" value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
        <FormError message={error} />
        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? <><InlineSpinner /> Guardando perfil…</> : 'Guardar cambios'}
        </button>
      </form>
    </CollapsibleSection>
  );
};

const EmailSection = () => {
  const { user } = useAppData();
  const { isSubmitting, error, submit } = useFormAction();
  const [form, setForm] = useState({ newEmail: '', currentPassword: '' });
  const [pendingEmail, setPendingEmail] = useState('');
  const usesPassword = hasPasswordProvider();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ok = await submit('profile:email', async () => {
      const email = await changeEmail(form);
      setPendingEmail(email);
    });
    if (ok) setForm({ newEmail: '', currentPassword: '' });
  };

  return (
    <CollapsibleSection icon={Mail} title="Correo"
      subtitle={`Actual: ${user.email ?? '—'}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <FieldLabel htmlFor="profile-new-email">Nuevo correo</FieldLabel>
          <input id="profile-new-email" type="email" inputMode="email" autoComplete="email" className="input" required
            value={form.newEmail} onChange={(event) => setForm({ ...form, newEmail: event.target.value })} />
        </div>
        {usesPassword && (
          <div>
            <FieldLabel htmlFor="profile-email-password">Contraseña actual</FieldLabel>
            <input id="profile-email-password" type="password" autoComplete="current-password" className="input" required
              value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} />
          </div>
        )}
        {!usesPassword && <p className="text-xs text-muted">Se abrirá Google para confirmar que eres tú.</p>}
        <FormError message={error} />
        {pendingEmail && (
          <p role="status" className="badge-good rounded-xl p-3 text-sm font-semibold">
            Te enviamos un enlace a {pendingEmail}. El cambio se aplica cuando lo confirmes (revisa spam).
          </p>
        )}
        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting || !form.newEmail}>
          {isSubmitting ? <><InlineSpinner /> Enviando verificación…</> : 'Cambiar correo'}
        </button>
      </form>
    </CollapsibleSection>
  );
};

const PasswordSection = () => {
  const { isSubmitting, error, submit } = useFormAction();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const usesPassword = hasPasswordProvider();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ok = await submit('profile:password', async () => {
      if (form.newPassword !== form.confirmPassword) throw new ValidationError('Las contraseñas nuevas no coinciden.');
      return changePassword(form);
    }, (result) => (result === 'linked' ? 'Contraseña creada: ya puedes ingresar también con correo.' : 'Contraseña actualizada'));
    if (ok) setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <CollapsibleSection icon={KeyRound} title={usesPassword ? 'Cambiar contraseña' : 'Crear contraseña'}
      subtitle={usesPassword ? 'Mínimo 6 caracteres.' : 'Tu cuenta usa Google. Puedes agregar una contraseña para ingresar también con correo.'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Campo oculto de usuario: ayuda a los gestores de contraseñas a asociar la credencial correcta. */}
        <input type="email" autoComplete="username" className="sr-only" tabIndex={-1} aria-hidden readOnly value="" />
        {usesPassword && (
          <div>
            <FieldLabel htmlFor="profile-current-password">Contraseña actual</FieldLabel>
            <input id="profile-current-password" type="password" autoComplete="current-password" className="input" required
              value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} />
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="profile-new-password">Nueva contraseña</FieldLabel>
            <input id="profile-new-password" type="password" autoComplete="new-password" minLength={6} className="input" required
              value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} />
          </div>
          <div>
            <FieldLabel htmlFor="profile-confirm-password">Repetir contraseña</FieldLabel>
            <input id="profile-confirm-password" type="password" autoComplete="new-password" minLength={6} className="input" required
              aria-invalid={Boolean(form.confirmPassword) && form.confirmPassword !== form.newPassword}
              value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
          </div>
        </div>
        <FormError message={error} />
        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting || !form.newPassword}>
          {isSubmitting ? <><InlineSpinner /> Actualizando contraseña…</> : usesPassword ? 'Cambiar contraseña' : 'Crear contraseña'}
        </button>
      </form>
    </CollapsibleSection>
  );
};

// Datos corporales privados (calorías y alimentación en Analíticas).
const BodyStatsSection = () => {
  const { user } = useAppData();
  return (
    <CollapsibleSection icon={Scale} title="Datos corporales"
      subtitle="Solo los ves tú. Se usan para calcular calorías.">
      {/* key: si los datos cambian desde Analíticas u otro dispositivo, el formulario se reinicia con los nuevos. */}
      <BodyStatsForm key={JSON.stringify(user.bodyStats ?? null)} uid={user.id} stats={user.bodyStats} />
    </CollapsibleSection>
  );
};

// Cerrar sesión al final de Perfil (antes estaba en el encabezado, a un toque de distancia por error).
const LogoutSection = () => {
  const { confirm } = useFeedback();
  const handleLogout = async () => {
    playClick();
    const accepted = await confirm({ title: '¿Cerrar sesión?', message: 'Tus datos quedan guardados en tu cuenta. Para volver, ingresa con tu correo o Google.', confirmLabel: 'Cerrar sesión', tone: 'danger' });
    if (accepted) logout().catch((logoutError) => logError('auth:logout', logoutError));
  };
  return (
    <button type="button" className="btn btn-danger w-full" onClick={handleLogout}>
      <LogOut size={16} aria-hidden /> Cerrar sesión
    </button>
  );
};

/*
 * Secciones plegadas por defecto (en el celular la pestaña era muy larga). Colores y sonido viven en la
 * configuración (engranaje del encabezado).
 */
export const ProfileTab = ({ onOpenSettings }) => (
  <div className="mx-auto max-w-2xl space-y-3 md:space-y-4">
    <ProfileDataSection />
    <EmailSection />
    <PasswordSection />
    <BodyStatsSection />
    {onOpenSettings && (
      <button type="button" className="card flex w-full items-center gap-2 p-4 text-left font-bold md:px-5" onClick={onOpenSettings}>
        <Settings size={18} aria-hidden /> Colores, tema y sonido
        <span className="ml-auto text-xs font-normal text-muted">Configuración</span>
      </button>
    )}
    <LogoutSection />
  </div>
);
