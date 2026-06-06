type StudioHeaderProps = {
  title: string;
  description: string;
};

export function StudioHeader({ title, description }: StudioHeaderProps) {
  return (
    <header className="no-print flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 shadow-2xl shadow-black/25 backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
          Photo print layout studio
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}
