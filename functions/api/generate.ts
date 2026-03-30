/// <reference types="@cloudflare/workers-types" />

export interface Env {
  GEMINI_API_KEY: string;
}

interface RequestBody {
  prompt?: unknown;
  message?: unknown;
  text?: unknown;
  input?: unknown;
}

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
  };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: { message?: string };
}

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
    },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.GEMINI_API_KEY) return json({ error: "Missing GEMINI_API_KEY" }, 500);

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body) return json({ error: "Invalid JSON body" }, 400);

  const prompt = body?.prompt ?? body?.message ?? body?.text ?? body?.input;

  if (!prompt || typeof prompt !== "string") {
    return json({ error: "Missing 'prompt' in request body" }, 400);
  }

  const geminiRes = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  });

  const geminiJson = (await geminiRes.json().catch(() => ({}))) as GeminiResponse;
  if (!geminiRes.ok) {
    return json(
      { error: "Gemini API error", status: geminiRes.status, details: geminiJson },
      502
    );
  }

  const text =
    geminiJson?.candidates?.[0]?.content?.parts
      ?.map((p) => p?.text)
      ?.filter(Boolean)
      ?.join("") ?? "";

  return json({ text });
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
