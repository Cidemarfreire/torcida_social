import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="px-6 pt-16 pb-12 border-b border-navy/5">
      <div className="max-w-7xl mx-auto">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-action mb-4">
          {eyebrow}
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-black leading-[0.95] text-navy max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-lg text-navy/60 max-w-2xl">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}
