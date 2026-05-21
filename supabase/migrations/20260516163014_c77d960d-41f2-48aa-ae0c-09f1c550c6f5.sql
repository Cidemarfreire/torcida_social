
-- Fix search_path on trigger function
create or replace function public.touch_updated_at()
returns trigger language plpgsql security definer set search_path = public
as $$
begin new.updated_at = now(); return new; end;
$$;

-- Revoke public/authenticated EXECUTE on SECURITY DEFINER functions
-- (they are still callable by the system: triggers and RLS policies bypass these grants)
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
