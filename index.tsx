
import './src/tailwind.css';
import './src/theme.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

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

// Microsoft Clarity, deferred the same way as GA4 above instead of running
// eagerly at head-parse time in index.html. The tag's own loader script is
// already async, so this only changes *when* that fetch kicks off, not
// whether it blocks rendering.
const initClarity = () => {
  (function (c: any, l: Document, a: string, r: string, i: string, t?: HTMLScriptElement, y?: Element) {
    c[a] = c[a] || function (...args: unknown[]) { (c[a].q = c[a].q || []).push(args); };
    t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = `https://www.clarity.ms/tag/${i}?ref=bwt`;
    y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'yji0tnzvdy');
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

if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(initCookieConsent, { timeout: 4000 });
  requestIdleCallback(initGoogleAnalytics, { timeout: 4000 });
  requestIdleCallback(initClarity, { timeout: 4000 });
  requestIdleCallback(initServiceWorker, { timeout: 5000 });
} else {
  setTimeout(initCookieConsent, 1000);
  setTimeout(initGoogleAnalytics, 1000);
  setTimeout(initClarity, 1000);
  setTimeout(initServiceWorker, 2000);
}
