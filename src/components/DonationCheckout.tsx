import { useState } from "react";
import { createDonationCheckout, createPixDonation } from "@/lib/payments.functions";

interface DonationCheckoutProps {
  amountInCents: number;
  recurring?: boolean;
  returnUrl?: string;
}

export function DonationCheckout({ amountInCents, recurring, returnUrl }: DonationCheckoutProps) {
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"pix" | "checkout">(recurring ? "checkout" : "pix");
  const [pix, setPix] = useState<{
    qrCode?: string;
    qrCodeBase64?: string;
    ticketUrl?: string;
    paymentId?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!recurring && method === "pix") {
        const res = await createPixDonation({
          data: {
            amountInCents,
            customerEmail: email,
          },
        });

        if (!res?.qrCode && !res?.qrCodeBase64 && !res?.ticketUrl) {
          throw new Error("Pix gerado sem QR Code. Tente novamente.");
        }

        setPix(res);
        setLoading(false);
        return;
      }

      const res = await createDonationCheckout({
        data: {
          amountInCents,
          recurring,
          customerEmail: email || undefined,
          returnUrl: returnUrl || `${window.location.origin}/doacoes/obrigado`,
        },
      });
      if (!res?.url) throw new Error("Falha ao iniciar checkout");
      window.location.href = res.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar pagamento");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!recurring && !pix && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMethod("pix")}
            className={`py-3 rounded-xl border-2 font-black transition-colors ${method === "pix" ? "border-action bg-action/5 text-action" : "border-navy/10 text-navy/60"}`}
          >
            PIX
          </button>
          <button
            type="button"
            onClick={() => setMethod("checkout")}
            className={`py-3 rounded-xl border-2 font-black transition-colors ${method === "checkout" ? "border-action bg-action/5 text-action" : "border-navy/10 text-navy/60"}`}
          >
            CARTÃO
          </button>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-2">
          E-mail {recurring || method === "pix" ? "(obrigatório)" : "(opcional, para o comprovante)"}
        </label>
        <input
          type="email"
          required={recurring || method === "pix"}
          disabled={Boolean(pix)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="w-full bg-surface border-2 border-navy/10 px-4 py-4 rounded-xl font-medium focus:border-action outline-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {pix ? (
        <div className="bg-surface border border-navy/10 rounded-2xl p-5 space-y-4 text-center">
          <p className="font-display text-xl font-black text-navy">PIX gerado</p>
          {pix.qrCodeBase64 && (
            <img
              src={`data:image/png;base64,${pix.qrCodeBase64}`}
              alt="QR Code Pix"
              className="mx-auto w-56 h-56 rounded-xl bg-white p-2"
            />
          )}
          {pix.qrCode && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-navy/50">Pix copia e cola</p>
              <textarea
                readOnly
                value={pix.qrCode}
                className="w-full h-28 bg-card border-2 border-navy/10 rounded-xl p-3 text-xs"
              />
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(pix.qrCode || "")}
                className="w-full bg-navy text-background py-3 rounded-xl font-black hover:bg-action transition-colors"
              >
                COPIAR CÓDIGO PIX
              </button>
            </div>
          )}
          {pix.ticketUrl && (
            <a href={pix.ticketUrl} target="_blank" rel="noreferrer" className="block text-sm font-bold text-action underline">
              Abrir pagamento no Mercado Pago
            </a>
          )}
          <p className="text-[11px] text-navy/45">
            Após o pagamento, a confirmação depende do webhook do Mercado Pago.
          </p>
        </div>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-action text-background py-5 rounded-xl font-black text-lg hover:bg-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (method === "pix" && !recurring ? "Gerando Pix..." : "Redirecionando...") : method === "pix" && !recurring ? "GERAR PIX →" : "IR PARA O PAGAMENTO →"}
        </button>
      )}

      <p className="text-[11px] text-navy/40 text-center">
        {recurring ? "Doações mensais são finalizadas no Mercado Pago." : "Você pode pagar com Pix direto no app ou cartão pelo Mercado Pago."}
      </p>
    </form>
  );
}
