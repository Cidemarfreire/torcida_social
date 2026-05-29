import { Link } from "@tanstack/react-router";
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
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Torcida Social — Home"
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt="Torcida Social"
            className="h-12 w-12 object-contain"
          />

          <span className="hidden text-lg font-black uppercase tracking-tight text-slate-950 sm:inline">
            Torcida<span className="text-yellow-600">Social</span>
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex rounded-full bg-slate-100 p-3 text-slate-950 transition hover:bg-yellow-400"
          aria-label="Abrir menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white shadow-2xl">
          <nav className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-yellow-400 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 grid gap-3 border-t border-slate-200 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/perfil"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-800"
                  >
                    <UserIcon size={16} />
                    Perfil
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-left text-sm font-black text-white"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-800"
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