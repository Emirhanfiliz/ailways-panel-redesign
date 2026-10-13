/* Ailways · Şifre sıfırlama sayfası
   Alanlar mevcut ekranla aynı (app.ailways.com/auth/reset-password): e-posta + "Sıfırlama bağlantısı gönder", "Giriş sayfasına dön".
   Gönderildikten sonra (sent) "E-postanı kontrol et" görünümü çıkar.

   Kullanım:
     import ResetPasswordPage from './login/ResetPasswordPage';
     <ResetPasswordPage
       logo={logoUrl}
       channels={…}                         // bkz. AuthLayout
       onSubmit={({ email }) => …}
       onResend={email => …}                // "Tekrar gönder"
       sent={false}                         // istek başarılıysa true
       loginHref="/auth/login"
       loading={false}
       error=""
     />
   Sıfırlama mantığı bu bileşende yok; form verisini onSubmit'e verir. */
import { useState } from 'react';
import AuthLayout, { EMAIL_EXAMPLES, Field, useReducedMotion, useTypedPlaceholder } from './AuthLayout';

const RESET_LEDE = { before: 'Asistanın', after: 'sen olmayınca da çalışıyor.' };

const ArrowIcon = ({ back }) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {back ? <path d="M19 12H5M11 6l-6 6 6 6" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
  </svg>
);
const MailSentIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);

export default function ResetPasswordPage({
  logo,
  channels = [],
  tagline,
  onSubmit,
  onResend,
  sent = false,
  loginHref = '#',
  loading = false,
  error = '',
}) {
  const [email, setEmail] = useState('');
  const reduce = useReducedMotion();
  const emailHint = useTypedPlaceholder(EMAIL_EXAMPLES, !reduce && !sent);

  const submit = e => {
    e.preventDefault();
    if (!loading) onSubmit?.({ email });
  };

  return (
    <AuthLayout logo={logo} channels={channels} tagline={tagline} lede={RESET_LEDE}>
      {sent ? (
        <div className="alw-sent alw-reveal" role="status">
          <span className="alw-sent-icon"><MailSentIcon /></span>
          <h2 className="alw-subhead">E-postanı kontrol et</h2>
          <p className="alw-subtext">
            {email ? <><b>{email}</b> adresine</> : 'E-posta adresine'} şifre sıfırlama bağlantısı gönderdik.
            Gelmediyse spam klasörüne de bak.
          </p>
          <button type="button" className="alw-btn-ghost alw-sent-btn" onClick={() => onResend?.(email)}>Tekrar gönder</button>
        </div>
      ) : (
        <>
          <h2 className="alw-subhead">Şifre sıfırla</h2>
          <p className="alw-subtext">E-posta adresine şifre sıfırlama bağlantısı göndereceğiz.</p>

          {error && <p className="alw-alert" role="alert">{error}</p>}

          <form className="alw-form is-compact" onSubmit={submit} noValidate aria-label="Şifre sıfırlama">
            <Field id="alw-email" label="E-posta" icon="mail" invalid={!!error}>
              <input
                id="alw-email" type="email" autoComplete="email" inputMode="email" required
                placeholder={emailHint}
                value={email} onChange={e => setEmail(e.target.value)}
                aria-invalid={error ? true : undefined}
              />
            </Field>

            <button type="submit" className="alw-btn" disabled={loading} aria-busy={loading || undefined}>
              {loading && <span className="alw-spin" aria-hidden="true" />}
              {loading ? 'Gönderiliyor' : <>Sıfırlama bağlantısı gönder<ArrowIcon /></>}
            </button>
          </form>
        </>
      )}

      <p className="alw-switch"><a href={loginHref} className="alw-link alw-back"><ArrowIcon back />Giriş sayfasına dön</a></p>
    </AuthLayout>
  );
}
