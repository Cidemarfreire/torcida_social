import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ShareButton } from "@/components/ShareButton";
import { PARTNERS } from "@/lib/mock-data";

export const Route = createFileRoute("/parceiros")({
  component: Parceiros,
  head: () => ({ meta: [
    { title: "Parceiros — Torcida Social" },
    { name: "description", content: "Empresas, marcas e organizações que apoiam a Torcida Social." },
  ]}),
});

const TIER_COLORS: Record<string, string> = {
  Diamante: "from-action to-success text-background",
  Ouro: "from-gold to-gold/70 text-navy",
  Prata: "from-navy/20 to-navy/5 text-navy",
  Bronze: "from-orange-200 to-orange-100 text-navy",
};

function Parceiros() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Parceiros"
        title={<>Quem <span className="text-action">veste a camisa</span> com a gente.</>}
        subtitle="Marcas que entendem que ESG é mais do que relatório — é compromisso real com o futuro."
      />

      <section className="px-6 py-16 max-w-7xl mx-auto">
        {(["Diamante", "Ouro", "Prata", "Bronze"] as const).map((tier) => {
          const list = PARTNERS.filter((p) => p.tier === tier);
          if (!list.length) return null;
          return (
            <div key={tier} className="mb-12">
              <h2 className="font-display text-2xl font-black uppercase italic mb-5">Cota {tier}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {list.map((p) => (
                  <div key={p.name} className={`rounded-2xl p-7 text-center bg-gradient-to-br ${TIER_COLORS[tier]}`}>
                    <div className="size-16 mx-auto rounded-2xl bg-background grid place-items-center font-display font-black text-2xl overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="size-full object-contain p-1" />
                      ) : (
                        <span className="text-navy">{p.logo}</span>
                      )}
                    </div>
                    <p className="font-bold mt-4">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
