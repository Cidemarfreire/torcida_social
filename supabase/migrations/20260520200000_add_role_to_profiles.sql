-- Criar tipo de enum para roles de usuário
do $$
begin
    if not exists (select 1 from pg_type where typname = 'app_role') then
        create type public.app_role as enum ('admin', 'moderator', 'user');
    end if;
end $$;

-- Adicionar coluna role à tabela profiles
alter table public.profiles 
add column if not exists role public.app_role default 'user';

-- Adicionar comentário
comment on column public.profiles.role is 'Role do usuário: admin (administrador), moderator (moderador), user (usuário comum)';

-- Definir o usuário cidemarfaria@gmail.com como admin
update public.profiles 
set role = 'admin' 
where id in (
    select id from auth.users 
    where email = 'cidemarfaria@gmail.com'
);

-- Criar índice para melhor performance
create index if not exists idx_profiles_role on public.profiles(role);
