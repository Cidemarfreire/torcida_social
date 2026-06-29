import type { ChildStatus } from "./types";

export type ChildrenFilter = "all" | ChildStatus | "specialCare";

type Props = {
  activeFilter: ChildrenFilter;
  onChangeFilter: (filter: ChildrenFilter) => void;
};

const filters = [
  { label: "Todos", value: "all" as ChildrenFilter },
  { label: "Ativos", value: "active" as ChildrenFilter },
  { label: "Pendentes", value: "pending" as ChildrenFilter },
  { label: "Inativos", value: "inactive" as ChildrenFilter },
  { label: "Com cuidado especial", value: "specialCare" as ChildrenFilter },
];

export function CriancasFilters({
  activeFilter,
  onChangeFilter,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-navy/40 mb-4">
        Filtros rápidos
      </p>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const selected = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onChangeFilter(filter.value)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selected
                  ? "bg-gold text-navy"
                  : "bg-surface text-navy hover:bg-navy/5"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}