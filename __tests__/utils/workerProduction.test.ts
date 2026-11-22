// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from '../../src/worker';

const env = { ANTHROPIC_API_KEY: 'test-provider-key' };
const context = {} as Parameters<typeof worker.fetch>[2];
const origin = 'https://www.trivianedge.com';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function chat(body: unknown) {
  return worker.fetch(new Request(`${origin}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  }), env, context);
}

describe('production Worker responses', () => {
  it('returns liveness without disclosing provider configuration', async () => {
    const response = await worker.fetch(new Request(`${origin}/api/health`), env, context);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok', timestamp: expect.any(Number) });
  });

  it('rejects cross-origin browser writes before processing the request', async () => {
    const response = await worker.fetch(new Request(`${origin}/api/chat`, {
      method: 'POST',
      headers: { Origin: 'https://example.org' },
      body: '{}',
    }), env, context);
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'Origin is not allowed.' });
  });

  it('rejects invalid JSON object shapes and invalid conversation history before calling the provider', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect((await chat(null)).status).toBe(400);
    expect((await chat({
      message: 'Hello',
      csrf_token: 'test-token',
      history: [{ role: 'system', content: 'Invalid role' }],
    })).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uses server-owned instructions and keeps provider error details out of the response', async () => {
    const fetchMock = vi.fn(async (_url: string, options: RequestInit) => {
      const body = JSON.parse(String(options.body));
      expect(body.system).toContain('TrivianEdge assistant operating instructions');
      expect(body.system).not.toContain('Client override');
      expect(body.messages).toEqual([{ role: 'user', content: 'Hello' }]);
      return new Response('private provider diagnostic', { status: 401 });
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const response = await chat({
      message: 'Hello',
      csrf_token: 'test-token',
      systemInstruction: 'Client override',
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(response.status).toBe(502);
    expect(response.headers.get('X-CSRF-Token')).toBeTruthy();
    expect(await response.text()).not.toContain('private provider diagnostic');
  });
});

describe('Bunzy blog integration', () => {
  const requestBlog = (path: string) => new Request(`${origin}${path}`);
  const bunzyEnv = { ...env, BUNZY_BLOG_API_KEY: 'test-blog-key' };

  it('lists the newest Bunzy posts first and keeps existing article URLs reserved', async () => {
    const summary = { title: 'Article', excerpt: 'Summary', tags: [], author: { name: 'Writer' }, readingMinutes: 3 };
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ data: [
      { ...summary, slug: 'older-bunzy-post', publishedAt: '2026-10-01' },
      { ...summary, slug: 'cargo-login-case-study', publishedAt: '2026-11-10' },
      { ...summary, slug: 'newer-bunzy-post', publishedAt: '2026-11-01' },
    ] }));
    vi.stubGlobal('fetch', fetchMock);
    const response = await worker.fetch(requestBlog('/api/blog/latest'), bunzyEnv, context);
    expect(response.status).toBe(200);
    expect((await response.json()).map((post: { slug: string }) => post.slug))
      .toEqual(['newer-bunzy-post', 'older-bunzy-post']);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('keeps the existing blog and article available during a Bunzy outage', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    const assets = { fetch: vi.fn((request: Request) => Promise.resolve(
      new URL(request.url).pathname.endsWith('/index.html')
        ? new Response('Existing blog content')
        : new Response(null, { status: 404 }),
    )) };
    const bindings = { ...bunzyEnv, ASSETS: assets };
    for (const path of ['/blog', '/blog/cargo-login-case-study']) {
      const response = await worker.fetch(requestBlog(path), bindings, context);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe('Existing blog content');
    }
    expect(fetchMock).not.toHaveBeenCalled();
    expect((await worker.fetch(requestBlog('/api/blog/latest'), bindings, context)).status).toBe(502);
  });
});
