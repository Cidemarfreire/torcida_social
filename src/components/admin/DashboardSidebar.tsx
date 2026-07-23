type DashboardSection =
  | "home"
  | "cadastros"
  | "criancas"
    | "metricas"
  | "doacoes"
  | "parceiros"
  | "configuracoes";

type DashboardSidebarProps = {
  activeSection: DashboardSection;
  onChangeSection: (section: DashboardSection) => void;
};

const menuItems: Array<{
  id: DashboardSection;
  label: string;
  description: string;
}> = [
  {
    id: "home",
    label: "🏠 Visão Geral",
    description: "Resumo executivo",
  },
  {
    id: "cadastros",
    label: "👥 Cadastros",
    description: "Usuários e administradores",
  },
  {
    id: "criancas",
    label: "👶 Central Infantil",
    description: "Crianças e responsáveis",
  },
  {
    id: "noticias",
    label: "📰 Notícias",
    description: "Coleta, aprovação e publicação",
  },
    {
    id: "doacoes",
    label: "❤️ Doações",
    description: "Apoios e contribuições",
  },
  {
    id: "parceiros",
    label: "🤝 Parceiros",
    description: "Empresas e instituições",
  },
  {
    id: "configuracoes",
    label: "⚙️ Configurações",
    description: "Ajustes do sistema",
  },
];

export function DashboardSidebar({
  activeSection,
  onChangeSection,
}: DashboardSidebarProps) {
  return (
    <aside className="bg-white border border-navy/10 rounded-3xl shadow-sm p-4">
      <div className="mb-4 px-3">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-navy/40">
          Administração
        </p>
        <h2 className="font-display font-black text-xl text-navy mt-1">
          Módulos
        </h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeSection(item.id)}
              className={`w-full text-left rounded-2xl px-4 py-3 transition-all border ${
                isActive
                  ? "bg-navy text-white border-navy shadow-md"
                  : "bg-surface text-navy border-transparent hover:bg-navy/5"
              }`}
            >
              <span className="block font-black text-sm">{item.label}</span>
              <span
                className={`block text-xs mt-0.5 ${
                  isActive ? "text-white/70" : "text-navy/50"
                }`}
              >
                {item.description}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export type { DashboardSection };