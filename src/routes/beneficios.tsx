import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ShareButton } from "@/components/ShareButton";
import { BENEFITS } from "@/lib/mock-data";

export const Route = createFileRoute("/beneficios")({
  component: Beneficios,
  head: () => ({ meta: [
    { title: "Benefícios — Torcida Social" },
    { name: "description", content: "Descontos e benefícios exclusivos para crianças e famílias cadastradas na Torcida Social." },
  ]}),
});

function Beneficios() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Benefícios"
        title={<>Vantagens para quem <span className="text-gold">torce junto.</span></>}
        subtitle="Descontos em farmácias, cinemas, teatros, cursos e alimentação. Validação via QR Code da carteirinha."
      >
        <div className="mt-6 inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-navy text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          Diversos acordos em andamento — atualização em breve
        </div>
      </PageHero>

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="bg-card border border-navy/5 rounded-3xl p-10 md:p-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex size-16 rounded-2xl bg-action/10 text-action items-center justify-center text-3xl mb-5">🤝</div>
          <h2 className="font-display text-2xl md:text-3xl font-black text-navy">Estamos costurando parcerias</h2>
          <p className="text-navy/60 mt-4 leading-relaxed">
            Em breve, esta página trará os descontos e benefícios exclusivos para crianças, famílias e torcedores cadastrados.
            Diversos acordos com farmácias, cinemas, teatros, cursos e restaurantes estão em fase final de negociação.
          </p>
          <p className="text-xs uppercase tracking-widest text-navy/40 mt-6 font-bold">Volte em breve</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b) => (
            <article key={b.partner} className="bg-card/40 border border-dashed border-navy/15 rounded-2xl p-6 flex items-center gap-5 opacity-60">
              <div className="size-16 rounded-2xl bg-navy/5 text-navy/40 grid place-items-center font-display font-black text-xl">
                {b.partner.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">{b.type} · {b.city}</p>
                <h3 className="font-display font-black text-lg mt-1 truncate text-navy/60">{b.partner}</h3>
                <p className="text-navy/40 font-bold text-xs mt-1 uppercase tracking-widest">Em breve</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SHARE BUTTON */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex justify-end">
          <ShareButton />
        </div>
      </section>
    </SiteLayout>
  );
}
