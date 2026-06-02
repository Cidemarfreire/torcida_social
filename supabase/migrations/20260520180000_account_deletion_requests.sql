-- Tabela para solicitações de exclusão de conta (Google Play Store requirement)
create table if not exists public.account_deletion_requests (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  email text not null,
  reason text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- Adicionar comentários
comment on table public.account_deletion_requests is 'Solicitações de exclusão de conta conforme exigências da Google Play Store';
comment on column public.account_deletion_requests.user_id is 'ID do usuário no Supabase Auth';
comment on column public.account_deletion_requests.email is 'E-mail do usuário';
comment on column public.account_deletion_requests.reason is 'Motivo opcional da exclusão';
comment on column public.account_deletion_requests.status is 'Status da solicitação: pending, completed, cancelled';
comment on column public.account_deletion_requests.created_at is 'Data da solicitação';

-- Habilitar RLS
alter table public.account_deletion_requests enable row level security;

-- Política para permitir inserção apenas para usuários autenticados
create policy "Usuários podem criar solicitação de exclusão própria"
  on public.account_deletion_requests
  for insert
  with check (auth.uid()::text = user_id);

-- Política para permitir leitura apenas do próprio usuário
create policy "Usuários podem ver suas próprias solicitações"
  on public.account_deletion_requests
  for select
  using (auth.uid()::text = user_id);
