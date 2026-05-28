import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/arquibancada")({
  component: AdminArquibancadaPage,
});

function AdminArquibancadaPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
          Administração
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Moderação da Arquibancada Digital
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Aqui serão exibidas as mensagens pendentes para aprovação, recusa,
          destaque ou exclusão.
        </p>

        <div className="mt-10 rounded-3xl border border-yellow-400/20 bg-white/10 p-6">
          <h2 className="text-2xl font-black text-yellow-400">
            Painel em construção
          </h2>

          <p className="mt-3 text-slate-300">
            Próximo passo: conectar este painel à tabela torcida_mural do
            Supabase.
          </p>
        </div>
      </div>
    </main>
  );
}