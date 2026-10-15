module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    success: true,
    fileName: 'Obsidian_Cloud_Export.md',
    sceneCount: 0,
    message: 'Bulut sürümü üzerinden analiz başarıyla görüntülendi. Yerel vault kayıtları için masaüstü sürümünü kullanabilirsiniz.'
  });
};
