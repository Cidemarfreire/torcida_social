import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { formatBRL } from "@/lib/mock-data";
import { DonationCheckout } from "@/components/DonationCheckout";

export const Route = createFileRoute("/doacoes")({
  component: Doacoes,
  head: () => ({
    meta: [
      { title: "Doe agora — Torcida Social | Pix e Cartão" },
      { name: "description", content: "Doe via Pix, cartão de crédito ou carteira digital. Cada real transforma a vida de uma criança no Rio de Janeiro." },
      { property: "og:title", content: "Doe agora — Torcida Social" },
      { property: "og:description", content: "Pix, cartão e carteira digital. Sua doação transforma vidas." },
    ],
  }),
});

const VALORES = [1, 5, 10, 20, 50, 100];

function Doacoes() {
  const [valor, setValor] = useState(50);
  const [custom, setCustom] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutAmount, setCheckoutAmount] = useState(0);

  const valorFinal = custom ? Number(custom) : valor;
  const valido = Number.isFinite(valorFinal) && valorFinal >= 1;

  const iniciarDoacao = () => {
    if (!valido) return;
    setCheckoutAmount(Math.round(valorFinal * 100));
    setCheckoutOpen(true);
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Doações"
        title={<>Sua torcida <span className="text-action">alimenta sonhos.</span></>}
        subtitle="100% transparente. Relatórios mensais. Cada centavo aplicado nos núcleos da Torcida Social."
      />

      <section className="px-6 py-16 max-w-7xl mx-auto grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="bg-card border border-navy/5 rounded-3xl p-8 md:p-10">
          {!checkoutOpen ? (
            <>
              <h2 className="font-display text-2xl font-black mb-2">Escolha um valor</h2>
              <p className="text-navy/60 text-sm mb-6">Doação única ou recorrente mensal.</p>

              <div className="inline-flex bg-surface border-2 border-navy/10 rounded-xl p-1 mb-6">
                <button
                  onClick={() => setRecurring(false)}
                  className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${!recurring ? "bg-navy text-background" : "text-navy/60"}`}
                >
                  Única
                </button>
                <button
                  onClick={() => setRecurring(true)}
                  className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${recurring ? "bg-navy text-background" : "text-navy/60"}`}
                >
                  Mensal
                </button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                {VALORES.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setValor(v); setCustom(""); }}
                    className={`py-5 rounded-xl border-2 font-black text-lg transition-all ${
                      valor === v && !custom ? "border-action bg-action/5 text-action" : "border-navy/10 hover:border-action/50"
                    }`}
                  >
                    R$ {v}
                  </button>
                ))}
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-2">Outro valor</label>
              <input
                type="number"
                min={1}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="R$ 0,00"
                className="w-full bg-surface border-2 border-navy/10 px-4 py-4 rounded-xl font-bold text-lg focus:border-action outline-none"
              />

              <button
                onClick={iniciarDoacao}
                disabled={!valido}
                className="mt-8 w-full bg-action text-background py-5 rounded-xl font-black text-lg hover:bg-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                DOAR {formatBRL(valorFinal || 0)}{recurring ? " / MÊS" : ""} · CONTINUAR
              </button>

              <p className="text-[11px] text-navy/40 mt-4 text-center">
                Pagamento seguro via Pix, cartão de crédito ou carteira digital. Comprovante enviado por e-mail.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-navy/50">
                    {recurring ? "Doação mensal" : "Doação única"}
                  </p>
                  <h2 className="font-display text-2xl font-black text-action">
                    {formatBRL(checkoutAmount / 100)}{recurring ? " / mês" : ""}
                  </h2>
                </div>
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="text-sm font-bold text-navy/60 hover:text-navy underline"
                >
                  Alterar valor
                </button>
              </div>
              <DonationCheckout amountInCents={checkoutAmount} recurring={recurring} />
            </>
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-navy text-background rounded-3xl p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-gold mb-3">Meta do mês</p>
            <div className="font-display text-3xl font-black">{formatBRL(38400)} / {formatBRL(50000)}</div>
            <div className="h-2 bg-background/10 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gold" style={{ width: "76%" }} />
            </div>
            <p className="text-background/70 text-sm mt-4">Campanha: novo núcleo em Niterói.</p>
          </div>

          <div className="bg-surface rounded-3xl p-7 border border-navy/5 space-y-4">
            <p className="font-display text-xl font-black text-success leading-tight">
              "Sua torcida alimentou sonhos."
            </p>
            <p className="text-sm text-navy/60">
              Após a doação você recebe comprovante automático, e sua doação entra no ranking do seu clube.
            </p>
          </div>

          <div className="bg-card rounded-3xl p-7 border border-navy/5">
            <p className="text-xs font-bold uppercase tracking-wider text-navy/50 mb-3">Impacto estimado</p>
            <ul className="space-y-2 text-sm text-navy/70">
              <li>R$ 10 = 4 refeições escolares</li>
              <li>R$ 50 = 1 kit material escolar</li>
              <li>R$ 100 = 1 mês de atividade esportiva</li>
            </ul>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}
