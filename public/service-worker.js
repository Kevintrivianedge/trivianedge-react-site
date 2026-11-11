const CACHE_NAME = 'trivianedge-v2';
const ASSET_CACHE = 'trivianedge-assets-v2';
const API_CACHE = 'trivianedge-api-v2';
const OFFLINE_PAGE = '/offline.html';

const MEDIA_EXTENSIONS = ['.woff2', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif'];
const STALE_WHILE_REVALIDATE_PATTERNS = ['/api/faq', '/api/team', '/api/talent-hubs'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME),
      caches.open(ASSET_CACHE),
      caches.open(API_CACHE),
      caches.open('offline-page').then((cache) => cache.add(OFFLINE_PAGE)),
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('trivianedge-') && ![CACHE_NAME, ASSET_CACHE, API_CACHE].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.method !== 'GET') {
    event.respondWith(fetch(request).catch(() => {
      return new Response(JSON.stringify({ error: 'Offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }));
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    if (isStaleWhileRevalidateRequest(url) && !request.headers.has('Authorization') &&
        !request.headers.has('X-Admin-Token')) {
      event.respondWith(staleWhileRevalidateStrategy(request, API_CACHE));
    }
    return;
  }

  if (isAssetRequest(url)) {
    event.respondWith(cacheFirstStrategy(request, ASSET_CACHE));
  } else {
    event.respondWith(networkFirstStrategy(request, CACHE_NAME));
  }
});

function isAssetRequest(url) {
  return url.pathname.startsWith('/assets/') || MEDIA_EXTENSIONS.some(extension => url.pathname.endsWith(extension));
}

function isStaleWhileRevalidateRequest(url) {
  return STALE_WHILE_REVALIDATE_PATTERNS.includes(url.pathname);
}

function isCacheable(response, revalidates = false) {
  const directives = response.headers.get('Cache-Control') || '';
  return response.ok && !/(?:^|,)\s*(?:private|no-store)\b/i.test(directives) &&
    (revalidates || !/(?:^|,)\s*no-cache\b/i.test(directives));
}

async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (isCacheable(response, true)) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    if (request.destination === 'document') {
      return (await caches.match(OFFLINE_PAGE, { cacheName: 'offline-page' })) || Response.error();
    }

    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (isCacheable(response)) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached || new Response(JSON.stringify({ error: 'Offline' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  }));

  return cached || fetchPromise;
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-submissions') {
    event.waitUntil(syncFailedSubmissions());
  }
});

async function syncFailedSubmissions() {
  try {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('trivianedge-db', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('failed-submissions')) {
          db.createObjectStore('failed-submissions', { keyPath: 'id', autoIncrement: true });
        }
      };
    });

    const transaction = db.transaction('failed-submissions', 'readonly');
    const store = transaction.objectStore('failed-submissions');

    const submissions = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    for (const submission of submissions) {
      try {
        const response = await fetch(submission.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission.data),
        });

        if (response.ok) {
          const deleteTransaction = db.transaction('failed-submissions', 'readwrite');
          const deleteStore = deleteTransaction.objectStore('failed-submissions');
          deleteStore.delete(submission.id);
        }
      } catch (error) {
        console.error('Failed to sync submission:', error);
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
