/* Ailways · Giriş sayfası
   Yalnızca React'a bağlı; stiller LoginPage.css içinde, hepsi .alw-login altında (projedeki diğer stillere taşmaz).
   Fontlar: projede Manrope (600–800) ve IBM Plex Sans (400–600) yüklü olmalı.

   Kullanım:
     import LoginPage from './login/LoginPage';
     <LoginPage
       variant="focus"   // 'focus' | 'tagline' | 'cycle' | 'live' | 'glow' (aşağıda)
       logo={logoUrl}
       channels={[{ label: 'Trendyol', src: trendyolUrl, phrase: 'Trendyol’da', group: 'marketplace' }, { label: 'Web sitesi', phrase: 'web sitende', group: 'store' }, …]}
         // src yoksa küre ikonu; phrase olan kanallar sırayla cümlede döner ve yörüngede vurgulanır
         // group: 'social' | 'marketplace' | 'store' (yalnızca 'cycle' ve 'live' sürümleri kullanır)
       onSubmit={({ email, password, remember }) => …}
       forgotHref="/sifremi-unuttum"
       loading={false}
       error="E-posta ya da şifre hatalı."
     />
   Giriş mantığı bu bileşende yok; form verisini onSubmit'e verir.

   Sürümler (sol taraftaki kanal yörüngesi):
     focus   — cümlede adı geçen kanal yörüngede büyür, merkeze çizgiyle bağlanır.
     tagline — focus + merkezde Ailways logosu ile "Yapay zeka, gerçek satış" yazısı sırayla yer değiştirir.
     cycle   — kanallar gruplar halinde döner: sosyal medya → pazar yerleri → e-ticaret siteleri.
               Her grup hızlıca iki tur döner ve merkeze girer; logo büyüyüp biraz küçülür, yerini
               "Yapay zeka, gerçek satış" yazısına bırakır, sonra geri gelir ve sonraki grup merkezden çıkar.
     live    — cycle + formun altında o anki gruptan bir kanalda müşteri sorusu ve asistanın cevabı.
     glow    — cycle + sağ tarafta ortam: formun arkasında yavaşça kayan mavi ışık, e-posta alanında
               yazılıp silinen örnek adresler, butonda ara ara geçen parıltı. */
import { useEffect, useMemo, useRef, useState } from 'react';
import './LoginPage.css';

const ROT_INTERVAL = 2400;   // focus/tagline: kanal başına süre
const SWAP_INTERVAL = 3200;  // tagline: logo ↔ yazı
// cycle zamanlaması (ms): çıkış + tur + giriş → logo nabzı → yazı → logo geri
const TURNS = 1;             // grup başına tur sayısı
const SPIN_MS = 3400;        // dönüş süresi (çıkış ve giriş bu sürenin içinde)
const MOVE_MS = 650;         // merkezden çıkma / merkeze girme
const PULSE_MS = 650;        // logo büyür, biraz küçülür
const TEXT_MS = 2200;        // "Yapay zeka, gerçek satış"
const BACK_MS = 450;         // logo geri gelir

const DEFAULT_TAGLINE = ['Yapay zeka', 'gerçek satış'];
const EMAIL_EXAMPLES = ['ornek@magazan.com', 'destek@butigin.com', 'siparis@markan.com.tr'];

// live: grup başına örnek müşteri sorusu ve asistan cevabı (sırayla)
const DEFAULT_CHATS = {
  social: [
    { q: 'Bu elbisenin M bedeni kaldı mı?', a: 'Evet, M bedeni stokta. İstersen hemen sepetine ekleyeyim.' },
    { q: 'Siyah rengi ne zaman gelir?', a: 'Perşembe stoğa giriyor. Gelince sana haber vereyim mi?' },
  ],
  marketplace: [
    { q: 'Siparişim ne zaman kargoya verilir?', a: 'Siparişin bugün kargoya veriliyor, takip numarası SMS ile gelecek.' },
    { q: 'Ürün orijinal ve faturalı mı?', a: 'Evet, ürün orijinal ve faturasıyla birlikte gönderiliyor.' },
  ],
  store: [
    { q: 'İade süresi kaç gün?', a: 'Teslimattan sonra 14 gün içinde ücretsiz iade edebilirsin.' },
    { q: 'Kapıda ödeme var mı?', a: 'Evet, kapıda nakit ya da kartla ödeyebilirsin.' },
  ],
};

const GROUPS = [
  { key: 'social', phrase: 'sosyal medyada' },
  { key: 'marketplace', phrase: 'pazar yerlerinde' },
  { key: 'store', phrase: 'e-ticaret sitende' },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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

/* Ana sayfadaki kanal yörüngesi; framer-motion yerine saf CSS dönüşü.
   active: cümlede adı geçen kanal; büyür, mavi halka alır ve merkeze ince bir çizgiyle bağlanır. */
const orbitPos = (i, n) => {
  const a = (i / n) * 2 * Math.PI - Math.PI / 2;
  return { x: 50 + 38 * Math.cos(a), y: 50 + 38 * Math.sin(a) };
};
// Kanal sayısı arttıkça düğümler küçülür, birbirine değmez
const nodeSize = n => `${Math.min(13.5, 150 / Math.max(n, 1))}%`;

const ChannelFace = ({ c }) => (
  <span className="alw-orbit-face">{c.src ? <img src={c.src} alt="" /> : <GlobeIcon />}</span>
);

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
              <ChannelFace c={c} />
            </span>
          );
        })}
      </div>
      {core}
    </div>
  );
}

/* cycle: yörüngede tek grup; open=false iken düğümler merkezde ve görünmez.
   Dönüş her grupta baştan başlar (key) ve iki tur sürer; düğümler başta merkezden çıkar, sonda merkeze girer. */
function CycleOrbit({ channels, open, cycleKey, reduce, core }) {
  return (
    <div
      className={`alw-orbit is-cycle${reduce ? ' is-still' : ''}`}
      style={{ '--alw-node': nodeSize(channels.length), '--alw-cycle': `${SPIN_MS}ms`, '--alw-turn': `${TURNS * 360}deg`, '--alw-move': `${MOVE_MS}ms` }}
      aria-hidden="true"
    >
      <span className="alw-orbit-ring" />
      <span className="alw-orbit-ring is-inner" />
      <div key={cycleKey} className="alw-orbit-spin">
        {channels.map((c, i) => {
          const p = open ? orbitPos(i, channels.length) : { x: 50, y: 50 };
          return (
            <span key={c.label} className={`alw-orbit-node${open ? '' : ' is-closed'}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} title={c.label}>
              <ChannelFace c={c} />
            </span>
          );
        })}
      </div>
      {core}
    </div>
  );
}

/* Merkez: logo. Logo ile "Yapay zeka, gerçek satış" yer değiştirir; yazı harf harf gelir.
   tagline sürümünde kendi sayacıyla; cycle/live sürümünde mode dışarıdan gelir ('logo' | 'pulse' | 'text'). */
function OrbitCore({ logo, tagline, reduce, mode, textKey }) {
  const [tick, setTick] = useState(0);
  const swaps = !!tagline && !reduce && !mode;
  useEffect(() => {
    if (!swaps) return;
    const id = setInterval(() => setTick(t => t + 1), SWAP_INTERVAL);
    return () => clearInterval(id);
  }, [swaps]);
  const showText = !!tagline && (mode ? mode === 'text' : tick % 2 === 1);
  let n = 0;
  const chars = t => Array.from(t).map((ch, i) => (
    <span key={i} className="alw-rt-char is-in" style={{ animationDelay: `${(n++) * 0.03}s` }}>{ch === ' ' ? '\u00A0' : ch}</span>
  ));
  const logoState = showText ? ' is-out' : mode === 'pulse' ? ' is-pulse' : '';
  return (
    <div className="alw-orbit-core">
      {logo && <img className={`alw-core-logo${logoState}`} src={logo} alt="" />}
      {tagline && (
        <span key={mode ? textKey : tick} className={`alw-core-text${showText ? ' is-on' : ''}`}>
          <span className="alw-core-line">{showText && chars(tagline[0])}</span>
          <span className="alw-core-line is-accent">{showText && chars(tagline[1])}</span>
        </span>
      )}
    </div>
  );
}

/* cycle zamanlaması: grup değişir → düğümler merkezden çıkar → iki tur → merkeze girer
   → logo büyüyüp biraz küçülür → yerini yazıya bırakır → logo geri gelir → sonraki grup.
   round her grupta bir artar (sohbet örneklerini ve animasyonları baştan başlatmak için). */
function useCycle(enabled, count, reduce) {
  const [state, setState] = useState({ g: 0, round: 0, phase: 'closed' });
  useEffect(() => {
    if (!enabled || !count) return;
    if (reduce) {
      setState({ g: 0, round: 0, phase: 'open' });
      const id = setInterval(() => setState(s => ({ g: (s.g + 1) % count, round: s.round + 1, phase: 'open' })), 5000);
      return () => clearInterval(id);
    }
    let timers = [];
    let round = 0;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const run = gi => {
      timers = [];
      const r = round++;
      const set = phase => setState({ g: gi, round: r, phase });
      set('closed');
      let t = 40;
      at(t, () => set('open'));
      t = SPIN_MS - MOVE_MS;      at(t, () => set('closing'));
      t = SPIN_MS;                at(t, () => set('pulse'));
      t += PULSE_MS;              at(t, () => set('text'));
      t += TEXT_MS;               at(t, () => set('back'));
      t += BACK_MS;               at(t, () => run((gi + 1) % count));
    };
    run(0);
    return () => timers.forEach(clearTimeout);
  }, [enabled, count, reduce]);
  return state;
}

/* live: müşteri sorusu → asistan yazıyor → cevap. runKey değişince baştan başlar. */
function LiveChat({ channel, sample, logo, runKey, reduce }) {
  const [step, setStep] = useState(reduce ? 3 : 0);
  useEffect(() => {
    if (reduce) { setStep(3); return; }
    setStep(0);
    const ts = [setTimeout(() => setStep(1), 250), setTimeout(() => setStep(2), 1150), setTimeout(() => setStep(3), 2300)];
    return () => ts.forEach(clearTimeout);
  }, [runKey, reduce]);
  if (!channel || !sample) return <div className="alw-chat" aria-hidden="true" />;
  return (
    <div className="alw-chat" aria-hidden="true">
      {step >= 1 && (
        <div className="alw-msg">
          <span className="alw-msg-av"><ChannelFace c={channel} /></span>
          <div className="alw-msg-body"><small>{channel.label} · müşteri</small><p>{sample.q}</p></div>
        </div>
      )}
      {step === 2 && (
        <div className="alw-msg is-bot">
          <span className="alw-msg-av">{logo && <img src={logo} alt="" />}</span>
          <div className="alw-msg-body"><p className="alw-typing"><i /><i /><i /></p></div>
        </div>
      )}
      {step >= 3 && (
        <div className="alw-msg is-bot">
          <span className="alw-msg-av">{logo && <img src={logo} alt="" />}</span>
          <div className="alw-msg-body"><small>Ailways asistanı</small><p>{sample.a}</p></div>
        </div>
      )}
    </div>
  );
}

/* glow: e-posta alanının örnek metni harf harf yazılır, bekler, silinir; sıradaki örneğe geçer */
function useTypedPlaceholder(texts, enabled) {
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

const EyeIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);

export default function LoginPage({
  variant = 'focus',
  logo,
  channels = [],
  tagline = DEFAULT_TAGLINE,
  chats = DEFAULT_CHATS,
  onSubmit,
  forgotHref = '#',
  loading = false,
  error = '',
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const reduce = useMemo(prefersReducedMotion, []);

  const isCycle = variant === 'cycle' || variant === 'live' || variant === 'glow';
  const isGlow = variant === 'glow';
  const emailHint = useTypedPlaceholder(EMAIL_EXAMPLES, isGlow && !reduce);
  const isLive = variant === 'live';

  // focus/tagline: cümlede dönen kanal ve yörüngedeki vurgu aynı sırayı izler
  const spoken = useMemo(() => channels.map((c, i) => ({ i, phrase: c.phrase })).filter(c => c.phrase), [channels]);
  const [turn, setTurn] = useState(0);
  useEffect(() => {
    if (isCycle || reduce || spoken.length < 2) return;
    const id = setInterval(() => setTurn(t => (t + 1) % spoken.length), ROT_INTERVAL);
    return () => clearInterval(id);
  }, [isCycle, reduce, spoken.length]);

  // cycle: yalnızca kanalı olan gruplar, sırayla
  const groups = useMemo(
    () => GROUPS.map(gr => ({ ...gr, items: channels.filter(c => c.group === gr.key) })).filter(gr => gr.items.length),
    [channels]
  );
  const cycle = useCycle(isCycle, groups.length, reduce);
  const group = groups[cycle.g % (groups.length || 1)];
  const cycleOpen = cycle.phase === 'open';
  const coreMode = cycle.phase === 'pulse' ? 'pulse' : cycle.phase === 'text' ? 'text' : 'logo';

  // live: o anki gruptan sırayla bir kanal ve bir örnek konuşma
  const chatList = group ? chats[group.key] || [] : [];
  const chatChannel = group ? group.items[cycle.round % group.items.length] : null;
  const chatSample = chatList.length ? chatList[Math.floor(cycle.round / (groups.length || 1)) % chatList.length] : null;

  const phrases = isCycle ? groups.map(gr => gr.phrase) : spoken.map(c => c.phrase);
  const phraseIdx = isCycle ? cycle.g % (groups.length || 1) : turn % (spoken.length || 1);
  const current = isCycle ? null : spoken[phraseIdx];
  const core = isCycle
    ? <OrbitCore logo={logo} tagline={tagline} reduce={reduce} mode={reduce ? 'logo' : coreMode} textKey={cycle.round} />
    : <OrbitCore logo={logo} tagline={variant === 'tagline' ? tagline : null} reduce={reduce} />;

  const submit = e => {
    e.preventDefault();
    if (!loading) onSubmit?.({ email, password, remember });
  };

  return (
    <div className="alw-login">
      <aside className="alw-login-hero" aria-label="Ailways">
        <div className="alw-hero-inner">
          <p className="alw-lede">
            <span className="alw-lede-line">
              Asistanın{' '}
              {phrases.length > 0 && (
                <span className="alw-pill">
                  {reduce ? phrases[phraseIdx] : <RotatingText key={variant} texts={phrases} idx={phraseIdx} />}
                </span>
              )}
            </span>
            <span className="alw-lede-line">müşterilerine cevap veriyor.</span>
          </p>
          {isCycle
            ? group && <CycleOrbit channels={group.items} open={cycleOpen} cycleKey={cycle.round} reduce={reduce} core={core} />
            : channels.length > 0 && <ChannelOrbit channels={channels} active={current ? current.i : -1} core={core} />}
        </div>
      </aside>

      <main className={`alw-login-form-side${isGlow ? ' is-glow' : ''}`}>
        <div className="alw-form-wrap">
          <div className="alw-brand">
            {logo && <img src={logo} alt="" />}
            <span>Ailways</span>
          </div>
          <h1 className="alw-title">Panele giriş yap</h1>

          {error && <p className="alw-alert" role="alert">{error}</p>}

          <form className="alw-form" onSubmit={submit} noValidate>
            <div className="alw-field">
              <label htmlFor="alw-email">E-posta</label>
              <input
                id="alw-email" type="email" autoComplete="email" inputMode="email" required
                placeholder={isGlow ? emailHint : EMAIL_EXAMPLES[0]}
                value={email} onChange={e => setEmail(e.target.value)}
                aria-invalid={error ? true : undefined}
              />
            </div>

            <div className="alw-field">
              <div className="alw-field-row">
                <label htmlFor="alw-password">Şifre</label>
                <a href={forgotHref} className="alw-link">Şifremi unuttum</a>
              </div>
              <div className="alw-pw">
                <input
                  id="alw-password" type={showPw ? 'text' : 'password'} autoComplete="current-password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  aria-invalid={error ? true : undefined}
                />
                <button type="button" className="alw-pw-toggle" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Şifreyi gizle' : 'Şifreyi göster'} aria-pressed={showPw}>
                  <EyeIcon off={showPw} />
                </button>
              </div>
            </div>

            <label className="alw-check">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              Beni hatırla
            </label>

            <button type="submit" className={`alw-btn${isGlow ? ' is-shine' : ''}`} disabled={loading} aria-busy={loading || undefined}>
              {loading && <span className="alw-spin" aria-hidden="true" />}
              {loading ? 'Giriş yapılıyor' : 'Giriş yap'}
            </button>
          </form>

          {isLive && <LiveChat channel={chatChannel} sample={chatSample} logo={logo} runKey={cycle.round} reduce={reduce} />}
        </div>

        <p className="alw-foot">© {new Date().getFullYear()} Ailways</p>
      </main>
    </div>
  );
}
