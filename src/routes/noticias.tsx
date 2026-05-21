import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Newspaper, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { NEWS } from "@/lib/mock-data";
import {
  fetchPublishedNews,
  formatNewsDate,
  NEWS_TOPIC_LABELS,
  type NewsDraft,
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
  const {
    data: news = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["published-news"],
    queryFn: fetchPublishedNews,
    retry: 1,
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Central de Noticias"
        title="O que esta rolando na torcida."
        subtitle="Esporte, impacto social, projetos comunitarios e bastidores das cidades parceiras - atualizado por IA, curado pelo time."
      >
        <div className="mt-6 inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-navy text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
          <Sparkles size={14} className="text-action" />
          IA gera rascunhos 3 vezes ao dia
        </div>
      </PageHero>

      <section className="px-6 py-16 max-w-7xl mx-auto">
        {isLoading ? (
          <LoadingState />
        ) : news.length > 0 ? (
          <NewsGrid news={news} />
        ) : isError ? (
          <PreviewGrid />
        ) : (
          <PreviewGrid />
        )}
      </section>
    </SiteLayout>
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
          <h2 className="font-display text-xl font-black mt-4 leading-tight">
            {item.title}
          </h2>
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
                Fontes
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
                  Ver fonte
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

function EmptyState() {
  return (
    <div className="bg-card border border-navy/5 rounded-3xl p-10 text-center">
      <Newspaper className="mx-auto text-action" size={34} />
      <p className="mt-4 font-display text-2xl font-black">
        Em breve, novidades.
      </p>
      <p className="mt-2 text-navy/60">
        A central foi ativada agora. Noticias aprovadas aparecem aqui.
      </p>
    </div>
  );
}

function PreviewGrid() {
  return (
    <div>
      <div className="bg-gold/10 border border-gold/30 rounded-3xl p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-action">
            Curadoria inicial
          </p>
          <p className="text-sm font-bold text-navy mt-1">
            Enquanto a IA gera e o time aprova novas pautas, estes destaques mantêm a central ativa.
          </p>
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-navy/50">
          IA + curadoria
        </span>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {NEWS.map((item) => (
          <article
            key={item.slug}
            className="bg-card border border-navy/5 rounded-3xl p-7"
          >
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-action/10 text-action font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {item.tag}
              </span>
              <span className="text-navy/40 font-bold">{item.date}</span>
            </div>
            <h2 className="font-display text-xl font-black mt-4 leading-tight">
              {item.title}
            </h2>
            <p className="text-navy/65 text-sm mt-3 leading-relaxed">
              {item.excerpt}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
