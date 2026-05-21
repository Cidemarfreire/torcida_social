import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const MP_BASE = "https://api.mercadopago.com";

function getToken(): string {
  const t = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!t) throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado");
  return t;
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurado");
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getWebhookUrl() {
  const explicitUrl = process.env.MERCADOPAGO_WEBHOOK_URL;
  if (explicitUrl) return explicitUrl;

  const projectId = process.env.VITE_SUPABASE_PROJECT_ID;
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!projectId) return undefined;

  const url = new URL(`https://${projectId}.supabase.co/functions/v1/mercadopago-webhook`);
  if (secret) url.searchParams.set("secret", secret);
  return url.toString();
}

function createExternalReference() {
  return `ts_${crypto.randomUUID()}`;
}

/**
 * Cria checkout no Mercado Pago.
 * - Doação única: cria uma Preference (Checkout Pro) → retorna init_point.
 * - Doação mensal: cria um Preapproval (assinatura recorrente) → retorna init_point.
 */
export const createDonationCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: {
    amountInCents: number;
    recurring?: boolean;
    customerEmail?: string;
    returnUrl: string;
  }) => {
    if (!data.amountInCents || data.amountInCents < 100) {
      throw new Error("Valor mínimo da doação é R$ 1,00");
    }
    if (data.amountInCents > 10_000_000) {
      throw new Error("Valor inválido");
    }
    if (!data.returnUrl || !/^https?:\/\//.test(data.returnUrl)) {
      throw new Error("returnUrl inválido");
    }
    if (data.recurring && !data.customerEmail) {
      throw new Error("E-mail é obrigatório para doação mensal");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const token = getToken();
    const supabase = getSupabaseAdmin();
    const amount = Number((data.amountInCents / 100).toFixed(2));
    const externalReference = createExternalReference();
    const notificationUrl = getWebhookUrl();

    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert({
        amount_cents: data.amountInCents,
        recurring: Boolean(data.recurring),
        customer_email: data.customerEmail ?? null,
        external_reference: externalReference,
      })
      .select("id")
      .single();

    if (donationError) {
      throw donationError;
    }

    if (data.recurring) {
      const res = await fetch(`${MP_BASE}/preapproval`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": donation.id,
        },
        body: JSON.stringify({
          reason: "Doação mensal — Torcida Social",
          auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            transaction_amount: amount,
            currency_id: "BRL",
          },
          payer_email: data.customerEmail,
          back_url: data.returnUrl,
          external_reference: externalReference,
          ...(notificationUrl && { notification_url: notificationUrl }),
          status: "pending",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error("MP preapproval error:", json);
        throw new Error(json?.message || "Falha ao iniciar assinatura");
      }

      await supabase
        .from("donations")
        .update({
          checkout_url: json.init_point,
          mercadopago_preapproval_id: json.id ? String(json.id) : null,
        })
        .eq("id", donation.id);

      await supabase
        .from("subscriptions")
        .insert({
          donation_id: donation.id,
          customer_email: data.customerEmail,
          amount_cents: data.amountInCents,
          external_reference: externalReference,
          mercadopago_preapproval_id: json.id ? String(json.id) : null,
          raw_preapproval: json,
        });

      return { url: json.init_point as string };
    }

    const res = await fetch(`${MP_BASE}/checkout/preferences`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": donation.id,
      },
      body: JSON.stringify({
        items: [{
          id: "doacao-torcida-social",
          title: "Doação — Torcida Social",
          description: "Doação única para a Torcida Social",
          category_id: "donations",
          quantity: 1,
          currency_id: "BRL",
          unit_price: amount,
        }],
        back_urls: {
          success: data.returnUrl,
          pending: data.returnUrl,
          failure: data.returnUrl,
        },
        auto_return: "approved",
        external_reference: externalReference,
        ...(notificationUrl && { notification_url: notificationUrl }),
        payment_methods: {
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 12,
        },
        date_of_expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        ...(data.customerEmail && { payer: { email: data.customerEmail } }),
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error("MP preference error:", json);
      throw new Error(json?.message || "Falha ao iniciar checkout");
    }

    await supabase
      .from("donations")
      .update({
        checkout_url: json.init_point,
        mercadopago_preference_id: json.id ? String(json.id) : null,
      })
      .eq("id", donation.id);

    return { url: json.init_point as string };
  });

export const createPixDonation = createServerFn({ method: "POST" })
  .inputValidator((data: {
    amountInCents: number;
    customerEmail: string;
  }) => {
    if (!data.amountInCents || data.amountInCents < 100) {
      throw new Error("Valor mínimo da doação é R$ 1,00");
    }
    if (data.amountInCents > 10_000_000) {
      throw new Error("Valor inválido");
    }
    if (!data.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) {
      throw new Error("E-mail válido é obrigatório para gerar Pix");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const token = getToken();
    const supabase = getSupabaseAdmin();
    const amount = Number((data.amountInCents / 100).toFixed(2));
    const externalReference = createExternalReference();
    const notificationUrl = getWebhookUrl();

    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert({
        amount_cents: data.amountInCents,
        recurring: false,
        customer_email: data.customerEmail,
        external_reference: externalReference,
      })
      .select("id")
      .single();

    if (donationError) {
      throw donationError;
    }

    const res = await fetch(`${MP_BASE}/v1/payments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": donation.id,
      },
      body: JSON.stringify({
        transaction_amount: amount,
        description: "Doação — Torcida Social",
        payment_method_id: "pix",
        external_reference: externalReference,
        ...(notificationUrl && { notification_url: notificationUrl }),
        payer: {
          email: data.customerEmail,
        },
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      console.error("MP pix error:", json);
      throw new Error(json?.message || json?.cause?.[0]?.description || "Falha ao gerar Pix");
    }

    await supabase
      .from("donations")
      .update({
        status: json.status || "pending",
        mercadopago_payment_id: json.id ? String(json.id) : null,
        payment_method_id: "pix",
        payment_type_id: "bank_transfer",
        raw_payment: json,
      })
      .eq("id", donation.id);

    return {
      donationId: donation.id as string,
      paymentId: json.id ? String(json.id) : null,
      status: json.status as string,
      qrCode: json.point_of_interaction?.transaction_data?.qr_code as string | undefined,
      qrCodeBase64: json.point_of_interaction?.transaction_data?.qr_code_base64 as string | undefined,
      ticketUrl: json.point_of_interaction?.transaction_data?.ticket_url as string | undefined,
    };
  });
