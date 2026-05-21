create type public.donation_status as enum ('pending', 'approved', 'authorized', 'in_process', 'rejected', 'cancelled', 'refunded', 'charged_back', 'unknown');
create type public.payment_provider as enum ('mercadopago');
create type public.subscription_status as enum ('pending', 'authorized', 'paused', 'cancelled', 'ended', 'unknown');

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  club_id text,
  amount_cents integer not null check (amount_cents >= 100),
  currency text not null default 'BRL',
  status public.donation_status not null default 'pending',
  provider public.payment_provider not null default 'mercadopago',
  recurring boolean not null default false,
  customer_email text,
  external_reference text not null unique,
  checkout_url text,
  mercadopago_preference_id text,
  mercadopago_payment_id text,
  mercadopago_preapproval_id text,
  payment_method_id text,
  payment_type_id text,
  raw_payment jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider public.payment_provider not null default 'mercadopago',
  event_id text,
  event_type text,
  resource_id text,
  donation_id uuid references public.donations(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, event_id)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  donation_id uuid references public.donations(id) on delete set null,
  status public.subscription_status not null default 'pending',
  provider public.payment_provider not null default 'mercadopago',
  customer_email text not null,
  amount_cents integer not null check (amount_cents >= 100),
  currency text not null default 'BRL',
  external_reference text not null unique,
  mercadopago_preapproval_id text unique,
  raw_preapproval jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  authorized_at timestamptz,
  cancelled_at timestamptz
);

alter table public.donations enable row level security;
alter table public.payment_events enable row level security;
alter table public.subscriptions enable row level security;

create policy "users read own donations" on public.donations
  for select to authenticated using (user_id = auth.uid());

create policy "admins read all donations" on public.donations
  for select to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create policy "admins read payment events" on public.payment_events
  for select to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create policy "users read own subscriptions" on public.subscriptions
  for select to authenticated using (user_id = auth.uid());

create policy "admins read all subscriptions" on public.subscriptions
  for select to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create trigger donations_touch before update on public.donations
  for each row execute function public.touch_updated_at();

create trigger subscriptions_touch before update on public.subscriptions
  for each row execute function public.touch_updated_at();

create index donations_status_created_idx on public.donations (status, created_at desc);
create index donations_user_created_idx on public.donations (user_id, created_at desc);
create index donations_mp_payment_idx on public.donations (mercadopago_payment_id);
create index payment_events_resource_idx on public.payment_events (resource_id, created_at desc);
create index subscriptions_status_created_idx on public.subscriptions (status, created_at desc);
