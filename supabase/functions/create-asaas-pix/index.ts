const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type AsaasCustomerResponse = {
  id?: string;
  errors?: Array<{ description?: string }>;
};

type AsaasPaymentResponse = {
  id?: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  errors?: Array<{ description?: string }>;
};

type AsaasPixQrCodeResponse = {
  encodedImage?: string;
  payload?: string;
  expirationDate?: string;
  errors?: Array<{ description?: string }>;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function todayPlusDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function getAsaasBaseUrl() {
  return "https://api.asaas.com/v3";
}

function getAsaasError(data: unknown, fallback: string) {
  const maybe = data as { errors?: Array<{ description?: string }> };
  return maybe?.errors?.[0]?.description || fallback;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ASAAS_API_KEY");

    if (!apiKey) {
      throw new Error("ASAAS_API_KEY não configurada");
    }

    const body = await req.json().catch(() => ({}));

    const amount = Number(body.amount || 5);
    const email = String(body.customerEmail || "").trim();
    const name = String(body.customerName || "Doador Torcida Social").trim();

    if (!amount || amount < 5) {
      throw new Error("Valor mínimo para Pix é R$ 5,00");
    }

    if (!email || !email.includes("@")) {
      throw new Error("Informe um e-mail válido para gerar o Pix");
    }

    const headers = {
      "Content-Type": "application/json",
      access_token: apiKey,
    };

    const customerRes = await fetch(`${getAsaasBaseUrl()}/customers`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name,
        email,
      }),
    });

    const customerData =
      (await customerRes.json()) as AsaasCustomerResponse;

    if (!customerRes.ok || !customerData.id) {
      throw new Error(
        getAsaasError(customerData, "Erro ao criar cliente no Asaas"),
      );
    }

    const paymentRes = await fetch(`${getAsaasBaseUrl()}/payments`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        customer: customerData.id,
        billingType: "PIX",
        value: amount,
        dueDate: todayPlusDays(1),
        description:
          "Doação para projetos sociais, esportivos e educacionais da Torcida Social.",
      }),
    });

    const paymentData =
      (await paymentRes.json()) as AsaasPaymentResponse;

    if (!paymentRes.ok || !paymentData.id) {
      throw new Error(
        getAsaasError(paymentData, "Erro ao criar cobrança Pix no Asaas"),
      );
    }

    const qrRes = await fetch(
      `${getAsaasBaseUrl()}/payments/${paymentData.id}/pixQrCode`,
      {
        method: "GET",
        headers,
      },
    );

    const qrData =
      (await qrRes.json()) as AsaasPixQrCodeResponse;

    if (!qrRes.ok || !qrData.payload) {
      throw new Error(
        getAsaasError(qrData, "Erro ao gerar QR Code Pix no Asaas"),
      );
    }

    return jsonResponse({
      success: true,
      provider: "asaas",
      paymentId: paymentData.id,
      invoiceUrl: paymentData.invoiceUrl || paymentData.bankSlipUrl || null,
      qrCode: qrData.payload,
      qrCodeBase64: qrData.encodedImage || null,
      expirationDate: qrData.expirationDate || null,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      500,
    );
  }
});