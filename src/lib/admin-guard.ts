import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export async function requireAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw redirect({ to: "/login" });
  }
  const { data: isAdmin, error } = await supabase.rpc("has_role", {
    _user_id: session.user.id,
    _role: "admin",
  });
  if (error || !isAdmin) {
    throw redirect({ to: "/" });
  }
}
