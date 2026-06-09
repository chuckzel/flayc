export type UploadedPhoto = {
  id: string;
  name: string;
  sizeLabel: string;
  url: string;
  isObjectUrl: boolean;
};

export type PageSizePreset = "A4" | "Letter" | "A5" | "Custom";

export type PageSettings = {
  paperSize: PageSizePreset;
  widthMm: number;
  heightMm: number;
};

export type PageNode = {
  type: "page";
  settings: PageSettings;
  children: DocumentNode[];
};

export type MarginsNode = {
  type: "margins";
  topMm: number;
  rightMm: number;
  bottomMm: number;
  leftMm: number;
  children: DocumentNode[];
};

export type BorderNode = {
  type: "border";
  widthMm: number;
  color: string;
  radiusMm: number;
  children: DocumentNode[];
};

export type SizeNode = {
  type: "size";
  widthMm: number | null;
  heightMm: number | null;
  children: DocumentNode[];
};

export type FlexNode = {
  type: "flex";
  direction: "row" | "column";
  gapMm: number;
  wrap: boolean;
  justify: "start" | "center" | "space-between";
  align: "start" | "center" | "stretch";
  children: DocumentNode[];
};

export type PictureNode = {
  type: "picture";
  photoId: string;
  fit: "cover" | "contain" | "fill";
  aspectRatio: "auto" | "1/1" | "4/5" | "3/2" | "16/9";
  caption: string;
};

export type ForeachNode = {
  type: "foreach";
  variableName: string;
  children: DocumentNode[];
};

export type DocumentNode =
  | PageNode
  | MarginsNode
  | BorderNode
  | SizeNode
  | FlexNode
  | PictureNode
  | ForeachNode;

export type DocumentTree = PageNode;

export type WorkspaceSnapshot = {
  document: DocumentTree | null;
  pictures: Array<Pick<UploadedPhoto, "id" | "name" | "sizeLabel">>;
  workspace: unknown;
};

export const PAPER_SIZES: Record<
  Exclude<PageSizePreset, "Custom">,
  { widthMm: number; heightMm: number }
> = {
  A4: { widthMm: 210, heightMm: 297 },
  Letter: { widthMm: 216, heightMm: 279 },
  A5: { widthMm: 148, heightMm: 210 },
};

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  paperSize: "A4",
  widthMm: PAPER_SIZES.A4.widthMm,
  heightMm: PAPER_SIZES.A4.heightMm,
};

export const DEFAULT_LAYOUT = DEFAULT_PAGE_SETTINGS;

export const PALETTE = [
  "from-emerald-400/20 to-cyan-400/20",
  "from-sky-400/20 to-indigo-400/20",
  "from-amber-400/20 to-rose-400/20",
  "from-fuchsia-400/20 to-violet-400/20",
];
