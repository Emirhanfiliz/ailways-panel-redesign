# Ailways Panel — Mevcut Tasarım Envanteri

> Kaynak: `saas-v-0-test.vercel.app` ekran görüntüleri (`docs/mevcut/`)
> Tarih: 2026-10-05

Ailways, e-ticaret işletmeleri için yapay zeka asistanı SaaS'ı. Asistanlar web widget, Instagram, WhatsApp, Telegram, pazaryerleri (Trendyol, eBay…) üzerinden müşteri sorularını cevaplıyor; ürün kataloğu ve kayıtlı gönderilerle eşleme yapıyor.

---

## 1. Genel Yapı (Shell)

| Öğe | Mevcut durum |
|---|---|
| Sol menü | Beyaz, ~300px. Logo + "Ailways". Ana Sayfa, Günlük Kontrol (76), İstatistikler, Geçmiş Konuşmalar, Bulgular (40, kırmızı), — Asistanlar, Mağaza Yönetimi ▾ (Ürünler, Siparişler, Kayıtlı Paylaşımlar, Kanallar), Ayarlar, **Asistanı Test Et** (mor CTA). Altta şirket adı + e-posta + Çıkış Yap |
| Sağ kenar | Dikey mor **"Destek"** sekmesi (sabit) |
| Sağ alt | Mor yuvarlak **onboarding checklist** butonu (0/5) |
| Arka plan | Çok açık gri/lavanta, kartlar beyaz, yuvarlak köşe (~16px), ince border |
| Renk | Primary mor (#7C3AED civarı), ikincil mavi (#3B82F6, "Yeni Asistan", "ekle"), durum yeşil/kırmızı/turuncu |
| Tipografi | Sans-serif, sayfa başlığı ~28px bold + gri alt başlık |

---

## 2. Ekranlar

### 01 — Ana Sayfa · `mevcut/01-ana-sayfa.png`
- "Hoş geldin" + "4 asistanın aktif…" + **Asistanları Yönet** (mor).
- 4 adet **koyu lacivert** asistan kartı (Robo Çeyiz, Robo Gold, Müşteri Destek, Ailways Asistanı): Aktif rozeti, aynı açıklama metni, Test Et / Yönet.
- **Bu Ay** KPI: Ciro (mor dolgu kart), Satış, Soru, En Yoğun Gün.
- Soru Kanal Dağılımı (boş), Kullanım Özeti (Mesaj / Görsel / Asistan 4/4 kırmızı bar / Ürün).
- Hızlı Erişim: Bilgi Bankası, Ürünler, Siparişler, Sohbetler.
- Son Siparişler (boş durum).

### 02 — İstatistikler (Kullanım) · `mevcut/02-istatistikler.png`
- Başlık "Kullanım", ay seçici + Aylık/Günlük toggle.
- Bölümler: **Bir Bakışta** (5 KPI), **Cevaplar** (aylık bar chart, saatlik bar chart, Özet listesi), **Kanallar** (Nereden geldi — taşıyıcı/kanal barları, Gelen mesajlar), **Satış** (Sipariş nereden geldi, Sepet), **Asistan** (6 yetenek kartı + 4 sonuç kartı).
- Çok uzun tek sayfa; çok sayıda "Bu ay için kayıt yok" boş kutusu.

### 03 — Geçmiş Konuşmalar · `mevcut/03-gecmis-konusmalar.png`
- 3 kolon: dikey ikon filtre rayı · konuşma listesi (arama, kanal ikonu, isim, son mesaj, zaman, yeşil nokta) · sohbet detayı.
- Üstte Kanallar / Pazaryerleri sekmesi. Detay başlığında Otomatik Yanıt toggle, Sorun Bildir, ⋯.
- Liste ID'leri bazen ham hash (`68cfb575d830…`).

### 04 — Bulgular · `mevcut/04-bulgular.png`
- Asistanın cevaplayamadığı sorular. Aynı 3 kolon yapısı.
- Liste: başlık, Anonim, asistan etiketi, "Bekleyen" turuncu rozet.
- Detay: konuşma alıntısı + "Bunu çözemedim. Bana öğret" kartı + doğru cevap input'u.

### 05 — Asistanlar · `mevcut/05-asistanlar.png`
- 2 kolon kart grid. Kart: ikon, ad, tür (E-Ticaret / Pazaryeri), Aktif toggle, kanal chip'leri (Web, telegram, ebay, Trendyol), Bilgi Bankası / Bağlantılar / Yetenekler sayıları.
- **Yeni Asistan** (mavi).

### 06 — Ürünler · `mevcut/06-urunler.png`
- Sekmeler: Ürünler / Ürün Aktarım Ayarları. Sol ikon rayı.
- Arama + Liste Yönet + yenile + **ekle** (mavi).
- Sayfalama (Önceki / Sonraki, 7083 ürün).
- Tablo üstü aksiyonlar: Eğitim Durumu, Metinsel Eğitim Yap (açık mavi), Görsel Eşleme Eğitimi (turuncu).
- Tablo: ID (hash), Ürün kodu, Ad, Fiyat, Kategori, Görsel, Durum (Yazı/Fotoğraf), Ek bilgi, İşlemler (göz/düzenle/sil/Öne Çıkar).

### 07 — Kayıtlı Gönderiler (Paylaşımlar) · `mevcut/07-kayitli-paylasimlar.png`
- Görsel Eşleme ilerleme kartı (53/57, %93) + uyarı bandı.
- Kanal sekmeleri (Instagram 237, Messenger 0), arama, Hepsi/Gönderi/Hikaye, Filtreler, sıralama, grid/list.
- Durum sekmeleri: Bekleyen 25 · Hazır 58 · Bulunamadı 1 · Susturulan 3 · Arşiv 150.
- 4 kolon kart grid: görsel (çoğu boş placeholder), "Henüz ürün bağlanmadı" sarı kutu + Ürün seç, Genel bilgi, paylaşım/yorum sayısı.

### 08 — Kanallar · `mevcut/08-kanallar.png`
- "10 kanal bağlı · 17 daha bağlanabilir". Sol kategori rayı (Tümü, Mesaj, Pazar, E-tic, CRM, Uygulama).
- Bölümler: Bağlı Kanallar (10), Mesajlaşma, Pazaryeri, E-Ticaret, CRM/Entegrasyon, Uygulama.
- 5 kolon kart: logo, ad, açıklama, "Ayarları aç" / "Bağla"; bağlı olanlarda üst renkli şerit + yeşil nokta.

### 09 — Ayarlar · Profil & Tercihler · `mevcut/09-ayarlar-profil.png`
- Sekmeler: Profil & Tercihler, Abonelik, Faturalama, Akıllı Araçlar.
- Kartlar: Profil Bilgileri, Sektör (uyarı bandı), Günlük Özet (toggle), Kayıtlı Numaralar, Bildirimler (Yakında), Veri Paylaşımı, Güvenlik.
- En altta tek **Değişiklikleri Kaydet**.

### 10 — Asistanla Sohbet · Tam Ekran · `mevcut/10-asistan-test-tam-ekran.png`
- Sekmeler: Tam Ekran / Bubble Widget / Yeni Bubble Widget (YENİ).
- Günlük ücretsiz test kotası bandı (4/50 mesaj, 2/10 görsel).
- Asistan seçici chip'ler (sürükle-bırak).
- Widget önizlemesi: **kırmızı** header (asistan marka rengi), yeşil karşılama balonu, KVKK bandı, input.

### 11 — Asistanla Sohbet · Bubble Widget · `mevcut/11-asistan-test-bubble-widget.png`
- Sağda açılmış widget paneli + sağ altta "Hızlı Destek" bubble. Orta alanda açıklama kartı.

### 12 — Asistan Detayı · Asistan Zihni · `mevcut/12-asistan-detay.png`
- Geri oku + asistan adı ("Müşteri Destek Asistanı") + "Yapay zeka asistanınızı düzenleyin ve özelleştirin".
- Sekmeler: Asistan Zihni, Bilgi Bankası, Ayarlar, Yetenekler, Versiyon Geçmişi.
- İki kart: **Genel** (temel davranış, 1 talimat, her konuşmada aktif, mavi) ve **Kurallar** (yasaklar ve sınırlar, 1 kural, her cevapta uygulanır, sarı).
- Altta mor-mavi gradyanlı **Kontrol Et ve Kaydet** + **Direkt Kaydet**. Onboarding sayacı burada 3/5.

### Eksik ekranlar (SS yok)
- Günlük Kontrol, Siparişler, Bilgi Bankası (ayrı sayfa), Ayarlar › Abonelik / Faturalama / Akıllı Araçlar.

---

## 3. Gözlemlenen Sorunlar

**Tutarlılık**
- Primary renk karmaşası: mor (menü, CTA) + mavi ("Yeni Asistan", "ekle", widget test sekmesi) + turuncu/açık mavi eğitim butonları.
- Ana Sayfa koyu lacivert kartları panelin geri kalanıyla uyumsuz.
- Sayfa başlığı boyutları farklı (Ürünler/Asistanlar büyük, Geçmiş Konuşmalar küçük).
- Buton dili: "ekle" küçük harf, "Gönderi Ekle", "Yeni Asistan" — isimlendirme standardı yok.
- Menüde "Kayıtlı Paylaşımlar", sayfada "Kayıtlı Gönderiler".

**Hiyerarşi & yoğunluk**
- İstatistikler tek uzun scroll; boş durum kutuları alanın büyük kısmını kaplıyor.
- Ana Sayfa'da 4 asistan kartı aynı açıklamayı tekrarlıyor, en değerli alanı (fold üstü) bilgi vermeden tüketiyor.
- Ürün tablosunda ham hash ID'ler ve 4 ayrı işlem butonu → kalabalık.
- Kayıtlı Gönderiler'de görselsiz placeholder kartlar grid'in çoğunu kaplıyor.

**Navigasyon**
- Sol menü dikey scroll gerektiriyor (Ayarlar ve Test Et görünmüyor).
- Sayfa içi sol ikon rayları (Konuşmalar, Bulgular, Ürünler, Kanallar) etiketsiz; anlamı belirsiz.
- Sağdaki "Destek" sekmesi + sağ alt checklist + widget bubble çakışıyor.

**Boş durumlar**
- Pek çok "Henüz … yok" metni, sonraki adımı (CTA) önermiyor.

---

## 4. Korunacak Güçlü Yanlar
- Temiz, havadar kart dili ve yumuşak köşeler.
- Bulgular'daki "Bana öğret" akışı — ürünün çekirdek değeri, öne çıkarılmalı.
- Kanallar sayfasının kategorili yapısı ve bağlı/bağlanabilir ayrımı.
- Kayıtlı Gönderiler'deki durum sekmeleri (Bekleyen/Hazır/…) ve ilerleme göstergesi.
- İstatistiklerdeki açıklayıcı alt metinler (her metriğin ne anlama geldiği).
