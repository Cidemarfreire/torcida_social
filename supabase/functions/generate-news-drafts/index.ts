const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type NewsDraft = {
  topic: string;
  status: "draft";
  title: string;
  summary: string;
  social_relevance: string;
  call_to_action: string;
  sources: string[];
  image_url?: string | null;
};

const FALLBACK_IMAGE =
  "https://www.multplen.com.br/assets/hero-torcida-CS-SmjMq.jpg";

const SERIE_A_CLUBS = [
  "Flamengo",
  "Fluminense",
  "Vasco",
  "Botafogo",
  "Palmeiras",
  "Corinthians",
  "São Paulo",
  "Santos",
  "Cruzeiro",
  "Atlético Mineiro",
  "Grêmio",
  "Internacional",
  "Bahia",
  "Vitória",
  "Fortaleza",
  "Athletico Paranaense",
  "Coritiba",
  "Red Bull Bragantino",
  "Remo",
  "Chapecoense",
];

const NEWS_QUERIES = [
  {
    topic: "selecao_brasileira",
    label: "Seleção Brasileira",
    query: '"Seleção Brasileira" futebol Brasil Copa do Mundo 2026',
  },
  {
    topic: "copa",
    label: "Copa do Mundo",
    query: '"Copa do Mundo 2026" Brasil "Seleção Brasileira"',
  },
  {
    topic: "mundo_esportes",
    label: "Brasileirão Série A",
    query: `"Brasileirão Série A" Brasil futebol ${SERIE_A_CLUBS.join(" OR ")}`,
  },
  {
    topic: "social_sports",
    label: "Esporte social",
    query: '"projetos sociais" futebol Brasil OR "esporte social" Brasil',
  },
  ...SERIE_A_CLUBS.map((club) => ({
    topic: "mundo_esportes",
    label: club,
    query: `"${club}" "Brasileirão" futebol Brasil`,
  })),
];

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function extractTag(item: string, tag: string) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = item.match(regex);
  return match?.[1]?.trim() || "";
}

function extractCdata(value: string) {
  return value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function extractImage(item: string) {
  const media =
    item.match(/<media:content[^>]+url="([^"]+)"/i) ||
    item.match(/<media:thumbnail[^>]+url="([^"]+)"/i) ||
    item.match(/<enclosure[^>]+url="([^"]+)"/i);

  if (media?.[1]) return media[1];

  const description = extractTag(item, "description");
  const img = description.match(/<img[^>]+src="([^"]+)"/i);

  return img?.[1] || null;
}

function normalizeTitle(title: string) {
  return stripHtml(title)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function googleNewsRssUrl(query: string) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
}

function hasBrazilFocus(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase();

  const brazilTerms = [
    "brasil",
    "brasileira",
    "brasileiro",
    "seleção brasileira",
    "cbf",
    "brasileirão",
    "série a",
    "serie a",
    ...SERIE_A_CLUBS.map((c) => c.toLowerCase()),
  ];

  const foreignOnlyTerms = [
    "espanha",
    "frança",
    "inglaterra",
    "portugal",
    "alemanha",
    "itália",
    "argentina",
    "luis de la fuente",
    "lamine yamal",
  ];

  const hasBrazil = brazilTerms.some((term) => text.includes(term));
  const foreignOnly =
    foreignOnlyTerms.some((term) => text.includes(term)) && !hasBrazil;

  return hasBrazil && !foreignOnly;
}

function scoreNews(title: string, summary: string, label: string) {
  const text = `${title} ${summary}`.toLowerCase();
  let score = 0;

  if (text.includes(label.toLowerCase())) score += 30;
  if (text.includes("brasileirão")) score += 25;
  if (text.includes("série a") || text.includes("serie a")) score += 20;
  if (text.includes("seleção brasileira")) score += 25;
  if (text.includes("copa do mundo")) score += 20;
  if (text.includes("cbf")) score += 15;
  if (text.includes("convocação")) score += 15;
  if (text.includes("projeto social")) score += 15;
  if (text.includes("inclusão")) score += 10;
  if (text.includes("crianças")) score += 10;

  for (const club of SERIE_A_CLUBS) {
    if (text.includes(club.toLowerCase())) score += 18;
  }

  return score;
}

function buildSocialRelevance(topic: string) {
  if (topic === "selecao_brasileira") {
    return "A Seleção Brasileira mobiliza milhões de torcedores e abre espaço para campanhas solidárias ligadas ao futebol.";
  }

  if (topic === "copa") {
    return "A Copa do Mundo aumenta o engajamento nacional e pode impulsionar ações sociais conectadas à paixão pelo futebol.";
  }

  if (topic === "social_sports") {
    return "Mostra como o esporte pode gerar inclusão, educação, pertencimento e transformação social.";
  }

  return "O Brasileirão e os clubes da Série A mobilizam torcidas em todo o país, fortalecendo campanhas de impacto social.";
}

function buildCallToAction(topic: string) {
  if (topic === "social_sports") {
    return "Convide sua torcida a apoiar um núcleo social pelo app.";
  }

  if (topic === "selecao_brasileira" || topic === "copa") {
    return "Use a força da Seleção para engajar torcedores em doações e ações sociais.";
  }

  return "Compartilhe essa pauta e fortaleça a Torcida Social com seu clube do coração.";
}

async function fetchRssItems(queryConfig: typeof NEWS_QUERIES[number]) {
  const response = await fetch(googleNewsRssUrl(queryConfig.query), {
    headers: { "User-Agent": "TorcidaSocialBot/1.0" },
  });

  if (!response.ok) {
    throw new Error(`RSS ${queryConfig.label}: HTTP ${response.status}`);
  }

  const xml = await response.text();

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(
    (match) => match[1]
  );

  return items
    .map((item) => {
      const title = stripHtml(extractCdata(extractTag(item, "title")));
      const summary = stripHtml(extractCdata(extractTag(item, "description")));
      const source = extractCdata(extractTag(item, "link"));
      const image_url = extractImage(item) || FALLBACK_IMAGE;

      return {
        title,
        summary,
        source,
        image_url,
        score: scoreNews(title, summary, queryConfig.label),
      };
    })
    .filter((item) => item.title && item.source)
    .filter((item) => hasBrazilFocus(item.title, item.summary))
    .sort((a, b) => b.score - a.score)
    .slice(0, 1)
    .map(
      (item): NewsDraft => ({
        topic: queryConfig.topic,
        status: "draft",
        title: item.title,
        summary: item.summary || item.title,
        social_relevance: buildSocialRelevance(queryConfig.topic),
        call_to_action: buildCallToAction(queryConfig.topic),
        sources: [item.source],
        image_url: item.image_url || FALLBACK_IMAGE,
      })
    );
}

async function insertNewsDrafts(news: NewsDraft[]) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados");
  }

  let inserted = 0;

  for (const item of news) {
    const normalizedTitle = normalizeTitle(item.title);

    const checkUrl =
      `${supabaseUrl}/rest/v1/news_drafts?select=id,title`;

    const existingResponse = await fetch(checkUrl, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    const existingData = await existingResponse.json().catch(() => []);

    const alreadyExists =
      Array.isArray(existingData) &&
      existingData.some(
        (row) => normalizeTitle(String(row.title || "")) === normalizedTitle
      );

    if (alreadyExists) continue;

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/news_drafts`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(item),
    });

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      throw new Error(`Erro ao inserir notícia: ${errorText}`);
    }

    inserted += 1;
  }

  return inserted;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const collected: NewsDraft[] = [];
    const errors: string[] = [];

    for (const queryConfig of NEWS_QUERIES) {
      try {
        const items = await fetchRssItems(queryConfig);
        collected.push(...items);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }

    const uniqueByTitle = Array.from(
      new Map(collected.map((item) => [normalizeTitle(item.title), item])).values()
    ).slice(0, 30);

    const inserted = await insertNewsDrafts(uniqueByTitle);

    return jsonResponse({
      success: true,
      inserted,
      collected: uniqueByTitle.length,
      source: "rss-serie-a-selecao-copa-com-imagem-fallback",
      errors,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      500
    );
  }
});