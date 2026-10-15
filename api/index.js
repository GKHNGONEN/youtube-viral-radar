const nichesHandler = require('./niches');
const discoverHandler = require('./discover');
const discoverChannelsHandler = require('./discover-channels');
const calculateEarningsHandler = require('./calculate-earnings');
const discoverFreeHandler = require('./discover-free');
const videosHandler = require('./videos');
const saveHandler = require('./save');
const saveChannelHandler = require('./save-channel');

module.exports = async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname.replace(/\/+$/, '') || '/api';

  if (pathname === '/api/niches') {
    return nichesHandler(req, res);
  }
  if (pathname === '/api/discover') {
    return discoverHandler(req, res);
  }
  if (pathname === '/api/discover-channels') {
    return discoverChannelsHandler(req, res);
  }
  if (pathname === '/api/calculate-earnings') {
    return calculateEarningsHandler(req, res);
  }
  if (pathname === '/api/discover-free') {
    return discoverFreeHandler(req, res);
  }
  if (pathname === '/api/videos') {
    return videosHandler(req, res);
  }
  if (pathname === '/api/save') {
    return saveHandler(req, res);
  }
  if (pathname === '/api/save-channel') {
    return saveChannelHandler(req, res);
  }

  res.status(200).json({
    status: 'online',
    service: 'YouTube Viral & Micro-Channel Radar Cloud API',
    endpoints: [
      '/api/niches',
      '/api/discover',
      '/api/discover-channels',
      '/api/calculate-earnings',
      '/api/discover-free',
      '/api/videos'
    ]
  });
};
