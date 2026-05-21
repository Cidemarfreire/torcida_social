import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { SERIE_A_CLUBS, NUCLEOS, formatInt } from "@/lib/mock-data";
import { Bell, Mail, MessageCircle, Smartphone, Send, Filter, Users, Calendar, CheckCircle2, Clock } from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";

export const Route = createFileRoute("/admin/notificacoes")({
  beforeLoad: requireAdmin,
  component: AdminNotificacoes,
  head: () => ({
    meta: [
      { title: "Notificações — Admin · Torcida Social" },
      { name: "description", content: "Painel para criar campanhas push, e-mail e WhatsApp com segmentação avançada." },
    ],
  }),
});

type Channel = "push" | "webpush" | "email" | "whatsapp";

const CHANNELS: { id: Channel; label: string; icon: typeof Bell; desc: string }[] = [
  { id: "push",     label: "Push App",   icon: Smartphone,    desc: "Notificação no app Android/iOS" },
  { id: "webpush",  label: "Web Push",   icon: Bell,          desc: "Browser desktop e mobile" },
  { id: "email",    label: "E-mail",     icon: Mail,          desc: "Mensagem rica com template" },
  { id: "whatsapp", label: "WhatsApp",   icon: MessageCircle, desc: "Mensagem direta via API oficial" },
];

const AGE_BUCKETS = ["13-17", "18-24", "25-34", "35-49", "50+"] as const;
const USER_TYPES = ["Torcedor", "Voluntário", "Família", "Parceiro"] as const;

const HISTORY = [
  { id: 1, title: "Campanha Volta às Aulas",      channel: "push" as Channel,     reach: 48200, ctr: 18.4, status: "enviada",  date: "12 mai" },
  { id: 2, title: "Lembrete: doação mensal",      channel: "whatsapp" as Channel, reach: 12480, ctr: 42.1, status: "enviada",  date: "10 mai" },
  { id: 3, title: "Evento núcleo Granja",         channel: "email" as Channel,    reach: 3210,  ctr: 9.8,  status: "enviada",  date: "08 mai" },
  { id: 4, title: "Liga das Torcidas — semanal",  channel: "webpush" as Channel,  reach: 22100, ctr: 14.2, status: "agendada", date: "18 mai" },
];

function AdminNotificacoes() {
  const [channel, setChannel] = useState<Channel>("push");
  const [title, setTitle] = useState("Sua torcida está em 3º no ranking 🔥");
  const [body, setBody] = useState("Faltam só R$ 4.200 para subir uma posição. Convoque a torcida e doe agora.");
  const [cta, setCta] = useState("Doar agora");

  const [cities, setCities] = useState<string[]>([]);
  const [clubIds, setClubIds] = useState<string[]>([]);
  const [ages, setAges] = useState<string[]>([]);
  const [userTypes, setUserTypes] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<"now" | "later">("now");

  const allCities = useMemo(() => {
    const set = new Set<string>([...SERIE_A_CLUBS.map((c) => c.city), ...NUCLEOS.map((n) => n.city.split(" — ")[0])]);
    return Array.from(set).sort();
  }, []);

  const estimate = useMemo(() => {
    let base = 85902;
    if (cities.length) base = Math.round(base * (cities.length / allCities.length) * 1.4);
    if (clubIds.length) base = Math.round(base * (clubIds.length / SERIE_A_CLUBS.length) * 1.2);
    if (ages.length) base = Math.round(base * (ages.length / AGE_BUCKETS.length));
    if (userTypes.length) base = Math.round(base * (userTypes.length / USER_TYPES.length));
    return Math.max(120, base);
  }, [cities, clubIds, ages, userTypes, allCities.length]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Administração · Notificações"
        title="Convoque a torcida certa, no canal certo."
        subtitle="Crie campanhas push, web push, e-mail e WhatsApp com segmentação por cidade, torcida, faixa etária e tipo de usuário."
      />

      <section className="px-6 py-12 max-w-7xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Composer */}
        <div className="space-y-6">
          {/* Channel */}
          <div className="bg-card border border-navy/5 rounded-3xl p-7">
            <h2 className="font-display text-lg font-black uppercase tracking-tight mb-4">1. Canal</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {CHANNELS.map((c) => {
                const Icon = c.icon;
                const active = channel === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setChannel(c.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${
                      active ? "border-action bg-action/5" : "border-navy/10 hover:border-navy/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${active ? "bg-action text-background" : "bg-navy/5 text-navy"}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{c.label}</p>
                        <p className="text-xs text-navy/60">{c.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="bg-card border border-navy/5 rounded-3xl p-7 space-y-4">
            <h2 className="font-display text-lg font-black uppercase tracking-tight">2. Conteúdo</h2>
            <Field label="Título / Headline" hint={`${title.length}/80`}>
              <input
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-background border border-navy/10 rounded-xl px-4 py-3 text-sm font-semibold focus:border-action outline-none"
              />
            </Field>
            <Field label="Mensagem" hint={`${body.length}/240`}>
              <textarea
                maxLength={240}
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-background border border-navy/10 rounded-xl px-4 py-3 text-sm focus:border-action outline-none resize-none"
              />
            </Field>
            {channel !== "whatsapp" && (
              <Field label="Texto do botão (CTA)">
                <input
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full bg-background border border-navy/10 rounded-xl px-4 py-3 text-sm font-semibold focus:border-action outline-none"
                />
              </Field>
            )}
          </div>

          {/* Segmentation */}
          <div className="bg-card border border-navy/5 rounded-3xl p-7 space-y-5">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-action" />
              <h2 className="font-display text-lg font-black uppercase tracking-tight">3. Segmentação</h2>
            </div>

            <SegmentGroup label="Cidade" items={allCities} selected={cities} onToggle={(v) => toggle(cities, setCities, v)} />
            <SegmentGroup
              label="Torcida"
              items={SERIE_A_CLUBS.map((c) => ({ id: c.id, label: c.name }))}
              selected={clubIds}
              onToggle={(v) => toggle(clubIds, setClubIds, v)}
            />
            <SegmentGroup label="Faixa etária" items={[...AGE_BUCKETS]} selected={ages} onToggle={(v) => toggle(ages, setAges, v)} />
            <SegmentGroup label="Tipo de usuário" items={[...USER_TYPES]} selected={userTypes} onToggle={(v) => toggle(userTypes, setUserTypes, v)} />
          </div>

          {/* Schedule */}
          <div className="bg-card border border-navy/5 rounded-3xl p-7">
            <h2 className="font-display text-lg font-black uppercase tracking-tight mb-4">4. Envio</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => setSchedule("now")}
                className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 ${schedule === "now" ? "border-action bg-action/5" : "border-navy/10"}`}
              >
                <Send size={18} />
                <div>
                  <p className="font-bold text-sm">Enviar agora</p>
                  <p className="text-xs text-navy/60">Disparo imediato</p>
                </div>
              </button>
              <button
                onClick={() => setSchedule("later")}
                className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 ${schedule === "later" ? "border-action bg-action/5" : "border-navy/10"}`}
              >
                <Calendar size={18} />
                <div>
                  <p className="font-bold text-sm">Agendar</p>
                  <p className="text-xs text-navy/60">Escolha data e hora</p>
                </div>
              </button>
            </div>
            {schedule === "later" && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <input type="date" className="bg-background border border-navy/10 rounded-xl px-4 py-3 text-sm" />
                <input type="time" className="bg-background border border-navy/10 rounded-xl px-4 py-3 text-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Preview + estimate */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          <div className="bg-navy text-background rounded-3xl p-7">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gold mb-3 flex items-center gap-2">
              <Users size={14} /> Alcance estimado
            </p>
            <p className="font-display text-5xl font-black leading-none">{formatInt(estimate)}</p>
            <p className="text-background/60 text-sm mt-2">usuários únicos</p>
            <div className="mt-5 pt-5 border-t border-background/10 grid grid-cols-2 gap-3 text-xs">
              <Stat label="Cidades" value={cities.length || "Todas"} />
              <Stat label="Torcidas" value={clubIds.length || "Todas"} />
              <Stat label="Idades" value={ages.length || "Todas"} />
              <Stat label="Perfis" value={userTypes.length || "Todos"} />
            </div>
          </div>

          <Preview channel={channel} title={title} body={body} cta={cta} />

          <button className="w-full bg-action text-background py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-action/90 transition-colors">
            <Send size={16} /> {schedule === "now" ? "Disparar campanha" : "Agendar campanha"}
          </button>
        </aside>
      </section>

      {/* History */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="bg-card border border-navy/5 rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-navy/5 flex justify-between items-center">
            <h2 className="font-display text-lg font-black uppercase tracking-tight">Histórico de campanhas</h2>
            <button className="text-xs font-bold text-action">Exportar CSV</button>
          </div>
          {HISTORY.map((h) => {
            const ch = CHANNELS.find((c) => c.id === h.channel)!;
            const Icon = ch.icon;
            return (
              <div key={h.id} className="grid grid-cols-[40px_1fr_100px_100px_110px_70px] gap-4 px-6 py-4 border-b border-navy/5 last:border-0 items-center text-sm">
                <div className="size-9 rounded-lg bg-navy/5 flex items-center justify-center text-navy">
                  <Icon size={16} />
                </div>
                <span className="font-bold">{h.title}</span>
                <span className="text-navy/60 text-xs uppercase font-bold">{ch.label}</span>
                <span className="text-right">{formatInt(h.reach)}</span>
                <span className="text-right font-display font-black text-action">{h.ctr}% CTR</span>
                <span className={`text-xs font-bold flex items-center gap-1 justify-end ${h.status === "enviada" ? "text-success" : "text-navy/60"}`}>
                  {h.status === "enviada" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {h.date}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="flex justify-between mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-navy/60">{label}</span>
        {hint && <span className="text-[11px] text-navy/40 font-bold">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function SegmentGroup({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: (string | { id: string; label: string })[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-navy/60">{label}</span>
        <span className="text-[11px] text-navy/40 font-bold">
          {selected.length === 0 ? "Todos" : `${selected.length} selecionado(s)`}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
        {items.map((it) => {
          const id = typeof it === "string" ? it : it.id;
          const lbl = typeof it === "string" ? it : it.label;
          const active = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                active ? "bg-navy text-background border-navy" : "bg-background text-navy/70 border-navy/10 hover:border-navy/40"
              }`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-background/50 uppercase tracking-widest text-[10px] font-bold">{label}</p>
      <p className="font-display font-black text-base mt-0.5">{value}</p>
    </div>
  );
}

function Preview({ channel, title, body, cta }: { channel: Channel; title: string; body: string; cta: string }) {
  if (channel === "whatsapp") {
    return (
      <div className="bg-[#ECE5DD] rounded-3xl p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-navy/60 mb-3">Preview WhatsApp</p>
        <div className="bg-[#DCF8C6] rounded-xl p-3 max-w-[85%] ml-auto shadow-sm">
          <p className="font-bold text-sm text-navy">{title}</p>
          <p className="text-sm text-navy/80 mt-1 whitespace-pre-wrap">{body}</p>
          <p className="text-[10px] text-navy/40 text-right mt-1">12:42 ✓✓</p>
        </div>
      </div>
    );
  }
  if (channel === "email") {
    return (
      <div className="bg-card border border-navy/10 rounded-3xl p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-navy/60 mb-3">Preview E-mail</p>
        <div className="border border-navy/10 rounded-xl overflow-hidden">
          <div className="bg-navy text-background px-4 py-2 text-[11px] font-bold uppercase tracking-widest">Torcida Social</div>
          <div className="p-4">
            <p className="font-display font-black text-lg leading-tight">{title}</p>
            <p className="text-sm text-navy/70 mt-2">{body}</p>
            <button className="mt-4 bg-action text-background px-4 py-2 rounded-lg text-xs font-bold">{cta}</button>
          </div>
        </div>
      </div>
    );
  }
  // push / webpush
  return (
    <div className="bg-card border border-navy/10 rounded-3xl p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-navy/60 mb-3">
        Preview {channel === "push" ? "Push App" : "Web Push"}
      </p>
      <div className="bg-background border border-navy/10 rounded-2xl p-3 shadow-sm flex gap-3">
        <div className="size-10 rounded-lg bg-navy flex items-center justify-center shrink-0">
          <div className="size-4 border-2 border-success rounded-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold uppercase text-navy/50">Torcida Social</p>
            <p className="text-[10px] text-navy/40">agora</p>
          </div>
          <p className="font-bold text-sm truncate">{title}</p>
          <p className="text-xs text-navy/70 line-clamp-2">{body}</p>
        </div>
      </div>
    </div>
  );
}
