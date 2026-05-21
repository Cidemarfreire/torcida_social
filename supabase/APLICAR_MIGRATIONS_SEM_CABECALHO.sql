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

create policy "users read own donations" on public.donations for select to authenticated using (user_id = auth.uid());
create policy "admins read all donations" on public.donations for select to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "admins read payment events" on public.payment_events for select to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "users read own subscriptions" on public.subscriptions for select to authenticated using (user_id = auth.uid());
create policy "admins read all subscriptions" on public.subscriptions for select to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

create trigger donations_touch before update on public.donations for each row execute function public.touch_updated_at();
create trigger subscriptions_touch before update on public.subscriptions for each row execute function public.touch_updated_at();

create index donations_status_created_idx on public.donations (status, created_at desc);
create index donations_user_created_idx on public.donations (user_id, created_at desc);
create index donations_mp_payment_idx on public.donations (mercadopago_payment_id);
create index payment_events_resource_idx on public.payment_events (resource_id, created_at desc);
create index subscriptions_status_created_idx on public.subscriptions (status, created_at desc);

grant execute on function public.has_role(uuid, public.app_role) to authenticated;

create type public.child_status as enum ('pending_review', 'active', 'inactive', 'blocked');
create type public.guardian_relationship as enum ('mother', 'father', 'legal_guardian', 'other');
create type public.digital_card_status as enum ('active', 'inactive', 'revoked');

create table public.guardians (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null, full_name text not null, document_number text, email text, phone text not null, relationship public.guardian_relationship not null default 'legal_guardian', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.children (id uuid primary key default gen_random_uuid(), guardian_id uuid not null references public.guardians(id) on delete restrict, full_name text not null, birth_date date, age integer check (age is null or age between 0 and 17), school text, nucleus text not null, address text, sports_interests text[] not null default '{}', status public.child_status not null default 'pending_review', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.child_consents (id uuid primary key default gen_random_uuid(), child_id uuid not null references public.children(id) on delete cascade, guardian_id uuid not null references public.guardians(id) on delete restrict, consent_text text not null, consent_version text not null default '2026-05-20', accepted boolean not null default false, accepted_at timestamptz, created_at timestamptz not null default now());
create table public.child_digital_cards (id uuid primary key default gen_random_uuid(), child_id uuid not null references public.children(id) on delete cascade, public_code text not null unique, display_id text not null unique, status public.digital_card_status not null default 'active', issued_at timestamptz not null default now(), revoked_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

alter table public.guardians enable row level security;
alter table public.children enable row level security;
alter table public.child_consents enable row level security;
alter table public.child_digital_cards enable row level security;

create policy "guardians read own records" on public.guardians for select to authenticated using (user_id = auth.uid());
create policy "guardians insert own records" on public.guardians for insert to authenticated with check (user_id = auth.uid());
create policy "guardians update own records" on public.guardians for update to authenticated using (user_id = auth.uid());
create policy "admins read all guardians" on public.guardians for select to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "guardians read own children" on public.children for select to authenticated using (exists (select 1 from public.guardians g where g.id = children.guardian_id and g.user_id = auth.uid()));
create policy "guardians insert own children" on public.children for insert to authenticated with check (exists (select 1 from public.guardians g where g.id = children.guardian_id and g.user_id = auth.uid()));
create policy "guardians update own pending children" on public.children for update to authenticated using (status = 'pending_review' and exists (select 1 from public.guardians g where g.id = children.guardian_id and g.user_id = auth.uid()));
create policy "admins read all children" on public.children for select to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "admins update all children" on public.children for update to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "guardians read own consents" on public.child_consents for select to authenticated using (exists (select 1 from public.guardians g where g.id = child_consents.guardian_id and g.user_id = auth.uid()));
create policy "guardians insert own consents" on public.child_consents for insert to authenticated with check (exists (select 1 from public.guardians g where g.id = child_consents.guardian_id and g.user_id = auth.uid()));
create policy "admins read all consents" on public.child_consents for select to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "guardians read own cards" on public.child_digital_cards for select to authenticated using (exists (select 1 from public.children c join public.guardians g on g.id = c.guardian_id where c.id = child_digital_cards.child_id and g.user_id = auth.uid()));
create policy "admins read all cards" on public.child_digital_cards for select to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "admins update all cards" on public.child_digital_cards for update to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

create sequence public.child_card_display_seq start 1;

create or replace function public.generate_child_card(_child_id uuid) returns public.child_digital_cards language plpgsql security definer set search_path = public as $$ declare _code text; _display text; _card public.child_digital_cards; begin if not exists (select 1 from public.children c join public.guardians g on g.id = c.guardian_id where c.id = _child_id and (g.user_id = auth.uid() or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'))) then raise exception 'Not allowed to generate card for this child'; end if; _code := upper(replace(gen_random_uuid()::text, '-', '')); _display := 'TS-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.child_card_display_seq')::text, 6, '0'); insert into public.child_digital_cards (child_id, public_code, display_id) values (_child_id, _code, _display) returning * into _card; return _card; end; $$;
create or replace function public.validate_child_card(_public_code text) returns table (display_id text, child_initials text, nucleus text, status public.digital_card_status, issued_at timestamptz) language sql stable security definer set search_path = public as $$ select card.display_id, upper(left(split_part(c.full_name, ' ', 1), 1) || coalesce(left(nullif(split_part(c.full_name, ' ', array_length(string_to_array(c.full_name, ' '), 1)), ''), 1), '')) as child_initials, c.nucleus, card.status, card.issued_at from public.child_digital_cards card join public.children c on c.id = card.child_id where card.public_code = upper(_public_code) and card.status = 'active' limit 1; $$;
revoke execute on function public.generate_child_card(uuid) from public, anon;
grant execute on function public.generate_child_card(uuid) to authenticated;
grant execute on function public.validate_child_card(text) to anon, authenticated;

create trigger guardians_touch before update on public.guardians for each row execute function public.touch_updated_at();
create trigger children_touch before update on public.children for each row execute function public.touch_updated_at();
create trigger child_digital_cards_touch before update on public.child_digital_cards for each row execute function public.touch_updated_at();
create index guardians_user_idx on public.guardians (user_id);
create index children_guardian_idx on public.children (guardian_id);
create index children_status_idx on public.children (status, created_at desc);
create index child_cards_code_idx on public.child_digital_cards (public_code);
create index child_cards_child_idx on public.child_digital_cards (child_id);

create type public.supporter_card_status as enum ('active', 'inactive', 'blocked');
alter table public.profiles add column if not exists phone text, add column if not exists birth_date date, add column if not exists referral_code text, add column if not exists referred_by text, add column if not exists supporter_card_id text, add column if not exists supporter_card_status public.supporter_card_status not null default 'active', add column if not exists profile_completed boolean not null default false;
create sequence if not exists public.supporter_card_seq start 1;
create or replace function public.generate_referral_code(_seed uuid) returns text language sql immutable as $$ select upper(substr(replace(_seed::text, '-', ''), 1, 10)); $$;
create or replace function public.generate_supporter_card_id() returns text language sql volatile as $$ select 'TOR-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.supporter_card_seq')::text, 6, '0'); $$;
create unique index if not exists profiles_referral_code_key on public.profiles (referral_code) where referral_code is not null;
create unique index if not exists profiles_supporter_card_id_key on public.profiles (supporter_card_id) where supporter_card_id is not null;
create index if not exists profiles_club_idx on public.profiles (club_id);
create index if not exists profiles_completed_idx on public.profiles (profile_completed);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ declare _full_name text; _city text; _club_id text; _phone text; _birth_date date; _referred_by text; begin _full_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''); _city := coalesce(new.raw_user_meta_data->>'city', ''); _club_id := nullif(new.raw_user_meta_data->>'club_id', ''); _phone := nullif(new.raw_user_meta_data->>'phone', ''); _referred_by := nullif(new.raw_user_meta_data->>'referred_by', ''); begin _birth_date := nullif(new.raw_user_meta_data->>'birth_date', '')::date; exception when others then _birth_date := null; end; insert into public.profiles (id, full_name, city, club_id, phone, birth_date, referred_by, referral_code, supporter_card_id, supporter_card_status, profile_completed) values (new.id, _full_name, _city, _club_id, _phone, _birth_date, _referred_by, public.generate_referral_code(new.id), public.generate_supporter_card_id(), 'active', (_full_name <> '' and _city <> '' and _club_id is not null)) on conflict (id) do update set full_name = excluded.full_name, city = excluded.city, club_id = excluded.club_id, phone = excluded.phone, birth_date = excluded.birth_date, referred_by = excluded.referred_by, referral_code = coalesce(public.profiles.referral_code, excluded.referral_code), supporter_card_id = coalesce(public.profiles.supporter_card_id, excluded.supporter_card_id), supporter_card_status = coalesce(public.profiles.supporter_card_status, excluded.supporter_card_status), profile_completed = excluded.profile_completed, updated_at = now(); insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing; return new; end; $$;
create policy "admins update all profiles" on public.profiles for update to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
