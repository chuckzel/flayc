import type { UploadedPhoto } from "../print-types";

type PhotoGalleryProps = {
  photos: UploadedPhoto[];
  onRemove: (photoId: string) => void;
  palette: string[];
};

export function PhotoGallery({ photos, onRemove, palette }: PhotoGalleryProps) {
  return (
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
  );
}
