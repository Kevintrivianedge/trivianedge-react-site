<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TrivianEdge React Site

AI-Driven Global Talent & Software Solutions — powered by Gemini AI and deployed on Cloudflare Workers.

## Architecture

- **Frontend:** React + TypeScript + Vite
- **Backend API:** Cloudflare Worker (`src/worker.ts`)
  - `POST /api/chat` — Vara AI chatbot (SSE streaming via Gemini)
  - `POST /api/generate` — Talent advisor AI generation
- **CSS:** Tailwind CSS (PostCSS build — NOT CDN)
- **Deployment:** Cloudflare Workers with static asset binding

## Development

```bash
# Install dependencies
npm install

# Run frontend dev server (proxies /api to localhost:8787)
npm run dev

# Run the Cloudflare Worker locally (in a separate terminal)
npm run worker:dev
```

## Deployment

### 1. Set your Gemini API key as a Worker secret (one-time setup)
```bash
wrangler secret put GEMINI_API_KEY
# Enter your Google Gemini API key when prompted
```

### 2. Build and deploy
```bash
npm run deploy
```

This runs `vite build` then `wrangler deploy`, which bundles the Worker and uploads the `dist/` assets.

## Environment Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `GEMINI_API_KEY` | Wrangler Secret | ✅ Yes | Google Gemini API key for Vara AI chatbot |

**Never commit your API key to git.** Always use `wrangler secret put` or the Cloudflare dashboard.
