import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ClubBadge } from "@/components/site/ClubBadge";
import { RANKING, SERIE_A_CLUBS, formatBRL, formatInt } from "@/lib/mock-data";

export const Route = createFileRoute("/ranking")({
  component: Ranking,
  head: () => ({
    meta: [
      { title: "Liga da Solidariedade — Ranking das Torcidas" },
      { name: "description", content: "Veja o ranking ao vivo dos 20 clubes da Série A na Liga da Solidariedade da Torcida Social." },
    ],
  }),
});

function Ranking() {
  const max = RANKING[0].raised;
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Liga da Solidariedade"
        title={<>O placar que <span className="text-action">muda vidas</span>.</>}
        subtitle="Ranking ao vivo dos 20 clubes da Série A. Cada doação e cada cadastro soma pontos para o seu clube do coração."
      >
        <div className="flex flex-wrap gap-2 mt-6">
          <span className="bg-success text-background px-4 py-2 rounded-lg text-xs font-bold">AO VIVO</span>
          <span className="bg-surface border border-navy/10 px-4 py-2 rounded-lg text-xs font-bold">Mês atual</span>
          <span className="bg-surface border border-navy/10 px-4 py-2 rounded-lg text-xs font-bold">Todo o histórico</span>
        </div>
      </PageHero>

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="bg-card border border-navy/5 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_120px_120px] md:grid-cols-[60px_1fr_1fr_150px_180px] gap-4 px-6 py-4 border-b border-navy/5 text-[11px] font-bold uppercase tracking-widest text-navy/50">
            <span>Pos.</span>
            <span>Clube</span>
            <span className="hidden md:block">Cidade</span>
            <span className="text-right">Doadores</span>
            <span className="text-right">Arrecadado</span>
          </div>
          {RANKING.map((row, i) => {
            const club = SERIE_A_CLUBS.find((c) => c.id === row.clubId)!;
            const pct = (row.raised / max) * 100;
            return (
              <div key={club.id} className="relative">
                <div
                  className="absolute inset-y-0 left-0 bg-action/[0.04]"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative grid grid-cols-[60px_1fr_120px_120px] md:grid-cols-[60px_1fr_1fr_150px_180px] gap-4 px-6 py-4 items-center border-b border-navy/5 hover:bg-surface transition-colors">
                  <span className="font-display font-black text-lg">{i + 1}º</span>
                  <div className="flex items-center gap-3 min-w-0">
                    <ClubBadge club={club} size={36} />
                    <span className="font-bold truncate">{club.name}</span>
                  </div>
                  <span className="hidden md:block text-sm text-navy/60">{row.city}</span>
                  <span className="text-right text-sm font-bold">{formatInt(row.donors)}</span>
                  <span className="text-right font-display font-black text-action">{formatBRL(row.raised)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
