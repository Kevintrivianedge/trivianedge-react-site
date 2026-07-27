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

function getRoutePaths() {
  const sitemap = readFileSync(join(rootDir, 'public/sitemap.xml'), 'utf-8');
  const matches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map(([, url]) => new URL(url).pathname);
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
