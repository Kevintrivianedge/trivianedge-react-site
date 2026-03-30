/// <reference types="@cloudflare/workers-types" />

export interface Env {
  GEMINI_API_KEY: string;
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

  const body = (await request.json().catch(() => null)) as any;
  if (!body) return json({ error: "Invalid JSON body" }, 400);

  const prompt =
    body?.prompt ??
    body?.message ??
    body?.text ??
    body?.input;

  if (!prompt || typeof prompt !== "string") {
    return json({ error: "Missing 'prompt' in request body" }, 400);
  }

  const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  });

  const geminiJson: any = await geminiRes.json().catch(() => ({}));
  if (!geminiRes.ok) {
    return json(
      { error: "Gemini API error", status: geminiRes.status, details: geminiJson },
      502
    );
  }

  const text =
    geminiJson?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text)
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
