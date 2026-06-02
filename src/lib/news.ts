import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

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
    throw error;
  }

  return data ?? [];
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
