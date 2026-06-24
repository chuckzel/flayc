export type UploadedPhoto = {
  id: string;
  name: string;
  sizeLabel: string;
  url: string;
  isObjectUrl: boolean;
};

export const PALETTE = [
  "from-emerald-400/20 to-cyan-400/20",
  "from-sky-400/20 to-indigo-400/20",
  "from-amber-400/20 to-rose-400/20",
  "from-fuchsia-400/20 to-violet-400/20",
];

export interface WorkspaceState {
  blocks: {
    blocks: AnyBlockType[];
  };
}

interface BlockInput<T> {
  block: T;
}

export type AnyBlockType =
  | PageBlock
  | StyleBlockType
  | ElementBlockType
  | ImageBlockType;

export type StyleBlockType =
  | BorderBlock
  | PaddingBlock
  | CustomStyleBlock
  | SizeBlock
  | GridBlock;

export type ElementBlockType = ContainerBlock | ImageElementBlock;

export type ImageBlockType = UploadedImageBlock;

interface BlockBase {
  type: string;
  id: string;
  disabledReasons?: string[];
  x: number;
  y: number;
}

export interface PageBlock extends BlockBase {
  type: "page";
  fields: {
    WIDTH: number;
    HEIGHT: number;
  };
  inputs?: {
    CHILDREN?: BlockInput<ElementBlockType>;
  };
}

interface StyleBlockBase extends BlockBase {
  next?: BlockInput<StyleBlockType>;
}

export interface BorderBlock extends StyleBlockBase {
  type: "style_border";
  fields: {
    WIDTH: number;
    COLOR: string;
  };
}

export interface PaddingBlock extends StyleBlockBase {
  type: "style_padding";
  fields: {
    WIDTH: number;
  };
}

export interface SizeBlock extends StyleBlockBase {
  type: "style_size";
  fields: {
    WIDTH: number;
    HEIGHT: number;
  };
}

export interface GridBlock extends StyleBlockBase {
  type: "style_grid";
  fields: {
    CELL_WIDTH: number;
    CELL_HEIGHT: number;
    GAP: number;
  };
}

export interface CustomStyleBlock extends StyleBlockBase {
  type: "style_custom";
  fields: {
    PROPERTY: string;
    VALUE: string;
  };
}

interface ElementBlockBase extends BlockBase {
  next?: BlockInput<ElementBlockType>;
}

export interface ContainerBlock extends ElementBlockBase {
  type: "element_container";
  inputs?: {
    STYLES?: BlockInput<StyleBlockType>;
    CHILDREN?: BlockInput<ElementBlockType>;
  };
}

export interface ImageElementBlock extends ElementBlockBase {
  type: "element_image";
  inputs?: {
    IMAGE: BlockInput<ImageBlockType>;
  };
}

export interface UploadedImageBlock extends BlockBase {
  type: "image_uploaded";
  fields: {
    IMAGE_URL: string;
  };
}
