/* Ailways · Giriş ve kayıt sayfalarının ortak iskeleti
   Yalnızca React'a bağlı; stiller Auth.css içinde, hepsi .alw-login altında (projedeki diğer stillere taşmaz).
   Fontlar: projede Manrope (600–800), IBM Plex Sans (400–600) ve logo yazısı için Outfit (300) yüklü olmalı.

   Sol: "Asistanın [kanal] müşterilerine cevap veriyor." + kanal yörüngesi. Cümlede adı geçen kanal yörüngede büyür,
        merkeze çizgiyle bağlanır; merkezde Ailways logosu ile "Yapay zeka, gerçek satış" sırayla yer değiştirir.
   Sağ: büyük Ailways logosu + sayfanın formu (children); arkada yavaşça kayan mavi ışık.
   lede: soldaki cümle, { lead?, before: 'Asistanın', after: 'müşterilerine cevap veriyor.' } — dönen kanal before'un ardından gelir;
         lead verilirse en üstte ayrı bir satır olur (uzun kanal adlarında ilk satır taşmasın diye).
   Field / PasswordField: iki sayfanın ortak form alanları.

   channels: [{ label: 'Trendyol', src: trendyolUrl, phrase: 'Trendyol’da' }, { label: 'Web sitesi', phrase: 'web sitende' }, …]
     src yoksa mark (ör. 'CS') harfleri, o da yoksa küre ikonu; phrase olan kanallar sırayla cümlede döner ve yörüngede vurgulanır. */
import { useEffect, useMemo, useRef, useState } from 'react';
import './Auth.css';

const ROT_INTERVAL = 2400;   // kanal başına süre
const SWAP_INTERVAL = 3200;  // merkez: logo ↔ yazı
const DEFAULT_TAGLINE = ['Yapay zeka', 'gerçek satış'];
export const EMAIL_EXAMPLES = ['ornek@magazan.com', 'destek@butigin.com', 'siparis@markan.com.tr'];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function useReducedMotion() {
  return useMemo(prefersReducedMotion, []);
}

/* E-posta alanının örnek metni harf harf yazılır, bekler, silinir; sıradaki örneğe geçer */
export function useTypedPlaceholder(texts, enabled) {
  const [txt, setTxt] = useState(texts[0]);
  useEffect(() => {
    if (!enabled) { setTxt(texts[0]); return; }
    let i = 0, n = 0, dir = 1, t;
    const step = () => {
      const full = texts[i];
      n += dir;
      setTxt(full.slice(0, n));
      if (dir === 1 && n === full.length) { dir = -1; t = setTimeout(step, 1800); return; }
      if (dir === -1 && n === 0) { dir = 1; i = (i + 1) % texts.length; t = setTimeout(step, 350); return; }
      t = setTimeout(step, dir === 1 ? 75 : 32);
    };
    setTxt('');
    t = setTimeout(step, 700);
    return () => clearTimeout(t);
  }, [texts, enabled]);
  return txt;
}

/* React Bits RotatingText'ten uyarlandı (panel ana sayfasındakiyle aynı): harfler CSS animasyonuyla aşağıdan gelir.
   Sıra dışarıdan (idx) gelir; böylece yörüngedeki vurgu ile aynı anda değişir. */
function RotatingText({ texts, idx, stagger = 0.018 }) {
  const rotated = useRef(false);
  const first = useRef(idx);
  if (idx !== first.current) rotated.current = true;
  const split = t => (typeof Intl !== 'undefined' && Intl.Segmenter)
    ? Array.from(new Intl.Segmenter('tr', { granularity: 'grapheme' }).segment(t), x => x.segment)
    : Array.from(t);
  const words = useMemo(
    () => texts[idx].split(' ').map((w, i, arr) => ({ chars: split(w), space: i !== arr.length - 1 })),
    [texts, idx]
  );
  let n = 0;
  return (
    <span className="alw-rt">
      <span className="alw-sr">{texts[idx]}</span>
      <span key={idx} className="alw-rt" aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi} className="alw-rt-word">
            {w.chars.map((ch, ci) => (
              <span
                key={ci}
                className={`alw-rt-char${rotated.current ? ' is-in' : ''}`}
                style={rotated.current ? { animationDelay: `${(n++) * stagger}s` } : undefined}
              >{ch}</span>
            ))}
            {w.space && <span style={{ whiteSpace: 'pre' }}> </span>}
          </span>
        ))}
      </span>
    </span>
  );
}

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </svg>
);

const orbitPos = (i, n) => {
  const a = (i / n) * 2 * Math.PI - Math.PI / 2;
  return { x: 50 + 38 * Math.cos(a), y: 50 + 38 * Math.sin(a) };
};
// Kanal sayısı arttıkça düğümler küçülür, birbirine değmez
const nodeSize = n => `${Math.min(13.5, 180 / Math.max(n, 1))}%`;

/* Ana sayfadaki kanal yörüngesi; framer-motion yerine saf CSS dönüşü.
   active: cümlede adı geçen kanal; büyür, mavi halka alır ve merkeze ince bir çizgiyle bağlanır. */
function ChannelOrbit({ channels, active, core }) {
  const target = active >= 0 ? orbitPos(active, channels.length) : null;
  return (
    <div className="alw-orbit" style={{ '--alw-node': nodeSize(channels.length) }} aria-hidden="true">
      <span className="alw-orbit-ring" />
      <span className="alw-orbit-ring is-inner" />
      <div className="alw-orbit-spin">
        {target && (
          <svg key={active} className="alw-orbit-link" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="50" y1="50" x2={target.x} y2={target.y} pathLength="1" />
          </svg>
        )}
        {channels.map((c, i) => {
          const p = orbitPos(i, channels.length);
          return (
            <span key={c.label} className={`alw-orbit-node${i === active ? ' is-active' : ''}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} title={c.label}>
              <span className="alw-orbit-face">{c.src ? <img src={c.src} alt="" /> : c.mark ? <b className="alw-orbit-mark">{c.mark}</b> : <GlobeIcon />}</span>
            </span>
          );
        })}
      </div>
      {core}
    </div>
  );
}

/* Merkez: Ailways logosu ile "Yapay zeka, gerçek satış" sırayla yer değiştirir; yazı harf harf gelir. */
function OrbitCore({ logo, tagline, reduce }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick(t => t + 1), SWAP_INTERVAL);
    return () => clearInterval(id);
  }, [reduce]);
  const showText = tick % 2 === 1;
  let n = 0;
  const chars = t => Array.from(t).map((ch, i) => (
    <span key={i} className="alw-rt-char is-in" style={{ animationDelay: `${(n++) * 0.03}s` }}>{ch === ' ' ? ' ' : ch}</span>
  ));
  return (
    <div className="alw-orbit-core">
      {logo && <img className={`alw-core-logo${showText ? ' is-out' : ''}`} src={logo} alt="" />}
      <span key={tick} className={`alw-core-text${showText ? ' is-on' : ''}`}>
        <span className="alw-core-line">{showText && chars(tagline[0])}</span>
        <span className="alw-core-line is-accent">{showText && chars(tagline[1])}</span>
      </span>
    </div>
  );
}

/* Form alanı: solda simge, etiket alanın içinde üstte küçük; sağda isteğe bağlı düğme (şifre göster, kod gönder) */
const ICONS = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></>,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />,
  lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l2 2M15 8l2 2" /></>,
};

export function Field({ id, label, icon, invalid, trailing, children }) {
  return (
    <div className={`alw-box${invalid ? ' is-invalid' : ''}`}>
      {icon && (
        <svg className="alw-box-icon" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {ICONS[icon]}
        </svg>
      )}
      <div className="alw-box-main">
        <label htmlFor={id}>{label}</label>
        {children}
      </div>
      {trailing}
    </div>
  );
}

export const EyeIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);

/* Şifre alanı: göster / gizle düğmesiyle */
export function PasswordField({ id, label = 'Şifre', value, onChange, autoComplete, invalid }) {
  const [show, setShow] = useState(false);
  return (
    <Field
      id={id} label={label} icon="lock" invalid={invalid}
      trailing={
        <button type="button" className="alw-box-btn is-icon" onClick={() => setShow(v => !v)} aria-label={show ? 'Şifreyi gizle' : 'Şifreyi göster'} aria-pressed={show}>
          <EyeIcon off={show} />
        </button>
      }
    >
      <input id={id} type={show ? 'text' : 'password'} autoComplete={autoComplete} required value={value} onChange={onChange} aria-invalid={invalid || undefined} />
    </Field>
  );
}

/* lede: soldaki cümle; ilk satır + dönen kanal, ikinci satır */
const DEFAULT_LEDE = { before: 'Asistanın', after: 'müşterilerine cevap veriyor.' };

export default function AuthLayout({ logo, channels = [], tagline = DEFAULT_TAGLINE, lede = DEFAULT_LEDE, children }) {
  const reduce = useReducedMotion();

  // Cümlede dönen kanal ve yörüngedeki vurgu aynı sırayı izler
  const spoken = useMemo(() => channels.map((c, i) => ({ i, phrase: c.phrase })).filter(c => c.phrase), [channels]);
  const [turn, setTurn] = useState(0);
  useEffect(() => {
    if (reduce || spoken.length < 2) return;
    const id = setInterval(() => setTurn(t => (t + 1) % spoken.length), ROT_INTERVAL);
    return () => clearInterval(id);
  }, [reduce, spoken.length]);
  const idx = turn % (spoken.length || 1);
  const current = spoken[idx];
  const phrases = spoken.map(c => c.phrase);

  return (
    <div className="alw-login">
      <aside className="alw-login-hero" aria-label="Ailways">
        <div className={`alw-hero-inner${lede.lead ? ' has-lead' : ''}`}>
          <p className="alw-lede">
            {lede.lead && <span className="alw-lede-line">{lede.lead}</span>}
            <span className="alw-lede-line">
              {lede.before}{' '}
              {current && (
                <span className="alw-pill">
                  {reduce ? current.phrase : <RotatingText texts={phrases} idx={idx} />}
                </span>
              )}
            </span>
            <span className="alw-lede-line">{lede.after}</span>
          </p>
          {channels.length > 0 && (
            <ChannelOrbit
              channels={channels}
              active={current ? current.i : -1}
              core={<OrbitCore logo={logo} tagline={tagline} reduce={reduce} />}
            />
          )}
        </div>
      </aside>

      <main className="alw-login-form-side">
        <div className="alw-form-wrap">
          <h1 className="alw-brand">
            {logo && <img src={logo} alt="" />}
            <span>Ailways</span>
          </h1>
          {children}
        </div>
        <p className="alw-foot">© {new Date().getFullYear()} Ailways</p>
      </main>
    </div>
  );
}
