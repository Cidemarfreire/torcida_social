import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.4";

type NewsTopic = "social_sports" | "selecao_brasileira" | "copa";

type RssItem = {
  title: string;
  summary: string;
  link: string;
};

type NewsDraftRow = {
  slug: string;
  title: string;
  summary: string;
  social_relevance: string;
  call_to_action: string;
  sources: string[];
  topic: NewsTopic;
  status: "draft";
  generated_by: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-generate-news-secret",
};

const TOPIC_CONFIG: Record<
  NewsTopic,
  { query: string; relevance: string; cta: string }
> = {
  social_sports: {
    query: "esporte impacto social brasil ONG comunidade",
    relevance:
      "Mostra como o futebol e o esporte ampliam educacao, inclusao e apoio a familias em vulnerabilidade — o coracao da Torcida Social.",
    cta: "Convide sua torcida a apoiar um nucleo ou projeto social pelo app.",
  },
  selecao_brasileira: {
    query: "selecao brasileira copa do mundo 2026",
    relevance:
      "A Selecao mobiliza o pais e abre espaco para campanhas de solidariedade ligadas ao futebol.",
    cta: "Use a energia da Selecao para engajar torcedores em doacoes e acoes sociais.",
  },
  copa: {
    query: "futebol noticias mundo esportes internacional",
    relevance:
      "O cenario global do esporte inspira torcidas e parceiros a ampliar o impacto social no Brasil.",
    cta: "Compartilhe na central de noticias e convide apoiadores para a Liga da Solidariedade.",
  },
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
}

function decodeXml(text: string) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function parseRss(xml: string, limit = 2): RssItem[] {
  const items: RssItem[] = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];

  for (const block of blocks) {
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const summary =
      extractTag(block, "description") ||
      extractTag(block, "content:encoded") ||
      extractTag(block, "summary");

    if (!title || !link) continue;

    items.push({
      title: title.slice(0, 200),
      summary: (summary || title).slice(0, 500),
      link,
    });

    if (items.length >= limit) break;
  }

  return items;
}

function googleNewsRssUrl(query: string) {
  const q = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${q}&hl=pt-BR&gl=BR&ceid=BR:pt`;
}

async function fetchTopicItems(topic: NewsTopic): Promise<RssItem[]> {
  const { query } = TOPIC_CONFIG[topic];
  const response = await fetch(googleNewsRssUrl(query), {
    headers: { "User-Agent": "TorcidaSocialNewsBot/1.0" },
  });

  if (!response.ok) {
    throw new Error(`RSS ${topic}: HTTP ${response.status}`);
  }

  return parseRss(await response.text(), 2);
}

function toDraftRows(
  topic: NewsTopic,
  items: RssItem[],
  dateKey: string,
): NewsDraftRow[] {
  const config = TOPIC_CONFIG[topic];

  return items.map((item, index) => {
    const base = slugify(item.title) || `noticia-${topic}-${index}`;
    return {
      slug: `${base}-${dateKey}-${topic}`,
      title: item.title,
      summary: item.summary,
      social_relevance: config.relevance,
      call_to_action: config.cta,
      sources: [item.link],
      topic,
      status: "draft" as const,
      generated_by: "rss-google-news",
    };
  });
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const dateKey = new Date()
      .toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })
      .split("/")
      .reverse()
      .join("");

    const topics = Object.keys(TOPIC_CONFIG) as NewsTopic[];
    const results = await Promise.allSettled(
      topics.map((topic) => fetchTopicItems(topic)),
    );

    const rows: NewsDraftRow[] = [];
    const errors: string[] = [];

    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      const result = results[i];
      if (result.status === "fulfilled") {
        rows.push(...toDraftRows(topic, result.value, dateKey));
      } else {
        errors.push(
          `${topic}: ${result.reason instanceof Error ? result.reason.message : "erro"}`,
        );
      }
    }

    if (rows.length === 0) {
      throw new Error(
        errors.length > 0
          ? `Nenhuma noticia coletada. ${errors.join("; ")}`
          : "Nenhuma noticia coletada dos feeds.",
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { error } = await supabase
      .from("news_drafts")
      .upsert(rows, { onConflict: "slug", ignoreDuplicates: true });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        inserted: rows.length,
        source: "rss-google-news",
        warnings: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
