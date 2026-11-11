// @vitest-environment node

import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const origin = 'https://www.trivianedge.com';
const source = readFileSync(new URL('../../public/service-worker.js', import.meta.url), 'utf8');

function setup(response = new Response('ok')) {
  const listeners = new Map<string, (event: unknown) => void>();
  const cache = { match: vi.fn(), put: vi.fn() };
  const caches = {
    open: vi.fn(async () => cache),
    keys: vi.fn(async () => ['trivianedge-v1', 'trivianedge-api-v1', 'unrelated-cache']),
    delete: vi.fn(),
  };
  const fetch = vi.fn(async () => response);

  runInNewContext(source, {
    self: {
      location: { origin },
      addEventListener: (name: string, handler: (event: unknown) => void) => listeners.set(name, handler),
      clients: { claim: vi.fn() },
    },
    caches, fetch, URL, Response,
  });

  return { listeners, cache, caches };
}

describe('service worker caches', () => {
  it('leaves visitor-specific and authenticated GET requests to the network', () => {
    const { listeners, caches } = setup();
    for (const path of ['/api/geo', '/api/admin/venture-stats', '/api/health']) {
      const respondWith = vi.fn();
      listeners.get('fetch')?.({ request: new Request(origin + path), respondWith });
      expect(respondWith).not.toHaveBeenCalled();
    }
    expect(caches.open).not.toHaveBeenCalled();
  });

  it('does not store a no-store response even on a public cache route', async () => {
    const { listeners, cache } = setup(new Response('ok', { headers: { 'Cache-Control': 'private, no-store' } }));
    const respondWith = vi.fn();
    listeners.get('fetch')?.({ request: new Request(origin + '/api/faq'), respondWith });
    await respondWith.mock.calls[0][0];
    expect(cache.put).not.toHaveBeenCalled();
  });

  it('clears legacy site caches without deleting unrelated caches', async () => {
    const { listeners, caches } = setup();
    const waitUntil = vi.fn();
    listeners.get('activate')?.({ waitUntil });
    await waitUntil.mock.calls[0][0];
    expect(caches.delete.mock.calls).toEqual([['trivianedge-v1'], ['trivianedge-api-v1']]);
  });
});
