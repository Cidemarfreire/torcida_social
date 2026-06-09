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

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
