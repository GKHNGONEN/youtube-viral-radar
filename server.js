const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// 🔑 GOOGLE YOUTUBE DATA API V3 ANAHTARI
const YOUTUBE_API_KEY = 'AIzaSyBN3jWgkDIHmcBTw2vmZyW29uafBJL41LA';

// 🎯 DETAYLI VİRAL NİŞ KÜTÜPHANESİ
const VIRAL_NICHES = [
  {
    id: "ai_movies",
    category: "🎬 Yapay Zeka Filmleri & Sinematik",
    description: "Uzun metraj AI sinema filmleri, bilim kurgu, gerilim hikayeleri.",
    seeds: [
      "ai sci fi movie",
      "ai horror film",
      "ai cinematic short film",
      "kling ai movie",
      "luma dream machine film",
      "ai generated thriller film"
    ]
  },
  {
    id: "metaphysics_paranormal",
    category: "👁️ Metafizik, Paralel Evrenler & Simülasyon",
    description: "Glitch in matrix, paralel evrenler, liminal mekanlar, simülasyon teorisi.",
    seeds: [
      "liminal spaces backrooms",
      "glitch in the matrix real footage",
      "simulation theory proof",
      "parallel universe mystery",
      "astral projection experience",
      "unexplained metaphysical phenomenon"
    ]
  },
  {
    id: "ancient_mysteries",
    category: "🏛️ Açıklanamayan Gizemler & Antik Olaylar",
    description: "Girişi yasak bölgeler, tarihi anormallikler, gizemli yeraltı yapıları.",
    seeds: [
      "ancient mysteries documentary",
      "unexplained archaeological discoveries",
      "forbidden places no one can visit",
      "gobekli tepe mystery",
      "secret underground structures discovered"
    ]
  },
  {
    id: "space_cosmic",
    category: "🌌 Uzay, Kara Delikler & Kozmik Korku",
    description: "James Webb keşifleri, kara delikler, evrenin sonu ve devasa gök cisimleri.",
    seeds: [
      "james webb terrifying discovery",
      "falling into black hole simulation",
      "cosmic horror universe scale",
      "mysterious space anomaly nasa",
      "end of universe timelapse"
    ]
  },
  {
    id: "abandoned_urbex",
    category: "🏚️ Terk Edilmiş Yerler & Gizli Sığınaklar (Urbex)",
    description: "Terk edilmiş malikaneler, nükleer sığınaklar, hayalet kasabalar.",
    seeds: [
      "abandoned mansion",
      "abandoned nuclear bunker",
      "abandoned underground city",
      "abandoned hospital night exploration",
      "ghost town abandoned"
    ]
  },
  {
    id: "extreme_sports",
    category: "🏍️ Ekstrem Sporlar & Hill Climb",
    description: "GoPro POV, kıl payı kurtuluşlar, dik yamaç tırmanışları, tepe kazaları.",
    seeds: [
      "extreme enduro",
      "downhill mountain bike crash",
      "wingsuit cliff proximity",
      "dirt bike steep hillclimb",
      "impossible motorcycle hillclimb"
    ]
  },
  {
    id: "sweaty_palms",
    category: "😱 Yükseklik Korkusu & Uçurum (Sweaty Palms)",
    description: "Dağ yolları, ipsiz tırmanışlar, korkuluksuz köprüler.",
    seeds: [
      "terrifying heights pov",
      "crane climb without rope",
      "steepest mountain road truck",
      "dangerous cliff path",
      "extreme vertigo heights"
    ]
  },
  {
    id: "natural_cataclysms",
    category: "🌪️ Doğa Felaketleri & Fırtına Avcıları",
    description: "Süper hücre kasırgaları, dev tsunamiler, yanardağ patlamaları.",
    seeds: [
      "tornado close up",
      "volcano eruption shockwave",
      "monster tsunami wave real footage",
      "flash flood caught on camera",
      "extreme lightning strike caught"
    ]
  },
  {
    id: "dark_nature",
    category: "🧠 Karanlık Doğa & Şok Edici Canlılar",
    description: "Okyanus derinlikleri, ölümcül hayvan anları, inanılmaz biyolojik gerçekler.",
    seeds: [
      "terrifying deep sea creatures",
      "shocking animal encounters caught",
      "deep ocean anomaly",
      "terrifying nature caught on camera",
      "deadly predator attack close call"
    ]
  },
  {
    id: "wildlife_predators",
    category: "🦁 Vahşi Doğa & Zirve Yırtıcılar (Apex Predators)",
    description: "Kutup ayıları, okyanus yırtıcıları, kaplan pusuları, ölümcül karşılaşmalar.",
    seeds: [
      "apex predators hunting",
      "polar bear terrifying encounter",
      "tiger vs crocodile brutal fight",
      "deadliest snake encounter",
      "lion attack close call"
    ]
  },
  {
    id: "mythology_epic",
    category: "⚔️ Mitoloji, Efsaneler & Antik Savaşlar",
    description: "Viking akınları, mitoloji efsaneleri, Roma lejyonları, antik savaş taktikleri.",
    seeds: [
      "norse mythology ragnarok",
      "ancient roman legion battle",
      "greek mythology monsters",
      "epic medieval siege battle",
      "samurai battle realistic"
    ]
  },
  {
    id: "cyberpunk_future",
    category: "🦾 Gelecek Distopyası & Siberpunk 2080",
    description: "Yapay zeka tekilliği, sibernetik insanlar, distopik mega şehirler.",
    seeds: [
      "cyberpunk 2080 megacity",
      "ai singularity future world",
      "dystopian future life",
      "humanity in 2100 documentary",
      "cybernetic human evolution"
    ]
  },
  {
    id: "unsolved_truecrime",
    category: "🕵️ Çözülemeyen Gizemler & Gerilim Vakaları",
    description: "Kayıp olayları, açıklanamayan kasetler, şifreli mesajlar.",
    seeds: [
      "unsolved mystery strange case",
      "disturbing 911 calls with story",
      "mysterious disappearance dark",
      "scary internet mysteries",
      "unexplained audio recordings real"
    ]
  },
  {
    id: "deep_sea_abyss",
    category: "🌊 Mariana Çukuru & Derin Deniz Korkusu (Thalassophobia)",
    description: "Okyanusun en dibi, batıklar, karanlık sularda tek başına.",
    seeds: [
      "mariana trench deepest point mystery",
      "thalassophobia ocean depths caught",
      "lost underwater exploration",
      "deep sea research vessel discovery",
      "terrifying underwater sounds bloom"
    ]
  },
  {
    id: "megaprojects_engineering",
    category: "🏗️ Çılgın Mühendislik & Terk Edilmiş Megaprojeler",
    description: "Devasa barajlar, bitirilemeyen gökdelenler, yeraltı tünelleri.",
    seeds: [
      "insane engineering mega projects",
      "abandoned mega construction projects",
      "how they built underground city",
      "dangerous bridge engineering",
      "largest machine ever built moving"
    ]
  },
  {
    id: "survival_wilderness",
    category: "🏕️ İlkel Yaşam & Vahşi Doğada Hayatta Kalma",
    description: "Sıfırdan sığınak yapımı, vahşi doğada 100 gün, ilkel tuzaklar.",
    seeds: [
      "primitive survival shelter build",
      "100 days survival solo wilderness",
      "primitive technology underground house",
      "bushcraft survival winter camp",
      "alone in wilderness survival trap"
    ]
  }
];

function parseDuration(durationStr) {
  if (!durationStr) return { totalSeconds: 0, durationSeconds: 0, text: '0:00', type: 'Standart Video' };
  const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return { totalSeconds: 0, durationSeconds: 0, text: '0:00', type: 'Standart Video' };
  const hours = parseInt(matches[1] || 0, 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const seconds = parseInt(matches[3] || 0, 10);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  let text = '';
  if (hours > 0) {
    text = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    text = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  let type = '⏱️ Standart Video';
  if (totalSeconds <= 60) type = '⚡ Shorts';
  else if (totalSeconds >= 1200) type = '🎬 Uzun Film / Belgesel (>20 Dk)';
  return { totalSeconds, durationSeconds: totalSeconds, text, type };
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 0-100 KULUÇKA / BEBEK KANAL PUANLAMA MOTORU (GitHub AI Algoritması)
function scoreBreakoutChannel({ ageDays, subs, totalViews, videoCount }) {
  let ageScore = 0;
  if (ageDays <= 30) {
    ageScore = 30 * (1 - (ageDays / 30) * 0.3); // 30-21 puan
  } else if (ageDays <= 60) {
    ageScore = 21 * (1 - ((ageDays - 30) / 30)); // 21-0 puan
  } else if (ageDays <= 90) {
    ageScore = 5;
  }
  ageScore = Math.max(0, Math.min(30, ageScore));

  let viewSubRatio = subs > 0 ? totalViews / subs : 0;
  let ratioScore = 0;
  if (viewSubRatio > 100) ratioScore = 30;
  else if (viewSubRatio > 50) ratioScore = 28;
  else if (viewSubRatio > 20) ratioScore = 25;
  else if (viewSubRatio > 10) ratioScore = 20;
  else if (viewSubRatio > 5) ratioScore = 15;
  else ratioScore = Math.max(0, (viewSubRatio / 5) * 10);
  ratioScore = Math.min(30, ratioScore);

  let avgViews = videoCount > 0 ? totalViews / videoCount : 0;
  let viewsScore = 0;
  if (avgViews >= 50000) viewsScore = 20;
  else if (avgViews >= 20000) viewsScore = 16;
  else if (avgViews >= 10000) viewsScore = 12;
  else if (avgViews >= 5000) viewsScore = 8;
  else if (avgViews >= 2000) viewsScore = 5;
  else viewsScore = 2;

  let uploadFreq = ageDays > 0 ? (videoCount / ageDays) : 0;
  let freqScore = 0;
  if (uploadFreq >= 2) freqScore = 10;
  else if (uploadFreq >= 1) freqScore = 8;
  else if (uploadFreq >= 0.5) freqScore = 5;
  else freqScore = 2;

  let dailyViews = ageDays > 0 ? (totalViews / ageDays) : 0;
  let expectedDaily = avgViews * uploadFreq;
  let growthAccel = expectedDaily > 0 ? (dailyViews / expectedDaily) : 1;
  let growthScore = 0;
  if (growthAccel > 2) growthScore = 10;
  else if (growthAccel > 1.5) growthScore = 8;
  else if (growthAccel > 1) growthScore = 5;
  else growthScore = 3;

  let totalScore = Math.round((ageScore + ratioScore + viewsScore + freqScore + growthScore) * 10) / 10;
  return {
    totalScore: Math.min(100, Math.max(10, totalScore)),
    ageScore: Math.round(ageScore),
    ratioScore: Math.round(ratioScore),
    viewsScore: Math.round(viewsScore),
    freqScore: Math.round(freqScore),
    growthScore: Math.round(growthScore),
    viewSubRatio: parseFloat(viewSubRatio.toFixed(1)),
    avgViews: Math.round(avgViews),
    uploadFreq: parseFloat(uploadFreq.toFixed(2))
  };
}

// 💰 YOUTUBE KAZANÇ & RPM HESAPLAMA MOTORU (GitHub AI Referans Modeli)
class YouTubeRevenueCalculator {
  static NICHE_CPM = {
    "finance": { name: "Finans & Yatırım", min: 8, max: 25, median: 12.5 },
    "crypto": { name: "Kripto & Borsa", min: 10, max: 30, median: 15 },
    "tech": { name: "Teknoloji & Yapay Zeka", min: 4, max: 12, median: 7.8 },
    "business": { name: "İş Dünyası & Girişimcilik", min: 6, max: 18, median: 10 },
    "education": { name: "Eğitim & Tarih & Bilim", min: 3, max: 9, median: 5.5 },
    "health": { name: "Sağlık & Fitness", min: 3, max: 8, median: 5.5 },
    "lifestyle": { name: "Yaşam Tarzı & Vlog", min: 1.5, max: 5, median: 3.2 },
    "gaming": { name: "Oyun & Espor", min: 1, max: 4, median: 2.1 },
    "entertainment": { name: "Eğlence & Komedi", min: 0.8, max: 3, median: 1.8 },
    "horror": { name: "Korku & Gizem & Paranormal", min: 1.2, max: 4.5, median: 2.5 },
    "sports": { name: "Spor & Ekstrem Sporlar", min: 2, max: 6, median: 3.6 },
    "automotive": { name: "Otomobil & Araç", min: 3, max: 9, median: 5.2 },
    "animals": { name: "Hayvanlar & Doğa", min: 1.5, max: 5, median: 2.8 },
    "food": { name: "Yemek & Mutfak", min: 2, max: 7, median: 3.8 },
    "travel": { name: "Seyahat & Keşif", min: 2.5, max: 8, median: 4.5 },
    "music": { name: "Müzik & Sanat", min: 0.6, max: 3, median: 1.4 },
    "kids": { name: "Çocuk & Aile", min: 0.8, max: 3.5, median: 1.8 },
    "general": { name: "Genel / Diğer", min: 2, max: 6, median: 3.5 }
  };

  static GEO_WEIGHTS = {
    "tier1": { label: "Tier 1 (ABD / İngiltere / Kanada / Almanya)", weight: 1.0 },
    "tier2": { label: "Tier 2 (Avustralya / Hollanda / İskandinavya)", weight: 0.85 },
    "tier3": { label: "Tier 3 (Japonya / Güney Kore / Güney Avrupa)", weight: 0.70 },
    "tier4": { label: "Tier 4 (Türkiye / Global Karışık / Latin Amerika)", weight: 0.50 },
    "tier5": { label: "Tier 5 (Hindistan / Pakistan / Güneydoğu Asya)", weight: 0.25 }
  };

  static CONTENT_MULTIPLIERS = {
    long_form: {
      cpmToRpmRatio: 0.45,
      monetizationRate: 0.65,
      effectiveCpmMin: 1.5,
      effectiveCpmMax: 15.0
    },
    shorts: {
      shortsPoolMultiplier: 0.05,
      monetizationRate: 0.40,
      effectiveRpmMin: 0.03,
      effectiveRpmMax: 0.25
    }
  };

  static calculate({ monthlyViews, contentType = 'shorts', longRatio = 0.5, niche = 'general', geoTier = 'tier1', customCpm = null, usdToTry = 34.5 }) {
    const views = Math.max(0, Number(monthlyViews) || 0);

    // 🔀 HİBRİT KARMA MODEL HESAPLAMA (Shorts + Uzun Video Kombinasyonu)
    if (contentType === 'hybrid') {
      const lRatio = Math.max(0.05, Math.min(0.95, Number(longRatio) || 0.5));
      const sRatio = 1 - lRatio;
      const longViews = Math.round(views * lRatio);
      const shortsViews = Math.round(views * sRatio);

      const longRes = this.calculate({ monthlyViews: longViews, contentType: 'long_form', niche, geoTier, customCpm, usdToTry });
      const shortsRes = this.calculate({ monthlyViews: shortsViews, contentType: 'shorts', niche, geoTier, customCpm, usdToTry });

      const monetizedViews = longRes.monetizedViews + shortsRes.monetizedViews;
      const monthlyEarningsUsd = {
        min: Math.round((longRes.monthlyEarningsUsd.min + shortsRes.monthlyEarningsUsd.min) * 10) / 10,
        median: Math.round((longRes.monthlyEarningsUsd.median + shortsRes.monthlyEarningsUsd.median) * 10) / 10,
        max: Math.round((longRes.monthlyEarningsUsd.max + shortsRes.monthlyEarningsUsd.max) * 10) / 10
      };

      const blendedRpm = {
        min: views > 0 ? parseFloat(((monthlyEarningsUsd.min / views) * 1000).toFixed(3)) : 0,
        median: views > 0 ? parseFloat(((monthlyEarningsUsd.median / views) * 1000).toFixed(3)) : 0,
        max: views > 0 ? parseFloat(((monthlyEarningsUsd.max / views) * 1000).toFixed(3)) : 0
      };

      let tier1Earnings = null;
      if (geoTier !== 'tier1') {
        const t1Long = longRes.tier1PotentialMonthly || longRes.monthlyEarningsUsd;
        const t1Shorts = shortsRes.tier1PotentialMonthly || shortsRes.monthlyEarningsUsd;
        tier1Earnings = {
          min: Math.round((t1Long.min + t1Shorts.min) * 10) / 10,
          median: Math.round((t1Long.median + t1Shorts.median) * 10) / 10,
          max: Math.round((t1Long.max + t1Shorts.max) * 10) / 10
        };
      }

      const longPct = Math.round(lRatio * 100);
      const shortsPct = Math.round(sRatio * 100);
      const formatLabel = `🔀 Hibrit (%${longPct} Uzun / %${shortsPct} Shorts)`;

      return {
        contentType: 'hybrid',
        longRatio: lRatio,
        formatLabel,
        monthlyViews: views,
        monetizedViews,
        geoTier,
        geoLabel: (this.GEO_WEIGHTS[geoTier] || this.GEO_WEIGHTS['tier4']).label,
        niche,
        nicheName: (this.NICHE_CPM[niche] || this.NICHE_CPM['general']).name,
        rpm: blendedRpm,
        dailyEarningsUsd: {
          min: Math.round((monthlyEarningsUsd.min / 30) * 10) / 10,
          median: Math.round((monthlyEarningsUsd.median / 30) * 10) / 10,
          max: Math.round((monthlyEarningsUsd.max / 30) * 10) / 10
        },
        monthlyEarningsUsd,
        monthlyEarningsTry: {
          min: Math.round(monthlyEarningsUsd.min * usdToTry),
          median: Math.round(monthlyEarningsUsd.median * usdToTry),
          max: Math.round(monthlyEarningsUsd.max * usdToTry)
        },
        yearlyEarningsUsd: {
          min: Math.round(monthlyEarningsUsd.min * 12),
          median: Math.round(monthlyEarningsUsd.median * 12),
          max: Math.round(monthlyEarningsUsd.max * 12)
        },
        yearlyEarningsTry: {
          min: Math.round(monthlyEarningsUsd.min * 12 * usdToTry),
          median: Math.round(monthlyEarningsUsd.median * 12 * usdToTry),
          max: Math.round(monthlyEarningsUsd.max * 12 * usdToTry)
        },
        tier1PotentialMonthly: tier1Earnings,
        hybridBreakdown: {
          long: { views: longViews, earnings: longRes.monthlyEarningsUsd, rpm: longRes.rpm },
          shorts: { views: shortsViews, earnings: shortsRes.monthlyEarningsUsd, rpm: shortsRes.rpm }
        }
      };
    }

    const cType = contentType === 'long_form' ? 'long_form' : 'shorts';
    const params = this.CONTENT_MULTIPLIERS[cType];
    
    let baseCpm;
    if (customCpm && customCpm > 0) {
      baseCpm = { min: customCpm * 0.8, median: customCpm, max: customCpm * 1.2 };
    } else {
      const nData = this.NICHE_CPM[niche] || this.NICHE_CPM['general'];
      baseCpm = { min: nData.min, median: nData.median, max: nData.max };
    }

    const geo = this.GEO_WEIGHTS[geoTier] || this.GEO_WEIGHTS['tier4'];
    const weight = geo.weight;

    let adjustedCpm = {
      min: baseCpm.min * weight,
      median: baseCpm.median * weight,
      max: baseCpm.max * weight
    };

    let rpm = {};
    const monetizedViews = views * params.monetizationRate;

    if (cType === 'long_form') {
      adjustedCpm.min = Math.max(adjustedCpm.min, params.effectiveCpmMin);
      adjustedCpm.max = Math.min(adjustedCpm.max, params.effectiveCpmMax);
      rpm = {
        min: adjustedCpm.min * params.cpmToRpmRatio,
        median: adjustedCpm.median * params.cpmToRpmRatio,
        max: adjustedCpm.max * params.cpmToRpmRatio
      };
    } else {
      rpm = {
        min: Math.max(params.effectiveRpmMin, adjustedCpm.min * params.shortsPoolMultiplier),
        median: Math.min(params.effectiveRpmMax, adjustedCpm.median * params.shortsPoolMultiplier),
        max: Math.min(params.effectiveRpmMax, adjustedCpm.max * params.shortsPoolMultiplier)
      };
    }

    const monthlyEarningsUsd = {
      min: Math.round((monetizedViews / 1000) * rpm.min * 10) / 10,
      median: Math.round((monetizedViews / 1000) * rpm.median * 10) / 10,
      max: Math.round((monetizedViews / 1000) * rpm.max * 10) / 10
    };

    let tier1Earnings = null;
    if (geoTier !== 'tier1') {
      const tier1Calc = this.calculate({ monthlyViews: views, contentType: cType, niche, geoTier: 'tier1', customCpm, usdToTry });
      tier1Earnings = tier1Calc.monthlyEarningsUsd;
    }

    const formatLabel = cType === 'long_form' ? '🎬 Uzun Video (>8 Dk)' : '⚡ Shorts (Dikey)';

    return {
      contentType: cType,
      formatLabel,
      monthlyViews: views,
      monetizedViews: Math.round(monetizedViews),
      geoTier,
      geoLabel: geo.label,
      niche,
      nicheName: (this.NICHE_CPM[niche] || this.NICHE_CPM['general']).name,
      rpm: {
        min: parseFloat(rpm.min.toFixed(3)),
        median: parseFloat(rpm.median.toFixed(3)),
        max: parseFloat(rpm.max.toFixed(3))
      },
      dailyEarningsUsd: {
        min: Math.round((monthlyEarningsUsd.min / 30) * 10) / 10,
        median: Math.round((monthlyEarningsUsd.median / 30) * 10) / 10,
        max: Math.round((monthlyEarningsUsd.max / 30) * 10) / 10
      },
      monthlyEarningsUsd,
      monthlyEarningsTry: {
        min: Math.round(monthlyEarningsUsd.min * usdToTry),
        median: Math.round(monthlyEarningsUsd.median * usdToTry),
        max: Math.round(monthlyEarningsUsd.max * usdToTry)
      },
      yearlyEarningsUsd: {
        min: Math.round(monthlyEarningsUsd.min * 12),
        median: Math.round(monthlyEarningsUsd.median * 12),
        max: Math.round(monthlyEarningsUsd.max * 12)
      },
      yearlyEarningsTry: {
        min: Math.round(monthlyEarningsUsd.min * 12 * usdToTry),
        median: Math.round(monthlyEarningsUsd.median * 12 * usdToTry),
        max: Math.round(monthlyEarningsUsd.max * 12 * usdToTry)
      },
      tier1PotentialMonthly: tier1Earnings
    };
  }
}

function mapCountryToTier(countryCode) {
  if (!countryCode) return 'tier4';
  const c = countryCode.toUpperCase();
  if (['US', 'GB', 'CA', 'DE'].includes(c)) return 'tier1';
  if (['AU', 'NZ', 'NL', 'SE', 'NO', 'DK'].includes(c)) return 'tier2';
  if (['FR', 'IT', 'ES', 'JP', 'KR', 'SG'].includes(c)) return 'tier3';
  if (['TR', 'BR', 'MX', 'AR', 'RU'].includes(c)) return 'tier4';
  if (['IN', 'PK', 'BD', 'ID', 'PH', 'VN'].includes(c)) return 'tier5';
  return 'tier4';
}

// 🎯 KANAL İÇERİĞİNDEN NİŞ TESPİTİ (başlık + açıklama + son video başlıkları)
// Arama kategorisi yerine kanalın GERÇEK içeriğine göre CPM seçilir.
const NICHE_KEYWORDS = {
  sports: ['extreme sport', 'ekstrem', 'extreme', 'parkour', 'skate', 'surf', 'snowboard', ' ski ', 'climb', 'tırman', 'football', 'futbol', 'soccer', 'basketball', 'basketbol', 'nba', 'ufc', 'mma', 'boxing', 'boks', 'wrestling', 'güreş', 'sport', 'spor', 'athlete', 'sporcu', 'fitness challenge', 'bmx', 'mountain bike', 'base jump', 'skydiv', 'paraşüt', 'dalış', 'hillclimb', 'hill climb'],
  automotive: ['car ', 'cars', 'araba', 'otomobil', 'automotive', 'supercar', 'tesla', 'bmw', 'mercedes', 'ferrari', 'lamborghini', 'drift', 'motorcycle', 'motosiklet', 'truck', 'kamyon', 'offroad', 'off-road', 'car review', 'araç'],
  gaming: ['gaming', 'gameplay', 'oyun', 'minecraft', 'fortnite', 'roblox', 'gta', 'valorant', 'esport', 'speedrun', 'walkthrough', 'pubg', 'cs2', 'playstation', 'xbox'],
  horror: ['horror', 'korku', 'scary', 'creepy', 'paranormal', 'ghost', 'hayalet', 'haunted', 'gizem', 'mystery', 'unsolved', 'true crime', 'cinayet', 'conspiracy', 'creepypasta', 'cursed', 'lanetli', 'vampire', 'vampir', 'dark story'],
  crypto: ['crypto', 'kripto', 'bitcoin', 'ethereum', 'btc', 'altcoin', 'blockchain', 'nft', 'binance'],
  finance: ['finance', 'finans', 'invest', 'yatırım', 'borsa', 'stock market', 'trading', 'forex', 'passive income', 'pasif gelir', 'money', 'wealth', 'millionaire', 'zengin'],
  business: ['business', 'girişim', 'entrepreneur', 'startup', 'marketing', 'pazarlama', 'dropship', 'ecommerce', 'e-ticaret', 'side hustle', 'ai agency'],
  tech: ['technology', 'teknoloji', 'artificial intelligence', 'yapay zeka', ' ai ', 'chatgpt', 'gadget', 'iphone', 'android', 'software', 'yazılım', 'coding', 'robot', 'tech review', 'megaproject', 'engineering', 'mühendis'],
  health: ['health', 'sağlık', 'workout', 'egzersiz', 'diet', 'diyet', 'yoga', 'gym', 'bodybuilding', 'nutrition', 'beslenme', 'weight loss', 'kilo'],
  animals: ['animal', 'hayvan', 'wildlife', 'vahşi yaşam', 'lion', 'aslan', 'elephant', 'fil ', 'shark', 'köpekbalığı', 'dog', 'köpek', 'cat ', 'kedi', 'predator', 'bird', 'kuş', 'pet ', 'nature', 'doğa belgesel'],
  food: ['recipe', 'tarif', 'cooking', 'yemek', 'food', 'chef', 'şef', 'baking', 'pasta', 'kitchen', 'mutfak', 'mukbang', 'street food'],
  travel: ['travel', 'seyahat', 'gezi', 'vlog trip', 'tour', 'destination', 'backpack', 'hotel', 'otel', 'adventure', 'macera'],
  music: ['music', 'müzik', 'song', 'şarkı', 'cover', 'remix', 'lofi', 'piano', 'guitar', 'gitar', 'rapper', 'beat', 'official video', 'lyrics'],
  kids: ['kids', 'çocuk', 'nursery', 'cartoon', 'çizgi film', 'toy', 'oyuncak', 'baby', 'bebek şarkı', 'family', 'aile'],
  entertainment: ['comedy', 'komedi', 'funny', 'komik', 'prank', 'şaka', 'meme', 'challenge', 'reaction', 'skit', 'sketch', 'roast', 'viral'],
  lifestyle: ['vlog', 'lifestyle', 'yaşam', 'daily routine', 'günlük', 'fashion', 'moda', 'beauty', 'güzellik', 'makeup', 'makyaj', 'home decor'],
  education: ['history', 'tarih', 'science', 'bilim', 'documentary', 'belgesel', 'explained', 'psychology', 'psikoloji', 'philosophy', 'felsefe', 'facts', 'bilgi', 'space', 'uzay', 'universe', 'evren', 'ocean', 'okyanus', 'deep sea', 'ancient', 'antik', 'education', 'eğitim', 'learn', 'öğren']
};

function detectChannelNiche({ title = '', description = '', videoTitles = [] }) {
  const scores = {};
  const sources = [
    { text: String(title), weight: 3 },
    { text: String(description).slice(0, 600), weight: 1.5 },
    { text: videoTitles.join(' | '), weight: 2 }
  ];
  for (const src of sources) {
    const hay = ' ' + src.text.toLowerCase() + ' ';
    if (!hay.trim()) continue;
    for (const [niche, words] of Object.entries(NICHE_KEYWORDS)) {
      for (const w of words) {
        if (hay.includes(w)) {
          scores[niche] = (scores[niche] || 0) + src.weight;
        }
      }
    }
  }
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0 || ranked[0][1] < 2) return null;
  return { niche: ranked[0][0], score: ranked[0][1], runnerUp: ranked[1] ? ranked[1][0] : null };
}

function mapNicheIdToCategory(nicheId) {
  const map = {
    scary_stories: 'horror',
    dark_psychology: 'education',
    ai_future: 'tech',
    unsolved_truecrime: 'horror',
    deep_sea_abyss: 'education',
    megaprojects_engineering: 'tech',
    survival_wilderness: 'lifestyle'
  };
  return map[nicheId] || 'education';
}

// ⚡ MOTOR 1: RESMİ YOUTUBE DATA API V3 VİDEO RADARI
async function searchYouTubeApi({ query, fallbackSeeds, minViews = 20000, durationFilter = 'any', maxSubs = '50000', sortBy = 'velocity', timeFilter = '90days' }) {
  const fetchForSeed = async (searchSeed) => {
    let publishedAfter = '';
    const now = new Date();
    if (timeFilter === '7days') {
      publishedAfter = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();
    } else if (timeFilter === '30days') {
      publishedAfter = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString();
    } else if (timeFilter === '90days') {
      publishedAfter = new Date(now.getTime() - 90 * 24 * 3600 * 1000).toISOString();
    } else if (timeFilter === '365days') {
      publishedAfter = new Date(now.getTime() - 365 * 24 * 3600 * 1000).toISOString();
    }

    let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&maxResults=25&q=${encodeURIComponent(searchSeed)}&key=${YOUTUBE_API_KEY}`;
    if (publishedAfter) searchUrl += `&publishedAfter=${publishedAfter}`;
    if (durationFilter === 'short') searchUrl += `&videoDuration=short`;
    else if (durationFilter === 'long') searchUrl += `&videoDuration=long`;
    else if (durationFilter === 'medium') searchUrl += `&videoDuration=medium`;

    const searchData = await fetchJson(searchUrl);
    if (!searchData.items || searchData.items.length === 0) return [];

    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const channelIds = [...new Set(searchData.items.map(item => item.snippet.channelId))].join(',');

    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const channelsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelIds}&key=${YOUTUBE_API_KEY}`;

    const [videoData, channelData] = await Promise.all([
      fetchJson(videoDetailsUrl),
      fetchJson(channelsUrl)
    ]);

    const channelSubsMap = {};
    if (channelData.items) {
      for (const ch of channelData.items) {
        channelSubsMap[ch.id] = parseInt(ch.statistics.subscriberCount || 0, 10);
      }
    }

    const videos = [];
    for (const v of videoData.items || []) {
      const viewCount = parseInt(v.statistics.viewCount || 0, 10);
      if (viewCount < minViews) continue;

      const channelSubCount = channelSubsMap[v.snippet.channelId] || 0;
      if (maxSubs !== 'all') {
        const maxSubsLimit = parseInt(maxSubs, 10);
        if (channelSubCount > maxSubsLimit) continue;
      }

      let outlierRatio = 0;
      let outlierBadge = 'Standart';
      if (channelSubCount > 0) {
        outlierRatio = parseFloat((viewCount / channelSubCount).toFixed(1));
        if (outlierRatio >= 10) outlierBadge = `🔥 ${outlierRatio}x Mega Outlier!`;
        else if (outlierRatio >= 3) outlierBadge = `⚡ ${outlierRatio}x Viral Patlama`;
        else if (outlierRatio >= 1) outlierBadge = `📈 ${outlierRatio}x Trend`;
        else outlierBadge = `${outlierRatio}x Normal`;
      } else {
        outlierBadge = 'Gizli Abone';
      }

      const dur = parseDuration(v.contentDetails.duration);
      if (durationFilter === 'short' && dur.totalSeconds > 60) continue;
      if (durationFilter === 'long' && dur.totalSeconds < 1200) continue;

      const publishedDate = new Date(v.snippet.publishedAt);
      const ageInDays = Math.max(1, (Date.now() - publishedDate.getTime()) / (1000 * 3600 * 24));
      const viewsPerDay = Math.round(viewCount / ageInDays);

      let velocityBadge = '';
      if (viewsPerDay >= 50000) velocityBadge = `🔥 Günde ${viewsPerDay.toLocaleString('tr-TR')} (Süper Hızlı)`;
      else if (viewsPerDay >= 10000) velocityBadge = `⚡ Günde ${viewsPerDay.toLocaleString('tr-TR')} (Hızlı)`;
      else velocityBadge = `📈 Günde ${viewsPerDay.toLocaleString('tr-TR')}`;

      const thumbnails = v.snippet.thumbnails;
      const thumbUrl = (thumbnails.maxres || thumbnails.high || thumbnails.medium || thumbnails.default)?.url || '';
      const published = new Date(v.snippet.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      const daysAgoText = Math.floor(ageInDays) === 0 ? 'Bugün yüklendi' : `${Math.floor(ageInDays)} gün önce`;

      videos.push({
        videoId: v.id,
        title: v.snippet.title,
        viewCount,
        viewsFormatted: viewCount.toLocaleString('tr-TR'),
        channel: v.snippet.channelTitle,
        channelSubs: channelSubCount > 0 ? channelSubCount.toLocaleString('tr-TR') : 'Gizli',
        channelSubCount,
        published,
        daysAgoText,
        viewsPerDay,
        velocityBadge,
        durationText: dur.text,
        durationSeconds: dur.totalSeconds,
        videoType: dur.type,
        outlierRatio,
        outlierBadge,
        thumbnail: thumbUrl,
        url: `https://www.youtube.com/watch?v=${v.id}`
      });
    }
    return videos;
  };

  try {
    let allVideos = await fetchForSeed(query);
    if (allVideos.length < 10 && fallbackSeeds && fallbackSeeds.length > 0) {
      const altSeed = fallbackSeeds.find(s => s !== query);
      if (altSeed) {
        const altVideos = await fetchForSeed(altSeed);
        const existingIds = new Set(allVideos.map(v => v.videoId));
        for (const v of altVideos) {
          if (!existingIds.has(v.videoId)) {
            allVideos.push(v);
            existingIds.add(v.videoId);
          }
        }
      }
    }

    if (sortBy === 'velocity') {
      allVideos.sort((a, b) => b.viewsPerDay - a.viewsPerDay);
    } else if (sortBy === 'outlier') {
      allVideos.sort((a, b) => b.outlierRatio - a.outlierRatio);
    } else if (sortBy === 'duration_desc') {
      allVideos.sort((a, b) => (b.durationSeconds || 0) - (a.durationSeconds || 0));
    } else if (sortBy === 'duration_asc') {
      allVideos.sort((a, b) => (a.durationSeconds || 0) - (b.durationSeconds || 0));
    } else {
      allVideos.sort((a, b) => b.viewCount - a.viewCount);
    }
    return allVideos;
  } catch (error) {
    console.error('API Hatası:', error.message);
    return [];
  }
}

// 🛡️ Hızlı Kanal Abone Sayısı Kazıyıcı (Önbellekli & Paralel)
const subsCache = new Map();

function fetchChannelSubs(channelUrl) {
  if (!channelUrl) return Promise.resolve(0);
  if (subsCache.has(channelUrl)) return Promise.resolve(subsCache.get(channelUrl));

  return new Promise((resolve) => {
    const req = https.get(channelUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 3500
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const match = data.match(/"text":\{"content":"([0-9.]+[KMBkmb]?)\s+subscribers"\}/i)
                   || data.match(/"accessibilityLabel":"([0-9.]+\s+[a-zA-Z]+)\s+subscribers"/i);
        let count = 0;
        if (match) {
          const raw = match[1].toLowerCase().trim();
          if (raw.includes('k') || raw.includes('thousand')) count = Math.round(parseFloat(raw) * 1000);
          else if (raw.includes('m') || raw.includes('million')) count = Math.round(parseFloat(raw) * 1000000);
          else if (raw.includes('b') || raw.includes('billion')) count = Math.round(parseFloat(raw) * 1000000000);
          else count = parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;
        }
        subsCache.set(channelUrl, count);
        resolve(count);
      });
    });
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
  });
}

// 🛡️ MOTOR 2: KOTASIZ AÇIK KAYNAK RADARI (yt-dlp)
async function searchOpenSourceScraper({ query, minViews = 20000, durationFilter = 'any', maxSubs = 'all', sortBy = 'outlier' }) {
  try {
    const searchCount = 35;
    const ytdlpArgs = [
      `ytsearch${searchCount}:${query}`,
      '--dump-json',
      '--flat-playlist',
      '--no-warnings',
      '--ignore-errors'
    ];

    const proc = spawnSync('yt-dlp', ytdlpArgs, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    if (!proc.stdout) return [];

    const lines = proc.stdout.trim().split('\n');
    const rawItems = [];
    for (const line of lines) {
      try {
        const item = JSON.parse(line.trim());
        if (!item || !item.id) continue;
        const viewCount = item.view_count || 0;
        if (viewCount < minViews) continue;
        const durationSeconds = item.duration || 0;
        if (durationFilter === 'short' && durationSeconds > 60) continue;
        if (durationFilter === 'long' && durationSeconds < 1200) continue;
        rawItems.push(item);
      } catch (e) {}
    }

    const uniqueChannelUrls = [...new Set(rawItems.map(it => it.uploader_url || it.channel_url).filter(Boolean))];
    const subsPromises = uniqueChannelUrls.map(url => fetchChannelSubs(url).then(subs => ({ url, subs })));
    const subsResults = await Promise.all(subsPromises);
    const subsMap = {};
    for (const r of subsResults) subsMap[r.url] = r.subs;

    const videos = [];
    for (const item of rawItems) {
      const viewCount = item.view_count || 0;
      const channelUrl = item.uploader_url || item.channel_url;
      const channelSubCount = subsMap[channelUrl] || 0;

      if (maxSubs !== 'all') {
        const maxSubsLimit = parseInt(maxSubs, 10);
        if (channelSubCount > maxSubsLimit) continue;
      }

      let outlierRatio = 0;
      let outlierBadge = 'Standart';
      if (channelSubCount > 0) {
        outlierRatio = parseFloat((viewCount / channelSubCount).toFixed(1));
        if (outlierRatio >= 10) outlierBadge = `🔥 ${outlierRatio}x Mega Outlier!`;
        else if (outlierRatio >= 3) outlierBadge = `⚡ ${outlierRatio}x Viral Patlama`;
        else if (outlierRatio >= 1) outlierBadge = `📈 ${outlierRatio}x Trend`;
        else outlierBadge = `${outlierRatio}x Normal`;
      } else {
        outlierBadge = 'Gizli Abone';
      }

      const durationSeconds = item.duration || 0;
      let durationText = item.duration_string || '0:00';
      let videoType = '⏱️ Standart Video';
      if (durationSeconds <= 60) videoType = '⚡ Shorts';
      else if (durationSeconds >= 1200) videoType = '🎬 Uzun Film / Belgesel (>20 Dk)';

      const thumbUrl = (item.thumbnails && item.thumbnails.length > 0)
        ? item.thumbnails[item.thumbnails.length - 1].url
        : `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;

      const channelName = item.uploader || item.channel || 'Bilinmiyor';

      videos.push({
        videoId: item.id,
        title: item.title,
        viewCount,
        viewsFormatted: viewCount.toLocaleString('tr-TR'),
        channel: channelName,
        channelSubs: channelSubCount > 0 ? channelSubCount.toLocaleString('tr-TR') : 'Gizli',
        channelSubCount,
        published: 'Web İndeksi',
        daysAgoText: 'Açık Kaynak (yt-dlp)',
        viewsPerDay: 0,
        velocityBadge: '🛡️ Kotasız Motor',
        durationText,
        durationSeconds,
        videoType,
        outlierRatio,
        outlierBadge,
        thumbnail: thumbUrl,
        url: `https://www.youtube.com/watch?v=${item.id}`
      });
    }

    if (sortBy === 'views') {
      videos.sort((a, b) => b.viewCount - a.viewCount);
    } else if (sortBy === 'duration_desc') {
      videos.sort((a, b) => (b.durationSeconds || 0) - (a.durationSeconds || 0));
    } else if (sortBy === 'duration_asc') {
      videos.sort((a, b) => (a.durationSeconds || 0) - (b.durationSeconds || 0));
    } else {
      videos.sort((a, b) => (b.outlierRatio - a.outlierRatio) || (b.viewCount - a.viewCount));
    }
    return videos;
  } catch (err) {
    console.error('[Kotasız Radar Exception]:', err.message);
    return [];
  }
}

// 🐣 MOTOR 3: BEBEK & MİKRO KANAL AVCISI (Breakout Channel Radar)
async function searchBreakoutChannelsApi({ query, fallbackSeeds = [], nicheId = 'general', maxDays = 90, maxSubs = 15000, minAvgViews = 2500, minRecentViews = 0, sortBy = 'breakout' }) {
  try {
    const lookbackDays = Math.max(180, maxDays * 2);
    const publishedAfter = new Date(Date.now() - lookbackDays * 24 * 3600 * 1000).toISOString();
    
    // 1. Tohum aramasından video ve kanal ID'lerini çek (50 sonuç)
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&maxResults=50&q=${encodeURIComponent(query)}&publishedAfter=${publishedAfter}&key=${YOUTUBE_API_KEY}`;
    let searchData = await fetchJson(searchUrl);
    let rawChannelIds = (searchData.items || []).map(item => item.snippet.channelId);

    // Eğer tohum az kanal getirdiyse alternatif tohumdan da besle
    if (rawChannelIds.length < 25 && fallbackSeeds && fallbackSeeds.length > 0) {
      const altSeed = fallbackSeeds.find(s => s !== query);
      if (altSeed) {
        try {
          const altUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&maxResults=35&q=${encodeURIComponent(altSeed)}&publishedAfter=${publishedAfter}&key=${YOUTUBE_API_KEY}`;
          const altData = await fetchJson(altUrl);
          if (altData.items) {
            rawChannelIds.push(...altData.items.map(item => item.snippet.channelId));
          }
        } catch (e) {}
      }
    }

    const uniqueChannelIds = [...new Set(rawChannelIds)].slice(0, 50);
    if (uniqueChannelIds.length === 0) return [];

    const channelDetailsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${uniqueChannelIds.join(',')}&key=${YOUTUBE_API_KEY}`;
    const channelData = await fetchJson(channelDetailsUrl);
    if (!channelData.items) return [];

    const matchedChannels = [];
    for (const c of channelData.items) {
      const pubDate = new Date(c.snippet.publishedAt);
      const ageDays = Math.max(1, Math.floor((Date.now() - pubDate.getTime()) / (1000 * 3600 * 24)));
      const subs = parseInt(c.statistics.subscriberCount || 0, 10);
      const totalViews = parseInt(c.statistics.viewCount || 0, 10);
      const videoCount = parseInt(c.statistics.videoCount || 1, 10);
      const avgViews = Math.round(totalViews / videoCount);

      // Bebek kanal filtreleri
      if (ageDays > maxDays) continue;
      if (subs > maxSubs && maxSubs > 0) continue;
      if (avgViews < minAvgViews) continue;

      // 🔍 SON VİDEOLARIN CANLILIĞI, SÜRE VE FORMAT ANALİZİ
      const uploadsId = c.contentDetails?.relatedPlaylists?.uploads;
      let recentVideos = [];
      let recentAvgViews = 0;
      let channelFormat = 'shorts';
      let longRatio = 0;
      let formatLabel = '⚡ Shorts (Dikey)';
      let formatBadgeClass = 'text-amber-300 bg-amber-950/40 border-amber-800/60';

      if (uploadsId) {
        try {
          const plUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&playlistId=${uploadsId}&maxResults=6&key=${YOUTUBE_API_KEY}`;
          const plData = await fetchJson(plUrl);
          if (plData.items && plData.items.length > 0) {
            const vIds = plData.items.map(x => x.contentDetails.videoId).join(',');
            const vStatUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${vIds}&key=${YOUTUBE_API_KEY}`;
            const vStatData = await fetchJson(vStatUrl);
            if (vStatData.items) {
              recentVideos = vStatData.items.map(v => {
                const vc = parseInt(v.statistics.viewCount || 0, 10);
                const durInfo = parseDuration(v.contentDetails?.duration || '');
                return {
                  id: v.id,
                  title: v.snippet.title,
                  views: vc,
                  viewsFormatted: vc >= 1000000 ? (vc / 1000000).toFixed(1) + 'M' : vc >= 1000 ? (vc / 1000).toFixed(1) + 'K' : vc.toString(),
                  durationSeconds: durInfo.totalSeconds,
                  durationText: durInfo.text,
                  thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
                  url: `https://www.youtube.com/watch?v=${v.id}`
                };
              });
              const totalRecentViews = recentVideos.reduce((sum, v) => sum + v.views, 0);
              recentAvgViews = Math.round(totalRecentViews / (recentVideos.length || 1));

              // Akıllı Format Tespiti (Shorts <= 180s veya #shorts etiketi, Uzun > 180s)
              const shortsRegex = /#(shorts|short|ytshorts|youtubeshorts|reels|tiktok)\b/i;
              
              const classified = recentVideos.map(v => {
                const dur = v.durationSeconds || 0;
                const isShortTag = shortsRegex.test(v.title || '');
                // YouTube Resmi Kuralı: 180 saniyeye (3 dk) kadar olan veya başlığında #shorts olan videolar Short'tur
                const isShort = dur <= 180 || isShortTag;
                const isLong = dur > 180 && !isShortTag;
                return { isShort, isLong, dur };
              });

              const longCount = classified.filter(x => x.isLong).length;
              const shortsCount = classified.filter(x => x.isShort).length;
              const totalSample = classified.length;
              const avgDur = totalSample > 0 ? classified.reduce((acc, x) => acc + x.dur, 0) / totalSample : 0;

              longRatio = totalSample > 0 ? parseFloat((longCount / totalSample).toFixed(2)) : 0;

              // Eğer ortalama video süresi 3 dakikadan kısaysa VEYA uzun video oranı %25'in altındaysa net SHORTS'tur!
              if (avgDur <= 180 || longRatio <= 0.25 || longCount === 0) {
                channelFormat = 'shorts';
                formatLabel = '⚡ Shorts (Dikey)';
                formatBadgeClass = 'text-amber-300 bg-amber-950/40 border-amber-800/60';
              } else if (longRatio >= 0.70 && avgDur > 240) {
                channelFormat = 'long_form';
                formatLabel = '🎬 Uzun Video';
                formatBadgeClass = 'text-cyan-300 bg-cyan-950/40 border-cyan-800/60';
              } else {
                channelFormat = 'hybrid';
                const longPct = Math.round(longRatio * 100);
                const shortsPct = 100 - longPct;
                formatLabel = `🔀 Hibrit (%${longPct} Uzun / %${shortsPct} Shorts)`;
                formatBadgeClass = 'text-violet-300 bg-violet-950/40 border-violet-800/60';
              }
            }
          }
        } catch (e) {}
      }

      // 🛡️ SÖNÜK / TEK ATIMLIK BARUT KANALLARI ELEME
      if (minRecentViews > 0 && recentVideos.length > 0 && recentAvgViews < minRecentViews) {
        continue;
      }

      const scoreInfo = scoreBreakoutChannel({ ageDays, subs, totalViews, videoCount });

      // İstikrar Rozeti
      let consistencyBadge = 'Canlı İvme';
      let consistencyClass = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
      if (recentAvgViews >= 5000) {
        consistencyBadge = `🔥 Süper İstikrarlı (${recentAvgViews.toLocaleString('tr-TR')} son ort.)`;
        consistencyClass = 'text-amber-300 bg-amber-950/40 border-amber-800/60';
      } else if (recentAvgViews >= 1500) {
        consistencyBadge = `🟢 Canlı & İstikrarlı (${recentAvgViews.toLocaleString('tr-TR')} son ort.)`;
        consistencyClass = 'text-emerald-300 bg-emerald-950/40 border-emerald-800/60';
      } else if (recentAvgViews > 0) {
        consistencyBadge = `⚠️ Son Videolar Zayıf (${recentAvgViews.toLocaleString('tr-TR')} son ort.)`;
        consistencyClass = 'text-rose-400 bg-rose-950/40 border-rose-800/60';
      }

      // 💰 AYLIK KAZANÇ TAHMİNİ (GitHub AI Modeli - Format Duyarlı)
      const country = c.snippet.country || '';
      const geoTier = mapCountryToTier(country);
      const monthlyEstimatedViews = Math.round((totalViews / Math.max(1, ageDays)) * 30);

      // 🎯 Niş: önce kanalın gerçek içeriğinden tespit et, bulunamazsa arama kategorisine düş
      const detected = detectChannelNiche({
        title: c.snippet.title,
        description: c.snippet.description || '',
        videoTitles: recentVideos.map(v => v.title)
      });
      const resolvedNiche = detected ? detected.niche : mapNicheIdToCategory(nicheId);
      const nicheSource = detected ? 'detected' : 'search';

      const earningsData = YouTubeRevenueCalculator.calculate({
        monthlyViews: monthlyEstimatedViews,
        contentType: channelFormat,
        longRatio: longRatio,
        niche: resolvedNiche,
        geoTier: geoTier
      });
      earningsData.nicheSource = nicheSource;

      const t = c.snippet.thumbnails;
      const avatar = (t?.high || t?.medium || t?.default)?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.snippet.title)}&background=0284c7&color=fff&bold=true`;
      const rawHandle = c.snippet.customUrl ? c.snippet.customUrl.replace(/^@+/, '') : c.snippet.title.replace(/\s+/g, '').toLowerCase();
      const handle = `@${rawHandle}`;

      matchedChannels.push({
        channelId: c.id,
        title: c.snippet.title,
        handle,
        avatar,
        country: country || 'Global',
        description: c.snippet.description || '',
        publishedAt: pubDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
        ageDays,
        ageDaysText: `${ageDays} gün önce kuruldu`,
        subs,
        subsFormatted: subs > 0 ? subs.toLocaleString('tr-TR') : 'Gizli',
        totalViews,
        totalViewsFormatted: totalViews.toLocaleString('tr-TR'),
        videoCount,
        avgViews,
        avgViewsFormatted: avgViews.toLocaleString('tr-TR'),
        recentAvgViews,
        recentAvgViewsFormatted: recentAvgViews.toLocaleString('tr-TR'),
        consistencyBadge,
        consistencyClass,
        channelFormat,
        longRatio,
        formatLabel,
        formatBadgeClass,
        earnings: earningsData,
        breakoutScore: scoreInfo.totalScore,
        viewSubRatio: scoreInfo.viewSubRatio,
        uploadFreq: scoreInfo.uploadFreq,
        scoreInfo,
        topVideos: recentVideos.slice(0, 3),
        channelUrl: `https://www.youtube.com/channel/${c.id}`
      });
    }

    if (sortBy === 'recent') {
      matchedChannels.sort((a, b) => b.recentAvgViews - a.recentAvgViews);
    } else if (sortBy === 'ratio') {
      matchedChannels.sort((a, b) => b.viewSubRatio - a.viewSubRatio);
    } else if (sortBy === 'age') {
      matchedChannels.sort((a, b) => a.ageDays - b.ageDays);
    } else if (sortBy === 'views') {
      matchedChannels.sort((a, b) => b.avgViews - a.avgViews);
    } else {
      matchedChannels.sort((a, b) => b.breakoutScore - a.breakoutScore);
    }

    return matchedChannels;
  } catch (err) {
    console.error('[Bebek Kanal Radarı API Hatası]:', err.message);
    return [];
  }
}

// 🔬 PySceneDetect ile Otomatik Sahne & Keyframe Tespiti
function runPySceneDetect(videoUrl, videoId, videoTitle, category, keyword) {
  try {
    const scenesRelDir = `scenes_${videoId}`;
    const scenesTargetDir = path.join(__dirname, '03 - Viral Video Röntgenleri', scenesRelDir);
    const pythonScript = path.join(__dirname, 'reverse_engineer_video.py');
    
    console.log(`[PySceneDetect] Başlatılıyor: ${videoUrl} [Niş: ${category}]`);
    const res = spawnSync('python', [pythonScript, videoUrl, scenesTargetDir, videoTitle || 'AI Video', category || '', keyword || ''], {
      cwd: __dirname,
      encoding: 'utf-8',
      timeout: 180000
    });
    
    const jsonPath = path.join(scenesTargetDir, 'storyboard.json');
    if (fs.existsSync(jsonPath)) {
      return {
        success: true,
        data: JSON.parse(fs.readFileSync(jsonPath, 'utf-8')),
        scenesRelDir
      };
    }
    return { success: false, error: res.stderr || 'Storyboard üretilemedi' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 📝 Obsidian'a Video Röntgeni Kaydetme
function saveToObsidian(video, category, keyword) {
  const sanitizedTitle = video.title.replace(/[\\/:*?"<>|]/g, '').trim().slice(0, 45);
  const fileName = `VIRAL_${sanitizedTitle}_${video.videoId}.md`;
  const targetDir = path.join(__dirname, '03 - Viral Video Röntgenleri');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, fileName);

  const pydetect = runPySceneDetect(video.url, video.videoId, video.title, category, keyword);

  let sceneSection = '';
  let sceneCount = 0;
  if (pydetect.success && pydetect.data && pydetect.data.scenes && pydetect.data.scenes.length > 0) {
    const d = pydetect.data;
    sceneCount = d.scene_count;
    sceneSection = `
---

## 🎞️ PySceneDetect ile Çıkarılan Tam Storyboard (Görsel Film Şeridi):

${d.contact_sheet_name ? `![[${pydetect.scenesRelDir}/${d.contact_sheet_name}]]` : ''}

### ⏱️ Saniye Saniye Sahne ve Kurgu Dökümü (${d.scene_count} Sahne):

| Sahne No | Zaman Aralığı | Süre (sn) | Sahne Karesi | Kurgu & Ritim Notu |
| :---: | :---: | :---: | :---: | :--- |
`;

    d.scenes.forEach(s => {
      let rhythmNote = 'Geçiş sahnesi';
      if (s.scene_index === 1) rhythmNote = '⚡ Açılış Kancası (İlk saniye dikkat çekme)';
      else if (s.scene_index === 2) rhythmNote = '💥 Şok / Aksiyon / Gerilim tırmandırma';
      else if (s.scene_index === d.scenes.length) rhythmNote = '🔄 Zirve Noktası / Sonsuz Döngü (Loop)';
      else if (s.duration_seconds <= 1.5) rhythmNote = '⚡ Hızlı kesme (Yüksek tempo/adrenalin)';
      else rhythmNote = '🎬 Sinematik akış (Duygusal derinlik)';

      sceneSection += `| **Sahne ${s.scene_index}** | \`${s.start_time} - ${s.end_time}\` | **${s.duration_seconds}s** | ![[${pydetect.scenesRelDir}/${s.keyframe}]] | ${rhythmNote} |\n`;
    });

    const avgDuration = (d.scenes.reduce((acc, x) => acc + (x.duration_seconds || 0), 0) / d.scene_count).toFixed(1);
    sceneSection += `
> **Kurgu Ritim Formülü:** Bu video toplam **${d.scene_count} sahneden** oluşuyor. Ortalama sahne kesme aralığı **${avgDuration} saniye**.

---

## 🔬 Yeniden Üretim İçin Hazır Text-to-Video Promptları:
`;

    d.scenes.forEach(s => {
      sceneSection += `
### 📍 Sahne ${s.scene_index} (${s.start_time} - ${s.end_time} | Süre: ${s.duration_seconds}s)
\`\`\`text
${s.prompt || 'Cinematic shot, hyperrealistic'}
\`\`\`
`;
    });
  }

  const content = `# 🎬 Viral Video Röntgeni: ${video.title}

- **Kategori / Niş:** ${category}
- **Arama Kancası:** \`${keyword}\`
- **Video Türü / Süresi:** ${video.videoType} (${video.durationText})
- **Toplam İzlenme:** ${video.viewsFormatted} görüntüleme
- **İzlenme Hızı (Velocity):** ${video.velocityBadge} (${video.daysAgoText})
- **Kanal:** ${video.channel} (Abone: ${video.channelSubs})
- **Outlier Çarpanı:** ${video.outlierBadge} (${video.outlierRatio}x)
- **Yayın Tarihi:** ${video.published} (${video.daysAgoText})
- **Video Linki:** [YouTube'da Aç ve İncele](${video.url})
- **Thumbnail:** ![](${video.thumbnail})
- **Analiz Tarihi:** ${new Date().toLocaleDateString('tr-TR')}
${sceneSection}
---

## 🧐 Algoritmik Başarı Röntgeni:
* **Hız Durumu:** Bu video ${video.daysAgoText} yüklenmiş ve şu anda **${video.velocityBadge}** temposuyla izleniyor! Algoritma videoyu sıcak tutuyor.
* **Kanal Boyutu & Patlama:** Kanalın ${video.channelSubs} abonesi olmasına karşın video **${video.viewsFormatted}** izlenme almış (${video.outlierBadge}).

---

## 🎯 Bizim İçin İçerik Üretim Aksiyonları:
- [ ] İlk 5 saniye kancasını (görsel şok + ses tasarımı) not al.
- [ ] Sahnelerin ritim kurgusunu CapCut taslağına dök.
- [ ] Dilsiz formatla küresel algoritmayı hedefle.

---

## 🔗 İlgili Vault Belgeleri:
- [[PROJE_YOL_HARITASI]]
- [[YOUTUBE_KOTASIZ_RADAR_VE_API_YEDEKLEME_PLANI]]
- [[GITHUB_ACIK_KAYNAK_CEVHERLERI_VE_ENTEGRASYON_TAKIBI]]
`;

  fs.writeFileSync(targetPath, content, 'utf-8');
  return { fileName, sceneCount };
}

// 🐣 Obsidian'a Kanal Karnesi Kaydetme
function saveChannelToObsidian(channel, category, keyword) {
  const sanitizedTitle = channel.title.replace(/[\\/:*?"<>|]/g, '').trim().slice(0, 40);
  const fileName = `KANAL_${sanitizedTitle}_${channel.channelId}.md`;
  const targetDir = path.join(__dirname, '02 - Kanal Analizleri');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, fileName);

  let topVideosSection = '';
  if (channel.topVideos && channel.topVideos.length > 0) {
    topVideosSection = channel.topVideos.map((v, i) => `
### 🎬 Video ${i + 1}: ${v.title}
- **Video Linki:** [YouTube'da İzle](${v.url})
- ![](${v.thumbnail})
`).join('\n');
  }

  const content = `# 🐣 Kuluçka Kanal Röntgeni: ${channel.title} (${channel.handle})

> **Breakout Skoru:** ⭐ **${channel.breakoutScore} / 100**
> **Kanal Yaşı:** 🎂 **${channel.ageDaysText}** (${channel.publishedAt})

---

## 📊 Temel Metrikler & İvme Raporu:
- **Abone Sayısı:** ${channel.subsFormatted} abone
- **Toplam Kanal İzlenmesi:** ${channel.totalViewsFormatted} görüntüleme
- **Video Başı Ortalama İzlenme:** ${channel.avgViewsFormatted} izlenme / video
- **İzlenme / Abone Oranı (Outlier):** 🔥 **${channel.viewSubRatio}x**
- **Yükleme Sıklığı:** Günde **${channel.uploadFreq}** video
- **Toplam Video Sayısı:** ${channel.videoCount} video
- **Niş / Kategori:** ${category} (Arama: \`${keyword}\`)
- **Kanal Linki:** [${channel.title} YouTube Kanalı](${channel.channelUrl})

---

## 💰 Tahmini Kazanç & RPM Analizi (GitHub AI Algoritması):
- **Tahmini Aylık İzlenme:** ~${channel.earnings?.monthlyViews?.toLocaleString('tr-TR') || 'N/A'} izlenme
- **Tahmini Aylık Gelir:** **$${channel.earnings?.monthlyEarningsUsd?.min || '0'} - $${channel.earnings?.monthlyEarningsUsd?.max || '0'} / Ay** (≈ ₺${(channel.earnings?.monthlyEarningsTry?.median || 0).toLocaleString('tr-TR')})
- **Yıllık Gelir Projeksiyonu:** **$${(channel.earnings?.yearlyEarningsUsd?.median || 0).toLocaleString('tr-TR')} / Yıl**
- **Kanal Coğrafyası & RPM:** ${channel.earnings?.geoLabel || 'Global'} (RPM: ~$${channel.earnings?.rpm?.median || '0'} / 1K izlenme)
${channel.earnings?.tier1PotentialMonthly ? `- **🇺🇸 Tier 1 (ABD) Arbitraj Fırsatı:** Kanal ABD kitlesine hitap etseydi aylık geliri **$${channel.earnings.tier1PotentialMonthly.median}** olacaktı!` : ''}

---

## 🏆 Kanalın En Çok İzlenen İlk 3 Videosu:
${topVideosSection}

---

## 🧠 Algoritmik Başarı Sırrı (Neden Patladı?):
1. **Erken Aşama Algoritma İvmesi:** Kanal henüz **${channel.ageDays} günlük** olmasına rağmen video başına ortalama **${channel.avgViewsFormatted}** izlenme yakalayarak YouTube keşfet havuzuna girmeyi başarmış.
2. **Kitle İlgi Çarpanı:** Abone sayısının **${channel.viewSubRatio} katı** toplam izlenmeye ulaşması, kanalın tamamen algoritmik tavsiyeler ve yabancı kitleler üzerinden beslendiğini kanıtlıyor.
3. **Üretim Ritmi:** Kanal günde ortalama **${channel.uploadFreq} video** paylaşarak algoritmayı sürekli sıcak tutuyor.

---

## 🎯 Bizim İçin Alınacak Dersler:
- [ ] Bu kanalın en çok izlenen 3 videosunun kanca tekniğini ve görsel ritmini modelle.
- [ ] Başlık formatını ve thumbnail kontrastını kendi projelerimize uyarla.
- [ ] Konuşmasız (dilsiz) global ses tasarımı uygulayarak küresel kitleyi hedefle.

---

## 🔗 İlgili Vault Belgeleri:
- [[PROJE_YOL_HARITASI]]
- [[YOUTUBE_KOTASIZ_RADAR_VE_API_YEDEKLEME_PLANI]]
- [[GITHUB_ACIK_KAYNAK_CEVHERLERI_VE_ENTEGRASYON_TAKIBI]]
- [[EXTREME_RIDE_AI_ENDURO_KANAL_ANALIZI]]
`;

  fs.writeFileSync(targetPath, content, 'utf-8');
  return { fileName };
}

// HTTP SUNUCUSU VE ROUTER
const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost:3000');

  if (reqUrl.pathname === '/' && req.method === 'GET') {
    const htmlFile = path.join(__dirname, 'radar_studio.html');
    if (fs.existsSync(htmlFile)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(htmlFile, 'utf-8'));
    } else {
      res.writeHead(404);
      res.end('HTML file not found');
    }
  } else if (reqUrl.pathname === '/api/niches' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(VIRAL_NICHES));
  } else if (reqUrl.pathname === '/api/discover' && req.method === 'GET') {
    const nicheParam = reqUrl.searchParams.get('niche') || 'random';
    const customQuery = reqUrl.searchParams.get('customQuery') || '';
    const timeFilter = reqUrl.searchParams.get('timeFilter') || '90days';
    const durationParam = reqUrl.searchParams.get('duration') || 'any';
    const minViews = parseInt(reqUrl.searchParams.get('minViews') || '20000', 10);
    const maxSubs = reqUrl.searchParams.get('maxSubs') || '50000';
    const sortBy = reqUrl.searchParams.get('sortBy') || 'velocity';

    let selectedNiche;
    if (nicheParam === 'random') {
      selectedNiche = VIRAL_NICHES[Math.floor(Math.random() * VIRAL_NICHES.length)];
    } else {
      selectedNiche = VIRAL_NICHES.find(n => n.id === nicheParam) || VIRAL_NICHES[0];
    }

    let querySeed = '';
    let categoryName = selectedNiche.category;
    let fallbackSeeds = selectedNiche.seeds;

    if (customQuery && customQuery.trim().length > 0) {
      querySeed = customQuery.trim();
      categoryName = `🔍 Özel Arama: "${querySeed}"`;
      fallbackSeeds = [];
    } else {
      querySeed = selectedNiche.seeds[Math.floor(Math.random() * selectedNiche.seeds.length)];
    }

    const videos = await searchYouTubeApi({
      query: querySeed,
      fallbackSeeds,
      minViews,
      durationFilter: durationParam,
      maxSubs,
      sortBy,
      timeFilter
    });

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      category: categoryName,
      keyword: querySeed,
      engine: 'youtube_api_v3',
      videos
    }));
  } else if (reqUrl.pathname === '/api/discover-free' && req.method === 'GET') {
    const nicheParam = reqUrl.searchParams.get('niche') || 'random';
    const customQuery = reqUrl.searchParams.get('customQuery') || '';
    const durationParam = reqUrl.searchParams.get('duration') || 'any';
    const minViews = parseInt(reqUrl.searchParams.get('minViews') || '20000', 10);
    const maxSubs = reqUrl.searchParams.get('maxSubs') || 'all';
    const sortBy = reqUrl.searchParams.get('sortBy') || 'outlier';

    let selectedNiche;
    if (nicheParam === 'random') {
      selectedNiche = VIRAL_NICHES[Math.floor(Math.random() * VIRAL_NICHES.length)];
    } else {
      selectedNiche = VIRAL_NICHES.find(n => n.id === nicheParam) || VIRAL_NICHES[0];
    }

    let querySeed = '';
    let categoryName = selectedNiche.category;

    if (customQuery && customQuery.trim().length > 0) {
      querySeed = customQuery.trim();
      categoryName = `🛡️ Kotasız Arama: "${querySeed}"`;
    } else {
      querySeed = selectedNiche.seeds[Math.floor(Math.random() * selectedNiche.seeds.length)];
    }

    const videos = await searchOpenSourceScraper({
      query: querySeed,
      minViews,
      durationFilter: durationParam,
      maxSubs,
      sortBy
    });

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      category: categoryName,
      keyword: querySeed,
      engine: 'open_source_ytdlp',
      videos
    }));
  } else if (reqUrl.pathname === '/api/discover-channels' && req.method === 'GET') {
    const nicheParam = reqUrl.searchParams.get('niche') || 'random';
    const customQuery = reqUrl.searchParams.get('customQuery') || '';
    const maxDays = parseInt(reqUrl.searchParams.get('maxDays') || '60', 10);
    const maxSubsParam = reqUrl.searchParams.get('maxSubs') || '10000';
    const maxSubs = maxSubsParam === 'all' ? 0 : parseInt(maxSubsParam, 10);
    const minAvgViews = parseInt(reqUrl.searchParams.get('minAvgViews') || '2500', 10);
    const minRecentViewsParam = reqUrl.searchParams.get('minRecentViews') || '0';
    const minRecentViews = minRecentViewsParam === 'all' ? 0 : parseInt(minRecentViewsParam, 10);
    const sortBy = reqUrl.searchParams.get('sortBy') || 'breakout';

    let selectedNiche;
    if (nicheParam === 'random') {
      selectedNiche = VIRAL_NICHES[Math.floor(Math.random() * VIRAL_NICHES.length)];
    } else {
      selectedNiche = VIRAL_NICHES.find(n => n.id === nicheParam) || VIRAL_NICHES[0];
    }

    let querySeed = '';
    let categoryName = selectedNiche.category;

    if (customQuery && customQuery.trim().length > 0) {
      querySeed = customQuery.trim();
      categoryName = `🐣 Bebek Kanal Taraması: "${querySeed}"`;
    } else {
      querySeed = selectedNiche.seeds[Math.floor(Math.random() * selectedNiche.seeds.length)];
    }

    const channels = await searchBreakoutChannelsApi({
      query: querySeed,
      fallbackSeeds: selectedNiche.seeds || [],
      nicheId: selectedNiche.id,
      maxDays,
      maxSubs,
      minAvgViews,
      minRecentViews,
      sortBy
    });

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      category: categoryName,
      keyword: querySeed,
      engine: 'youtube_api_breakout_channels',
      channels
    }));
  } else if (reqUrl.pathname === '/api/calculate-earnings' && req.method === 'GET') {
    const monthlyViews = parseInt(reqUrl.searchParams.get('views') || '100000', 10);
    const contentType = reqUrl.searchParams.get('type') || 'shorts';
    const longRatio = parseFloat(reqUrl.searchParams.get('longRatio') || '0.5');
    const niche = reqUrl.searchParams.get('niche') || 'general';
    const geoTier = reqUrl.searchParams.get('tier') || 'tier1';
    const customCpm = parseFloat(reqUrl.searchParams.get('cpm') || '0');

    const result = YouTubeRevenueCalculator.calculate({
      monthlyViews,
      contentType,
      longRatio,
      niche,
      geoTier,
      customCpm: customCpm > 0 ? customCpm : null
    });

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(result));
  } else if (reqUrl.pathname.startsWith('/tasks/')) {
    const rel = decodeURIComponent(reqUrl.pathname.replace(/^\/tasks\//, ''));
    const filePath = path.join(__dirname, 'MoneyPrinterTurbo', 'storage', 'tasks', rel);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      return res.end('File not found');
    }
    const stat = fs.statSync(filePath);
    const range = req.headers.range;
    const contentType = filePath.endsWith('.mp4') ? 'video/mp4' : filePath.endsWith('.mp3') ? 'audio/mpeg' : 'application/octet-stream';
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': contentType,
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } else if (reqUrl.pathname === '/api/generate-documentary' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const {
          script,
          aspect = '16:9',
          voiceName = 'en-US-ChristopherNeural',
          bgmType = 'random',
          bgmVolume = 0.15,
          subtitleEnabled = true,
          videoSource = 'local',
          customMaterial = '',
          pexelsApiKey = ''
        } = JSON.parse(body);

        if (!script || !script.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Senaryo metni boş olamaz.' }));
        }

        // If Pexels key provided, update config.toml
        if (pexelsApiKey && pexelsApiKey.trim()) {
          const configTomlPath = path.join(__dirname, 'MoneyPrinterTurbo', 'config.toml');
          if (fs.existsSync(configTomlPath)) {
            let conf = fs.readFileSync(configTomlPath, 'utf-8');
            conf = conf.replace(/pexels_api_keys\s*=\s*\[.*?\]/, `pexels_api_keys = ["${pexelsApiKey.trim()}"]`);
            fs.writeFileSync(configTomlPath, conf, 'utf-8');
          }
        }

        const pythonExe = path.join(__dirname, 'MoneyPrinterTurbo', '.venv', 'Scripts', 'python.exe');
        const cliPy = path.join(__dirname, 'MoneyPrinterTurbo', 'cli.py');

        const args = [
          cliPy,
          '--video-script', script.trim(),
          '--video-aspect', aspect,
          '--voice-name', voiceName,
          '--bgm-type', bgmType,
          '--bgm-volume', String(bgmVolume)
        ];

        if (subtitleEnabled) {
          args.push('--subtitle-enabled');
        } else {
          args.push('--no-subtitle-enabled');
        }

        if (videoSource === 'local') {
          const localVideosDir = path.join(__dirname, 'MoneyPrinterTurbo', 'storage', 'local_videos');
          const clipBaby = path.join(localVideosDir, 'elephant_broll_1.mp4');
          const clipFamily = path.join(localVideosDir, 'elephant_broll_2.mp4');
          const clipHyenas = path.join(localVideosDir, 'hyenas_scene.mp4');
          const clipHerd = path.join(localVideosDir, 'elephant_herd_charge.mp4');

          // 🧠 AKILLI SEMANTİK SAHNE EŞLEYİCİ (short-video-maker & ShortGPT Mimarisi)
          // Senaryodaki her cümlenin anahtar kelimelerini analiz ederek sahneye uygun videoyu sıraya dizer:
          const sentences = script.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
          let orderedMaterials = [];

          for (const s of sentences) {
            const lower = s.toLowerCase();
            if (lower.includes('hyena') || lower.includes('predator') || lower.includes('clan') || lower.includes('ambush') || lower.includes('threat')) {
              if (fs.existsSync(clipHyenas) && !orderedMaterials.includes(clipHyenas)) {
                orderedMaterials.push(clipHyenas);
              }
            } else if (lower.includes('mother') || lower.includes('matriarch') || lower.includes('fury') || lower.includes('approaching') || lower.includes('charge')) {
              if (fs.existsSync(clipHerd) && !orderedMaterials.includes(clipHerd)) {
                orderedMaterials.push(clipHerd);
              }
            } else if (lower.includes('foot') || lower.includes('earth') || lower.includes('vibration') || lower.includes('infrasound') || lower.includes('bedrock')) {
              if (fs.existsSync(clipFamily) && !orderedMaterials.includes(clipFamily)) {
                orderedMaterials.push(clipFamily);
              }
            } else {
              if (fs.existsSync(clipBaby) && !orderedMaterials.includes(clipBaby)) {
                orderedMaterials.push(clipBaby);
              }
            }
          }

          // Tüm mevcut benzersiz sahneleri eksiksiz ekle
          const allClips = [clipBaby, clipHyenas, clipFamily, clipHerd].filter(c => fs.existsSync(c));
          for (const c of allClips) {
            if (!orderedMaterials.includes(c)) orderedMaterials.push(c);
          }

          if (orderedMaterials.length === 0) {
            orderedMaterials.push(path.join(__dirname, 'MoneyPrinterTurbo', 'storage', 'savanna_base.mp4'));
          }

          args.push('--video-source', 'local', '--video-materials', orderedMaterials.join(','));
        } else if (videoSource === 'pexels') {
          args.push('--video-source', 'pexels');
        }

        const childProcess = require('child_process').spawn(pythonExe, args, {
          cwd: path.join(__dirname, 'MoneyPrinterTurbo'),
          windowsHide: true
        });

        let stdoutData = '';
        let stderrData = '';

        childProcess.stdout.on('data', data => {
          stdoutData += data.toString();
        });

        childProcess.stderr.on('data', data => {
          stderrData += data.toString();
        });

        childProcess.on('close', code => {
          if (code === 0) {
            let finalResult = null;
            const lines = stdoutData.trim().split('\n');
            for (let i = lines.length - 1; i >= 0; i--) {
              try {
                const parsed = JSON.parse(lines[i].trim());
                if (parsed.task_id) {
                  finalResult = parsed;
                  break;
                }
              } catch (e) {}
            }

            if (finalResult && finalResult.task_id) {
              const taskId = finalResult.task_id;
              const videoUrl = `/tasks/${taskId}/final-1.mp4`;
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              return res.end(JSON.stringify({
                success: true,
                taskId,
                videoUrl,
                result: finalResult.result,
                logs: stderrData.slice(-1000)
              }));
            }
          }

          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: false,
            error: 'Video üretim motorunda hata oluştu.',
            code,
            stderr: stderrData.slice(-1500),
            stdout: stdoutData.slice(-1000)
          }));
        });
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (reqUrl.pathname === '/api/videos' && req.method === 'GET') {
    try {
      const tasksDir = path.join(__dirname, 'MoneyPrinterTurbo', 'storage', 'tasks');
      if (!fs.existsSync(tasksDir)) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ videos: [] }));
      }

      const entries = fs.readdirSync(tasksDir, { withFileTypes: true });
      const videoList = [];

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const taskId = entry.name;
        const taskPath = path.join(tasksDir, taskId);
        const finalMp4 = path.join(taskPath, 'final-1.mp4');
        const scriptJsonPath = path.join(taskPath, 'script.json');

        const hasFinalVideo = fs.existsSync(finalMp4);
        let stat = null;
        let sizeMb = 0;
        let createdAt = null;

        if (hasFinalVideo) {
          try {
            stat = fs.statSync(finalMp4);
            sizeMb = parseFloat((stat.size / (1024 * 1024)).toFixed(2));
            createdAt = stat.mtime || stat.birthtime;
          } catch (e) {}
        } else {
          try {
            stat = fs.statSync(taskPath);
            createdAt = stat.mtime || stat.birthtime;
          } catch (e) {}
        }

        let script = '';
        let aspect = '16:9';
        let voice = '';

        if (fs.existsSync(scriptJsonPath)) {
          try {
            let rawContent = fs.readFileSync(scriptJsonPath, 'utf-8');
            if (rawContent.charCodeAt(0) === 0xFEFF) {
              rawContent = rawContent.slice(1);
            }
            const parsed = JSON.parse(rawContent);
            script = parsed.script || (parsed.params && parsed.params.video_script) || '';
            if (parsed.params) {
              aspect = parsed.params.video_aspect || '16:9';
              voice = parsed.params.voice_name || '';
            }
          } catch (e) {}
        }

        videoList.push({
          taskId,
          videoUrl: hasFinalVideo ? `/tasks/${taskId}/final-1.mp4` : null,
          hasVideo: hasFinalVideo,
          exists: hasFinalVideo,
          sizeMb,
          script: script || '(Metin açıklaması yok)',
          aspect,
          voice,
          createdAt: createdAt ? createdAt.toISOString() : new Date().toISOString()
        });
      }

      // Sort newest first
      videoList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const totalSizeMb = parseFloat(videoList.reduce((acc, v) => acc + (v.sizeMb || 0), 0).toFixed(2));

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, totalSizeMb, videos: videoList }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  } else if (reqUrl.pathname === '/api/delete-video' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { taskId } = JSON.parse(body);
        if (!taskId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'taskId belirtilmedi.' }));
        }

        const taskPath = path.join(__dirname, 'MoneyPrinterTurbo', 'storage', 'tasks', taskId);
        if (fs.existsSync(taskPath)) {
          fs.rmSync(taskPath, { recursive: true, force: true });
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, taskId }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Video klasörü bulunamadı.' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (reqUrl.pathname === '/api/delete-broken-videos' && req.method === 'POST') {
    try {
      const tasksDir = path.join(__dirname, 'MoneyPrinterTurbo', 'storage', 'tasks');
      let deletedCount = 0;
      if (fs.existsSync(tasksDir)) {
        const entries = fs.readdirSync(tasksDir, { withFileTypes: true });
        for (const entry of entries) {
          if (!entry.isDirectory()) continue;
          const taskPath = path.join(tasksDir, entry.name);
          const finalMp4 = path.join(taskPath, 'final-1.mp4');
          // Silinecek kriter: final-1.mp4 yoksa ya da boyutu 200 KB'den (0.2 MB) küçükse
          if (!fs.existsSync(finalMp4) || fs.statSync(finalMp4).size < 200 * 1024) {
            fs.rmSync(taskPath, { recursive: true, force: true });
            deletedCount++;
          }
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, deletedCount }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  } else if (reqUrl.pathname === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { video, category, keyword } = JSON.parse(body);
        const { fileName, sceneCount } = saveToObsidian(video, category, keyword);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, fileName, sceneCount }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else if (reqUrl.pathname === '/api/save-channel' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { channel, category, keyword } = JSON.parse(body);
        const { fileName } = saveChannelToObsidian(channel, category, keyword);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, fileName }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 YouTube Viral & Micro-Channel Radar Studio (Stitch Edition) çalışıyor: http://localhost:${PORT}`);
});
