import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mao-na-massa")({
  component: MaoNaMassaPage,
});

function MaoNaMassaPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="px-6 py-20 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-yellow-400">
          Torcida Social
        </p>

        <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          Torcida com a Mão na Massa
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300 md:text-xl">
          A força da torcida transformando casas, famílias e futuros.
        </p>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-yellow-400/30 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <p className="text-slate-200">
            O Torcida Social acredita que nenhuma paixão é maior do que cuidar
            de pessoas. Este projeto une torcedores, voluntários e parceiros
            para transformar a realidade de famílias em situação de
            vulnerabilidade através de pequenas reformas, móveis, apoio
            alimentar e dignidade.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-4">
          {[
            "Indicação da família",
            "Avaliação social",
            "Mobilização da torcida",
            "Transformação entregue",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
            >
              <h3 className="font-bold text-yellow-400">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 text-slate-950">
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

      <section className="px-6 pb-24 text-center">
        <h2 className="text-3xl font-black text-yellow-400">
          Começando pelo Rio de Janeiro
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Uma ação social com visão de expansão para todo o Brasil,
          mobilizando torcedores, empresas e parceiros em favor de famílias que
          precisam recomeçar.
        </p>

        <a
          href="/doacoes"
          className="mt-8 inline-flex rounded-full bg-yellow-400 px-8 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
        >
          Quero apoiar esta causa
        </a>

        <p className="mt-10 text-2xl font-black">
          Mais que torcer. É levantar quem caiu.
        </p>
      </section>
    </main>
  );
}