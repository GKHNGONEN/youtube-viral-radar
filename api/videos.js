module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    success: true,
    totalSizeMb: 0,
    videos: [],
    message: 'Video stüdyosu ve render kütüphanesi yerel masaüstü sürümünde (localhost:3000) aktiftir.'
  });
};
