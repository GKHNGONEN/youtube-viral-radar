const https = require('https');
const { spawnSync } = require('child_process');

// 🔑 GOOGLE YOUTUBE DATA API V3 ANAHTARI
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyBN3jWgkDIHmcBTw2vmZyW29uafBJL41LA';

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
  if (totalSeconds <= 180) type = '⚡ Shorts';
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

function scoreBreakoutChannel({ ageDays, subs, totalViews, videoCount }) {
  let ageScore = 0;
  if (ageDays <= 30) {
    ageScore = 30 * (1 - (ageDays / 30) * 0.3);
  } else if (ageDays <= 60) {
    ageScore = 21 * (1 - ((ageDays - 30) / 30) * 0.4);
  } else if (ageDays <= 90) {
    ageScore = 12 * (1 - ((ageDays - 60) / 30) * 0.5);
  } else {
    ageScore = 6;
  }

  const viewSubRatio = subs > 0 ? (totalViews / subs) : 50;
  let ratioScore = 0;
  if (viewSubRatio >= 100) ratioScore = 30;
  else if (viewSubRatio >= 50) ratioScore = 25;
  else if (viewSubRatio >= 20) ratioScore = 20;
  else if (viewSubRatio >= 10) ratioScore = 15;
  else if (viewSubRatio >= 5) ratioScore = 10;
  else ratioScore = 5;

  let avgViews = videoCount > 0 ? (totalViews / videoCount) : 0;
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

// 🐣 BEBEK & MİKRO KANAL AVCISI (180s Shorts Düzeltmeli)
async function searchBreakoutChannelsApi({ query, fallbackSeeds = [], nicheId = 'general', maxDays = 90, maxSubs = 15000, minAvgViews = 2500, minRecentViews = 0, sortBy = 'breakout' }) {
  try {
    const lookbackDays = Math.max(180, maxDays * 2);
    const publishedAfter = new Date(Date.now() - lookbackDays * 24 * 3600 * 1000).toISOString();
    
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&maxResults=50&q=${encodeURIComponent(query)}&publishedAfter=${publishedAfter}&key=${YOUTUBE_API_KEY}`;
    let searchData = await fetchJson(searchUrl);
    let rawChannelIds = (searchData.items || []).map(item => item.snippet.channelId);

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

      if (ageDays > maxDays) continue;
      if (subs > maxSubs && maxSubs > 0) continue;
      if (avgViews < minAvgViews) continue;

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

              const shortsRegex = /#(shorts|short|ytshorts|youtubeshorts|reels|tiktok)\b/i;
              
              const classified = recentVideos.map(v => {
                const dur = v.durationSeconds || 0;
                const isShortTag = shortsRegex.test(v.title || '');
                const isShort = dur <= 180 || isShortTag;
                const isLong = dur > 180 && !isShortTag;
                return { isShort, isLong, dur };
              });

              const longCount = classified.filter(x => x.isLong).length;
              const shortsCount = classified.filter(x => x.isShort).length;
              const totalSample = classified.length;
              const avgDur = totalSample > 0 ? classified.reduce((acc, x) => acc + x.dur, 0) / totalSample : 0;

              longRatio = totalSample > 0 ? parseFloat((longCount / totalSample).toFixed(2)) : 0;

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

      if (minRecentViews > 0 && recentVideos.length > 0 && recentAvgViews < minRecentViews) {
        continue;
      }

      const scoreInfo = scoreBreakoutChannel({ ageDays, subs, totalViews, videoCount });

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

      const country = c.snippet.country || '';
      const geoTier = mapCountryToTier(country);
      const monthlyEstimatedViews = Math.round((totalViews / Math.max(1, ageDays)) * 30);

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

// 🛡️ Kotasız Açık Kaynak Radarı (Sunucusuz Ortam Korumalı Fallback)
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
    if (!proc.stdout || proc.error) {
      // Bulut ortamında yt-dlp binary yoksa API motoruyla zarifçe besle
      return searchYouTubeApi({ query, minViews, durationFilter, maxSubs, sortBy });
    }

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

    const videos = rawItems.map(item => {
      const viewCount = item.view_count || 0;
      const durationSeconds = item.duration || 0;
      let durationText = item.duration_string || '0:00';
      let videoType = '⏱️ Standart Video';
      if (durationSeconds <= 60) videoType = '⚡ Shorts';
      else if (durationSeconds >= 1200) videoType = '🎬 Uzun Film / Belgesel (>20 Dk)';

      const thumbUrl = (item.thumbnails && item.thumbnails.length > 0)
        ? item.thumbnails[item.thumbnails.length - 1].url
        : `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;

      return {
        videoId: item.id,
        title: item.title,
        viewCount,
        viewsFormatted: viewCount.toLocaleString('tr-TR'),
        channel: item.uploader || item.channel || 'Bilinmiyor',
        channelSubs: 'Açık Kaynak',
        channelSubCount: 0,
        published: 'Web İndeksi',
        daysAgoText: 'Kotasız Motor',
        viewsPerDay: 0,
        velocityBadge: '🛡️ Kotasız Motor',
        durationText,
        durationSeconds,
        videoType,
        outlierRatio: 1,
        outlierBadge: 'Trend',
        thumbnail: thumbUrl,
        url: `https://www.youtube.com/watch?v=${item.id}`
      };
    });

    return videos;
  } catch (err) {
    return searchYouTubeApi({ query, minViews, durationFilter, maxSubs, sortBy });
  }
}

module.exports = {
  YOUTUBE_API_KEY,
  VIRAL_NICHES,
  fetchJson,
  parseDuration,
  scoreBreakoutChannel,
  YouTubeRevenueCalculator,
  searchYouTubeApi,
  searchBreakoutChannelsApi,
  searchOpenSourceScraper
};
