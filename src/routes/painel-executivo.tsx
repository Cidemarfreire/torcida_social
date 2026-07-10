import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { DashboardHome } from "@/components/admin/DashboardHome";
import { DashboardCadastros } from "@/components/admin/modules/DashboardCadastros";
import { DashboardLayout } from "@/components/admin/DashboardLayout";
import {
  DashboardSidebar,
  type DashboardSection,
} from "@/components/admin/DashboardSidebar";

export const Route = createFileRoute("/painel-executivo")({
  component: PainelExecutivo,
  head: () => ({
    meta: [
      { title: "Painel Executivo — Torcida Social" },
      {
        name: "description",
        content: "Painel administrativo do ecossistema Torcida Social.",
      },
    ],
  }),
});

function PainelExecutivo() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("home");

  return (
    <DashboardLayout>
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[320px_1fr] gap-8">
        <DashboardSidebar
          activeSection={activeSection}
          onChangeSection={setActiveSection}
        />

        <section>
          {activeSection === "home" && (
            <DashboardHome
              onOpenCadastros={() => setActiveSection("cadastros")}
              onOpenCriancas={() => setActiveSection("criancas")}
              onOpenNoticias={() => setActiveSection("noticias")}
              onOpenMetricas={() => setActiveSection("metricas")}
            />
          )}
{activeSection === "cadastros" && <DashboardCadastros />}

          {activeSection === "criancas" && (
            <PlaceholderModule
              eyebrow="Central Infantil"
              title="👶 Controle de Crianças"
              description="Aqui entraremos com dados da criança, responsável, WhatsApp, saúde, medicamentos, horários, alergias e observações."
            />
          )}

          {activeSection === "noticias" && (
            <PlaceholderModule
              eyebrow="Central de Notícias"
              title="📰 Redação Administrativa"
              description="Aqui entraremos com coleta, aprovação, publicação, rejeição e exclusão de notícias."
            />
          )}

          {activeSection === "metricas" && (
            <PlaceholderModule
              eyebrow="Insights"
              title="📊 Métricas e Indicadores"
              description="Aqui entraremos com visitas, cadastros, instalações PWA, crianças cadastradas e crescimento do projeto."
            />
          )}

          {activeSection === "doacoes" && (
            <PlaceholderModule
              eyebrow="Doações"
              title="❤️ Gestão de Doações"
              description="Aqui entraremos com acompanhamento de doadores, contribuições, campanhas e impacto social."
            />
          )}

          {activeSection === "parceiros" && (
            <PlaceholderModule
              eyebrow="Parceiros"
              title="🤝 Empresas e Instituições"
              description="Aqui entraremos com parceiros, padrinhos, apoiadores, escolas, clubes e instituições."
            />
          )}

          {activeSection === "configuracoes" && (
            <PlaceholderModule
              eyebrow="Configurações"
              title="⚙️ Ajustes do Sistema"
              description="Aqui entraremos com configurações administrativas, módulos, permissões e integrações."
            />
          )}
        </section>
      </main>
    </DashboardLayout>
  );
}

function PlaceholderModule({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-navy/10 rounded-3xl p-8 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-action">
        {eyebrow}
      </p>

      <h2 className="font-display text-3xl font-black text-navy mt-2">
        {title}
      </h2>

      <p className="text-navy/60 mt-3 max-w-3xl">{description}</p>
    </div>
  );
}