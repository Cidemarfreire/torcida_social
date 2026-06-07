import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
}

export function ShareButton({ 
  title = "Torcida Social",
  text = "O esporte que transforma vidas. Conheça o Torcida Social.",
  url 
}: ShareButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: currentUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      setShowOptions(!showOptions);
    }
  };

  const handleWhatsApp = () => {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${currentUrl}`)}`;
    window.open(shareUrl, "_blank");
    setShowOptions(false);
  };

  const handleFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(shareUrl, "_blank");
    setShowOptions(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowOptions(false);
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-navy/5 hover:bg-navy/10 border border-navy/10 hover:border-action px-4 py-2 rounded-full text-xs font-bold text-navy hover:text-action transition-all"
      >
        <Share2 size={16} />
        <span>Compartilhar</span>
      </button>

      {showOptions && (
        <div className="absolute bottom-full left-0 mb-2 bg-card border border-navy/10 rounded-xl shadow-lg p-2 min-w-[200px] z-50">
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy/5 text-left text-xs font-bold text-navy transition-colors"
          >
            <span className="text-green-600 font-bold">WhatsApp</span>
          </button>
          <button
            onClick={handleFacebook}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy/5 text-left text-xs font-bold text-navy transition-colors"
          >
            <span className="text-blue-600 font-bold">Facebook</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy/5 text-left text-xs font-bold text-navy transition-colors"
          >
            {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            <span>{copied ? "Copiado!" : "Copiar link"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
