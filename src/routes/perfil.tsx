import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ClubBadge } from "@/components/site/ClubBadge";
import { SERIE_A_CLUBS, ME, ACHIEVEMENTS } from "@/lib/mock-data";

export const Route = createFileRoute("/perfil")({
  component: Perfil,
  head: () => ({ meta: [{ title: "Meu Perfil — Torcida Social" }, { name: "description", content: "Seu perfil de torcedor solidário." }] }),
});

function Perfil() {
  const club = SERIE_A_CLUBS.find((c) => c.id === ME.clubId)!;
  return (
    <SiteLayout>
      <section
        className="px-6 pt-16 pb-32 text-background relative"
        style={{ background: `linear-gradient(135deg, ${club.primary} 0%, ${club.secondary} 100%)` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="size-28 rounded-3xl bg-background/15 backdrop-blur grid place-items-center text-5xl font-display font-black">
            LA
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-80">Torcedor desde {ME.since}</p>
            <h1 className="font-display text-4xl md:text-5xl font-black mt-2">{ME.name}</h1>
            <p className="opacity-80 mt-1">{ME.city}</p>
          </div>
          <div className="flex items-center gap-3 bg-background/10 backdrop-blur rounded-2xl p-4 px-6">
            <ClubBadge club={club} size={48} />
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Time</p>
              <p className="font-display text-xl font-black">{club.name}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 -mt-20 mb-16 max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {[
          { label: "Posição no ranking", value: `#${ME.rank}` },
          { label: "Pontos totais", value: ME.points.toLocaleString("pt-BR") },
          { label: "Doações realizadas", value: 12 },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-navy/5 rounded-2xl p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">{s.label}</p>
            <p className="font-display text-3xl font-black mt-1 text-navy">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="px-6 max-w-7xl mx-auto">
        <PageHero eyebrow="Conquistas" title="Suas medalhas." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-8">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.id} className={`rounded-2xl p-5 text-center border ${a.unlocked ? "bg-gold/10 border-gold/30" : "bg-surface border-navy/5 opacity-50"}`}>
              <div className={`size-14 mx-auto rounded-full grid place-items-center text-2xl ${a.unlocked ? "bg-gold text-navy" : "bg-navy/10"}`}>
                🏅
              </div>
              <p className="font-display font-black mt-3">{a.title}</p>
              <p className="text-xs text-navy/60 mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
