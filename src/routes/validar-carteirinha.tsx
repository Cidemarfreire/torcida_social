import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/validar-carteirinha")({
  component: ValidarCarteirinha,
  validateSearch: (search: Record<string, unknown>) => ({
    codigo: typeof search.codigo === "string" ? search.codigo : "",
  }),
  head: () => ({ meta: [
    { title: "Validar Carteirinha — Torcida Social" },
    { name: "description", content: "Validação pública de carteirinha digital da Torcida Social." },
  ]}),
});

function ValidarCarteirinha() {
  const { codigo } = Route.useSearch();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["validate-child-card", codigo],
    enabled: Boolean(codigo),
    queryFn: async () => {
      const { data, error } = await supabase.rpc("validate_child_card", {
        _public_code: codigo,
      });

      if (error) throw error;
      return data?.[0] ?? null;
    },
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Validação Digital"
        title="Carteirinha Torcida Social."
        subtitle="Confirme se a carteirinha digital está ativa sem expor dados sensíveis da criança."
      />

      <section className="px-6 py-16 max-w-3xl mx-auto">
        {!codigo ? (
          <InvalidCard message="Código de validação não informado." />
        ) : isLoading ? (
          <div className="bg-card border border-navy/5 rounded-3xl p-10 text-center">
            <p className="font-display text-2xl font-black">Validando...</p>
          </div>
        ) : isError || !data ? (
          <InvalidCard message="Carteirinha não encontrada, inativa ou revogada." />
        ) : (
          <div className="bg-card border border-success/20 rounded-3xl p-10 text-center">
            <BadgeCheck className="mx-auto text-success" size={48} />
            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-success">Carteirinha ativa</p>
            <h2 className="font-display text-3xl font-black mt-2">{data.display_id}</h2>
            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
              <Info label="Identificação" value={data.child_initials} />
              <Info label="Núcleo" value={data.nucleus} />
              <Info label="Emitida em" value={new Intl.DateTimeFormat("pt-BR").format(new Date(data.issued_at))} />
            </div>
            <p className="text-xs text-navy/45 mt-8">
              Por segurança e LGPD, esta validação não exibe nome completo, endereço, documentos ou contato do responsável.
            </p>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function InvalidCard({ message }: { message: string }) {
  return (
    <div className="bg-card border border-red-100 rounded-3xl p-10 text-center">
      <ShieldAlert className="mx-auto text-red-600" size={48} />
      <p className="mt-5 font-display text-2xl font-black">Validação indisponível</p>
      <p className="mt-2 text-navy/60">{message}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-2xl p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-navy/45">{label}</p>
      <p className="font-display text-xl font-black mt-1">{value}</p>
    </div>
  );
}
