import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ME } from "@/lib/mock-data";

export const Route = createFileRoute("/meu-impacto")({
  component: MeuImpacto,
  head: () => ({ meta: [
    { title: "Meu Impacto — Torcida Social" },
    { name: "description", content: "Acompanhe o impacto social das suas doações na Torcida Social." },
  ]}),
});

function MeuImpacto() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Meu Impacto"
        title={<>Sua torcida vai <span className="text-action">mudar vidas</span>.</>}
        subtitle={`${ME.name}, acompanhe aqui o resultado real da sua participação.`}
      />

      <section className="px-6 py-16 max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Doações realizadas", color: "text-action" },
          { label: "Total doado", color: "text-success" },
          { label: "Crianças impactadas", color: "text-gold" },
          { label: "Núcleos beneficiados", color: "text-navy" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-navy/5 rounded-3xl p-7">
            <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">{s.label}</p>
            <p className={`font-display text-4xl font-black mt-2 ${s.color}`}>—</p>
          </div>
        ))}
      </section>

      <section className="px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
        <Detail icon="📚" label="Materiais escolares financiados" />
        <Detail icon="🎓" label="Bolsas de cursos apoiadas" />
        <Detail icon="🍽️" label="Refeições oferecidas" />
      </section>

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="bg-navy text-background rounded-3xl p-10 md:p-14 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Certificado Digital</p>
            <h2 className="font-display text-3xl md:text-4xl font-black mt-2 uppercase italic">Sua solidariedade tem nome.</h2>
            <p className="text-background/70 mt-3">Gere um certificado personalizado para compartilhar nas suas redes.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="w-full sm:w-auto bg-gold text-navy px-6 py-4 rounded-xl font-black">Gerar certificado</button>
            <button className="w-full sm:w-auto border-2 border-background/20 px-6 py-4 rounded-xl font-bold">Compartilhar impacto</button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Detail({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="bg-surface border border-navy/5 rounded-2xl p-6 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="font-display text-2xl font-black">—</p>
        <p className="text-xs text-navy/60">{label}</p>
      </div>
    </div>
  );
}
