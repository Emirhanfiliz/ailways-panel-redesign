// LoginPage.jsx + LoginPage.css → ../05-login.html (tek dosya önizleme; logolar data URI olarak gömülür).
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

const css = readFileSync(join(here, 'LoginPage.css'), 'utf8');
const jsx = readFileSync(join(here, 'LoginPage.jsx'), 'utf8')
  .replace(/^import .*$/gm, '')
  .replace('export default function LoginPage', 'function LoginPage');

// [anahtar, ad, logo dosyası, cümledeki hali, grup]
const all = [
  ['web', 'Web sitesi', null, 'web sitende', 'store'],
  ['instagram', 'Instagram', 'kanallar/instagram.svg', 'Instagram’da', 'social'],
  ['trendyol', 'Trendyol', 'kanallar/trendyol.png', 'Trendyol’da', 'marketplace'],
  ['whatsapp', 'WhatsApp', 'kanallar/whatsapp.svg', 'WhatsApp’ta', 'social'],
  ['hepsiburada', 'Hepsiburada', 'kanallar/hepsiburada.png', 'Hepsiburada’da', 'marketplace'],
  ['telegram', 'Telegram', 'kanallar/telegram.svg', 'Telegram’da', 'social'],
  ['n11', 'n11', 'kanallar/n11.png', 'n11’de', 'marketplace'],
  ['messenger', 'Messenger', 'kanallar/messenger.svg', 'Messenger’da', 'social'],
  ['ciceksepeti', 'Çiçeksepeti', 'kanallar/ciceksepeti.png', 'Çiçeksepeti’nde', 'marketplace'],
  ['tiktok', 'TikTok', 'kanallar/tiktok.svg', 'TikTok’ta', 'social'],
  ['pazarama', 'Pazarama', 'kanallar/pazarama.png', 'Pazarama’da', 'marketplace'],
  ['ebay', 'eBay', 'kanallar/ebay.svg', 'eBay’de', 'marketplace'],
  ['idefix', 'idefix', 'kanallar/idefix.png', 'idefix’te', 'marketplace'],
  ['woocommerce', 'WooCommerce', 'kanallar/woocommerce.svg', 'WooCommerce’ta', 'store'],
  ['shopify', 'Shopify', 'kanallar/shopify.svg', 'Shopify’da', 'store'],
  ['ikas', 'ikas', 'kanallar/ikas.png', 'ikas’ta', 'store'],
  ['ticimax', 'Ticimax', 'kanallar/ticimax.svg', 'Ticimax’ta', 'store'],
  ['tsoft', 'T-Soft', 'kanallar/tsoft.png', 'T-Soft’ta', 'store'],
].map(([key, label, f, phrase, group]) => ({ key, label, phrase, group, f }));
// Logolar bir kez gömülür; sürümler yalnızca anahtar listesi taşır
const srcs = Object.fromEntries(all.filter(c => c.f).map(c => [c.key, uri(c.f)]));
const pick = keys => keys;

// Sürüm başına kanal listesi
const sets = {
  focus: pick(['web', 'instagram', 'trendyol', 'whatsapp', 'hepsiburada', 'telegram', 'n11', 'ciceksepeti', 'pazarama', 'idefix']),
  tagline: pick(['web', 'instagram', 'trendyol', 'whatsapp', 'hepsiburada', 'telegram', 'n11', 'messenger', 'ciceksepeti', 'tiktok', 'pazarama', 'ebay', 'idefix']),
  cycle: all.map(c => c.key),
  live: all.map(c => c.key),
  glow: all.map(c => c.key),
};

const html = `<title>Ailways Giriş</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap&subset=latin-ext" rel="stylesheet">
<style>
body { margin: 0; background: #fff; }
${css}
/* Yalnızca önizleme: durum değiştirici */
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
const { useEffect, useMemo, useRef, useState } = React;
${jsx}
const LOGO = ${JSON.stringify(uri('ailways-logo-64.png'))};
const SRCS = ${JSON.stringify(srcs)};
const ALL = ${JSON.stringify(all.map(({ f, ...c }) => c))};
const SETS = Object.fromEntries(Object.entries(${JSON.stringify(sets)}).map(([v, keys]) =>
  [v, keys.map(k => { const c = ALL.find(x => x.key === k); return SRCS[k] ? { ...c, src: SRCS[k] } : c; })]));
const VARIANTS = [['focus', '1 · Vurgu'], ['tagline', '2 · Yapay zeka'], ['cycle', '3 · Döngü'], ['live', '4 · Canlı sohbet'], ['glow', '5 · Işık']];
function Preview() {
  const [st, setSt] = useState('normal');
  const fromHash = location.hash.slice(1);
  const [v, setV] = useState(SETS[fromHash] ? fromHash : 'focus');
  const choose = k => { setV(k); try { history.replaceState(null, '', '#' + k); } catch (e) {} };
  return (
    <>
      <LoginPage key={v} variant={v} logo={LOGO} channels={SETS[v]} loading={st === 'loading'} error={st === 'error' ? 'E-posta ya da şifre hatalı. Tekrar dene.' : ''} onSubmit={() => setSt('loading')} />
      <div className="pv-bar">
        <div className="pv-states" role="group" aria-label="Sürüm">
          {VARIANTS.map(([k, l]) => (
            <button key={k} type="button" aria-pressed={v === k} onClick={() => choose(k)}>{l}</button>
          ))}
        </div>
        <div className="pv-states" role="group" aria-label="Form durumu">
          {[['normal', 'Normal'], ['error', 'Hata'], ['loading', 'Yükleniyor']].map(([k, l]) => (
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
