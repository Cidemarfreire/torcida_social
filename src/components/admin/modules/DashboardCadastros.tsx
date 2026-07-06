import { useState } from "react";

type UserFilter = "all" | "admin" | "user" | "blocked";

const mockUsers = [
  {
    id: "1",
    name: "Cidemar Freire",
    email: "cidemarfaria@gmail.com",
    city: "Rio de Janeiro",
    state: "RJ",
    role: "Administrador",
    status: "Ativo",
    createdAt: "28/06/2026",
  },
  {
    id: "2",
    name: "Responsável cadastrado",
    email: "responsavel@email.com",
    city: "Teresópolis",
    state: "RJ",
    role: "Usuário",
    status: "Ativo",
    createdAt: "28/06/2026",
  },
];

export function DashboardCadastros() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<UserFilter>("all");

  const filteredUsers = mockUsers.filter((user) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.city.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term);

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "admin" && user.role === "Administrador") ||
      (activeFilter === "user" && user.role === "Usuário") ||
      (activeFilter === "blocked" && user.status === "Bloqueado");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-8">
        <p className="text-xs uppercase tracking-[0.25em] font-black text-action">
          Cadastro Geral
        </p>

        <h2 className="font-display text-4xl font-black text-navy mt-2">
          👥 Usuários e Administradores
        </h2>

        <p className="text-navy/60 mt-3 max-w-3xl">
          Área preparada para consultar, editar e acompanhar todos os usuários
          cadastrados no Torcida Social.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nome, e-mail, cidade ou função..."
            className="w-full lg:max-w-md rounded-2xl border border-navy/10 px-5 py-3 text-sm outline-none focus:border-action"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-black ${
                activeFilter === "all"
                  ? "bg-navy text-white"
                  : "bg-surface text-navy"
              }`}
            >
              Todos
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("admin")}
              className={`px-4 py-2 rounded-xl text-xs font-black ${
                activeFilter === "admin"
                  ? "bg-navy text-white"
                  : "bg-surface text-navy"
              }`}
            >
              Administradores
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("user")}
              className={`px-4 py-2 rounded-xl text-xs font-black ${
                activeFilter === "user"
                  ? "bg-navy text-white"
                  : "bg-surface text-navy"
              }`}
            >
              Usuários
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("blocked")}
              className={`px-4 py-2 rounded-xl text-xs font-black ${
                activeFilter === "blocked"
                  ? "bg-navy text-white"
                  : "bg-surface text-navy"
              }`}
            >
              Bloqueados
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy/10 text-navy/40 uppercase text-[11px] tracking-widest">
                <th className="py-3 pr-4">Nome</th>
                <th className="py-3 pr-4">E-mail</th>
                <th className="py-3 pr-4">Cidade</th>
                <th className="py-3 pr-4">Função</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Cadastro</th>
                <th className="py-3 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-navy/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface/70">
                  <td className="py-4 pr-4 font-black text-navy">
                    {user.name}
                  </td>

                  <td className="py-4 pr-4 text-navy/60">{user.email}</td>

                  <td className="py-4 pr-4 text-navy/60">
                    {user.city}/{user.state}
                  </td>

                  <td className="py-4 pr-4">
                    <span className="rounded-full bg-navy/5 px-3 py-1 text-xs font-black text-navy">
                      {user.role}
                    </span>
                  </td>

                  <td className="py-4 pr-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                      {user.status}
                    </span>
                  </td>

                  <td className="py-4 pr-4 text-navy/60">
                    {user.createdAt}
                  </td>

                  <td className="py-4 text-right">
                    <button
                      type="button"
                      className="rounded-xl bg-action px-4 py-2 text-xs font-black text-white"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-navy/50 font-bold"
                  >
                    Nenhum usuário encontrado com esse filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gold/10 border border-gold/30 rounded-3xl p-6">
        <p className="font-black text-navy">
          Próxima etapa: conectar este módulo ao serviço de usuários.
        </p>
        <p className="text-sm text-navy/60 mt-2">
          Depois de validar a interface, ligaremos esta tabela aos dados reais
          da tabela profiles no Supabase.
        </p>
      </div>
    </div>
  );
}