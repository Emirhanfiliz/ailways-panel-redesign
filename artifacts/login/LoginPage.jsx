/* Ailways · Giriş sayfası
   Kullanım:
     import LoginPage from './login/LoginPage';
     <LoginPage
       logo={logoUrl}
       channels={[{ label: 'Trendyol', src: trendyolUrl, phrase: 'Trendyol’da' }, …]}   // bkz. AuthLayout
       onSubmit={({ email, password, remember }) => …}
       forgotHref="/auth/forgot-password"
       registerHref="/auth/register"   // verilmezse "Hesabın yok mu?" satırı çıkmaz
       loading={false}
       error="E-posta ya da şifre hatalı."
     />
   Giriş mantığı bu bileşende yok; form verisini onSubmit'e verir. */
import { useState } from 'react';
import AuthLayout, { EMAIL_EXAMPLES, Field, PasswordField, useReducedMotion, useTypedPlaceholder } from './AuthLayout';

export default function LoginPage({
  logo,
  channels = [],
  tagline,
  onSubmit,
  forgotHref = '#',
  registerHref,
  loading = false,
  error = '',
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const reduce = useReducedMotion();
  const emailHint = useTypedPlaceholder(EMAIL_EXAMPLES, !reduce);

  const submit = e => {
    e.preventDefault();
    if (!loading) onSubmit?.({ email, password, remember });
  };

  return (
    <AuthLayout logo={logo} channels={channels} tagline={tagline}>
      {error && <p className="alw-alert" role="alert">{error}</p>}

      <form className="alw-form" onSubmit={submit} noValidate aria-label="Giriş">
        <Field id="alw-email" label="E-posta" icon="mail" invalid={!!error}>
          <input
            id="alw-email" type="email" autoComplete="email" inputMode="email" required
            placeholder={emailHint}
            value={email} onChange={e => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
          />
        </Field>

        <PasswordField id="alw-password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} invalid={!!error} />

        <div className="alw-row">
          <label className="alw-check">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Beni hatırla
          </label>
          <a href={forgotHref} className="alw-link">Şifremi unuttum</a>
        </div>

        <button type="submit" className="alw-btn" disabled={loading} aria-busy={loading || undefined}>
          {loading && <span className="alw-spin" aria-hidden="true" />}
          {loading ? 'Giriş yapılıyor' : 'Giriş yap'}
        </button>
      </form>

      {registerHref && (
        <p className="alw-switch">Hesabın yok mu? <a href={registerHref} className="alw-link">Kayıt ol</a></p>
      )}
    </AuthLayout>
  );
}
