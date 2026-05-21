import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-torcida-social.png";

export function Footer() {
  return (
    <footer className="bg-navy text-background pt-20 pb-10 px-6 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Torcida Social" width={56} height={56} className="size-14 object-contain" />
            <span className="font-display text-xl font-black tracking-tight uppercase">
              Torcida Social
            </span>
          </div>
          <p className="text-background/50 max-w-sm text-sm leading-relaxed">
            Sediada em Teresópolis, expandindo para Niterói, Nova Iguaçu e Itaguaí.
            O esporte como ferramenta definitiva de inclusão social.
          </p>
          <p className="text-background/30 text-xs">CNPJ 36.347.215/0001-20 · Teresópolis, RJ</p>
          <div className="flex items-center gap-3 pt-2">
            <a href="https://www.instagram.com/torcidasocial" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Torcida Social" className="text-background/50 hover:text-background transition-colors text-xs font-bold uppercase tracking-widest">Instagram</a>
            <span className="text-background/20">·</span>
            <a href="https://www.facebook.com/share/1aWctkkcVu/" target="_blank" rel="noopener noreferrer" aria-label="Facebook da Torcida Social" className="text-background/50 hover:text-background transition-colors text-xs font-bold uppercase tracking-widest">Facebook</a>
            <span className="text-background/20">·</span>
            <a href="https://www.youtube.com/@torcidasocial" target="_blank" rel="noopener noreferrer" aria-label="YouTube da Torcida Social" className="text-background/50 hover:text-background transition-colors text-xs font-bold uppercase tracking-widest">YouTube</a>
            <span className="text-background/20">·</span>
            <a href="mailto:torcidasocial@gmail.com" aria-label="Enviar e-mail para a Torcida Social" className="text-background/50 hover:text-background transition-colors text-xs font-bold uppercase tracking-widest">E-mail</a>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold uppercase tracking-widest text-[11px] text-success">Torcedor</h4>
          <nav className="flex flex-col gap-2 text-background/60 text-sm">
            <Link to="/cadastro" className="hover:text-background">Cadastro</Link>
            <Link to="/perfil" className="hover:text-background">Meu Perfil</Link>
            <Link to="/meu-impacto" className="hover:text-background">Meu Impacto</Link>
            <Link to="/convide" className="hover:text-background">Convide sua Torcida</Link>
            <Link to="/mural" className="hover:text-background">Mural de Histórias</Link>
          </nav>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold uppercase tracking-widest text-[11px] text-success">Institucional</h4>
          <nav className="flex flex-col gap-2 text-background/60 text-sm">
            <Link to="/quem-somos" className="hover:text-background">Quem Somos</Link>
            <Link to="/nucleos" className="hover:text-background">Núcleos & Expansão</Link>
            <Link to="/area-crianca" className="hover:text-background">Área da Criança</Link>
            <Link to="/beneficios" className="hover:text-background">Benefícios</Link>
            <Link to="/empresarial" className="hover:text-background">Área Empresarial</Link>
            
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-background/10 flex flex-col md:flex-row justify-between gap-4 items-center text-[11px] font-bold uppercase tracking-widest text-background/30">
        <span>© 2026 Torcida Social. Todos os direitos reservados.</span>
        <nav className="flex gap-5">
          <Link to="/privacidade" className="hover:text-background">Privacidade</Link>
          <Link to="/termos" className="hover:text-background">Termos</Link>
          <Link to="/lgpd" className="hover:text-background">LGPD</Link>
        </nav>
        <span>A torcida que transforma vidas.</span>
      </div>
    </footer>
  );
}
