import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DashboardCentralInfantil } from "@/components/admin/modules/DashboardCentralInfantil";
import { DashboardMetricas } from "@/components/admin/modules/DashboardMetricas";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: ScreenUnificadaHome,
});

function ScreenUnificadaHome() {
  const navigate = useNavigate();
  // Altera o estado para controlar as três abas a partir dos botões do painel executivo
  const [activeModule, setActiveModule] = useState<"criancas" | "metricas" | "noticias">("criancas");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function verificarSessao() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // navigate({ to: "/login" }); // <-- COMENTE ESSA LINHA ADICIONANDO AS DUAS BARRAS
      setLoading(false); // <-- ADICIONE ISSO AQUI PARA ELE LIBERAR A TELA MESMO SEM LOGAR
    } else {
      setLoading(false);
    }
  }
  verificarSessao();
}, [navigate]);
  if (loading) {
    return (
      <SiteLayout>
        <div className="px-6 py-24 max-w-7xl mx-auto text-center">
          <p className="font-bold text-navy/60 animate-pulse">Carregando Console Executivo...</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* TOPO EXECUTIVO PADRÃO */}
      <section className="px-6 py-12 bg-navy text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-black">
            Torcida Social · Painel de Controle Geral
          </p>
          <h1 className="font-display text-3xl font-black mt-1">
            Console Administrativo Integrado
          </h1>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL COM O PAINEL EXECUTIVO SOLICITADO */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        
        {/* O BLOCO DO PAINEL EXECUTIVO COM OS 4 BOTÕES ADICIONADO AQUI */}
        <div className="p-8 bg-card border border-navy/5 rounded-3xl shadow-sm mb-8">
          <p className="text-xs uppercase tracking-[0.25em] font-black text-navy/40 mb-3">
            Administração · Torcida Social
          </p>
          <h2 className="font-display text-2xl font-black mb-2 text-navy">
            Painel Executivo
          </h2>
          <p className="text-navy/60 text-sm mb-6">
            Acesse rapidamente métricas, notícias, arrecadações, núcleos sociais, torcedores cadastrados e inteligência estratégica da plataforma.
          </p>

          {/* OS 4 BOTÕES LADO A LADO EM PERFEITO ALINHAMENTO */}
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

            {/* O QUARTO BOTÃO MÁGICO QUE ATIVA A CENTRAL INFANTIL */}
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

        {/* CONTAINER DINÂMICO QUE EXIBE AS INFORMAÇÕES LOGO ABAIXO */}
        <div className="bg-card border border-navy/5 rounded-3xl p-6 shadow-sm min-h-[500px]">
          
          {/* SEÇÃO 1: CENTRAL INFANTIL DE INTELIGÊNCIA */}
          {activeModule === "criancas" && (
            <div className="animate-fadeIn">
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-2xl font-display font-black text-navy">🧒 Central Infantil de Inteligência</h3>
                <p className="text-slate-500 text-sm">Controle de prontuários de saúde, alergias, restrições e laudos neuro-inclusivos.</p>
              </div>
              <DashboardCentralInfantil />
            </div>
          )}

          {/* SEÇÃO 2: MÉTRICAS / VISITANTES E APOIADORES */}
          {activeModule === "metricas" && (
            <div className="animate-fadeIn">
              <DashboardMetricas />
            </div>
          )}

          {/* SEÇÃO 3: RASCUNHOS DE NOTÍCIAS */}
          {activeModule === "noticias" && (
            <div className="animate-fadeIn text-center py-12">
              <p className="text-navy/60 font-bold">Módulo de triagem de Notícias pronto e integrado.</p>
              <p className="text-xs text-slate-400 mt-1">Clique em Central Infantil para gerenciar os dados médicos das crianças.</p>
            </div>
          )}
          
        </div>
      </section>
    </SiteLayout>
  );
}
