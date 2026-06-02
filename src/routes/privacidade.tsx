import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/privacidade")({
  component: Privacidade,
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Torcida Social" },
      { name: "description", content: "Como a Torcida Social coleta, usa e protege seus dados pessoais conforme a LGPD." },
      { property: "og:title", content: "Política de Privacidade — Torcida Social" },
      { property: "og:url", content: "/privacidade" },
    ],
    links: [{ rel: "canonical", href: "/privacidade" }],
  }),
});

function Privacidade() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Legal" title={<>Política de <span className="text-success">Privacidade</span></>} subtitle="Última atualização: maio de 2026." />
      <article className="max-w-3xl mx-auto px-6 py-16 prose prose-navy text-navy/80 leading-relaxed space-y-6">
        

        <h2 className="font-display text-2xl font-black text-navy">1. Quem somos</h2>
        <p>A Torcida Social é uma organização sem fins lucrativos sediada em Teresópolis/RJ, dedicada à inclusão social de crianças por meio do esporte e da educação.</p>

        <h2 className="font-display text-2xl font-black text-navy">2. Dados que coletamos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Cadastro:</strong> nome, e-mail, cidade, time de coração, data de nascimento.</li>
          <li><strong>Doações:</strong> valor, forma de pagamento (não armazenamos número de cartão; processado por gateway externo).</li>
          <li><strong>Uso do app:</strong> páginas visitadas, cliques, dispositivo, IP (anonimizado).</li>
        </ul>

        <h2 className="font-display text-2xl font-black text-navy">3. Para que usamos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Processar suas doações e emitir recibos.</li>
          <li>Mostrar seu impacto, ranking e histórico no app.</li>
          <li>Enviar comunicados (você pode descadastrar a qualquer momento).</li>
          <li>Melhorar nossos projetos sociais.</li>
        </ul>

        <h2 className="font-display text-2xl font-black text-navy">4. Compartilhamento</h2>
        <p>Não vendemos seus dados. Compartilhamos apenas com: processadores de pagamento (Mercado Pago/Stripe), provedores de e-mail, e quando exigido por lei.</p>

        <h2 className="font-display text-2xl font-black text-navy">5. Seus direitos (LGPD)</h2>
        <p>Você pode solicitar acesso, correção, exclusão ou portabilidade dos seus dados pelo e-mail <a href="mailto:torcidasocial@gmail.com" className="text-action underline">torcidasocial@gmail.com</a>.</p>
        <p className="mt-2">O usuário pode solicitar a exclusão da conta e dos dados pessoais pelo próprio aplicativo, acessando a página de Perfil e clicando em "Excluir minha conta".</p>

        <h2 className="font-display text-2xl font-black text-navy">6. Segurança</h2>
        <p>Usamos criptografia em trânsito (HTTPS) e em repouso. Dados de pagamento são processados por gateways certificados PCI-DSS.</p>

        <h2 className="font-display text-2xl font-black text-navy">7. Contato</h2>
        <p>Encarregado de dados (DPO): <a href="mailto:torcidasocial@gmail.com" className="text-action underline">torcidasocial@gmail.com</a></p>
      </article>
    </SiteLayout>
  );
}
