-- Criar bucket para avatares
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Criar política para permitir que usuários autenticados façam upload
create policy "Usuários podem fazer upload de avatares"
on storage.objects for insert
with check (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Criar política para permitir que usuários vejam seus próprios avatares
create policy "Usuários podem ver seus próprios avatares"
on storage.objects for select
using (
  bucket_id = 'avatars' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Criar política para permitir que usuários atualizem seus próprios avatares
create policy "Usuários podem atualizar seus próprios avatares"
on storage.objects for update
with check (
  bucket_id = 'avatars' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Criar política para permitir que usuários deletem seus próprios avatares
create policy "Usuários podem deletar seus próprios avatares"
on storage.objects for delete
using (
  bucket_id = 'avatars' 
  and (storage.foldername(name))[1] = auth.uid()::text
);
