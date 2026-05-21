import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/doacoes/obrigado")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: Obrigado,
  head: () => ({ meta: [{ title: "Obrigado pela sua doação — Torcida Social" }] }),
});

function Obrigado() {
  const { session_id } = Route.useSearch();
  return (
    <SiteLayout>
      <section className="px-6 py-24 max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-6">💚</div>
        <h1 className="font-display text-4xl md:text-5xl font-black text-navy">
          Sua torcida alimentou sonhos.
        </h1>
        <p className="text-navy/60 mt-5 leading-relaxed">
          {session_id
            ? "Recebemos sua doação. O comprovante será enviado para seu e-mail."
            : "Obrigado por torcer junto com a gente."}
        </p>
        <Link
          to="/doacoes"
          className="inline-block mt-10 bg-action text-background px-8 py-4 rounded-xl font-black hover:bg-navy transition-colors"
        >
          Voltar
        </Link>
      </section>
    </SiteLayout>
  );
}
