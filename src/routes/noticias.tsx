import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ExternalLink, Newspaper, Rss, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import heroTorcida from "@/assets/hero-torcida.jpg";
import { isAdmin } from "@/lib/auth";
import {
  fetchPublishedNews,
  formatNewsDate,
  NEWS_TOPIC_DESCRIPTIONS,
  NEWS_TOPIC_LABELS,
  NEWS_TOPICS,
  type NewsDraft,
  type NewsTopic,
} from "@/lib/news";

const BRASILEIRAO_STANDINGS_FALLBACK = [
  { pos: 1, team: "Flamengo", pts: 45, j: 20, v: 14, e: 3, d: 3, sg: 25 },
  { pos: 2, team: "Palmeiras", pts: 42, j: 20, v: 13, e: 3, d: 4, sg: 18 },
  { pos: 3, team: "Botafogo", pts: 40, j: 20, v: 12, e: 4, d: 4, sg: 15 },
  { pos: 4, team: "Atlético-MG", pts: 38, j: 20, v: 11, e: 5, d: 4, sg: 12 },
  { pos: 5, team: "Fluminense", pts: 36, j: 20, v: 10, e: 6, d: 4, sg: 8 },
  { pos: 6, team: "São Paulo", pts: 35, j: 20, v: 10, e: 5, d: 5, sg: 6 },
  { pos: 7, team: "Grêmio", pts: 34, j: 20, v: 9, e: 7, d: 4, sg: 5 },
  { pos: 8, team: "Cruzeiro", pts: 33, j: 20, v: 9, e: 6, d: 5, sg: 3 },
  { pos: 9, team: "Internacional", pts: 32, j: 20, v: 8, e: 8, d: 4, sg: 2 },
  { pos: 10, team: "Athletico-PR", pts: 30, j: 20, v: 8, e: 6, d: 6, sg: 0 },
  { pos: 11, team: "Fortaleza", pts: 29, j: 20, v: 7, e: 8, d: 5, sg: -2 },
  { pos: 12, team: "Bahia", pts: 28, j: 20, v: 7, e: 7, d: 6, sg: -4 },
  { pos: 13, team: "Vasco", pts: 27, j: 20, v: 6, e: 9, d: 5, sg: -6 },
  { pos: 14, team: "Corinthians", pts: 26, j: 20, v: 6, e: 8, d: 6, sg: -8 },
  { pos: 15, team: "Santos", pts: 25, j: 20, v: 5, e: 10, d: 5, sg: -10 },
  { pos: 16, team: "Cuiabá", pts: 24, j: 20, v: 5, e: 9, d: 6, sg: -12 },
  { pos: 17, team: "Goiás", pts: 23, j: 20, v: 4, e: 11, d: 5, sg: -14 },
  { pos: 18, team: "Coritiba", pts: 22, j: 20, v: 4, e: 10, d: 6, sg: -16 },
  { pos: 19, team: "América-MG", pts: 21, j: 20, v: 3, e: 12, d: 5, sg: -18 },
  { pos: 20, team: "Ceará", pts: 20, j: 20, v: 3, e: 11, d: 6, sg: -20 },
];

export const Route = createFileRoute("/noticias")({
  component: Noticias,
  head: () => ({
    meta: [
      { title: "Central de Noticias - Torcida Social" },
      {
        name: "description",
        content:
          "Esporte, impacto social, projetos comunitarios e Selecao Brasileira rumo a Copa.",
      },
    ],
  }),
});

function Noticias() {
  const [activeTopic, setActiveTopic] = useState<NewsTopic | "all">("all");
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const adminCheck = await isAdmin();
      setIsUserAdmin(adminCheck);
    }
    checkAdmin();
  }, []);

  const {
    data: news = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["published-news", activeTopic],
    queryFn: () =>
      activeTopic === "all"
        ? fetchPublishedNews()
        : fetchPublishedNews(activeTopic),
    retry: 1,
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Central de Noticias"
        title="O que esta rolando na torcida."
        subtitle="Notícias, histórias e movimentos do esporte que inspiram solidariedade, inclusão e transformação social."
      >
        <div className="mt-6 inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-navy text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
          <Rss size={14} className="text-action" />
          Paixão que informa. Torcida que transforma.
        </div>
      </PageHero>

      {isUserAdmin && (
        <section className="px-6 py-4 max-w-7xl mx-auto">
          <a
            href="/admin#noticias-admin"
            className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 hover:border-action hover:bg-action/10 px-4 py-2 rounded-xl text-xs font-bold text-navy hover:text-action transition-all"
          >
            Gerenciar notícias
            <ArrowRight size={12} />
          </a>
        </section>
      )}

      <section className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2">
          <TopicTab
            active={activeTopic === "all"}
            label="Todas"
            onClick={() => setActiveTopic("all")}
          />
          {NEWS_TOPICS.map((topic) => (
            <TopicTab
              key={topic}
              active={activeTopic === topic}
              label={NEWS_TOPIC_LABELS[topic]}
              onClick={() => setActiveTopic(topic)}
            />
          ))}
        </div>
        {activeTopic !== "all" && (
          <p className="mt-4 text-sm text-navy/60 max-w-2xl">
            {NEWS_TOPIC_DESCRIPTIONS[activeTopic]}
          </p>
        )}
      </section>

      <section className="px-6 py-8 max-w-7xl mx-auto">
        <div className="bg-card border border-navy/5 rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-black text-navy">
              Tabela do Brasileirão
            </h2>
            <p className="text-sm text-navy/60 mt-1">
              Acompanhe a classificação, pontos e posição dos clubes.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy/10">
                  <th className="text-left font-bold text-navy/50 uppercase tracking-wider py-3 px-2">Pos.</th>
                  <th className="text-left font-bold text-navy/50 uppercase tracking-wider py-3 px-2">Time</th>
                  <th className="text-center font-bold text-navy/50 uppercase tracking-wider py-3 px-2">Pts</th>
                  <th className="text-center font-bold text-navy/50 uppercase tracking-wider py-3 px-2">J</th>
                  <th className="text-center font-bold text-navy/50 uppercase tracking-wider py-3 px-2">V</th>
                  <th className="text-center font-bold text-navy/50 uppercase tracking-wider py-3 px-2">E</th>
                  <th className="text-center font-bold text-navy/50 uppercase tracking-wider py-3 px-2">D</th>
                  <th className="text-center font-bold text-navy/50 uppercase tracking-wider py-3 px-2">SG</th>
                </tr>
              </thead>
              <tbody>
                {BRASILEIRAO_STANDINGS_FALLBACK.map((team) => (
                  <tr key={team.pos} className="border-b border-navy/5 hover:bg-navy/5 transition-colors">
                    <td className="py-3 px-2">
                      <span className="font-display font-black text-navy">{team.pos}</span>
                      {team.pos <= 4 && (
                        <span className="ml-2 bg-success/20 text-success text-[10px] font-bold px-2 py-0.5 rounded-full">G4</span>
                      )}
                      {team.pos >= 17 && (
                        <span className="ml-2 bg-red-500/20 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Z4</span>
                      )}
                    </td>
                    <td className="py-3 px-2 font-bold text-navy">{team.team}</td>
                    <td className="py-3 px-2 text-center font-display font-black text-navy">{team.pts}</td>
                    <td className="py-3 px-2 text-center text-navy/70">{team.j}</td>
                    <td className="py-3 px-2 text-center text-success font-bold">{team.v}</td>
                    <td className="py-3 px-2 text-center text-navy/70">{team.e}</td>
                    <td className="py-3 px-2 text-center text-red-600 font-bold">{team.d}</td>
                    <td className="py-3 px-2 text-center font-display font-bold text-navy/70">{team.sg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 max-w-7xl mx-auto">
        {isLoading ? (
          <LoadingState />
        ) : (
          <NewsGrid news={news} />
        )}
      </section>
    </SiteLayout>
  );
}
function TopicTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
        active
          ? "bg-navy text-background border-navy"
          : "bg-card text-navy/65 border-navy/10 hover:border-action"
      }`}
    >
      {label}
    </button>
  );
}

function NewsGrid({ news }: { news: NewsDraft[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function NewsCard({ item }: { item: NewsDraft }) {
  const fallbackNewsImage = heroTorcida;
  const imageSrc = item.image_url || fallbackNewsImage;

  return (
    <article className="bg-card border border-navy/5 rounded-3xl overflow-hidden hover:border-action transition-colors">
      <img
        src={imageSrc}
        alt={item.title}
        className="w-full h-48 object-cover border-b border-navy/10"
        onError={(event) => {
          event.currentTarget.src = fallbackNewsImage;
        }}
      />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
          <span className="bg-action/10 text-action font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            {NEWS_TOPIC_LABELS[item.topic]}
          </span>
          <span className="text-navy/40 font-bold">
            {formatNewsDate(item.published_at ?? item.created_at)}
          </span>
        </div>
        <h3 className="font-display text-xl font-black leading-tight mb-3">
          {item.title}
        </h3>
        <p className="text-navy/65 text-sm leading-relaxed mb-4">
          {item.summary}
        </p>
        {item.social_relevance && (
          <p className="text-sm text-navy/70 leading-relaxed mb-4">
            <strong className="text-navy">Por que importa: </strong>
            {item.social_relevance}
          </p>
        )}
        {item.call_to_action && (
          <p className="text-sm font-bold text-action mb-4">
            {item.call_to_action}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <a
            href={`/noticias/${item.slug}`}
            className="flex items-center gap-2 text-xs font-bold text-navy hover:text-action transition-colors"
          >
            Ler notícia completa
            <ArrowRight size={12} />
          </a>
          {item.sources.length > 0 && (
            <a
              href={item.sources[0]}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-action hover:text-action/80"
            >
              <ExternalLink size={12} />
              Ler na fonte original
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="bg-card border border-navy/5 rounded-3xl p-10 text-center">
      <Newspaper className="mx-auto text-action animate-pulse" size={34} />
      <p className="mt-4 font-display text-2xl font-black">
        Carregando noticias...
      </p>
      <p className="mt-2 text-navy/60">
        Buscando os conteudos aprovados pela curadoria.
      </p>
    </div>
  );
}
