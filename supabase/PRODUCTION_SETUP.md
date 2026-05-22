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
GENERATE_NEWS_SECRET=um-segredo-forte
```

> **Noticias:** nao e necessario `GEMINI_API_KEY`. A coleta usa RSS publico (Google News), sem custo de IA.

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

## Notícias automáticas (sem IA paga)

1. Deploy da funcao: `supabase functions deploy generate-news-drafts`
2. Manual: botao **Coletar noticias agora** em `/admin`
3. Automatico 3x/dia: workflow `.github/workflows/generate-news.yml`

Secrets no GitHub (Settings → Secrets → Actions):

- `GENERATE_NEWS_SECRET` — mesmo valor do Supabase
- `GENERATE_NEWS_FUNCTION_URL` — `https://yqmgtqtrpxoqbgpkdjcg.supabase.co/functions/v1/generate-news-drafts`

Horarios (Sao Paulo): 08:00, 14:00 e 20:00.

Temas coletados:

- **Esporte social** — impacto social pelo esporte no Brasil
- **Selecao Brasileira** — rumo a Copa
- **Mundo dos esportes** — panorama internacional

Fluxo: RSS gera rascunhos → admin **Aprovar** ou **Publicar** → aparecem em `/noticias`.

## Fluxo de pagamento implementado

1. O app cria uma linha `donations` com status `pending`.
2. O app cria a preference/preapproval no Mercado Pago com `external_reference`.
3. O usuário paga com PIX/cartão/boleto no Mercado Pago.
4. O Mercado Pago chama `mercadopago-webhook`.
5. O webhook consulta a API do Mercado Pago e atualiza `donations`, `subscriptions` e `payment_events`.
