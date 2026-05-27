import { Download } from "lucide-react";

type InstagramCardProps = {
  title: string;
  summary: string;
  topic?: string;
  cta?: string;
};

export function InstagramCard({
  title,
  summary,
  topic = "Torcida Social",
  cta = "Transformando paixão em impacto social",
}: InstagramCardProps) {
  function downloadCard() {
    const svg = `
      <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#071A33"/>
            <stop offset="55%" stop-color="#102B52"/>
            <stop offset="100%" stop-color="#D4AF37"/>
          </linearGradient>
        </defs>

        <rect width="1080" height="1080" fill="url(#bg)"/>

        <rect x="70" y="70" width="940" height="940" rx="48" fill="rgba(255,255,255,0.08)" stroke="#D4AF37" stroke-width="4"/>

        <text x="90" y="145" fill="#D4AF37" font-size="34" font-family="Arial" font-weight="700">
          TORCIDA SOCIAL
        </text>

        <text x="90" y="210" fill="#FFFFFF" font-size="28" font-family="Arial" font-weight="700">
          ${escapeXml(topic).toUpperCase()}
        </text>

        <foreignObject x="90" y="280" width="900" height="360">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial; color: white; font-size: 62px; line-height: 1.08; font-weight: 900;">
            ${escapeXml(title)}
          </div>
        </foreignObject>

        <foreignObject x="90" y="675" width="900" height="180">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial; color: rgba(255,255,255,0.88); font-size: 34px; line-height: 1.35; font-weight: 500;">
            ${escapeXml(summary)}
          </div>
        </foreignObject>

        <rect x="90" y="880" width="900" height="86" rx="24" fill="#D4AF37"/>
        <text x="125" y="935" fill="#071A33" font-size="30" font-family="Arial" font-weight="800">
          ${escapeXml(cta)}
        </text>

        <text x="90" y="1015" fill="rgba(255,255,255,0.75)" font-size="26" font-family="Arial" font-weight="700">
          www.multplen.com.br/noticias
        </text>
      </svg>
    `;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(title)}-torcida-social.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={downloadCard}
      className="bg-navy text-background px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-navy/90 transition-colors"
    >
      <Download size={14} />
      Baixar Card Instagram
    </button>
  );
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}