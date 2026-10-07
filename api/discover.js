const https = require('https');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyBN3jWgkDIHmcBTw2vmZyW29uafBJL41LA';

const VIRAL_NICHES = [
  {
    id: "ai_movies",
    category: "🎬 Yapay Zeka Filmleri & Sinematik (Cenote Diver Tarzı)",
    seeds: [
      "ai sci fi short film 4k",
      "ai horror movie full length",
      "ai cinematic film unreal engine",
      "ai movie luma dream machine",
      "hyperrealistic ai cinematic movie",
      "ai generated thriller film"
    ]
  },
  {
    id: "extreme_sports",
    category: "🏍️ Ekstrem Sporlar & Hill Climb",
    seeds: [
      "extreme enduro hill climb",
      "urban downhill mountain bike near miss",
      "wingsuit close call cliff",
      "dirt bike steep climb crash",
      "impossible motorcycle hillclimb"
    ]
  },
  {
    id: "sweaty_palms",
    category: "😱 Yükseklik Korkusu & Uçurum (Sweaty Palms)",
    seeds: [
      "terrifying mountain trail pov",
      "crazy crane climb no rope",
      "steepest road in the world truck",
      "insane cliff walking path china",
      "dangerous bridge crossing viral"
    ]
  },
  {
    id: "dark_nature",
    category: "🧠 Karanlık Doğa & Şok Edici Canlılar",
    seeds: [
      "most terrifying sea creatures discovered",
      "animals with superpowers real footage",
      "nature is terrifying crazy encounters",
      "deep ocean anomaly mystery caught",
      "rare animal attack survival seconds"
    ]
  },
  {
    id: "traffic_fails",
    category: "🚗 Anlık Karma & Trafik Kurtuluşları",
    seeds: [
      "instant karma road moments",
      "miraculous car crash survival seconds",
      "train near miss caught on camera",
      "idiots in cars instant regret compilation"
    ]
  },
  {
    id: "ancient_mysteries",
    category: "🏛️ Açıklanamayan Gizemler & Antik Olaylar",
    seeds: [
      "unexplained ancient technology discovery",
      "forbidden places no one can visit",
      "bizarre historical moments caught on camera",
      "secret underground structures discovered"
    ]
  }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
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

function parseDuration(isoDuration) {
  if (!isoDuration) return { text: '0:00', totalSeconds: 0, type: 'Bilinmiyor' };
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return { text: isoDuration, totalSeconds: 0, type: 'Normal' };

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  let type = 'Normal Video';
  if (totalSeconds <= 60) {
    type = '⚡ Shorts';
  } else if (totalSeconds >= 1200) {
    type = '🎬 Uzun Film / Belgesel (>20 Dk)';
  } else {
    type = '⏱️ Standart Video';
  }

  return { text: formatted, totalSeconds, type };
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const urlObj = new URL(req.url, 'http://localhost');
    const nicheParam = req.query?.niche || urlObj.searchParams.get('niche') || 'random';
    const durationParam = req.query?.duration || urlObj.searchParams.get('duration') || 'any';
    const minViews = parseInt(req.query?.minViews || urlObj.searchParams.get('minViews') || '50000', 10);

    let selectedNiche;
    if (nicheParam === 'random') {
      selectedNiche = VIRAL_NICHES[Math.floor(Math.random() * VIRAL_NICHES.length)];
    } else {
      selectedNiche = VIRAL_NICHES.find(n => n.id === nicheParam) || VIRAL_NICHES[0];
    }

    const randomSeed = selectedNiche.seeds[Math.floor(Math.random() * selectedNiche.seeds.length)];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

    let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=${encodeURIComponent(randomSeed)}&publishedAfter=${thirtyDaysAgo}&key=${YOUTUBE_API_KEY}`;
    if (durationParam && durationParam !== 'any') {
      searchUrl += `&videoDuration=${durationParam}`;
    }

    const searchRes = await fetchJson(searchUrl);
    if (!searchRes.items || searchRes.items.length === 0) {
      return res.end(JSON.stringify({ category: selectedNiche.category, keyword: randomSeed, videos: [] }));
    }

    const videoIds = searchRes.items.map(i => i.id.videoId).filter(Boolean).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const detailsRes = await fetchJson(detailsUrl);
    if (!detailsRes.items || detailsRes.items.length === 0) {
      return res.end(JSON.stringify({ category: selectedNiche.category, keyword: randomSeed, videos: [] }));
    }

    const channelIds = [...new Set(detailsRes.items.map(v => v.snippet.channelId))].join(',');
    let channelSubsMap = {};
    if (channelIds) {
      try {
        const channelsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelIds}&key=${YOUTUBE_API_KEY}`;
        const channelsRes = await fetchJson(channelsUrl);
        if (channelsRes.items) {
          channelsRes.items.forEach(c => {
            channelSubsMap[c.id] = parseInt(c.statistics.subscriberCount || 0, 10);
          });
        }
      } catch (e) {}
    }

    const videos = [];
    for (const v of detailsRes.items) {
      const viewCount = parseInt(v.statistics.viewCount || 0, 10);
      if (viewCount < minViews) continue;

      const dur = parseDuration(v.contentDetails.duration);
      if (durationParam === 'shorts_only' && dur.totalSeconds > 60) continue;
      if (durationParam === 'long' && dur.totalSeconds < 1200) continue;

      const channelSubCount = channelSubsMap[v.snippet.channelId] || 0;
      let outlierRatio = 0;
      let outlierBadge = 'Standart';
      if (channelSubCount > 0) {
        outlierRatio = parseFloat((viewCount / channelSubCount).toFixed(1));
        if (outlierRatio >= 10) {
          outlierBadge = `🔥 ${outlierRatio}x Mega Outlier!`;
        } else if (outlierRatio >= 3) {
          outlierBadge = `⚡ ${outlierRatio}x Viral Patlama`;
        } else if (outlierRatio >= 1) {
          outlierBadge = `📈 ${outlierRatio}x Trend`;
        } else {
          outlierBadge = `${outlierRatio}x Normal`;
        }
      } else {
        outlierBadge = 'Gizli Abone';
      }

      const thumbnails = v.snippet.thumbnails;
      const thumbUrl = (thumbnails.maxres || thumbnails.high || thumbnails.medium || thumbnails.default)?.url || '';
      const published = new Date(v.snippet.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

      videos.push({
        videoId: v.id,
        title: v.snippet.title,
        viewCount,
        viewsFormatted: viewCount.toLocaleString('tr-TR'),
        channel: v.snippet.channelTitle,
        channelSubs: channelSubCount > 0 ? channelSubCount.toLocaleString('tr-TR') : 'Gizli',
        published,
        durationText: dur.text,
        durationSeconds: dur.totalSeconds,
        videoType: dur.type,
        outlierRatio,
        outlierBadge,
        thumbnail: thumbUrl,
        url: `https://www.youtube.com/watch?v=${v.id}`
      });
    }

    videos.sort((a, b) => b.viewCount - a.viewCount);

    res.statusCode = 200;
    res.end(JSON.stringify({
      category: selectedNiche.category,
      keyword: randomSeed,
      videos
    }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message, videos: [] }));
  }
};
