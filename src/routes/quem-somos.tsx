import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ShareButton } from "@/components/ShareButton";

export const Route = createFileRoute("/quem-somos")({
  component: QuemSomos,
  head: () => ({
    meta: [
      { title: "Quem Somos — Torcida Social | ONG no Rio de Janeiro" },
      { name: "description", content: "Fundada em 1996 em Campo Grande (RJ) e hoje sediada em Teresópolis. Conheça a história, a missão e os valores da Torcida Social." },
      { property: "og:title", content: "Quem Somos — Torcida Social" },
      { property: "og:description", content: "Quase 30 anos transformando a paixão pelo futebol em impacto social no Rio de Janeiro." },
    ],
  }),
});

function QuemSomos() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Quem Somos"
        title={<>A força da arquibancada<br/><span className="text-action">a serviço das crianças.</span></>}
        subtitle="Nascemos em Campo Grande, no Rio de Janeiro, em 22 de julho de 1996. Em quase 30 anos, as ferramentas mudaram — carros de som, trio elétrico, panfletos, cartazes, jornais, revistas, Rádio Comunitária Plenitude, Rádio Melodia, o jornal O Torcida Social e hoje as redes sociais — mas o propósito permanece o mesmo: mobilizar a torcida em favor de quem mais precisa."
      />

      <section className="px-6 py-16 max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1024&h=1024&fit=crop&q=80" alt="Criança apoiada pela Torcida Social" width={1024} height={1024} loading="lazy" className="w-full aspect-square object-cover rounded-3xl" />
        <div className="space-y-6">
          <h2 className="font-display text-3xl font-black">Missão</h2>
          <p className="text-navy/70 leading-relaxed text-lg">
            Promover a transformação social de crianças e adolescentes em situação de vulnerabilidade
            usando o esporte e a educação como ferramentas centrais de inclusão, cidadania e desenvolvimento humano.
          </p>
          <h2 className="font-display text-3xl font-black pt-4">Visão</h2>
          <p className="text-navy/70 leading-relaxed text-lg">
            Ser a maior rede solidária esportiva do Brasil até 2030, conectando torcidas, clubes,
            empresas e famílias em torno de um propósito comum.
          </p>
          <h2 className="font-display text-3xl font-black pt-4">Valores</h2>
          <ul className="grid grid-cols-2 gap-3 text-navy/70">
            {["Paixão", "Transparência", "Inclusão", "Educação", "Coletivo", "Impacto"].map((v) => (
              <li key={v} className="bg-surface border border-navy/5 rounded-xl px-4 py-3 font-bold">{v}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-16 bg-navy text-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl font-black uppercase italic mb-12">Nossa linha do tempo</h2>
          <ol className="grid md:grid-cols-4 gap-6">
            {[
              {
                year: "1996",
                title: "O Início",
                text: "Fundação em 22 de julho, em Campo Grande — Zona Oeste do Rio. Mobilização com carros de som, panfletos e cartazes.",
              },
              {
                year: "1996–2006",
                title: "Década do Impacto",
                text: "+20 mil alimentos, roupas, móveis e eletrodomésticos arrecadados. Atendimentos médicos, óculos, cadeiras de rodas e aparelhos auditivos. Reformas de casas, apoio psicológico e espiritual, casamentos comunitários e ações em enchentes.",
              },
              {
                year: "2006–2016",
                title: "Foco Educacional",
                text: "Década dedicada a eventos de caráter educacional, fortalecendo parcerias com igrejas, poder público, ONGs e empresas locais.",
              },
              {
                year: "Hoje",
                title: "Nova Fase",
                text: "Após um hiato, voltamos com uma revolução no social pela força do esporte: núcleos, Liga da Solidariedade e mobilização digital.",
              },
            ].map((e) => (
              <li key={e.year} className="border-t-2 border-gold pt-5">
                <div className="font-display text-2xl font-black text-gold">{e.year}</div>
                <div className="font-display text-base font-bold text-background mt-1">{e.title}</div>
                <p className="text-background/70 text-sm mt-2 leading-relaxed">{e.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 border-t border-background/10 pt-10">
            <h3 className="font-display text-xl font-black uppercase tracking-wide text-gold mb-5">Parcerias estratégicas ao longo da jornada</h3>
            <p className="text-background/70 text-sm leading-relaxed max-w-3xl mb-6">
              Igrejas, poder público, ONGs e empresas locais que caminharam conosco — entre tantos nomes, destacamos:
            </p>
            <ul className="flex flex-wrap gap-2">
              {[
                "Ivanildo Luna",
                "Fábio Arrigh",
                "Wagner Brunner",
                "Marcos Magão",
                "Bazar Água Viva",
                "Silbene Magazine",
                "Polisaúde",
                "ADCG — Assembleia de Deus em Campo Grande/RJ",
                "Rádio Melodia",
                "Natan Dutra",
                "Stauros",
                "Studio Ric Lunas",
              ].map((p) => (
                <li key={p} className="bg-background/5 border border-background/10 rounded-full px-4 py-2 text-sm text-background/80 font-medium">
                  {p}
                </li>
              ))}
            </ul>
          </div>
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
