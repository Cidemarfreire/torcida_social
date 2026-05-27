import { createFileRoute } from "@tanstack/react-router";
import {
  Heart,
  MessageCircle,
  Share2,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react";

export const Route = createFileRoute("/torcida")({
  component: TorcidaPage,
});

const videos = [
  {
    id: 1,
    title: "Projeto social transformando vidas",
    video:
      "https://www.w3schools.com/html/mov_bbb.mp4",
    user: "@torcidasocial",
  },
  {
    id: 2,
    title: "Torcida unida ajudando famílias",
    video:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    user: "@arquibancadasocial",
  },
];

function TorcidaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-4 backdrop-blur">
        <h1 className="text-2xl font-black text-yellow-400">
          Resenha da Torcida
        </h1>

        <div className="flex items-center gap-4">
          <Instagram className="h-5 w-5" />
          <Youtube className="h-5 w-5" />
          <Facebook className="h-5 w-5" />
        </div>
      </div>

      <div className="mx-auto max-w-md">
        {videos.map((video) => (
          <section
            key={video.id}
            className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl"
          >
            <video
              src={video.video}
              controls
              autoPlay
              loop
              muted
              className="h-[70vh] w-full object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-5">
              <p className="font-bold text-yellow-400">{video.user}</p>

              <h2 className="mt-2 text-lg font-black">
                {video.title}
              </h2>

              <div className="mt-4 flex items-center gap-6">
                <button className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span>12k</span>
                </button>

                <button className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>894</span>
                </button>

                <button className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}