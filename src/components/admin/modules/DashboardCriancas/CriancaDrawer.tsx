import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CriancaTimeline } from "./CriancaTimeline";
import type { ChildProfile } from "./types";

type Props = {
  child: ChildProfile;
  onClose: () => void;
  onUpdate: (updatedChild: ChildProfile) => void;
};

export function CriancaDrawer({ child, onClose, onUpdate }: Props) {
  const [status, setStatus] = useState<"active" | "pending" | "inactive">(child.status);
  const [observations, setObservations] = useState(child.observations || "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveChanges() {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("children_profiles")
        .update({
          status: status,
          observations: observations,
        })
        .eq("id", child.id);

      if (error) throw error;

      // Atualiza o estado global na aplicação sem precisar recarregar a página
      onUpdate({
        ...child,
        status: status,
        observations: observations,
      });
      
      alert("Prontuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar prontuário:", error);
      alert("Houve um erro ao salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm flex justify-end">
      <aside className="h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* CABEÇALHO */}
        <div className="sticky top-0 bg-white border-b border-navy/10 p-6 flex items-center justify-between z-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] font-black text-action">
              Prontuário Social
            </p>
            <h3 className="font-display text-2xl font-black text-navy mt-1">
              {child.fullName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-success text-white px-5 py-2 text-xs font-black rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-surface px-4 py-2 text-xs font-black text-navy hover:bg-navy hover:text-white transition"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* CONTEÚDO FLOANTE */}
        <div className="p-6 space-y-6 flex-1">
          {/* PAINEL DE CONTROLE DE STATUS */}
          <section className="rounded-3xl bg-navy text-white p-6 shadow-sm">
            <h4 className="font-display text-lg font-black text-gold">
              ⚙️ Controle Administrativo
            </h4>
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-white/70 font-bold">Status de Matrícula</p>
                <p className="text-xs text-white/50 mt-1">Determine a situação desta criança nos núcleos.</p>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="pending" className="text-navy font-bold">🟡 Pendente / Análise</option>
                <option value="active" className="text-navy font-bold">🟢 Ativo / Matriculado</option>
                <option value="inactive" className="text-navy font-bold">🔴 Inativo / Afastado</option>
              </select>
            </div>
          </section>

          {/* DADOS GERAIS */}
          <section className="rounded-3xl bg-surface p-6">
            <h4 className="font-display text-xl font-black text-navy">
              👦 Dados Gerais
            </h4>
            <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
              <Info label="Nome" value={child.fullName} />
              <Info label="Idade" value={`${child.age} anos`} />
              <Info label="Gênero" value={child.gender || "Não informado"} />
              <Info label="Núcleo" value={child.nucleus} />
              <Info label="Escola" value={child.school || "Não informado"} />
              <Info label="Série" value={child.grade || "Não informado"} />
              <Info label="Categoria" value={child.category || "Não informado"} />
              <Info label="Professor" value={child.teacher || "Não informado"} />
            </div>
          </section>

          {/* RESPONSÁVEL */}
          <section className="rounded-3xl bg-surface p-6">
            <h4 className="font-display text-xl font-black text-navy">
              👨‍👩‍👧 Responsável Legal
            </h4>
            <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
              <Info label="Nome" value={child.guardian.name} />
              <Info label="Parentesco" value={child.guardian.relationship || "Não informado"} />
              <Info label="WhatsApp" value={child.guardian.whatsapp} />
              <Info label="Telefone emergência" value={child.guardian.emergencyPhone || "Não informado"} />
              <Info label="E-mail" value={child.guardian.email || "Não informado"} />
            </div>
          </section>

          {/* SAÚDE E CUIDADOS */}
          <section className="rounded-3xl bg-red-50 border border-red-100 p-6">
            <h4 className="font-display text-xl font-black text-red-700">
              🩺 Saúde e Cuidados Especiais
            </h4>
            <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
              <Info label="Tipo sanguíneo" value={child.health.bloodType || "Não informado"} />
              <Info label="Alergias" value={child.health.allergies || "Não informado"} />
              <Info label="Condições médicas" value={child.health.medicalConditions || "Não informado"} />
              <Info label="CID" value={child.health.cid || "Não informado"} />
              <Info label="Medicamentos" value={child.health.medications || "Não informado"} />
              <Info label="Horários" value={child.health.medication_schedule || "Não informado"} />
              <Info label="Cuidados especiais" value={child.health.specialCare || "Não informado"} />
              <Info label="Restrições" value={child.health.restrictions || "Não informado"} />
            </div>
          </section>

          {/* OBSERVADORES E HISTÓRICO SOCIAL */}
          <section className="rounded-3xl bg-surface p-6">
            <h4 className="font-display text-xl font-black text-navy">
              📝 Observações e Anotações Sociais
            </h4>
            <div className="mt-4">
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Insira anotações relevantes sobre o desenvolvimento da criança, comportamento ou ocorrências..."
                rows={4}
                className="w-full bg-white border border-navy/10 rounded-2xl p-4 text-sm text-navy font-medium focus:outline-none focus:border-action transition"
              />
            </div>
          </section>

          {/* TIMELINE */}
          <section className="rounded-3xl bg-surface p-6">
            <CriancaTimeline events={child.timeline} />
          </section>
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-black text-navy/40">
        {label}
      </p>
      <p className="font-bold text-navy mt-1">{value}</p>
    </div>
  );
}