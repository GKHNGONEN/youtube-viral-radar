# 🔥 YouTube Viral & Trend Radarı (Micro-Channel & Outlier Radar Studio)

7/24 Kesintisiz YouTube Veri Analizi, Bebek Kanal Tespiti ve Yapay Zeka Destekli Gelir Simülatörü.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ytviralradar.vercel.app-000000?style=for-the-badge&logo=vercel)](https://ytviralradar.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🚀 Öne Çıkan Özellikler

### 1. 🐣 Bebek & Mikro Kanal Avcısı (Breakout Engine)
- **0–100 Kuluçka Puanı:** Kanal yaşı (60-90 gün), abone sayısı, video sayısı ve yükleme sıklığına göre algoritmik kuluçka skoru.
- **Canlılık & İstikrar Filtresi:** Son 6 videonun ortalama izlenme temposunu analiz ederek tek atımlık sönük kanalları eler.
- **Shorts (180s) ve Uzun Video Ayrımı:** 3 dakikaya kadar olan veya `#shorts` etiketli videoları otomatik tespit eder.

### 2. ⚡ Outlier & Viral Video Radarı
- **Çok Katlı Outlier Tespiti:** Kanal abone sayısının 3x - 10x - 50x katı izlenen videoları anında kırmızı neon rozetlerle öne çıkarır.
- **İzlenme Hızı (Velocity):** Günde kaç izlenme aldığını hesaplayarak YouTube'un sıcak tuttuğu trend videoları yakalar.
- **Zengin Görsel Kartlar:** Kapak görseli üzerinde sol üstte kırmızı Outlier çarpanı, sağ üstte zümrüt yeşili izlenme sayısı ve koyu istatistik paneli.

### 3. 💰 Gelişmiş YouTube Gelir & RPM Simülatörü
- **Niş Bazlı CPM Modeli:** Finans, Kripto, Yapay Zeka, Korku, Doğa, Spor ve Otomotiv nişlerine özel gerçekçi gelir projeksiyonu.
- **Coğrafi Gelir Ağırlığı (Tier 1 - Tier 5):** ABD/Tier 1 kitle arbitraj kazanç potansiyeli simülasyonu.
- **Format Duyarlılığı:** Shorts için havuz RPM'i ($0.03 - $0.25), uzun metraj için normal RPM ($1.5 - $15.0).

### 4. 🛡️ Çift Motorlu Altyapı
- **Resmi YouTube Data API v3:** Hızlı, detaylı istatistikler ve kanal analizleri.
- **Kotasız Açık Kaynak Radarı:** API kotası harcamadan video tarama desteği.

---

## 🛠️ Kurulum & Yerel Çalıştırma

### Gereksinimler
- Node.js (v18+)

```bash
# Bağımlılıkları yükleyin
npm install

# Yerel sunucuyu başlatın
node server.js
```

Tarayıcınızdan `http://localhost:3000` adresine gidin.

---

## ☁️ Bulut Mimarisi (Vercel Serverless)

Proje Vercel sunucusuz mimarisine tam uyumludur:
- `/` -> `public/index.html` (Modern Stitch UI Koyu Cam Tasarım)
- `/api/niches` -> 16 farklı popüler niş kütüphanesi
- `/api/discover` -> Viral video filtreleme
- `/api/discover-channels` -> Kuluçka bebek kanal arama motoru
- `/api/calculate-earnings` -> RPM & Gelir hesaplama motoru

---

## 📄 Lisans
Bu proje açık kaynak topluluğu için geliştirilmiştir.
