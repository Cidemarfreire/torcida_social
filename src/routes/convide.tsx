import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ME } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/convide")({
  component: Convide,
  head: () => ({
    meta: [
      { title: "Convide sua Torcida — Torcida Social" },
      {
        name: "description",
        content:
          "Compartilhe seu link único e leve mais torcedores para a maior torcida solidária do Brasil.",
      },
    ],
  }),
});

function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "torcida-social"
  );
}

function Convide() {
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState("torcida-social");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      setUserName(slugify(data?.full_name || user.email || "torcida-social"));
    }

    loadUser();
  }, []);

  const inviteLink = `https://www.multplen.com.br/t/${userName}`;

  const inviteText = `Eu entrei para a Torcida Social! Aqui a paixão pelo esporte vira impacto social real. Cadastre-se pelo meu link e venha fortalecer essa corrente: ${inviteLink}`;

  async function copyInvite() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function shareInstagram() {
    await navigator.clipboard.writeText(inviteText);
    alert(
      "Legenda copiada! Agora abra o Instagram e cole no story, direct ou publicação."
    );
    window.open("https://www.instagram.com/", "_blank");
  }

  function shareWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(inviteText)}`,
      "_blank"
    );
  }

  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        inviteLink
      )}`,
      "_blank"
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Convide sua Torcida"
        title={
          <>
            Leve seu time <span className="text-gold">ao topo</span>.
          </>
        }
        subtitle="Cada amigo cadastrado vira ponto no seu placar. Cada doação validada vira medalha."
      />

      <section className="px-6 py-16 max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="bg-card border border-navy/5 rounded-3xl p-8 md:p-10 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">
            Seu link exclusivo
          </p>

          <div className="mt-3 flex flex-col md:flex-row gap-3">
            <code className="flex-1 bg-surface border-2 border-navy/10 rounded-xl px-4 py-4 font-mono text-sm break-all">
              {inviteLink}
            </code>

            <button
              type="button"
              onClick={copyInvite}
              className="bg-navy text-background px-6 py-4 rounded-xl font-bold hover:bg-action transition-colors"
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={shareWhatsApp}
              className="bg-success text-background py-4 rounded-xl font-bold hover:scale-[1.02] transition-all"
            >
              Compartilhar no WhatsApp
            </button>

            <button
              type="button"
              onClick={shareInstagram}
              className="bg-action text-background py-4 rounded-xl font-bold hover:scale-[1.02] transition-all"
            >
              Compartilhar no Instagram
            </button>

            <button
              type="button"
              onClick={shareFacebook}
              className="bg-navy text-background py-4 rounded-xl font-bold hover:scale-[1.02] transition-all"
            >
              Compartilhar no Facebook
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                goal: "Convide 3 amigos",
                progress: 2,
                of: 3,
                prize: "+200 pts",
              },
              {
                goal: "5 doações validadas",
                progress: 3,
                of: 5,
                prize: "Badge Capitão",
              },
              {
                goal: "Leve seu time ao top 10",
                progress: 1,
                of: 1,
                prize: "Selo Lenda",
              },
            ].map((g) => (
              <div
                key={g.goal}
                className="bg-surface border border-navy/5 rounded-2xl p-5"
              >
                <p className="text-xs font-bold text-navy/60">{g.goal}</p>

                <div className="h-2 bg-navy/10 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-success"
                    style={{ width: `${(g.progress / g.of) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] mt-2 font-bold text-action">
                  {g.prize}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-gradient-to-br from-navy via-[#172d4f] to-[#071527] text-background rounded-3xl p-7 sticky top-28 h-fit shadow-2xl border border-gold/20 overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-gold/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gold">
              Convite Digital
            </p>

            <h2 className="font-display text-2xl font-black mt-2">
              QR Code do {ME.name}
            </h2>

            <p className="text-background/65 text-sm mt-2">
              Mostre este código para alguém se cadastrar rapidamente na sua
              torcida.
            </p>

            <div className="mt-6 bg-background rounded-3xl p-5 shadow-xl">
              <div className="aspect-square rounded-2xl bg-white p-4 grid place-items-center border-4 border-gold/30">
                <div className="grid grid-cols-10 gap-0.5 w-full">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className={
                        (i * 13) % 5 < 2
                          ? "aspect-square bg-navy"
                          : "aspect-square bg-white"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 bg-background/10 border border-background/10 rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gold">
                Link exclusivo
              </p>

              <p className="text-xs text-background/75 mt-1 break-all">
                {inviteLink}
              </p>
            </div>

            <button
              type="button"
              onClick={copyInvite}
              className="mt-5 w-full bg-gold text-navy py-4 rounded-2xl font-black hover:scale-[1.02] hover:opacity-95 transition-all shadow-xl"
            >
              {copied ? "Link copiado!" : "Copiar link do QR"}
            </button>

            <button
              type="button"
              onClick={shareWhatsApp}
              className="mt-3 w-full bg-success text-background py-4 rounded-2xl font-black hover:scale-[1.02] transition-all"
            >
              Enviar convite no WhatsApp
            </button>

            <p className="text-center text-xs text-background/45 mt-4">
              Cada convite fortalece sua posição no ranking solidário.
            </p>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}