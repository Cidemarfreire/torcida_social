import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { getFootballNewsMock, type FootballNewsItem } from "./football-news-mock";

export type NewsDraft = Tables<"news_drafts">;
export type NewsTopic = NewsDraft["topic"];

export const NEWS_TOPICS: NewsTopic[] = [
  "social_sports",
  "selecao_brasileira",
  "copa",
];

export const NEWS_TOPIC_LABELS: Record<NewsTopic, string> = {
  social_sports: "Esporte social",
  selecao_brasileira: "Seleção Brasileira",
  copa: "Mundo dos esportes",
};

export const NEWS_TOPIC_DESCRIPTIONS: Record<NewsTopic, string> = {
  social_sports:
    "Servicos sociais, projetos comunitarios e impacto pelo esporte no Brasil.",
  selecao_brasileira:
    "Selecao Brasileira e o caminho rumo a Copa, com foco em mobilizacao social.",
  copa: "Panorama do futebol e dos esportes no mundo, com relevancia para torcidas.",
};

export function formatNewsDate(value: string | null) {
  if (!value) {
    return "Em revisao";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export async function fetchPublishedNews(topic?: NewsTopic) {
  try {
    let query = supabase
      .from("news_drafts")
      .select("*")
      .in("status", ["approved", "published"])
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (topic) {
      query = query.eq("topic", topic);
    }

    const { data, error } = await query.limit(24);

    if (error) {
      console.error("Erro ao buscar notícias do Supabase:", error);
      throw error;
    }

    if (data && data.length > 0) {
      return data;
    }

    console.log("Nenhuma notícia encontrada no banco, usando fallback mockado");
    return convertFootballNewsToNewsDraft(getFootballNewsMock(), topic);
  } catch (error) {
    console.error("Erro ao carregar notícias, usando fallback mockado:", error);
    return convertFootballNewsToNewsDraft(getFootballNewsMock(), topic);
  }
}

function convertFootballNewsToNewsDraft(
  footballNews: FootballNewsItem[],
  topic?: NewsTopic
): NewsDraft[] {
  const topicMapping: Record<string, NewsTopic> = {
    "Copa do Mundo": "copa",
    "Seleção Brasileira": "selecao_brasileira",
    "Brasileirão": "copa",
    "Futebol Mundial": "copa",
    "Mercado da Bola": "copa",
    "Times Brasileiros": "copa",
  };

  let filtered = footballNews;

  if (topic) {
    const categoryForTopic = Object.entries(topicMapping)
      .filter(([_, t]) => t === topic)
      .map(([cat, _]) => cat);

    if (categoryForTopic.length > 0) {
      filtered = footballNews.filter((item) =>
        categoryForTopic.includes(item.category)
      );
    }
  }

  return filtered.map((item) => ({
    id: item.id,
    topic: topicMapping[item.category] || "copa",
    title: item.title,
    summary: item.summary,
    social_relevance: "",
    call_to_action: "Ler notícia completa",
    sources: [`https://${item.source.toLowerCase().replace(/\s+/g, "")}.com`],
    status: "published" as const,
    created_at: item.date,
    published_at: item.date,
    reviewed_at: null,
    reviewed_by: null,
    generated_by: "mock",
    slug: item.id,
    updated_at: item.date,
  }));
}

export function pickFeaturedByTopic(news: NewsDraft[]) {
  const featured: Partial<Record<NewsTopic, NewsDraft>> = {};

  for (const item of news) {
    if (!featured[item.topic]) {
      featured[item.topic] = item;
    }
  }

  return featured;
}
