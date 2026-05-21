import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/lgpd")({
  component: LGPD,
  head: () => ({
    meta: [
      { title: "LGPD — Torcida Social" },
      { name: "description", content: "Como exercer seus direitos previstos na Lei Geral de Proteção de Dados." },
      { property: "og:url", content: "/lgpd" },
    ],
    links: [{ rel: "canonical", href: "/lgpd" }],
  }),
});

function LGPD() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Legal" title={<>Seus direitos <span className="text-success">LGPD</span></>} subtitle="Lei Geral de Proteção de Dados — Lei nº 13.709/2018." />
      <article className="max-w-3xl mx-auto px-6 py-16 text-navy/80 leading-relaxed space-y-6">
        <p>A Torcida Social respeita e protege seus dados pessoais. Você pode exercer os direitos abaixo a qualquer momento:</p>

        <div className="grid sm:grid-cols-2 gap-4 not-prose">
          {[
            ["Confirmar", "Saber se tratamos seus dados."],
            ["Acessar", "Receber cópia dos seus dados."],
            ["Corrigir", "Atualizar dados incorretos."],
            ["Anonimizar", "Solicitar anonimização."],
            ["Eliminar", "Pedir exclusão dos seus dados."],
            ["Portar", "Levar seus dados a outro fornecedor."],
            ["Revogar", "Cancelar consentimento dado antes."],
            ["Saber com quem", "Quem recebeu seus dados."],
          ].map(([t, d]) => (
            <div key={t} className="border border-navy/10 rounded-2xl p-5 bg-card">
              <div className="font-display font-black text-navy">{t}</div>
              <div className="text-sm text-navy/60 mt-1">{d}</div>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl font-black text-navy">Como exercer</h2>
        <p>Envie um e-mail para <a href="mailto:torcidasocial@gmail.com" className="text-action underline">torcidasocial@gmail.com</a> com o assunto "LGPD — [direito desejado]". Respondemos em até 15 dias.</p>

        <h2 className="font-display text-2xl font-black text-navy">Encarregado (DPO)</h2>
        <p><a href="mailto:torcidasocial@gmail.com" className="text-action underline">torcidasocial@gmail.com</a></p>

        <h2 className="font-display text-2xl font-black text-navy">ANPD</h2>
        <p>Em caso de não atendimento, você pode reclamar à Autoridade Nacional de Proteção de Dados em <a href="https://www.gov.br/anpd" target="_blank" rel="noopener" className="text-action underline">gov.br/anpd</a>.</p>
      </article>
    </SiteLayout>
  );
}
