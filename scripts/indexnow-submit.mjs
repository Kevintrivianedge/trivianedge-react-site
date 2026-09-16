// Pings IndexNow (fans out to Bing, Yandex, Naver, Seznam, Yep) with every URL
// in the live sitemap after each deploy, so new/changed pages get crawled
// within minutes instead of waiting on organic re-crawl discovery.
const HOST = 'www.trivianedge.com';
const KEY = 'f9a873ff767e711b2229a4735e0354c5';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

async function main() {
  const sitemapRes = await fetch(SITEMAP_URL);
  if (!sitemapRes.ok) {
    console.error(`indexnow-submit: failed to fetch sitemap (${sitemapRes.status}), skipping`);
    return;
  }
  const sitemapXml = await sitemapRes.text();
  const urlList = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (urlList.length === 0) {
    console.error('indexnow-submit: no URLs found in sitemap, skipping');
    return;
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });

  if (res.ok) {
    console.log(`indexnow-submit: submitted ${urlList.length} URLs (status ${res.status})`);
  } else {
    console.error(`indexnow-submit: submission failed (status ${res.status})`);
  }
}

main().catch((err) => {
  console.error('indexnow-submit: unexpected error', err);
});
