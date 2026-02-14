const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = 3847;
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
const DRAFTS_DIR = path.join(__dirname, 'drafts');
const EXTERNAL_DRAFTS = 'C:\\Users\\user\\clawd\\linkedin-drafts';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Brave Search proxy
app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query required' });

  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=8&country=CA`;

  const options = {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': BRAVE_API_KEY
    }
  };

  try {
    const data = await fetchJSON(url, options);
    const results = (data.web?.results || []).map(r => ({
      title: r.title,
      url: r.url,
      description: r.description,
      age: r.age || ''
    }));
    res.json({ results });
  } catch (err) {
    console.error('Brave search error:', err.message);
    res.status(500).json({ error: 'Search failed', detail: err.message });
  }
});

// Save draft
app.post('/api/drafts', (req, res) => {
  const { content, contentType, sources, hashtags } = req.body;
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `draft-${contentType}-${ts}.json`;
  const draft = {
    content,
    contentType,
    sources: sources || [],
    hashtags: hashtags || [],
    createdAt: new Date().toISOString()
  };
  const json = JSON.stringify(draft, null, 2);

  // Save to both locations
  fs.writeFileSync(path.join(DRAFTS_DIR, filename), json);
  try {
    fs.mkdirSync(EXTERNAL_DRAFTS, { recursive: true });
    fs.writeFileSync(path.join(EXTERNAL_DRAFTS, filename), json);
  } catch (e) { /* ok */ }

  res.json({ saved: filename });
});

// List drafts
app.get('/api/drafts', (req, res) => {
  try {
    const files = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.json')).sort().reverse();
    const drafts = files.slice(0, 20).map(f => {
      const d = JSON.parse(fs.readFileSync(path.join(DRAFTS_DIR, f), 'utf8'));
      d.filename = f;
      return d;
    });
    res.json({ drafts });
  } catch {
    res.json({ drafts: [] });
  }
});

function fetchJSON(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, options, (res) => {
      const chunks = [];
      const encoding = res.headers['content-encoding'];
      let stream = res;
      if (encoding === 'gzip') {
        stream = res.pipe(require('zlib').createGunzip());
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

app.listen(PORT, () => {
  console.log(`\n  ⚡ LinkedIn Smart Draft running at http://localhost:${PORT}\n`);
});
