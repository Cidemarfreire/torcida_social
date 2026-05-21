import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.4";

type NewsTopic = "social_sports" | "selecao_brasileira" | "copa";

type GeneratedNewsItem = {
  title: string;
  summary: string;
  socialRelevance: string;
  callToAction: string;
  topic: NewsTopic;
  sources: string[];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function parseItems(raw: string): GeneratedNewsItem[] {
  const parsed = JSON.parse(raw) as { items?: GeneratedNewsItem[] };
  return Array.isArray(parsed.items) ? parsed.items : [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const functionSecret = Deno.env.get("GENERATE_NEWS_SECRET");
    if (
      functionSecret &&
      req.headers.get("x-generate-news-secret") !== functionSecret
    ) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!geminiKey || !supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing GEMINI_API_KEY, SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const today = new Date().toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const prompt = `
Hoje e ${today}. Pesquise fontes recentes e confiaveis sobre:
- impacto social envolvendo esportes no Brasil;
- acoes sociais de clubes, atletas, torcidas e instituicoes esportivas;
- projetos comunitarios ligados ao futebol;
- noticias relevantes da Selecao Brasileira rumo a Copa.

Gere ate 5 pautas verificaveis em portugues do Brasil. Evite boatos, opiniao sem fonte e sensacionalismo.
Responda somente JSON valido no formato:
{
  "items": [
    {
      "title": "titulo curto",
      "summary": "resumo jornalistico",
      "socialRelevance": "por que importa para a Torcida Social",
      "callToAction": "chamada para app ou rede social",
      "topic": "social_sports | selecao_brasileira | copa",
      "sources": ["https://..."]
    }
  ]
}
`;

    const geminiModel = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": geminiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          tools: [{ googleSearch: {} }],
          generationConfig: {
            temperature: 0.3,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("\n")
        .trim() ?? "";
    const items = parseItems(text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const rows = items.map((item) => ({
      slug: `${slugify(item.title)}-${today.split("/").reverse().join("")}`,
      title: item.title,
      summary: item.summary,
      social_relevance: item.socialRelevance,
      call_to_action: item.callToAction,
      sources: item.sources.filter(Boolean),
      topic: item.topic,
      status: "draft" as const,
      generated_by: "gemini-google-search",
    }));

    if (rows.length > 0) {
      const { error } = await supabase
        .from("news_drafts")
        .upsert(rows, { onConflict: "slug", ignoreDuplicates: true });

      if (error) {
        throw error;
      }
    }

    return new Response(JSON.stringify({ inserted: rows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
