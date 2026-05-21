import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Entrar — Torcida Social" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo de volta!");
    navigate({ to: "/perfil" });
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/perfil",
      },
    });
    if (error) return toast.error("Falha no login com Google");
  };

  return (
    <SiteLayout>
      <section className="max-w-md mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-black uppercase">Entrar</h1>
        <p className="text-navy/60 mt-2">Sua torcida começa aqui.</p>

        <button
          onClick={handleGoogle}
          className="mt-8 w-full border-2 border-navy/10 hover:border-action rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
          Continuar com Google
        </button>

        <div className="flex items-center gap-3 my-6 text-xs text-navy/40">
          <div className="h-px flex-1 bg-navy/10" /> ou <div className="h-px flex-1 bg-navy/10" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full border-2 border-navy/10 rounded-xl px-4 py-3 focus:border-action outline-none" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full border-2 border-navy/10 rounded-xl px-4 py-3 focus:border-action outline-none" />
          <button type="submit" disabled={loading} className="w-full bg-navy text-background py-3 rounded-xl font-bold hover:bg-action transition-colors disabled:opacity-50">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-navy/60 text-center">
          Não tem conta? <Link to="/cadastro" className="text-action font-bold">Cadastre-se</Link>
        </p>
      </section>
    </SiteLayout>
  );
}
