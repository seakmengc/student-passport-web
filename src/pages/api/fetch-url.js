const getMetaData = require('metadata-scraper');

export default async function handler(req, res) {
  if (!req.query.url) {
    return res.status(400);
  }

  const url = req.query.url;
  const meta = await getMetaData(
    url.startsWith('https://') || url.startsWith('http://')
      ? url
      : 'https://' + url
  );

  res.json({
    success: 1,
    link: meta.url,
    meta: {
      title: meta.title,
      description: meta.description,
      image: {
        url: meta.image,
      },
    },
  });
}
