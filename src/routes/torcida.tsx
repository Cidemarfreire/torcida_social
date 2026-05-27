import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useRef } from "react";
import { db } from "@/integrations/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { Volume2, VolumeX, MessageSquare, Heart, Share2, Send, X } from "lucide-react";

// Interface para guiar os campos vindos do Firebase
interface VideoData {
  id: string;
  urlVideo: string;
  nomeCanal: string;
  legenda: string;
  poloCidade: string;
}

interface MensagemChat {
  id: string;
  user_nome: string;
  texto: string;
  timestamp: any;
}

// Registro da rota no TanStack Router
export const Route = createFileRoute('/torcida')({
  component: RouteComponent,
});

export function RouteComponent() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [activeChatVideoId, setActiveChatVideoId] = useState<string | null>(null);

  // 1. ESCUTA DO FIRESTORE: Puxa os vídeos da resenha em tempo real
  useEffect(() => {
    const q = query(collection(db, "resenha_videos"), orderBy("data_indexacao", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: VideoData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        urlVideo: doc.data().urlVideo || doc.data().video_url || "",
        nomeCanal: doc.data().nomeCanal || doc.data().channel_name || "Polo Oficial",
        legenda: doc.data().legenda || "",
        poloCidade: doc.data().poloCidade || doc.data().polo_cidade || "Torcida Social",
      }));
      setVideos(lista);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-none">
      {videos.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center text-white text-sm">
          Carregando a Resenha da Torcida...
        </div>
      ) : (
        videos.map((video) => (
          <VideoRow 
            key={video.id} 
            video={video} 
            isMuted={isMuted} 
            setIsMuted={setIsMuted} 
            onOpenChat={() => setActiveChatVideoId(video.id)}
          />
        ))
      )}

      {/* Painel do Chat Estilo WhatsApp (Desliza de Baixo) */}
      {activeChatVideoId && (
        <ChatSheet videoId={activeChatVideoId} onClose={() => setActiveChatVideoId(null)} />
      )}
    </div>
  );
}

// COMPONENTE INDIVIDUAL DE CADA VÍDEO DO FEED VERTICAL
function VideoRow({ 
  video, 
  isMuted, 
  setIsMuted, 
  onOpenChat 
}: { 
  video: VideoData; 
  isMuted: boolean; 
  setIsMuted: (m: boolean) => void; 
  onOpenChat: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play inteligente usando IntersectionObserver (Dá play quando entra na tela)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.8 } // Ativa quando 80% do vídeo está visível
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  // Controla o clique no vídeo para alternar som ou play/pause
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isMuted) {
        setIsMuted(false); // Desmuta globalmente se clicar
      } else {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    }
  };

  return (
    <div className="w-full h-screen snap-start relative flex items-center justify-center bg-black">
      {/* Player de Vídeo Nativo HTML5 */}
      <video
        ref={videoRef}
        src={video.urlVideo}
        className="w-full h-full object-cover max-w-md cursor-pointer"
        loop
        playsInline
        muted={isMuted}
        onClick={handleVideoClick}
      />

      {/* Informações do Polo e Legenda (Canto Inferior Esquerdo) */}
      <div className="absolute bottom-6 left-4 right-16 text-white z-10 pointer-events-none drop-shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-base">@{video.nomeCanal}</span>
          <span className="bg-emerald-600 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full">
            {video.poloCidade}
          </span>
        </div>
        <p className="text-sm line-clamp-3 font-light leading-relaxed">{video.legenda}</p>
      </div>

      {/* Botões Laterais Flutuantes (Canto Direito) */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-6 items-center z-20">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className="p-3 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition"
        >
          {isMuted ? <VolumeX size={24} className="text-red-400" /> : <Volume2 size={24} className="text-emerald-400" />}
        </button>

        <button className="flex flex-col items-center gap-1 text-white group">
          <div className="p-3 bg-black/40 backdrop-blur-sm rounded-full group-hover:bg-black/60 transition">
            <Heart size={24} className="group-hover:text-red-500 transition" />
          </div>
          <span className="text-xs">Apoiar</span>
        </button>

        <button 
          onClick={onOpenChat}
          className="flex flex-col items-center gap-1 text-white group"
        >
          <div className="p-3 bg-black/40 backdrop-blur-sm rounded-full group-hover:bg-black/60 transition">
            <MessageSquare size={24} className="group-hover:text-emerald-400 transition" />
          </div>
          <span className="text-xs">Resenha</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white group">
          <div className="p-3 bg-black/40 backdrop-blur-sm rounded-full group-hover:bg-black/60 transition">
            <Share2 size={24} />
          </div>
          <span className="text-xs">Compartilhar</span>
        </button>
      </div>
    </div>
  );
}

// COMPONENTE DO CHAT "WHATSAPP" CONECTADO À SUBCOLEÇÃO DO FIREBASE
function ChatSheet({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [texto, setTexto] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Escuta as mensagens em tempo real da subcoleção do respectivo vídeo
  useEffect(() => {
    const q = query(
      collection(db, "resenha_videos", videoId, "chat_comunidade"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaMsg: MensagemChat[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        user_nome: doc.data().user_nome || "Torcedor",
        texto: doc.data().texto || "",
        timestamp: doc.data().timestamp,
      }));
      setMensagens(listaMsg);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsubscribe();
  }, [videoId]);

  // Envia a nova mensagem digitada para o Firestore
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;

    try {
      await addDoc(collection(db, "resenha_videos", videoId, "chat_comunidade"), {
        user_nome: "Torcedor Solidário", 
        texto: texto.trim(),
        timestamp: serverTimestamp(),
      });
      setTexto("");
    } catch (err) {
      console.error("Erro ao enviar mensagem para o Firebase:", err);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto h-[60vh] bg-[#0b141a] border-t border-gray-800 rounded-t-2xl z-50 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
      {/* Cabeçalho do Chat */}
      <div className="flex items-center justify-between p-4 bg-[#1f2c34] rounded-t-2xl border-b border-gray-800">
        <div>
          <h3 className="text-white font-bold text-sm">Resenha da Comunidade</h3>
          <p className="text-[11px] text-emerald-400">ao vivo pelo Firebase</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Histórico de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] scrollbar-none">
        {mensagens.map((msg) => (
          <div key={msg.id} className="flex flex-col items-start max-w-[85%] bg-[#202c33] rounded-lg px-3 py-2 text-white">
            <span className="text-[11px] text-emerald-400 font-semibold mb-0.5">{msg.user_nome}</span>
            <p className="text-sm leading-normal text-gray-200">{msg.texto}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Caixa de Texto Estilo WhatsApp */}
      <form onSubmit={handleSend} className="p-3 bg-[#1f2c34] flex items-center gap-2">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Mensagem..."
          className="flex-1 bg-[#2a3942] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-gray-500"
        />
        <button 
          type="submit" 
          className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}