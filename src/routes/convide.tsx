import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ME } from "@/lib/mock-data";

export const Route = createFileRoute("/convide")({
  component: Convide,
  head: () => ({ meta: [
    { title: "Convide sua Torcida — Torcida Social" },
    { name: "description", content: "Compartilhe seu link único e leve mais torcedores para a maior torcida solidária do Brasil." },
  ]}),
});

const link = "torcidasocial.org/t/lucas-andrade";

function Convide() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Convide sua Torcida"
        title={<>Leve seu time <span className="text-gold">ao topo</span>.</>}
        subtitle="Cada amigo cadastrado vira ponto no seu placar. Cada doação validada vira medalha."
      />

      <section className="px-6 py-16 max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="bg-card border border-navy/5 rounded-3xl p-8 md:p-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">Seu link exclusivo</p>
          <div className="mt-3 flex flex-col md:flex-row gap-3">
            <code className="flex-1 bg-surface border-2 border-navy/10 rounded-xl px-4 py-4 font-mono text-sm break-all">{link}</code>
            <button className="bg-navy text-background px-6 py-4 rounded-xl font-bold">Copiar</button>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-3">
            {[
              { name: "WhatsApp", color: "bg-success" },
              { name: "Instagram", color: "bg-action" },
              { name: "Facebook", color: "bg-navy" },
            ].map((s) => (
              <button key={s.name} className={`${s.color} text-background py-4 rounded-xl font-bold`}>
                Compartilhar no {s.name}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { goal: "Convide 3 amigos", progress: 2, of: 3, prize: "+200 pts" },
              { goal: "5 doações validadas", progress: 3, of: 5, prize: "Badge Capitão" },
              { goal: "Leve seu time ao top 10", progress: 1, of: 1, prize: "Selo Lenda" },
            ].map((g) => (
              <div key={g.goal} className="bg-surface border border-navy/5 rounded-2xl p-5">
                <p className="text-xs font-bold text-navy/60">{g.goal}</p>
                <div className="h-2 bg-navy/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-success" style={{ width: `${(g.progress / g.of) * 100}%` }} />
                </div>
                <p className="text-[11px] mt-2 font-bold text-action">{g.prize}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-navy text-background rounded-3xl p-7 sticky top-28 h-fit">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gold">QR Code do {ME.name}</p>
          <div className="mt-4 aspect-square bg-background rounded-2xl p-6 grid place-items-center">
            <div className="grid grid-cols-10 gap-0.5 w-full">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className={(i * 13) % 5 < 2 ? "aspect-square bg-navy" : "aspect-square bg-background"} />
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-background/60 mt-4">Mostre, escaneie, convide.</p>
        </aside>
      </section>
    </SiteLayout>
  );
}
