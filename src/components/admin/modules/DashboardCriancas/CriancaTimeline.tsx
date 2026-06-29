import type { ChildTimelineEvent } from "./types";

type Props = {
  events: ChildTimelineEvent[];
};

export function CriancaTimeline({ events }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] font-black text-action">
          Linha do Tempo
        </p>

        <h3 className="font-display text-2xl font-black text-navy mt-1">
          Histórico da Criança
        </h3>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy/15 p-8 text-center">
          <p className="text-navy/50">
            Nenhum evento registrado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-navy/10 bg-white p-5"
            >
              <p className="text-xs font-black uppercase tracking-widest text-action">
                {event.date}
              </p>

              <h4 className="font-black text-navy mt-1">
                {event.title}
              </h4>

              <p className="text-sm text-navy/60 mt-2">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}