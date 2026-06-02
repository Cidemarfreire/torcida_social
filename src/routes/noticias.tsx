import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ExternalLink, Newspaper, Rss } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
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
    <div className="grid md:grid-cols-3 gap-6">
      {news.map((item) => (
        <article
          key={item.id}
          className="bg-card border border-navy/5 rounded-3xl p-7 hover:border-action transition-colors"
        >
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-action/10 text-action font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {NEWS_TOPIC_LABELS[item.topic]}
            </span>
            <span className="text-navy/40 font-bold">
              {formatNewsDate(item.published_at ?? item.created_at)}
            </span>
          </div>
          <p className="text-navy/65 text-sm mt-3 leading-relaxed">
            {item.summary}
          </p>
          {item.social_relevance && (
            <p className="mt-4 text-sm text-navy/70 leading-relaxed">
              <strong className="text-navy">Por que importa: </strong>
              {item.social_relevance}
            </p>
          )}
          {item.call_to_action && (
            <p className="mt-5 text-sm font-bold text-action">
              {item.call_to_action}
            </p>
          )}
          {item.sources.length > 0 && (
            <div className="mt-5 pt-5 border-t border-navy/10 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">
                Fonte
              </p>
              {item.sources.slice(0, 3).map((source) => (
                <a
                  key={source}
                  href={source}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-bold text-action hover:text-action/80"
                >
                  <ExternalLink size={12} />
                  Ler na fonte original
                </a>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
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
