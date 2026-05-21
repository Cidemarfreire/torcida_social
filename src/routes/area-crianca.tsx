import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/area-crianca")({
  component: AreaCrianca,
  head: () => ({ meta: [
    { title: "Área da Criança — Torcida Social" },
    { name: "description", content: "Cadastro infantil, carteirinha digital e acompanhamento pedagógico das crianças da Torcida Social." },
  ]}),
});

function AreaCrianca() {
  const [form, setForm] = useState({
    childName: "",
    age: "",
    school: "",
    nucleus: "",
    guardianName: "",
    guardianDocument: "",
    guardianEmail: "",
    guardianPhone: "",
    address: "",
    consent: false,
  });
  const [sports, setSports] = useState<string[]>([]);
  const [card, setCard] = useState<Tables<"child_digital_cards"> | null>(null);
  const [child, setChild] = useState<Tables<"children"> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validationUrl = card
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/validar-carteirinha?codigo=${card.public_code}`
    : "";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Entre na sua conta para cadastrar uma criança.");
      }

      if (!form.consent) {
        throw new Error("A autorização do responsável legal é obrigatória.");
      }

      const age = Number(form.age);
      if (!Number.isInteger(age) || age < 0 || age > 17) {
        throw new Error("Informe uma idade válida entre 0 e 17 anos.");
      }

      const { data: guardian, error: guardianError } = await supabase
        .from("guardians")
        .insert({
          user_id: user.id,
          full_name: form.guardianName.trim(),
          document_number: form.guardianDocument.trim() || null,
          email: form.guardianEmail.trim() || user.email || null,
          phone: form.guardianPhone.trim(),
          relationship: "legal_guardian",
        })
        .select("id")
        .single();

      if (guardianError) throw guardianError;

      const { data: createdChild, error: childError } = await supabase
        .from("children")
        .insert({
          guardian_id: guardian.id,
          full_name: form.childName.trim(),
          age,
          school: form.school.trim() || null,
          nucleus: form.nucleus.trim(),
          address: form.address.trim() || null,
          sports_interests: sports,
        })
        .select("*")
        .single();

      if (childError) throw childError;

      const consentText = "Autorizo, na condição de responsável legal, o cadastro da criança na Torcida Social, a emissão de carteirinha digital e o uso dos dados informados para identificação, participação em atividades, acompanhamento pedagógico/social e validação segura de benefícios.";
      const { error: consentError } = await supabase
        .from("child_consents")
        .insert({
          child_id: createdChild.id,
          guardian_id: guardian.id,
          consent_text: consentText,
          accepted: true,
          accepted_at: new Date().toISOString(),
        });

      if (consentError) throw consentError;

      const { data: generatedCard, error: cardError } = await supabase.rpc("generate_child_card", {
        _child_id: createdChild.id,
      });

      if (cardError) throw cardError;

      setChild(createdChild);
      setCard(generatedCard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar criança.");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleSport = (sport: string) => {
    setSports((current) =>
      current.includes(sport)
        ? current.filter((item) => item !== sport)
        : [...current, sport],
    );
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Área da Criança"
        title={<>Cada criança é <span className="text-success">titular</span> dessa torcida.</>}
        subtitle="Cadastro com autorização do responsável, carteirinha digital, acesso a benefícios e acompanhamento pedagógico."
      />

      <section className="px-6 py-16 max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-10">
        <form className="bg-card border border-navy/5 rounded-3xl p-8 md:p-10 space-y-5" onSubmit={submit}>
          <h2 className="font-display text-2xl font-black">Novo cadastro</h2>
          <p className="text-sm text-navy/60">Preenchimento pelo responsável legal autenticado.</p>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nome da criança" required value={form.childName} onChange={update("childName")} />
            <Field label="Idade" type="number" required min={0} max={17} value={form.age} onChange={update("age")} />
            <Field label="Escola" value={form.school} onChange={update("school")} />
            <Field label="Núcleo" required value={form.nucleus} onChange={update("nucleus")} />
            <Field label="Nome do responsável" required value={form.guardianName} onChange={update("guardianName")} />
            <Field label="Documento do responsável" value={form.guardianDocument} onChange={update("guardianDocument")} />
            <Field label="E-mail do responsável" type="email" value={form.guardianEmail} onChange={update("guardianEmail")} />
            <Field label="WhatsApp do responsável" required value={form.guardianPhone} onChange={update("guardianPhone")} />
            <Field label="Endereço" className="md:col-span-2" value={form.address} onChange={update("address")} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-2">Interesses esportivos</label>
            <div className="flex flex-wrap gap-2">
              {["Futebol de campo", "Futsal", "Vôlei", "Basquete", "Judô", "Natação", "Atletismo"].map((s) => (
                <label key={s} className="cursor-pointer bg-surface border-2 border-navy/10 rounded-full px-4 py-2 text-sm font-bold hover:border-action transition-colors">
                  <input type="checkbox" checked={sports.includes(s)} onChange={() => toggleSport(s)} className="mr-2 accent-action" /> {s}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-navy/70">
            <input type="checkbox" checked={form.consent} onChange={update("consent")} className="mt-1 accent-action" />
            Autorizo, na condição de responsável legal, o cadastro e participação nas atividades.
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button disabled={loading} className="w-full bg-navy text-background py-5 rounded-xl font-black text-lg hover:bg-action transition-colors disabled:opacity-50">
            {loading ? "EMITINDO..." : "EMITIR CARTEIRINHA DIGITAL"}
          </button>
        </form>

        <aside>
          <div className="bg-navy text-background rounded-3xl p-6 sticky top-28">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Carteirinha Digital</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-background/15 grid place-items-center text-2xl font-display font-black">
                {child ? initials(child.full_name) : "TS"}
              </div>
              <div>
                <p className="font-display font-black text-xl">
                  {child ? child.full_name : "Aguardando cadastro"}
                </p>
                <p className="text-xs opacity-70">
                  {child ? `${child.age ?? "-"} anos · ${child.nucleus}` : "Carteirinha emitida após salvar"}
                </p>
              </div>
            </div>
            <div className="mt-6 aspect-square bg-background rounded-2xl grid place-items-center text-navy">
              {card ? (
                <QRCodeSVG
                  value={validationUrl}
                  size={220}
                  level="M"
                  includeMargin
                  fgColor="#061A40"
                  bgColor="#FFFFFF"
                />
              ) : (
                <p className="text-sm font-bold text-center px-6">QR Code de validação será gerado aqui.</p>
              )}
            </div>
            <p className="text-[10px] font-mono mt-3 opacity-60 text-center">
              ID #{card?.display_id ?? "TS-0000-000000"}
            </p>
            {card && (
              <a href={validationUrl} target="_blank" rel="noreferrer" className="block text-center text-xs font-bold text-gold mt-3 underline">
                Validar carteirinha
              </a>
            )}
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
      <input {...props} className="w-full bg-surface border-2 border-navy/10 px-4 py-3 rounded-xl font-medium focus:border-action outline-none" />
    </label>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

