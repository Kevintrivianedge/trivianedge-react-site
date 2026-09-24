/**
 * Build-time prerender: server-renders every route with React
 * (entry-server.tsx → renderToPipeableStream) and writes the result into a
 * copy of the built dist/index.html. The Cloudflare Worker serves these files
 * directly (see src/worker.ts), and index.tsx hydrates them.
 *
 * Why real SSR instead of a headless-browser snapshot (the previous approach):
 * a DOM snapshot is taken after effects have run and has no Suspense boundary
 * markers (<!--$-->) or text-node separators (<!-- -->), so it can never match
 * React's first client render. Hydration failed with React #418 on every
 * route, forcing a full client re-render (~0.5s main thread on mobile).
 * renderToPipeableStream emits exactly the markup hydrateRoot expects.
 *
 * Crawlers that don't run JavaScript (GPTBot, ClaudeBot, PerplexityBot) still
 * get full content: onAllReady waits for every lazy route before writing.
 *
 * Run automatically as part of `npm run build`, after `vite build --ssr`.
 */
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const ssrEntry = join(rootDir, 'dist-ssr', 'entry-server.js');

// Not a real, indexable page — deliberately excluded from sitemap.xml.
// Prerendered so src/worker.ts has a dedicated 404 snapshot (NotFoundPage sets
// noIndex) to serve for unmatched paths instead of the homepage's.
const NOT_FOUND_ROUTE = '/__404-snapshot';

function getRoutePaths() {
  const sitemap = readFileSync(join(rootDir, 'public/sitemap.xml'), 'utf-8');
  const matches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)];
  return [...new Set(matches.map(([, url]) => new URL(url).pathname)), NOT_FOUND_ROUTE];
}

/**
 * Replace the template's generic head tags with the route's Helmet output.
 * Helmet only knows about tags it created, so without this every page would
 * ship two conflicting copies of title/description/og:* (the homepage default
 * from index.html plus the real per-page one).
 */
function applyHead(template, helmet) {
  if (!helmet) return template;
  const title = helmet.title.toString();
  const meta = helmet.meta.toString();
  const link = helmet.link.toString();
  const script = helmet.script.toString();

  let html = template;
  if (title.replace(/<[^>]+>/g, '').trim()) html = html.replace(/<title>[\s\S]*?<\/title>/, '');

  // Drop template <meta> tags whose name/property the page redefines.
  const keys = new Set([...meta.matchAll(/(?:name|property)="([^"]+)"/g)].map(m => m[1]));
  html = html.replace(/<meta\s+(?:name|property)="([^"]+)"[^>]*>\s*/g, (tag, key) => (keys.has(key) ? '' : tag));

  // Same for canonical / alternate links.
  if (/rel="canonical"/.test(link)) html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/g, '');
  if (/rel="alternate"/.test(link)) html = html.replace(/<link\s+rel="alternate"\s+hreflang[^>]*>\s*/g, '');

  return html.replace('</head>', `${title}${meta}${link}${script}\n</head>`);
}

async function main() {
  const { render } = await import(pathToFileURL(ssrEntry).href);
  const template = readFileSync(join(distDir, 'index.html'), 'utf-8');
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('dist/index.html has no empty <div id="root"></div>; was it already prerendered?');
  }

  const routes = getRoutePaths();
  console.log(`Prerendering ${routes.length} routes (React SSR)...`);
  const failures = [];
  const outputs = [];

  for (const routePath of routes) {
    try {
      const { html, helmet } = await render(routePath);
      if (html.length < 2000) throw new Error(`suspiciously short output (${html.length} chars)`);
      const page = applyHead(template, helmet).replace('<div id="root"></div>', `<div id="root">${html}</div>`);
      outputs.push([routePath, page]);
    } catch (err) {
      failures.push(`${routePath}: ${err.message}`);
      console.error(`  ✗ ${routePath}: ${err.message}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Prerendering failed for ${failures.length} route(s):\n${failures.join('\n')}`);
  }

  // Write only after every route succeeded, so a failed build never leaves a
  // half-prerendered dist/ (the root index.html doubles as the template).
  for (const [routePath, page] of outputs) {
    const outDir = routePath === '/' ? distDir : join(distDir, routePath.replace(/^\//, ''));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), page);
  }
  rmSync(join(rootDir, 'dist-ssr'), { recursive: true, force: true });
  console.log(`Prerendered ${routes.length} routes successfully.`);
  // renderToPipeableStream can leave timers (e.g. the per-route timeout) pending.
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
