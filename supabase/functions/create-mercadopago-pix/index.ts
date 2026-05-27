const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado");
    }

    const body = await req.json().catch(() => ({}));

    const amount = Number(body.amount || 5);

    const customerEmail = String(
      body.customerEmail || ""
    ).trim();

    const customerName = String(
      body.customerName || "Doador Torcida Social"
    ).trim();

    const planName = String(
      body.planName || "Doação Torcida Social"
    ).trim();

    const type = String(
      body.type || "donation"
    ).trim();

    if (!amount || amount < 5) {
      throw new Error(
        "Valor mínimo para Pix é R$ 5,00"
      );
    }

    if (
      !customerEmail ||
      !customerEmail.includes("@")
    ) {
      throw new Error(
        "Informe um e-mail válido"
      );
    }

    const idempotencyKey = crypto.randomUUID();

    const paymentResponse = await fetch(
      "https://api.mercadopago.com/v1/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          transaction_amount: amount,
          description: planName,
          payment_method_id: "pix",

          payer: {
            email: customerEmail,
            first_name:
              customerName.split(" ")[0] ||
              "Doador",

            last_name:
              customerName
                .split(" ")
                .slice(1)
                .join(" ") ||
              "Torcida Social",
          },

          metadata: {
            type,
            platform: "torcida-social",
            planName,
          },
        }),
      }
    );

    const paymentData =
      await paymentResponse.json();

    if (!paymentResponse.ok) {
      throw new Error(
        paymentData?.message ||
          paymentData?.error ||
          paymentData?.cause?.[0]
            ?.description ||
          "Erro ao criar Pix"
      );
    }

    const transactionData =
      paymentData?.point_of_interaction
        ?.transaction_data || {};

    return jsonResponse({
      success: true,

      provider: "mercadopago",

      paymentId: paymentData.id,

      status: paymentData.status,

      statusDetail:
        paymentData.status_detail,

      qrCode:
        transactionData.qr_code || null,

      qrCodeBase64:
        transactionData.qr_code_base64 ||
        null,

      ticketUrl:
        transactionData.ticket_url ||
        null,

      amount,
      planName,
      type,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido",
      },
      500
    );
  }
});