import type { UploadedPhoto, WorkspaceState } from "../print-types";
import { PrintableSheet } from "./PrintableSheet";

type PrintPreviewProps = {
  workspaceState: WorkspaceState | null;
  assets: UploadedPhoto[];
  onPrint: () => void;
};

export function PrintPreview({
  workspaceState,
  assets,
  onPrint,
}: PrintPreviewProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/20 backdrop-blur-lg print:break-before-page print:rounded-none print:border-0 print:bg-white print:shadow-none">
      <div className="no-print flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Print preview</h2>
          <p className="text-sm text-slate-400">
            This is the browser-printable output area.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            a4
          </span>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            onClick={onPrint}
          >
            Print page
          </button>
        </div>
      </div>

      <div className="bg-slate-200/50 p-4 print:bg-white print:p-0">
        <PrintableSheet workspaceState={workspaceState} assets={assets} />
      </div>
    </section>
  );
}
