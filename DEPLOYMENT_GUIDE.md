# TrivianEdge Deployment Guide

## Overview

TrivianEdge is deployed on **Vercel** (frontend) + **Cloudflare Workers** (backend/API).

## Pre-Deployment Checklist

### Code Quality
```bash
# Type-check
npx tsc --noEmit

# Run tests
npm run test

# Lint (if configured)
npm run lint  # If available

# Build locally
npm run build
```

### Performance Validation
```bash
# Build and preview
npm run build
npm run preview

# Run Lighthouse audit
# Open Chrome DevTools → Lighthouse → Run audit
# Target: 90+ on all metrics
# LCP: < 2.5s, CLS: < 0.1, INP: < 200ms
```

### Accessibility Check
- [ ] Test with keyboard navigation (Tab through all elements)
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Verify prefers-reduced-motion behavior
- [ ] Check color contrast on all text

---

## Vercel Deployment

### Initial Setup

1. **Connect Repository to Vercel**
   ```bash
   npm install -g vercel
   vercel link
   ```

2. **Configure Environment Variables**
   ```bash
   vercel env add ANTHROPIC_API_KEY
   vercel env add RESEND_API_KEY
   vercel env add CRM_WEBHOOK_URL
   vercel env add CRM_WEBHOOK_SIGNING_SECRET
   vercel env add ADMIN_API_TOKEN
   ```

3. **Verify `vercel.json` Configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "env": {
       "ANTHROPIC_API_KEY": "@anthropic_api_key",
       "RESEND_API_KEY": "@resend_api_key"
     }
   }
   ```

### Deploy to Production

```bash
# Deploy to production
vercel --prod

# View deployment URL
vercel ls

# Set custom domain
vercel domains add trivianedge.com
```

### Monitoring Deployments

```bash
# View deployment logs
vercel logs

# Check deployment status
vercel inspect

# Rollback to previous deployment
vercel rollback
```

---

## GitHub Actions CI/CD

### Automated Workflow

File: `.github/workflows/deploy.yml`

The workflow runs on every push to `main`:

1. **Type-check** → `npx tsc --noEmit`
2. **Test** → `npm run test`
3. **Build** → `npm run build`
4. **Lighthouse Audit** → Performance check
5. **Deploy** → Vercel deployment

### Configuration

```yaml
name: Build & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npx tsc --noEmit
      - run: npm run test
      - run: npm run build
      
  lighthouse:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          uploadArtifacts: true
          temporaryPublicStorage: true
          
  deploy:
    runs-on: ubuntu-latest
    needs: [build, lighthouse]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v6
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
```

---

## Performance Monitoring

### Core Web Vitals Tracking

Metrics are collected via `usePerformanceMonitoring` hook:

```typescript
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

export default function App() {
  usePerformanceMonitoring((metric) => {
    // Send to your analytics backend
    console.log(`${metric.name}: ${metric.value}ms (${metric.rating})`);
  });
  
  return /* ... */;
}
```

### Integration with Analytics

Send metrics to your backend:

```typescript
async function sendMetricToAnalytics(metric: WebVitalMetric) {
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/metrics', JSON.stringify(metric));
  } else {
    fetch('/api/analytics/metrics', {
      method: 'POST',
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch(() => {});
  }
}
```

### Lighthouse CI

Verify performance on every build:

```bash
# Run locally
npm run build
npx lighthouse-ci autorun

# View results
npx lighthouse-ci wizard
```

---

## Cloudflare Workers Deployment

### Deploy Worker

```bash
# Ensure wrangler.toml is configured
npm run deploy

# Or manually with Wrangler
wrangler deploy
```

### Environment Variables in Production

```bash
# Set secrets
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put RESEND_API_KEY
wrangler secret put CRM_WEBHOOK_URL
wrangler secret put ADMIN_API_TOKEN

# Verify
wrangler secret list
```

### Monitor Worker

```bash
# View logs
wrangler tail

# Check performance
wrangler analytics
```

---

## Post-Deployment

### Verification Steps

1. **Verify Site is Live**
   ```bash
   curl https://trivianedge.com
   ```

2. **Check Performance Metrics**
   - Open production URL in Chrome
   - Run Lighthouse audit (DevTools → Lighthouse)
   - Target: 90+ on all metrics

3. **Verify All Features Work**
   - [ ] Hero animations load smoothly
   - [ ] All page transitions work
   - [ ] Contact form submits
   - [ ] Chat/AI features respond
   - [ ] Email signup works

4. **Test on Mobile**
   - [ ] iOS Safari
   - [ ] Chrome Mobile
   - [ ] Verify animations run at 60 FPS

5. **Check Analytics**
   - [ ] Amplitude events tracked
   - [ ] Performance metrics logged
   - [ ] Errors reported

### Monitoring in Production

```bash
# View Vercel deployment metrics
vercel analytics

# Check error tracking (if integrated with Sentry, etc.)
# Configure in Vercel dashboard

# Monitor Cloudflare Workers
wrangler tail --local false
```

---

## Rollback Plan

If something goes wrong:

### Rollback Vercel Deployment
```bash
# View previous deployments
vercel ls

# Rollback to previous version
vercel rollback <deployment-id>
```

### Rollback Cloudflare Workers
```bash
# View deployment history
wrangler deployments list

# Rollback to previous version
wrangler rollback --version <version-id>
```

---

## Continuous Deployment

### Branch Strategy

- **main**: Production branch (auto-deployed to Vercel)
- **staging**: Staging branch (deployed to staging environment)
- **feature/***: Feature branches (reviewed via PR)

### PR Workflow

1. Create feature branch from `main`
2. Push changes and create PR
3. GitHub Actions runs:
   - Type-check
   - Tests
   - Build
   - Lighthouse audit
4. Review PR
5. Merge to `main` (auto-deploys to production)

---

## Environment Variables

### Production (Vercel)
```
ANTHROPIC_API_KEY=sk-...
RESEND_API_KEY=re_...
CRM_WEBHOOK_URL=https://...
CRM_WEBHOOK_SIGNING_SECRET=secret...
ADMIN_API_TOKEN=token...
```

### Staging (Vercel Preview)
Same as production (or separate credentials for testing)

### Local Development (.dev.vars for Workers)
```
ANTHROPIC_API_KEY=sk-...
RESEND_API_KEY=re_...
CRM_WEBHOOK_URL=http://localhost:3000/...
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Performance Issues
```bash
# Check bundle size
npm run build
# Review dist/stats.html

# Profile in DevTools
# Performance tab → Record → Analyze
```

### Deployment Hangs
```bash
# Check Vercel status
vercel status

# Check Cloudflare status
wrangler status
```

---

## Maintenance

### Weekly
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Verify no broken links

### Monthly
- [ ] Run security audit (`npm audit`)
- [ ] Update dependencies (`npm update`)
- [ ] Review analytics

### Quarterly
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WAVE, axe)
- [ ] SEO audit (Google Search Console)

---

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/lighthouse)
