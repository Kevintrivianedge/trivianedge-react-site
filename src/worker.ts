export interface Env {
  GEMINI_API_KEY: string;
  ASSETS: Fetcher;
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      return handleGenerate(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleChat(request: Request, env: Env): Promise<Response> {
  const body = await request.json<{
    message: string;
    history: Array<{ role: string; parts: Array<{ text: string }> }>;
    systemInstruction: string;
    model?: string;
  }>();

  const { message, history, systemInstruction, model = 'gemini-2.0-flash' } = body;

  const contents = [
    ...history,
    { role: 'user', parts: [{ text: message }] },
  ];

  const geminiRes = await fetch(
    `${GEMINI_API_BASE}/${model}:streamGenerateContent?alt=sse`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
      }),
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
  const { prompt, model = 'gemini-2.0-flash' } = body;

  const geminiRes = await fetch(
    `${GEMINI_API_BASE}/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
    },
  );

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
