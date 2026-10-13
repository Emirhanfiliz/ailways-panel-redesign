// AuthLayout.jsx + LoginPage.jsx + RegisterPage.jsx + ResetPasswordPage.jsx + Auth.css → ../05-login.html
// Tek dosya önizleme: giriş, kayıt ve şifre sıfırlama aynı sayfada, sol alttaki düğmelerle geçilir; logolar data URI olarak bir kez gömülür.
// Çalıştır: node artifacts/login/build-preview.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const marka = join(here, '..', '..', 'docs', 'marka');
const uri = file => {
  const buf = readFileSync(join(marka, file));
  const type = file.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  return `data:${type};base64,${buf.toString('base64')}`;
};

const css = readFileSync(join(here, 'Auth.css'), 'utf8');
const strip = src => src
  .replace(/^import .*$/gm, '')
  .replace(/^export default function /gm, 'function ')
  .replace(/^export /gm, '');
const jsx = ['AuthLayout.jsx', 'LoginPage.jsx', 'RegisterPage.jsx', 'ResetPasswordPage.jsx']
  .map(f => `/* ---- ${f} ---- */\n` + strip(readFileSync(join(here, f), 'utf8')))
  .join('\n');

// Sol taraf: 2. sürümdeki 13 kanal
const channels = [
  ['Web sitesi', null, 'web sitende'],
  ['Instagram', 'kanallar/instagram.svg', 'Instagram’da'],
  ['Trendyol', 'kanallar/trendyol.png', 'Trendyol’da'],
  ['WhatsApp', 'kanallar/whatsapp.svg', 'WhatsApp’ta'],
  ['Hepsiburada', 'kanallar/hepsiburada.png', 'Hepsiburada’da'],
  ['Telegram', 'kanallar/telegram.svg', 'Telegram’da'],
  ['n11', 'kanallar/n11.png', 'n11’de'],
  ['Messenger', 'kanallar/messenger.svg', 'Messenger’da'],
  ['Çiçeksepeti', 'kanallar/ciceksepeti.png', 'Çiçeksepeti’nde'],
  ['TikTok', 'kanallar/tiktok.svg', 'TikTok’ta'],
  ['Pazarama', 'kanallar/pazarama.png', 'Pazarama’da'],
  ['eBay', 'kanallar/ebay.svg', 'eBay’de'],
  ['idefix', 'kanallar/idefix.png', 'idefix’te'],
].map(([label, f, phrase]) => (f ? { label, src: uri(f), phrase } : { label, phrase }));

// Belge pencereleri için metinler: app.ailways.com'daki dört sayfadan çıkarıldı (legal-preview.json)
const legalRaw = JSON.parse(readFileSync(join(here, 'legal-preview.json'), 'utf8'));
const legalDocs = {
  kvkk: { href: 'https://app.ailways.com/kvkk/aydinlatma-metni', blocks: legalRaw['kvkk_aydinlatma-metni'].blocks },
  privacy: { href: 'https://app.ailways.com/privacy', blocks: legalRaw['privacy'].blocks },
  cookies: { href: 'https://app.ailways.com/kvkk/cerez-politikasi', blocks: legalRaw['kvkk_cerez-politikasi'].blocks },
  transfer: { href: 'https://app.ailways.com/kvkk/yurt-disi-veri-aktarimi', blocks: legalRaw['kvkk_yurt-disi-veri-aktarimi'].blocks },
};

const html = `<title>Ailways Giriş</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap&subset=latin-ext" rel="stylesheet">
<style>
body { margin: 0; background: #fff; }
${css}
/* Yalnızca önizleme: sayfa ve durum değiştirici */
.pv-bar { position: fixed; left: 16px; bottom: 16px; z-index: 10; display: flex; gap: 8px; flex-wrap: wrap; }
.pv-states { display: inline-flex; gap: 2px; padding: 4px; border-radius: 12px; background: #F1F5F8; box-shadow: 0 1px 3px rgba(15,30,42,.12); font: 12.5px "IBM Plex Sans", system-ui, sans-serif; }
.pv-states button { border: 0; background: none; border-radius: 9px; padding: 6px 11px; cursor: pointer; color: #4F6170; font: inherit; }
.pv-states button[aria-pressed="true"] { background: #fff; color: #0F1F2C; font-weight: 600; box-shadow: 0 1px 2px rgba(15,30,42,.1); }
</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.4/babel.min.js"></script>
<script type="text/babel" data-presets="react">
const { useCallback, useEffect, useMemo, useRef, useState } = React;
${jsx}
const LOGO = ${JSON.stringify(uri('ailways-logo-256.png'))};
const CHANNELS = ${JSON.stringify(channels)};
const LEGAL_DOCS = ${JSON.stringify(legalDocs)};
const pageFromHash = () => (location.hash.startsWith('#register') ? 'register' : location.hash.startsWith('#reset') ? 'reset' : 'login');
function Preview() {
  const [page, setPage] = useState(pageFromHash);
  const [st, setSt] = useState('normal');
  useEffect(() => {
    const on = () => setPage(pageFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = p => { location.hash = p; setSt('normal'); };
  // Yalnızca önizleme: #register-doc adresi açılışta ilk belge penceresini açar
  useEffect(() => {
    if (location.hash === '#reset-sent') setSt('sent');
    if (location.hash === '#register-doc') setTimeout(() => document.querySelector('.alw-doclink')?.click(), 300);
  }, []);
  const common = { logo: LOGO, channels: CHANNELS, loading: st === 'loading', onSubmit: () => setSt('loading') };
  return (
    <>
      {page === 'login'
        ? <LoginPage {...common} registerHref="#register" forgotHref="#reset" error={st === 'error' ? 'E-posta ya da şifre hatalı. Tekrar dene.' : ''} />
        : page === 'register'
        ? <RegisterPage {...common} loginHref="#login" legalDocs={LEGAL_DOCS} error={st === 'error' ? 'Bu e-posta adresiyle zaten bir hesap var.' : ''} />
        : <ResetPasswordPage {...common} loginHref="#login" onSubmit={() => setSt('sent')} sent={st === 'sent'} error={st === 'error' ? 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.' : ''} />}
      <div className="pv-bar">
        <div className="pv-states" role="group" aria-label="Sayfa">
          {[['login', 'Giriş'], ['register', 'Kayıt'], ['reset', 'Şifre sıfırla']].map(([k, l]) => (
            <button key={k} type="button" aria-pressed={page === k} onClick={() => go(k)}>{l}</button>
          ))}
        </div>
        <div className="pv-states" role="group" aria-label="Form durumu">
          {[['normal', 'Normal'], ['error', 'Hata'], ['loading', 'Yükleniyor'], ...(page === 'reset' ? [['sent', 'Gönderildi']] : [])].map(([k, l]) => (
            <button key={k} type="button" aria-pressed={st === k} onClick={() => setSt(k)}>{l}</button>
          ))}
        </div>
      </div>
    </>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<Preview />);
</script>
`;
writeFileSync(join(here, '..', '05-login.html'), html);
console.log('05-login.html yazıldı', (html.length / 1024).toFixed(0) + ' KB');
