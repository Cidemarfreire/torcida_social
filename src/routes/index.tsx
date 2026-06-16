import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ArrowRight, Newspaper, Rss } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ClubBadge } from "@/components/site/ClubBadge";
import { ShareButton } from "@/components/ShareButton";
import { SERIE_A_CLUBS, STATS, RANKING, PROJECTS, formatBRL, formatInt } from "@/lib/mock-data";
import {
  fetchPublishedNews,
  NEWS_TOPIC_DESCRIPTIONS,
  NEWS_TOPIC_LABELS,
  NEWS_TOPICS,
  pickFeaturedByTopic,
  type NewsTopic,
} from "@/lib/news";
import heroImg from "@/assets/hero-torcida.jpg";
import criancaImg from "@/assets/crianca-bola.jpg";
import projEsporte from "@/assets/projeto-esporte.jpg";
import projEdu from "@/assets/projeto-educacao.jpg";
import projCursos from "@/assets/projeto-cursos.jpg";
import torcidaFutebol from "@/assets/torcida-futebol.png";

// Imagens realistas de alta qualidade para substituir as atuais
const realisticHeroImg = torcidaFutebol;
const realisticCriancaImg = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1024&h=1024&fit=crop&q=80";
const realisticProjEsporte = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1024&h=768&fit=crop&q=80";
const realisticProjEdu = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1024&h=768&fit=crop&q=80";
const realisticProjCursos = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1024&h=768&fit=crop&q=80";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Torcida Social — A torcida que transforma vidas" },
      { name: "description", content: "Una sua paixão pelo futebol à transformação de milhares de crianças. Cadastre-se, doe e suba no ranking da Liga da Solidariedade." },
      { property: "og:title", content: "Torcida Social — A torcida que transforma vidas" },
      { property: "og:description", content: "Cadastre seu clube, doe via Pix e participe da Liga da Solidariedade." },
    ],
  }),
});

const projectImages: Record<string, string> = {
  esporte: realisticProjEsporte,
  educacao: realisticProjEdu,
  cursos: realisticProjCursos,
};

const fallbackTopics: { topic: NewsTopic; title: string; text: string }[] = [
  {
    topic: "social_sports",
    title: "Esporte social no Brasil",
    text: NEWS_TOPIC_DESCRIPTIONS.social_sports,
  },
  {
    topic: "selecao_brasileira",
    title: "Selecao rumo a Copa",
    text: NEWS_TOPIC_DESCRIPTIONS.selecao_brasileira,
  },
  {
    topic: "copa",
    title: "Mundo dos esportes",
    text: NEWS_TOPIC_DESCRIPTIONS.copa,
  },
];

function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");
    if (!hasSeenSplash) {
      router.navigate({ to: "/splash" as any });
    }
  }, [router]);

  const top3 = RANKING.slice(0, 3);
  const [activeTopic, setActiveTopic] = useState<NewsTopic>("social_sports");
  const { data: publishedNews = [] } = useQuery({
    queryKey: ["published-news", "home"],
    queryFn: () => fetchPublishedNews(),
    retry: 1,
    staleTime: 60_000,
  });
  const featured = pickFeaturedByTopic(publishedNews);
  const activeItem = featured[activeTopic];
  const activeFallback = fallbackTopics.find((item) => item.topic === activeTopic)!;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative px-6 pt-12 pb-20 lg:pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em]">
              <span className="size-1.5 bg-success rounded-full animate-pulse" />
              Impacto Social em Tempo Real
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.9] text-navy">
              A TORCIDA QUE <span className="text-action">TRANSFORMA</span> VIDAS.
            </h1>
            <p className="text-lg md:text-xl text-navy/65 max-w-lg leading-relaxed">
              Unimos a paixão pelo futebol com o poder da solidariedade para criar
              um futuro melhor para milhares de crianças.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/cadastro"
                className="bg-navy text-background px-7 py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform"
              >
                Cadastrar Minha Torcida
              </Link>
              <Link
                to="/login"
                className="border-2 border-navy/10 px-7 py-4 rounded-xl font-bold hover:bg-navy hover:text-background transition-all"
              >
                Já tenho conta, entrar
              </Link>
              <Link
                to="/projetos"
                className="border-2 border-navy/10 px-7 py-4 rounded-xl font-bold hover:bg-navy hover:text-background transition-all"
              >
                Ver Projetos
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src={realisticHeroImg}
              alt="Torcida brasileira celebrando no estádio"
              width={1024}
              height={1280}
              className="w-full aspect-[4/5] object-cover rounded-3xl shadow-xl shadow-navy/10"
            />
            <div className="absolute -bottom-8 -left-6 bg-card p-6 md:p-7 rounded-2xl shadow-2xl shadow-navy/15 border border-navy/5 grid grid-cols-2 gap-6">
              <div>
                <div className="text-2xl md:text-3xl font-black text-action font-display">
                  {formatInt(STATS.criancas)}
                </div>
                <div className="text-[10px] font-bold uppercase text-navy/40 tracking-wider">
                  Crianças Atendidas
                </div>
              </div>
              <div className="col-span-2 border-t border-navy/5 pt-4">
                <div className="text-[10px] md:text-xs font-black text-success font-display leading-tight uppercase tracking-tight">
                  + DE 25.000 ATENDIMENTOS EM 20 ANOS DE ATUAÇÃO NA ZONA OESTE DO RIO
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTERS STRIP */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-navy rounded-2xl overflow-hidden">
          {[
            { label: "Crianças atendidas", value: formatInt(STATS.criancas) },
            { label: "Cidades alcançadas", value: STATS.cidades },
            { label: "Torcedores cadastrados", value: formatInt(STATS.torcedores) },
            { label: "Impacto Rio (20 anos)", value: "+ 25.000 atendimentos" },
          ].map((s) => (
            <div key={s.label} className="bg-navy text-background p-7 text-center">
              <div className="font-display text-3xl md:text-4xl font-black text-gold">{s.value}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-background/50">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGA DA SOLIDARIEDADE */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-action">Gamificação</span>
              <h2 className="font-display text-4xl md:text-5xl font-black mt-2 uppercase italic">
                Liga da Solidariedade
              </h2>
              <p className="text-navy/60 text-lg mt-3">
                Onde o seu time entra em campo pela transformação social.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="bg-navy/5 px-4 py-2 rounded-lg text-xs font-bold">🏆 SÉRIE A</span>
              <span className="bg-success text-background px-4 py-2 rounded-lg text-xs font-bold">AO VIVO</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {top3.map((row, i) => {
              const club = SERIE_A_CLUBS.find((c) => c.id === row.clubId)!;
              const colors = ["from-gold/25 border-gold/40", "from-navy/10 border-navy/15", "from-action/15 border-action/25"];
              const medal = ["bg-gold", "bg-navy/30", "bg-action/60"];
              const barColor = ["bg-gold", "bg-success", "bg-action"];
              const pct = [85, 72, 60][i];
              return (
                <div key={club.id} className={`bg-gradient-to-br ${colors[i]} to-transparent border p-7 rounded-3xl relative bg-card`}>
                  <div className={`absolute -top-3 -right-3 size-11 ${medal[i]} rounded-full flex items-center justify-center text-background font-display font-black`}>
                    {i + 1}º
                  </div>
                  <ClubBadge club={club} size={64} />
                  <h3 className="text-2xl font-black uppercase mt-5 mb-3 font-display">{club.name}</h3>
                  <div className="w-full bg-navy/10 h-2 rounded-full mb-3">
                    <div className={`${barColor[i]} h-full rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-navy">{formatBRL(row.raised)}</span>
                    <span className="text-navy/50">{formatInt(row.donors)} doadores</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link to="/ranking" className="inline-block text-action font-bold text-sm hover:underline">
              Ver ranking completo dos 20 clubes →
            </Link>
          </div>
        </div>
      </section>

      {/* CLUB CRESTS STRIP */}
      <section className="py-12 px-6 bg-surface border-y border-navy/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy/40 mb-6 text-center">
            Torça pelo seu time. Doe pela sua causa.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {SERIE_A_CLUBS.map((c) => (
              <ClubBadge key={c.id} club={c} size={48} />
            ))}
          </div>
        </div>
      </section>

      {/* DONATION CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-card rounded-[40px] p-8 md:p-12 border border-navy/5 grid lg:grid-cols-2 gap-12 items-center shadow-sm">
          <div className="space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-black leading-tight">
              Sua doação alimenta o sonho de um novo campeão.
            </h2>
            <p className="text-navy/60 leading-relaxed">
              Cada real doado é investido em educação, reforço escolar, apoio psicopedagógico e
              iniciação esportiva para crianças em vulnerabilidade social.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[10, 20, 50].map((v) => (
                <button key={v} className="py-4 rounded-xl border-2 border-navy/5 font-black hover:border-action transition-all">
                  R$ {v}
                </button>
              ))}
            </div>
            <Link
              to="/doacoes"
              className="block w-full bg-action text-background py-5 rounded-xl font-black text-lg text-center hover:bg-navy transition-colors"
            >
              DOAR COM PIX →
            </Link>
          </div>
          <div>
            <img
              src={realisticCriancaImg}
              alt="Criança com bola"
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full aspect-square object-cover rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-action">Projetos</span>
              <h2 className="font-display text-4xl md:text-5xl font-black mt-2">Transformação em campo.</h2>
            </div>
            <Link to="/projetos" className="hidden md:inline-block text-sm font-bold text-action hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PROJECTS.slice(0, 3).map((p) => (
              <article key={p.slug} className="bg-card rounded-2xl overflow-hidden border border-navy/5 group">
                <img
                  src={projectImages[p.image]}
                  alt={p.title}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-action">{p.category}</span>
                  <h3 className="font-display text-xl font-black mt-2">{p.title}</h3>
                  <p className="text-sm text-navy/60 mt-2 leading-relaxed">{p.description}</p>
                  <p className="text-xs font-bold text-success mt-4 uppercase tracking-wider">{p.impact}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SHARE BUTTON */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex justify-end">
          <ShareButton />
        </div>
      </section>
    </SiteLayout>
  );
}
