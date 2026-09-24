import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const indexPath = join(distDir, 'index.html');

let html = readFileSync(indexPath, 'utf-8');

// Defer non-critical CSS links to avoid render-blocking requests. The actual
// media="print" -> "all" swap runs from /critical-loader.js (an external,
// same-origin script referenced in index.html's <head>) rather than an
// inline onload="" attribute here — inline event-handler attributes are
// exactly what a CSP's script-src can gate behind a nonce/hash, and an edge
// layer outside this app's control has been observed doing that on some
// requests. See critical-loader.js for the full reasoning.
html = html.replace(
  /<link rel="stylesheet"([^>]*?)href="([^"]*)"([^>]*)>/g,
  (match, before, href, after) => {
    // Keep Google Fonts and other critical resources synchronous
    if (href.includes('fonts.googleapis.com')) return match;
    // The main app stylesheet (~17 KB gzipped) stays render-blocking: the
    // prerendered HTML can then paint styled on first frame, with no scrim
    // waiting on JS. Deferring it cost ~3.7s of LCP render delay on mobile.
    if (/\/assets\/index-[^/]*\.css$/.test(href)) return match;

    // Defer Vite-generated CSS
    return `<link rel="stylesheet" media="print"${before}href="${href}"${after}>`;
  }
);

writeFileSync(indexPath, html);
console.log('✓ CSS deferral applied to dist/index.html');
