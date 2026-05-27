import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export async function requireAdmin() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw redirect({ to: "/login" });
  }

  const email = session.user.email?.toLowerCase();

  if (email !== "cidemarfaria@gmail.com") {
    throw redirect({ to: "/" });
  }
}