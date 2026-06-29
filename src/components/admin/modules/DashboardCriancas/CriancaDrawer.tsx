import { CriancaTimeline } from "./CriancaTimeline";
import type { ChildProfile } from "./types";

type Props = {
  child: ChildProfile;
  onClose: () => void;
};

export function CriancaDrawer({ child, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm flex justify-end">
      <aside className="h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-navy/10 p-6 flex items-center justify-between z-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] font-black text-action">
              Prontuário Social
            </p>

            <h3 className="font-display text-2xl font-black text-navy mt-1">
              {child.fullName}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-surface px-4 py-2 text-sm font-black text-navy hover:bg-navy hover:text-white"
          >
            Fechar
          </button>
        </div>

        <div className="p-6 space-y-6">
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

          <section className="rounded-3xl bg-surface p-6">
            <h4 className="font-display text-xl font-black text-navy">
              👨‍👩‍👧 Responsável
            </h4>

            <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
              <Info label="Nome" value={child.guardian.name} />
              <Info label="Parentesco" value={child.guardian.relationship || "Não informado"} />
              <Info label="WhatsApp" value={child.guardian.whatsapp} />
              <Info label="Telefone emergência" value={child.guardian.emergencyPhone || "Não informado"} />
              <Info label="E-mail" value={child.guardian.email || "Não informado"} />
            </div>
          </section>

          <section className="rounded-3xl bg-red-50 border border-red-100 p-6">
            <h4 className="font-display text-xl font-black text-red-700">
              🩺 Saúde e Cuidados
            </h4>

            <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
              <Info label="Tipo sanguíneo" value={child.health.bloodType || "Não informado"} />
              <Info label="Alergias" value={child.health.allergies || "Não informado"} />
              <Info label="Condições médicas" value={child.health.medicalConditions || "Não informado"} />
              <Info label="CID" value={child.health.cid || "Não informado"} />
              <Info label="Medicamentos" value={child.health.medications || "Não informado"} />
              <Info label="Horários" value={child.health.medicationSchedule || "Não informado"} />
              <Info label="Cuidados especiais" value={child.health.specialCare || "Não informado"} />
              <Info label="Restrições" value={child.health.restrictions || "Não informado"} />
            </div>
          </section>

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