import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/t/$slug")({
  component: InviteLanding,
});

function InviteLanding() {
  const { slug } = Route.useParams();
  const [copied, setCopied] = useState(false);

  const nome = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());

  const torcidaSocialLink = "https://www.multplen.com.br";

  const shareText = `${nome} está apoiando o Torcida Social. Conheça essa plataforma que transforma paixão pelo esporte em impacto social real para crianças, famílias e comunidades: ${torcidaSocialLink}`;

  async function copyShareText() {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function shareInstagram() {
    await navigator.clipboard.writeText(shareText);
    alert(
      "Texto copiado! Agora abra o Instagram e cole no story, direct ou publicação."
    );
    window.open("https://www.instagram.com/", "_blank");
  }

  function shareWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  }

  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        torcidaSocialLink
      )}`,
      "_blank"
    );
  }

  function shareEmail() {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      "Conheça o Torcida Social"
    )}&body=${encodeURIComponent(shareText)}`;
  }

  return (
    <main className="min-h-screen bg-background text-navy">
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-navy via-[#172d4f] to-[#071527] text-background rounded-[2rem] p-8 md:p-12 shadow-2xl border border-gold/20 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-action/20 rounded-full blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-[1fr_360px] gap-10 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
                Compartilhe o Torcida Social
              </p>

              <h1 className="font-display text-4xl md:text-6xl font-black mt-4 leading-tight">
                {nome} apoia essa transformação
              </h1>

              <p className="text-background/75 text-lg mt-6 max-w-3xl leading-relaxed">
                Ajude a espalhar o Torcida Social nas suas redes. Cada
                compartilhamento fortalece a missão de transformar paixão pelo
                esporte em impacto social real.
              </p>

              <div className="mt-8 bg-background/10 border border-background/10 rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gold">
                  Link oficial do projeto
                </p>
                <p className="text-sm text-background/80 mt-1 break-all">
                  {torcidaSocialLink}
                </p>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="bg-success text-background py-4 rounded-2xl font-black hover:scale-[1.02] transition-all"
                >
                  WhatsApp
                </button>

                <button
                  type="button"
                  onClick={shareInstagram}
                  className="bg-action text-background py-4 rounded-2xl font-black hover:scale-[1.02] transition-all"
                >
                  Instagram
                </button>

                <button
                  type="button"
                  onClick={shareFacebook}
                  className="bg-background/10 border border-background/20 text-background py-4 rounded-2xl font-black hover:bg-background/20 transition-all"
                >
                  Facebook
                </button>

                <button
                  type="button"
                  onClick={shareEmail}
                  className="bg-background/10 border border-background/20 text-background py-4 rounded-2xl font-black hover:bg-background/20 transition-all"
                >
                  Email
                </button>

                <button
                  type="button"
                  onClick={copyShareText}
                  className="bg-gold text-navy py-4 rounded-2xl font-black hover:scale-[1.02] hover:opacity-95 transition-all shadow-xl sm:col-span-2"
                >
                  {copied ? "Texto copiado!" : "Compartilhar o Torcida Social"}
                </button>
              </div>
            </div>

            <aside className="bg-background rounded-3xl p-6 shadow-2xl">
              <p className="text-[11px] font-bold uppercase tracking-widest text-action">
                QR Code do Torcida Social
              </p>

              <div className="mt-4 aspect-square rounded-2xl bg-white p-4 grid place-items-center border-4 border-gold/30">
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

              <p className="text-center text-xs text-navy/55 mt-4">
                Mostre, escaneie ou compartilhe o projeto com sua torcida.
              </p>

              <button
                type="button"
                onClick={copyShareText}
                className="mt-5 w-full bg-gold text-navy py-4 rounded-2xl font-black hover:opacity-90 transition-opacity"
              >
                {copied ? "Copiado!" : "Copiar texto de divulgação"}
              </button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}