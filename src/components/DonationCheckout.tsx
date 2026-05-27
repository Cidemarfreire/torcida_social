import { useState } from "react";

interface DonationCheckoutProps {
  amountInCents: number;
  recurring?: boolean;
  returnUrl?: string;
}

export function DonationCheckout({
  amountInCents,
  recurring = false,
}: DonationCheckoutProps) {
  const [email, setEmail] = useState("");
  const [pix, setPix] = useState<any>(null);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);

  const amount = Math.max(5, Math.round(amountInCents / 100));

  async function payWithStripe() {
    setLoadingStripe(true);

    try {
      const response = await fetch(
        "https://yqmgtqtrpxoqbgpkdjcg.supabase.co/functions/v1/create-stripe-checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            customerEmail: email,
            planName: recurring
              ? "Doação Mensal Torcida Social"
              : "Doação Torcida Social",
            type: recurring ? "recurring_donation" : "donation",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Erro ao iniciar pagamento Stripe");
      }

      window.location.href = data.url;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro no cartão.");
    } finally {
      setLoadingStripe(false);
    }
  }

  async function payWithPix() {
    setLoadingPix(true);
    setPix(null);

    try {
      const response = await fetch(
        "https://yqmgtqtrpxoqbgpkdjcg.supabase.co/functions/v1/create-mercadopago-pix",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            customerEmail: email,
            customerName: "Doador Torcida Social",
            planName: recurring
              ? "Doação Mensal Torcida Social"
              : "Doação Torcida Social",
            type: recurring ? "recurring_donation" : "donation",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.qrCode) {
        throw new Error(data?.error || "Erro ao gerar Pix");
      }

      setPix(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao gerar Pix.");
    } finally {
      setLoadingPix(false);
    }
  }

  async function copyPix() {
    if (!pix?.qrCode) return;
    await navigator.clipboard.writeText(pix.qrCode);
    alert("Código Pix copiado!");
  }

  return (
    <div className="bg-card border border-navy/10 rounded-3xl p-6 space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-action">
          Escolha a forma de pagamento
        </p>

        <h3 className="font-display text-2xl font-black mt-1">
          Finalizar contribuição
        </h3>

        <p className="text-sm text-navy/60 mt-2">
          Escolha entre cartão seguro via Stripe ou Pix via Mercado Pago.
        </p>
      </div>

      <div className="bg-navy text-background rounded-2xl p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gold">
          Valor selecionado
        </p>

        <p className="font-display text-4xl font-black mt-2">
          R$ {amount.toLocaleString("pt-BR")}
        </p>

        <p className="text-background/60 text-sm mt-1">
          {recurring ? "Contribuição mensal" : "Contribuição única"}
        </p>
      </div>

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-widest text-navy/60">
          E-mail para confirmação
        </span>

        <input
          type="email"
          required
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border-2 border-navy/10 rounded-xl px-4 py-3 focus:border-action outline-none"
        />
      </label>

      <div className="grid md:grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!email || loadingStripe || loadingPix}
          onClick={payWithStripe}
          className="w-full bg-gold text-navy py-4 rounded-2xl font-black hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loadingStripe ? "ABRINDO STRIPE..." : "PAGAR COM CARTÃO"}
        </button>

        <button
          type="button"
          disabled={!email || loadingPix || loadingStripe}
          onClick={payWithPix}
          className="w-full bg-navy text-background py-4 rounded-2xl font-black hover:bg-action transition-colors disabled:opacity-50"
        >
          {loadingPix ? "GERANDO PIX..." : "PAGAR COM PIX"}
        </button>
      </div>

      {pix?.qrCode && (
        <div className="bg-surface border border-navy/10 rounded-2xl p-5 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-action">
            Pix gerado com sucesso
          </p>

          {pix.qrCodeBase64 && (
            <img
              src={`data:image/png;base64,${pix.qrCodeBase64}`}
              alt="QR Code Pix"
              className="w-56 h-56 mx-auto rounded-xl border border-navy/10 bg-white p-3"
            />
          )}

          <textarea
            readOnly
            value={pix.qrCode}
            className="w-full h-28 bg-card border-2 border-navy/10 rounded-xl p-3 text-xs"
          />

          <button
            type="button"
            onClick={copyPix}
            className="w-full bg-success text-background py-3 rounded-xl font-black hover:opacity-90 transition-opacity"
          >
            COPIAR CÓDIGO PIX
          </button>

          {pix.ticketUrl && (
            <a
              href={pix.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-sm font-bold text-action underline"
            >
              Abrir pagamento no Mercado Pago
            </a>
          )}
        </div>
      )}

      <p className="text-xs text-navy/45 leading-relaxed">
        Cartão processado com segurança pela Stripe. Pix processado via Mercado
        Pago PJ.
      </p>
    </div>
  );
}

export default DonationCheckout;