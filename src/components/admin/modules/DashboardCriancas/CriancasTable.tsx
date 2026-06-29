import type { ChildProfile } from "./types";

type Props = {
  childrenProfiles: ChildProfile[];
  onOpenChild: (child: ChildProfile) => void;
};

export function CriancasTable({
  childrenProfiles,
  onOpenChild,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-navy/10">
            <tr className="text-left">
              <th className="px-6 py-4 text-xs uppercase tracking-widest text-navy/40">
                Criança
              </th>

              <th className="px-6 py-4 text-xs uppercase tracking-widest text-navy/40">
                Idade
              </th>

              <th className="px-6 py-4 text-xs uppercase tracking-widest text-navy/40">
                Núcleo
              </th>

              <th className="px-6 py-4 text-xs uppercase tracking-widest text-navy/40">
                Responsável
              </th>

              <th className="px-6 py-4 text-xs uppercase tracking-widest text-navy/40">
                WhatsApp
              </th>

              <th className="px-6 py-4 text-xs uppercase tracking-widest text-navy/40">
                Status
              </th>

              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {childrenProfiles.map((child) => (
              <tr
                key={child.id}
                className="border-b border-navy/5 hover:bg-surface/50 transition"
              >
                <td className="px-6 py-5">
                  <div>
                    <p className="font-black text-navy">
                      {child.fullName}
                    </p>

                    <p className="text-sm text-navy/50">
                      {child.school}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5">
                  {child.age} anos
                </td>

                <td className="px-6 py-5">
                  {child.nucleus}
                </td>

                <td className="px-6 py-5">
                  {child.guardian.name}
                </td>

                <td className="px-6 py-5">
                  {child.guardian.whatsapp}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      child.status === "active"
                        ? "bg-green-100 text-green-700"
                        : child.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {child.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => onOpenChild(child)}
                    className="bg-action text-white rounded-xl px-4 py-2 text-xs font-black hover:opacity-90"
                  >
                    Abrir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}