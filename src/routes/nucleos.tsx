import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { NUCLEOS } from "@/lib/mock-data";

export const Route = createFileRoute("/nucleos")({
  component: Nucleos,
  head: () => ({ meta: [
    { title: "Núcleos & Expansão — Torcida Social no Rio de Janeiro" },
    { name: "description", content: "Núcleos em implantação em Teresópolis e Campo Grande (RJ), com expansão para Niterói, Nova Iguaçu e Itaguaí." },
    { property: "og:title", content: "Núcleos & Expansão — Torcida Social" },
    { property: "og:description", content: "Atuação em Teresópolis, Campo Grande, Niterói, Nova Iguaçu e Itaguaí." },
  ]}),
});

const STATUS_COLORS: Record<string, string> = {
  ativo: "bg-success text-background",
  implantando: "bg-gold text-navy",
  planejado: "bg-navy/10 text-navy/60",
};

function Nucleos() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Núcleos & Expansão"
        title={<>Do alto da Serra<br/>para todo o <span className="text-action">Brasil</span>.</>}
        subtitle="5 núcleos em implantação em Teresópolis e 3 em Campo Grande (RJ), expandindo para o Grande Rio."
      />

      <section className="px-6 py-16 max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-10">
        <div className="bg-navy rounded-3xl p-10 text-background min-h-[500px] relative overflow-hidden">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold mb-3">Mapa de atuação</p>
          <h2 className="font-display text-3xl font-black uppercase italic mb-8">Estado do Rio de Janeiro</h2>

          <div className="relative aspect-[4/3] bg-background/5 rounded-2xl border border-background/10">
            {/* Pseudo map markers */}
            {[
              { top: "30%", left: "55%", label: "Teresópolis", count: 5, status: "implantando" },
              { top: "62%", left: "30%", label: "Campo Grande (RJ)", count: 3, status: "implantando" },
              { top: "55%", left: "48%", label: "Niterói", count: 1, status: "implantando" },
              { top: "68%", left: "40%", label: "Nova Iguaçu", count: 1, status: "implantando" },
              { top: "75%", left: "22%", label: "Itaguaí", count: 1, status: "planejado" },
            ].map((m) => (
              <div key={m.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: m.top, left: m.left }}>
                <div className={`size-4 rounded-full ${m.status === "ativo" ? "bg-success" : m.status === "implantando" ? "bg-gold" : "bg-background/30"} ring-4 ring-background/10 animate-pulse`} />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background text-navy text-xs font-bold px-3 py-1.5 rounded-lg shadow">
                  {m.label} · {m.count}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-8 text-xs">
            <Legend color="bg-success" label="Ativo" />
            <Legend color="bg-gold" label="Implantando" />
            <Legend color="bg-background/30" label="Planejado" />
          </div>
        </div>

        <div className="space-y-3">
          {NUCLEOS.map((n) => (
            <div key={n.city} className="bg-card border border-navy/5 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="font-display font-black">{n.city}</p>
                <p className="text-xs text-navy/50 mt-1">{n.kids} crianças · {n.partners} parceiros</p>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${STATUS_COLORS[n.status]}`}>
                {n.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-background/70">
      <span className={`size-2.5 rounded-full ${color}`} /> {label}
    </div>
  );
}
