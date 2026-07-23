import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Camera } from "lucide-react";
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

type Profile = {
  full_name: string | null;
  city: string | null;
  club_id: string | null;
  created_at: string;
  supporter_card_id: string | null;
  referral_code: string | null;
  avatar_url: string | null;
};

function Perfil() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  async function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !userId) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setAvatarMessage("Formato não suportado. Use JPG, PNG ou WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarMessage("Arquivo muito grande. Máximo permitido: 2MB.");
      event.target.value = "";
      return;
    }

    setUploadingAvatar(true);
    setAvatarMessage(null);

    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      setProfile((current) =>
        current ? { ...current, avatar_url: avatarUrl } : current
      );

      setAvatarMessage("Foto atualizada com sucesso!");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a foto.";
      setAvatarMessage(message);
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  }

  async function handleDeleteAccount() {
    setDeletingAccount(true);
    setDeleteMessage(null);

    try {
      const { error } = await supabase
        .from("account_deletion_requests" as any)
        .insert([
          {
            user_id: userId,
            email,
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
      const message =
        err instanceof Error ? err.message : "Erro ao solicitar exclusão";
      setDeleteMessage(message);
    } finally {
      setDeletingAccount(false);
    }
  }

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
          <div className="relative flex flex-col items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="relative group"
              title="Alterar foto"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={name}
                  className="size-28 rounded-full object-cover bg-background/15 backdrop-blur border-4 border-background shadow-xl"
                />
              ) : (
                <div className="size-28 rounded-full bg-background/15 backdrop-blur grid place-items-center text-5xl font-display font-black border-4 border-background shadow-xl">
                  {initials}
                </div>
              )}

              <div className="absolute bottom-1 right-1 bg-gold text-navy p-3 rounded-full shadow-lg group-hover:bg-action group-hover:text-background transition-colors border-2 border-background">
                <Camera size={18} />
              </div>
            </button>

            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full backdrop-blur-sm">
                <span className="text-xs font-black text-navy">
                  Enviando...
                </span>
              </div>
            )}

            {avatarMessage && (
              <p className="mt-3 max-w-56 text-center text-xs font-bold text-background/90">
                {avatarMessage}
              </p>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-80">
              Torcedor desde {since}
            </p>

            <h1 className="font-display text-4xl md:text-5xl font-black mt-2">
              {name}
            </h1>

            <p className="opacity-80 mt-1">{profile?.city || email}</p>

            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="mt-3 rounded-full bg-background/15 px-5 py-2 text-xs font-black text-background hover:bg-background/25 transition-colors disabled:opacity-50"
            >
              {uploadingAvatar ? "Enviando..." : "Alterar foto"}
            </button>
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
          {
            label: "Carteirinha",
            value: profile?.supporter_card_id || "Pendente",
          },
          {
            label: "Código de indicação",
            value: profile?.referral_code || "Pendente",
          },
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
        <div className="bg-card border border-navy/5 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">
              Foto ou avatar
            </p>
            <p className="text-sm text-navy/60 mt-1">
              Escolha uma foto ou avatar para personalizar seu perfil.
            </p>
          </div>

          {avatarMessage && (
            <div className="bg-surface border border-navy/10 text-sm rounded-lg px-4 py-3 text-navy/70">
              {avatarMessage}
            </div>
          )}
        </div>
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
                <Link
                  to={"/painel-executivo" as any}
                  data-testid="perfil-link-painel-admin"
                  className="bg-gold text-navy px-8 py-4 rounded-2xl font-black text-center hover:scale-[1.02] hover:opacity-95 transition-all shadow-xl"
                >
                  PAINEL ADMIN
                </Link>
                
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
            Esta ação é permanente. Seus dados de perfil serão removidos e sua
            conta será excluída.
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
                Tem certeza que deseja excluir sua conta? Esta ação não pode ser
                desfeita.
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