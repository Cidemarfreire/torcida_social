import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ShareButton } from "@/components/ShareButton";
import { PROJECTS } from "@/lib/mock-data";
import projEsporte from "@/assets/projeto-esporte.jpg";
import projEdu from "@/assets/projeto-educacao.jpg";
import projCursos from "@/assets/projeto-cursos.jpg";

// Imagens realistas de alta qualidade para substituir as atuais
const realisticProjEsporte = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1024&h=768&fit=crop&q=80";
const realisticProjEdu = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1024&h=768&fit=crop&q=80";
const realisticProjCursos = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1024&h=768&fit=crop&q=80";

export const Route = createFileRoute("/projetos")({
  component: Projetos,
  head: () => ({
    meta: [
      { title: "Projetos Sociais — Torcida Social | Esporte e Educação" },
      { name: "description", content: "Educação, esporte, reforço escolar, cursos profissionalizantes e apoio psicopedagógico para crianças no Rio de Janeiro." },
      { property: "og:title", content: "Projetos Sociais — Torcida Social" },
      { property: "og:description", content: "Esporte e educação como ferramentas de inclusão social." },
    ],
  }),
});

const images: Record<string, string> = { esporte: realisticProjEsporte, educacao: realisticProjEdu, cursos: realisticProjCursos };

function Projetos() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Projetos"
        title={<>Onde a sua torcida<br/><span className="text-success">vira história real.</span></>}
        subtitle="Frentes que se complementam — esporte, educação, apoio psicopedagógico e inclusão social. Conheça cada uma."
      />

      <section className="px-6 py-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {PROJECTS.map((p) => (
          <article key={p.slug} className="bg-card border border-navy/5 rounded-3xl overflow-hidden">
            <img src={images[p.image]} alt={p.title} width={1024} height={768} loading="lazy" className="w-full aspect-[16/10] object-cover" />
            <div className="p-7">
              <span className="text-[11px] font-bold uppercase tracking-widest text-action">{p.category}</span>
              <h2 className="font-display text-2xl font-black mt-2">{p.title}</h2>
              <p className="text-navy/65 mt-3 leading-relaxed">{p.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="bg-success/10 text-success text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">{p.impact}</span>
                <Link to="/doacoes" className="text-sm font-bold text-action hover:underline">Apoiar este projeto →</Link>
              </div>
            </div>
          </article>
        ))}
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
