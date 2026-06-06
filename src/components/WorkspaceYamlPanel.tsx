type WorkspaceYamlPanelProps = {
  workspaceYaml: string;
};

export function WorkspaceYamlPanel({ workspaceYaml }: WorkspaceYamlPanelProps) {
  return (
    <section className="no-print grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Intermediate YAML
            </h2>
            <p className="text-sm text-slate-400">
              A read-only view of the workspace state for advanced users.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            generated from Blockly
          </span>
        </div>
        <pre className="mt-4 overflow-auto rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm leading-6 text-slate-200">
          {workspaceYaml}
        </pre>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-lg">
        <h2 className="text-lg font-semibold text-white">Workflow notes</h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
          <p>
            The left panel manages files. The center panel is a live Blockly
            workspace. The right panel is the printable page, sized and padded
            for browser print output.
          </p>
          <p>
            The YAML preview is intentionally read-only. It gives advanced users
            a serializable intermediate state without requiring a reverse
            translation back into blocks.
          </p>
        </div>
      </div>
    </section>
  );
}
