import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CriancaDrawer } from "./CriancaDrawer";
import {
  CriancasFilters,
  type ChildrenFilter,
} from "./CriancasFilters";
import { CriancasTable } from "./CriancasTable";
import { CriancasToolbar } from "./CriancasToolbar";
import type { ChildProfile } from "./types";

type ChildrenProfileRow = {
  id: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  nucleus: string | null;
  school: string | null;
  grade: string | null;
  category: string | null;
  teacher: string | null;
  guardian_name: string | null;
  guardian_whatsapp: string | null;
  guardian_email: string | null;
  guardian_relationship: string | null;
  emergency_phone: string | null;
  blood_type: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  cid: string | null;
  medications: string | null;
  medication_schedule: string | null;
  special_care: string | null;
  restrictions: string | null;
  status: "active" | "pending" | "inactive" | null;
  observations: string | null;
  created_at: string | null;
};

function mapChild(row: ChildrenProfileRow): ChildProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    age: row.age ?? 0,
    gender: row.gender ?? "Não informado",
    nucleus: row.nucleus ?? "Não informado",
    school: row.school ?? "Não informado",
    grade: row.grade ?? "Não informado",
    category: row.category ?? "Não informado",
    teacher: row.teacher ?? "Não informado",
    guardian: {
      name: row.guardian_name ?? "Não informado",
      whatsapp: row.guardian_whatsapp ?? "Não informado",
      email: row.guardian_email ?? "",
      relationship: row.guardian_relationship ?? "Não informado",
      emergencyPhone: row.emergency_phone ?? "Não informado",
    },
    health: {
      bloodType: row.blood_type ?? "Não informado",
      allergies: row.allergies ?? "Não informado",
      medicalConditions: row.medical_conditions ?? "Não informado",
      cid: row.cid ?? "",
      medications: row.medications ?? "Não informado",
      medication_schedule: row.medication_schedule ?? "",
      specialCare: row.special_care ?? "",
      restrictions: row.restrictions ?? "Não informado",
    },
    status: row.status ?? "pending",
    observations: row.observations ?? "",
    createdAt: row.created_at
      ? new Date(row.created_at).toLocaleDateString("pt-BR")
      : "Não informado",
    timeline: [
      {
        id: `created-${row.id}`,
        date: row.created_at
          ? new Date(row.created_at).toLocaleDateString("pt-BR")
          : "Não informado",
        title: "Cadastro realizado",
        description: "Criança cadastrada na Central Infantil.",
        type: "registration",
      },
    ],
  };
}

export function DashboardCriancas() {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<ChildrenFilter>("all");
  const [loading, setLoading] = useState(true);

  // Estado para controlar visualmente o quarto botão
  const [centralAtiva, setCentralAtiva] = useState(true);

  async function loadChildren() {
    setLoading(true);
    const { data, error } = await supabase
      .from("children_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar crianças:", error);
      setChildren([]);
    } else {
      setChildren((data ?? []).map((row) => mapChild(row as ChildrenProfileRow)));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadChildren();
  }, []);

  const handleUpdateChild = (updatedChild: ChildProfile) => {
    setChildren((prev) =>
      prev.map((item) => (item.id === updatedChild.id ? updatedChild : item))
    );
    if (selectedChild?.id === updatedChild.id) {
      setSelectedChild(updatedChild);
    }
  };

  const filteredChildren = children.filter((child) => {
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
        Boolean(child.health.specialCare || child.health.medicalConditions));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* 1. O PAINEL EXECUTIVO INJETADO COM OS 4 BOTÕES LADO A LADO */}
      <div className="p-8 bg-card border border-navy/5 rounded-3xl shadow-sm mb-8">
        <p className="text-xs uppercase tracking-[0.25em] font-black text-navy/40 mb-3">
          Administração · Torcida Social
        </p>
        <h2 className="font-display text-2xl font-black mb-2 text-navy">
          Painel Executivo
        </h2>
        <p className="text-navy/60 text-sm mb-6">
          Acesse rapidamente métricas, notícias, arrecadações, núcleos sociais, torcedores cadastrados e inteligência estratégica da plataforma.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link 
            to="/admin" 
            className="bg-navy text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-opacity-90 transition-all text-center"
          >
            PAINEL ADMIN
          </Link>

          <button 
            type="button"
            className="bg-navy text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-opacity-90 transition-all text-center"
          >
            GERENCIAR NOTÍCIAS
          </button>

          <Link 
            to="/" 
            className="bg-navy text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-opacity-90 transition-all text-center"
          >
            VER CENTRAL PÚBLICA
          </Link>

          {/* O 4º BOTÃO QUE VOCÊ PRECISAVA - EM DESTAQUE OURO */}
          <button
            type="button"
            onClick={() => setCentralAtiva(!centralAtiva)}
            className={`font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-md ${
              centralAtiva 
                ? "bg-gold text-navy ring-4 ring-gold/20" 
                : "bg-navy text-white hover:bg-opacity-90"
            }`}
          >
            🧒 CENTRAL INFANTIL
          </button>
        </div>
      </div>

      {/* SÓ MOSTRA A CENTRAL SE O QUARTO BOTÃO ESTIVER ATIVADO */}
      {centralAtiva && (
        <div className="space-y-8 animate-fadeIn">
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

          <CriancasFilters
            activeFilter={activeFilter}
            onChangeFilter={setActiveFilter}
          />

          {loading ? (
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-8 text-navy/60 font-bold">
              Carregando crianças cadastradas...
            </div>
          ) : (
            <CriancasTable
              childrenProfiles={filteredChildren}
              onOpenChild={setSelectedChild}
            />
          )}
        </div>
      )}

      {selectedChild && (
        <CriancaDrawer
          child={selectedChild}
          onClose={() => setSelectedChild(null)}
          onUpdate={handleUpdateChild}
        />
      )}
    </div>
  );
}