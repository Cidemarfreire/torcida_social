import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Tables } from "@/integrations/supabase/types";
import { formatNewsDate, NEWS_TOPIC_LABELS, NEWS_TOPICS } from "@/lib/news";
import { generateNewsDraftsNow } from "@/lib/news.functions";
import { isAdmin } from "@/lib/auth";

// INTEGRAÇÃO DOS TRÊS MÓDULOS EXECUTIVOS REAIS
import { DashboardCadastros } from "@/components/admin/modules/DashboardCadastros";
import { DashboardCentralInfantil } from "@/components/admin/modules/DashboardCentralInfantil";
import { DashboardMetricas } from "@/components/admin/modules/DashboardMetricas";

export const Route = createFileRoute("/perfil")({
  component: TelaPerfilUsuario,
});

type NewsDraft = Tables<"news_drafts">;
type NewsStatus = Database["public"]["Enums"]["news_status"];

function TelaPerfilUsuario() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkingAccess, setCheckingAccess] = useState(true);
  
  // Inicia direto na central infantil para garantir o foco!
  const [activeModule, setActiveModule] = useState<"noticias" | "criancas" | "metricas">("criancas");
  
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTopic, setFilterTopic] = useState<string>("all");

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/login" });
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
    },
  });

  const deleteNews = useMutation({
    mutationFn: deleteNewsDraft,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-news-drafts"] });
    },
  });

  const generateNews = useMutation({
    mutationFn: () => generateNewsDraftsNow(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-news-drafts"] });
    },
  });

  if (checkingAccess) {
    return (
      <SiteLayout>
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <p className="font-bold text-navy/60">Carregando painel unificado...</p>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* CABEÇALHO DO PERFIL */}
      <section className="px-6 py-16 bg-navy text-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-background/20 rounded-full border-2 border-gold flex items-center justify-center text-3xl select-none">
              👤
            </div>
            <div>
              <h1 className="font-display text-3xl font-black text-background">Foto ou avatar</h1>
              <p className="text-background/70 text-sm mt-1">
                Escolha uma foto ou avatar para personalizar seu perfil.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="bg-gold/20 border border-gold/30 text-gold text-xs font-black px-4 py-2 rounded-xl">
              ID GESTOR: TOR-2026-000020
            </span>
          </div>
        </div>
      </section>

      {/* CENTRAL INTEGRADA - CARD PRINCIPAL */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="p-8 bg-card border border-navy/5 rounded-3xl shadow-sm mb-8">
          <p className="text-xs uppercase tracking-[0.25em] font-black text-navy/40 mb-3">
            Administração · Torcida Social
          </p>
          <h2 className="font-display text-2xl font-black mb-2 text-navy">
            Painel Executivo
          </h2>
          <p className="text-navy/60 text-sm mb-6">
            Acesse rapidamente perguntas, notícias, arrecadações, núcleos sociais, torcedores cadastrados de inteligência e estratégia da plataforma.
          </p>

          {/* OS 4 BOTÕES LADO A LADO EXATAMENTE COMO VOCÊ SELECIONOU */}
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/admin" 
              className="bg-navy text-white font-black text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl hover:bg-opacity-90 transition-all text-center"
            >
              PAINEL ADMIN
            </Link>

            <button 
              type="button"
              onClick={() => setActiveModule("noticias")}
              className={`font-black text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all ${
                activeModule === "noticias" ? "bg-gold text-navy" : "bg-navy text-white hover:bg-opacity-90"
              }`}
            >
              GERENCIAR NOTÍCIAS
            </button>

            <Link 
              to="/" 
              className="bg-navy text-white font-black text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl hover:bg-opacity-90 transition-all text-center"
            >
              VER CENTRAL PÚBLICA
            </Link>

            {/* O QUARTO BOTÃO ESSENCIAL INTEGRADO DA CENTRAL INFANTIL */}
            <button
              type="button"
              onClick={() => setActiveModule("criancas")}
              className={`font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md ${
                activeModule === "criancas" 
                  ? "bg-gold text-navy ring-4 ring-gold/20" 
                  : "bg-navy text-white hover:bg-opacity-90"
              }`}
            >
              🧒 CENTRAL INFANTIL
            </button>
          </div>
        </div>

        {/* CONTAINER DINÂMICO - EXIBE O CONTEÚDO SELECIONADO PELOS BOTÕES */}
        <div className="bg-card border border-navy/5 rounded-3xl p-2 min-h-[400px]">
          
          {/* ABA 1: CENTRAL INFANTIL */}
          {activeModule === "criancas" && (
            <div className="p-4 animate-fadeIn">
              <div className="mb-6 border-b border-navy/5 pb-4">
                <h3 className="text-xl font-display font-black text-navy">🧒 Central Infantil de Inteligência</h3>
                <p className="text-slate-500 text-sm">Controle de saúde, restrições médicas e laudos neuro-inclusivos.</p>
              </div>
              <DashboardCentralInfantil />
            </div>
          )}

          {/* ABA 2: HUB DE NOTÍCIAS */}
          {activeModule === "noticias" && (
            <div className="p-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-navy/5 pb-5 mb-5">
                <h3 className="font-display text-xl font-black text-navy">Rascunhos e Coleta Automática</h3>
                <button
                  type="button"
                  onClick={() => generateNews.mutate()}
                  disabled={generateNews.isPending}
                  className="bg-navy text-white px-5 py-3 rounded-xl font-black text-sm hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {generateNews.isPending ? "Coletando..." : "Coletar notícias agora"}
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mb-5">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-card border border-navy/10 rounded-lg px-3 py-2 text-xs font-bold text-navy"
                >
                  <option value="all">Todos os Status</option>
                  <option value="draft">Rascunhos</option>
                  <option value="approved">Aprovados</option>
                  <option value="published">Publicados</option>
                </select>

                <select
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                  className="bg-card border border-navy/10 rounded-lg px-3 py-2 text-xs font-bold text-navy"
                >
                  <option value="all">Todas as Categorias</option>
                  {NEWS_TOPICS.map((topic) => (
                    <option key={topic} value={topic}>{NEWS_TOPIC_LABELS[topic]}</option>
                  ))}
                </select>
              </div>

              {isLoadingNews ? (
                <p className="text-sm font-bold text-navy/60">Carregando dados das publicações...</p>
              ) : filteredNews.length === 0 ? (
                <p className="text-sm text-navy/60">Nenhum rascunho em triagem.</p>
              ) : (
                <div className="grid gap-5">
                  {filteredNews.map((item) => (
                    <div key={item.id} className="bg-surface border border-navy/5 rounded-3xl p-5 grid lg:grid-cols-[220px_1fr] gap-5">
                      <div>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover rounded-2xl" />
                        ) : (
                          <div className="w-full h-32 rounded-2xl bg-navy/10 grid place-items-center text-xs font-bold text-navy/50">Sem imagem</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-black text-navy">{item.title}</h4>
                        <p className="text-sm text-navy/70 mt-1">{item.summary}</p>
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => reviewNews.mutate({ id: item.id, status: "approved" })} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Aprovar</button>
                          <button onClick={() => reviewNews.mutate({ id: item.id, status: "published" })} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Publicar</button>
                          <button onClick={() => { if (confirm("Excluir?")) deleteNews.mutate(item.id); }} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Apagar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA 3: MÉTRICAS ESTRATÉGICAS */}
          {activeModule === "metricas" && (
            <div className="p-4 animate-fadeIn">
              <DashboardMetricas />
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

async function fetchNewsDrafts() {
  const { data, error } = await supabase
    .from("news_drafts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return data || [];
}

async function updateNewsStatus({ id, status }: { id: string; status: NewsStatus }) {
  const updateData: { status: NewsStatus; published_at?: string } = { status };
  if (status === "published") updateData.published_at = new Date().toISOString();
  const { error } = await supabase.from("news_drafts").update(updateData).eq("id", id);
  if (error) throw error;
}

async function deleteNewsDraft(id: string) {
  const { error } = await supabase.from("news_drafts").delete().eq("id", id);
  if (error) throw error;
}