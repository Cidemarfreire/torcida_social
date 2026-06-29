import { useState } from "react";

import { CriancaDrawer } from "./CriancaDrawer";
import {
  CriancasFilters,
  type ChildrenFilter,
} from "./CriancasFilters";
import { CriancasTable } from "./CriancasTable";
import { CriancasToolbar } from "./CriancasToolbar";
import type { ChildProfile } from "./types";

const mockChildren: ChildProfile[] = [
  {
    id: "1",
    fullName: "João Gabriel Santos",
    age: 10,
    gender: "Masculino",
    nucleus: "Teresópolis",
    school: "Escola Municipal Modelo",
    grade: "5º ano",
    category: "Sub-11",
    teacher: "Professor Carlos",
    guardian: {
      name: "Maria Santos",
      whatsapp: "21 99999-0000",
      email: "maria@email.com",
      relationship: "Mãe",
      emergencyPhone: "21 98888-0000",
    },
    health: {
      bloodType: "O+",
      allergies: "Não informado",
      medicalConditions: "Nenhuma condição relatada",
      cid: "",
      medications: "Não utiliza medicação contínua",
      medicationSchedule: "",
      specialCare: "Acompanhar hidratação em dias de treino forte",
      restrictions: "Sem restrições informadas",
    },
    status: "active",
    observations: "Participante assíduo e com bom relacionamento com a equipe.",
    createdAt: "28/06/2026",
    timeline: [
      {
        id: "t1",
        date: "28/06/2026",
        title: "Cadastro realizado",
        description: "Criança cadastrada no núcleo Teresópolis.",
        type: "registration",
      },
    ],
  },
  {
    id: "2",
    fullName: "Ana Clara Oliveira",
    age: 12,
    gender: "Feminino",
    nucleus: "Campo Grande",
    school: "Escola Parceira Zona Oeste",
    grade: "7º ano",
    category: "Sub-13",
    teacher: "Professora Renata",
    guardian: {
      name: "José Oliveira",
      whatsapp: "21 97777-0000",
      relationship: "Pai",
      emergencyPhone: "21 96666-0000",
    },
    health: {
      bloodType: "A+",
      allergies: "Alergia leve a poeira",
      medicalConditions: "Acompanhamento respiratório preventivo",
      medications: "Bombinha quando necessário",
      medicationSchedule: "Somente em crise, conforme orientação médica",
      specialCare: "Evitar exposição intensa a poeira",
      restrictions: "Observar esforço respiratório",
    },
    status: "pending",
    observations: "Aguardando validação final da documentação.",
    createdAt: "28/06/2026",
    timeline: [
      {
        id: "t2",
        date: "28/06/2026",
        title: "Pré-cadastro realizado",
        description: "Ficha aberta para validação pela equipe.",
        type: "registration",
      },
    ],
  },
];

export function DashboardCriancas() {
 const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const [activeFilter, setActiveFilter] = useState<ChildrenFilter>("all");

  const filteredChildren = mockChildren.filter((child) => {
  const term = searchTerm.toLowerCase();

  const matchesSearch =
    child.fullName.toLowerCase().includes(term) ||
    child.nucleus.toLowerCase().includes(term) ||
    child.guardian.name.toLowerCase().includes(term) ||
    child.guardian.whatsapp.toLowerCase().includes(term);

  const matchesFilter =
    activeFilter === "all" ||
    child.status === activeFilter ||
    (activeFilter === "specialCare" &&
      Boolean(
        child.health.specialCare ||
        child.health.medicalConditions
      ));

  return matchesSearch && matchesFilter;
});

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-8">
        <p className="text-xs uppercase tracking-[0.25em] font-black text-action">
          Central Infantil
        </p>

        <h2 className="font-display text-4xl font-black text-navy mt-2">
          👶 Prontuário Social Digital
        </h2>

        <p className="text-navy/60 mt-3 max-w-3xl">
          Área dedicada ao acompanhamento completo das crianças, responsáveis,
          saúde, desenvolvimento, histórico e participação nos núcleos do
          Torcida Social.
        </p>
      </div>

      <CriancasToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <CriancasFilters />

      <CriancasTable
        childrenProfiles={filteredChildren}
        onOpenChild={setSelectedChild}
      />

      {selectedChild && (
        <CriancaDrawer
          child={selectedChild}
          onClose={() => setSelectedChild(null)}
        />
      )}
    </div>
  );
}