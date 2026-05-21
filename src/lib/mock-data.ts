// Mock data for the Torcida Social demo. Replace with backend once Lovable Cloud is connected.
import teresopolisLogo from "@/assets/partners/teresopolis.png";
import madureiraLogo from "@/assets/partners/madureira.png";
import plenitudeLogo from "@/assets/partners/plenitude.png";

export type Club = {
  id: string;
  name: string;
  short: string;
  primary: string;
  secondary: string;
  city: string;
};

export const SERIE_A_CLUBS: Club[] = [
  { id: "fla", name: "Flamengo",      short: "FLA", primary: "#E1100F", secondary: "#0A0A0A", city: "Rio de Janeiro" },
  { id: "pal", name: "Palmeiras",     short: "PAL", primary: "#006437", secondary: "#FFFFFF", city: "São Paulo" },
  { id: "cor", name: "Corinthians",   short: "COR", primary: "#0A0A0A", secondary: "#FFFFFF", city: "São Paulo" },
  { id: "spfc",name: "São Paulo",     short: "SPFC",primary: "#E30613", secondary: "#000000", city: "São Paulo" },
  { id: "flu", name: "Fluminense",    short: "FLU", primary: "#7C001D", secondary: "#006437", city: "Rio de Janeiro" },
  { id: "vas", name: "Vasco da Gama", short: "VAS", primary: "#0A0A0A", secondary: "#FFFFFF", city: "Rio de Janeiro" },
  { id: "bot", name: "Botafogo",      short: "BOT", primary: "#0A0A0A", secondary: "#FFFFFF", city: "Rio de Janeiro" },
  { id: "int", name: "Internacional", short: "INT", primary: "#C8102E", secondary: "#FFFFFF", city: "Porto Alegre" },
  { id: "gre", name: "Grêmio",        short: "GRE", primary: "#0A2A66", secondary: "#0099D8", city: "Porto Alegre" },
  { id: "atm", name: "Atlético-MG",   short: "CAM", primary: "#0A0A0A", secondary: "#FFFFFF", city: "Belo Horizonte" },
  { id: "cru", name: "Cruzeiro",      short: "CRU", primary: "#0A2A66", secondary: "#FFFFFF", city: "Belo Horizonte" },
  { id: "bah", name: "Bahia",         short: "BAH", primary: "#0033A0", secondary: "#E30613", city: "Salvador" },
  { id: "vit", name: "Vitória",       short: "VIT", primary: "#E30613", secondary: "#0A0A0A", city: "Salvador" },
  { id: "for", name: "Fortaleza",     short: "FOR", primary: "#0033A0", secondary: "#E30613", city: "Fortaleza" },
  { id: "cea", name: "Ceará",         short: "CEA", primary: "#0A0A0A", secondary: "#FFFFFF", city: "Fortaleza" },
  { id: "spt", name: "Sport",         short: "SPT", primary: "#E30613", secondary: "#0A0A0A", city: "Recife" },
  { id: "atp", name: "Athletico-PR",  short: "CAP", primary: "#C8102E", secondary: "#0A0A0A", city: "Curitiba" },
  { id: "jvr", name: "Juventude",     short: "JUV", primary: "#005A2B", secondary: "#FFFFFF", city: "Caxias do Sul" },
  { id: "mir", name: "Mirassol",      short: "MIR", primary: "#FFD400", secondary: "#005A2B", city: "Mirassol" },
  { id: "bra", name: "RB Bragantino", short: "BGT", primary: "#FFFFFF", secondary: "#E30613", city: "Bragança Paulista" },
];

export const STATS = {
  criancas: 5000,
  cidades: 3,
  torcedores: 600,
  arrecadado: 5_300,
};

export type RankingRow = {
  clubId: string;
  donors: number;
  raised: number;
  city: string;
};

// Dados reais atuais: apenas 1 torcedor do Flamengo doou R$ 5.300.
// Os demais clubes ainda não registraram doações.
export const RANKING: RankingRow[] = SERIE_A_CLUBS.map((c) => ({
  clubId: c.id,
  donors: c.id === "fla" ? 1 : 0,
  raised: c.id === "fla" ? 5300 : 0,
  city: c.city,
})).sort((a, b) => b.raised - a.raised);

export const PROJECTS = [
  {
    slug: "bola-no-pe-livro-na-mao",
    title: "Bola no pé, livro na mão",
    category: "Educação & Esporte",
    description: "Reforço escolar no contraturno para crianças dos núcleos, garantindo desempenho dentro e fora de campo.",
    impact: "Em breve — dados em atualização",
    image: "esporte",
  },
  {
    slug: "torcida-digital",
    title: "Torcida Digital",
    category: "Tecnologia",
    description: "Cursos de programação, design e inclusão digital para jovens.",
    impact: "Em breve — dados em atualização",
    image: "cursos",
  },
  {
    slug: "mente-de-atleta",
    title: "Mente de Atleta",
    category: "Apoio Psicopedagógico",
    description: "Acompanhamento psicológico e social para crianças, famílias e voluntários.",
    impact: "Em breve — dados em atualização",
    image: "educacao",
  },
  {
    slug: "campo-aberto",
    title: "Campo Aberto",
    category: "Iniciação Esportiva",
    description: "Escolinhas de futebol gratuitas nos núcleos, com material, uniforme e alimentação inclusos.",
    impact: "Em breve — dados em atualização",
    image: "esporte",
  },
  {
    slug: "futuro-em-foco",
    title: "Futuro em Foco",
    category: "Cursos Profissionalizantes",
    description: "Trilhas de qualificação para adolescentes em parceria com empresas locais.",
    impact: "Em breve — dados em atualização",
    image: "cursos",
  },
  {
    slug: "familia-no-jogo",
    title: "Família no Jogo",
    category: "Inclusão Social",
    description: "Apoio direto às famílias com cestas, atendimento social e oficinas de renda.",
    impact: "Em breve — dados em atualização",
    image: "educacao",
  },
];

export const NUCLEOS = [
  // Teresópolis — 5 pólos em implantação (sede)
  { city: "Teresópolis — Várzea",         status: "implantando", kids: 0, partners: 0 },
  { city: "Teresópolis — Alto",           status: "implantando", kids: 0, partners: 0 },
  { city: "Teresópolis — Meudon",         status: "implantando", kids: 0, partners: 0 },
  { city: "Teresópolis — Granja Guarani", status: "implantando", kids: 0, partners: 0 },
  { city: "Teresópolis — Vargem Grande",  status: "implantando", kids: 0, partners: 0 },
  // Campo Grande (RJ) — 3 pólos
  { city: "Campo Grande — Jardim Maravilha", status: "implantando", kids: 0, partners: 0 },
  { city: "Campo Grande — Centro",           status: "implantando", kids: 0, partners: 0 },
  { city: "Campo Grande — Cesarão",          status: "implantando", kids: 0, partners: 0 },
  // Expansão RJ
  { city: "Itaperuna",   status: "implantando", kids: 0, partners: 0 },
  { city: "Cabo Frio",   status: "implantando", kids: 0, partners: 0 },
  { city: "Duque de Caxias", status: "implantando", kids: 0, partners: 0 },
  { city: "Nova Iguaçu", status: "implantando", kids: 0, partners: 0 },
  { city: "Itaguaí",     status: "implantando", kids: 0, partners: 0 },
  { city: "Seropédica",  status: "implantando", kids: 0, partners: 0 },
  { city: "Nilópolis",   status: "implantando", kids: 0, partners: 0 },
  { city: "Anchieta",    status: "implantando", kids: 0, partners: 0 },
];

export const PARTNERS: { name: string; tier: string; logo: string; image?: string }[] = [
  { name: "Prefeitura de Teresópolis",               tier: "Diamante", logo: "PT", image: teresopolisLogo },
  { name: "Assembleia de Deus Ministério Madureira", tier: "Diamante", logo: "AD", image: madureiraLogo },
  { name: "Multiserviços Plenitude",                 tier: "Ouro",     logo: "MP", image: plenitudeLogo },
  { name: "Banco Solidário",   tier: "Ouro",   logo: "BS" },
  { name: "EnergiaMais",       tier: "Ouro",   logo: "EM" },
  { name: "RedeFarma",         tier: "Ouro",   logo: "RF" },
  { name: "Construtora Pico",  tier: "Prata",  logo: "CP" },
  { name: "Café da Serra",     tier: "Prata",  logo: "CS" },
  { name: "Mercado Bom Dia",   tier: "Bronze", logo: "MB" },
  { name: "Auto Posto Vale",   tier: "Bronze", logo: "AP" },
  { name: "Padaria do João",   tier: "Bronze", logo: "PJ" },
];

export const NEWS = [
  {
    slug: "nucleo-niteroi-inaugurado",
    title: "Torcida Social inaugura novo núcleo em Niterói",
    excerpt: "Expansão do modelo Teresópolis chega ao Grande Rio com apoio de torcedores e empresas parceiras.",
    date: "Em breve",
    tag: "Expansão",
  },
  {
    slug: "campanha-volta-as-aulas",
    title: "Campanha Volta às Aulas mobiliza a torcida",
    excerpt: "Torcedores se uniram em uma ação especial para apoiar crianças no início do ano letivo.",
    date: "Em breve",
    tag: "Campanha",
  },
  {
    slug: "parceria-com-clube-serie-a",
    title: "Primeiro clube da Série A oficializa parceria institucional",
    excerpt: "Acordo prevê doação de uniformes, ingressos e dia de visita para crianças dos núcleos.",
    date: "Em breve",
    tag: "Parceria",
  },
];

export const STORIES = [
  {
    id: 1,
    name: "Maria, mãe do Davi (10 anos)",
    nucleo: "Várzea — Teresópolis",
    text: "O Davi era tímido, não falava em sala. Hoje treina três vezes por semana e foi escolhido capitão. A Torcida Social devolveu a confiança dele.",
    tag: "Família",
  },
  {
    id: 2,
    name: "Prof. Renato — Reforço Escolar",
    nucleo: "Alto — Teresópolis",
    text: "Em seis meses, o desempenho médio em matemática subiu de 4,2 para 7,1. O futebol é a porta, a educação é a casa.",
    tag: "Educador",
  },
  {
    id: 3,
    name: "Camila, 16 anos — Torcida Digital",
    nucleo: "Meudon — Teresópolis",
    text: "Comecei o curso de programação sem saber ligar um computador. Hoje faço estágio em uma empresa de tecnologia da cidade.",
    tag: "Jovem",
  },
  {
    id: 4,
    name: "Beatriz — Voluntária",
    nucleo: "Granja Guarani",
    text: "Vim torcer pelo meu time e fiquei pela causa. Toda terça-feira é o melhor dia da minha semana.",
    tag: "Voluntária",
  },
];

export const ACHIEVEMENTS = [
  { id: "primeiro-gol",    title: "Primeiro Gol",        desc: "Sua primeira doação", unlocked: true },
  { id: "hat-trick",       title: "Hat-trick",           desc: "3 doações no mês",    unlocked: true },
  { id: "capitao",         title: "Capitão",             desc: "Convide 5 amigos",    unlocked: true },
  { id: "titulo-do-mes",   title: "Título do Mês",       desc: "Top 100 do ranking",  unlocked: false },
  { id: "lenda",           title: "Lenda da Torcida",    desc: "1 ano de Torcida",    unlocked: false },
  { id: "artilheiro",      title: "Artilheiro",          desc: "R$ 500 acumulados",   unlocked: false },
];

export const BENEFITS = [
  { partner: "RedeFarma",      type: "Farmácia",        discount: "20%", city: "Teresópolis" },
  { partner: "CineÔ",          type: "Cinema",          discount: "50%", city: "Teresópolis" },
  { partner: "Café da Serra",  type: "Alimentação",     discount: "30%", city: "Teresópolis" },
  { partner: "Escola Bem-Te-Vi", type: "Cursos",        discount: "40%", city: "Teresópolis" },
  { partner: "Teatro Serrano", type: "Cultura",         discount: "100%", city: "Teresópolis" },
  { partner: "TransRio",       type: "Transporte",      discount: "Grátis", city: "Niterói" },
];

export const MY_IMPACT = {
  doacoes: 12,
  total: 285,
  criancasImpactadas: 25,
  materiais: 18,
  bolsas: 2,
  refeicoes: 96,
  nucleos: 3,
};

export const ME = {
  name: "Lucas Andrade",
  city: "Teresópolis, RJ",
  clubId: "fla",
  since: "Jan 2025",
  rank: 142,
  points: 1840,
};

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

export const formatInt = (v: number) => v.toLocaleString("pt-BR");
