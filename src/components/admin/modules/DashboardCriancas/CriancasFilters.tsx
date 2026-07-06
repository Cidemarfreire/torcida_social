const filters = [
  "Todos",
  "Ativos",
  "Pendentes",
  "Inativos",
  "Teresópolis",
  "Campo Grande",
  "Com cuidado especial",
];

export function CriancasFilters() {
  return (
    <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-navy/40 mb-4">
        Filtros rápidos
      </p>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              index === 0
                ? "bg-navy text-white"
                : "bg-surface text-navy hover:bg-navy/5"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}