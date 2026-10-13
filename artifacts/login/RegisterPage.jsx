/* Ailways · Kayıt sayfası
   Alanlar mevcut kayıt ekranıyla aynı (app.ailways.com/auth/register):
   ad soyad, e-posta, telefon + doğrulama kodu, şifre, şifre tekrar,
   KVKK / gizlilik / çerez onayı ve yurt dışına veri aktarımı açık rızası.
   Belge bağlantıları önce pencerede (modal) açılır; penceredeki "Sayfada aç" belgenin kendi sayfasına götürür.

   Kullanım:
     import RegisterPage from './login/RegisterPage';
     <RegisterPage
       logo={logoUrl}
       channels={…}                                   // bkz. AuthLayout
       onSendCode={phone => …}                         // "Kod gönder"e basılınca
       onSubmit={({ name, email, phone, code, password, passwordAgain, consentTerms, consentTransfer }) => …}
       loginHref="/auth/login"
       legalDocs={{ kvkk: { content: <KvkkText /> }, … }}   // pencerede gösterilecek metin; başlık ve adres varsayılanları aşağıda
       loading={false}
       error=""
     />
   Kayıt mantığı ve doğrulama bu bileşende yok; form verisini onSubmit'e verir. */
import { useCallback, useEffect, useRef, useState } from 'react';
import AuthLayout, { EMAIL_EXAMPLES, Field, PasswordField, useReducedMotion, useTypedPlaceholder } from './AuthLayout';

const REGISTER_LEDE = { lead: 'Hesabını aç,', before: 'asistanın', after: 'müşterilerini karşılasın.' };

// Belgeler: pencere başlığı ve "Sayfada aç" adresi. content (JSX) ya da blocks ([['h2'|'p'|'li'|'tr', metin], …]) ile metin verilir.
const DEFAULT_DOCS = {
  kvkk: { title: 'KVKK Aydınlatma Metni', href: '/kvkk/aydinlatma-metni' },
  privacy: { title: 'Gizlilik Politikası', href: '/privacy' },
  cookies: { title: 'Çerez Politikası', href: '/kvkk/cerez-politikasi' },
  transfer: { title: 'Yurt Dışına Veri Aktarımı Bilgilendirmesi', href: '/kvkk/yurt-disi-veri-aktarimi' },
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
);
const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" /></svg>
);

/* blocks → başlık, paragraf, madde ve tablo satırları; ardışık maddeler tek listede */
function DocBody({ blocks }) {
  const out = [];
  blocks.forEach(([t, txt], i) => {
    if (t === 'li') {
      const last = out[out.length - 1];
      if (last && last.type === 'ul') last.items.push(txt); else out.push({ type: 'ul', items: [txt], key: i });
    } else out.push({ type: t, txt, key: i });
  });
  return out.map(b =>
    b.type === 'ul' ? <ul key={b.key}>{b.items.map((x, j) => <li key={j}>{x}</li>)}</ul>
    : b.type === 'h2' || b.type === 'h3' || b.type === 'h4' ? <h3 key={b.key}>{b.txt}</h3>
    : b.type === 'tr' ? <p key={b.key} className="alw-doc-row">{b.txt}</p>
    : <p key={b.key}>{b.txt}</p>
  );
}

// Onay metnindeki belge adı: tıklayınca pencere açılır (onay kutusunu değiştirmez)
const Doc = ({ k, onOpen, children }) => (
  <button type="button" className="alw-doclink" onClick={e => { e.preventDefault(); onOpen(k); }}>{children}</button>
);

function LegalModal({ doc, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="alw-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="alw-modal" role="dialog" aria-modal="true" aria-labelledby="alw-modal-title">
        <header className="alw-modal-head">
          <h2 id="alw-modal-title">{doc.title}</h2>
          <button ref={closeRef} type="button" className="alw-modal-x" onClick={onClose} aria-label="Kapat"><CloseIcon /></button>
        </header>
        <div className="alw-modal-body">
          {doc.content || (doc.blocks?.length ? <DocBody blocks={doc.blocks} /> : <p>Metnin tamamını sayfasında okuyabilirsin.</p>)}
        </div>
        <footer className="alw-modal-foot">
          <button type="button" className="alw-btn-ghost" onClick={onClose}>Kapat</button>
          <a href={doc.href} className="alw-btn is-link" target="_blank" rel="noopener noreferrer">Sayfada aç<ExternalIcon /></a>
        </footer>
      </div>
    </div>
  );
}

export default function RegisterPage({
  logo,
  channels = [],
  tagline,
  onSendCode,
  onSubmit,
  loginHref,
  legalDocs = {},
  loading = false,
  error = '',
}) {
  const [f, setF] = useState({ name: '', email: '', phone: '', code: '', password: '', passwordAgain: '', consentTerms: false, consentTransfer: false });
  const [codeSent, setCodeSent] = useState(false);
  const [openDoc, setOpenDoc] = useState(null);
  const closeDoc = useCallback(() => setOpenDoc(null), []);
  const reduce = useReducedMotion();
  const emailHint = useTypedPlaceholder(EMAIL_EXAMPLES, !reduce);
  const set = k => e => setF(v => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const docs = Object.fromEntries(Object.entries(DEFAULT_DOCS).map(([k, d]) => [k, { ...d, ...legalDocs[k] }]));

  const sendCode = () => {
    onSendCode?.(f.phone);
    setCodeSent(true);
  };
  const submit = e => {
    e.preventDefault();
    if (!loading) onSubmit?.(f);
  };

  return (
    <AuthLayout logo={logo} channels={channels} tagline={tagline} lede={REGISTER_LEDE}>
      {error && <p className="alw-alert" role="alert">{error}</p>}

      <form className="alw-form is-register" onSubmit={submit} noValidate aria-label="Kayıt">
        <Field id="alw-name" label="Ad soyad" icon="user">
          <input id="alw-name" type="text" autoComplete="name" required value={f.name} onChange={set('name')} />
        </Field>

        <Field id="alw-email" label="E-posta" icon="mail">
          <input id="alw-email" type="email" autoComplete="email" inputMode="email" required placeholder={emailHint} value={f.email} onChange={set('email')} />
        </Field>

        <Field
          id="alw-phone" label="Telefon" icon="phone"
          trailing={<button type="button" className="alw-box-btn" onClick={sendCode}>{codeSent ? 'Tekrar gönder' : 'Kod gönder'}</button>}
        >
          <input id="alw-phone" type="tel" autoComplete="tel" inputMode="tel" required placeholder="05XX XXX XX XX" value={f.phone} onChange={set('phone')} />
        </Field>

        {codeSent && (
          <div className="alw-reveal">
            <Field id="alw-code" label="Doğrulama kodu" icon="key">
              <input id="alw-code" type="text" autoComplete="one-time-code" inputMode="numeric" maxLength={6} placeholder="Telefonuna gelen 6 haneli kod" required value={f.code} onChange={set('code')} />
            </Field>
          </div>
        )}

        <PasswordField id="alw-password" autoComplete="new-password" value={f.password} onChange={set('password')} />
        <PasswordField id="alw-password-2" label="Şifre tekrar" autoComplete="new-password" value={f.passwordAgain} onChange={set('passwordAgain')} />

        <div className="alw-consents">
          <label className="alw-consent">
            <input type="checkbox" checked={f.consentTerms} onChange={set('consentTerms')} />
            <span>
              <Doc k="kvkk" onOpen={setOpenDoc}>KVKK Aydınlatma Metni</Doc>’ni okudum, <Doc k="privacy" onOpen={setOpenDoc}>Gizlilik Politikası</Doc>’nı ve{' '}
              <Doc k="cookies" onOpen={setOpenDoc}>Çerez Politikası</Doc>’nı kabul ediyorum.
            </span>
          </label>
          <label className="alw-consent">
            <input type="checkbox" checked={f.consentTransfer} onChange={set('consentTransfer')} />
            <span>
              Kişisel verilerimin <Doc k="transfer" onOpen={setOpenDoc}>Yurt Dışına Veri Aktarımı Bilgilendirmesi</Doc>’nde belirtilen
              yurt dışındaki hizmet sağlayıcılara aktarılmasına açık rızam ile onay veriyorum.
            </span>
          </label>
        </div>

        <button type="submit" className="alw-btn" disabled={loading} aria-busy={loading || undefined}>
          {loading && <span className="alw-spin" aria-hidden="true" />}
          {loading ? 'Hesap oluşturuluyor' : 'Hesap oluştur'}
        </button>
      </form>

      {loginHref && (
        <p className="alw-switch">Zaten hesabın var mı? <a href={loginHref} className="alw-link">Giriş yap</a></p>
      )}

      {openDoc && <LegalModal doc={docs[openDoc]} onClose={closeDoc} />}
    </AuthLayout>
  );
}
