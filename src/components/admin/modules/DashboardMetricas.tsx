const metrics = [
  {
    icon: "👥",
    title: "Usuários",
    value: "0",
    description: "Cadastros gerais da plataforma",
  },
  {
    icon: "👶",
    title: "Crianças",
    value: "0",
    description: "Participantes cadastrados",
  },
  {
    icon: "📰",
    title: "Notícias",
    value: "0",
    description: "Publicações realizadas",
  },
  {
    icon: "📊",
    title: "Visitas",
    value: "0",
    description: "Acessos registrados",
  },
];

export function DashboardMetricas() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-8">
        <p className="text-xs uppercase tracking-[0.25em] font-black text-action">
          Dashboard
        </p>

        <h2 className="font-display text-4xl font-black text-navy mt-2">
          📊 Métricas Gerais
        </h2>

        <p className="text-navy/60 mt-3 max-w-3xl">
          Esta área apresentará todos os indicadores estratégicos do Torcida
          Social em tempo real.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-3xl border border-navy/10 shadow-sm p-7"
          >
            <div className="text-5xl">{item.icon}</div>

            <p className="uppercase tracking-widest text-[10px] font-black text-navy/40 mt-5">
              {item.title}
            </p>

            <h3 className="font-display text-5xl font-black text-navy mt-2">
              {item.value}
            </h3>

            <p className="text-sm text-navy/60 mt-3">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-navy to-action rounded-3xl p-8 text-white shadow-xl">
        <h3 className="font-display text-2xl font-black">
          Próxima etapa
        </h3>

        <p className="text-white/75 mt-3">
          Os valores acima ainda são simulados. Na próxima fase eles serão
          alimentados automaticamente pelo Supabase, mostrando usuários,
          crianças, notícias, visitas, instalações do PWA, parceiros, doações
          e diversos indicadores em tempo real.
        </p>
      </div>
    </div>
  );
}