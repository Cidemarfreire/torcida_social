import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contato")({
  component: Contato,
  head: () => ({ meta: [
    { title: "Contato — Torcida Social | Teresópolis, RJ" },
    { name: "description", content: "Fale com a Torcida Social. WhatsApp (21) 97018-7813 · torcidasocial@gmail.com · Campo Grande / Teresópolis, RJ." },
    { property: "og:title", content: "Contato — Torcida Social" },
    { property: "og:description", content: "WhatsApp, e-mail e endereço da Torcida Social." },
  ]}),
});

function Contato() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nome = String(data.get("nome") || "").trim();
    const email = String(data.get("email") || "").trim();
    const assunto = String(data.get("assunto") || "Contato pelo site").trim();
    const mensagem = String(data.get("mensagem") || "").trim();
    const body = `Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`;
    window.location.href = `mailto:torcidasocial@gmail.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Contato" title="Vamos torcer juntos?" subtitle="Tem uma ideia, quer ser voluntário ou propor parceria? Fale com a gente." />
      <section className="px-6 py-16 max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-10">
        <form className="bg-card border border-navy/5 rounded-3xl p-8 md:p-10 space-y-5" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nome" name="nome" required />
            <Field label="E-mail" name="email" type="email" required />
            <Field label="Assunto" name="assunto" className="md:col-span-2" />
          </div>
          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-2">Mensagem</span>
            <textarea name="mensagem" required rows={5} className="w-full bg-surface border-2 border-navy/10 px-4 py-3 rounded-xl focus:border-action outline-none" />
          </label>
          <button type="submit" className="bg-navy text-background px-8 py-4 rounded-xl font-bold hover:bg-action transition-colors">Enviar mensagem</button>
          <p className="text-xs text-navy/50">Sua mensagem abrirá seu app de e-mail com o conteúdo preenchido, endereçada a torcidasocial@gmail.com.</p>
        </form>
        <aside className="space-y-4">
          <Info label="Endereço" value="Rua Conceição das Alagoas, 4112/201 · Campo Grande · Rio de Janeiro, RJ" />
          <Info label="WhatsApp" value="(21) 97018-7813" />
          <Info label="E-mail" value="torcidasocial@gmail.com" />
          <Info label="Horário" value="Seg–Sex · 9h às 18h" />
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({ label, className = "", ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-2">{label}</span>
      <input {...props} className="w-full bg-surface border-2 border-navy/10 px-4 py-3 rounded-xl font-medium focus:border-action outline-none" />
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-navy/5 rounded-2xl p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-navy/50">{label}</p>
      <p className="font-bold mt-1">{value}</p>
    </div>
  );
}
