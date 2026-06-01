import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NavigationActions } from "@/components/site/NavigationActions";
export const Route = createFileRoute("/mao-na-massa")({
  component: MaoNaMassaPage,
});

const images = {
  hero:
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
  before:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
  after:
    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=900&q=80",
  family:
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
  furniture:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  child:
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80",
  volunteer1:
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80",
  volunteer2:
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80",
  cta:
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1600&q=80",
};

function MaoNaMassaPage() {
  return (
  <SiteLayout>
    <main className="min-h-screen bg-slate-950 text-white">
      <section
        className="relative min-h-[82vh] overflow-hidden bg-cover bg-center px-6 py-24 text-center"
        style={{ backgroundImage: `url(${images.hero})` }}
      >
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />

        <div className="relative z-10 mx-auto flex min-h-[62vh] max-w-5xl flex-col items-center justify-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-yellow-400">
            Torcida Social
          </p>

          <h1 className="text-4xl font-black leading-tight md:text-7xl">
            Torcida com a Mão na Massa
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-200 md:text-2xl">
            A força da torcida transformando casas, famílias e futuros.
          </p>

          <div className="mt-10 max-w-3xl rounded-3xl border border-yellow-400/30 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <p className="text-slate-100">
              O Torcida Social acredita que nenhuma paixão é maior do que cuidar
              de pessoas. Este projeto une torcedores, voluntários e parceiros
              para transformar a realidade de famílias em situação de
              vulnerabilidade através de pequenas reformas, móveis, apoio
              alimentar e dignidade.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-4">
          {[
            "Indicação da família",
            "Avaliação social",
            "Mobilização da torcida",
            "Transformação entregue",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-xl"
            >
              <h3 className="font-bold text-yellow-400">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              Antes e Depois
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Pequenas reformas. Grandes recomeços.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-3xl bg-white/5 shadow-2xl">
              <img
                src={images.before}
                alt="Casa antes da reforma"
                className="h-72 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-black text-yellow-400">Antes</h3>
                <p className="mt-2 text-slate-300">
                  Famílias enfrentando limitações estruturais, falta de conforto
                  e necessidade de apoio imediato.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white/5 shadow-2xl">
              <img
                src={images.after}
                alt="Casa depois da reforma"
                className="h-72 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-black text-yellow-400">Depois</h3>
                <p className="mt-2 text-slate-300">
                  Um lar mais digno, organizado e preparado para um novo ciclo de
                  esperança.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 text-slate-950">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
              Histórias que renascem
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              O impacto chega onde a torcida coloca a mão
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                image: images.family,
                title: "Famílias acolhidas",
                text: "Apoio prático para quem precisa reorganizar a vida com dignidade.",
              },
              {
                image: images.furniture,
                title: "Móveis essenciais",
                text: "Cama, mesa, armário e itens básicos que mudam a rotina da casa.",
              },
              {
                image: images.child,
                title: "Crianças com esperança",
                text: "Um ambiente melhor também fortalece o futuro das crianças.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="overflow-hidden rounded-3xl bg-slate-100 shadow-xl"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-black">{card.title}</h3>
                  <p className="mt-2 text-slate-600">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
                Voluntários da Torcida
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Quando a torcida se une, ninguém fica para trás.
              </h2>
              <p className="mt-5 text-lg text-slate-300">
                Torcedores, parceiros e voluntários podem transformar esforço em
                reforma, solidariedade em alimento e paixão em cuidado real.
              </p>
            </div>

            <div className="grid gap-5">
              {[images.volunteer1, images.volunteer2].map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Voluntários da torcida ${index + 1}`}
                  className="h-64 w-full rounded-3xl object-cover shadow-2xl"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 text-slate-950 shadow-2xl">
          <h2 className="text-center text-3xl font-black">
            O que a família pode receber
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Pequena reforma",
              "Pintura",
              "Móveis essenciais",
              "Cama",
              "Eletrodomésticos básicos",
              "Cesta básica por 12 meses",
              "Apoio social",
              "Dignidade",
              "Recomeço",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-slate-100 p-4 text-center font-semibold"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-cover bg-center px-6 py-24 text-center"
        style={{ backgroundImage: `url(${images.cta})` }}
      >
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="text-3xl font-black text-yellow-400 md:text-5xl">
            Começando pelo Rio de Janeiro
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-200">
            Uma ação social com visão de expansão para todo o Brasil,
            mobilizando torcedores, empresas e parceiros em favor de famílias
            que precisam recomeçar.
          </p>

          <a
            href="/doacoes"
            className="mt-8 inline-flex rounded-full bg-yellow-400 px-8 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
          >
            Quero fazer parte desta transformação
          </a>

          <p className="mt-10 text-2xl font-black">
            Mais que torcer. É reconstruir sonhos.
          </p>
        </div>
      </section>
      
    </main>
</SiteLayout>
  );
}
