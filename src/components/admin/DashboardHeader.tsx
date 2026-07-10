export function DashboardHeader() {
  const avatarUrl = "";
  const initials = "CF";

  return (
    <header className="bg-gradient-to-r from-navy via-[#16375e] to-action text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <p className="uppercase tracking-[0.25em] text-gold text-xs font-black">
            Torcida Social
          </p>

          <h1 className="font-display text-4xl font-black mt-2">
            Painel Executivo
          </h1>

          <p className="text-white/80 mt-2">
            Centro de comando do ecossistema Torcida Social.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Cidemar Freire"
              className="h-12 w-12 rounded-full object-cover border-2 border-white/30 shadow-md"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gold text-navy flex items-center justify-center font-black text-lg shadow-md">
              {initials}
            </div>
          )}

          <div>
            <p className="text-sm font-black text-white">
              Cidemar Freire
            </p>

            <p className="text-xs text-white/70">
              Fundador • Administrador Geral
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}