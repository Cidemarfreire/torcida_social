import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ClubBadge } from "@/components/site/ClubBadge";
import { SERIE_A_CLUBS, ACHIEVEMENTS } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin } from "@/lib/auth";

export const Route = createFileRoute("/perfil")({
  component: Perfil,
  head: () => ({
    meta: [
      { title: "Meu Perfil — Torcida Social" },
      { name: "description", content: "Seu perfil de torcedor solidário." },
    ],
  }),
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
    avatar_url: string | null;
  } | null>(null);

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

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
      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select(
          "full_name, city, club_id, created_at, supporter_card_id, referral_code, avatar_url"
        )
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
      setAvatarUrl(data?.avatar_url || "");
      
      // Verificar se usuário é admin
      const adminCheck = await isAdmin();
      setIsUserAdmin(adminCheck);
      
      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  const club =
    SERIE_A_CLUBS.find((c) => c.id === profile?.club_id) || SERIE_A_CLUBS[0];

  const name = profile?.full_name || email || "Torcedor";

  const initials = useMemo(() => {
    return (
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "TS"
    );
  }, [name]);

  const since = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : new Date().getFullYear();

  const saveAvatar = async (event: React.FormEvent) => {
    event.preventDefault();
    setAvatarMessage(null);

    const nextAvatarUrl = avatarUrl.trim();

    if (nextAvatarUrl && !/^https?:\/\/.+/i.test(nextAvatarUrl)) {
      setAvatarMessage(
        "Informe uma URL de imagem começando com http:// ou https://"
      );
      return;
    }

    setSavingAvatar(true);

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: nextAvatarUrl || null })
      .eq("id", userId);

    setSavingAvatar(false);

    if (error) {
      setAvatarMessage(error.message);
      return;
    }

    setProfile((current) =>
      current ? { ...current, avatar_url: nextAvatarUrl || null } : current
    );

    setAvatarMessage(
      nextAvatarUrl
        ? "Avatar atualizado com sucesso."
        : "Avatar removido com sucesso."
    );
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setDeleteMessage(null);

    try {
      const { error } = await supabase
        .from("account_deletion_requests" as any)
        .insert([
          {
            user_id: userId,
            email: email,
            reason: "Solicitação via aplicativo",
            status: "pending",
          },
        ]);

      if (error) {
        setDeleteMessage(error.message);
        return;
      }

      await supabase.auth.signOut();
      navigate({ to: "/login" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao solicitar exclusão";
      setDeleteMessage(message);
    } finally {
      setDeletingAccount(false);
    }
  };

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
        style={{
          background: `linear-gradient(135deg, ${club.primary} 0%, ${club.secondary} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={name}
              className="size-28 rounded-3xl object-cover bg-background/15 backdrop-blur"
            />
          ) : (
            <div className="size-28 rounded-3xl bg-background/15 backdrop-blur grid place-items-center text-5xl font-display font-black">
              {initials}
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-80">
              Torcedor desde {since}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-black mt-2">
              {name}
            </h1>
            <p className="opacity-80 mt-1">{profile?.city || email}</p>
          </div>

          <div className="flex items-center gap-3 bg-background/10 backdrop-blur rounded-2xl p-4 px-6">
            <ClubBadge club={club} size={48} />
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">
                Time
              </p>
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
          <div
            key={s.label}
            className="bg-card border border-navy/5 rounded-2xl p-6 shadow-sm"
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">
              {s.label}
            </p>
            <p className="font-display text-3xl font-black mt-1 text-navy">
              {s.value}
            </p>
          </div>
        ))}
      </section>

      <section className="px-6 mb-16 max-w-7xl mx-auto">
        <form
          onSubmit={saveAvatar}
          className="bg-card border border-navy/5 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">
              Foto ou avatar
            </p>
            <p className="text-sm text-navy/60 mt-1">
              Cole a URL de uma imagem para personalizar seu perfil.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_auto] gap-3">
            <input
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://exemplo.com/minha-foto.jpg"
              className="w-full bg-surface border-2 border-navy/10 px-4 py-3 rounded-xl font-medium focus:border-action outline-none transition-colors"
            />

            <button
              type="submit"
              disabled={savingAvatar}
              className="bg-navy text-background px-6 py-3 rounded-xl font-black hover:bg-action transition-colors disabled:opacity-50"
            >
              {savingAvatar ? "SALVANDO..." : "SALVAR"}
            </button>

            <button
              type="button"
              disabled={savingAvatar || !avatarUrl}
              onClick={() => setAvatarUrl("")}
              className="border-2 border-navy/10 text-navy px-6 py-3 rounded-xl font-black hover:border-action transition-colors disabled:opacity-50"
            >
              REMOVER
            </button>
          </div>

          {avatarMessage && (
            <div className="bg-surface border border-navy/10 text-sm rounded-lg px-4 py-3 text-navy/70">
              {avatarMessage}
            </div>
          )}
        </form>
      </section>

      {isUserAdmin && (
        <section className="px-6 mb-16 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-navy via-[#1f3b63] to-action rounded-3xl p-8 shadow-2xl border border-gold/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
                  Administração · Torcida Social
                </p>

                <h2 className="font-display text-3xl md:text-4xl font-black text-background mt-3 leading-tight">
                  Painel Executivo
                </h2>

                <p className="text-background/75 mt-3 text-sm md:text-base leading-relaxed">
                  Acesse rapidamente métricas, notícias, arrecadações, núcleos
                  sociais, torcedores cadastrados e inteligência estratégica da
                  plataforma.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/admin"
                  className="bg-gold text-navy px-8 py-4 rounded-2xl font-black text-center hover:scale-[1.02] hover:opacity-95 transition-all shadow-xl"
                >
                  ACESSAR PAINEL ADMIN
                </a>

                <a
                  href="/noticias"
                  className="bg-background/10 backdrop-blur border border-background/20 text-background px-8 py-4 rounded-2xl font-black text-center hover:bg-background/20 transition-all"
                >
                  CENTRAL DE NOTÍCIAS
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 max-w-7xl mx-auto">
        <PageHero eyebrow="Conquistas" title="Suas medalhas." />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-8">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl p-5 text-center border ${
                a.unlocked
                  ? "bg-gold/10 border-gold/30"
                  : "bg-surface border-navy/5 opacity-50"
              }`}
            >
              <div
                className={`size-14 mx-auto rounded-full grid place-items-center text-2xl ${
                  a.unlocked ? "bg-gold text-navy" : "bg-navy/10"
                }`}
              >
                🏅
              </div>
              <p className="font-display font-black mt-3">{a.title}</p>
              <p className="text-xs text-navy/60 mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 mb-16 max-w-7xl mx-auto">
        <div className="bg-card border border-red-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-display text-xl font-black text-red-600 mb-2">
            Excluir minha conta
          </h3>
          <p className="text-sm text-navy/70 mb-4">
            Esta ação é permanente. Seus dados de perfil serão removidos e sua conta será excluída.
          </p>

          {!showDeleteConfirmation ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirmation(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-black hover:bg-red-700 transition-colors"
            >
              Excluir minha conta
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-red-600 font-bold">
                Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl font-black hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deletingAccount ? "Processando..." : "Confirmar exclusão"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setDeleteMessage(null);
                  }}
                  disabled={deletingAccount}
                  className="border-2 border-navy/10 text-navy px-6 py-3 rounded-xl font-black hover:border-action transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
              {deleteMessage && (
                <div className="bg-red-50 border border-red-200 text-sm rounded-lg px-4 py-3 text-red-700">
                  {deleteMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}