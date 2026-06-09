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


function TorcidaPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  async function loadMessages() {
  const { data, error } = await supabase
  .from("torcida_mural" as any)
  .select("*")
  .eq("status", "approved")
  .order("created_at", { ascending: false });

  if (!error && data) {
    setMessages(data);
  }
}

  async function loadComments() {
    const { data, error } = await supabase
      .from("torcida_comments" as any)
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data);
    }
  }

  useEffect(() => {
    loadMessages();
    loadComments();
  }, []);

  async function handleLike(messageId: string, currentLikes: number) {
    if (!messageId) return;

  const { error } = await supabase
    .from("torcida_mural" as any)
    .update({
      likes: (currentLikes || 0) + 1,
    })
    .eq("id", messageId);

  if (error) {
    alert(`Erro: ${error.message}`);
    console.error(error);
    return;
  }

  await loadMessages();
}

  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [text, setText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [activeCommentForm, setActiveCommentForm] = useState<string | null>(null);

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

    const { error } = await supabase.from("torcida_mural" as any).insert([
      {
        name: name.trim(),
        team: team.trim() || "Torcida Social",
        message: text.trim(),
        status: "approved",
        likes: 0,
        is_featured: false,
      },
    ]);

    if (error) {
      alert(`Erro ao enviar mensagem: ${error.message}`);
      console.error(error);
      return;
    }

    setName("");
    setTeam("");
    setText("");
    await loadMessages();
  }

  async function handleComment(muralId: string) {
    if (!muralId) return;
    if (!commentName.trim() || !commentText.trim()) return;

    const { error } = await supabase.from("torcida_comments" as any).insert([
      {
        mural_id: muralId,
        name: commentName.trim(),
        comment: commentText.trim(),
        status: "approved",
      },
    ]);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Comentário enviado!");
    setCommentName("");
    setCommentText("");
    setActiveCommentForm(null);
    await loadComments();
  }

  function handleShare(message: any) {
    const shareText = `Veja essa mensagem na Arquibancada Digital do Torcida Social:\n[${message.name} - ${message.team}]\n${message.message}\nAcesse: ${window.location.origin}/torcida`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
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
              Redes sociais oficiais
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Siga o Torcida Social
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
                As mensagens são salvas no banco de dados e aparecem em tempo real.
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
                      type="button"
                      onClick={() => handleLike(message.id, message.likes || 0)}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-yellow-400 hover:text-slate-950"
                    >
                      ❤️ {message.likes || 0}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveCommentForm(activeCommentForm === message.id ? null : message.id)}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-500 hover:text-white"
                    >
                      💬 Comentar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(message)}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-green-500 hover:text-white"
                    >
                      🔄 Compartilhar
                    </button>
                  </div>

                  {activeCommentForm === message.id && (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                      <input
                        value={commentName}
                        onChange={(event) => setCommentName(event.target.value)}
                        placeholder="Seu nome"
                        className="mb-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400"
                      />
                      <textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="Escreva seu comentário"
                        className="mb-2 min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleComment(message.id)}
                        className="w-full rounded-xl bg-blue-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-600"
                      >
                        Enviar comentário
                      </button>
                    </div>
                  )}

                  {comments.filter((comment) => comment.mural_id === message.id).length > 0 && (
                    <div className="mt-4 space-y-2">
                      {comments
                        .filter((comment) => comment.mural_id === message.id)
                        .map((comment, commentIndex) => (
                          <div
                            key={comment.id || `${comment.mural_id}-${commentIndex}`}
                            className="rounded-xl bg-slate-50 p-3"
                          >
                            <p className="text-xs font-bold text-slate-700">{comment.name}</p>
                            <p className="mt-1 text-sm text-slate-600">{comment.comment}</p>
                          </div>
                        ))}
                    </div>
                  )}
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