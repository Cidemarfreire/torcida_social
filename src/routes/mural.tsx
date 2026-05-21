import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { STORIES } from "@/lib/mock-data";
import projEsporte from "@/assets/projeto-esporte.jpg";
import projEdu from "@/assets/projeto-educacao.jpg";
import projCursos from "@/assets/projeto-cursos.jpg";
import crianca from "@/assets/crianca-bola.jpg";

const imgs = [projEsporte, projEdu, projCursos, crianca];

export const Route = createFileRoute("/mural")({
  component: Mural,
  head: () => ({ meta: [
    { title: "Mural de Histórias — Torcida Social" },
    { name: "description", content: "Vídeos, fotos e depoimentos reais de crianças, famílias, professores e voluntários." },
  ]}),
});

function Mural() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Mural de Histórias"
        title={<>As vozes que <span className="text-action">a torcida transformou</span>.</>}
        subtitle="Vídeos, fotos e depoimentos reais. Filtre por cidade, núcleo, projeto ou período."
      >
        <div className="mt-6 inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-navy text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          Relatos ilustrativos — em atualização
        </div>
      </PageHero>

      <section className="px-6 pt-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {["Todos", "Família", "Educador", "Jovem", "Voluntária", "Teresópolis", "Niterói"].map((f, i) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${i === 0 ? "bg-navy text-background border-navy" : "border-navy/10 hover:border-action"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STORIES.map((s, i) => (
          <article key={s.id} className="bg-card border border-navy/5 rounded-3xl overflow-hidden relative">
            <div className="absolute top-3 left-3 z-10 bg-navy/85 backdrop-blur text-background text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Relato ilustrativo
            </div>
            <img src={imgs[i % imgs.length]} alt={`Relato ilustrativo: ${s.name}, ${s.nucleo}`} width={1024} height={768} loading="lazy" className="w-full aspect-[4/3] object-cover" />
            <div className="p-6">
              <span className="bg-success/10 text-success text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{s.tag}</span>
              <p className="font-display font-black text-lg mt-3 leading-snug">"{s.text}"</p>
              <p className="text-xs text-navy/60 mt-4 font-bold">{s.name}</p>
              <p className="text-[11px] text-navy/40">{s.nucleo}</p>
              <div className="mt-5 flex items-center gap-4 text-xs text-navy/50">
                <button className="font-bold">❤ —</button>
                <button className="font-bold">💬 —</button>
                <button className="font-bold ml-auto">↗ Compartilhar</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
