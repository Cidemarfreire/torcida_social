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
            placeholder="Buscar por nome, e-mail, cidade ou função..."
            className="w-full lg:max-w-md rounded-2xl border border-navy/10 px-5 py-3 text-sm outline-none focus:border-action"
          />

          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-black">
              Todos
            </button>
            <button className="px-4 py-2 rounded-xl bg-surface text-navy text-xs font-black">
              Administradores
            </button>
            <button className="px-4 py-2 rounded-xl bg-surface text-navy text-xs font-black">
              Usuários
            </button>
            <button className="px-4 py-2 rounded-xl bg-surface text-navy text-xs font-black">
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
              {mockUsers.map((user) => (
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
                    <button className="rounded-xl bg-action px-4 py-2 text-xs font-black text-white">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
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