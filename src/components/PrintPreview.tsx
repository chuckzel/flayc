import type { LayoutSettings, UploadedPhoto } from "../print-types";

type PrintPreviewProps = {
  layout: LayoutSettings;
  photos: UploadedPhoto[];
  onPrint: () => void;
};

export function PrintPreview({ layout, photos, onPrint }: PrintPreviewProps) {
  const marginStyles = {
    paddingTop: `${layout.topMarginMm}mm`,
    paddingRight: `${layout.rightMarginMm}mm`,
    paddingBottom: `${layout.bottomMarginMm}mm`,
    paddingLeft: `${layout.leftMarginMm}mm`,
  };

  const printGridStyles = {
    gap: `${layout.gapMm}mm`,
    gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
  };

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
            {layout.paperSize}
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
        <article className="mx-auto w-full max-w-[210mm] overflow-hidden rounded-[24px] border border-slate-200 bg-white text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.18)] print:max-w-none print:rounded-none print:border-0 print:shadow-none">
          <header className="border-b border-slate-200 px-8 py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
                  Printable sheet
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                  Picture contact sheet
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The margins and column count are read from Blockly, while the
                  images come from the upload manager.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs text-slate-500">
                <div>{layout.paperSize}</div>
                <div className="mt-1 font-medium text-slate-900">
                  {photos.length} photos ready
                </div>
              </div>
            </div>
          </header>

          <div style={marginStyles}>
            <div className="grid" style={printGridStyles}>
              {photos.map((photo, index) => (
                <figure
                  key={photo.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <div className="aspect-[4/5] bg-slate-100">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="space-y-1 p-3">
                    <p className="text-sm font-medium text-slate-900">
                      {index + 1}. {photo.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Fit: cover · Source size: {photo.sizeLabel}
                    </p>
                  </figcaption>
                </figure>
              ))}

              {photos.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
                  Upload images to see the printable sheet populate.
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
