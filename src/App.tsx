import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";

type UploadedPhoto = {
  id: string;
  name: string;
  sizeLabel: string;
  url: string;
  isObjectUrl: boolean;
};

type LayoutSettings = {
  paperSize: string;
  topMarginMm: number;
  rightMarginMm: number;
  bottomMarginMm: number;
  leftMarginMm: number;
  columns: number;
  gapMm: number;
};

type WorkspaceSnapshot = {
  page: LayoutSettings;
  pictures: Array<Pick<UploadedPhoto, "id" | "name" | "sizeLabel">>;
  workspace: unknown;
};

const DEFAULT_LAYOUT: LayoutSettings = {
  paperSize: "A4",
  topMarginMm: 12,
  rightMarginMm: 12,
  bottomMarginMm: 14,
  leftMarginMm: 12,
  columns: 2,
  gapMm: 4,
};

const TOOLBOX = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "category",
      name: "Layout",
      categorystyle: "math_category",
      contents: [{ kind: "block", type: "page_layout" }],
    },
    {
      kind: "category",
      name: "Picture Rules",
      categorystyle: "text_category",
      contents: [{ kind: "block", type: "photo_placement" }],
    },
    {
      kind: "category",
      name: "Text",
      categorystyle: "text_category",
      contents: [{ kind: "block", type: "text" }],
    },
    {
      kind: "category",
      name: "Math",
      categorystyle: "math_category",
      contents: [{ kind: "block", type: "math_number" }],
    },
  ],
};

const BLOCKS = Blockly.Blocks as Record<string, unknown>;

if (!BLOCKS.page_layout) {
  Blockly.common.defineBlocksWithJsonArray([
    {
      type: "page_layout",
      message0:
        "page layout paper %1 margins mm top %2 right %3 bottom %4 left %5 columns %6 gap %7",
      args0: [
        {
          type: "field_dropdown",
          name: "PAPER_SIZE",
          options: [
            ["A4", "A4"],
            ["Letter", "Letter"],
            ["A5", "A5"],
          ],
        },
        {
          type: "field_number",
          name: "TOP_MARGIN",
          value: 12,
          min: 0,
          max: 80,
          precision: 1,
        },
        {
          type: "field_number",
          name: "RIGHT_MARGIN",
          value: 12,
          min: 0,
          max: 80,
          precision: 1,
        },
        {
          type: "field_number",
          name: "BOTTOM_MARGIN",
          value: 14,
          min: 0,
          max: 80,
          precision: 1,
        },
        {
          type: "field_number",
          name: "LEFT_MARGIN",
          value: 12,
          min: 0,
          max: 80,
          precision: 1,
        },
        {
          type: "field_number",
          name: "COLUMNS",
          value: 2,
          min: 1,
          max: 6,
          precision: 1,
        },
        {
          type: "field_number",
          name: "GAP_MM",
          value: 4,
          min: 0,
          max: 24,
          precision: 1,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: "Set the printable sheet size and spacing.",
    },
    {
      type: "photo_placement",
      message0: "photo rule fit %1 caption %2",
      args0: [
        {
          type: "field_dropdown",
          name: "FIT",
          options: [
            ["cover", "cover"],
            ["contain", "contain"],
            ["fill", "fill"],
          ],
        },
        { type: "field_input", name: "CAPTION", text: "Album print" },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 28,
      tooltip: "Describe how a picture should be placed on the page.",
    },
  ]);
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createDemoPhoto(
  name: string,
  startColor: string,
  endColor: string,
  label: string,
) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1100" role="img" aria-label="${escapeXml(name)}">
      <defs>
        <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${startColor}"/>
          <stop offset="100%" stop-color="${endColor}"/>
        </linearGradient>
      </defs>
      <rect width="900" height="1100" fill="url(#g)"/>
      <circle cx="660" cy="260" r="170" fill="rgba(255,255,255,0.14)"/>
      <circle cx="245" cy="715" r="220" fill="rgba(255,255,255,0.10)"/>
      <rect x="72" y="72" width="756" height="956" rx="42" fill="rgba(15,23,42,0.28)" stroke="rgba(255,255,255,0.36)" stroke-width="6"/>
      <text x="112" y="196" fill="#f8fafc" font-size="82" font-family="Inter, Arial, sans-serif" font-weight="700">${escapeXml(label)}</text>
      <text x="112" y="272" fill="rgba(248,250,252,0.9)" font-size="28" font-family="Inter, Arial, sans-serif">${escapeXml(name)}</text>
      <rect x="112" y="340" width="300" height="10" rx="5" fill="rgba(248,250,252,0.8)"/>
      <rect x="112" y="376" width="520" height="10" rx="5" fill="rgba(248,250,252,0.45)"/>
      <rect x="112" y="412" width="450" height="10" rx="5" fill="rgba(248,250,252,0.45)"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createStarterPhotos(): UploadedPhoto[] {
  return [
    {
      id: "starter-1",
      name: "cover-shot.jpg",
      sizeLabel: "2.4 MB",
      url: createDemoPhoto("cover-shot.jpg", "#0f172a", "#0ea5e9", "01"),
      isObjectUrl: false,
    },
    {
      id: "starter-2",
      name: "detail-portrait.jpg",
      sizeLabel: "1.8 MB",
      url: createDemoPhoto("detail-portrait.jpg", "#111827", "#14b8a6", "02"),
      isObjectUrl: false,
    },
    {
      id: "starter-3",
      name: "landscape.jpg",
      sizeLabel: "3.1 MB",
      url: createDemoPhoto("landscape.jpg", "#172554", "#fb7185", "03"),
      isObjectUrl: false,
    },
  ];
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

function toYaml(value: unknown, depth = 0): string {
  const indent = "  ".repeat(depth);

  if (value === null || value === undefined) {
    return "null";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    return value
      .map((entry) => {
        const rendered = toYaml(entry, depth + 1);
        const lines = rendered.split("\n");

        if (lines.length === 1) {
          return `${indent}- ${lines[0]}`;
        }

        return `${indent}- ${lines[0]}\n${lines
          .slice(1)
          .map((line) => `${indent}  ${line}`)
          .join("\n")}`;
      })
      .join("\n");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return "{}";
    }

    return entries
      .map(([key, entryValue]) => {
        const rendered = toYaml(entryValue, depth + 1);

        if (entryValue !== null && typeof entryValue === "object") {
          return `${indent}${key}:\n${rendered
            .split("\n")
            .map((line) => `${indent}  ${line}`)
            .join("\n")}`;
        }

        return `${indent}${key}: ${rendered}`;
      })
      .join("\n");
  }

  if (typeof value === "string") {
    return /[:#\n\r\t]/.test(value) ? JSON.stringify(value) : value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return String(value);
}

function readLayout(workspace: Blockly.WorkspaceSvg | null): LayoutSettings {
  if (!workspace) {
    return DEFAULT_LAYOUT;
  }

  const layoutBlock = workspace
    .getTopBlocks(false)
    .find((block) => block.type === "page_layout");

  if (!layoutBlock) {
    return DEFAULT_LAYOUT;
  }

  const readNumber = (fieldName: string, fallback: number) => {
    const parsed = Number(layoutBlock.getFieldValue(fieldName));
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  return {
    paperSize:
      layoutBlock.getFieldValue("PAPER_SIZE") || DEFAULT_LAYOUT.paperSize,
    topMarginMm: readNumber("TOP_MARGIN", DEFAULT_LAYOUT.topMarginMm),
    rightMarginMm: readNumber("RIGHT_MARGIN", DEFAULT_LAYOUT.rightMarginMm),
    bottomMarginMm: readNumber("BOTTOM_MARGIN", DEFAULT_LAYOUT.bottomMarginMm),
    leftMarginMm: readNumber("LEFT_MARGIN", DEFAULT_LAYOUT.leftMarginMm),
    columns: Math.max(1, readNumber("COLUMNS", DEFAULT_LAYOUT.columns)),
    gapMm: Math.max(0, readNumber("GAP_MM", DEFAULT_LAYOUT.gapMm)),
  };
}

function buildSnapshot(
  layout: LayoutSettings,
  photos: UploadedPhoto[],
  workspace: unknown,
): WorkspaceSnapshot {
  return {
    page: layout,
    pictures: photos.map(({ id, name, sizeLabel }) => ({
      id,
      name,
      sizeLabel,
    })),
    workspace,
  };
}

function App() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>(() =>
    createStarterPhotos(),
  );
  const [layout, setLayout] = useState<LayoutSettings>(DEFAULT_LAYOUT);
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot>(() =>
    buildSnapshot(DEFAULT_LAYOUT, createStarterPhotos(), null),
  );
  const [blocklyReady, setBlocklyReady] = useState(false);

  const blocklyContainerRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photosRef = useRef(photos);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  const refreshSnapshot = () => {
    const workspace = workspaceRef.current;
    const nextLayout = readLayout(workspace);

    setLayout(nextLayout);
    setSnapshot(
      buildSnapshot(
        nextLayout,
        photosRef.current,
        workspace ? Blockly.serialization.workspaces.save(workspace) : null,
      ),
    );
  };

  useEffect(() => {
    const container = blocklyContainerRef.current;

    if (!container) {
      return;
    }

    const workspace = Blockly.inject(container, {
      toolbox: TOOLBOX,
      grid: {
        spacing: 24,
        length: 3,
        colour: "#334155",
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.95,
        maxScale: 1.5,
        minScale: 0.6,
        scaleSpeed: 1.1,
      },
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
    });

    workspaceRef.current = workspace;

    const handleWorkspaceChange = () => {
      refreshSnapshot();
      setBlocklyReady(true);
    };

    workspace.addChangeListener(handleWorkspaceChange);

    if (workspace.getTopBlocks(false).length === 0) {
      const layoutBlock = workspace.newBlock("page_layout");
      layoutBlock.initSvg();
      layoutBlock.render();
      layoutBlock.moveBy(32, 32);

      const placementBlock = workspace.newBlock("photo_placement");
      placementBlock.initSvg();
      placementBlock.render();
      placementBlock.moveBy(32, 160);
      layoutBlock.nextConnection?.connect(placementBlock.previousConnection!);
    }

    refreshSnapshot();

    return () => {
      workspace.removeChangeListener(handleWorkspaceChange);
      workspace.dispose();
      workspaceRef.current = null;
      setBlocklyReady(false);
    };
  }, []);

  useEffect(() => {
    refreshSnapshot();
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => {
        if (photo.isObjectUrl) {
          URL.revokeObjectURL(photo.url);
        }
      });
    };
  }, []);

  const workspaceYaml = useMemo(() => toYaml(snapshot), [snapshot]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const newPhotos = selectedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      name: file.name,
      sizeLabel: formatBytes(file.size),
      url: URL.createObjectURL(file),
      isObjectUrl: true,
    }));

    setPhotos((currentPhotos) => [...currentPhotos, ...newPhotos]);
    event.target.value = "";
  };

  const removePhoto = (photoId: string) => {
    setPhotos((currentPhotos) => {
      const nextPhotos = currentPhotos.filter((photo) => photo.id !== photoId);
      const removedPhoto = currentPhotos.find((photo) => photo.id === photoId);

      if (removedPhoto?.isObjectUrl) {
        URL.revokeObjectURL(removedPhoto.url);
      }

      return nextPhotos;
    });
  };

  const handlePrint = () => {
    window.print();
  };

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

  const previewPhotos = photos.map((photo, index) => ({
    ...photo,
    accentClass: [
      "from-emerald-400/20 to-cyan-400/20",
      "from-sky-400/20 to-indigo-400/20",
      "from-amber-400/20 to-rose-400/20",
      "from-fuchsia-400/20 to-violet-400/20",
    ][index % 4],
  }));

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
          <aside className="no-print rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Picture manager
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Upload, inspect, or remove source images before laying them
                  out.
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
                  The workspace can control margins and columns while the files
                  stay in this panel.
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-2 block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-300"
                  onChange={handleUpload}
                />
              </label>
            </div>

            <div className="mt-4 space-y-3">
              {previewPhotos.map((photo, index) => (
                <article
                  key={photo.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <div
                    className={`h-1 bg-gradient-to-r ${photo.accentClass}`}
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
                          <p className="text-xs text-slate-400">
                            {photo.sizeLabel}
                          </p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-300">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-200 transition hover:border-white/20 hover:bg-slate-800"
                          onClick={() => removePhoto(photo.id)}
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

          <section className="no-print overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/20 backdrop-blur-lg">
            <div className="no-print flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Blockly workspace
                </h2>
                <p className="text-sm text-slate-400">
                  Use blocks to describe paper size, margins, and the general
                  print flow.
                </p>
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                {blocklyReady ? "Ready" : "Loading"}
              </div>
            </div>
            <div
              ref={blocklyContainerRef}
              className="h-[760px] w-full print:h-auto print:min-h-[297mm]"
            />
          </section>

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/20 backdrop-blur-lg print:break-before-page print:rounded-none print:border-0 print:bg-white print:shadow-none">
            <div className="no-print flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Print preview
                </h2>
                <p className="text-sm text-slate-400">
                  This is the browser-printable output area.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {layout.paperSize}
              </span>
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
                        The margins and column count are read from Blockly,
                        while the images come from the upload manager.
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
        </div>

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
                workspace. The right panel is the printable page, sized and
                padded for browser print output.
              </p>
              <p>
                The YAML preview is intentionally read-only. It gives advanced
                users a serializable intermediate state without requiring a
                reverse translation back into blocks.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
