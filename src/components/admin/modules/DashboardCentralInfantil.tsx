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

        if (error) {
          throw error;
        }

        setChildren((data as ChildData[]) || []);
      } catch (error) {
        console.error(
          "Erro ao buscar dados da Central Infantil:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchChildren();
  }, []);

  const filteredChildren = children.filter((child) => {
    const term = search.trim().toLowerCase();

    return (
      (child.full_name?.toLowerCase() || "").includes(term) ||
      (child.nucleus?.toLowerCase() || "").includes(term) ||
      (child.guardians?.full_name?.toLowerCase() || "").includes(term)
    );
  });

  function openChildDetails(child: ChildData) {
    setSelectedChild(child);
  }

  function closeChildDetails() {
    setSelectedChild(null);
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-navy/5 bg-card p-8 text-center">
        <p className="animate-pulse font-bold text-navy/60">
          Carregando base de dados da Central Infantil...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-navy/5 bg-card p-4 shadow-sm md:flex-row">
        <div className="w-full md:max-w-md">
          <input
            type="text"
            placeholder="🔍 Buscar por criança, responsável ou núcleo..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-navy/10 bg-surface px-4 py-3 font-medium outline-none focus:border-action"
          />
        </div>

        <div className="rounded-lg border border-navy/5 bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy/50">
          Total: {filteredChildren.length} crianças localizadas
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-3xl border border-navy/5 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="bg-navy text-xs font-black uppercase tracking-wider text-white">
                <th className="p-4">Aluno / Criança</th>
                <th className="p-4">Idade</th>
                <th className="p-4">Núcleo</th>
                <th className="p-4">Responsável Legal</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-navy/5">
              {filteredChildren.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-sm font-medium text-navy/50"
                  >
                    Nenhum cadastro localizado com os termos informados.
                  </td>
                </tr>
              ) : (
                filteredChildren.map((child) => (
                  <tr
                    key={child.id}
                    onClick={() => openChildDetails(child)}
                    className={`cursor-pointer transition-colors hover:bg-navy/5 ${
                      selectedChild?.id === child.id
                        ? "bg-action/10"
                        : ""
                    }`}
                  >
                    <td className="p-4">
                      <p className="font-bold text-navy">
                        {child.full_name}
                      </p>

                      {child.child_cpf && (
                        <p className="font-mono text-[10px] opacity-60">
                          CPF: {child.child_cpf}
                        </p>
                      )}
                    </td>

                    <td className="p-4 text-sm font-semibold">
                      {child.age ?? "-"} anos
                    </td>

                    <td className="p-4 text-sm font-medium">
                      <span className="rounded border bg-surface px-2 py-1 text-xs">
                        {child.nucleus || "Geral"}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-medium">
                        {child.guardians?.full_name || "Não informado"}
                      </p>

                      <p className="text-xs opacity-60">
                        {child.guardians?.phone || ""}
                      </p>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openChildDetails(child);
                        }}
                        className="rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-action"
                      >
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

      {selectedChild && (
        <>
          <button
            type="button"
            aria-label="Fechar ficha da criança"
            onClick={closeChildDetails}
            className="fixed inset-0 z-40 cursor-default bg-navy/45 backdrop-blur-sm"
          />

          <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-navy/10 bg-white px-6 py-5">
              <div>
                <span className="rounded bg-navy px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                  Ficha Prontuário
                </span>

                <h3 className="mt-3 font-display text-2xl font-black text-navy">
                  {selectedChild.full_name}
                </h3>

                <p className="mt-1 text-xs text-navy/60">
                  Cadastrado em:{" "}
                  {new Date(
                    selectedChild.created_at
                  ).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <button
                type="button"
                onClick={closeChildDetails}
                className="rounded-xl border border-navy/10 bg-surface px-4 py-2 text-sm font-black text-navy transition-colors hover:bg-navy hover:text-white"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-6 p-6">
              <section className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-action">
                  🩺 Monitoramento de Saúde
                </h4>

                <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                    ⚠️ Alergias / Restrições
                  </p>

                  <p className="mt-1 text-sm font-medium text-navy/90">
                    {selectedChild.allergies ||
                      "Nenhuma informada."}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                    🧠 Neuronecessidades / Condições
                  </p>

                  <p className="mt-1 text-sm font-medium text-navy/90">
                    {selectedChild.neuro_needs ||
                      "Nenhuma informada."}
                  </p>
                </div>

                <div className="rounded-xl border border-navy/5 bg-surface p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-navy/50">
                    Anotações Médicas Gerais
                  </p>

                  <p className="mt-1 text-sm font-medium text-navy/90">
                    {selectedChild.health_notes ||
                      "Sem anotações complementares."}
                  </p>
                </div>
              </section>

              <section className="space-y-2 border-t border-navy/10 pt-5 text-sm">
                <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-navy/60">
                  📋 Informações Escolares
                </h4>

                <p>
                  <strong>Escola:</strong>{" "}
                  {selectedChild.school || "Não informada"}
                </p>

                <p>
                  <strong>Interesses esportivos:</strong>{" "}
                  {selectedChild.sports_interests?.length
                    ? selectedChild.sports_interests.join(", ")
                    : "Não informados"}
                </p>

                <p>
                  <strong>Núcleo:</strong>{" "}
                  {selectedChild.nucleus || "Geral"}
                </p>
              </section>

              <section className="space-y-2 rounded-2xl bg-surface p-5 text-sm text-navy/80">
                <h4 className="mb-2 font-bold uppercase text-navy/60">
                  👤 Responsável Legal
                </h4>

                <p>
                  <strong>Nome:</strong>{" "}
                  {selectedChild.guardians?.full_name ||
                    "Não informado"}
                </p>

                <p>
                  <strong>Documento:</strong>{" "}
                  {selectedChild.guardians?.document_number ||
                    "Não informado"}
                </p>

                <p>
                  <strong>WhatsApp:</strong>{" "}
                  {selectedChild.guardians?.phone ||
                    "Não informado"}
                </p>

                <p>
                  <strong>E-mail:</strong>{" "}
                  {selectedChild.guardians?.email ||
                    "Não possui"}
                </p>
              </section>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}