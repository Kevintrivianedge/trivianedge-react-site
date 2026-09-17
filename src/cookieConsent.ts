/**
 * Self-hosted, open-source cookie consent banner (vanilla-cookieconsent, MIT
 * licensed) — replaces CookieYes. CookieYes's own dashboard turned out to have
 * duplicate "Facebook Pixel" and "Google tag" integrations configured
 * alongside the hand-rolled ones already in this app, silently double-loading
 * both trackers on every page view, and its banner was never actually wired
 * to call gtag('consent', 'update', ...) in the first place (see the removed
 * TODO in index.tsx). Bundling the consent UI ourselves means there's no
 * third-party dashboard that can drift out of sync with what this codebase
 * actually loads.
 *
 * The Meta Pixel has no consent-aware SDK mode of its own, so it's gated
 * here: it simply doesn't start until the visitor grants the marketing
 * category. Google Analytics already has native Consent Mode v2 support
 * (see index.tsx's initGoogleAnalytics), so gtag.js keeps loading
 * unconditionally and this module just forwards the visitor's choice to it.
 */
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import './cookieConsentTheme.css';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
  interface Navigator {
    // Global Privacy Control — a browser/extension-level opt-out signal that
    // CCPA/CPRA (California) and several other US state privacy laws
    // (Colorado, Connecticut, and others) require businesses to honor as a
    // valid, self-executing "do not sell/share my personal information"
    // request, without waiting for the visitor to also click through a
    // banner. Not yet in TypeScript's lib.dom.d.ts, hence this ambient decl.
    globalPrivacyControl?: boolean;
  }
}

let clarityStarted = false;
let pixelStarted = false;

// Microsoft Clarity's tag script is otherwise async and non-blocking by
// design, but session replay is personal-data processing, so it's gated
// here the same way Meta Pixel is — it doesn't start until the visitor
// grants the analytics category, not unconditionally at idle time.
function startClarity(): void {
  if (clarityStarted) return;
  clarityStarted = true;
  (function (c: any, l: Document, a: string, r: string, i: string, t?: HTMLScriptElement, y?: Element) {
    c[a] = c[a] || function (...args: unknown[]) { (c[a].q = c[a].q || []).push(args); };
    t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = `https://www.clarity.ms/tag/${i}?ref=bwt`;
    y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'yji0tnzvdy');
}

function startMetaPixel(): void {
  if (pixelStarted) return;
  pixelStarted = true;
  const script = document.createElement('script');
  script.src = '/meta-pixel.js';
  script.defer = true;
  document.head.appendChild(script);
}

function applyConsent(): void {
  const analyticsGranted = CookieConsent.acceptedCategory('analytics');
  const marketingGranted = CookieConsent.acceptedCategory('marketing');

  if (analyticsGranted) startClarity();
  if (marketingGranted) startMetaPixel();

  // Forwards the visitor's actual choice to Google's Consent Mode v2 API.
  // gtag.js queues/blocks data collection internally based on this state, so
  // it's safe for initGoogleAnalytics() (index.tsx) to have already loaded
  // the script before the visitor interacts with the banner.
  window.gtag?.('consent', 'update', {
    analytics_storage: analyticsGranted ? 'granted' : 'denied',
    ad_storage: marketingGranted ? 'granted' : 'denied',
    ad_user_data: marketingGranted ? 'granted' : 'denied',
    ad_personalization: marketingGranted ? 'granted' : 'denied',
  });
}

export function reopenPreferences(): void {
  CookieConsent.showPreferences();
}

export function initCookieConsent(): void {
  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: 'box',
        position: 'bottom right',
        equalWeightButtons: true,
        flipButtons: false,
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
      },
    },
    categories: {
      necessary: { readOnly: true },
      analytics: {
        autoClear: {
          cookies: [{ name: /^(_ga|_gid|amp_)/ }],
        },
      },
      marketing: {
        autoClear: {
          cookies: [{ name: /^(_fbp|_fbc)/ }],
        },
      },
    },
    onFirstConsent: applyConsent,
    onConsent: applyConsent,
    onChange: applyConsent,
    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'We use cookies',
            description:
              'TrivianEdge uses cookies for analytics and marketing so we can understand how visitors use this site and measure our campaigns. You can accept, reject, or customize your choice at any time.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Manage preferences',
            footer: '<a href="/privacy">Privacy Policy</a> <a href="/cookie-policy">Cookie Policy</a>',
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'Strictly necessary',
                description: 'Required for the site to function. Always on.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytics',
                description: 'Helps us understand how visitors use the site (Google Analytics, Microsoft Clarity).',
                linkedCategory: 'analytics',
              },
              {
                title: 'Marketing',
                description: 'Used to measure ad performance (Meta Pixel).',
                linkedCategory: 'marketing',
              },
            ],
          },
        },
      },
    },
  });

  // Honor Global Privacy Control as a self-executing opt-out (required by
  // CCPA/CPRA and several other US state privacy laws) — a GPC visitor's
  // signal counts as their answer even if they never interact with the
  // banner. Only acts on a first-time visit: if CookieConsent.run() above
  // already restored a prior real choice from this visitor's cookie, that
  // explicit choice takes precedence over the ambient browser signal.
  if (navigator.globalPrivacyControl && !CookieConsent.validConsent()) {
    CookieConsent.acceptCategory([]);
  }
}
