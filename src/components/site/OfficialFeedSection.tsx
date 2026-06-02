import { getMockOfficialFeed } from "@/lib/official-feed";

export function OfficialFeedSection() {
  const officialFeed = getMockOfficialFeed();

  return (
    <section className="px-6 py-16 bg-slate-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
            Comunicados Oficiais
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-5xl">
            Feed Oficial Torcida Social
          </h2>
          <p className="mt-4 text-slate-600">
            Acompanhe os comunicados institucionais e ações oficiais do projeto
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {officialFeed.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                    {item.category}
                  </span>
                  {item.isOfficial && (
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-yellow-400">
                      Oficial
                    </span>
                  )}
                </div>

                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mb-4 text-sm text-slate-600 line-clamp-3">
                  {item.description}
                </p>

                <div className="mb-4 text-xs text-slate-500">
                  {new Date(item.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Ver ação: ${item.title}`)}
                  className="w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-yellow-300"
                >
                  Ver ação
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
