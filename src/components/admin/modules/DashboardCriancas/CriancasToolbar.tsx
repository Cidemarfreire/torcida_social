type CriancasToolbarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export function CriancasToolbar({
  searchTerm,
  onSearchChange,
}: CriancasToolbarProps) {
  return (
    <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-navy/40">
            Busca rápida
          </p>
          <h3 className="font-display text-2xl font-black text-navy mt-1">
            Localizar criança
          </h3>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nome, núcleo, responsável ou WhatsApp..."
          className="w-full lg:max-w-xl rounded-2xl border border-navy/10 px-5 py-3 text-sm outline-none focus:border-action"
        />
      </div>
    </div>
  );
}