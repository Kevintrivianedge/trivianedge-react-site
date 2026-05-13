export interface Env {
  GEMINI_API_KEY: string;
  // TODO: Set RESEND_API_KEY in Cloudflare Workers secrets (wrangler secret put RESEND_API_KEY)
  RESEND_API_KEY?: string;
  CRM_WEBHOOK_URL?: string;
  CRM_WEBHOOK_SIGNING_SECRET?: string;
  ADMIN_API_TOKEN?: string;
  ANALYTICS_KV?: KVNamespace;
  ASSETS?: Fetcher; // optional so missing binding won't crash
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

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

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// ---------------------------------------------------------------------------
// HTML-escape helper — prevents XSS in outgoing Resend email bodies.
// ---------------------------------------------------------------------------
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// RFC 5321-compliant email validator — rejects consecutive dots, leading/trailing
// dots in local part, and missing TLD while staying dependency-free.
const EMAIL_RE = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

type GeminiPart = { text: string };
type GeminiContent = { role: string; parts: GeminiPart[] };
interface GeminiPayload {
  contents: GeminiContent[];
  system_instruction?: { parts: GeminiPart[] };
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
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${payload}`));
  return toHex(signed);
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

function isAdminAuthorized(request: Request, env: Env): boolean {
  if (!env.ADMIN_API_TOKEN) return false;
  const headerToken = request.headers.get('X-Admin-Token') ?? '';
  const bearer = request.headers.get('Authorization') ?? '';
  const bearerToken = bearer.startsWith('Bearer ') ? bearer.slice(7).trim() : '';
  return headerToken === env.ADMIN_API_TOKEN || bearerToken === env.ADMIN_API_TOKEN;
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
//   - ipapi.co (geolocation)
//   - Open-Meteo (weather)
//   - Google Gemini API (proxied through the worker — never called from browser)
// ---------------------------------------------------------------------------
const CSP_HEADER =
  "default-src 'self'; " +
  "script-src 'self' https://cdn.amplitude.com; " +
  "connect-src 'self' https://api.amplitude.com https://api2.amplitude.com " +
    "https://sessionreplay.amplitude.com https://ipapi.co https://api.open-meteo.com; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "frame-ancestors 'none'; " +
  "base-uri 'self'; " +
  "form-action 'self';";

/** Attach CSP and security headers to a static-asset response. */
function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Content-Security-Policy', CSP_HEADER);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return new Response(response.body, { status: response.status, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const corsHeaders = makeCorsHeaders(origin);

    // CORS preflight — handle before everything else
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ALL /api/* routes — rate-limited and CORS-gated in one place
    if (url.pathname.startsWith('/api/')) {
      const ip =
        request.headers.get('CF-Connecting-IP') ??
        request.headers.get('X-Forwarded-For') ??
        'unknown';
      if (isRateLimited(ip)) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (url.pathname === '/api/health') {
        return new Response(
          JSON.stringify({ status: 'ok', timestamp: Date.now(), gemini_key_set: !!env.GEMINI_API_KEY }),
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

    // Serve static assets; fall back to index.html for SPA client-side routing
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status === 404) {
        const indexRequest = new Request(new URL('/index.html', request.url).toString());
        return addSecurityHeaders(await env.ASSETS.fetch(indexRequest));
      }
      return addSecurityHeaders(assetResponse);
    }

    return new Response('Not found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;

async function handleChat(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const body = await request.json<{
    message: string;
    history?: GeminiContent[];
    systemInstruction?: string;
    model?: string;
  }>();

  const message = typeof body.message === 'string' ? body.message : '';
  const history = Array.isArray(body.history) ? body.history : [];
  const model =
    typeof body.model === 'string' && body.model ? body.model : 'gemini-2.0-flash';

  const systemText =
    typeof body.systemInstruction === 'string' ? body.systemInstruction.trim() : '';

  const contents: GeminiContent[] = [...history,
    { role: 'user', parts: [{ text: message }] },
  ];

  // Build payload safely: only include system_instruction when non-empty
  const geminiPayload: GeminiPayload = { contents };
  if (systemText.length > 0) {
    geminiPayload.system_instruction = { parts: [{ text: systemText }] };
  }

  const geminiRes = await fetch(
    `${GEMINI_API_BASE}/${model}:streamGenerateContent?alt=sse`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify(geminiPayload),
    },
  );

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    return new Response(JSON.stringify({ error: err }), {
      status: geminiRes.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(geminiRes.body, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}

async function handleGenerate(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const body = await request.json<{ prompt: string; model?: string }>();

  const prompt = typeof body.prompt === 'string' ? body.prompt : '';
  const model =
    typeof body.model === 'string' && body.model ? body.model : 'gemini-2.0-flash';

  const geminiRes = await fetch(`${GEMINI_API_BASE}/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    return new Response(JSON.stringify({ error: err }), {
      status: geminiRes.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const data = await geminiRes.json<{
    candidates?: Array<{ content: { parts: Array<{ text: string }> } }>; 
  }>();

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  return new Response(JSON.stringify({ text }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
async function handleEarlyAccess(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const body = await request.json<{ company?: string; email?: string; size?: string }>();

  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const size = typeof body.size === 'string' ? body.size.trim() : '';

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
        to: ['info@trivianedge.com'],
        subject: `New Early Access Request — ${safeCompany}`,
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
  const body = await request.json<{
    name?: string;
    company?: string;
    email?: string;
    need?: string;
    timeline?: string;
    message?: string;
  }>();

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const need = typeof body.need === 'string' ? body.need.trim() : '';
  const timeline = typeof body.timeline === 'string' ? body.timeline.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

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
        to: ['info@trivianedge.com'],
        subject: `New inquiry — ${safeCompany}`,
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
  const body = await request.json<AnalyticsEventBody>();
  const event = typeof body.event === 'string' ? body.event.trim() : '';
  const payload = body.payload && typeof body.payload === 'object' ? body.payload : {};
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : 'unknown';

  if (!event) {
    return new Response(JSON.stringify({ success: false, error: 'event is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const record = {
    event,
    payload,
    sessionId,
    ip: request.headers.get('CF-Connecting-IP') ?? 'unknown',
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
  const body = await request.json<VentureSubmissionBody>();
  const form = body.form && typeof body.form === 'object' ? body.form : {};
  const score = typeof body.score === 'number' ? body.score : 0;
  const tier = typeof body.tier === 'string' ? body.tier : 'Unknown';
  const locale = typeof body.locale === 'string' ? body.locale : 'en-CA';
  const timezone = typeof body.timezone === 'string' ? body.timezone : 'UTC';

  const name = typeof form.fullName === 'string' ? form.fullName.trim() : '';
  const email = typeof form.email === 'string' ? form.email.trim() : '';
  const company = typeof form.company === 'string' ? form.company.trim() : '';

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
    ip: request.headers.get('CF-Connecting-IP') ?? 'unknown',
    ts: new Date().toISOString(),
  };

  await persistEvent(env, 'venture_submission', submissionRecord);

  let crm: { attempted: boolean; success: boolean; status?: number } = { attempted: false, success: false };
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
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
}

async function handleAdminVentureStats(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  if (!isAdminAuthorized(request, env)) {
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
