/**
 * Build-time llms-full.txt (llmstxt.org): the full text of every sitemap
 * route as Markdown-ish plain text, for LLM crawlers and agents that want the
 * whole site in one fetch. Reads the prerendered dist/<route>/index.html
 * files, so it must run after scripts/prerender.mjs.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(rootDir, 'dist');
const SITE = 'https://www.trivianedge.com';

const decode = s => s
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n));

function pageText(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? html.match(/<body[\s\S]*<\/body>/)?.[0] ?? '';
  return decode(main
    .replace(/<(script|style|svg|noscript|nav|footer)[\s\S]*?<\/\1>/g, '')
    .replace(/<h([1-4])[^>]*>/g, (_, n) => `\n\n${'#'.repeat(Number(n) + 1)} `)
    .replace(/<\/h[1-4]>/g, '\n')
    .replace(/<li[^>]*>/g, '\n- ')
    .replace(/<(p|div|section|tr|br)[^>]*>/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ''))
    .split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean)
    .filter((l, i, a) => l !== a[i - 1])
    .join('\n')
    .replace(/\n(#+ )/g, '\n\n$1');
}

const sitemap = readFileSync(join(rootDir, 'public/sitemap.xml'), 'utf-8');
const paths = [...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, u]) => new URL(u).pathname))];
const legal = new Set(['/privacy', '/terms', '/cookie-policy']);

const intro = readFileSync(join(rootDir, 'public/llms.txt'), 'utf-8').split('\n## ')[0].trim();
const out = [intro, '', `This file contains the full text of every public page on ${SITE}. The index is at ${SITE}/llms.txt.`, ''];
let count = 0;
for (const path of paths.filter(p => !legal.has(p))) {
  const file = join(distDir, path, 'index.html');
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf-8');
  const title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? path);
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  out.push('---', '', `## ${title}`, '', `URL: ${SITE}${path}`, desc && `> ${desc}`, '', pageText(html), '');
  count++;
}

writeFileSync(join(distDir, 'llms-full.txt'), out.filter(l => l !== '').join('\n').replace(/\n(---|## |URL: |> )/g, '\n\n$1') + '\n');
console.log(`llms-full.txt: ${count} pages`);
