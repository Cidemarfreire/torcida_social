# Setup de produção — Torcida Social

## Secrets necessários

Configure no ambiente do app/TanStack Start:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR...
MERCADOPAGO_WEBHOOK_SECRET=um-segredo-forte
MERCADOPAGO_WEBHOOK_URL=https://yqmgtqtrpxoqbgpkdjcg.supabase.co/functions/v1/mercadopago-webhook?secret=um-segredo-forte
SUPABASE_URL=https://yqmgtqtrpxoqbgpkdjcg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
VITE_SUPABASE_PROJECT_ID=yqmgtqtrpxoqbgpkdjcg
VITE_SUPABASE_URL=https://yqmgtqtrpxoqbgpkdjcg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
GENERATE_NEWS_SECRET=um-segredo-forte
GENERATE_NEWS_FUNCTION_URL=https://yqmgtqtrpxoqbgpkdjcg.supabase.co/functions/v1/generate-news-drafts
```

Configure no Supabase Edge Functions:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR...
MERCADOPAGO_WEBHOOK_SECRET=um-segredo-forte
SUPABASE_URL=https://yqmgtqtrpxoqbgpkdjcg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
GENERATE_NEWS_SECRET=um-segredo-forte
GEMINI_MODEL=gemini-2.5-flash
```

## Banco

Aplique as migrations em `supabase/migrations` no projeto Supabase antes de testar checkout.

## Funções Supabase

Faça deploy destas funções:

```bash
supabase functions deploy generate-news-drafts
supabase functions deploy mercadopago-webhook
```

## Mercado Pago

No painel do Mercado Pago, configure a URL de notificação/webhook:

```text
https://yqmgtqtrpxoqbgpkdjcg.supabase.co/functions/v1/mercadopago-webhook?secret=um-segredo-forte
```

Eventos necessários:

- `payment`
- `preapproval`

## Notícias automáticas

Para rodar manualmente, use o botão `Gerar notícias agora` no `/admin`.

Para rodar 3 vezes por dia, configure um cron externo, GitHub Actions, Supabase Scheduler ou Cloudflare Cron para chamar:

```text
POST https://yqmgtqtrpxoqbgpkdjcg.supabase.co/functions/v1/generate-news-drafts
x-generate-news-secret: um-segredo-forte
```

Sugestão de horários São Paulo:

- 08:00
- 14:00
- 20:00

## Fluxo de pagamento implementado

1. O app cria uma linha `donations` com status `pending`.
2. O app cria a preference/preapproval no Mercado Pago com `external_reference`.
3. O usuário paga com PIX/cartão/boleto no Mercado Pago.
4. O Mercado Pago chama `mercadopago-webhook`.
5. O webhook consulta a API do Mercado Pago e atualiza `donations`, `subscriptions` e `payment_events`.
