import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BlocklyWorkspace } from "./components/BlocklyWorkspace";
import { PhotoManager } from "./components/PhotoManager";
import { PrintPreview } from "./components/PrintPreview";
import { StudioHeader } from "./components/StudioHeader";
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

  const snapshot = useMemo(
    () => buildSnapshot(layout, photos, workspaceState),
    [layout, photos, workspaceState],
  );

  const workspaceYaml = useMemo(() => toYaml(snapshot), [snapshot]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-4 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-black sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1800px] flex-col gap-4 print:min-h-0 print:max-w-none print:gap-0">
        <StudioHeader
          title="Arrange photos, shape the page, and print directly from the browser."
          description="Upload images on the left, wire the layout logic in Blockly at the center, and review the printable page on the right."
        />

        <div className="grid flex-1 gap-4 xl:grid-cols-[360px_minmax(0,1.15fr)_minmax(340px,0.95fr)] print:grid-cols-1 print:gap-0">
          <PhotoManager
            photos={photos}
            onUpload={handleUpload}
            onRemove={removePhoto}
            palette={PALETTE}
          />

          <BlocklyWorkspace
            onChange={handleWorkspaceChange}
            ready={blocklyReady}
            setReady={setBlocklyReady}
          />

          <PrintPreview
            layout={layout}
            photos={photos}
            onPrint={() => window.print()}
          />
        </div>

        <WorkspaceYamlPanel workspaceYaml={workspaceYaml} />
      </section>
    </main>
  );
}

export default App;
