import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ClubBadge } from "@/components/site/ClubBadge";
import { SERIE_A_CLUBS } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastro")({
  component: Cadastro,
  head: () => ({
    meta: [
      { title: "Cadastro do Torcedor — Torcida Social" },
      { name: "description", content: "Crie sua conta na Torcida Social, escolha seu time do coração e comece a transformar vidas." },
    ],
  }),
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Nome muito curto").max(120),
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
  city: z.string().trim().min(2, "Informe sua cidade").max(80),
  phone: z.string().trim().min(8, "Informe seu telefone").max(30),
  birthDate: z.string().refine((value) => {
    const date = new Date(value);
    return value && !Number.isNaN(date.getTime()) && date < new Date();
  }, "Informe uma data de nascimento válida"),
  referredBy: z.string().trim().max(40).optional(),
});

function Cadastro() {
  const navigate = useNavigate();
  const [clubId, setClubId] = useState("fla");
  const club = SERIE_A_CLUBS.find((c) => c.id === clubId)!;
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    city: "",
    phone: "",
    birthDate: "",
    referredBy: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: parsed.data.fullName,
          city: parsed.data.city,
          club_id: clubId,
          phone: parsed.data.phone,
          birth_date: parsed.data.birthDate,
          referred_by: parsed.data.referredBy || null,
        },
      },
    });
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: parsed.data.fullName,
        city: parsed.data.city,
        club_id: clubId,
        phone: parsed.data.phone,
        birth_date: parsed.data.birthDate,
        referred_by: parsed.data.referredBy || null,
        referral_code: data.user.id.replaceAll("-", "").slice(0, 10).toUpperCase(),
        supporter_card_id: `TOR-${new Date().getFullYear()}-${data.user.id.replaceAll("-", "").slice(0, 6).toUpperCase()}`,
        supporter_card_status: "active",
        profile_completed: true,
      }, { onConflict: "id" });

      if (profileError) {
        setLoading(false);
        return toast.error(`Conta criada, mas houve erro ao salvar o perfil: ${profileError.message}`);
      }
    }
    setLoading(false);
    toast.success("Conta criada! Verifique seu e-mail para confirmar.");
    navigate({ to: "/perfil" });
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/completar-perfil",
    });
    if (result.error) return toast.error("Falha no login com Google");
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Cadastro"
        title={<>Entre em campo <span className="text-action">pela maior torcida</span> do Brasil.</>}
        subtitle="Cadastre-se em 30 segundos. Escolha seu time, ganhe sua carteirinha digital e suba no ranking."
      />

      <section className="px-6 py-16 max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-10">
        <form onSubmit={handleSubmit} className="bg-card border border-navy/5 rounded-3xl p-8 md:p-10 space-y-6">
          <button type="button" onClick={handleGoogle} className="w-full py-3 rounded-xl border-2 border-navy/10 font-bold text-sm hover:border-action transition-colors flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Cadastrar com Google
          </button>

          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-navy/40 font-bold">
            <div className="flex-1 h-px bg-navy/10" /> ou <div className="flex-1 h-px bg-navy/10" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nome completo" value={form.fullName} onChange={set("fullName")} placeholder="Como aparece no documento" required />
            <Field label="E-mail" type="email" value={form.email} onChange={set("email")} placeholder="voce@exemplo.com" required />
            <Field label="Senha" type="password" value={form.password} onChange={set("password")} placeholder="Mínimo 6 caracteres" required />
            <Field label="Cidade" value={form.city} onChange={set("city")} placeholder="Sua cidade" required />
            <Field label="Telefone/WhatsApp" value={form.phone} onChange={set("phone")} placeholder="(00) 00000-0000" required />
            <Field label="Data de nascimento" type="date" value={form.birthDate} onChange={set("birthDate")} required />
            <Field label="Código de indicação" value={form.referredBy} onChange={set("referredBy")} placeholder="Opcional" className="md:col-span-2" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-3">Time do coração</label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-4">
              {SERIE_A_CLUBS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setClubId(c.id)}
                  className={`p-2 rounded-xl border-2 transition-all ${clubId === c.id ? "border-action scale-105" : "border-transparent hover:border-navy/10"}`}
                  aria-label={c.name}
                >
                  <ClubBadge club={c} size={36} />
                </button>
              ))}
            </div>
            <div
              className="rounded-2xl p-5 flex items-center gap-4 text-background"
              style={{ background: `linear-gradient(135deg, ${club.primary}, ${club.secondary})` }}
            >
              <ClubBadge club={club} size={56} />
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Seu time</p>
                <p className="font-display text-2xl font-black">{club.name}</p>
                <p className="text-xs opacity-80">{club.city}</p>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-navy text-background py-5 rounded-xl font-black text-lg hover:bg-action transition-colors disabled:opacity-50">
            {loading ? "CRIANDO..." : "CRIAR MINHA CONTA"}
          </button>

          <p className="text-[11px] text-navy/40 text-center">
            Ao se cadastrar, você concorda com nossa <Link to="/privacidade" className="underline">Política de Privacidade</Link> e os <Link to="/termos" className="underline">Termos de Uso</Link>.
          </p>
          <p className="text-sm text-navy/60 text-center">
            Já tem conta? <Link to="/login" className="text-action font-bold">Entrar</Link>
          </p>
        </form>

        <aside className="space-y-6">
          <div className="bg-navy text-background rounded-3xl p-7">
            <h3 className="font-display text-xl font-black uppercase italic">O que você ganha</h3>
            <ul className="mt-5 space-y-3 text-sm text-background/80">
              <li>🏅 Carteirinha digital com QR Code</li>
              <li>📊 Painel "Meu Impacto" personalizado</li>
              <li>🏆 Pontos no ranking do seu clube</li>
              <li>🎁 Benefícios em farmácias, cinemas e mais</li>
              <li>📣 Link de indicação único</li>
            </ul>
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
