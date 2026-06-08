import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type NewsDraft = Tables<"news_drafts">;
export type NewsTopic = "selecao_brasileira" | "futebol_nacional" | "futebol_mundial" | "esporte_social";

export const NEWS_TOPICS: NewsTopic[] = [
  "selecao_brasileira",
  "futebol_nacional",
  "futebol_mundial",
  "esporte_social",
];

export const NEWS_TOPIC_LABELS: Record<NewsTopic, string> = {
  selecao_brasileira: "Seleção Brasileira",
  futebol_nacional: "Futebol Nacional",
  futebol_mundial: "Futebol Mundial",
  esporte_social: "Esporte Social",
};

export const NEWS_TOPIC_DESCRIPTIONS: Record<NewsTopic, string> = {
  selecao_brasileira:
    "Seleção Brasileira e o caminho rumo à Copa, com foco em mobilização social.",
  futebol_nacional:
    "Brasileirão, clubes da Série A e futebol nacional em geral.",
  futebol_mundial:
    "Futebol mundial, ligas internacionais e competições globais.",
  esporte_social:
    "Projetos sociais, inclusão e transformação pelo esporte.",
};

export function formatNewsDate(value: string | null) {
  if (!value) {
    return "Em revisão";
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
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (topic) {
    query = query.eq("topic", topic as any);
  }

  const { data, error } = await query.limit(24);

  if (error) {
    console.error("Erro ao buscar notícias do Supabase:", error);
    throw error;
  }

  return data || [];
}

export function pickFeaturedByTopic(news: NewsDraft[]) {
  const featured: Partial<Record<NewsTopic, NewsDraft>> = {};

  for (const item of news) {
    const topicKey = item.topic as NewsTopic;
    if (!featured[topicKey]) {
      featured[topicKey] = item;
    }
  }

  return featured;
}
