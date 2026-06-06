import type { ChangeEvent, RefObject } from "react";
import type { UploadedPhoto } from "../print-types";

type PhotoManagerProps = {
  photos: UploadedPhoto[];
  onUpload: (files: File[]) => void;
  onRemove: (photoId: string) => void;
  palette: string[];
  uploadInputRef: RefObject<HTMLInputElement | null>;
};

export function PhotoManager({
  photos,
  onUpload,
  onRemove,
  palette,
  uploadInputRef,
}: PhotoManagerProps) {
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    onUpload(selectedFiles);
    event.target.value = "";
  };

  return (
    <aside className="no-print rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Picture manager</h2>
          <p className="mt-1 text-sm text-slate-400">
            Upload, inspect, or remove source images before laying them out.
          </p>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
          {photos.length} images
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300">
        <label className="flex cursor-pointer flex-col gap-2">
          <span className="font-medium text-slate-100">
            Drop in photos or browse your disk.
          </span>
          <span className="text-slate-400">
            The workspace can control margins and columns while the files stay
            in this panel.
          </span>
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            multiple
            className="mt-2 block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-300"
            onChange={handleUpload}
          />
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {photos.map((photo, index) => (
          <article
            key={photo.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <div
              className={`h-1 bg-gradient-to-r ${palette[index % palette.length]}`}
            />
            <div className="flex gap-3 p-3">
              <img
                src={photo.url}
                alt={photo.name}
                className="h-18 w-18 flex-none rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {photo.name}
                    </p>
                    <p className="text-xs text-slate-400">{photo.sizeLabel}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-300">
                    #{index + 1}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-200 transition hover:border-white/20 hover:bg-slate-800"
                    onClick={() => onRemove(photo.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
