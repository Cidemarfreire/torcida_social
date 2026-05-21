import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.4";

const MP_BASE = "https://api.mercadopago.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature, x-request-id",
};

type DonationStatus =
  | "pending"
  | "approved"
  | "authorized"
  | "in_process"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back"
  | "unknown";

type SubscriptionStatus = "pending" | "authorized" | "paused" | "cancelled" | "ended" | "unknown";

function mapPaymentStatus(status: string | undefined): DonationStatus {
  switch (status) {
    case "pending":
      return "pending";
    case "approved":
      return "approved";
    case "authorized":
      return "authorized";
    case "in_process":
      return "in_process";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "refunded":
      return "refunded";
    case "charged_back":
      return "charged_back";
    default:
      return "unknown";
  }
}

function mapPreapprovalStatus(status: string | undefined): SubscriptionStatus {
  switch (status) {
    case "pending":
      return "pending";
    case "authorized":
      return "authorized";
    case "paused":
      return "paused";
    case "cancelled":
      return "cancelled";
    case "ended":
      return "ended";
    default:
      return "unknown";
  }
}

async function fetchMercadoPagoResource(path: string, token: string) {
  const res = await fetch(`${MP_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Mercado Pago error ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const webhookSecret = Deno.env.get("MERCADOPAGO_WEBHOOK_SECRET");

    if (!token || !supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing MERCADOPAGO_ACCESS_TOKEN, SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const url = new URL(req.url);
    if (webhookSecret && url.searchParams.get("secret") !== webhookSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json().catch(() => ({}));
    const topic = url.searchParams.get("topic") ?? payload.type ?? payload.topic ?? "unknown";
    const resourceId = String(
      url.searchParams.get("id") ??
        payload.data?.id ??
        payload.id ??
        payload.resource ??
        "",
    );
    const eventId = String(payload.id ?? req.headers.get("x-request-id") ?? `${topic}:${resourceId}`);

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data: event } = await supabase
      .from("payment_events")
      .upsert(
        {
          provider: "mercadopago",
          event_id: eventId,
          event_type: topic,
          resource_id: resourceId,
          payload,
        },
        { onConflict: "provider,event_id", ignoreDuplicates: true },
      )
      .select("id")
      .single();

    if (!resourceId) {
      return new Response(JSON.stringify({ ok: true, ignored: "missing_resource_id" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let donationId: string | null = null;

    if (topic === "payment" || topic === "merchant_order") {
      const payment = topic === "payment"
        ? await fetchMercadoPagoResource(`/v1/payments/${resourceId}`, token)
        : null;

      if (payment) {
        const externalReference = payment.external_reference as string | undefined;
        const status = mapPaymentStatus(payment.status);
        const paidAt = status === "approved" ? payment.date_approved ?? new Date().toISOString() : null;

        if (externalReference) {
          const { data: donation, error } = await supabase
            .from("donations")
            .update({
              status,
              mercadopago_payment_id: String(payment.id),
              payment_method_id: payment.payment_method_id ?? null,
              payment_type_id: payment.payment_type_id ?? null,
              raw_payment: payment,
              paid_at: paidAt,
            })
            .eq("external_reference", externalReference)
            .select("id")
            .single();

          if (error) throw error;
          donationId = donation?.id ?? null;
        }
      }
    }

    if (topic === "preapproval" || topic === "subscription_preapproval") {
      const preapproval = await fetchMercadoPagoResource(`/preapproval/${resourceId}`, token);
      const externalReference = preapproval.external_reference as string | undefined;
      const status = mapPreapprovalStatus(preapproval.status);

      if (externalReference) {
        const { data: donation, error: donationError } = await supabase
          .from("donations")
          .update({
            status: status === "authorized" ? "authorized" : status === "cancelled" ? "cancelled" : "pending",
            mercadopago_preapproval_id: String(preapproval.id),
            raw_payment: preapproval,
            paid_at: status === "authorized" ? new Date().toISOString() : null,
          })
          .eq("external_reference", externalReference)
          .select("id")
          .single();

        if (donationError) throw donationError;
        donationId = donation?.id ?? null;

        const { error: subscriptionError } = await supabase
          .from("subscriptions")
          .update({
            status,
            mercadopago_preapproval_id: String(preapproval.id),
            raw_preapproval: preapproval,
            authorized_at: status === "authorized" ? new Date().toISOString() : null,
            cancelled_at: status === "cancelled" ? new Date().toISOString() : null,
          })
          .eq("external_reference", externalReference);

        if (subscriptionError) throw subscriptionError;
      }
    }

    if (event?.id) {
      await supabase
        .from("payment_events")
        .update({ donation_id: donationId, processed_at: new Date().toISOString() })
        .eq("id", event.id);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
