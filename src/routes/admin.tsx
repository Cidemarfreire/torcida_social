import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DashboardCentralInfantil } from "@/components/admin/modules/DashboardCentralInfantil";
import { DashboardMetricas } from "@/components/admin/modules/DashboardMetricas";

export const Route = createFileRoute("/admin")({
  component: ScreenPerfilAdministrativo,
});

function ScreenPerfilAdministrativo() {
  const [moduloAtivo, setModuloAtivo] = useState<"principal" | "infantil">("infantil"); // Inicia direto na Central Infantil!

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-50">
        {/* BARRA SUPERIOR UNIFICADA NO PERFIL */}
        <div className="bg-navy text-white p-8 border-b-4 border-gold shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-black tracking-widest text-gold uppercase">Painel do Gestor</span>
              <h1 className="text-3xl font-display font-black mt-1">Administração · Torcida Social</h1>
              <p className="text-sm text-white/70 mt-1">Central Unificada de Inteligência</p>
            </div>

            {/* BOTÕES OPERACIONAIS */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setModuloAtivo("principal")}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  moduloAtivo === "principal"
                    ? "bg-white text-navy font-black shadow"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                📊 Métricas Globais
              </button>

              <button
                onClick={() => setModuloAtivo("infantil")}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
                  moduloAtivo === "infantil"
                    ? "bg-gold text-navy font-black ring-4 ring-gold/30"
                    : "bg-yellow-500/10 text-gold hover:bg-yellow-500/20 border border-gold/30"
                }`}
              >
                🧒 Central Infantil e Saúde
              </button>
            </div>
          </div>
        </div>

        {/* ÁREA DE CONTEÚDO */}
        <div className="max-w-7xl mx-auto p-6">
          {moduloAtivo === "principal" ? (
            <div className="space-y-6 animate-fadeIn">
              <DashboardMetricas />
            </div>
          ) : (
            <div className="bg-white border-2 border-navy/10 rounded-3xl p-6 shadow-2xl animate-fadeIn">
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-display font-black text-navy">🧒 Central Infantil de Inteligência</h2>
                <p className="text-slate-500 text-sm">Monitoramento de saúde, alergias, restrições e laudos neuro-inclusivos.</p>
              </div>

              {/* Injeta o painel com toda a estrutura médica e de segurança das crianças */}
              <DashboardCentralInfantil />
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}