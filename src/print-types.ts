export type UploadedPhoto = {
  id: string;
  name: string;
  sizeLabel: string;
  url: string;
  isObjectUrl: boolean;
};

export type LayoutSettings = {
  paperSize: string;
  topMarginMm: number;
  rightMarginMm: number;
  bottomMarginMm: number;
  leftMarginMm: number;
  columns: number;
  gapMm: number;
};

export type WorkspaceSnapshot = {
  page: LayoutSettings;
  pictures: Array<Pick<UploadedPhoto, "id" | "name" | "sizeLabel">>;
  workspace: unknown;
};

export const DEFAULT_LAYOUT: LayoutSettings = {
  paperSize: "A4",
  topMarginMm: 12,
  rightMarginMm: 12,
  bottomMarginMm: 14,
  leftMarginMm: 12,
  columns: 2,
  gapMm: 4,
};

export const PALETTE = [
  "from-emerald-400/20 to-cyan-400/20",
  "from-sky-400/20 to-indigo-400/20",
  "from-amber-400/20 to-rose-400/20",
  "from-fuchsia-400/20 to-violet-400/20",
];
