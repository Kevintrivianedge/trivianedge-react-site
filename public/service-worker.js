const CACHE_NAME = 'trivianedge-v1';
const ASSET_CACHE = 'trivianedge-assets-v1';
const API_CACHE = 'trivianedge-api-v1';
const OFFLINE_PAGE = '/offline.html';

const ASSET_PATTERNS = ['/assets/', '.js', '.css', '.woff2', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif'];
const API_PATTERNS = ['/api/', '/talent-hubs', '/faq', '/team'];
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
          if (![CACHE_NAME, ASSET_CACHE, API_CACHE, 'offline-page'].includes(cacheName)) {
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

  if (request.method !== 'GET') {
    event.respondWith(fetch(request).catch(() => {
      return new Response(JSON.stringify({ error: 'Offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }));
    return;
  }

  if (isAssetRequest(url)) {
    event.respondWith(cacheFirstStrategy(request, ASSET_CACHE));
  } else if (isStaleWhileRevalidateRequest(url)) {
    event.respondWith(staleWhileRevalidateStrategy(request, API_CACHE));
  } else if (isApiRequest(url)) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
  } else {
    event.respondWith(networkFirstStrategy(request, CACHE_NAME));
  }
});

function isAssetRequest(url) {
  return ASSET_PATTERNS.some((pattern) => url.pathname.includes(pattern));
}

function isApiRequest(url) {
  return API_PATTERNS.some((pattern) => url.pathname.includes(pattern));
}

function isStaleWhileRevalidateRequest(url) {
  return STALE_WHILE_REVALIDATE_PATTERNS.some((pattern) => url.pathname.includes(pattern));
}

async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
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
    if (response.ok || response.status === 404) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    if (request.destination === 'document') {
      return cache.match(OFFLINE_PAGE);
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
    if (response.ok) {
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
