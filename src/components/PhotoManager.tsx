import type { UploadedPhoto } from "../print-types";
import { PhotoGallery } from "./PhotoGallery";
import { PhotoUploadPanel } from "./PhotoUploadPanel";

type PhotoManagerProps = {
  photos: UploadedPhoto[];
  onUpload: (files: File[]) => void;
  onRemove: (photoId: string) => void;
  palette: string[];
};

export function PhotoManager({
  photos,
  onUpload,
  onRemove,
  palette,
}: PhotoManagerProps) {
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

      <PhotoUploadPanel count={photos.length} onUpload={onUpload} />
      <PhotoGallery photos={photos} onRemove={onRemove} palette={palette} />
    </aside>
  );
}
