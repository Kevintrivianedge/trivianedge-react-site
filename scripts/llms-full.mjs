/**
 * Build-time llms-full.txt (llmstxt.org): the full text of every sitemap
 * route as Markdown-ish plain text, for LLM crawlers and agents that want the
 * whole site in one fetch. Reads the prerendered dist/<route>/index.html
 * files, so it must run after scripts/prerender.mjs.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Window } from 'happy-dom';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(rootDir, 'dist');
const SITE = 'https://www.trivianedge.com';

const skipTags = new Set(['SCRIPT', 'STYLE', 'SVG', 'NOSCRIPT', 'TEMPLATE', 'NAV', 'FOOTER', 'FORM', 'IFRAME']);
const blockTags = new Set(['P', 'DIV', 'SECTION', 'ARTICLE', 'TR', 'BR']);

function textFor(node) {
  if (node.nodeType === 3) return node.nodeValue ?? '';
  if (node.nodeType !== 1 || skipTags.has(node.tagName.toUpperCase()) ||
      node.hidden || node.getAttribute('aria-hidden') === 'true') return '';
  const text = Array.from(node.childNodes, textFor).join('');
  if (/^H[1-4]$/.test(node.tagName)) return `\n\n${'#'.repeat(Number(node.tagName[1]) + 1)} ${text}\n`;
  if (node.tagName === 'LI') return `\n- ${text}`;
  return blockTags.has(node.tagName) ? `\n${text}` : text;
}

function pageText(document) {
  return textFor(document.querySelector('main') ?? document.body)
    .split('\n').map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean)
    .filter((line, index, lines) => line !== lines[index - 1])
    .join('\n')
    .replace(/\n(#+ )/g, '\n\n$1');
}

const sitemap = readFileSync(join(rootDir, 'public/sitemap.xml'), 'utf-8');
const paths = [...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, u]) => new URL(u).pathname))];
const legal = new Set(['/privacy', '/terms', '/cookie-policy']);

const intro = readFileSync(join(rootDir, 'public/llms.txt'), 'utf-8').split('\n## ')[0].trim();
const out = [intro, '', `This file contains the full text of every public page on ${SITE}. The index is at ${SITE}/llms.txt.`, ''];
const window = new Window({
  settings: { disableJavaScriptEvaluation: true, disableJavaScriptFileLoading: true, disableCSSFileLoading: true },
});
const parser = new window.DOMParser();
let count = 0;
for (const path of paths.filter(p => !legal.has(p))) {
  const file = join(distDir, path, 'index.html');
  if (!existsSync(file)) continue;
  const document = parser.parseFromString(readFileSync(file, 'utf-8'), 'text/html');
  const title = document.title || path;
  const desc = document.querySelector('meta[name="description"]')?.content ?? '';
  out.push('---', '', `## ${title}`, '', `URL: ${SITE}${path}`, desc && `> ${desc}`, '', pageText(document), '');
  count++;
}

await window.happyDOM.close();
writeFileSync(join(distDir, 'llms-full.txt'), out.filter(l => l !== '').join('\n').replace(/\n(---|## |URL: |> )/g, '\n\n$1') + '\n');
console.log(`llms-full.txt: ${count} pages`);
