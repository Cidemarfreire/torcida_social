import { createServerFn } from "@tanstack/react-start";

function getGenerateNewsUrl() {
  const explicitUrl = process.env.GENERATE_NEWS_FUNCTION_URL;
  if (explicitUrl) {
    return explicitUrl;
  }
  return "https://yqmgtqtrpxoqbgpkdjcg.supabase.co/functions/v1/generate-news-drafts";
}

export const generateNewsDraftsNow = createServerFn({ method: "POST" }).handler(async () => {
  const secret = process.env.GENERATE_NEWS_SECRET;
  const url = getGenerateNewsUrl();

  const supabaseKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    throw new Error("SUPABASE_PUBLISHABLE_KEY não configurada para chamar generate-news-drafts");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      ...(secret && { "x-generate-news-secret": secret }),
    },
  });

  const rawText = await res.text();
  let json: any = {};

  try {
    json = rawText ? JSON.parse(rawText) : {};
  } catch {
    json = {};
  }

  if (!res.ok) {
    console.error("generate-news-drafts status:", res.status);
    console.error("generate-news-drafts response:", rawText);

    throw new Error(
      json?.error ||
      rawText ||
      `Falha ao gerar notícias com IA. Status: ${res.status}`
    );
  }

  return json as { inserted?: number };
});
