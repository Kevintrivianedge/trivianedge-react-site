/**
 * Build-time prerender step: after `vite build`, boot the built dist/ on a local
 * preview server and use headless Chromium to snapshot each real route's fully
 * rendered HTML to disk. The Cloudflare Worker then serves these static
 * snapshots directly instead of the bare SPA shell (see src/worker.ts).
 *
 * Why: crawlers that don't execute JavaScript (GPTBot, ClaudeBot,
 * PerplexityBot, CCBot) only ever see whatever HTML is returned on first
 * request. Without this step they'd see an empty <div id="root"></div> for
 * every route — robots.txt/llms.txt inviting them in doesn't help if there's
 * no actual content to read once they arrive.
 *
 * Run automatically as part of `npm run build`.
 */
import { chromium } from 'playwright';
import { preview } from 'vite';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Not a real, indexable page — deliberately excluded from sitemap.xml (a
// noindex URL listed in a sitemap is its own SEO anti-pattern). Prerendered
// separately so src/worker.ts has a dedicated 404 snapshot (NotFoundPage,
// which already sets noIndex) to serve for unmatched paths, instead of
// reusing the homepage's snapshot — see the fallback comment in worker.ts.
const NOT_FOUND_ROUTE = '/__404-snapshot';

function getRoutePaths() {
  const sitemap = readFileSync(join(rootDir, 'public/sitemap.xml'), 'utf-8');
  const matches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)];
  return [...matches.map(([, url]) => new URL(url).pathname), NOT_FOUND_ROUTE];
}

async function main() {
  const routes = getRoutePaths();
  console.log(`Prerendering ${routes.length} routes...`);

  const server = await preview({ root: rootDir, preview: { port: 0, strictPort: false } });
  const url = server.resolvedUrls?.local?.[0];
  if (!url) throw new Error('Could not resolve preview server URL');

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  // Skip the branded intro splash (sessionStorage-gated, 2.2s) so snapshots
  // capture real page content instead of the intro animation frame.
  await context.addInitScript(() => {
    window.sessionStorage.setItem('trivian_intro_shown_v2', 'true');
  });

  const failures = [];

  for (const routePath of routes) {
    try {
      const page = await context.newPage();
      await page.goto(`${url.replace(/\/$/, '')}${routePath}`, {
        waitUntil: 'networkidle',
        timeout: 30_000,
      });
      // Let React finish its post-load effects (SEOHead title/meta, any
      // client-side data derivation) settle before snapshotting.
      await page.waitForTimeout(500);

      // Most sections use scroll-triggered reveal animations (IntersectionObserver
      // adds an "active"/visible class, or a Framer Motion whileInView prop flips
      // opacity 0 -> 1) that only fire once an element crosses the viewport. A
      // snapshot taken without scrolling captures those sections mid-animation —
      // e.g. opacity: 0 baked into the static HTML — which is exactly what Google's
      // renderer does too (it doesn't scroll), and exactly what non-JS crawlers
      // (GPTBot, ClaudeBot, PerplexityBot) would receive verbatim since they never
      // execute the JS that would otherwise reveal it. Scrolling the full height
      // before snapshotting ensures every reveal has fired first.
      const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < scrollHeight; y += 400) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(120);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);

      // The static index.html shell ships sane default <meta name/property> tags
      // (description, keywords, robots, og:*, twitter:*) as a fallback for the
      // brief window before React mounts. Once SEOHead (react-helmet-async) runs,
      // it appends its own page-specific versions of those same tags rather than
      // replacing the originals — Helmet only manages tags it created, and has no
      // way to know the static ones exist. page.content() captures both, so every
      // prerendered snapshot shipped two conflicting copies of ~20 meta tags (the
      // generic homepage default plus the real per-page one), which risks search
      // engines picking the wrong one. Keep only the last occurrence of each
      // duplicated name/property — that's the one Helmet inserted.
      await page.evaluate(() => {
        const seen = new Map();
        document.querySelectorAll('head meta[name], head meta[property]').forEach(el => {
          const key = el.getAttribute('name') ?? el.getAttribute('property');
          if (seen.has(key)) seen.get(key).remove();
          seen.set(key, el);
        });
      });

      const html = await page.content();
      const outDir = routePath === '/' ? distDir : join(distDir, routePath.replace(/^\//, ''));
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'index.html'), html);
      console.log(`  ✓ ${routePath}`);
      await page.close();
    } catch (err) {
      failures.push(`${routePath}: ${err.message}`);
      console.error(`  ✗ ${routePath}: ${err.message}`);
    }
  }

  await browser.close();
  await server.close();

  if (failures.length > 0) {
    throw new Error(`Prerendering failed for ${failures.length} route(s):\n${failures.join('\n')}`);
  }

  console.log(`Prerendered ${routes.length} routes successfully.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
