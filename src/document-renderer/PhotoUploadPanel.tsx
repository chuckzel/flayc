import type { ChangeEvent } from "react";

type PhotoUploadPanelProps = {
  count: number;
  onUpload: (files: File[]) => void;
};

export function PhotoUploadPanel({ count, onUpload }: PhotoUploadPanelProps) {
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    onUpload(selectedFiles);
    event.target.value = "";
  };

  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300">
      <label className="flex cursor-pointer flex-col gap-2">
        <span className="font-medium text-slate-100">
          Drop in photos or browse your disk.
        </span>
        <span className="text-slate-400">
          The workspace can control margins and columns while the files stay in
          this panel.
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="mt-2 block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-300"
          onChange={handleUpload}
        />
      </label>

      <p className="mt-3 text-xs text-slate-500">
        {count} file{count === 1 ? "" : "s"} loaded
      </p>
    </div>
  );
}
