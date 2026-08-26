export interface Env {
  ANTHROPIC_API_KEY: string;
  // TODO: Set RESEND_API_KEY in Cloudflare Workers secrets (wrangler secret put RESEND_API_KEY)
  RESEND_API_KEY?: string;
  CRM_WEBHOOK_URL?: string;
  CRM_WEBHOOK_SIGNING_SECRET?: string;
  ADMIN_API_TOKEN?: string;
  ANALYTICS_KV?: KVNamespace;
  ASSETS?: Fetcher; // optional so missing binding won't crash
}

const ANTHROPIC_API_BASE = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const ANTHROPIC_DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const ANTHROPIC_DEFAULT_MAX_TOKENS = 1024;

// Restrict CORS to the production origin only.
const ALLOWED_ORIGIN = 'https://www.trivianedge.com';

function makeCorsHeaders(requestOrigin: string | null): Record<string, string> {
  // Allow the canonical production origin and localhost:3000 for development.
  const origin =
    requestOrigin === ALLOWED_ORIGIN || requestOrigin === 'http://localhost:3000'
      ? (requestOrigin as string)
      : ALLOWED_ORIGIN;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
    'Vary': 'Origin',
    ...BASE_SECURITY_HEADERS,
  };
}

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (per Cloudflare Worker isolate).
// Limits each IP to `maxRequests` per `windowMs` across all API endpoints.
//
// NOTE: This map resets when the Worker isolate is recycled. For persistent
// cross-isolate rate limiting, replace this with Cloudflare Durable Objects
// or Workers KV. This implementation is sufficient for moderate traffic.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20;           // max requests per IP per window
const RATE_LIMIT_KV_PREFIX = 'rate_limit';
const RATE_LIMIT_KV_TTL_SECONDS = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000) + 60;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const textEncoder = new TextEncoder();

function isRateLimitedInMemory(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function anonymizeIp(ip: string): string {
  if (!ip || ip === 'unknown') return 'unknown';
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }
  if (ip.includes(':')) {
    const parts = ip.split(':').filter(Boolean);
    if (parts.length > 0) {
      return `${parts.slice(0, 4).join(':')}::`;
    }
  }
  return 'unknown';
}

async function hashIdentifier(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(value));
  return toHex(digest).slice(0, 32);
}

async function isRateLimited(ip: string, env: Env): Promise<boolean> {
  if (env.ANALYTICS_KV) {
    const bucket = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS);
    const hashedIp = await hashIdentifier(ip || 'unknown');
    const key = `${RATE_LIMIT_KV_PREFIX}:${bucket}:${hashedIp}`;
    const currentRaw = await env.ANALYTICS_KV.get(key);
    const current = currentRaw ? Number.parseInt(currentRaw, 10) : 0;
    const next = Number.isFinite(current) ? current + 1 : 1;
    await env.ANALYTICS_KV.put(key, String(next), { expirationTtl: RATE_LIMIT_KV_TTL_SECONDS });
    return next > RATE_LIMIT_MAX;
  }

  return isRateLimitedInMemory(ip);
}

async function parseJsonBody<T>(request: Request): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const data = await request.json<T>();
    return { ok: true, data };
  } catch {
    return { ok: false, error: 'Invalid JSON payload.' };
  }
}

// ---------------------------------------------------------------------------
// HTML-escape helper, prevents XSS in outgoing Resend email bodies.
// ---------------------------------------------------------------------------
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// RFC 5321-compliant email validator, rejects consecutive dots, leading/trailing
// dots in local part, and missing TLD while staying dependency-free.
const EMAIL_RE = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

type AnthropicMessage = { role: 'user' | 'assistant'; content: string };
interface AnthropicPayload {
  model: string;
  max_tokens: number;
  messages: AnthropicMessage[];
  system?: string;
  stream?: boolean;
}

type AnalyticsEventBody = {
  event?: string;
  payload?: Record<string, unknown>;
  sessionId?: string;
};

type VentureSubmissionBody = {
  form?: Record<string, unknown>;
  score?: number;
  tier?: string;
  locale?: string;
  timezone?: string;
};

type CrmWebhookPayload = {
  pipeline: string;
  stage: string;
  lead: { name: string; email: string; company: string };
  qualification: {
    score: number;
    tier: string;
    qualified: boolean;
    locale: string;
    timezone: string;
  };
  booking: {
    primaryProvider: string;
    primaryUrl: string;
    fallbackProvider: string;
    fallbackUrl: string;
  };
  metadata: {
    source: string;
    submittedAt: string;
  };
  form: Record<string, unknown>;
};

type CrmRetryRecord = {
  id: string;
  payload: CrmWebhookPayload;
  attempts: number;
  maxAttempts: number;
  nextAttemptAt: number;
  createdAt: string;
  lastError?: string;
};

async function sendVentureSubmissionEmail(env: Env, payload: {
  name: string;
  email: string;
  company: string;
  score: number;
  tier: string;
  qualified: boolean;
  locale: string;
  timezone: string;
  form: Record<string, unknown>;
  booking: {
    primaryProvider: string;
    primaryUrl: string;
    fallbackProvider: string;
    fallbackUrl: string;
  };
}): Promise<{ attempted: boolean; success: boolean; status?: number; error?: string }> {
  if (!env.RESEND_API_KEY) {
    return { attempted: false, success: false, error: 'RESEND_API_KEY not configured' };
  }

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeCompany = escapeHtml(payload.company);
  const safeTier = escapeHtml(payload.tier);
  const safeLocale = escapeHtml(payload.locale);
  const safeTimezone = escapeHtml(payload.timezone);
  const safeFormJson = escapeHtml(JSON.stringify(payload.form, null, 2));
  const safePrimaryUrl = escapeHtml(payload.booking.primaryUrl);
  const safeFallbackUrl = escapeHtml(payload.booking.fallbackUrl);

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'TrivianEdge Venture Studio <venture@trivianedge.com>',
      to: ['kevin.v@trivianedge.com'],
      subject: `New Venture Studio Submission | ${safeCompany}`,
      html: `
        <h2>New Venture Studio Submission</h2>
        <table cellpadding="8" style="border-collapse:collapse">
          <tr><td><strong>Founder</strong></td><td>${safeName}</td></tr>
          <tr><td><strong>Email</strong></td><td>${safeEmail}</td></tr>
          <tr><td><strong>Company</strong></td><td>${safeCompany}</td></tr>
          <tr><td><strong>Score</strong></td><td>${payload.score}</td></tr>
          <tr><td><strong>Tier</strong></td><td>${safeTier}</td></tr>
          <tr><td><strong>Qualified</strong></td><td>${payload.qualified ? 'Yes' : 'No'}</td></tr>
          <tr><td><strong>Locale</strong></td><td>${safeLocale}</td></tr>
          <tr><td><strong>Timezone</strong></td><td>${safeTimezone}</td></tr>
          <tr><td><strong>Primary Booking</strong></td><td><a href="${safePrimaryUrl}">${safePrimaryUrl}</a></td></tr>
          <tr><td><strong>Fallback Booking</strong></td><td><a href="${safeFallbackUrl}">${safeFallbackUrl}</a></td></tr>
        </table>
        <h3>Raw Form Payload</h3>
        <pre style="white-space:pre-wrap;font-family:ui-monospace,Menlo,Monaco,Consolas,monospace">${safeFormJson}</pre>
      `,
    }),
  });

  if (!resendRes.ok) {
    return {
      attempted: true,
      success: false,
      status: resendRes.status,
      error: await resendRes.text(),
    };
  }

  return { attempted: true, success: true, status: resendRes.status };
}

async function persistEvent(env: Env, keyPrefix: string, payload: Record<string, unknown>): Promise<void> {
  if (!env.ANALYTICS_KV) return;
  const key = `${keyPrefix}:${Date.now()}:${crypto.randomUUID()}`;
  await env.ANALYTICS_KV.put(key, JSON.stringify(payload), {
    // Keep analytics for 180 days
    expirationTtl: 180 * 24 * 60 * 60,
  });
}

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (const b of bytes) {
    hex += b.toString(16).padStart(2, '0');
  }
  return hex;
}

async function signWebhookPayload(secret: string, timestamp: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signed = await crypto.subtle.sign('HMAC', key, textEncoder.encode(`${timestamp}.${payload}`));
  return toHex(signed);
}

async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  if (!a || !b) return false;
  const hashA = new Uint8Array(await crypto.subtle.digest('SHA-256', textEncoder.encode(a)));
  const hashB = new Uint8Array(await crypto.subtle.digest('SHA-256', textEncoder.encode(b)));

  let diff = hashA.length ^ hashB.length;
  const length = Math.max(hashA.length, hashB.length);
  for (let i = 0; i < length; i += 1) {
    const left = i < hashA.length ? hashA[i] : 0;
    const right = i < hashB.length ? hashB[i] : 0;
    diff |= left ^ right;
  }
  return diff === 0;
}

function getBackoffMs(attempt: number): number {
  const base = 30_000; // 30s
  const max = 6 * 60 * 60 * 1000; // 6h
  const exp = Math.min(max, base * Math.pow(2, Math.max(0, attempt - 1)));
  const jitter = 0.8 + Math.random() * 0.4; // 0.8x - 1.2x
  return Math.floor(exp * jitter);
}

async function enqueueCrmRetry(env: Env, payload: CrmWebhookPayload, reason: string, attempts = 0): Promise<void> {
  if (!env.ANALYTICS_KV) return;
  const id = crypto.randomUUID();
  const record: CrmRetryRecord = {
    id,
    payload,
    attempts,
    maxAttempts: 6,
    nextAttemptAt: Date.now() + getBackoffMs(attempts + 1),
    createdAt: new Date().toISOString(),
    lastError: reason,
  };
  await env.ANALYTICS_KV.put(`crm_retry:${id}`, JSON.stringify(record), {
    expirationTtl: 30 * 24 * 60 * 60,
  });
}

async function sendCrmWebhook(env: Env, payload: CrmWebhookPayload): Promise<{ ok: boolean; status: number; error?: string; signatureEnabled: boolean }> {
  if (!env.CRM_WEBHOOK_URL) {
    return { ok: false, status: 0, error: 'CRM_WEBHOOK_URL not configured', signatureEnabled: false };
  }

  const rawPayload = JSON.stringify(payload);
  const timestamp = Date.now().toString();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Trivian-Timestamp': timestamp,
    'X-Trivian-Signature-Version': 'v1',
  };

  let signatureEnabled = false;
  if (env.CRM_WEBHOOK_SIGNING_SECRET) {
    const signature = await signWebhookPayload(env.CRM_WEBHOOK_SIGNING_SECRET, timestamp, rawPayload);
    headers['X-Trivian-Signature'] = signature;
    signatureEnabled = true;
  }

  const res = await fetch(env.CRM_WEBHOOK_URL, {
    method: 'POST',
    headers,
    body: rawPayload,
  });

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: await res.text(),
      signatureEnabled,
    };
  }

  return { ok: true, status: res.status, signatureEnabled };
}

async function processDueCrmRetries(env: Env, batchSize = 5): Promise<{ processed: number; success: number; failed: number }> {
  if (!env.ANALYTICS_KV) return { processed: 0, success: 0, failed: 0 };
  const listed = await env.ANALYTICS_KV.list({ prefix: 'crm_retry:', limit: 1000 });
  const now = Date.now();
  const due: CrmRetryRecord[] = [];

  for (const key of listed.keys) {
    if (due.length >= batchSize) break;
    const raw = await env.ANALYTICS_KV.get(key.name);
    if (!raw) continue;
    try {
      const rec = JSON.parse(raw) as CrmRetryRecord;
      if (rec.nextAttemptAt <= now) due.push(rec);
    } catch {
      await env.ANALYTICS_KV.delete(key.name);
    }
  }

  let success = 0;
  let failed = 0;
  for (const rec of due) {
    const result = await sendCrmWebhook(env, rec.payload);
    const key = `crm_retry:${rec.id}`;
    if (result.ok) {
      success += 1;
      await env.ANALYTICS_KV.delete(key);
      await persistEvent(env, 'crm_retry_success', {
        id: rec.id,
        attempts: rec.attempts + 1,
        ts: new Date().toISOString(),
      });
      continue;
    }

    failed += 1;
    const nextAttempts = rec.attempts + 1;
    if (nextAttempts >= rec.maxAttempts) {
      await env.ANALYTICS_KV.delete(key);
      await persistEvent(env, 'crm_retry_exhausted', {
        id: rec.id,
        attempts: nextAttempts,
        lastError: result.error ?? 'unknown',
        ts: new Date().toISOString(),
      });
      continue;
    }

    const updated: CrmRetryRecord = {
      ...rec,
      attempts: nextAttempts,
      nextAttemptAt: Date.now() + getBackoffMs(nextAttempts + 1),
      lastError: result.error ?? `status_${result.status}`,
    };
    await env.ANALYTICS_KV.put(key, JSON.stringify(updated), {
      expirationTtl: 30 * 24 * 60 * 60,
    });
  }

  return { processed: due.length, success, failed };
}

async function isAdminAuthorized(request: Request, env: Env): Promise<boolean> {
  if (!env.ADMIN_API_TOKEN) return false;
  const headerToken = request.headers.get('X-Admin-Token') ?? '';
  const bearer = request.headers.get('Authorization') ?? '';
  const bearerToken = bearer.startsWith('Bearer ') ? bearer.slice(7).trim() : '';
  const headerAuthorized = await timingSafeEqual(headerToken, env.ADMIN_API_TOKEN);
  if (headerAuthorized) return true;
  return timingSafeEqual(bearerToken, env.ADMIN_API_TOKEN);
}

async function getKvJsonRecords<T>(env: Env, prefix: string, max = 2000): Promise<T[]> {
  if (!env.ANALYTICS_KV) return [];
  const out: T[] = [];
  let cursor: string | undefined;

  while (out.length < max) {
    const batch = await env.ANALYTICS_KV.list({ prefix, limit: 1000, cursor });
    for (const key of batch.keys) {
      const raw = await env.ANALYTICS_KV.get(key.name);
      if (!raw) continue;
      try {
        out.push(JSON.parse(raw) as T);
      } catch {
        // skip malformed rows
      }
      if (out.length >= max) break;
    }
    const nextCursor = 'cursor' in batch ? batch.cursor : undefined;
    if (!batch.list_complete && nextCursor) {
      cursor = nextCursor;
    } else {
      break;
    }
  }

  return out;
}

async function buildAdminStats(env: Env): Promise<Record<string, unknown>> {
  const analytics = await getKvJsonRecords<{ event?: string; payload?: Record<string, unknown> }>(env, 'analytics:', 5000);
  const submissions = await getKvJsonRecords<{ qualified?: boolean; tier?: string; score?: number }>(env, 'venture_submission:', 2000);
  const crmHandoffs = await getKvJsonRecords<{ success?: boolean }>(env, 'crm_handoff:', 2000);
  const retries = await getKvJsonRecords<CrmRetryRecord>(env, 'crm_retry:', 2000);

  const stepView: Record<string, number> = {};
  const stepCompleted: Record<string, number> = {};
  const dropoffByStep: Record<string, number> = {};

  for (const item of analytics) {
    const event = item.event ?? '';
    const stepId = typeof item.payload?.step_id === 'string' ? item.payload.step_id : 'unknown';
    if (event === 'venture_step_view') {
      stepView[stepId] = (stepView[stepId] ?? 0) + 1;
    }
    if (event === 'venture_step_completed') {
      stepCompleted[stepId] = (stepCompleted[stepId] ?? 0) + 1;
    }
    if (event === 'venture_funnel_dropoff') {
      dropoffByStep[stepId] = (dropoffByStep[stepId] ?? 0) + 1;
    }
  }

  const totalSubmissions = submissions.length;
  const qualifiedSubmissions = submissions.filter(s => s.qualified).length;
  const averageScore = submissions.length
    ? Math.round(submissions.reduce((acc, s) => acc + (typeof s.score === 'number' ? s.score : 0), 0) / submissions.length)
    : 0;

  const crmAttempts = crmHandoffs.length;
  const crmSuccess = crmHandoffs.filter(x => x.success).length;

  return {
    funnel: {
      stepView,
      stepCompleted,
      dropoffByStep,
    },
    qualification: {
      totalSubmissions,
      qualifiedSubmissions,
      qualificationRate: totalSubmissions ? Number((qualifiedSubmissions / totalSubmissions).toFixed(3)) : 0,
      averageScore,
    },
    crm: {
      attempts: crmAttempts,
      success: crmSuccess,
      failed: Math.max(0, crmAttempts - crmSuccess),
      retryQueueDepth: retries.length,
    },
    generatedAt: new Date().toISOString(),
  };
}

function getLocaleRegion(locale: string | undefined): string {
  if (!locale) return 'global';
  const upper = locale.toUpperCase();
  if (upper.includes('US') || upper.includes('CA')) return 'na';
  if (upper.includes('GB') || upper.includes('DE') || upper.includes('FR') || upper.includes('NL') || upper.includes('EU')) return 'eu';
  if (upper.includes('SG') || upper.includes('AU') || upper.includes('NZ') || upper.includes('JP') || upper.includes('IN') || upper.includes('PH') || upper.includes('VN')) return 'apac';
  return 'global';
}

function buildBookingLinks(name: string, email: string, locale?: string, timezone?: string) {
  const region = getLocaleRegion(locale);
  const params = new URLSearchParams();
  if (name) params.set('name', name);
  if (email) params.set('email', email);
  if (timezone) params.set('timezone', timezone);
  if (locale) params.set('locale', locale);

  const calendly = `https://calendly.com/trivianedge/venture-studio-intro?${params.toString()}`;
  const googleParams = new URLSearchParams({
    text: 'TrivianEdge Venture Studio Discovery Call',
    details: `Founder: ${name || 'N/A'}\nEmail: ${email || 'N/A'}\nLocale: ${locale || 'N/A'}\nTimezone: ${timezone || 'N/A'}`,
  });
  const google = `https://calendar.google.com/calendar/u/0/r/eventedit?${googleParams.toString()}`;

  // Region-aware primary provider selection for better conversion.
  if (region === 'apac') {
    return { primaryProvider: 'google-calendar', primaryUrl: google, fallbackProvider: 'calendly', fallbackUrl: calendly };
  }

  return { primaryProvider: 'calendly', primaryUrl: calendly, fallbackProvider: 'google-calendar', fallbackUrl: google };
}

// ---------------------------------------------------------------------------
// Content-Security-Policy applied to all HTML responses (static assets).
// Explicitly allowlists only the origins the app actually needs:
//   - Amplitude Analytics + Session Replay CDN
//   - Google Analytics (gtag.js)
//   - CookieYes (consent banner; log.cookieyes.com is its consent-audit
//     logging endpoint, hit via sendBeacon/XHR, confirmed by inspecting the
//     actual script rather than guessing)
//   - ipapi.co (geolocation)
//   - Open-Meteo (weather)
//   - Anthropic API (proxied through the worker, never called from browser)
// ---------------------------------------------------------------------------
const CSP_HEADER =
  "default-src 'self'; " +
  "script-src 'self' https://cdn.amplitude.com https://www.googletagmanager.com https://cdn-cookieyes.com; " +
  "connect-src 'self' https://*.amplitude.com https://ipapi.co https://api.open-meteo.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://log.cookieyes.com; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "frame-ancestors 'none'; " +
  "base-uri 'self'; " +
  "form-action 'self';";

// Headers that belong on every response, page or API, HTML or JSON: they
// harden transport and MIME handling regardless of content type.
const BASE_SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
};

/** Attach CSP and security headers to a static-asset response. */
function addSecurityHeaders(response: Response, statusOverride?: number): Response {
  const headers = new Headers(response.headers);
  headers.set('Content-Security-Policy', CSP_HEADER);
  for (const [key, value] of Object.entries(BASE_SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()');
  return new Response(response.body, { status: statusOverride ?? response.status, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const corsHeaders = makeCorsHeaders(origin);

    // CORS preflight, handle before everything else
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Normalise trailing slashes: /contact/ → /contact (301).
    // Keeps canonical URLs consistent and prevents Google from indexing both.
    // Exempt the root path (/) and any path already without a trailing slash.
    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
      const canonical = new URL(request.url);
      canonical.pathname = url.pathname.replace(/\/+$/, '');
      return Response.redirect(canonical.toString(), 301);
    }

    // ALL /api/* routes, rate-limited and CORS-gated in one place
    if (url.pathname.startsWith('/api/')) {
      const ip =
        request.headers.get('CF-Connecting-IP') ??
        request.headers.get('X-Forwarded-For') ??
        'unknown';
      if (await isRateLimited(ip, env)) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (url.pathname === '/api/health') {
        return new Response(
          JSON.stringify({ status: 'ok', timestamp: Date.now(), anthropic_key_set: !!env.ANTHROPIC_API_KEY }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      if (url.pathname === '/api/chat' && request.method === 'POST') {
        return handleChat(request, env, corsHeaders);
      }
      if (url.pathname === '/api/generate' && request.method === 'POST') {
        return handleGenerate(request, env, corsHeaders);
      }
      if (url.pathname === '/api/early-access' && request.method === 'POST') {
        return handleEarlyAccess(request, env, corsHeaders);
      }
      if (url.pathname === '/api/inquiry' && request.method === 'POST') {
        return handleInquiry(request, env, corsHeaders);
      }
      if (url.pathname === '/api/analytics/events' && request.method === 'POST') {
        return handleAnalyticsEvent(request, env, corsHeaders);
      }
      if (url.pathname === '/api/venture/submit' && request.method === 'POST') {
        await processDueCrmRetries(env, 3);
        return handleVentureSubmit(request, env, corsHeaders);
      }
      if (url.pathname === '/api/admin/venture-stats' && request.method === 'GET') {
        return handleAdminVentureStats(request, env, corsHeaders);
      }

      return new Response(JSON.stringify({ error: 'Unknown API route' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Serve static assets. Client-side-routed paths (e.g. /services/bpo) have no
    // literal matching file, so env.ASSETS.fetch 404s on the exact request path
    // (html_handling is "none" — no automatic extension/index resolution).
    // Before falling back to the bare SPA shell, try the build-time prerendered
    // snapshot at <path>/index.html (see scripts/prerender.mjs): this is what
    // lets non-JS-executing crawlers (GPTBot, ClaudeBot, PerplexityBot) actually
    // see real page content instead of an empty <div id="root">.
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status === 404) {
        const snapshotPath = `${url.pathname.replace(/\/$/, '')}/index.html`;
        const snapshotResponse = await env.ASSETS.fetch(
          new Request(new URL(snapshotPath, request.url).toString()),
        );
        if (snapshotResponse.status !== 404) {
          return addSecurityHeaders(snapshotResponse);
        }

        // Neither a real asset nor a prerendered snapshot exists for this path, so
        // it isn't a real route — including stale/legacy URLs left over from past
        // site content that no longer exists. Still serve the SPA shell (so real
        // users get the client-rendered NotFoundPage instead of a blank error),
        // but with an honest 404 status: the previous behavior always returned 200
        // here (whatever index.html itself returns), a "soft 404" that tells
        // Google's indexer this is a valid page and blocks it from ever dropping
        // dead URLs from the index.
        const indexRequest = new Request(new URL('/index.html', request.url).toString());
        return addSecurityHeaders(await env.ASSETS.fetch(indexRequest), 404);
      }
      return addSecurityHeaders(assetResponse);
    }

    return new Response('Not found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;

// Caps on user-controlled input forwarded to the (paid, per-token) Anthropic API.
// Without these, the per-IP rate limit alone doesn't bound cost — a single
// request can still carry an arbitrarily large payload.
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_MESSAGES = 20;
const MAX_HISTORY_MESSAGE_LENGTH = 4000;
const MAX_SYSTEM_INSTRUCTION_LENGTH = 2000;
const MAX_GENERATE_PROMPT_LENGTH = 4000;

function badRequest(error: string, corsHeaders: Record<string, string>): Response {
  return new Response(JSON.stringify({ error }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Lead-form fields go to email (Resend) and/or the CRM webhook, not a paid
// per-token API, so we truncate rather than reject — an overlong paste
// shouldn't cost a real prospect their submission — but still bound the
// size of what gets stored/emailed per request.
const MAX_FIELD_LENGTH = 300;
const MAX_FREEFORM_LENGTH = 5000;

function capLength(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

async function handleChat(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const parsed = await parseJsonBody<{
    message: string;
    history?: AnthropicMessage[];
    systemInstruction?: string;
    model?: string;
  }>(request);

  if (!parsed.ok) {
    return new Response(JSON.stringify({ error: parsed.error }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = parsed.data;

  const message = typeof body.message === 'string' ? body.message : '';
  const history = Array.isArray(body.history) ? body.history : [];
  const model =
    typeof body.model === 'string' && body.model ? body.model : ANTHROPIC_DEFAULT_MODEL;

  const systemText =
    typeof body.systemInstruction === 'string' ? body.systemInstruction.trim() : '';

  if (message.length > MAX_MESSAGE_LENGTH) {
    return badRequest(`Message too long (max ${MAX_MESSAGE_LENGTH} characters).`, corsHeaders);
  }
  if (history.length > MAX_HISTORY_MESSAGES) {
    return badRequest(`Too much conversation history (max ${MAX_HISTORY_MESSAGES} messages).`, corsHeaders);
  }
  if (history.some((h) => typeof h?.content === 'string' && h.content.length > MAX_HISTORY_MESSAGE_LENGTH)) {
    return badRequest('One or more history messages exceed the length limit.', corsHeaders);
  }
  if (systemText.length > MAX_SYSTEM_INSTRUCTION_LENGTH) {
    return badRequest(`System instruction too long (max ${MAX_SYSTEM_INSTRUCTION_LENGTH} characters).`, corsHeaders);
  }

  const messages: AnthropicMessage[] = [...history,
    { role: 'user', content: message },
  ];

  const anthropicPayload: AnthropicPayload = {
    model,
    max_tokens: ANTHROPIC_DEFAULT_MAX_TOKENS,
    messages,
    stream: true,
  };
  if (systemText.length > 0) {
    anthropicPayload.system = systemText;
  }

  const anthropicRes = await fetch(ANTHROPIC_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify(anthropicPayload),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return new Response(JSON.stringify({ error: err }), {
      status: anthropicRes.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(anthropicRes.body, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}

async function handleGenerate(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const parsed = await parseJsonBody<{ prompt: string; model?: string }>(request);
  if (!parsed.ok) {
    return new Response(JSON.stringify({ error: parsed.error }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = parsed.data;

  const prompt = typeof body.prompt === 'string' ? body.prompt : '';
  const model =
    typeof body.model === 'string' && body.model ? body.model : ANTHROPIC_DEFAULT_MODEL;

  if (prompt.length > MAX_GENERATE_PROMPT_LENGTH) {
    return badRequest(`Prompt too long (max ${MAX_GENERATE_PROMPT_LENGTH} characters).`, corsHeaders);
  }

  const anthropicRes = await fetch(ANTHROPIC_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: ANTHROPIC_DEFAULT_MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    } satisfies AnthropicPayload),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return new Response(JSON.stringify({ error: err }), {
      status: anthropicRes.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const data = await anthropicRes.json<{
    content?: Array<{ type: string; text?: string }>;
  }>();

  const text = data.content?.find(block => block.type === 'text')?.text ?? '';

  return new Response(JSON.stringify({ text }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
async function handleEarlyAccess(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const parsed = await parseJsonBody<{ company?: string; email?: string; size?: string }>(request);
  if (!parsed.ok) {
    return new Response(JSON.stringify({ success: false, error: parsed.error }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = parsed.data;

  const company = capLength(typeof body.company === 'string' ? body.company.trim() : '', MAX_FIELD_LENGTH);
  const email = capLength(typeof body.email === 'string' ? body.email.trim() : '', MAX_FIELD_LENGTH);
  const size = capLength(typeof body.size === 'string' ? body.size.trim() : '', MAX_FIELD_LENGTH);

  if (!company || !email) {
    return new Response(JSON.stringify({ success: false, error: 'Company name and email are required.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Validate email format before accepting the submission.
  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ success: false, error: 'Please provide a valid email address.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Send notification email via Resend API
  if (env.RESEND_API_KEY) {
    // HTML-escape all user-supplied values before interpolating into the email body.
    const safeCompany = escapeHtml(company);
    const safeEmail = escapeHtml(email);
    const safeSize = escapeHtml(size);

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Trivian Aria <aria@trivianedge.com>',
        to: ['kevin.v@trivianedge.com'],
        subject: `New Early Access Request | ${safeCompany}`,
        html: `
          <h2>New Early Access Request</h2>
          <table cellpadding="8" style="border-collapse:collapse">
            <tr><td><strong>Company</strong></td><td>${safeCompany}</td></tr>
            <tr><td><strong>Email</strong></td><td>${safeEmail}</td></tr>
            <tr><td><strong>Company Size</strong></td><td>${safeSize}</td></tr>
          </table>
        `,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error('[Trivian Worker] Resend API error:', err);
      return new Response(JSON.stringify({ success: false, error: 'Failed to send notification. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleInquiry(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const parsed = await parseJsonBody<{
    name?: string;
    company?: string;
    email?: string;
    need?: string;
    timeline?: string;
    message?: string;
  }>(request);
  if (!parsed.ok) {
    return new Response(JSON.stringify({ success: false, error: parsed.error }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = parsed.data;

  const name = capLength(typeof body.name === 'string' ? body.name.trim() : '', MAX_FIELD_LENGTH);
  const company = capLength(typeof body.company === 'string' ? body.company.trim() : '', MAX_FIELD_LENGTH);
  const email = capLength(typeof body.email === 'string' ? body.email.trim() : '', MAX_FIELD_LENGTH);
  const need = capLength(typeof body.need === 'string' ? body.need.trim() : '', MAX_FIELD_LENGTH);
  const timeline = capLength(typeof body.timeline === 'string' ? body.timeline.trim() : '', MAX_FIELD_LENGTH);
  const message = capLength(typeof body.message === 'string' ? body.message.trim() : '', MAX_FREEFORM_LENGTH);

  if (!name || !company || !email) {
    return new Response(JSON.stringify({ success: false, error: 'Name, company, and email are required.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ success: false, error: 'Please provide a valid email address.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (env.RESEND_API_KEY) {
    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company);
    const safeEmail = escapeHtml(email);
    const safeNeed = escapeHtml(need);
    const safeTimeline = escapeHtml(timeline);
    const safeMessage = escapeHtml(message);

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'TrivianEdge <inquiry@trivianedge.com>',
        to: ['kevin.v@trivianedge.com'],
        subject: `New inquiry | ${safeCompany}`,
        html: `
          <h2>New inquiry request</h2>
          <table cellpadding="8" style="border-collapse:collapse">
            <tr><td><strong>Name</strong></td><td>${safeName}</td></tr>
            <tr><td><strong>Company</strong></td><td>${safeCompany}</td></tr>
            <tr><td><strong>Email</strong></td><td>${safeEmail}</td></tr>
            <tr><td><strong>Need</strong></td><td>${safeNeed || 'Not specified'}</td></tr>
            <tr><td><strong>Timeline</strong></td><td>${safeTimeline || 'Not specified'}</td></tr>
            <tr><td><strong>Message</strong></td><td>${safeMessage || 'No message provided'}</td></tr>
          </table>
        `,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error('[Trivian Worker] Inquiry email error:', err);
      return new Response(JSON.stringify({ success: false, error: 'Failed to send your inquiry. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleAnalyticsEvent(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const parsed = await parseJsonBody<AnalyticsEventBody>(request);
  if (!parsed.ok) {
    return new Response(JSON.stringify({ success: false, error: parsed.error }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = parsed.data;
  const event = typeof body.event === 'string' ? body.event.trim() : '';
  const payload = body.payload && typeof body.payload === 'object' ? body.payload : {};
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : 'unknown';

  if (!event) {
    return new Response(JSON.stringify({ success: false, error: 'event is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const requestIp = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const record = {
    event,
    payload,
    sessionId,
    ip: anonymizeIp(requestIp),
    ua: request.headers.get('User-Agent') ?? 'unknown',
    ts: new Date().toISOString(),
  };

  await persistEvent(env, 'analytics', record);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleVentureSubmit(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const parsed = await parseJsonBody<VentureSubmissionBody>(request);
  if (!parsed.ok) {
    return new Response(JSON.stringify({ success: false, error: parsed.error }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = parsed.data;
  const form = body.form && typeof body.form === 'object' ? body.form : {};
  const score = typeof body.score === 'number' ? body.score : 0;
  const tier = typeof body.tier === 'string' ? body.tier : 'Unknown';
  const locale = typeof body.locale === 'string' ? body.locale : 'en-CA';
  const timezone = typeof body.timezone === 'string' ? body.timezone : 'UTC';

  const name = capLength(typeof form.fullName === 'string' ? form.fullName.trim() : '', MAX_FIELD_LENGTH);
  const email = capLength(typeof form.email === 'string' ? form.email.trim() : '', MAX_FIELD_LENGTH);
  const company = capLength(typeof form.company === 'string' ? form.company.trim() : '', MAX_FIELD_LENGTH);

  if (!name || !email || !company) {
    return new Response(JSON.stringify({ success: false, error: 'fullName, email, and company are required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ success: false, error: 'Please provide a valid email address.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const requestIp = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const booking = buildBookingLinks(name, email, locale, timezone);
  const qualified = score >= 82;
  const submissionRecord = {
    name,
    email,
    company,
    tier,
    score,
    qualified,
    locale,
    timezone,
    form,
    booking,
    ip: anonymizeIp(requestIp),
    ts: new Date().toISOString(),
  };

  await persistEvent(env, 'venture_submission', submissionRecord);

  let crm: { attempted: boolean; success: boolean; status?: number } = { attempted: false, success: false };
  const notification = await sendVentureSubmissionEmail(env, {
    name,
    email,
    company,
    score,
    tier,
    qualified,
    locale,
    timezone,
    form,
    booking,
  });

  await persistEvent(env, 'venture_email_notification', {
    attempted: notification.attempted,
    success: notification.success,
    status: notification.status ?? 0,
    leadEmail: email,
    company,
    ts: new Date().toISOString(),
  });

  if (qualified && env.CRM_WEBHOOK_URL) {
    const crmPayload: CrmWebhookPayload = {
      pipeline: 'venture_studio',
      stage: 'qualified_submission',
      lead: { name, email, company },
      qualification: { score, tier, qualified, locale, timezone },
      booking,
      metadata: {
        source: 'trivianedge_site',
        submittedAt: new Date().toISOString(),
      },
      form,
    };

    crm.attempted = true;
    const crmRes = await sendCrmWebhook(env, crmPayload);
    crm.success = crmRes.ok;
    crm.status = crmRes.status;

    await persistEvent(env, 'crm_handoff', {
      success: crmRes.ok,
      status: crmRes.status,
      leadEmail: email,
      score,
      signatureEnabled: crmRes.signatureEnabled,
      ts: new Date().toISOString(),
    });

    if (!crmRes.ok) {
      await enqueueCrmRetry(env, crmPayload, crmRes.error ?? `status_${crmRes.status}`, 0);
      await persistEvent(env, 'crm_retry_enqueued', {
        leadEmail: email,
        score,
        reason: crmRes.error ?? `status_${crmRes.status}`,
        ts: new Date().toISOString(),
      });
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      qualified,
      booking,
      crm,
      notification,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
}

async function handleAdminVentureStats(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  if (!(await isAdminAuthorized(request, env))) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const retryCycle = await processDueCrmRetries(env, 10);
  const stats = await buildAdminStats(env);

  return new Response(JSON.stringify({ success: true, retryCycle, stats }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
