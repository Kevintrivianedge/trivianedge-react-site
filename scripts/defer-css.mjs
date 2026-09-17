import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const indexPath = join(distDir, 'index.html');

let html = readFileSync(indexPath, 'utf-8');

// Defer non-critical CSS links to avoid render-blocking requests
html = html.replace(
  /<link rel="stylesheet"([^>]*?)href="([^"]*)"([^>]*)>/g,
  (match, before, href, after) => {
    // Keep Google Fonts and other critical resources synchronous
    if (href.includes('fonts.googleapis.com')) return match;

    // Defer Vite-generated CSS
    return `<link rel="stylesheet" media="print"${before}href="${href}"${after} onload="this.media='all'">`;
  }
);

writeFileSync(indexPath, html);
console.log('✓ CSS deferral applied to dist/index.html');
