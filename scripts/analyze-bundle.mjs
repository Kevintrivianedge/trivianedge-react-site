#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

/**
 * Analyze bundle size and generate report
 */
async function analyzeBundleSize() {
  console.log('📦 Bundle Size Analysis\n');

  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  const files = fs.readdirSync(distDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));

  let totalSize = 0;
  const bundles = [];

  console.log('JavaScript Bundles:');
  console.log('─'.repeat(50));

  for (const file of jsFiles) {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    const sizeKb = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;

    console.log(`  ${file.padEnd(40)} ${sizeKb.padStart(8)} KB`);
    bundles.push({ file, size: stats.size, type: 'js' });
  }

  console.log('\nCSS Bundles:');
  console.log('─'.repeat(50));

  for (const file of cssFiles) {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    const sizeKb = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;

    console.log(`  ${file.padEnd(40)} ${sizeKb.padStart(8)} KB`);
    bundles.push({ file, size: stats.size, type: 'css' });
  }

  const totalMb = (totalSize / (1024 * 1024)).toFixed(2);
  console.log('─'.repeat(50));
  console.log(`  Total Size: ${totalMb} MB\n`);

  // Check against budgets
  const budgets = {
    'main.js': 250 * 1024,
    'vendor.js': 400 * 1024,
  };

  console.log('📊 Budget Check:');
  console.log('─'.repeat(50));

  let budgetOk = true;
  for (const bundle of bundles) {
    for (const [name, limit] of Object.entries(budgets)) {
      if (bundle.file.includes(name.split('.')[0])) {
        const sizeKb = bundle.size / 1024;
        const limitKb = limit / 1024;
        const status = bundle.size <= limit ? '✅' : '❌';

        console.log(`  ${status} ${bundle.file.padEnd(40)} ${sizeKb.toFixed(2).padStart(8)} KB / ${limitKb.toFixed(2)} KB`);

        if (bundle.size > limit) {
          budgetOk = false;
        }
      }
    }
  }

  console.log('─'.repeat(50));
  if (budgetOk) {
    console.log('✅ All bundles within budget!\n');
  } else {
    console.warn('⚠️  Some bundles exceed budget. Consider code-splitting or minification.\n');
  }

  // Recommendations
  console.log('💡 Optimization Tips:');
  console.log('─'.repeat(50));
  console.log('  1. Check for unused dependencies: npm audit');
  console.log('  2. Tree-shake unused code: enable production build');
  console.log('  3. Code-split by route: check Vite config');
  console.log('  4. Lazy load components: use React.lazy()');
  console.log('  5. Minify assets: production build enabled');
  console.log('');
}

analyzeBundleSize().catch(err => {
  console.error('Bundle analysis failed:', err);
  process.exit(1);
});
