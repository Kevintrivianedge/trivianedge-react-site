export interface ServiceWorkerConfig {
  enabled?: boolean;
  updateCheckInterval?: number; // milliseconds
  onUpdate?: () => void;
  onError?: (error: Error) => void;
}

let registration: ServiceWorkerRegistration | null = null;
let updateCheckInterval: NodeJS.Timeout | null = null;

export async function registerServiceWorker(config: ServiceWorkerConfig = {}): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return null;
  }

  if (config.enabled === false) {
    return null;
  }

  try {
    registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      updateViaCache: 'none',
    });

    console.log('Service Worker registered successfully');

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration?.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            config.onUpdate?.();
          }
        });
      }
    });

    // Periodically check for updates
    if (config.updateCheckInterval !== 0) {
      const interval = config.updateCheckInterval || 60 * 60 * 1000; // 1 hour default
      updateCheckInterval = setInterval(() => {
        registration?.update().catch((error) => {
          console.error('Service Worker update check failed:', error);
        });
      }, interval);
    }

    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
    });

    return registration;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Service Worker registration failed:', err);
    config.onError?.(err);
    return null;
  }
}

export function unregisterServiceWorker(): Promise<boolean> {
  return new Promise((resolve) => {
    if (updateCheckInterval) {
      clearInterval(updateCheckInterval);
      updateCheckInterval = null;
    }

    if (registration) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('Service Worker unregistered');
          registration = null;
        }
        resolve(success);
      }).catch((error) => {
        console.error('Service Worker unregistration failed:', error);
        resolve(false);
      });
    } else {
      resolve(false);
    }
  });
}

export function getServiceWorkerRegistration(): ServiceWorkerRegistration | null {
  return registration;
}

export async function skipWaiting(): Promise<void> {
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

// IndexedDB helper for offline form submissions
export async function storeFailedSubmission(
  url: string,
  data: Record<string, unknown>
): Promise<void> {
  if (!('indexedDB' in window)) {
    console.warn('IndexedDB not supported');
    return;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('trivianedge-db', 1);

    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('failed-submissions')) {
        db.createObjectStore('failed-submissions', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('failed-submissions', 'readwrite');
      const store = transaction.objectStore('failed-submissions');

      store.add({
        url,
        data,
        timestamp: Date.now(),
      });

      transaction.oncomplete = () => {
        console.log('Submission stored for offline retry');
        // Trigger background sync if available
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          const syncRegistration = registration as (ServiceWorkerRegistration & {
            sync?: { register(tag: string): Promise<void> };
          }) | null;
          syncRegistration?.sync?.register('sync-submissions').catch((error: unknown) => {
            console.error('Background sync registration failed:', error);
          });
        }
        resolve();
      };

      transaction.onerror = () => reject(transaction.error);
    };
  });
}

export async function clearFailedSubmissions(): Promise<void> {
  if (!('indexedDB' in window)) return;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('trivianedge-db', 1);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('failed-submissions', 'readwrite');
      const store = transaction.objectStore('failed-submissions');
      store.clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };

    request.onerror = () => reject(request.error);
  });
}
