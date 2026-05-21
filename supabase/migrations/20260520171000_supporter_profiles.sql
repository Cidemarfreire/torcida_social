create type public.supporter_card_status as enum ('active', 'inactive', 'blocked');

alter table public.profiles
  add column if not exists phone text,
  add column if not exists birth_date date,
  add column if not exists referral_code text,
  add column if not exists referred_by text,
  add column if not exists supporter_card_id text,
  add column if not exists supporter_card_status public.supporter_card_status not null default 'active',
  add column if not exists profile_completed boolean not null default false;

create sequence if not exists public.supporter_card_seq start 1;

create or replace function public.generate_referral_code(_seed uuid)
returns text
language sql immutable
as $$
  select upper(substr(replace(_seed::text, '-', ''), 1, 10));
$$;

create or replace function public.generate_supporter_card_id()
returns text
language sql volatile
as $$
  select 'TOR-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.supporter_card_seq')::text, 6, '0');
$$;

create unique index if not exists profiles_referral_code_key on public.profiles (referral_code) where referral_code is not null;
create unique index if not exists profiles_supporter_card_id_key on public.profiles (supporter_card_id) where supporter_card_id is not null;
create index if not exists profiles_club_idx on public.profiles (club_id);
create index if not exists profiles_completed_idx on public.profiles (profile_completed);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  _full_name text;
  _city text;
  _club_id text;
  _phone text;
  _birth_date date;
  _referred_by text;
begin
  _full_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '');
  _city := coalesce(new.raw_user_meta_data->>'city', '');
  _club_id := nullif(new.raw_user_meta_data->>'club_id', '');
  _phone := nullif(new.raw_user_meta_data->>'phone', '');
  _referred_by := nullif(new.raw_user_meta_data->>'referred_by', '');

  begin
    _birth_date := nullif(new.raw_user_meta_data->>'birth_date', '')::date;
  exception when others then
    _birth_date := null;
  end;

  insert into public.profiles (
    id,
    full_name,
    city,
    club_id,
    phone,
    birth_date,
    referred_by,
    referral_code,
    supporter_card_id,
    supporter_card_status,
    profile_completed
  ) values (
    new.id,
    _full_name,
    _city,
    _club_id,
    _phone,
    _birth_date,
    _referred_by,
    public.generate_referral_code(new.id),
    public.generate_supporter_card_id(),
    'active',
    (_full_name <> '' and _city <> '' and _club_id is not null)
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    city = excluded.city,
    club_id = excluded.club_id,
    phone = excluded.phone,
    birth_date = excluded.birth_date,
    referred_by = excluded.referred_by,
    referral_code = coalesce(public.profiles.referral_code, excluded.referral_code),
    supporter_card_id = coalesce(public.profiles.supporter_card_id, excluded.supporter_card_id),
    supporter_card_status = coalesce(public.profiles.supporter_card_status, excluded.supporter_card_status),
    profile_completed = excluded.profile_completed,
    updated_at = now();

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict do nothing;

  return new;
end;
$$;

create policy "admins update all profiles" on public.profiles
  for update to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );
