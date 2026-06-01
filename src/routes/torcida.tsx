import { SiteLayout } from "@/components/site/SiteLayout";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavigationActions } from "@/components/site/NavigationActions";
// Arquibancada Digital Premium

import {
  Heart,
  MessageCircle,
  Share2,
  Instagram,
  Youtube,
  Facebook,
  Send,
  MessageSquareText,
  Users,
  Trophy,
  Sparkles,
  Music2,
} from "lucide-react";
export const Route = createFileRoute("/torcida")({
  component: TorcidaPage,
});

const socialLinks = [
  {
    name: "Instagram",
    handle: "@torcidasocial",
    href: "https://www.instagram.com/",
    icon: Instagram,
    text: "Reels, bastidores e campanhas sociais",
  },
  {
    name: "TikTok",
    handle: "@torcidasocial",
    href: "https://www.tiktok.com/",
    icon: Music2,
    text: "Vídeos curtos, desafios e virais da torcida",
  },
  {
    name: "YouTube",
    handle: "Torcida Social",
    href: "https://www.youtube.com/",
    icon: Youtube,
    text: "Shorts, histórias e documentários sociais",
  },
  {
    name: "Facebook",
    handle: "Torcida Social",
    href: "https://www.facebook.com/",
    icon: Facebook,
    text: "Comunidade, eventos e mobilizações",
  },
];

const comingSoon = [
  {
    title: "Reels da Torcida Social",
    description:
      "Aqui entrarão vídeos oficiais do Instagram com ações, bastidores e histórias reais.",
    tag: "Instagram",
  },
  {
    title: "Desafios da Arquibancada",
    description:
      "Campanhas no TikTok para mobilizar torcedores, clubes, atletas e parceiros.",
    tag: "TikTok",
  },
  {
    title: "Shorts de Impacto",
    description:
      "Vídeos curtos do YouTube mostrando projetos sociais, reformas e transformação.",
    tag: "YouTube",
  },
];

const initialMessages = [
  {
    name: "Torcedor Social",
    team: "Flamengo",
    text: "A torcida precisa ser força de transformação dentro e fora do estádio.",
  },
  {
    name: "Ana Paula",
    team: "Vasco",
    text: "Muito forte ver o futebol ajudando famílias e crianças. Quero participar.",
  },
  {
    name: "Carlos RJ",
    team: "Botafogo",
    text: "Essa Arquibancada Digital pode virar uma grande rede de apoio no Brasil.",
  },
];

function TorcidaPage() {
  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => {
  loadMessages();
}, []);

async function loadMessages() {
  const { data, error } = await supabase
  .from("torcida_mural")
  .select("*")
  .eq("status", "approved")
  .order("created_at", { ascending: false });

  if (!error && data) {
    setMessages(data);
  }
}
async function handleLike(messageId: string, currentLikes: number) {
  if (!messageId) return;

  const { error } = await supabase
    .from("torcida_mural")
    .update({ likes: currentLikes + 1 })
    .eq("id", messageId);

  if (!error) {
    loadMessages();
  }
}
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [text, setText] = useState("");

  async function handleSendMessage() {
  if (!name.trim() || !text.trim()) return;

const forbiddenWords = [
  "palavrão1",
  "palavrão2",
  "xingamento",
  "ofensa",
];

const lowerMessage = text.toLowerCase();

const hasForbiddenWord = forbiddenWords.some((word) =>
  lowerMessage.includes(word)
);

if (hasForbiddenWord) {
  alert("Mensagem bloqueada pela moderação.");
  return;
}

if (text.length > 300) {
  alert("Mensagem muito longa.");
  return;
}

if (text.includes("http://") || text.includes("https://")) {
  alert("Links não são permitidos.");
  return;
}

const repeatedChars = /(.)\1{7,}/;

if (repeatedChars.test(text)) {
  alert("Mensagem inválida.");
  return;
}
 const { error } = await supabase.from("torcida_mural").insert([
  {
    name: name.trim(),
    team: team.trim() || "Torcida Social",
    message: text.trim(),
    status: "approved",
    likes: 0,
    is_featured: false,
  },
]);
  if (!error) {
    setName("");
    setTeam("");
    setText("");
    loadMessages();
  }
}

  return (
    <SiteLayout>
      <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.25),_transparent_30%)]" />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            Arquibancada Digital
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-tight md:text-7xl">
            A resenha da torcida agora também gera impacto social.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300 md:text-xl">
            Um espaço para vídeos, campanhas, comentários, desafios e
            mobilização digital conectando Instagram, TikTok, YouTube e
            Facebook ao propósito do Torcida Social.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-slate-950"
                >
                  <Icon className="h-5 w-5" />
                  {social.name}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-4">
          {[
            {
              icon: Users,
              title: "Torcedores",
              text: "Participam, comentam, compartilham e fortalecem campanhas.",
            },
            {
              icon: Trophy,
              title: "Clubes e atletas",
              text: "Ganham espaço para apoiar causas sociais e projetos locais.",
            },
            {
              icon: Sparkles,
              title: "Projetos sociais",
              text: "Recebem visibilidade através de vídeos, histórias e desafios.",
            },
            {
              icon: Heart,
              title: "Impacto real",
              text: "A atenção da torcida se transforma em mobilização e apoio.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
              >
                <Icon className="h-8 w-8 text-yellow-400" />
                <h2 className="mt-4 text-xl font-black">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              Conexões sociais
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Redes sociais integradas ao propósito
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-3xl border border-white/10 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-yellow-400/50"
                >
                  <Icon className="h-9 w-9 text-yellow-400" />
                  <h3 className="mt-4 text-xl font-black">{social.name}</h3>
                  <p className="mt-1 font-bold text-slate-300">
                    {social.handle}
                  </p>
                  <p className="mt-3 text-sm text-slate-400">{social.text}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              Feed da resenha
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Espaço preparado para Reels, Shorts e TikToks oficiais
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {comingSoon.map((item) => (
              <div
                key={item.title}
                className="relative flex min-h-[430px] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-zinc-800 to-black p-6 shadow-2xl"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),_transparent_35%)]" />
                <div className="relative z-10">
                  <span className="rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase text-slate-950">
                    {item.tag}
                  </span>

                  <h3 className="mt-8 text-3xl font-black">{item.title}</h3>
                  <p className="mt-4 text-slate-300">{item.description}</p>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-5 text-slate-300">
                    <span className="flex items-center gap-2">
                      <Heart className="h-5 w-5" /> 0
                    </span>
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" /> Em breve
                    </span>
                    <span className="flex items-center gap-2">
                      <Share2 className="h-5 w-5" /> Compartilhar
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-sm text-yellow-100">
            Nesta fase, a Arquibancada Digital está pronta visualmente. A
            conexão automática com APIs oficiais de Instagram, TikTok, YouTube e
            Facebook pode entrar na próxima etapa.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20 text-slate-950">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
              Chat interativo
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Mural da Torcida
            </h2>
            <p className="mt-4 text-slate-600">
              Uma área para torcedores deixarem mensagens de apoio, ideias de
              campanhas e comentários sobre o impacto social do futebol.
            </p>

            <div className="mt-8 rounded-3xl bg-slate-950 p-5 text-white shadow-2xl">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none placeholder:text-slate-400"
                />
                <input
                  value={team}
                  onChange={(event) => setTeam(event.target.value)}
                  placeholder="Time do coração"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none placeholder:text-slate-400"
                />
              </div>

              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Escreva sua mensagem para a Arquibancada Digital..."
                className="mt-3 min-h-32 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none placeholder:text-slate-400"
              />

              <button
                onClick={handleSendMessage}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
              >
                <Send className="h-5 w-5" />
                Enviar para o Mural
              </button>

              <p className="mt-3 text-xs text-slate-400">
                Nesta versão inicial, as mensagens aparecem localmente. Depois
                conectaremos ao banco de dados.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-100 p-5">
            <div className="mb-5 flex items-center gap-2">
              <MessageSquareText className="h-6 w-6 text-yellow-600" />
              <h3 className="text-2xl font-black">Mensagens da torcida</h3>
            </div>

                       <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id || `${message.name}-${index}`}
                  className="rounded-2xl bg-white p-5 shadow"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black">{message.name}</p>

                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-yellow-400">
                      {message.team}
                    </span>
                  </div>

                  <p className="mt-3 text-slate-600">{message.message}</p>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleLike(message.id, message.likes || 0)}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-yellow-400 hover:text-slate-950"
                    >
                      ❤️ {message.likes || 0}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  </SiteLayout>
);
}