import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ExternalLink, Newspaper, Rss, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ShareButton } from "@/components/ShareButton";
import heroTorcida from "@/assets/hero-torcida.jpg";

// Imagens realistas de alta qualidade para fallbacks temáticos
const fallbackImages = {
  social_sports: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1024&h=768&fit=crop&q=80",
  selecao_brasileira: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1024&h=768&fit=crop&q=80",
  copa: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1024&h=768&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=1024&h=768&fit=crop&q=80",
};

// Função para obter imagem de fallback baseada no tópico
const getFallbackImage = (topic: string): string => {
  return (fallbackImages as any)[topic] || fallbackImages.default;
};
import { isAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchPublishedNews,
  formatNewsDate,
  NEWS_TOPIC_DESCRIPTIONS,
  NEWS_TOPIC_LABELS,
  NEWS_TOPICS,
  type NewsDraft,
  type NewsTopic,
} from "@/lib/news";

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
        subtitle="Notícias, histórias e movimentos do esporte que inspiram solidariedade."
      />

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
        <BrasileiraoTable />
      </section>

      <section className="px-6 pb-16 max-w-7xl mx-auto">
        {isLoading ? (
          <LoadingState />
        ) : (
          <NewsGrid news={news} />
        )}
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
  if (news.length === 0) {
    return (
      <div className="bg-card border border-navy/5 rounded-3xl p-10 text-center">
        <p className="font-display text-2xl font-black text-navy">
          Nenhuma notícia publicada ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function NewsCard({ item }: { item: NewsDraft }) {
  const fallbackNewsImage = getFallbackImage(item.topic);
  const imageSrc = item.image_url || fallbackNewsImage;

  return (
    <article className="bg-card border border-navy/5 rounded-3xl overflow-hidden hover:border-action transition-all hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={imageSrc}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.src = fallbackNewsImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent" />
      </div>
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
    </div>
  );
}

function BrasileiraoTable() {
  const { data: standingsData, isLoading, isError } = useQuery({
    queryKey: ["brasileirao-standings"],
    queryFn: async () => {
      console.log("BrasileiraoTable: Invocando Edge Function...");
      const { data, error } = await supabase.functions.invoke("get-brasileirao-standings");
      console.log("Brasileirao Data:", data);
      console.log("Brasileirao Error:", error);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="bg-card border border-navy/5 rounded-3xl p-6 shadow-sm">
        <h2 className="font-display text-2xl font-black text-navy mb-6">
          Tabela do Brasileirão
        </h2>
        <div className="bg-surface rounded-xl p-8 text-center">
          <Newspaper className="mx-auto text-navy/30 mb-4 animate-pulse" size={48} />
          <p className="font-display text-lg font-black text-navy mb-2">
            Carregando classificação...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !standingsData?.standings) {
    return (
      <div className="bg-card border border-navy/5 rounded-3xl p-6 shadow-sm">
        <h2 className="font-display text-2xl font-black text-navy mb-6">
          Tabela do Brasileirão
        </h2>
        <div className="bg-surface rounded-xl p-8 text-center">
          <Newspaper className="mx-auto text-navy/30 mb-4" size={48} />
          <p className="font-display text-lg font-black text-navy mb-2">
            Classificação em atualização
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-navy/5 to-card border border-navy/10 rounded-3xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-black text-navy">
            Tabela do Brasileirão
          </h2>
          <p className="text-sm text-navy/60 mt-1">Classificação atual da Série A</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-success/10 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs font-bold text-success">Libertadores</span>
          </div>
          <div className="flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-bold text-red-600">Rebaixamento</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-navy/10">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-navy text-background">
              <th className="text-left font-bold uppercase tracking-wider py-4 px-3">#</th>
              <th className="text-left font-bold uppercase tracking-wider py-4 px-3">Time</th>
              <th className="text-center font-bold uppercase tracking-wider py-4 px-3">Pts</th>
              <th className="text-center font-bold uppercase tracking-wider py-4 px-3">J</th>
              <th className="text-center font-bold uppercase tracking-wider py-4 px-3">V</th>
              <th className="text-center font-bold uppercase tracking-wider py-4 px-3">E</th>
              <th className="text-center font-bold uppercase tracking-wider py-4 px-3">D</th>
              <th className="text-center font-bold uppercase tracking-wider py-4 px-3">SG</th>
            </tr>
          </thead>
          <tbody>
            {standingsData.standings.map((team: any, index: number) => {
              const isG4 = team.position <= 4;
              const isZ4 = team.position >= 17;
              const rowBg = isG4 ? 'bg-success/5' : isZ4 ? 'bg-red-500/5' : index % 2 === 0 ? 'bg-surface' : 'bg-card';
              
              return (
                <tr key={team.position} className={`${rowBg} hover:bg-navy/10 transition-colors border-b border-navy/5 last:border-b-0`}>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-display font-black ${isG4 ? 'text-success' : isZ4 ? 'text-red-600' : 'text-navy'}`}>
                        {team.position}
                      </span>
                      {isG4 && (
                        <span className="bg-success text-background text-[10px] font-bold px-2 py-0.5 rounded-full">G4</span>
                      )}
                      {isZ4 && (
                        <span className="bg-red-600 text-background text-[10px] font-bold px-2 py-0.5 rounded-full">Z4</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-3 font-bold text-navy">{team.teamName}</td>
                  <td className="py-4 px-3 text-center font-display font-black text-navy text-sm">{team.points}</td>
                  <td className="py-4 px-3 text-center text-navy/70">{team.playedGames}</td>
                  <td className="py-4 px-3 text-center text-success font-bold">{team.won}</td>
                  <td className="py-4 px-3 text-center text-navy/70">{team.draw}</td>
                  <td className="py-4 px-3 text-center text-red-600 font-bold">{team.lost}</td>
                  <td className="py-4 px-3 text-center font-display font-bold text-navy/70">{team.goalDifference}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
