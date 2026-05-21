import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ClubBadge } from "@/components/site/ClubBadge";
import { SERIE_A_CLUBS } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/completar-perfil")({
  component: CompletarPerfil,
  head: () => ({ meta: [
    { title: "Completar Perfil — Torcida Social" },
    { name: "description", content: "Finalize seu cadastro de torcedor na Torcida Social." },
  ]}),
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Nome muito curto").max(120),
  city: z.string().trim().min(2, "Informe sua cidade").max(80),
  phone: z.string().trim().min(8, "Informe seu telefone").max(30),
  birthDate: z.string().refine((value) => {
    const date = new Date(value);
    return value && !Number.isNaN(date.getTime()) && date < new Date();
  }, "Informe uma data de nascimento válida"),
  referredBy: z.string().trim().max(40).optional(),
});

function CompletarPerfil() {
  const navigate = useNavigate();
  const [clubId, setClubId] = useState("fla");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    city: "",
    phone: "",
    birthDate: "",
    referredBy: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setForm({
        fullName: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "",
        city: profile?.city || "",
        phone: profile?.phone || "",
        birthDate: profile?.birth_date || "",
        referredBy: profile?.referred_by || "",
      });
      setClubId(profile?.club_id || "fla");
      setChecking(false);
    }

    loadProfile();
  }, [navigate]);

  const set = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return toast.error("Sessão expirada. Entre novamente.");
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: parsed.data.fullName,
      city: parsed.data.city,
      club_id: clubId,
      phone: parsed.data.phone,
      birth_date: parsed.data.birthDate,
      referred_by: parsed.data.referredBy || null,
      referral_code: user.id.replaceAll("-", "").slice(0, 10).toUpperCase(),
      supporter_card_id: `TOR-${new Date().getFullYear()}-${user.id.replaceAll("-", "").slice(0, 6).toUpperCase()}`,
      supporter_card_status: "active",
      profile_completed: true,
    }, { onConflict: "id" });

    setLoading(false);

    if (error) {
      return toast.error(error.message);
    }

    toast.success("Perfil concluído com sucesso!");
    navigate({ to: "/perfil" });
  };

  const club = SERIE_A_CLUBS.find((item) => item.id === clubId)!;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Perfil do Torcedor"
        title="Finalize sua carteirinha."
        subtitle="Complete seus dados para ativar benefícios, ranking e indicação da Torcida Social."
      />

      <section className="px-6 py-16 max-w-5xl mx-auto grid lg:grid-cols-[1fr_340px] gap-10">
        <form onSubmit={submit} className="bg-card border border-navy/5 rounded-3xl p-8 md:p-10 space-y-6">
          {checking ? (
            <p className="font-bold text-navy/60">Carregando seus dados...</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nome completo" value={form.fullName} onChange={set("fullName")} required />
                <Field label="Cidade" value={form.city} onChange={set("city")} required />
                <Field label="Telefone/WhatsApp" value={form.phone} onChange={set("phone")} required />
                <Field label="Data de nascimento" type="date" value={form.birthDate} onChange={set("birthDate")} required />
                <Field label="Código de indicação" value={form.referredBy} onChange={set("referredBy")} placeholder="Opcional" className="md:col-span-2" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-3">Time do coração</label>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-4">
                  {SERIE_A_CLUBS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setClubId(item.id)}
                      className={`p-2 rounded-xl border-2 transition-all ${clubId === item.id ? "border-action scale-105" : "border-transparent hover:border-navy/10"}`}
                      aria-label={item.name}
                    >
                      <ClubBadge club={item} size={36} />
                    </button>
                  ))}
                </div>
              </div>

              <button disabled={loading} className="w-full bg-navy text-background py-5 rounded-xl font-black text-lg hover:bg-action transition-colors disabled:opacity-50">
                {loading ? "SALVANDO..." : "CONCLUIR PERFIL"}
              </button>
            </>
          )}
        </form>

        <aside className="bg-navy text-background rounded-3xl p-7 h-fit">
          <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Seu time</p>
          <div className="mt-4 flex items-center gap-4">
            <ClubBadge club={club} size={64} />
            <div>
              <p className="font-display text-2xl font-black">{club.name}</p>
              <p className="text-xs opacity-80">{club.city}</p>
            </div>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({ label, className = "", ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-2">{label}</span>
      <input
        {...props}
        className="w-full bg-surface border-2 border-navy/10 px-4 py-3 rounded-xl font-medium focus:border-action outline-none transition-colors"
      />
    </label>
  );
}
