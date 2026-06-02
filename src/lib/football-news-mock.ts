export type FootballNewsCategory =
  | "Copa do Mundo"
  | "Seleção Brasileira"
  | "Brasileirão"
  | "Futebol Mundial"
  | "Mercado da Bola"
  | "Times Brasileiros";

export interface FootballNewsItem {
  id: string;
  category: FootballNewsCategory;
  title: string;
  summary: string;
  source: string;
  date: string;
  isUrgent?: boolean;
}

export const FOOTBALL_NEWS_MOCK: FootballNewsItem[] = [
  {
    id: "1",
    category: "Copa do Mundo",
    title: "Copa do Mundo 2026: Brasil confirma sede de jogos no Maracanã",
    summary: "FIFA confirma que o Maracanã será uma das sedes oficiais da Copa do Mundo 2026, com jogos da fase de grupos e possivelmente mata-mata.",
    source: "FIFA",
    date: "2024-05-20",
    isUrgent: true,
  },
  {
    id: "2",
    category: "Seleção Brasileira",
    title: "Seleção Brasileira anuncia nova convocação para amistosos",
    summary: "Técnico da Seleção convoca 23 jogadores para série de amistosos na Europa em preparação para as eliminatórias.",
    source: "CBF",
    date: "2024-05-19",
    isUrgent: true,
  },
  {
    id: "3",
    category: "Brasileirão",
    title: "Brasileirão: Flamengo assume liderança após vitória fora de casa",
    summary: "Rubro-negro vence por 2x0 e assume a liderança do Brasileirão Série A com rodada ainda em andamento.",
    source: "Globo Esporte",
    date: "2024-05-18",
  },
  {
    id: "4",
    category: "Mercado da Bola",
    title: "Mercado da Bola: Gigante europeu prepara oferta por jogador brasileiro",
    summary: "Clube inglês estaria disposto a pagar 80 milhões de euros pelo meia que brilha no Brasileirão.",
    source: "GE",
    date: "2024-05-17",
  },
  {
    id: "5",
    category: "Times Brasileiros",
    title: "Vasco anuncia renovação de contrato com ídolo da torcida",
    summary: "Cruzmaltino oficializa renovação por mais duas temporadas do atacante que foi artilheiro no ano passado.",
    source: "Vasco",
    date: "2024-05-16",
  },
  {
    id: "6",
    category: "Futebol Mundial",
    title: "Liga dos Campeões: Real Madrid vence e avança para semifinais",
    summary: "Time espanhol vence por 3x1 agregado e garante vaga na próxima fase do principal torneio europeu.",
    source: "UEFA",
    date: "2024-05-15",
  },
  {
    id: "7",
    category: "Copa do Mundo",
    title: "Copa do Mundo: Argentina e França entram como favoritos",
    summary: "Analistas apontam as seleções de Argentina e França como principais candidatas ao título da próxima Copa.",
    source: "ESPN",
    date: "2024-05-14",
  },
  {
    id: "8",
    category: "Brasileirão",
    title: "Fluminense busca recuperação após sequência de empates",
    summary: "Tricolor carioca trabalha para voltar a vencer e encostar na zona de classificação para Libertadores.",
    source: "UOL",
    date: "2024-05-13",
  },
  {
    id: "9",
    category: "Times Brasileiros",
    title: "Botafogo anuncia contratação de reforço para defesa",
    summary: "Clube alvinegro confirma chegada de zagueiro experiente para fortalecer elenco na segunda metade do campeonato.",
    source: "Botafogo",
    date: "2024-05-12",
  },
  {
    id: "10",
    category: "Futebol Mundial",
    title: "Premier League: corrida pelo título se define nas rodadas finais",
    summary: "Três times brigam ponto a ponto pela liderança da liga inglesa com apenas cinco rodadas restantes.",
    source: "Premier League",
    date: "2024-05-11",
  },
  {
    id: "11",
    category: "Mercado da Bola",
    title: "Mercado da Bola: brasileiros em destaque na Europa",
    summary: "Jogadores brasileiros são protagonistas em ligas europeias e despertam interesse de grandes clubes.",
    source: "Transfermarkt",
    date: "2024-05-10",
  },
  {
    id: "12",
    category: "Seleção Brasileira",
    title: "Seleção Brasileira feminina se prepara para Copa do Mundo",
    summary: "Equipe feminina inicia treinamentos visando boa campanha na próxima Copa do Mundo feminina.",
    source: "CBF",
    date: "2024-05-09",
  },
];

export function getFootballNewsMock(): FootballNewsItem[] {
  return FOOTBALL_NEWS_MOCK;
}
