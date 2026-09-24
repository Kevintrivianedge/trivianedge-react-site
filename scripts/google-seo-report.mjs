#!/usr/bin/env node
// Google SEO report: PageSpeed Insights (Lighthouse + CrUX field data) and
// Search Console (URL inspection, sitemaps, 28-day search performance).
//
//   PSI_API_KEY=...            Google Cloud API key with the PageSpeed Insights API enabled
//   GSC_SA_KEY=path/to/sa.json Service-account key; the account's email must be added
//                              as a user on the Search Console property
//   GSC_PROPERTY=sc-domain:trivianedge.com   (default)
//
//   node scripts/google-seo-report.mjs [--psi] [--gsc] [--urls /,/services] [--submit-sitemap]
//
// --submit-sitemap resubmits /sitemap.xml first (needs the service account to
// have Full permission on the property; read-only is enough for everything else).
//
// Writes docs/seo-reports/<date>.md and prints a summary. Either section runs
// on its own when only its credential is set. No dependencies: the service
// account JWT is signed with node:crypto.
import { createSign } from 'crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

process.on('uncaughtException', e => { console.error(`Error: ${e.message}`); process.exit(1); });

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.trivianedge.com';
const PROPERTY = process.env.GSC_PROPERTY || 'sc-domain:trivianedge.com';
const DEFAULT_URLS = ['/', '/services', '/services/ai-development', '/services/it-outsourcing', '/proof', '/contact', '/blog'];
const TARGET = 95;

const args = process.argv.slice(2);
const flag = f => args.includes(f);
const urlsArg = args[args.indexOf('--urls') + 1];
const paths = args.includes('--urls') && urlsArg ? urlsArg.split(',') : DEFAULT_URLS;
const runPsi = flag('--psi') || (!flag('--gsc') && process.env.PSI_API_KEY);
const runGsc = flag('--gsc') || (!flag('--psi') && process.env.GSC_SA_KEY);

if (!runPsi && !runGsc) {
  console.error('Set PSI_API_KEY and/or GSC_SA_KEY. See docs/google-seo-setup.md.');
  process.exit(1);
}

const out = [`# Google SEO report: ${new Date().toISOString().slice(0, 10)}`, ''];
let failures = 0;

// ---------------------------------------------------------------- PageSpeed
async function psi(url, strategy) {
  const q = new URLSearchParams({ url, strategy, key: process.env.PSI_API_KEY });
  for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) q.append('category', c);
  const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error?.message || res.statusText);
  return body;
}

if (runPsi) {
  if (!process.env.PSI_API_KEY) throw new Error('PSI_API_KEY is not set');
  out.push('## PageSpeed Insights', '', `Target: ${TARGET}+ in every category.`, '');
  out.push('| URL | Device | Perf | A11y | Best pr. | SEO | Field LCP | Field INP | Field CLS | Field verdict |', '|---|---|---|---|---|---|---|---|---|---|');
  const failing = [];
  for (const path of paths) {
    for (const strategy of ['mobile', 'desktop']) {
      try {
        const r = await psi(SITE + path, strategy);
        const c = r.lighthouseResult.categories;
        const s = k => Math.round((c[k]?.score ?? 0) * 100);
        const f = r.loadingExperience?.metrics || {};
        const pct = k => (f[k] ? `${f[k].percentile}${k.includes('CUMULATIVE') ? '' : 'ms'}` : 'n/a');
        const scores = ['performance', 'accessibility', 'best-practices', 'seo'].map(s);
        if (scores.some(v => v < TARGET)) {
          failures++;
          const audits = Object.values(r.lighthouseResult.audits)
            .filter(a => a.score !== null && a.score < 0.9 && ['binary', 'numeric', 'metricSavings'].includes(a.scoreDisplayMode))
            .map(a => `${a.id}${a.displayValue ? ` (${a.displayValue})` : ''}`);
          failing.push(`- **${path} · ${strategy}**: ${audits.join(', ') || 'no individual audit below 0.9'}`);
        }
        out.push(`| ${path} | ${strategy} | ${scores.join(' | ')} | ${pct('LARGEST_CONTENTFUL_PAINT_MS')} | ${pct('INTERACTION_TO_NEXT_PAINT')} | ${f.CUMULATIVE_LAYOUT_SHIFT_SCORE ? f.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100 : 'n/a'} | ${r.loadingExperience?.overall_category || 'no field data'} |`);
        console.log(`PSI ${strategy.padEnd(7)} ${path.padEnd(28)} ${scores.join(' / ')}`);
      } catch (e) {
        failures++;
        out.push(`| ${path} | ${strategy} | error: ${e.message} | | | | | | | |`);
        console.error(`PSI ${strategy} ${path}: ${e.message}`);
      }
    }
  }
  if (failing.length) out.push('', '### Below target', '', ...failing);
  out.push('');
}

// ------------------------------------------------------------ Search Console
async function gscToken(scope = 'https://www.googleapis.com/auth/webmasters.readonly') {
  const sa = JSON.parse(readFileSync(process.env.GSC_SA_KEY, 'utf-8'));
  const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: sa.client_email,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;
  const sig = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}` }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Token exchange failed: ${body.error_description || body.error}`);
  return { token: body.access_token, email: sa.client_email };
}

async function gsc(token, path, init = {}) {
  const res = await fetch(`https://searchconsole.googleapis.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error?.message || res.statusText);
  return body;
}

if (runGsc) {
  if (!process.env.GSC_SA_KEY) throw new Error('GSC_SA_KEY is not set');
  const prop = encodeURIComponent(PROPERTY);
  if (flag('--submit-sitemap')) {
    const { token: rw } = await gscToken('https://www.googleapis.com/auth/webmasters');
    const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${prop}/sitemaps/${encodeURIComponent(SITE + '/sitemap.xml')}`, {
      method: 'PUT', headers: { Authorization: `Bearer ${rw}` },
    });
    if (!res.ok) throw new Error(`Sitemap submit failed (${res.status}): ${(await res.json().catch(() => ({}))).error?.message || res.statusText}`);
    console.log('Sitemap resubmitted: ' + SITE + '/sitemap.xml');
  }
  const { token, email } = await gscToken();
  out.push('## Search Console', '', `Property: \`${PROPERTY}\` · service account: \`${email}\``, '');

  // URL inspection: index status, canonical, mobile usability, rich results
  out.push('### URL inspection', '', '| URL | Verdict | Coverage | Google canonical | Last crawl | Rich results |', '|---|---|---|---|---|---|');
  for (const path of paths) {
    try {
      const r = await gsc(token, '/v1/urlInspection/index:inspect', {
        method: 'POST',
        body: JSON.stringify({ inspectionUrl: SITE + path, siteUrl: PROPERTY }),
      });
      const ix = r.inspectionResult?.indexStatusResult || {};
      const rich = r.inspectionResult?.richResultsResult;
      if (ix.verdict !== 'PASS') failures++;
      out.push(`| ${path} | ${ix.verdict} | ${ix.coverageState || ''} | ${ix.googleCanonical || ''} | ${ix.lastCrawlTime?.slice(0, 10) || ''} | ${rich ? `${rich.verdict} (${(rich.detectedItems || []).map(i => i.richResultType).join(', ')})` : 'none'} |`);
      console.log(`GSC inspect ${path.padEnd(28)} ${ix.verdict} · ${ix.coverageState}`);
    } catch (e) {
      failures++;
      out.push(`| ${path} | error: ${e.message} | | | | |`);
    }
  }

  // Sitemaps
  const sm = await gsc(token, `/webmasters/v3/sites/${prop}/sitemaps`);
  out.push('', '### Sitemaps', '', '| Sitemap | Last downloaded | Errors | Warnings | Submitted | Indexed |', '|---|---|---|---|---|---|');
  for (const s of sm.sitemap || []) {
    const c = s.contents?.[0] || {};
    if (Number(s.errors) > 0) failures++;
    out.push(`| ${s.path} | ${s.lastDownloaded?.slice(0, 10) || ''} | ${s.errors} | ${s.warnings} | ${c.submitted ?? ''} | ${c.indexed ?? ''} |`);
  }

  // 28-day performance, top queries and pages
  const end = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
  const start = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const query = dims => gsc(token, `/webmasters/v3/sites/${prop}/searchAnalytics/query`, {
    method: 'POST',
    body: JSON.stringify({ startDate: start, endDate: end, dimensions: dims, rowLimit: 15 }),
  });
  const [total, byQuery, byPage] = await Promise.all([query([]), query(['query']), query(['page'])]);
  const t = total.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  out.push('', `### Search performance ${start} → ${end}`, '', `Clicks **${t.clicks}** · Impressions **${t.impressions}** · CTR **${(t.ctr * 100).toFixed(1)}%** · Avg position **${t.position.toFixed(1)}**`, '');
  const table = (title, rows) => {
    out.push(`| ${title} | Clicks | Impr. | CTR | Pos. |`, '|---|---|---|---|---|');
    for (const r of rows || []) out.push(`| ${r.keys[0]} | ${r.clicks} | ${r.impressions} | ${(r.ctr * 100).toFixed(1)}% | ${r.position.toFixed(1)} |`);
    out.push('');
  };
  table('Query', byQuery.rows);
  table('Page', byPage.rows);
  console.log(`GSC 28d: ${t.clicks} clicks, ${t.impressions} impressions, pos ${t.position.toFixed(1)}`);
}

const dir = join(ROOT, 'docs', 'seo-reports');
mkdirSync(dir, { recursive: true });
const file = join(dir, `${new Date().toISOString().slice(0, 10)}.md`);
writeFileSync(file, out.join('\n') + '\n');
console.log(`\nReport: ${file}${failures ? ` · ${failures} item(s) below target` : ' · all checks at target'}`);
process.exit(failures ? 2 : 0);
