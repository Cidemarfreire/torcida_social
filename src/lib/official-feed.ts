export type OfficialFeedCategory =
  | "Arrecadação"
  | "Voluntariado"
  | "Expansão"
  | "Parcerias"
  | "Prestação de Contas";

export interface OfficialFeedItem {
  id: number;
  category: OfficialFeedCategory;
  title: string;
  description: string;
  date: string;
  isOfficial: boolean;
}

export function getMockOfficialFeed(): OfficialFeedItem[] {
  return [
    {
      id: 1,
      category: "Arrecadação",
      title: "Campanha de arrecadação de uniformes",
      description: "Estamos coletando uniformes novos e usados para crianças de comunidades carentes. Pontos de coleta em todos os núcleos.",
      date: "2024-05-20",
      isOfficial: true,
    },
    {
      id: 2,
      category: "Voluntariado",
      title: "Convocação de voluntários",
      description: "Buscamos voluntários para atuar nos projetos sociais. Experiência em educação ou assistência social é bem-vinda.",
      date: "2024-05-19",
      isOfficial: true,
    },
    {
      id: 3,
      category: "Expansão",
      title: "Núcleo Teresópolis em expansão",
      description: "O núcleo de Teresópolis está expandindo suas atividades. Novos projetos de inclusão digital e esporte serão implementados.",
      date: "2024-05-18",
      isOfficial: true,
    },
    {
      id: 4,
      category: "Parcerias",
      title: "Chamada para empresas parceiras",
      description: "Empresas interessadas em apoiar o projeto podem entrar em contato. Oferecemos visibilidade e impacto social.",
      date: "2024-05-17",
      isOfficial: true,
    },
    {
      id: 5,
      category: "Prestação de Contas",
      title: "Prestação de contas da semana",
      description: "Relatório semanal de doações recebidas e projetos executados. Transparência é nosso compromisso.",
      date: "2024-05-16",
      isOfficial: true,
    },
  ];
}
