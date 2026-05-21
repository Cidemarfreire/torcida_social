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
