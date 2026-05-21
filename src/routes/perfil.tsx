import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ClubBadge } from "@/components/site/ClubBadge";
import { SERIE_A_CLUBS, ACHIEVEMENTS } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/perfil")({
  component: Perfil,
  head: () => ({ meta: [{ title: "Meu Perfil — Torcida Social" }, { name: "description", content: "Seu perfil de torcedor solidário." }] }),
});

function Perfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    city: string | null;
    club_id: string | null;
    created_at: string;
    supporter_card_id: string | null;
    referral_code: string | null;
  } | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      setEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("full_name, city, club_id, created_at, supporter_card_id, referral_code")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  const club = SERIE_A_CLUBS.find((c) => c.id === profile?.club_id) || SERIE_A_CLUBS[0];
  const name = profile?.full_name || email || "Torcedor";
  const initials = useMemo(() => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "TS";
  }, [name]);
  const since = profile?.created_at ? new Date(profile.created_at).getFullYear() : new Date().getFullYear();

  if (loading) {
    return (
      <SiteLayout>
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <p className="font-bold text-navy/60">Carregando seu perfil...</p>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section
        className="px-6 pt-16 pb-32 text-background relative"
        style={{ background: `linear-gradient(135deg, ${club.primary} 0%, ${club.secondary} 100%)` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="size-28 rounded-3xl bg-background/15 backdrop-blur grid place-items-center text-5xl font-display font-black">
            {initials}
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-80">Torcedor desde {since}</p>
            <h1 className="font-display text-4xl md:text-5xl font-black mt-2">{name}</h1>
            <p className="opacity-80 mt-1">{profile?.city || email}</p>
          </div>
          <div className="flex items-center gap-3 bg-background/10 backdrop-blur rounded-2xl p-4 px-6">
            <ClubBadge club={club} size={48} />
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Time</p>
              <p className="font-display text-xl font-black">{club.name}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 -mt-20 mb-16 max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {[
          { label: "Carteirinha", value: profile?.supporter_card_id || "Pendente" },
          { label: "Código de indicação", value: profile?.referral_code || "Pendente" },
          { label: "Doações realizadas", value: 0 },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-navy/5 rounded-2xl p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">{s.label}</p>
            <p className="font-display text-3xl font-black mt-1 text-navy">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="px-6 max-w-7xl mx-auto">
        <PageHero eyebrow="Conquistas" title="Suas medalhas." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-8">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.id} className={`rounded-2xl p-5 text-center border ${a.unlocked ? "bg-gold/10 border-gold/30" : "bg-surface border-navy/5 opacity-50"}`}>
              <div className={`size-14 mx-auto rounded-full grid place-items-center text-2xl ${a.unlocked ? "bg-gold text-navy" : "bg-navy/10"}`}>
                🏅
              </div>
              <p className="font-display font-black mt-3">{a.title}</p>
              <p className="text-xs text-navy/60 mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
