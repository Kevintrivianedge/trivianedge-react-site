/// <reference types="@cloudflare/workers-types" />
export interface Env {
  GEMINI_API_KEY: string;
}

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

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

const message =
  body?.message ??
  body?.prompt ??
  body?.text ??
  body?.input ??
  body?.messages?.[body?.messages?.length - 1]?.content;

  
  if (!message || typeof message !== "string") {
    return json({ error: "Missing 'message' in request body" }, 400);
  }

  const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: message }] }],
    }),
  });

  const geminiJson: any = await geminiRes.json().catch(() => ({}));
  if (!geminiRes.ok) {
    return json(
      { error: "Gemini API error", status: geminiRes.status, details: geminiJson },
      502
    );
  }

  const reply =
    geminiJson?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text)
      ?.filter(Boolean)
      ?.join("") ?? "";

  return json({ reply });
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