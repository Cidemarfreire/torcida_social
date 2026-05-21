import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/termos")({
  component: Termos,
  head: () => ({
    meta: [
      { title: "Termos de Uso — Torcida Social" },
      { name: "description", content: "Termos e condições de uso da plataforma Torcida Social." },
      { property: "og:url", content: "/termos" },
    ],
    links: [{ rel: "canonical", href: "/termos" }],
  }),
});

function Termos() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Legal" title={<>Termos de <span className="text-success">Uso</span></>} subtitle="Última atualização: maio de 2026." />
      <article className="max-w-3xl mx-auto px-6 py-16 text-navy/80 leading-relaxed space-y-6">
        

        <h2 className="font-display text-2xl font-black text-navy">1. Aceitação</h2>
        <p>Ao usar a Torcida Social (site ou app), você concorda com estes Termos e com a nossa Política de Privacidade.</p>

        <h2 className="font-display text-2xl font-black text-navy">2. Cadastro</h2>
        <p>Você deve ter 18 anos ou mais (ou estar acompanhado pelos responsáveis legais), fornecer dados verdadeiros e manter sua senha em sigilo.</p>

        <h2 className="font-display text-2xl font-black text-navy">3. Doações</h2>
        <p>Doações são voluntárias, livres e sem contrapartida. São destinadas integralmente aos projetos sociais da Torcida Social. Você receberá recibo eletrônico após a confirmação do pagamento. Doações via Pix são irreversíveis após a confirmação bancária.</p>

        <h2 className="font-display text-2xl font-black text-navy">4. Liga da Solidariedade</h2>
        <p>O ranking de clubes é gamificação simbólica. Não há premiação financeira. As regras podem ser ajustadas pela equipe da Torcida Social para garantir justiça.</p>

        <h2 className="font-display text-2xl font-black text-navy">5. Conduta</h2>
        <p>É proibido usar a plataforma para: fraude, lavagem de dinheiro, discurso de ódio, conteúdo ofensivo, ou qualquer prática ilegal. Contas que violarem estas regras serão suspensas.</p>

        <h2 className="font-display text-2xl font-black text-navy">6. Propriedade intelectual</h2>
        <p>Marca, logo, textos, fotos e código são de propriedade da Torcida Social. Escudos de clubes pertencem aos seus respectivos titulares e são usados apenas para identificação esportiva.</p>

        <h2 className="font-display text-2xl font-black text-navy">7. Limitação de responsabilidade</h2>
        <p>A plataforma é fornecida "no estado em que se encontra". Podemos suspender o serviço para manutenção sem aviso prévio.</p>

        <h2 className="font-display text-2xl font-black text-navy">8. Foro</h2>
        <p>Fica eleito o foro da Comarca de Teresópolis/RJ para dirimir quaisquer questões.</p>

        <h2 className="font-display text-2xl font-black text-navy">9. Contato</h2>
        <p><a href="mailto:torcidasocial@gmail.com" className="text-action underline">torcidasocial@gmail.com</a></p>
      </article>
    </SiteLayout>
  );
}
