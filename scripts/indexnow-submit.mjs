// Pings IndexNow (fans out to Bing, Yandex, Naver, Seznam, Yep) with every URL
// in the live sitemap after each deploy, so new/changed pages get crawled
// within minutes instead of waiting on organic re-crawl discovery.
const HOST = 'www.trivianedge.com';
const KEY = 'b60b3c2124cf4a91828dc2e07ce295aa';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS_PER_REQUEST = 10000; // IndexNow API limit

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function main() {
  console.log('indexnow-submit: starting submission...');

  try {
    // Fetch and parse sitemap
    console.log(`indexnow-submit: fetching sitemap from ${SITEMAP_URL}`);
    const sitemapRes = await fetchWithTimeout(SITEMAP_URL, {}, 15000);

    if (!sitemapRes.ok) {
      console.error(`indexnow-submit: failed to fetch sitemap (${sitemapRes.status})`);
      console.error(`indexnow-submit: Response headers: ${JSON.stringify([...sitemapRes.headers.entries()])}`);
      return;
    }

    const sitemapXml = await sitemapRes.text();
    const urlList = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    if (urlList.length === 0) {
      console.error('indexnow-submit: no URLs found in sitemap');
      return;
    }

    console.log(`indexnow-submit: found ${urlList.length} URLs in sitemap`);

    // Submit URLs (may need to batch if over API limit)
    const urlsToSubmit = urlList.slice(0, MAX_URLS_PER_REQUEST);
    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlsToSubmit
    };

    console.log(`indexnow-submit: submitting ${urlsToSubmit.length} URLs to IndexNow API...`);
    console.log(`indexnow-submit: API endpoint: ${INDEXNOW_ENDPOINT}`);

    const res = await fetchWithTimeout(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload),
    }, 15000);

    const responseText = await res.text();

    if (res.ok) {
      console.log(`✓ indexnow-submit: successfully submitted ${urlsToSubmit.length} URLs (status ${res.status})`);
      if (responseText) {
        console.log(`indexnow-submit: response: ${responseText}`);
      }
    } else {
      console.error(`✗ indexnow-submit: submission failed with status ${res.status}`);
      console.error(`indexnow-submit: response: ${responseText}`);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('indexnow-submit: request timeout (10s)');
    } else {
      console.error('indexnow-submit: unexpected error:', err.message);
      console.error(err.stack);
    }
  }
}

main();
