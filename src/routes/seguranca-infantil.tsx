import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Mail, Ban } from "lucide-react";

export const Route = createFileRoute("/seguranca-infantil")({
  component: SegurancaInfantil,
  head: () => ({
    meta: [
      { title: "Padrões de Segurança Infantil | Torcida Social" },
      { name: "description", content: "Política de proteção infantil, combate à exploração e segurança de crianças e adolescentes no Torcida Social." },
      { property: "og:title", content: "Padrões de Segurança Infantil | Torcida Social" },
      { property: "og:url", content: "/seguranca-infantil" },
    ],
    links: [{ rel: "canonical", href: "/seguranca-infantil" }],
  }),
});

function SegurancaInfantil() {
  return (
    <SiteLayout>
      <PageHero 
        eyebrow="Segurança" 
        title={<>Padrões de <span className="text-success">Segurança Infantil</span></>} 
        subtitle="Proteção e compromisso com crianças e adolescentes." 
      />
      <article className="max-w-3xl mx-auto px-6 py-16 text-navy/80 leading-relaxed space-y-8">
        
        <div className="bg-navy/5 border border-navy/10 rounded-2xl p-6">
          <p className="font-semibold text-navy">
            O Torcida Social possui <span className="text-action font-bold">tolerância zero</span> a abuso, exploração sexual infantil (CSAE), assédio, aliciamento e qualquer conteúdo inadequado envolvendo menores.
          </p>
        </div>

        <section>
          <h2 className="font-display text-2xl font-black text-navy flex items-center gap-3">
            <Shield className="text-success" />
            Nosso Compromisso com Crianças e Adolescentes
          </h2>
          <p className="mt-4">
            O Torcida Social é uma plataforma dedicada à inclusão social através do esporte. Nosso compromisso é garantir um ambiente seguro e protegido para todas as crianças e adolescentes que utilizam nossa plataforma.
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Monitoramento ativo de conteúdos e interações</li>
            <li>Verificação de identidade para maiores de idade</li>
            <li>Cooperação plena com autoridades competentes</li>
            <li>Educação e conscientização sobre segurança digital</li>
            <li>Resposta rápida a denúncias de conteúdo inadequado</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black text-navy flex items-center gap-3">
            <Shield className="text-success" />
            Medidas de Proteção
          </h2>
          <p className="mt-4">
            Implementamos diversas medidas para proteger crianças e adolescentes em nossa plataforma:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Filtragem de conteúdo:</strong> Sistemas automáticos detectam e bloqueiam conteúdo inadequado</li>
            <li><strong>Moderação humana:</strong> Equipe treinada revisa conteúdos reportados</li>
            <li><strong>Controles parentais:</strong> Ferramentas para responsáveis acompanharem a atividade</li>
            <li><strong>Privacidade reforçada:</strong> Dados de menores recebem proteção adicional</li>
            <li><strong>Denúncias anônimas:</strong> Qualquer usuário pode reportar conteúdo suspeito</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black text-navy flex items-center gap-3">
            <AlertTriangle className="text-warning" />
            Como Denunciar
          </h2>
          <p className="mt-4">
            Se você identificar conteúdo ou comportamento inadequado envolvendo crianças e adolescentes, denuncie imediatamente:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Utilize o botão de denúncia disponível em cada conteúdo</li>
            <li>Envie e-mail para <a href="mailto:contato@torcidasocial.com.br" className="text-action underline font-semibold">contato@torcidasocial.com.br</a></li>
            <li>Forneça o máximo de detalhes possível sobre a situação</li>
            <li>Denúncias são tratadas com confidencialidade e urgência</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black text-navy flex items-center gap-3">
            <Ban className="text-destructive" />
            Consequências para Violações
          </h2>
          <p className="mt-4">
            Conteúdos ou usuários que violarem nossas políticas de segurança infantil estarão sujeitos a:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Remoção imediata</strong> do conteúdo inadequado</li>
            <li><strong>Bloqueio permanente</strong> da conta do usuário infrator</li>
            <li><strong>Comunicação às autoridades</strong> competentes quando necessário</li>
            <li><strong>Cooperação total</strong> com investigações policiais</li>
            <li><strong>Medidas legais</strong> cabíveis conforme a legislação brasileira</li>
          </ul>
        </section>

        <section className="bg-success/10 border border-success/20 rounded-2xl p-8 text-center">
          <h3 className="font-display text-xl font-black text-navy mb-4">Canal de Denúncias</h3>
          <p className="mb-6 text-navy/70">
            Para denúncias relacionadas à segurança infantil, entre em contato:
          </p>
          <a href="mailto:contato@torcidasocial.com.br" className="inline-flex items-center gap-2 text-action font-semibold text-lg hover:underline">
            <Mail className="size-5" />
            contato@torcidasocial.com.br
          </a>
        </section>

        <div className="flex justify-center pt-4">
          <Button asChild size="lg" className="bg-action hover:bg-action/90 text-white font-bold">
            <a href="mailto:contato@torcidasocial.com.br">
              Entrar em Contato
            </a>
          </Button>
        </div>

      </article>
    </SiteLayout>
  );
}
