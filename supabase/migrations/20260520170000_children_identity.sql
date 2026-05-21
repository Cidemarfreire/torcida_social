create type public.child_status as enum ('pending_review', 'active', 'inactive', 'blocked');
create type public.guardian_relationship as enum ('mother', 'father', 'legal_guardian', 'other');
create type public.digital_card_status as enum ('active', 'inactive', 'revoked');

create table public.guardians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  document_number text,
  email text,
  phone text not null,
  relationship public.guardian_relationship not null default 'legal_guardian',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid not null references public.guardians(id) on delete restrict,
  full_name text not null,
  birth_date date,
  age integer check (age is null or age between 0 and 17),
  school text,
  nucleus text not null,
  address text,
  sports_interests text[] not null default '{}',
  status public.child_status not null default 'pending_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.child_consents (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  guardian_id uuid not null references public.guardians(id) on delete restrict,
  consent_text text not null,
  consent_version text not null default '2026-05-20',
  accepted boolean not null default false,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.child_digital_cards (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  public_code text not null unique,
  display_id text not null unique,
  status public.digital_card_status not null default 'active',
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guardians enable row level security;
alter table public.children enable row level security;
alter table public.child_consents enable row level security;
alter table public.child_digital_cards enable row level security;

create policy "guardians read own records" on public.guardians
  for select to authenticated using (user_id = auth.uid());

create policy "guardians insert own records" on public.guardians
  for insert to authenticated with check (user_id = auth.uid());

create policy "guardians update own records" on public.guardians
  for update to authenticated using (user_id = auth.uid());

create policy "admins read all guardians" on public.guardians
  for select to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create policy "guardians read own children" on public.children
  for select to authenticated using (
    exists (
      select 1 from public.guardians g
      where g.id = children.guardian_id and g.user_id = auth.uid()
    )
  );

create policy "guardians insert own children" on public.children
  for insert to authenticated with check (
    exists (
      select 1 from public.guardians g
      where g.id = children.guardian_id and g.user_id = auth.uid()
    )
  );

create policy "guardians update own pending children" on public.children
  for update to authenticated using (
    status = 'pending_review' and exists (
      select 1 from public.guardians g
      where g.id = children.guardian_id and g.user_id = auth.uid()
    )
  );

create policy "admins read all children" on public.children
  for select to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create policy "admins update all children" on public.children
  for update to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create policy "guardians read own consents" on public.child_consents
  for select to authenticated using (
    exists (
      select 1 from public.guardians g
      where g.id = child_consents.guardian_id and g.user_id = auth.uid()
    )
  );

create policy "guardians insert own consents" on public.child_consents
  for insert to authenticated with check (
    exists (
      select 1 from public.guardians g
      where g.id = child_consents.guardian_id and g.user_id = auth.uid()
    )
  );

create policy "admins read all consents" on public.child_consents
  for select to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create policy "guardians read own cards" on public.child_digital_cards
  for select to authenticated using (
    exists (
      select 1
      from public.children c
      join public.guardians g on g.id = c.guardian_id
      where c.id = child_digital_cards.child_id and g.user_id = auth.uid()
    )
  );

create policy "admins read all cards" on public.child_digital_cards
  for select to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create policy "admins update all cards" on public.child_digital_cards
  for update to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create sequence public.child_card_display_seq start 1;

create or replace function public.generate_child_card(_child_id uuid)
returns public.child_digital_cards
language plpgsql security definer set search_path = public
as $$
declare
  _code text;
  _display text;
  _card public.child_digital_cards;
begin
  if not exists (
    select 1
    from public.children c
    join public.guardians g on g.id = c.guardian_id
    where c.id = _child_id
      and (
        g.user_id = auth.uid()
        or public.has_role(auth.uid(), 'admin')
        or public.has_role(auth.uid(), 'moderator')
      )
  ) then
    raise exception 'Not allowed to generate card for this child';
  end if;

  _code := upper(replace(gen_random_uuid()::text, '-', ''));
  _display := 'TS-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.child_card_display_seq')::text, 6, '0');

  insert into public.child_digital_cards (child_id, public_code, display_id)
  values (_child_id, _code, _display)
  returning * into _card;

  return _card;
end;
$$;

create or replace function public.validate_child_card(_public_code text)
returns table (
  display_id text,
  child_initials text,
  nucleus text,
  status public.digital_card_status,
  issued_at timestamptz
)
language sql stable security definer set search_path = public
as $$
  select
    card.display_id,
    upper(left(split_part(c.full_name, ' ', 1), 1) || coalesce(left(nullif(split_part(c.full_name, ' ', array_length(string_to_array(c.full_name, ' '), 1)), ''), 1), '')) as child_initials,
    c.nucleus,
    card.status,
    card.issued_at
  from public.child_digital_cards card
  join public.children c on c.id = card.child_id
  where card.public_code = upper(_public_code)
    and card.status = 'active'
  limit 1;
$$;

revoke execute on function public.generate_child_card(uuid) from public, anon;
grant execute on function public.generate_child_card(uuid) to authenticated;
grant execute on function public.validate_child_card(text) to anon, authenticated;

create trigger guardians_touch before update on public.guardians
  for each row execute function public.touch_updated_at();

create trigger children_touch before update on public.children
  for each row execute function public.touch_updated_at();

create trigger child_digital_cards_touch before update on public.child_digital_cards
  for each row execute function public.touch_updated_at();

create index guardians_user_idx on public.guardians (user_id);
create index children_guardian_idx on public.children (guardian_id);
create index children_status_idx on public.children (status, created_at desc);
create index child_cards_code_idx on public.child_digital_cards (public_code);
create index child_cards_child_idx on public.child_digital_cards (child_id);
