# Ailways Panel — Redesign Brief

> Çıktı: **tasarım artifact'ları** (tıklanabilir HTML prototipler). Kod tabanına entegrasyon bu aşamada yok.
> Referans: [01-mevcut-tasarim.md](01-mevcut-tasarim.md)

## Hedefler
1. **Tek tasarım dili** — tek primary renk, tutarlı buton/başlık/kart bileşenleri.
2. **Önce aksiyon** — kullanıcı panele girince "bugün ne yapmalıyım?" sorusunun cevabını görsün (bekleyen bulgular, ürün bağlanmamış gönderiler, kanal hataları).
3. **Daha az gürültü** — boş durumları sadeleştir, tekrar eden içeriği kaldır, tabloları hafiflet.
4. **Net navigasyon** — scroll gerektirmeyen sol menü, etiketli filtreler, tek bir yardım/destek giriş noktası.

## Kararlar (2026-10-05)
- **Palet:** beyaz + mavi (logo mavisi). Mor yok.
- **Zemin her yerde beyaz.** Koyu tema yok, tek açık tema.
- **Kenar çubuğu:** React Bits BranchedMenu tabanlı, 72px ikon rayına daralıyor (`artifacts/01-sidebar.html`).
- **Teknik yol:** React yolu (B). React 18 UMD, React Bits, Recharts ve Tailwind v4. Teknik testten geçti (`artifacts/00-teknik-test.html`).

## Tasarım İlkeleri (öneri)
- Primary: **logo mavisi** (`#119DDA` → `#0A87C5`, bkz. [marka/README.md](marka/README.md)) — **mor tamamen kaldırılır**; durum renkleri yalnızca durum için.
- Tek tema: beyaz zemin (koyu tema yok).
- Sayfa başlığı şablonu: başlık · tek satır açıklama · sağda tek primary aksiyon.
- Boş durum = ikon + kısa açıklama + bir sonraki adım butonu.
- Hash ID'ler gizlenir / kopyala ikonuna indirgenir.

## Artifact Planı

| # | Artifact | Mevcut SS | Öncelik |
|---|---|---|---|
| A0 | Tasarım sistemi (renk, tipografi, bileşenler, shell) | tümü | 1 |
| A1 | Ana Sayfa | 01 | 1 |
| A2 | Bulgular (öğret akışı) | 04 | 1 |
| A3 | Geçmiş Konuşmalar | 03 | 2 |
| A4 | İstatistikler | 02 | 2 |
| A5 | Asistanlar | 05 | 2 |
| A6 | Ürünler | 06 | 3 |
| A7 | Kayıtlı Gönderiler | 07 | 3 |
| A8 | Kanallar | 08 | 3 |
| A9 | Ayarlar | 09 | 3 |
| A10 | Asistanı Test Et | 10, 11 | 3 |

## Açık Sorular
- ~~Hangi renk primary?~~ → **Karar: logo mavisi, mor kaldırılır (A).**
- Günlük Kontrol ve Siparişler ekranları da kapsamda mı? (SS yok)
- ~~Koyu tema?~~ → **Hayır, zemin hep beyaz.**
- Mobil/tablet görünüm kapsamda mı?
