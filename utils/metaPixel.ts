/**
 * Meta Pixel "Lead" tracking, deduplicated with the Conversions API.
 *
 * The browser pixel and the Worker (src/worker.ts, sendMetaLead) both report
 * the same lead with a shared event_id, so Meta counts it once but still gets
 * it when an ad blocker or Safari ITP drops the browser copy. Both halves only
 * run when the visitor has granted the cookie banner's marketing category.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Reads vanilla-cookieconsent's own cookie rather than importing the library,
// so this stays safe to import from SSR-rendered components.
function hasMarketingConsent(): boolean {
  if (typeof document === 'undefined') return false;
  const match = document.cookie.match(/(?:^|;\s*)cc_cookie=([^;]+)/);
  if (!match) return false;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1])) as { categories?: unknown };
    return Array.isArray(parsed.categories) && parsed.categories.includes('marketing');
  } catch {
    return false;
  }
}

/**
 * Fields to merge into an /api/inquiry request body. Empty without marketing
 * consent, in which case the Worker skips the Conversions API call too.
 */
export function metaLeadFields(): { meta_event_id?: string } {
  if (!hasMarketingConsent()) return {};
  return { meta_event_id: crypto.randomUUID() };
}

/** Fires the browser-side Lead once the server has accepted the submission. */
export function trackMetaLead(fields: { meta_event_id?: string }): void {
  if (!fields.meta_event_id || typeof window.fbq !== 'function') return;
  window.fbq('track', 'Lead', {}, { eventID: fields.meta_event_id });
}
