# 🔥 Smart Draft - LinkedIn Content Generator v2

LinkedIn post generator for Canadian HVAC content. Built for Mike Kapin.

## Features
- Brave Search API for real-time HVAC research
- 5 content types with 5+ templates each
- Mike's voice: direct, expert, Canadian
- Copy, save, regenerate
- Seasonal awareness
- Character counter (3000 limit)
- Mobile-friendly responsive design
- Dual deployment: local dev + Netlify

## Local Development
```bash
npm install
node server.js
```
Open http://localhost:3847

## Netlify Deployment
1. Push to GitHub
2. Connect repo to Netlify
3. Set environment variable `BRAVE_API_KEY` in Netlify dashboard
4. Build settings are auto-configured via `netlify.toml`

Drafts are saved to localStorage when running on Netlify (no server-side storage needed).

## Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `BRAVE_API_KEY` | Brave Search API key | Yes (Netlify) |

Locally, the API key is hardcoded in `server.js` for convenience.
