module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    success: true,
    fileName: 'Obsidian_Cloud_Channel_Export.md',
    message: 'Bulut sürümü üzerinden kanal analizi başarıyla görüntülendi. Yerel vault kayıtları için masaüstü sürümünü kullanabilirsiniz.'
  });
};
