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
│  ├── /api/chat        — Anthropic SSE chat │
│  ├── /api/generate    — single-shot AI   │
│  ├── /api/early-access — Resend email    │
│  ├── /api/analytics/events — persistent telemetry │
│  ├── /api/venture/submit — CRM + booking hooks   │
│  ├── /api/admin/venture-stats — funnel + conversion stats │
│  └── static assets   — React SPA        │
└────────────────┬─────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
  Anthropic API          Resend Email API
  (ANTHROPIC_API_KEY)    (RESEND_API_KEY)
```

**Key design decisions:**
- The Anthropic API is never called from the browser. All AI calls are proxied through the Cloudflare Worker so the API key is never exposed.
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
ANTHROPIC_API_KEY=your_anthropic_api_key
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
| `ANTHROPIC_API_KEY` | Worker secret | Anthropic API key. Required for AI chat (Aria) + generation. |
| `RESEND_API_KEY` | Worker secret | Resend email API key. Optional — enables early-access email. |
| `CRM_WEBHOOK_URL` | Worker secret | CRM incoming webhook URL for qualified Venture Studio submissions. |
| `CRM_WEBHOOK_SIGNING_SECRET` | Worker secret | HMAC signing secret for outbound CRM webhooks (`X-Trivian-Signature`). |
| `ADMIN_API_TOKEN` | Worker secret | Token required for `/api/admin/venture-stats` access. |
| `ANALYTICS_KV` | Worker binding | Workers KV namespace for persistent server-side analytics events. |
| `CLOUDFLARE_API_TOKEN` | GitHub secret | Wrangler auth token for CI/CD deploys. |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub secret | Your Cloudflare account ID. |

Set Worker secrets in production:
```bash
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put RESEND_API_KEY
wrangler secret put CRM_WEBHOOK_URL
wrangler secret put CRM_WEBHOOK_SIGNING_SECRET
wrangler secret put ADMIN_API_TOKEN

# Create and bind KV for persistent analytics
wrangler kv namespace create ANALYTICS_KV
# Add the returned namespace id into wrangler.toml under kv_namespaces.

Admin stats endpoint example:
```bash
curl -H "X-Admin-Token: <ADMIN_API_TOKEN>" https://www.trivianedge.com/api/admin/venture-stats
```

CRM webhook reliability:
- Qualified submissions attempt immediate CRM webhook delivery.
- Failed deliveries are queued in KV (`crm_retry:*`) with exponential backoff + jitter.
- Retry processing runs opportunistically on venture submit and admin stats endpoint calls.
```

See `.env.example` for the full list.

---

## Premium Design System

TrivianEdge features a **$50k+ bespoke agency aesthetic** with award-winning animations and premium motion design.

### Design Philosophy: "Kinetic Minimalism"
- **Confident**: Forward-thinking operator's dashboard
- **Premium**: Minimal colors, generous whitespace, purposeful motion
- **Accessible**: All animations respect `prefers-reduced-motion`, WCAG AA compliance
- **Performant**: 60 FPS animations using GPU-accelerated transforms only

### Key Documentation
- **[PREMIUM_DESIGN_CONCEPT.md](./PREMIUM_DESIGN_CONCEPT.md)** — Complete visual direction, 3 concepts, animation techniques, component specs
- **[ANIMATION_PATTERNS.md](./ANIMATION_PATTERNS.md)** — Reusable animation patterns, timing guidelines, code examples
- **[PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)** — Build config, asset optimization, performance targets
- **[ACCESSIBILITY_AUDIT.md](./ACCESSIBILITY_AUDIT.md)** — WCAG 2.1 AA compliance, testing procedures, guidelines

### Animation Timing & Easing
All animations use custom easing `[0.16, 1, 0.3, 1]` for premium feel:
- **Hover effects**: 200ms (instant feedback)
- **Entrance animations**: 600–800ms (deliberate, measured)
- **Page transitions**: 400ms (fast, seamless)
- **Stagger**: 80–100ms between items (natural flow)

### Reusable Components
```typescript
// Scroll-triggered fade + slide
import { RevealBlock } from '@/components/RevealBlock';

// Staggered card reveals
import { StaggerList } from '@/components/StaggerList';

// Interactive hover with scale + glow
import { HoverGlow } from '@/components/HoverGlow';
```

### Color Palette
- **Primary Accent**: #00C49A (teal, brand identity)
- **Highlight**: #00FFE0 (cyan, animated elements)
- **Primary Dark**: #0A0E17 (near-black, premium darkness)
- **Text**: #FFFFFF (pure white, WCAG AAA contrast)

### Typography
- **Display/Headlines**: Fraunces (serif, prestige)
- **Body/UI**: Manrope (sans-serif, modern contrast)

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
