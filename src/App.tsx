import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen px-6 py-10 text-slate-100 sm:px-10 lg:px-16">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-12">
        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-200">
          Tailwind CSS is configured meow
        </div>

        <div className="max-w-2xl space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            React + TypeScript + Vite, now styled with utility classes.
          </h1>
          <p className="text-base leading-7 text-slate-300 sm:text-lg">
            This starter is wired for Tailwind, so you can build a static
            front-end app without maintaining a separate CSS framework setup.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-slate-200">
            Static hosting ready
          </span>
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-slate-200">
            Fast local dev server
          </span>
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-slate-200">
            Utility-first styling
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
            onClick={() => setCount((value) => value + 1)}
          >
            Count is {count}
          </button>
          <p className="text-sm text-slate-400">
            Edit <span className="font-mono text-slate-200">src/App.tsx</span>{" "}
            to keep building.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
