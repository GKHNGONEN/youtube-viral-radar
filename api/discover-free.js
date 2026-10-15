const { VIRAL_NICHES, searchOpenSourceScraper } = require('./_core');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const url = new URL(req.url, 'http://localhost');
    const nicheParam = url.searchParams.get('niche') || req.query?.niche || 'random';
    const customQuery = url.searchParams.get('customQuery') || req.query?.customQuery || '';
    const durationParam = url.searchParams.get('duration') || req.query?.duration || 'any';
    const minViews = parseInt(url.searchParams.get('minViews') || req.query?.minViews || '20000', 10);
    const maxSubs = url.searchParams.get('maxSubs') || req.query?.maxSubs || 'all';
    const sortBy = url.searchParams.get('sortBy') || req.query?.sortBy || 'outlier';

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

    res.status(200).json({
      category: categoryName,
      keyword: querySeed,
      engine: 'open_source_scraper_cloud',
      videos
    });
  } catch (err) {
    res.status(500).json({ error: err.message, videos: [] });
  }
};
