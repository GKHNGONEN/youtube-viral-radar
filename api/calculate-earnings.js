const { YouTubeRevenueCalculator } = require('./_core');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const url = new URL(req.url, 'http://localhost');
    const monthlyViews = parseInt(url.searchParams.get('views') || req.query?.views || '100000', 10);
    const contentType = url.searchParams.get('type') || req.query?.type || 'shorts';
    const longRatio = parseFloat(url.searchParams.get('longRatio') || req.query?.longRatio || '0.5');
    const niche = url.searchParams.get('niche') || req.query?.niche || 'general';
    const geoTier = url.searchParams.get('tier') || req.query?.tier || 'tier1';
    const customCpm = parseFloat(url.searchParams.get('cpm') || req.query?.cpm || '0');

    const result = YouTubeRevenueCalculator.calculate({
      monthlyViews,
      contentType,
      longRatio,
      niche,
      geoTier,
      customCpm: customCpm > 0 ? customCpm : null
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
