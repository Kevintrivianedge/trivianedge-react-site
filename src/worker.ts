export interface Env {
  GEMINI_API_KEY: string;
  // TODO: Set RESEND_API_KEY in Cloudflare Workers secrets (wrangler secret put RESEND_API_KEY)
  RESEND_API_KEY?: string;
  ASSETS?: Fetcher; // optional so missing binding won't crash
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type GeminiPart = { text: string };
type GeminiContent = { role: string; parts: GeminiPart[] };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // API routes
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      return handleGenerate(request, env);
    }

    if (url.pathname === '/api/early-access' && request.method === 'POST') {
      return handleEarlyAccess(request, env);
    }

    // Serve static assets if present; otherwise don't crash
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
} satisfies ExportedHandler<Env>;

async function handleChat(request: Request, env: Env): Promise<Response> {
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
  const geminiPayload: any = { contents };
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

async function handleGenerate(request: Request, env: Env): Promise<Response> {
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
async function handleEarlyAccess(request: Request, env: Env): Promise<Response> {
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

  // Send notification email via Resend API
  if (env.RESEND_API_KEY) {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Trivian Aria <aria@trivianedge.com>',
        to: ['info@trivianedge.com'],
        subject: `New Early Access Request — ${company}`,
        html: `
          <h2>New Early Access Request</h2>
          <table cellpadding="8" style="border-collapse:collapse">
            <tr><td><strong>Company</strong></td><td>${company}</td></tr>
            <tr><td><strong>Email</strong></td><td>${email}</td></tr>
            <tr><td><strong>Company Size</strong></td><td>${size}</td></tr>
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
