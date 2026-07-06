import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChildData {
  id: string;
  full_name: string;
  age: number | null;
  child_cpf: string | null;
  nucleus: string;
  school: string | null;
  sports_interests: string[] | null;
  allergies: string | null;
  health_notes: string | null;
  neuro_needs: string | null;
  created_at: string;
  guardians: {
    full_name: string;
    phone: string;
    email: string | null;
    document_number: string;
  } | null;
}

export function DashboardCentralInfantil() {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);

  useEffect(() => {
    async function fetchChildren() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("children")
          .select(`
            *,
            guardians (
              full_name,
              phone,
              email,
              document_number
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setChildren((data as any) || []);
      } catch (err) {
        console.error("Erro ao buscar dados da Central Infantil:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChildren();
  }, []);

  const filteredChildren = children.filter((child) => {
    const term = search.toLowerCase();
    return (
      (child.full_name?.toLowerCase() || "").includes(term) ||
      (child.nucleus?.toLowerCase() || "").includes(term) ||
      (child.guardians?.full_name?.toLowerCase() || "").includes(term)
    );
  });

  if (loading) {
    return (
      <div className="bg-card border border-navy/5 rounded-3xl p-8 text-center">
        <p className="font-bold text-navy/60 animate-pulse">Carregando base de dados da Central Infantil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-navy/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="w-full md:max-w-md">
          <input
            type="text"
            placeholder="🔍 Buscar por criança, responsável ou núcleo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-navy/10 px-4 py-3 rounded-xl font-medium outline-none focus:border-action"
          />
        </div>
        <div className="text-xs font-bold text-navy/50 uppercase tracking-wider bg-surface px-4 py-2 rounded-lg border border-navy/5">
          Total: {filteredChildren.length} crianças localizadas
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
        <div className="bg-card border border-navy/5 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy text-white text-xs font-black uppercase tracking-wider">
                  <th className="p-4">Aluno / Criança</th>
                  <th className="p-4">Idade</th>
                  <th className="p-4">Núcleo</th>
                  <th className="p-4">Responsável Leg.</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {filteredChildren.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-sm font-medium text-navy/50">
                      Nenhum cadastro localizado com os termos informados.
                    </td>
                  </tr>
                ) : (
                  filteredChildren.map((child) => (
                    <tr
                      key={child.id}
                      className={`hover:bg-navy/5 cursor-pointer transition-colors ${
                        selectedChild?.id === child.id ? "bg-action/10" : ""
                      }`}
                      onClick={() => setSelectedChild(child)}
                    >
                      <td className="p-4">
                        <p className="font-bold text-navy">{child.full_name}</p>
                        {child.child_cpf && <p className="text-[10px] font-mono opacity-60">CPF: {child.child_cpf}</p>}
                      </td>
                      <td className="p-4 font-semibold text-sm">{child.age ?? "-"} anos</td>
                      <td className="p-4 text-sm font-medium">
                        <span className="bg-surface border px-2 py-1 rounded text-xs">{child.nucleus || "Geral"}</span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">{child.guardians?.full_name || "Não informado"}</p>
                        <p className="text-xs opacity-60">{child.guardians?.phone || ""}</p>
                      </td>
                      <td className="p-4 text-center">
                        <button className="bg-navy text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-action transition-colors">
                          Ver Ficha
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="bg-card border-2 border-navy/10 rounded-3xl p-6 shadow-sm space-y-6 lg:sticky lg:top-6">
          {selectedChild ? (
            <>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest bg-navy text-white px-2 py-0.5 rounded">Ficha Prontuário</span>
                <h3 className="font-display font-black text-2xl text-navy mt-2">{selectedChild.full_name}</h3>
                <p className="text-xs text-navy/60">Cadastrado em: {new Date(selectedChild.created_at).toLocaleDateString("pt-BR")}</p>
              </div>

              <div className="space-y-3 border-t pt-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-action">🩺 Monitoramento de Saúde</h4>
                
                <div className="bg-red-50/60 border border-red-100 rounded-xl p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-700">⚠️ Alergias / Restrições</p>
                  <p className="text-sm font-medium text-navy/90 mt-1">{selectedChild.allergies || "Nenhuma informada."}</p>
                </div>

                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">🧠 Neuronecessidades / Condições</p>
                  <p className="text-sm font-medium text-navy/90 mt-1">{selectedChild.neuro_needs || "Nenhuma informada."}</p>
                </div>

                <div className="bg-surface border border-navy/5 rounded-xl p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-navy/50">Anotações Médicas Gerais</p>
                  <p className="text-sm font-medium text-navy/90 mt-1">{selectedChild.health_notes || "Sem anotações complementares."}</p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4 text-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-navy/60 mb-2">📋 Informações Escolares</h4>
                <p><strong>Escola:</strong> {selectedChild.school || "Não informada"}</p>
              </div>

              <div className="space-y-2 border-t pt-4 bg-surface/50 -mx-6 -mb-6 p-6 rounded-b-3xl text-xs text-navy/80">
                <h4 className="font-bold uppercase text-navy/60 mb-2">👤 Responsável Legal</h4>
                <p><strong>Nome:</strong> {selectedChild.guardians?.full_name || "Não informado"}</p>
                <p><strong>Documento:</strong> {selectedChild.guardians?.document_number || "Não informado"}</p>
                <p><strong>WhatsApp:</strong> {selectedChild.guardians?.phone || "Não informado"}</p>
                <p><strong>E-mail:</strong> {selectedChild.guardians?.email || "Não possui"}</p>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-navy/40">
              <p className="text-3xl mb-2">🧒</p>
              <p className="text-sm font-bold">Selecione uma criança na lista para inspecionar a Ficha Médica e dados de contato completo.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}