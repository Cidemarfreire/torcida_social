import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ShareButton } from "@/components/ShareButton";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/area-crianca")({
  component: AreaCrianca,
  head: () => ({ meta: [
    { title: "Cadastro Infantil — Torcida Social" },
    { name: "description", content: "Cadastro infantil, carteirinha digital e acompanhamento pedagógico das crianças da Torcida Social." },
  ]}),
});

function AreaCrianca() {
  const [form, setForm] = useState({
    childName: "",
    age: "",
    childCpf: "",
    school: "",
    nucleus: "",
    guardianName: "",
    guardianDocument: "",
    guardianEmail: "",
    guardianPhone: "",
    address: "",
    allergies: "",
    healthNotes: "",
    neuroNeeds: "",
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
      const { data: { user } } = await supabase.auth.getUser();

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

      // 1. Cadastra ou vincula o Responsável
      const { data: guardian, error: guardianError } = await supabase
        .from("guardians")
        .insert({
          user_id: user.id,
          full_name: form.guardianName.trim(),
          document_number: form.guardianDocument.trim(),
          email: form.guardianEmail.trim() || user.email || null,
          phone: form.guardianPhone.trim(),
          relationship: "legal_guardian",
        })
        .select("id")
        .single();

      if (guardianError) throw guardianError;

      // 2. Cadastra a Criança com os campos de Saúde e Documentos
      const { data: createdChild, error: childError } = await supabase
        .from("children")
        .insert({
          guardian_id: guardian.id,
          full_name: form.childName.trim(),
          age,
          child_cpf: form.childCpf.trim() || null,
          school: form.school.trim() || null,
          nucleus: form.nucleus.trim(),
          address: form.address.trim() || null,
          sports_interests: sports,
          allergies: form.allergies.trim() || null,
          health_notes: form.healthNotes.trim() || null,
          neuro_needs: form.neuroNeeds.trim() || null,
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

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.type === "checkbox" ? (event.target as HTMLInputElement).checked : event.target.value;
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
        eyebrow="Formulário de Ingresso"
        title={<>Cada criança é <span className="text-success">titular</span> dessa torcida.</>}
        subtitle="Preenchimento obrigatório pelo responsável legal para emissão da carteirinha e controle de saúde."
      />

      <section className="px-6 py-16 max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-10">
        <form className="bg-card border border-navy/5 rounded-3xl p-8 md:p-10 space-y-6" onSubmit={submit}>
          <h2 className="font-display text-2xl font-black">Ficha de Cadastro Oficial</h2>
          
          {/* SEÇÃO 1: DADOS DA CRIANÇA */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-action border-b pb-1">1. Dados da Criança</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nome completo da criança" required value={form.childName} onChange={update("childName")} />
              <Field label="Idade" type="number" required min={0} max={17} value={form.age} onChange={update("age")} />
              <Field label="CPF da Criança (Se houver)" value={form.childCpf} onChange={update("childCpf")} placeholder="000.000.000-00" />
              <Field label="Núcleo de Atendimento" required value={form.nucleus} onChange={update("nucleus")} placeholder="Ex: Teresópolis Hub" />
              <Field label="Escola / Colégio" className="md:col-span-2" value={form.school} onChange={update("school")} />
            </div>
          </div>

          {/* SEÇÃO 2: SAÚDE E NEURONECESSIDADES */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-success border-b pb-1">2. Ficha Médica e Cuidados de Saúde</h3>
            <div className="grid md:grid-cols-1 gap-4">
              <AreaField label="Alergias (Restrições alimentares ou medicamentosas)" value={form.allergies} onChange={update("allergies")} placeholder="Caso não tenha, deixe em branco ou digite 'Nenhuma'." />
              <AreaField label="Neuronecessidades / Condições de Desenvolvimento" value={form.neuroNeeds} onChange={update("neuroNeeds")} placeholder="Ex: Autismo (TEA), TDAH, Síndrome de Down, etc. (Essencial para adaptarmos os treinos e monitoramento)" />
              <AreaField label="Outras anotações importantes sobre a saúde" value={form.healthNotes} onChange={update("healthNotes")} placeholder="Histórico médico relevante, medicamentos contínuos, etc." />
            </div>
          </div>

          {/* SEÇÃO 3: RESPONSÁVEL LEGAL */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy/70 border-b pb-1">3. Dados do Responsável Legal</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nome completo do responsável" required value={form.guardianName} onChange={update("guardianName")} />
              <Field label="RG ou CPF do responsável" required value={form.guardianDocument} onChange={update("guardianDocument")} placeholder="Documento de identificação" />
              <Field label="WhatsApp / Telefone" required value={form.guardianPhone} onChange={update("guardianPhone")} placeholder="(00) 00000-0000" />
              <Field label="E-mail" type="email" value={form.guardianEmail} onChange={update("guardianEmail")} />
              <Field label="Endereço Residencial Completo" className="md:col-span-2" value={form.address} onChange={update("address")} />
            </div>
          </div>

          {/* MODALIDADES */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-2">Modalidades de Interesse</label>
            <div className="flex flex-wrap gap-2">
              {["Futebol de campo", "Futsal", "Vôlei", "Basquete", "Judô", "Natação", "Atletismo"].map((s) => (
                <label key={s} className="cursor-pointer bg-surface border-2 border-navy/10 rounded-full px-4 py-2 text-sm font-bold hover:border-action transition-colors">
                  <input type="checkbox" checked={sports.includes(s)} onChange={() => toggleSport(s)} className="mr-2 accent-action" /> {s}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-navy/70 pt-2">
            <input type="checkbox" checked={form.consent} onChange={update("consent")} className="mt-1 accent-action" />
            Autorizo, na condição de responsável legal, o cadastro, monitoramento de saúde e participação nas atividades.
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button disabled={loading} className="w-full bg-navy text-background py-5 rounded-xl font-black text-lg hover:bg-action transition-colors disabled:opacity-50">
            {loading ? "EMITINDO FICHA..." : "SALVAR E EMITIR CARTEIRINHA"}
          </button>
        </form>

        {/* PREVIEW DA CARTEIRINHA */}
        <aside>
          <div className="bg-navy text-background rounded-3xl p-6 sticky top-28">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Carteirinha Digital</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-background/15 grid place-items-center text-2xl font-display font-black">
                {child ? initials(child.full_name) : "TS"}
              </div>
              <div>
                <p className="font-display font-black text-xl">
                  {child ? child.full_name : "Aguardando preenchimento"}
                </p>
                <p className="text-xs opacity-70">
                  {child ? `${child.age ?? "-"} anos · ${child.nucleus}` : "Será gerada em tempo real"}
                </p>
              </div>
            </div>
            <div className="mt-6 aspect-square bg-background rounded-2xl grid place-items-center text-navy">
              {card ? (
                <QRCodeSVG value={validationUrl} size={220} level="M" includeMargin fgColor="#061A40" bgColor="#FFFFFF" />
              ) : (
                <p className="text-sm font-bold text-center px-6">QR Code de validação do projeto.</p>
              )}
            </div>
            <p className="text-[10px] font-mono mt-3 opacity-60 text-center">
              ID #{card?.display_id ?? "TS-0000-000000"}
            </p>
          </div>
        </aside>
      </section>

      <section className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex justify-end">
          <ShareButton />
        </div>
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

function AreaField({ label, className = "", ...props }: { label: string; className?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-2">{label}</span>
      <textarea {...props} rows={2} className="w-full bg-surface border-2 border-navy/10 px-4 py-3 rounded-xl font-medium focus:border-action outline-none resize-none" />
    </label>
  );
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}