import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/logo-torcida-social.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/quem-somos", label: "Quem Somos" },
  { to: "/projetos", label: "Projetos" },
  { to: "/doacoes", label: "Doações" },
  { to: "/ranking", label: "Ranking" },
  { to: "/area-crianca", label: "Área da Criança" },
  { to: "/integracao-neuroinclusiva", label: "NeuroInclusão" },
  { to: "/parceiros", label: "Parceiros" },
  { to: "/noticias", label: "Notícias" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-navy/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Torcida Social — Home">
          <img src={logo} alt="Torcida Social" width={48} height={48} className="size-12 object-contain" />
          <span className="font-display text-xl font-black tracking-tight uppercase text-navy hidden sm:inline">
            Torcida<span className="text-success">Social</span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-6 font-semibold text-sm">
          {NAV.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={active ? "text-action" : "text-navy/70 hover:text-action transition-colors"}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/perfil" className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-navy hover:text-action transition-colors">
                <UserIcon size={16} /> Perfil
              </Link>
              <button
                onClick={() => signOut()}
                className="hidden md:inline-flex items-center gap-1.5 bg-navy text-background px-4 py-2.5 rounded-full text-sm font-bold hover:bg-action transition-colors"
              >
                <LogOut size={14} /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:inline-flex text-sm font-bold text-navy hover:text-action transition-colors">
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="hidden md:inline-flex bg-navy text-background px-5 py-2.5 rounded-full text-sm font-bold hover:bg-action transition-colors"
              >
                Quero Ajudar
              </Link>
            </>
          )}
          <button
            className="xl:hidden p-2 -mr-2 text-navy"
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-navy/5 bg-background">
          <nav className="max-w-7xl mx-auto px-6 py-4 grid gap-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-semibold text-navy/80 hover:text-action"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/cadastro"
              onClick={() => setOpen(false)}
              className="mt-2 bg-navy text-background text-center py-3 rounded-full text-sm font-bold"
            >
              Quero Ajudar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
