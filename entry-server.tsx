// Build-time server renderer used by scripts/prerender.mjs. Produces real React
// SSR markup (with Suspense boundary markers) so index.tsx can hydrateRoot the
// prerendered HTML instead of discarding and re-rendering it.
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Writable } from 'node:stream';
import App from './App';

export async function render(url: string): Promise<{ html: string; helmet: HelmetServerState | undefined }> {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const app = (
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <LazyMotion features={domAnimation}>
            <App />
          </LazyMotion>
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );

  const html = await new Promise<string>((resolve, reject) => {
    let out = '';
    const timer = setTimeout(() => { stream.abort(); reject(new Error(`SSR timed out for ${url}`)); }, 20_000);
    const sink = new Writable({
      write(chunk, _enc, cb) { out += chunk.toString(); cb(); },
      final(cb) { clearTimeout(timer); resolve(out); cb(); },
    });
    const stream = renderToPipeableStream(app, {
      // Wait for every lazy route/component so crawlers get full content.
      onAllReady() { stream.pipe(sink); },
      onShellError(err) { clearTimeout(timer); reject(err); },
      onError(err) { clearTimeout(timer); reject(err); },
    });
  });

  return { html, helmet: helmetContext.helmet };
}
