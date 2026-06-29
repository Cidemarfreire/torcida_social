import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { DashboardMetricas } from "@/components/admin/modules/DashboardMetricas";
import { SiteLayout } from "@/components/site/SiteLayout";

type ActiveSection = "home" | "cadastros" | "noticias" | "metricas" | "criancas";

export const Route = createFileRoute("/painel-executivo")({
  component: PainelExecutivo,
});

function PainelExecutivo() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");

  return (
    <SiteLayout>
      <section className="px-6 py-16 bg-navy text-background">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
            Torcida Social
          </p>

          <h1 className="font-display text-4xl md:text-5xl font-black mt-3">
            Painel Executivo
          </h1>

          <p className="text-background/80 mt-3 max-w-2xl">
            Área administrativa segura para gestão do ecossistema Torcida Social.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/perfil"
              className="bg-background/10 border border-background/20 text-background px-5 py-3 rounded-xl font-black text-xs hover:bg-background/20"
            >
              ← Voltar ao perfil
            </Link>

            <button
              type="button"
              onClick={() => setActiveSection("home")}
              className={`px-5 py-3 rounded-xl font-black text-xs border ${
                activeSection === "home"
                  ? "bg-gold text-navy border-gold"
                  : "bg-background/10 border-background/20 text-background"
              }`}
            >
              🏠 Visão Geral
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("cadastros")}
              className={`px-5 py-3 rounded-xl font-black text-xs border ${
                activeSection === "cadastros"
                  ? "bg-gold text-navy border-gold"
                  : "bg-background/10 border-background/20 text-background"
              }`}
            >
              👥 Cadastros
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("noticias")}
              className={`px-5 py-3 rounded-xl font-black text-xs border ${
                activeSection === "noticias"
                  ? "bg-gold text-navy border-gold"
                  : "bg-background/10 border-background/20 text-background"
              }`}
            >
              📰 Notícias
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("metricas")}
              className={`px-5 py-3 rounded-xl font-black text-xs border ${
                activeSection === "metricas"
                  ? "bg-gold text-navy border-gold"
                  : "bg-background/10 border-background/20 text-background"
              }`}
            >
              📊 Métricas
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("criancas")}
              className={`px-5 py-3 rounded-xl font-black text-xs border ${
                activeSection === "criancas"
                  ? "bg-gold text-navy border-gold"
                  : "bg-background/10 border-background/20 text-background"
              }`}
            >
              👶 Central Infantil
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 max-w-7xl mx-auto">
        {activeSection === "home" && (
          <div className="bg-card border border-navy/10 rounded-3xl p-8 shadow-sm">
            <h2 className="font-display text-2xl font-black text-navy">
              Painel carregado com segurança
            </h2>
            <p className="text-navy/60 mt-2">
              Agora vamos adicionar cada módulo sem quebrar a página. Começamos
              pelas métricas com dados seguros e depois conectaremos ao Supabase.
            </p>
          </div>
        )}

        {activeSection === "cadastros" && (
          <PlaceholderModule
            title="👥 Cadastro Geral"
            description="Aqui entraremos com a gestão completa de usuários, permissões, filtros e edição de cadastros."
          />
        )}

        {activeSection === "noticias" && (
          <PlaceholderModule
            title="📰 Central de Notícias"
            description="Aqui entraremos com coleta, aprovação, publicação, rejeição e exclusão de notícias."
          />
        )}

        {activeSection === "metricas" && <DashboardMetricas />}

        {activeSection === "criancas" && (
          <PlaceholderModule
            title="👶 Central Infantil"
            description="Aqui entraremos com prontuários, responsáveis, WhatsApp, saúde, medicamentos, horários e observações."
          />
        )}
      </section>
    </SiteLayout>
  );
}

function PlaceholderModule({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-navy/10 rounded-3xl p-8 shadow-sm">
      <h2 className="font-display text-2xl font-black text-navy">{title}</h2>
      <p className="text-navy/60 mt-2">{description}</p>
    </div>
  );
}