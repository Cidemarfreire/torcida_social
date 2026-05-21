import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type NewsDraft = Tables<"news_drafts">;

export const NEWS_TOPIC_LABELS: Record<NewsDraft["topic"], string> = {
  social_sports: "Esporte social",
  selecao_brasileira: "Selecao Brasileira",
  copa: "Rumo a Copa",
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

export async function fetchPublishedNews() {
  const { data, error } = await supabase
    .from("news_drafts")
    .select("*")
    .in("status", ["approved", "published"])
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
