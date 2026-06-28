import { Link } from "@tanstack/react-router";

export function DashboardHeader() {
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

        <div className="flex gap-3 flex-wrap">
          <Link
            to="/perfil"
            className="bg-white/10 hover:bg-white/20 transition-all px-5 py-3 rounded-xl font-black text-sm"
          >
            ← Meu Perfil
          </Link>

          <Link
            to="/"
            className="bg-gold text-navy hover:brightness-110 transition-all px-5 py-3 rounded-xl font-black text-sm"
          >
            Site Público
          </Link>
        </div>
      </div>
    </header>
  );
}