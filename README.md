<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TrivianEdge — Next-Gen Global Talent & AI Solutions

Canada's #1 BPO & offshore software development platform, built on React + TypeScript, served via Cloudflare Workers.

---

## Architecture

```
┌──────────────────────────────────────────┐
│  Browser (React SPA)                     │
│  ├── Vite  (dev / prod build)            │
│  ├── React Router  (client-side routes)  │
│  ├── Framer Motion (animations)          │
│  └── Amplitude  (analytics + replay)    │
└────────────────┬─────────────────────────┘
                 │ fetch /api/*
                 ▼
┌──────────────────────────────────────────┐
│  Cloudflare Workers  (src/worker.ts)     │
│  ├── /api/chat        — Gemini SSE chat  │
│  ├── /api/generate    — single-shot AI   │
│  ├── /api/early-access — Resend email    │
│  └── static assets   — React SPA        │
└────────────────┬─────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
  Google Gemini API     Resend Email API
  (GEMINI_API_KEY)      (RESEND_API_KEY)
```

**Key design decisions:**
- The Gemini API is never called from the browser. All AI calls are proxied through the Cloudflare Worker so the API key is never exposed.
- Geolocation is fetched once via `GeoContext` and shared to all consumers (GreetingBanner, ChatSidebar). Result is cached in `localStorage` for 24 hours.

---

## Local Setup

**Prerequisites:** Node.js ≥ 20, npm, [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

```bash
# 1. Install dependencies
npm install

# 2. Configure Worker secrets for local dev
#    Create a file at the repo root called .dev.vars (already in .gitignore)
cat > .dev.vars <<EOF
GEMINI_API_KEY=your_google_gemini_api_key
RESEND_API_KEY=your_resend_api_key_optional
EOF

# 3. Start the Worker (port 8787)
npm run worker:dev

# 4. In a second terminal, start the Vite dev server (port 3000)
#    — it auto-proxies /api to http://localhost:8787
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Secrets Configuration

| Secret | Where | Description |
|--------|-------|-------------|
| `GEMINI_API_KEY` | Worker secret | Google Gemini API key. Required for AI chat + generation. |
| `RESEND_API_KEY` | Worker secret | Resend email API key. Optional — enables early-access email. |
| `CLOUDFLARE_API_TOKEN` | GitHub secret | Wrangler auth token for CI/CD deploys. |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub secret | Your Cloudflare account ID. |

Set Worker secrets in production:
```bash
wrangler secret put GEMINI_API_KEY
wrangler secret put RESEND_API_KEY
```

See `.env.example` for the full list.

---

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run worker:dev` | Start Wrangler dev server on port 8787 |
| `npm run build` | Production Vite build |
| `npm run test` | Run Vitest unit + component tests |
| `npm run test:watch` | Run tests in watch mode |
| `npx tsc --noEmit` | Type-check frontend code |

---

## CI/CD Pipeline (`.github/workflows/deploy.yml`)

On every push to `main`:

1. **Type-check** — `npx tsc --noEmit`
2. **Test** — `npm run test`
3. **Build** — `npm run build`
4. **Deploy** — Cloudflare Wrangler deploys the Worker + static assets

---

## Contribution Guide

1. Fork the repository and create a feature branch from `main`.
2. Keep changes focused — one PR per feature or fix.
3. All new code must pass `npx tsc --noEmit` and `npm run test`.
4. Add tests for any new utility functions or components.
5. Open a pull request against `main` with a clear description.
