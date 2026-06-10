import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Tables } from "@/integrations/supabase/types";
import { formatNewsDate, NEWS_TOPIC_LABELS, NEWS_TOPICS } from "@/lib/news";
import { generateNewsDraftsNow } from "@/lib/news.functions";
import { isAdmin } from "@/lib/auth";

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
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTopic, setFilterTopic] = useState<string>("all");

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      const adminCheck = await isAdmin();
      if (!adminCheck) {
        navigate({ to: "/perfil" });
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

  const filteredNews = newsDrafts.filter((item) => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (filterTopic !== "all" && item.topic !== filterTopic) return false;
    return true;
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

      <section className="px-6 py-8 max-w-7xl mx-auto">
        <div className="bg-card border border-navy/5 rounded-2xl p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50 mb-4">
            Atalhos rápidos
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <a
              href="#noticias-admin"
              className="bg-navy/5 border border-navy/10 hover:border-action hover:bg-action/10 px-4 py-3 rounded-xl text-xs font-bold text-navy hover:text-action transition-all text-center"
            >
              Gerenciar Notícias
            </a>
            <a
              href="/noticias"
              className="bg-navy/5 border border-navy/10 hover:border-action hover:bg-action/10 px-4 py-3 rounded-xl text-xs font-bold text-navy hover:text-action transition-all text-center"
            >
              Ver Central Pública
            </a>
            <a
              href="/perfil"
              className="bg-navy/5 border border-navy/10 hover:border-action hover:bg-action/10 px-4 py-3 rounded-xl text-xs font-bold text-navy hover:text-action transition-all text-center"
            >
              Voltar ao Perfil
            </a>
            <a
              href="/torcida"
              className="bg-navy/5 border border-navy/10 hover:border-action hover:bg-action/10 px-4 py-3 rounded-xl text-xs font-bold text-navy hover:text-action transition-all text-center"
            >
              Arquibancada
            </a>
            <a
              href="/mural"
              className="bg-navy/5 border border-navy/10 hover:border-action hover:bg-action/10 px-4 py-3 rounded-xl text-xs font-bold text-navy hover:text-action transition-all text-center"
            >
              Mural
            </a>
          </div>
        </div>
      </section>


      <section id="noticias-admin" className="px-6 pt-4 pb-24 max-w-7xl mx-auto">
        <div className="bg-card border border-navy/5 rounded-3xl overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-navy/5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="font-display text-xl font-black">
                Gerenciar Notícias
              </h2>
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
                {filteredNews.length} item(ns)
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mb-5">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-navy/60">Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-card border border-navy/10 rounded-lg px-3 py-2 text-xs font-bold text-navy"
                >
                  <option value="all">Todos</option>
                  <option value="draft">Rascunhos</option>
                  <option value="approved">Aprovados</option>
                  <option value="published">Publicados</option>
                  <option value="rejected">Rejeitados</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-navy/60">Categoria:</label>
                <select
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                  className="bg-card border border-navy/10 rounded-lg px-3 py-2 text-xs font-bold text-navy"
                >
                  <option value="all">Todas</option>
                  {NEWS_TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {NEWS_TOPIC_LABELS[topic]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoadingNews ? (
              <p className="text-sm font-bold text-navy/60">
                Carregando notícias...
              </p>
            ) : filteredNews.length === 0 ? (
              <p className="text-sm text-navy/60">
                Nenhum rascunho encontrado com os filtros atuais.
              </p>
            ) : (
              <div className="grid gap-5">
                {filteredNews.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface border border-navy/5 rounded-3xl p-5 grid lg:grid-cols-[220px_1fr] gap-5"
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

                      <div className="mt-4 flex flex-wrap gap-2 border-t border-navy/10 pt-4">
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
  const updateData: { status: NewsStatus; published_at?: string; reviewed_at?: string } = { status };
  
  if (status === "published") {
    updateData.published_at = new Date().toISOString();
  }

  if (status === "approved" || status === "rejected") {
    updateData.reviewed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("news_drafts")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;
}

async function deleteNewsDraft(id: string) {
  const { error } = await supabase.from("news_drafts").delete().eq("id", id);

  if (error) throw error;
}
