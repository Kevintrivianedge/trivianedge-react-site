
import './src/tailwind.css';
import './src/theme.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { LazyMotion } from 'framer-motion';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// scripts/prerender.mjs sets this via an init script before the headless
// browser loads each route. `waitUntil: 'networkidle'` plus its own extra
// wait comfortably outlasts requestIdleCallback's 4s timeout below, so
// without this guard every "deferred" script/stylesheet (GA4, Clarity,
// the cookie-consent banner's CSS) would actually fire during the
// prerender pass and get baked into the static snapshot as if it were
// static markup — real visitors would then get it eagerly, render-blocking,
// on first load, exactly the opposite of what deferring it was for.
const isPrerendering = typeof window !== 'undefined' && Boolean((window as { __PRERENDER__?: boolean }).__PRERENDER__);

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LazyMotion features={() => import('./utils/motionFeatures').then(mod => mod.default)}>
          <App />
        </LazyMotion>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// createRoot, not hydrateRoot: the prerender snapshot (scripts/prerender.mjs)
// is captured after effects run (theme, geo, lazy chunks), so it never matches
// the first client render and hydration fails with React #418 on every route.
// Switching to hydrateRoot first needs the snapshot taken pre-effects.
ReactDOM.createRoot(rootElement).render(app);

// Hands off from the pre-boot scrim (index.html) to the real app. Gated on
// the deferred (media="print") stylesheets actually being active, not just
// on root.render() having run: src/worker.ts serves each route as a
// *prerendered* snapshot (scripts/prerender.mjs), so #root already has
// real, fully-formed markup by the time this file executes — the visible
// "static stuff" isn't missing content, it's that content briefly painting
// unstyled while the main CSS bundle and Google Fonts sit at media="print"
// waiting on critical-loader.js's load-driven swap to "all" (see that
// file). Revealing only once every such stylesheet's .sheet is populated
// means the scrim comes down exactly when there's a styled page under it,
// same signal critical-loader.js itself relies on for the swap.
function prebootStylesReady(): boolean {
  const deferredLinks = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][media="print"]');
  return Array.from(deferredLinks).every((link) => link.sheet);
}

function revealApp() {
  const splash = document.getElementById('preboot-splash');
  if (!splash) return;
  splash.classList.add('preboot-splash-hide');
  setTimeout(() => splash.remove(), 150);
}

// requestAnimationFrame-driven poll rather than a timer: these are same-origin
// (Google Fonts aside) stylesheets already in flight before this module even
// runs, so they typically resolve within a handful of frames — polling on
// paint ticks reveals the app the moment it's actually styled instead of on
// a fixed guess. deadline is a last-resort escape hatch (a blocked/failed
// font or CSS request) so a real visitor is never stuck looking at the
// splash indefinitely if a stylesheet never fires 'load'.
const prebootDeadline = Date.now() + 4000;
function waitForStylesThenReveal() {
  if (prebootStylesReady() || Date.now() > prebootDeadline) {
    // Double rAF: the first callback can fire before the browser has
    // painted the styles that just became active; the second is
    // guaranteed to run after that paint.
    requestAnimationFrame(() => requestAnimationFrame(revealApp));
    return;
  }
  requestAnimationFrame(waitForStylesThenReveal);
}
waitForStylesThenReveal();

// Amplitude and the Meta Pixel no longer start unconditionally here — they
// wait on the visitor actually granting consent via the self-hosted banner
// in src/cookieConsent.ts (which also forwards the choice to Google's
// Consent Mode API below). A static top-level import would still force the
// browser to fetch and evaluate the consent-banner's module graph before
// this file's own code runs — ES module imports resolve before the
// importing module executes, regardless of when run() is actually called —
// so the import itself has to be dynamic too, not just the init call.
const initCookieConsent = () => {
  import('./src/cookieConsent').then(({ initCookieConsent: run }) => run());
};

// Google Analytics (gtag.js), deferred the same way and for the same reason as
// Amplitude above. Injected as an external <script src> rather than Google's
// documented inline <script> snippet: the worker's CSP (src/worker.ts) is
// intentionally stricter than the meta-tag fallback in index.html and omits
// 'unsafe-inline' from script-src, so a literal inline script body would be
// silently blocked in production. An external src-loaded script needs no such
// allowance — it just needs its origin added to script-src (see index.html
// and src/worker.ts).
// The GA4 measurement ID is a public client-side identifier, like the
// Amplitude API key above — it does not grant write or admin access.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
const GA_MEASUREMENT_ID = 'G-KMWT547BH8';

// EEA (27 EU member states + Iceland, Liechtenstein, Norway) plus the UK and
// Switzerland, whose privacy laws (UK GDPR, Swiss FADP) carry the same
// opt-in-before-collection requirement as GDPR. CA is included for Quebec's
// Law 25 (in force since Sept 2023), which imposes the same GDPR-style
// opt-in bar — scoping to the whole country rather than just Quebec is the
// conservative, low-cost choice. AU is included because TrivianEdge actively
// markets to Australian clients (see HOME_FAQS in App.tsx) and, while the
// Privacy Act is a lighter opt-out/notice regime, there's no cost to holding
// it to the stricter bar too. Scoping the "default: denied" state to just
// this list via Consent Mode's `region` param means visitors everywhere else
// (including US states, which are opt-out regimes — see the GPC handling in
// src/cookieConsent.ts) keep getting full measurement by default, with the
// banner still shown to every visitor regardless of region either way.
const CONSENT_REQUIRED_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL',
  'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH', 'CA', 'AU',
];

const initGoogleAnalytics = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };

  // Consent Mode v2: default to denied for EEA/UK/CH so no measurement or ads
  // data is sent for those visitors until they've actually consented via the
  // banner in src/cookieConsent.ts, which calls gtag('consent', 'update', ...)
  // once a visitor makes a choice.
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    region: CONSENT_REQUIRED_REGIONS,
    wait_for_update: 500,
  });

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
};

const initServiceWorker = () => {
  import('./utils/serviceWorkerRegistry').then(({ registerServiceWorker }) => {
    registerServiceWorker({
      updateCheckInterval: 60 * 60 * 1000, // Check for updates hourly
      onUpdate: () => {
        console.log('Service Worker update available');
      },
      onError: (error) => {
        console.error('Service Worker registration error:', error);
      },
    });
  });
};

if (!isPrerendering) {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(initCookieConsent, { timeout: 2000 });
    requestIdleCallback(initGoogleAnalytics, { timeout: 4000 });
    requestIdleCallback(initServiceWorker, { timeout: 5000 });
  } else {
    setTimeout(initCookieConsent, 1000);
    setTimeout(initGoogleAnalytics, 1000);
    setTimeout(initServiceWorker, 2000);
  }
}
