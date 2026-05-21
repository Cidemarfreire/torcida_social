import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Heart, Sparkles, Users, Brain, HandHeart, Home } from "lucide-react";
import criancaImg from "@/assets/crianca-neuroinclusao.jpg";

export const Route = createFileRoute("/integracao-neuroinclusiva")({
  component: NeuroInclusiva,
  head: () => ({
    meta: [
      { title: "Integração NeuroInclusiva — Torcida Social | Acolhimento para crianças neurodivergentes" },
      { name: "description", content: "Um espaço de pertencimento para crianças com TEA, TDAH, síndrome de Down e outras neurodivergências. Aqui, cada criança é compreendida, acolhida e amada como é." },
      { property: "og:title", content: "Aqui, cada criança é compreendida, acolhida e amada como é." },
      { property: "og:description", content: "Mais que inclusão — pertencimento. Conheça o coração da Torcida Social." },
    ],
  }),
});

function NeuroInclusiva() {
  return (
    <SiteLayout>
      {/* HERO EMOCIONAL */}
      <section className="relative overflow-hidden bg-navy text-background">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-32 -left-24 size-[420px] rounded-full bg-action/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 size-[420px] rounded-full bg-gold/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 bg-background/10 backdrop-blur border border-background/15 text-gold px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em]">
              <Heart size={12} className="fill-gold" /> O coração do projeto
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-[68px] font-black leading-[0.95] tracking-tight">
              Aqui, cada criança é
              <br />
              <span className="text-gold">compreendida</span>,
              <br />
              <span className="text-action">acolhida</span> e
              <span className="text-success"> amada</span>
              <br />
              como é.
            </h1>
            <p className="text-lg md:text-xl text-background/75 leading-relaxed max-w-xl">
              No espaço de <strong className="text-background">Integração NeuroInclusiva</strong> da Torcida Social,
              nenhuma criança precisa caber em uma caixa para ser vista, ouvida e amada.
              Aqui, a diferença não é obstáculo — é o que nos torna humanos.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#participe"
                className="bg-gold text-navy px-7 py-4 rounded-xl font-black hover:scale-[1.02] transition-transform"
              >
                Quero apoiar este sonho
              </a>
              <Link
                to="/doacoes"
                className="border-2 border-background/20 text-background px-7 py-4 rounded-xl font-bold hover:bg-background hover:text-navy transition-all"
              >
                Doar agora →
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src={criancaImg}
              alt="Criança acolhida no espaço de Integração NeuroInclusiva da Torcida Social"
              width={1024}
              height={1024}
              className="w-full aspect-square object-cover rounded-[40px] shadow-2xl shadow-black/40 ring-1 ring-background/10"
            />
            <div className="absolute -bottom-6 -left-6 md:-left-10 bg-background text-navy px-6 py-5 rounded-2xl shadow-2xl max-w-[260px]">
              <p className="font-display text-sm font-black uppercase tracking-wider text-action">Promessa</p>
              <p className="text-sm font-bold mt-1 leading-snug">
                Nenhuma criança será deixada de fora. Nunca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEXTO EMOCIONAL */}
      <section className="px-6 py-20 md:py-28 max-w-4xl mx-auto">
        <div className="space-y-8 text-navy/80 text-lg md:text-xl leading-relaxed">
          <p className="font-display text-2xl md:text-3xl font-black text-navy leading-snug">
            Existem crianças que o mundo ainda não aprendeu a olhar.
          </p>
          <p>
            Crianças com <strong className="text-navy">Transtorno do Espectro Autista (TEA)</strong>,
            <strong className="text-navy"> TDAH</strong>, <strong className="text-navy">síndrome de Down</strong>,
            dislexia, deficiência intelectual e tantas outras condições que, todos os dias,
            esbarram em portas fechadas, olhares atravessados e silêncios que doem.
          </p>
          <p>
            Crianças que ouvem, mais vezes do que deveriam, frases como{" "}
            <em className="text-action">"ele não se encaixa"</em>,{" "}
            <em className="text-action">"ela atrapalha"</em>,{" "}
            <em className="text-action">"aqui não é o lugar dela"</em>.
            Crianças cujas famílias se acostumaram a engolir o choro no caminho de volta para casa.
          </p>
          <p className="border-l-4 border-gold pl-6 italic font-display text-2xl md:text-3xl text-navy font-bold">
            Na Torcida Social, esse caminho termina aqui.
          </p>
          <p>
            Construímos um espaço onde a neurodivergência não é diagnóstico para esconder —
            é uma forma única de existir, sentir e amar o mundo. Onde o tempo de cada criança é respeitado,
            cada conquista é celebrada e cada família encontra <strong className="text-navy">um lugar para chamar de seu</strong>.
          </p>
        </div>
      </section>

      {/* PILARES DE CUIDADO */}
      <section className="px-6 py-20 bg-surface border-y border-navy/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-action">O que oferecemos</span>
            <h2 className="font-display text-3xl md:text-5xl font-black text-navy mt-3 leading-tight">
              Cuidado que abraça a criança <span className="text-action">por inteiro</span>.
            </h2>
            <p className="text-navy/60 mt-4 text-lg">
              Cinco pilares pensados com carinho, ciência e escuta — pela criança e pela família.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Users,
                title: "Integração social",
                text: "Convivência guiada com pares e voluntários, em ambiente seguro, para construir vínculos verdadeiros.",
                color: "text-action bg-action/10",
              },
              {
                icon: Sparkles,
                title: "Estímulos sensoriais",
                text: "Salas com texturas, sons, luzes e materiais que respeitam o ritmo sensorial de cada criança.",
                color: "text-gold bg-gold/15",
              },
              {
                icon: Heart,
                title: "Apoio emocional",
                text: "Escuta afetiva e acolhimento por profissionais e voluntários treinados para abraçar a diferença.",
                color: "text-action bg-action/10",
              },
              {
                icon: Brain,
                title: "Desenvolvimento cognitivo",
                text: "Atividades pedagógicas adaptadas que potencializam o aprendizado no tempo de cada criança.",
                color: "text-success bg-success/10",
              },
              {
                icon: HandHeart,
                title: "Suporte às famílias",
                text: "Rodas de conversa, orientação e rede de apoio para quem cuida — porque ninguém caminha sozinho.",
                color: "text-action bg-action/10",
              },
              {
                icon: Home,
                title: "Pertencimento",
                text: "Um espaço onde a criança e a família entram e logo descobrem: aqui também é casa.",
                color: "text-gold bg-gold/15",
              },
            ].map((p) => (
              <article
                key={p.title}
                className="bg-card border border-navy/5 rounded-3xl p-7 hover:border-action/40 hover:-translate-y-1 transition-all"
              >
                <div className={`size-12 rounded-2xl flex items-center justify-center ${p.color}`}>
                  <p.icon size={22} />
                </div>
                <h3 className="font-display text-xl font-black text-navy mt-5">{p.title}</h3>
                <p className="text-navy/65 text-sm mt-2 leading-relaxed">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MAIS QUE INCLUSÃO */}
      <section className="relative px-6 py-24 md:py-32 bg-navy text-background overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-gradient-to-br from-gold via-action to-success blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">A nossa essência</span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mt-6 leading-[0.95]">
            Mais que inclusão...
            <br />
            <span className="bg-gradient-to-r from-gold via-background to-gold bg-clip-text text-transparent">
              pertencimento.
            </span>
          </h2>
          <p className="text-background/75 text-xl md:text-2xl mt-8 leading-relaxed">
            Incluir é abrir a porta. <strong className="text-background">Pertencer</strong> é entrar
            e ouvir alguém dizer: <em className="text-gold">"a gente estava esperando por você."</em>
          </p>
          <p className="text-background/60 text-base md:text-lg mt-6 max-w-2xl mx-auto">
            É por isso que cada criança que cruza nossa porta deixa de ser "a criança diferente"
            e passa a ser, simplesmente, <strong className="text-background">a nossa criança</strong>.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="participe" className="px-6 py-24">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-action via-action to-navy rounded-[40px] p-10 md:p-16 text-background text-center shadow-2xl shadow-action/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 size-48 bg-gold/30 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 size-48 bg-success/30 blur-3xl rounded-full" />

          <div className="relative">
            <Heart size={40} className="mx-auto text-gold fill-gold mb-6" />
            <h2 className="font-display text-4xl md:text-6xl font-black leading-[0.95] uppercase italic">
              Participe.
              <br />
              Apoie.
              <br />
              <span className="text-gold">Transforme vidas.</span>
            </h2>
            <p className="text-background/85 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Cada doação, cada hora de voluntariado, cada compartilhamento ajuda uma criança
              neurodivergente a descobrir que ela é, sim, suficiente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                to="/doacoes"
                className="bg-gold text-navy px-8 py-5 rounded-xl font-black text-lg hover:scale-[1.03] transition-transform"
              >
                DOAR AGORA →
              </Link>
              <Link
                to="/cadastro"
                className="bg-background text-navy px-8 py-5 rounded-xl font-black text-lg hover:bg-gold transition-colors"
              >
                Ser voluntário
              </Link>
              <Link
                to="/contato"
                className="border-2 border-background/30 text-background px-8 py-5 rounded-xl font-black text-lg hover:bg-background hover:text-navy transition-all"
              >
                Falar com a gente
              </Link>
            </div>

            <p className="mt-10 text-background/60 text-sm font-bold uppercase tracking-widest">
              Porque toda criança merece pertencer.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
