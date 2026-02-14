const https = require('https');
const zlib = require('zlib');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { query } = JSON.parse(event.body || '{}');
  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Query required' }) };
  }

  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'BRAVE_API_KEY not configured' }) };
  }

  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=8&country=CA`;

  try {
    const data = await fetchJSON(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey
      }
    });

    const results = (data.web?.results || []).map(r => ({
      title: r.title,
      url: r.url,
      description: r.description,
      age: r.age || ''
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ results })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Search failed', detail: err.message })
    };
  }
};

function fetchJSON(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, options, (res) => {
      const chunks = [];
      const encoding = res.headers['content-encoding'];
      let stream = res;
      if (encoding === 'gzip') {
        stream = res.pipe(zlib.createGunzip());
      }
      stream.on('data', c => chunks.push(c));
      stream.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}
