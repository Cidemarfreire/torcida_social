import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { STATS, RANKING, SERIE_A_CLUBS, formatBRL, formatInt } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/admin-guard";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Tables } from "@/integrations/supabase/types";
import { formatNewsDate, NEWS_TOPIC_LABELS } from "@/lib/news";
import { generateNewsDraftsNow } from "@/lib/news.functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: requireAdmin,
  component: Admin,
  head: () => ({ meta: [
    { title: "Administração — Torcida Social" },
    { name: "description", content: "Painel administrativo com gestão de torcedores, doações e métricas em tempo real." },
  ]}),
});

function Admin() {
  const queryClient = useQueryClient();
  const { data: newsDrafts = [], isLoading: isLoadingNews } = useQuery({
    queryKey: ["admin-news-drafts"],
    queryFn: fetchNewsDrafts,
    retry: 1,
  });
  const reviewNews = useMutation({
    mutationFn: updateNewsStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-news-drafts"] }),
  });
  const generateNews = useMutation({
    mutationFn: () => generateNewsDraftsNow(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-news-drafts"] }),
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Administração · IA"
        title="Painel de controle."
        subtitle="Gestão de torcedores, crianças, pagamentos, núcleos e parceiros. Métricas e sugestões com inteligência artificial."
      />

      <section className="px-6 py-12 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Torcedores ativos" value={formatInt(STATS.torcedores)} delta="+12,4%" />
        <Card label="Doações no mês" value="R$ 318.420" delta="+8,2%" />
        <Card label="Crianças cadastradas" value={formatInt(STATS.criancas)} delta="+3,1%" />
        <Card label="Núcleos" value="8" delta="+1 mês" />
      </section>

      <section className="px-6 max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-navy/5 rounded-3xl p-7">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-xl font-black">Arrecadação semanal</h2>
            <span className="text-xs font-bold text-success">+18% vs semana anterior</span>
          </div>
          <div className="h-56 flex items-end gap-2">
            {[35, 48, 42, 60, 55, 70, 85].map((v, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-action to-success rounded-t-lg" style={{ height: `${v}%` }} />
            ))}
          </div>
          <div className="grid grid-cols-7 mt-3 text-[10px] font-bold text-navy/40 text-center uppercase">
            {["seg", "ter", "qua", "qui", "sex", "sáb", "dom"].map((d) => <span key={d}>{d}</span>)}
          </div>
        </div>

        <div className="bg-navy text-background rounded-3xl p-7">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gold mb-2">IA · Sugestão</p>
          <h3 className="font-display text-xl font-black leading-tight">Ative campanha relâmpago no Sudeste em parceria com clubes paulistas.</h3>
          <p className="text-background/70 text-sm mt-3">Detectamos crescimento de 32% em torcedores PAL/SPFC nos últimos 7 dias.</p>
          <button className="mt-5 bg-gold text-navy px-5 py-3 rounded-xl font-bold text-sm">Criar campanha</button>
        </div>
      </section>

      <section className="px-6 pt-12 pb-24 max-w-7xl mx-auto">
        <div className="bg-card border border-navy/5 rounded-3xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-navy/5 flex justify-between items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-action">
                RSS - Curadoria
              </p>
              <h2 className="font-display text-xl font-black">
                Rascunhos de noticias
              </h2>
            </div>
            <span className="text-xs font-bold text-navy/50">
              {isLoadingNews ? "Carregando..." : `${newsDrafts.length} item(ns)`}
            </span>
          </div>
          <div className="px-6 py-4 border-b border-navy/5 flex flex-wrap gap-3 items-center justify-between">
            <p className="text-sm text-navy/60">
              Coleta pautas gratis via RSS (Google News) — 3 temas, sem API paga de IA.
              Agendamento: GitHub Actions 08h, 14h e 20h (SP).
            </p>
            <button
              onClick={() => generateNews.mutate()}
              disabled={generateNews.isPending}
              className="bg-action text-background px-5 py-3 rounded-xl text-xs font-bold disabled:opacity-50"
            >
              {generateNews.isPending ? "Coletando..." : "Coletar noticias agora"}
            </button>
          </div>
          {generateNews.isError && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-sm font-bold text-red-700">
              {generateNews.error instanceof Error ? generateNews.error.message : "Falha ao coletar noticias"}
            </div>
          )}
          {generateNews.isSuccess && (
            <div className="px-6 py-3 bg-success/10 border-b border-success/20 text-sm font-bold text-success">
              Coleta concluida. Novos rascunhos: {generateNews.data?.inserted ?? 0}
            </div>
          )}
          {newsDrafts.length === 0 ? (
            <div className="p-6 text-sm text-navy/60">
              Nenhum rascunho encontrado. A funcao agendada cria novos itens em
              `news_drafts`.
            </div>
          ) : (
            <div className="divide-y divide-navy/5">
              {newsDrafts.map((item) => (
                <div
                  key={item.id}
                  className="grid lg:grid-cols-[1fr_280px] gap-4 px-6 py-5"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                      <span className="bg-action/10 text-action font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {NEWS_TOPIC_LABELS[item.topic]}
                      </span>
                      <span className="text-navy/40 font-bold">
                        {formatNewsDate(item.created_at)}
                      </span>
                      <span className="text-navy/40 font-bold uppercase">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-black leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-navy/65 mt-2 leading-relaxed">
                      {item.summary}
                    </p>
                    {item.social_relevance && (
                      <p className="text-sm text-navy/65 mt-3 leading-relaxed">
                        <strong className="text-navy">Impacto social: </strong>
                        {item.social_relevance}
                      </p>
                    )}
                    {item.call_to_action && (
                      <p className="text-sm font-bold text-action mt-3">
                        {item.call_to_action}
                      </p>
                    )}
                    {item.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.sources.slice(0, 3).map((source, index) => (
                          <a
                            key={source}
                            href={source}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-action underline"
                          >
                            Fonte {index + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap lg:justify-end items-start gap-2">
                    <button
                      onClick={() =>
                        reviewNews.mutate({ id: item.id, status: "approved" })
                      }
                      disabled={reviewNews.isPending}
                      className="bg-success text-background px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() =>
                        reviewNews.mutate({ id: item.id, status: "published" })
                      }
                      disabled={reviewNews.isPending}
                      className="bg-action text-background px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      Publicar
                    </button>
                    <button
                      onClick={() =>
                        reviewNews.mutate({ id: item.id, status: "rejected" })
                      }
                      disabled={reviewNews.isPending}
                      className="bg-navy/10 text-navy px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-navy/5 rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-navy/5 flex justify-between items-center">
            <h2 className="font-display text-xl font-black">Top clubes — performance</h2>
            <button className="text-xs font-bold text-action">Exportar CSV</button>
          </div>
          {RANKING.slice(0, 5).map((row, i) => {
            const club = SERIE_A_CLUBS.find((c) => c.id === row.clubId)!;
            return (
              <div key={club.id} className="grid grid-cols-[40px_1fr_120px_140px] gap-4 px-6 py-4 border-b border-navy/5 last:border-0 items-center text-sm">
                <span className="font-display font-black text-navy/40">{i + 1}º</span>
                <span className="font-bold">{club.name}</span>
                <span className="text-right">{formatInt(row.donors)} doadores</span>
                <span className="text-right font-display font-black text-action">{formatBRL(row.raised)}</span>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}

type NewsDraft = Tables<"news_drafts">;
type NewsStatus = Database["public"]["Enums"]["news_status"];

async function fetchNewsDrafts() {
  const { data, error } = await supabase
    .from("news_drafts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function updateNewsStatus({
  id,
  status,
}: {
  id: NewsDraft["id"];
  status: NewsStatus;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("news_drafts")
    .update({
      status,
      reviewed_at: now,
      reviewed_by: user?.id ?? null,
      published_at: status === "published" ? now : null,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

function Card({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="bg-card border border-navy/5 rounded-2xl p-6">
      <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">{label}</p>
      <p className="font-display text-3xl font-black mt-2">{value}</p>
      <p className="text-xs font-bold text-success mt-1">{delta}</p>
    </div>
  );
}
