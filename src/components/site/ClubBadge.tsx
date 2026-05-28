import type { Club } from "@/lib/mock-data";

export function ClubBadge({ club, size = 40 }: { club: Club; size?: number }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center font-display font-black shadow-inner"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${club.primary}, ${club.secondary})`,
        color: "#fff",
        fontSize: size * 0.32,
        textShadow: "0 1px 2px rgba(0,0,0,0.4)",
      }}
      aria-label={club.name}
    >
      {club.short}
    </div>
  );
}
import { ArrowLeft, ArrowRight, Share2 } from "lucide-react";

type PageActionsProps = {
  nextHref?: string;
  nextLabel?: string;
};

export function PageActions({
  nextHref = "/",
  nextLabel = "Seguir",
}: PageActionsProps) {
  function handleBack() {
    window.history.back();
  }

  async function handleShare() {
    const shareData = {
      title: document.title || "Torcida Social",
      text: "Conheça o Torcida Social: paixão que gera impacto social.",
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    alert("Link copiado para compartilhar.");
  }

  return (
    <div className="sticky bottom-4 z-50 mx-auto mt-12 flex max-w-3xl items-center justify-center gap-3 px-4">
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl transition hover:bg-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl transition hover:bg-slate-100"
      >
        <Share2 className="h-4 w-4" />
        Compartilhar
      </button>

      <a
        href={nextHref}
        className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl transition hover:bg-yellow-300"
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}