create type public.news_status as enum ('draft', 'approved', 'rejected', 'published');
create type public.news_topic as enum ('social_sports', 'selecao_brasileira', 'copa');

create table public.news_drafts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  social_relevance text not null default '',
  call_to_action text not null default '',
  sources text[] not null default '{}',
  status public.news_status not null default 'draft',
  topic public.news_topic not null default 'social_sports',
  generated_by text not null default 'ai',
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  published_at timestamptz
);

alter table public.news_drafts enable row level security;

create policy "public reads approved news" on public.news_drafts
  for select using (status in ('approved', 'published'));

create policy "admins read all news drafts" on public.news_drafts
  for select to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create policy "admins insert news drafts" on public.news_drafts
  for insert to authenticated with check (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create policy "admins update news drafts" on public.news_drafts
  for update to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create policy "admins delete news drafts" on public.news_drafts
  for delete to authenticated using (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')
  );

create trigger news_drafts_touch before update on public.news_drafts
  for each row execute function public.touch_updated_at();

create index news_drafts_public_idx
  on public.news_drafts (status, published_at desc, created_at desc);

create index news_drafts_topic_idx
  on public.news_drafts (topic);
