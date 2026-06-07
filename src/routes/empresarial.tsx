import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Gem, Award, BarChart3, MapPin, Smartphone, Megaphone, UserCheck, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ShareButton } from "@/components/ShareButton";
import { DonationCheckout } from "@/components/DonationCheckout";

const DIAMOND_PERKS = [
  { icon: Award, title: "Naming rights", desc: "Seu nome em projetos sociais de alto impacto." },
  { icon: Megaphone, title: "Destaque nacional", desc: "Sua marca no app e nas campanhas oficiais." },
  { icon: BarChart3, title: "Relatórios ESG exclusivos", desc: "Métricas auditáveis e dashboards dedicados." },
  { icon: MapPin, title: "Expansão estratégica", desc: "Participação na chegada a novas cidades." },
  { icon: Smartphone, title: "Espaço premium no app", desc: "Posicionamento de marca diferenciado." },
  { icon: Megaphone, title: "Campanhas institucionais", desc: "Produção co-criada com nosso time." },
  { icon: UserCheck, title: "Atendimento executivo", desc: "Gerente dedicado e contato direto C-level." },
];

export const Route = createFileRoute("/empresarial")({
  component: Empresarial,
  head: () => ({ meta: [
    { title: "Área Empresarial — Torcida Social" },
    { name: "description", content: "Cotas Bronze, Prata, Ouro e Diamante para empresas patrocinadoras com foco em ESG e responsabilidade social." },
  ]}),
});

type Tier = {
  tier: string;
  priceLabel: string;
  amountCents: number | null; // null = sob consulta
  perks: string[];
};

const TIERS: Tier[] = [
  { tier: "Bronze", priceLabel: "R$ 1.500/mês",  amountCents: 150_000,   perks: ["Logo no site", "Selo digital", "Relatório anual"] },
  { tier: "Prata",  priceLabel: "R$ 5.000/mês",  amountCents: 500_000,   perks: ["Tudo do Bronze", "Logo no app", "Relatório trimestral", "Post mensal"] },
  { tier: "Ouro",   priceLabel: "R$ 12.000/mês", amountCents: 1_200_000, perks: ["Tudo da Prata", "Vídeo institucional", "Espaço publicitário", "Visita aos núcleos"] },
];

const WHATSAPP_URL = "https://wa.me/5521970187813?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20equipe%20estrat%C3%A9gica%20da%20Cota%20Diamante.";

function Empresarial() {
  const [selected, setSelected] = useState<Tier | null>(null);
  const checkoutRef = useRef<HTMLElement | null>(null);

  const handleSelectTier = (tier: Tier) => {
    setSelected(tier);
    window.setTimeout(() => {
      checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Área Empresarial"
        title={<>ESG com impacto <span className="text-action">verdadeiro</span> e mensurável.</>}
        subtitle="Sua marca conectada à maior torcida solidária do Brasil. Métricas reais, relatórios auditáveis, certificados digitais."
      />

      <section className="px-6 py-16 max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
        {TIERS.map((t) => (
          <div key={t.tier} className="rounded-3xl p-7 border-2 bg-card border-navy/5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-action">Cota</p>
            <h3 className="font-display text-3xl font-black mt-1">{t.tier}</h3>
            <p className="font-display text-xl font-black mt-4 text-navy">{t.priceLabel}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {t.perks.map((p) => (
                <li key={p} className="flex gap-2"><span className="text-success">✓</span> {p}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleSelectTier(t)}
              className={`mt-7 w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 ${selected?.tier === t.tier ? "bg-action text-background" : "bg-navy text-background"}`}
            >
              {selected?.tier === t.tier ? "Cota selecionada" : "Assinar esta cota"}
            </button>
          </div>
        ))}
      </section>

      {/* COTA DIAMANTE — Premium institutional section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-br from-navy via-[oklch(0.18_0.05_264)] to-[oklch(0.12_0.06_264)] p-10 md:p-16 shadow-[0_30px_80px_-20px_oklch(0.1_0.05_264/0.6)]">
          <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 w-[28rem] h-[28rem] rounded-full bg-action/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:60px_60px]" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/30 backdrop-blur-sm">
                <Gem className="w-3.5 h-3.5 text-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Parceria Estratégica</span>
              </span>
            </div>

            <h2 className="font-display text-5xl md:text-7xl font-black text-background leading-[0.95] max-w-3xl">
              Cota <span className="bg-gradient-to-r from-gold via-[oklch(0.88_0.14_85)] to-gold bg-clip-text text-transparent">Diamante</span>
            </h2>

            <p className="mt-6 text-lg md:text-xl text-background/70 max-w-2xl leading-relaxed">
              Parceria estratégica institucional para empresas que desejam liderar a transformação social através do esporte.
            </p>

            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/15">
              {DIAMOND_PERKS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="group bg-navy/60 backdrop-blur-sm p-6 hover:bg-navy/30 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold/25 to-gold/5 border border-gold/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h4 className="font-display text-base font-bold text-background">{title}</h4>
                  <p className="mt-1.5 text-sm text-background/55 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 border-l-2 border-gold/60 pl-6 max-w-3xl">
              <p className="font-display text-xl md:text-2xl text-background/90 leading-snug italic">
                "Empresas Diamante não apenas patrocinam projetos. Elas ajudam a transformar vidas, fortalecer cidades e gerar impacto social real através do esporte e da tecnologia."
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-[oklch(0.85_0.16_78)] text-navy font-bold text-sm tracking-wide shadow-[0_10px_30px_-5px_oklch(0.78_0.16_75/0.5)] hover:shadow-[0_15px_40px_-5px_oklch(0.78_0.16_75/0.7)] transition-all hover:-translate-y-0.5"
              >
                Falar com a equipe estratégica
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="mailto:torcidasocial@gmail.com"
                className="text-sm text-background/60 hover:text-gold transition-colors font-medium"
              >
                ou torcidasocial@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {selected && selected.amountCents !== null && (
        <section ref={checkoutRef} className="px-6 pb-16 max-w-3xl mx-auto scroll-mt-24">
          <div className="bg-card border-2 border-action/30 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy/50">Cota selecionada · Assinatura mensal</p>
                <h2 className="font-display text-3xl font-black text-action mt-1">
                  {selected.tier} — {selected.priceLabel}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-sm font-bold text-navy/60 hover:text-navy underline"
              >
                Trocar
              </button>
            </div>
            <DonationCheckout
              amountInCents={selected.amountCents}
              recurring
              returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/doacoes/obrigado?session_id={CHECKOUT_SESSION_ID}`}
            />
          </div>
        </section>
      )}

      <section id="contato-empresa" className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="bg-surface border border-navy/5 rounded-3xl p-10 text-center">
          <h2 className="font-display text-3xl font-black">Cadastro empresarial</h2>
          <p className="text-navy/60 mt-3">Upload de logo, contrato digital, dashboards de visibilidade — em uma interface só.</p>
          <a href="mailto:torcidasocial@gmail.com" className="inline-block mt-6 bg-action text-background px-8 py-4 rounded-xl font-bold hover:bg-navy transition-colors">
            Falar com nossa equipe
          </a>
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
