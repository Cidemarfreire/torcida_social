import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { STATS, formatInt } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Tables } from "@/integrations/supabase/types";
import { formatNewsDate, NEWS_TOPIC_LABELS } from "@/lib/news";
import { generateNewsDraftsNow } from "@/lib/news.functions";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [{ title: "Administração — Torcida Social" }],
  }),
});

function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      if (user.email !== "cidemarfaria@gmail.com") {
        navigate({ to: "/" });
        return;
      }

      setCheckingAccess(false);
    }

    checkAccess();
  }, [navigate]);

  const { data: newsDrafts = [], isLoading: isLoadingNews } = useQuery({
    queryKey: ["admin-news-drafts"],
    queryFn: fetchNewsDrafts,
    retry: 1,
    enabled: !checkingAccess,
  });

  const reviewNews = useMutation({
    mutationFn: updateNewsStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-news-drafts"] });
      await queryClient.refetchQueries({ queryKey: ["admin-news-drafts"] });
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "Erro ao atualizar notícia");
    },
  });

  const deleteNews = useMutation({
    mutationFn: deleteNewsDraft,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-news-drafts"] });
      await queryClient.refetchQueries({ queryKey: ["admin-news-drafts"] });
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "Erro ao apagar notícia");
    },
  });

  const generateNews = useMutation({
    mutationFn: () => generateNewsDraftsNow(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-news-drafts"] });
      await queryClient.refetchQueries({ queryKey: ["admin-news-drafts"] });
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "Erro ao coletar notícias");
    },
  });

  if (checkingAccess) {
    return (
      <SiteLayout>
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <p className="font-bold text-navy/60">
            Verificando acesso administrativo...
          </p>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Administração · Torcida Social"
        title="Painel de controle."
        subtitle="Gestão de notícias, métricas, torcedores, campanhas e ações da plataforma."
      />

      <section className="px-6 py-12 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Torcedores ativos" value={formatInt(STATS.torcedores)} delta="+12,4%" />
        <Card label="Doações no mês" value="R$ 318.420" delta="+8,2%" />
        <Card label="Crianças cadastradas" value={formatInt(STATS.criancas)} delta="+3,1%" />
        <Card label="Núcleos" value="8" delta="+1 mês" />
      </section>

      <section className="px-6 pt-4 pb-24 max-w-7xl mx-auto">
        <div className="bg-card border border-navy/5 rounded-3xl overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-navy/5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="font-display text-xl font-black">
                RSS · Curadoria
              </h2>
              <p className="text-sm text-navy/60 mt-1">
                Prioridade para Brasileirão, clubes da Série A, Seleção Brasileira,
                Copa do Mundo e esporte social.
              </p>
            </div>

            <button
              type="button"
              onClick={() => generateNews.mutate()}
              disabled={generateNews.isPending}
              className="bg-navy text-background px-5 py-3 rounded-xl font-black text-sm hover:bg-action transition-colors disabled:opacity-50"
            >
              {generateNews.isPending ? "Coletando..." : "Coletar notícias agora"}
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-black">
                Rascunhos de notícias
              </h3>
              <span className="text-xs font-bold text-navy/50">
                {newsDrafts.length} item(ns)
              </span>
            </div>

            {isLoadingNews ? (
              <p className="text-sm font-bold text-navy/60">
                Carregando notícias...
              </p>
            ) : newsDrafts.length === 0 ? (
              <p className="text-sm text-navy/60">
                Nenhum rascunho encontrado. Clique em “Coletar notícias agora”.
              </p>
            ) : (
              <div className="grid gap-5">
                {newsDrafts.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface border border-navy/5 rounded-3xl p-5 grid lg:grid-cols-[220px_1fr_auto] gap-5"
                  >
                    <div>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-2xl border border-navy/10 bg-card"
                        />
                      ) : (
                        <div className="w-full h-40 rounded-2xl bg-navy/10 grid place-items-center text-xs font-bold text-navy/50">
                          Sem imagem
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-gold/15 text-navy px-3 py-1 rounded-full text-[10px] font-black uppercase">
                          {NEWS_TOPIC_LABELS[item.topic] || item.topic}
                        </span>

                        <span className="bg-navy/10 text-navy px-3 py-1 rounded-full text-[10px] font-black uppercase">
                          {item.status}
                        </span>

                        <span className="text-[10px] font-bold text-navy/40 uppercase py-1">
                          {formatNewsDate(item.created_at)}
                        </span>
                      </div>

                      <h4 className="font-display text-xl font-black leading-tight">
                        {item.title}
                      </h4>

                      <p className="text-sm text-navy/70 mt-3 leading-relaxed">
                        {item.summary}
                      </p>

                      <p className="text-sm text-navy/60 mt-3 leading-relaxed">
                        <strong>Impacto social:</strong> {item.social_relevance}
                      </p>

                      <p className="text-sm text-action font-bold mt-3">
                        {item.call_to_action}
                      </p>

                      {item.sources?.[0] && (
                        <a
                          href={item.sources[0]}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-3 text-xs font-black text-navy underline"
                        >
                          Fonte 1
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap lg:flex-col gap-2 lg:min-w-28">
                      <button
                        onClick={() =>
                          reviewNews.mutate({ id: item.id, status: "approved" })
                        }
                        disabled={reviewNews.isPending || deleteNews.isPending}
                        className="bg-success text-background px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Aprovar
                      </button>

                      <button
                        onClick={() =>
                          reviewNews.mutate({ id: item.id, status: "published" })
                        }
                        disabled={reviewNews.isPending || deleteNews.isPending}
                        className="bg-action text-background px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Publicar
                      </button>

                      <button
                        onClick={() =>
                          reviewNews.mutate({ id: item.id, status: "rejected" })
                        }
                        disabled={reviewNews.isPending || deleteNews.isPending}
                        className="bg-navy/10 text-navy px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Rejeitar
                      </button>

                      <button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja apagar esta notícia?")) {
                            deleteNews.mutate(item.id);
                          }
                        }}
                        disabled={reviewNews.isPending || deleteNews.isPending}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Apagar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Card({
  label,
  value,
  delta,
}: {
  label: string;
  value: string | number;
  delta: string;
}) {
  return (
    <div className="bg-card border border-navy/5 rounded-2xl p-6 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">
        {label}
      </p>
      <p className="font-display text-3xl font-black mt-1 text-navy">{value}</p>
      <p className="text-xs font-bold text-success mt-2">{delta}</p>
    </div>
  );
}

type NewsDraft = Tables<"news_drafts">;
type NewsStatus = Database["public"]["Enums"]["news_status"];

async function fetchNewsDrafts() {
  const { data, error } = await supabase
    .from("news_drafts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(80);

  if (error) throw error;

  return (data || []) as NewsDraft[];
}

async function updateNewsStatus({
  id,
  status,
}: {
  id: string;
  status: NewsStatus;
}) {
  const { error } = await supabase
    .from("news_drafts")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}

async function deleteNewsDraft(id: string) {
  const { error } = await supabase.from("news_drafts").delete().eq("id", id);

  if (error) throw error;
}