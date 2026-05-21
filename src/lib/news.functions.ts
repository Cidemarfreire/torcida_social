import { createServerFn } from "@tanstack/react-start";

function getGenerateNewsUrl() {
  const explicitUrl = process.env.GENERATE_NEWS_FUNCTION_URL;
  if (explicitUrl) return explicitUrl;

  const projectId = process.env.VITE_SUPABASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("VITE_SUPABASE_PROJECT_ID ou GENERATE_NEWS_FUNCTION_URL não configurado");
  }

  return `https://${projectId}.supabase.co/functions/v1/generate-news-drafts`;
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

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || "Falha ao gerar notícias com IA");
  }

  return json as { inserted?: number };
});
