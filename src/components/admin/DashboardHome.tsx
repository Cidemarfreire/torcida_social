type DashboardHomeProps = {
  onOpenCadastros: () => void;
  onOpenCriancas: () => void;
  onOpenMetricas: () => void;
};

const quickCards = [
  {
    title: "Cadastros",
    value: "Gestão geral",
    description: "Visualize e edite usuários cadastrados.",
    icon: "👥",
  },
  {
    title: "Central Infantil",
    value: "Prontuários",
    description: "Controle de crianças, responsáveis e cuidados especiais.",
    icon: "👶",
  },
  {
    title: "Métricas",
    value: "Insights",
    description: "Acompanhe visitas, cadastros e crescimento.",
    icon: "📊",
  },
];

export function DashboardHome({
  onOpenCadastros,
  onOpenCriancas,
  onOpenMetricas,
}: DashboardHomeProps) {
  const actions = [
    onOpenCadastros,
    onOpenCriancas,
    onOpenMetricas,
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white border border-navy/10 rounded-3xl p-8 shadow-sm">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-action">
          Visão Geral
        </p>

        <h2 className="font-display text-3xl font-black text-navy mt-2">
          Central Administrativa Torcida Social
        </h2>

        <p className="text-navy/60 mt-3 max-w-3xl">
          Este painel foi estruturado para administrar usuários, crianças,
          métricas, parceiros, doações e configurações do ecossistema
          Torcida Social em um único ambiente.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {quickCards.map((card, index) => (
          <button
            key={card.title}
            type="button"
            onClick={actions[index]}
            className="bg-white border border-navy/10 rounded-3xl p-6 shadow-sm text-left hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="text-4xl">{card.icon}</div>

            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-navy/40 mt-5">
              {card.title}
            </p>

            <h3 className="font-display text-2xl font-black text-navy mt-1">
              {card.value}
            </h3>

            <p className="text-sm text-navy/60 mt-2">{card.description}</p>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-navy to-action text-white rounded-3xl p-8 shadow-lg">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gold">
          Próxima fase
        </p>

        <h3 className="font-display text-2xl font-black mt-2">
          Agora vamos conectar dados reais com segurança.
        </h3>

        <p className="text-white/75 mt-2 max-w-3xl">
          A estrutura visual está separada do perfil do usuário. Isso permite
          evoluir cada módulo administrativo sem derrubar a área de perfil.
        </p>
      </div>
    </div>
  );
}