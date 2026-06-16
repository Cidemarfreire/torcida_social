import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { STORIES } from "@/lib/mock-data";
import projEsporte from "@/assets/projeto-esporte.jpg";
import projEdu from "@/assets/projeto-educacao.jpg";
import projCursos from "@/assets/projeto-cursos.jpg";
import crianca from "@/assets/crianca-bola.jpg";

// Imagens realistas de alta qualidade para o mural
const realisticMuralImages = [
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1024&h=768&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1024&h=768&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1024&h=768&fit=crop&q=80",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1024&h=768&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=1024&h=768&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1024&h=768&fit=crop&q=80",
];

const imgs = realisticMuralImages;

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
          <article key={s.id} className="bg-card border border-navy/5 rounded-3xl overflow-hidden relative hover:border-action transition-all hover:shadow-lg group">
            <div className="absolute top-4 left-4 z-10 bg-navy/90 backdrop-blur text-background text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Relato ilustrativo
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={imgs[i % imgs.length]} 
                alt={`Relato ilustrativo: ${s.name}, ${s.nucleo}`} 
                width={1024} 
                height={768} 
                loading="lazy" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
            </div>
            <div className="p-6">
              <span className="bg-success/10 text-success text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{s.tag}</span>
              <p className="font-display font-black text-lg mt-3 leading-snug text-navy">"{s.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center">
                  <span className="text-navy font-bold text-sm">{s.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs text-navy font-bold">{s.name}</p>
                  <p className="text-[11px] text-navy/50">{s.nucleo}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-4 text-xs text-navy/50 border-t border-navy/5 pt-4">
                <button className="font-bold hover:text-action transition-colors flex items-center gap-1">
                  <span>❤</span> Curtir
                </button>
                <button className="font-bold hover:text-action transition-colors flex items-center gap-1">
                  <span>💬</span> Comentar
                </button>
                <button className="font-bold ml-auto hover:text-action transition-colors flex items-center gap-1">
                  <span>↗</span> Compartilhar
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
