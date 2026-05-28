import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/logo-torcida-social.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/torcida", label: "Arquibancada" },
  { to: "/mao-na-massa", label: "Mão na Massa" },
  { to: "/projetos", label: "Projetos" },
  { to: "/doacoes", label: "Doações" },
  { to: "/noticias", label: "Notícias" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Torcida Social — Home"
        >
          <img
            src={logo}
            alt="Torcida Social"
            width={48}
            height={48}
            className="size-12 object-contain"
          />

          <span className="hidden font-display text-lg font-black uppercase tracking-tight text-slate-950 sm:inline xl:text-xl">
            Torcida<span className="text-yellow-600">Social</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
          {NAV.map((n) => {
            const active = location.pathname === n.to;

            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  active
                    ? "bg-yellow-400 text-slate-950 shadow-md"
                    : "text-slate-700 hover:bg-yellow-400/15 hover:text-yellow-700"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/perfil"
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-100 md:inline-flex"
              >
                <UserIcon size={16} />
                Perfil
              </Link>

              <button
                onClick={() => signOut()}
                className="hidden items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-yellow-500 hover:text-slate-950 md:inline-flex"
              >
                <LogOut size={14} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-100 md:inline-flex"
              >
                Entrar
              </Link>

              <Link
                to="/cadastro"
                className="hidden rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-yellow-400 hover:text-slate-950 md:inline-flex"
              >
                Quero Ajudar
              </Link>
            </>
          )}

          <button
            className="inline-flex rounded-full bg-slate-100 p-3 text-slate-950 transition hover:bg-yellow-400 lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:px-6">
            {NAV.map((n) => {
              const active = location.pathname === n.to;

              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    active
                      ? "bg-yellow-400 text-slate-950"
                      : "bg-slate-100 text-slate-700 hover:bg-yellow-400/20"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}

            <div className="grid gap-3 border-t border-slate-200 pt-4 md:hidden">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/perfil"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700"
                  >
                    Perfil
                  </Link>

                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-left text-sm font-black text-white"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700"
                  >
                    Entrar
                  </Link>

                  <Link
                    to="/cadastro"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-yellow-400 px-4 py-4 text-center text-sm font-black text-slate-950 shadow-lg"
                  >
                    Quero Ajudar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}