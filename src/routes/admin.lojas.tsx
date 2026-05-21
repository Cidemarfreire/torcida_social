import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";

export const Route = createFileRoute("/admin/lojas")({
  beforeLoad: requireAdmin,
  component: AdminLojas,
  head: () => ({ meta: [{ title: "Admin — Lojas | Torcida Social" }] }),
});

const CHECKLIST = [
  { group: "Conta", items: [
    "Criar conta Google Play Console (US$ 25, único)",
    "Criar conta Apple Developer (US$ 99/ano) — opcional",
    "Verificar identidade (documento + selfie)",
  ]},
  { group: "Backend (Lovable Cloud)", items: [
    "Cadastro/login funcionando (e-mail + Google)",
    "Banco de dados conectado (sem mocks)",
    "Pagamento Mercado Pago em produção",
    "Política de Privacidade publicada em URL pública",
    "Termos de Uso publicados em URL pública",
  ]},
  { group: "PWA", items: [
    "manifest.json configurado",
    "Ícones 192 e 512 px",
    "Cor institucional #1e3a8a aplicada",
    "Site publicado em domínio HTTPS",
  ]},
  { group: "Assets da loja", items: [
    "Ícone 512×512 PNG (sem texto, sem transparência)",
    "Feature graphic 1024×500 PNG (Google)",
    "2 a 8 screenshots celular (16:9 ou 9:16)",
    "Vídeo de 30 s (opcional, recomendado)",
  ]},
  { group: "Empacotamento", items: [
    "Gerar .aab pelo PWABuilder (pwabuilder.com)",
    "Criar keystore de assinatura digital",
    "Guardar keystore em local seguro (perda = não pode atualizar)",
  ]},
  { group: "Publicação", items: [
    "Questionário de classificação etária (Livre)",
    "Questionário de segurança de dados (LGPD)",
    "Link público da Política de Privacidade",
    "Upload do .aab no Play Console",
    "Aguardar revisão (1 a 7 dias)",
  ]},
];

const TEXTOS = {
  nome: "Torcida Social",
  curta: "A torcida que transforma vidas. Doe, torça e veja seu impacto.",
  longa: `A Torcida Social é a ONG brasileira que une a paixão pelo futebol com a força da solidariedade para transformar a vida de milhares de crianças em situação de vulnerabilidade.

▸ DOE COM PIX em segundos — escolha o valor, escolha sua causa, contribua.
▸ TORÇA PELO SEU TIME na Liga da Solidariedade: o clube com mais doações sobe no ranking.
▸ VEJA SEU IMPACTO em tempo real: quantas crianças você ajudou, quantos atendimentos, quantos núcleos cresceram.
▸ NÚCLEOS em Teresópolis, Niterói, Nova Iguaçu e Itaguaí — e expandindo.
▸ PROJETOS DE ESPORTE, EDUCAÇÃO E REFORÇO ESCOLAR com mais de 25.000 atendimentos em 20 anos na Zona Oeste do Rio.

Cadastre-se gratuitamente, escolha seu time de coração e comece a transformar vidas hoje. Sua paixão tem o poder de mudar a história de uma criança.

Torcida Social — A torcida que transforma vidas.`,
  keywords: "doação, ong, crianças, futebol, pix, solidariedade, social, esporte, educação",
};

function AdminLojas() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  const toggle = (k: string) => {
    const next = new Set(checked);
    next.has(k) ? next.delete(k) : next.add(k);
    setChecked(next);
  };

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const total = CHECKLIST.reduce((a, g) => a + g.items.length, 0);
  const done = checked.size;
  const pct = Math.round((done / total) * 100);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Admin"
        title={<>Lojas <span className="text-success">Google Play & App Store</span></>}
        subtitle="Checklist completo + textos prontos para publicar."
      />

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Progresso */}
        <div className="bg-navy text-background rounded-3xl p-8">
          <div className="flex justify-between mb-3">
            <span className="font-bold text-sm uppercase tracking-widest text-success">Progresso</span>
            <span className="font-display font-black text-xl">{done}/{total} · {pct}%</span>
          </div>
          <div className="h-3 bg-background/10 rounded-full overflow-hidden">
            <div className="h-full bg-success transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-8">
          {CHECKLIST.map((g) => (
            <div key={g.group}>
              <h3 className="font-display text-xl font-black uppercase mb-4">{g.group}</h3>
              <div className="space-y-2">
                {g.items.map((it) => {
                  const key = `${g.group}-${it}`;
                  const isDone = checked.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggle(key)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        isDone ? "bg-success/10 border-success/30 line-through text-navy/50" : "bg-card border-navy/10 hover:border-action"
                      }`}
                    >
                      <span className={`size-6 rounded-md border-2 flex items-center justify-center shrink-0 ${
                        isDone ? "bg-success border-success" : "border-navy/20"
                      }`}>
                        {isDone && <Check size={14} className="text-background" />}
                      </span>
                      <span className="text-sm font-medium">{it}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Textos prontos */}
        <div className="space-y-6">
          <h2 className="font-display text-3xl font-black uppercase">Textos prontos das lojas</h2>

          {[
            { key: "nome", label: "Nome do app (até 30 caracteres)", value: TEXTOS.nome },
            { key: "curta", label: "Descrição curta (até 80 caracteres)", value: TEXTOS.curta },
            { key: "longa", label: "Descrição longa (até 4.000 caracteres)", value: TEXTOS.longa },
            { key: "keywords", label: "Palavras-chave (App Store, até 100 caracteres)", value: TEXTOS.keywords },
          ].map((t) => (
            <div key={t.key} className="bg-card border border-navy/10 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-3 gap-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-action">{t.label}</span>
                <button
                  onClick={() => copy(t.key, t.value)}
                  className="text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy text-background hover:bg-action transition-colors shrink-0"
                >
                  {copied === t.key ? <Check size={12} /> : <Copy size={12} />}
                  {copied === t.key ? "Copiado" : "Copiar"}
                </button>
              </div>
              <pre className="text-sm text-navy/80 whitespace-pre-wrap font-sans leading-relaxed">{t.value}</pre>
            </div>
          ))}
        </div>

        {/* Próximos passos */}
        <div className="bg-action/10 border border-action/20 rounded-3xl p-8">
          <h3 className="font-display text-xl font-black uppercase mb-4">Próximos passos</h3>
          <ol className="space-y-3 text-navy/80">
            <li><strong>1.</strong> Ativar Lovable Cloud (cadastro, banco, login).</li>
            <li><strong>2.</strong> Integrar Mercado Pago (Pix + cartão).</li>
            <li><strong>3.</strong> Publicar o site (botão Publish) para gerar URL HTTPS.</li>
            <li><strong>4.</strong> Acessar <a href="https://pwabuilder.com" target="_blank" rel="noopener" className="text-action underline">pwabuilder.com</a>, colar a URL e gerar o .aab.</li>
            <li><strong>5.</strong> Subir o .aab no Google Play Console com os textos acima.</li>
          </ol>
        </div>
      </section>
    </SiteLayout>
  );
}
