const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeSecretKey || !stripeSecretKey.startsWith("sk_")) {
      throw new Error("STRIPE_SECRET_KEY inválida ou não configurada");
    }

    const body = await req.json().catch(() => ({}));

    const amount = Number(body.amount || 5);
    const planName = body.planName || "Doação Torcida Social";
    const type = body.type || "donation";
    const customerEmail = body.customerEmail || "";

    if (!amount || amount < 5) {
      throw new Error("Valor mínimo inválido");
    }

    const origin = req.headers.get("origin") || "https://www.multplen.com.br";

    const params = new URLSearchParams();

    params.append("mode", "payment");
  params.append("payment_method_types[]", "card");
    params.append("line_items[0][quantity]", "1");
    params.append("line_items[0][price_data][currency]", "brl");
    params.append("line_items[0][price_data][unit_amount]", String(Math.round(amount * 100)));
    params.append("line_items[0][price_data][product_data][name]", planName);
    params.append(
      "line_items[0][price_data][product_data][description]",
      "Contribuição para projetos sociais, esportivos e educacionais da Torcida Social."
    );

    if (customerEmail) {
      params.append("customer_email", customerEmail);
    }

    params.append("metadata[type]", type);
    params.append("metadata[platform]", "torcida-social");
    params.append("success_url", `${origin}/doacoes/obrigado?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${origin}/doacoes`);

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const stripeData = await stripeResponse.json();

    if (!stripeResponse.ok) {
      throw new Error(stripeData?.error?.message || "Erro ao criar checkout Stripe");
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: stripeData.url,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});