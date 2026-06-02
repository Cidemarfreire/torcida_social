-- Adicionar coluna image_url (nullable) à tabela news_drafts
alter table public.news_drafts 
add column if not exists image_url text;

-- Adicionar comentário
comment on column public.news_drafts.image_url is 'URL da imagem da notícia (opcional)';

-- Adicionar novas categorias ao enum news_topic
-- Nota: PostgreSQL não permite alterar enums diretamente, então precisamos:
-- 1. Criar novo tipo
-- 2. Atualizar a coluna para usar o novo tipo
-- 3. Remover o tipo antigo (opcional, mas mantemos para compatibilidade)

-- Criar novo tipo de enum com todas as categorias
do $$
begin
    if not exists (select 1 from pg_type where typname = 'news_topic_new') then
        create type public.news_topic_new as enum (
            'social_sports',
            'selecao_brasileira',
            'copa',
            'futebol_nacional',
            'futebol_mundial',
            'esporte_social'
        );
    end if;
end $$;

-- Atualizar a coluna topic para usar o novo tipo
alter table public.news_drafts 
alter column topic type public.news_topic_new 
using topic::text::public.news_topic_new;

-- Remover o tipo antigo (opcional, mas mantemos para compatibilidade)
-- drop type if exists public.news_topic;

-- Renomear o novo tipo para o nome original
alter type public.news_topic_new rename to news_topic;

-- Adicionar comentários sobre as categorias
comment on type public.news_topic is 'Categorias de notícias: social_sports (Esporte Social), selecao_brasileira (Seleção Brasileira), copa (Mundo dos Esportes/Futebol Mundial), futebol_nacional (Futebol Nacional), futebol_mundial (Futebol Mundial), esporte_social (Esporte Social)';
