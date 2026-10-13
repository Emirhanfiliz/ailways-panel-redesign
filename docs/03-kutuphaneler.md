# Ailways Panel — Kütüphane Araştırması

> Tarih: 2026-10-05 · Sürümler npm registry'den alındı, CDN URL'leri curl ile denendi (hepsi HTTP 200).
> Kütüphaneler tarayıcıda çalıştırılarak test edilmedi.

## Artifact kısıtı
Script'ler yalnızca şu adreslerden yüklenebilir: `cdnjs.cloudflare.com`, `cdn.jsdelivr.net/npm/`, `unpkg.com`, `cdn.tailwindcss.com`, `code.jquery.com`.
Stylesheet'ler **yalnızca Google Fonts**'tan gelebilir. Diğer CSS'lerin sayfaya inline edilmesi gerekir. Bu nedenle harici CSS isteyen kütüphaneler (DaisyUI, Flowbite, Basecoat…) ikinci planda.

---

## 1. Stil / CSS
| Kütüphane | Sürüm | Harici CSS? | Karar |
|---|---|---|---|
| **Tailwind v4 Browser** | 4.3.3 | Hayır | ✅ **Temel** |
| Preline (JS) | 5.0.0 | Hayır (Tailwind sınıfları yeterli) | Yedek: dropdown/modal JS'i |
| Basecoat UI (shadcn görünümü, React'sız) | 1.0.2 | Evet (218 KB) | Yedek: CSS inline edilebilir |
| DaisyUI | 5.7.47 | Evet (1.1 MB) | ❌ Ağır, "template" görünümü |
| Flowbite / Franken UI / Web Awesome / Tabler | — | Evet | ❌ |

## 2. Etkileşim
| Kütüphane | Sürüm | Karar |
|---|---|---|
| **Alpine.js** | 3.17.4 | ✅ Sekme, modal, sayfalama, inbox seçimi |
| React 18.3.1 UMD + Babel standalone | — | React yolu için (bkz. §6). React 19'un UMD build'i yok |
| htmx / petite-vue | — | ❌ |

## 3. İkonlar
| Kütüphane | Sürüm | Karar |
|---|---|---|
| **Lucide** | 1.52.0 | ✅ shadcn ile aynı ikon dili |
| Phosphor | 2.1.2 | ⚠️ Jsdelivr'dan CSS enjekte ediyor |
| Iconify | 3.0.3 | ❌ İkonları runtime'da api.iconify.design'dan çekiyor, bu adres izinli değil |

## 4. Grafikler
| Kütüphane | Sürüm | Not |
|---|---|---|
| **ApexCharts** | 7.8.0 | ✅ En modern dashboard görünümü: gradient area, sparkline, donut. CSS'ini kendisi enjekte ediyor |
| ECharts | 6.1.0 | En güçlüsü (heatmap, funnel), 1.1 MB |
| Chart.js | 4.5.1 | Hafif, ama modern görünmesi için ayar gerekiyor |
| **Recharts** (React) | 3.10.1 | ✅ React yolu için. UMD build'i var, React 18 + react-is gerekiyor |
| Tremor / Nivo / visx / react-chartjs-2 | — | ❌ UMD yok. jsdelivr `+esm` her pakete farklı React sürümü bağlıyor, sayfada iki React kopyası oluşup hook'lar bozuluyor |

## 5. Font
Google Fonts'tan `latin-ext` subset'i ile yüklenmeli (ğ ş ı İ için).
- **Öneri: Geist + Geist Mono**
- Alternatifler: Inter, Onest (Türkçede çok temiz duruyor), Plus Jakarta Sans
- Rakamlar için `font-variant-numeric: tabular-nums` kullanılmalı.

## 6. React Bits (reactbits.dev)
- **Dağıtım:** npm paketi yok. Bileşenler kopyala-yapıştır ya da `npx shadcn add @react-bits/…` ile alınıyor.
- **Tek HTML'de kullanım:** Bileşenin JS + Tailwind kaynağı `<script type="text/babel">` içine yapıştırılır. Import satırları global'lerle değiştirilir:
  - `import … from 'react'` → `const {useState,…} = React;`
  - `import … from 'motion/react'` → `const {motion,…} = Motion;` (framer-motion 12 UMD)
- **Panele uygun bileşenler:**

| Bileşen | Bağımlılık | Kullanım |
|---|---|---|
| CountUp | motion | KPI sayıları |
| SpotlightCard | yok | Kart grid'leri (asistan, kanal) |
| AnimatedList | motion | Inbox, aktivite akışı |
| Stepper | motion | Onboarding / kanal bağlama sihirbazı |
| Magnet | yok | Önemli CTA'lar (az kullanılmalı) |
| GradientText / ShinyText | motion | "AI" rozeti, başlık vurgusu (az kullanılmalı) |

- WebGL arka planları (ogl, three) panel için ağır ve gereksiz, dışarıda bırakıldı.
- **Lisans (doğrulandı, GitHub `LICENSE.md`):** MIT + Commons Clause. Bileşenler ticari ürün içinde serbestçe kullanılabilir. Bileşenlerin kendisini satmak, yeniden dağıtmak ya da paket hâlinde sunmak yasak.
- **Teknik test:** `artifacts/00-teknik-test.html` dosyasında CountUp, SpotlightCard, AnimatedList ve Recharts denendi.
  - Değişiklik gereken yerler: SpotlightCard ve AnimatedList'teki sabit koyu renkler panelin token'larıyla değiştirildi. AnimatedList'in klavye kısayolu kapatıldı, çünkü `window` üzerinde Tab tuşunu yakalıyor.
  - Recharts'ın SVG attribute'ları `var(--x)` kabul etmiyor, bu yüzden renkler JS'te okunuyor.

## 7. Ekstralar
| İhtiyaç | Seçim |
|---|---|
| Tablo + sayfalama | Alpine ile elle yazılır (Grid.js ve Tabulator harici CSS istiyor) |
| Sürükle-bırak (asistan sıralama) | SortableJS 1.15.7 (CSS yok) |
| Toast | Alpine ile kendi toast'ımız, ya da Notyf (CSS inline) |
| Tarih seçici | Native `<input type="date">`, ya da flatpickr + `l10n/tr.js` (CSS inline) |
| Animasyon | Motion 14 (`Motion.animate`) |

---

## Önerilen Stack

İki yol var. Görsel kalitede fark yok. **A daha hafif ve daha az kırılgan. B, React Bits ve Recharts kullanmayı mümkün kılıyor.**

### A) Vanilla yolu
```html
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@500&display=swap&subset=latin-ext" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<style type="text/tailwindcss">
  @theme {
    --font-sans: "Geist", sans-serif;
    --color-brand-500: #119DDA;
    --color-brand-550: #0D95D3;
    --color-brand-600: #0A87C5;
  }
</style>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.17.4/dist/cdn.min.js"></script>
<script src="https://unpkg.com/lucide@1.52.0/dist/umd/lucide.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/apexcharts@7"></script>
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.7/Sortable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/motion@14/dist/motion.js"></script>
<!-- sayfa sonunda: <script>lucide.createIcons()</script> -->
```

### B) React yolu (React Bits + Recharts)
```html
<!-- font + tailwind satırları A ile aynı -->
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/react-is@18.3.1/umd/react-is.production.min.js"></script>
<script src="https://unpkg.com/recharts@3.10.1/umd/Recharts.js"></script>
<script src="https://cdn.jsdelivr.net/npm/framer-motion@12/dist/framer-motion.js"></script>
<script src="https://unpkg.com/lucide@1.52.0/dist/umd/lucide.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.29.9/babel.min.js"></script>
<script type="text/babel" data-presets="react">
  const { useState, useEffect, useRef } = React;
  const { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } = Recharts;
  const { motion, useSpring, useInView } = Motion;
  /* React Bits bileşenleri buraya */
  ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
</script>
```
**B'nin bedeli:** Babel standalone yaklaşık 3 MB, ilk yükleme yavaş. React 18.3.1, UMD build'i olan son sürüm.

## Açık noktalar
- Kütüphaneler henüz bir artifact içinde çalıştırılarak doğrulanmadı. İlk prototipte test edilecek.
- Karar bekleniyor: **A mı, B mi?**
