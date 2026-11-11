import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { transformWithEsbuild } from 'vite';

// Vite copies these browser scripts as-is. Optimize the copies without
// changing their stable URLs or stripping license notices.
const scripts = ['critical-loader.js', 'meta-pixel.js', 'service-worker.js', 'ui-init.js'];
await Promise.all(scripts.map(async script => {
  const file = join('dist', script);
  const source = await readFile(file, 'utf8');
  const { code } = await transformWithEsbuild(source, file, {
    loader: 'js',
    minifyWhitespace: true,
    minifySyntax: true,
    legalComments: 'inline',
    sourcemap: false,
  });
  await writeFile(file, code);
}));
