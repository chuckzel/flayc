import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BlocklyWorkspace } from "./components/BlocklyWorkspace";
import { PhotoManager } from "./components/PhotoManager";
import { PrintPreview } from "./components/PrintPreview";
import { WorkspaceYamlPanel } from "./components/WorkspaceYamlPanel";
import {
  DEFAULT_LAYOUT,
  PALETTE,
  type LayoutSettings,
  type UploadedPhoto,
} from "./print-types";
import {
  buildSnapshot,
  createStarterPhotos,
  formatBytes,
  toYaml,
} from "./print-utils";

function App() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>(() =>
    createStarterPhotos(),
  );
  const [layout, setLayout] = useState<LayoutSettings>(DEFAULT_LAYOUT);
  const [workspaceState, setWorkspaceState] = useState<unknown>(null);
  const [blocklyReady, setBlocklyReady] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photosRef = useRef(photos);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  const handleUpload = useCallback((files: File[]) => {
    const newPhotos = files.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      name: file.name,
      sizeLabel: formatBytes(file.size),
      url: URL.createObjectURL(file),
      isObjectUrl: true,
    }));

    setPhotos((currentPhotos) => [...currentPhotos, ...newPhotos]);
  }, []);

  const removePhoto = useCallback((photoId: string) => {
    setPhotos((currentPhotos) => {
      const nextPhotos = currentPhotos.filter((photo) => photo.id !== photoId);
      const removedPhoto = currentPhotos.find((photo) => photo.id === photoId);

      if (removedPhoto?.isObjectUrl) {
        URL.revokeObjectURL(removedPhoto.url);
      }

      return nextPhotos;
    });
  }, []);

  const handleWorkspaceChange = useCallback(
    (nextLayout: LayoutSettings, nextWorkspaceState: unknown) => {
      setLayout(nextLayout);
      setWorkspaceState(nextWorkspaceState);
    },
    [],
  );

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => {
        if (photo.isObjectUrl) {
          URL.revokeObjectURL(photo.url);
        }
      });
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const snapshot = useMemo(
    () => buildSnapshot(layout, photos, workspaceState),
    [layout, photos, workspaceState],
  );

  const workspaceYaml = useMemo(() => toYaml(snapshot), [snapshot]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-4 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-black sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1800px] flex-col gap-4 print:min-h-0 print:max-w-none print:gap-0">
        <header className="no-print flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 shadow-2xl shadow-black/25 backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
              Photo print layout studio
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Arrange photos, shape the page, and print directly from the
                browser.
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Upload images on the left, wire the layout logic in Blockly at
                the center, and review the printable page on the right.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload pictures
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              onClick={handlePrint}
            >
              Print page
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-4 xl:grid-cols-[360px_minmax(0,1.15fr)_minmax(340px,0.95fr)] print:grid-cols-1 print:gap-0">
          <PhotoManager
            photos={photos}
            onUpload={handleUpload}
            onRemove={removePhoto}
            palette={PALETTE}
            uploadInputRef={fileInputRef}
          />

          <BlocklyWorkspace
            onChange={handleWorkspaceChange}
            ready={blocklyReady}
            setReady={setBlocklyReady}
          />

          <PrintPreview layout={layout} photos={photos} />
        </div>

        <WorkspaceYamlPanel workspaceYaml={workspaceYaml} />
      </section>
    </main>
  );
}

export default App;
