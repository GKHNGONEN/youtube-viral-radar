const { VIRAL_NICHES, searchYouTubeApi } = require('./_core');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const url = new URL(req.url, 'http://localhost');
    const nicheParam = url.searchParams.get('niche') || req.query?.niche || 'random';
    const customQuery = url.searchParams.get('customQuery') || req.query?.customQuery || '';
    const timeFilter = url.searchParams.get('timeFilter') || req.query?.timeFilter || '90days';
    const durationParam = url.searchParams.get('duration') || req.query?.duration || 'any';
    const minViews = parseInt(url.searchParams.get('minViews') || req.query?.minViews || '20000', 10);
    const maxSubs = url.searchParams.get('maxSubs') || req.query?.maxSubs || '50000';
    const sortBy = url.searchParams.get('sortBy') || req.query?.sortBy || 'velocity';

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

    res.status(200).json({
      category: categoryName,
      keyword: querySeed,
      engine: 'youtube_api_v3',
      videos
    });
  } catch (err) {
    res.status(500).json({ error: err.message, videos: [] });
  }
};
