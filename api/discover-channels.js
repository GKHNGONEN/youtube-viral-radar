const { VIRAL_NICHES, searchBreakoutChannelsApi } = require('./_core');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const url = new URL(req.url, 'http://localhost');
    const nicheParam = url.searchParams.get('niche') || req.query?.niche || 'random';
    const customQuery = url.searchParams.get('customQuery') || req.query?.customQuery || '';
    const maxDays = parseInt(url.searchParams.get('maxDays') || req.query?.maxDays || '60', 10);
    const maxSubsParam = url.searchParams.get('maxSubs') || req.query?.maxSubs || '10000';
    const maxSubs = maxSubsParam === 'all' ? 0 : parseInt(maxSubsParam, 10);
    const minAvgViews = parseInt(url.searchParams.get('minAvgViews') || req.query?.minAvgViews || '2500', 10);
    const minRecentViewsParam = url.searchParams.get('minRecentViews') || req.query?.minRecentViews || '0';
    const minRecentViews = minRecentViewsParam === 'all' ? 0 : parseInt(minRecentViewsParam, 10);
    const sortBy = url.searchParams.get('sortBy') || req.query?.sortBy || 'breakout';

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

    res.status(200).json({
      category: categoryName,
      keyword: querySeed,
      engine: 'youtube_api_breakout_channels',
      channels
    });
  } catch (err) {
    res.status(500).json({ error: err.message, channels: [] });
  }
};
