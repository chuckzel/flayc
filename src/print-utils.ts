import * as Blockly from "blockly/core";
import {
  DEFAULT_PAGE_SETTINGS,
  type DocumentNode,
  type DocumentTree,
  type FlexNode,
  type PageSettings,
  type UploadedPhoto,
  type WorkspaceSnapshot,
  type PictureNode,
} from "./print-types";

const BLOCKS = Blockly.Blocks as Record<string, unknown>;

let availablePhotoOptions: Array<[string, string]> = [
  ["Current photo", "__current__"],
];

export function setAvailablePhotoOptions(photos: UploadedPhoto[]) {
  availablePhotoOptions = [
    ["Current photo", "__current__"],
    ...photos.map((photo) => [photo.name, photo.id] as [string, string]),
  ];
}

export function getAvailablePhotoOptions() {
  return availablePhotoOptions;
}

export function registerPrintBlocks() {
  if (BLOCKS.print_page) {
    return;
  }

  Blockly.Blocks.print_page = {
    init() {
      this.appendDummyInput()
        .appendField("Page")
        .appendField("paper")
        .appendField(
          new Blockly.FieldDropdown([
            ["A4", "A4"],
            ["Letter", "Letter"],
            ["A5", "A5"],
            ["Custom", "Custom"],
          ]),
          "PAPER_SIZE",
        )
        .appendField("width mm")
        .appendField(new Blockly.FieldNumber(210, 0, 1000, 1), "WIDTH_MM")
        .appendField("height mm")
        .appendField(new Blockly.FieldNumber(297, 0, 1000, 1), "HEIGHT_MM");
      this.appendStatementInput("CONTENT")
        .setCheck(null)
        .appendField("content");
      this.setColour(210);
      this.setDeletable(false);
      this.setMovable(false);
      this.setTooltip("Root page block that defines the page size.");
    },
  };

  Blockly.Blocks.print_margins = {
    init() {
      this.appendDummyInput()
        .appendField("Margins")
        .appendField("top mm")
        .appendField(new Blockly.FieldNumber(12, 0, 100, 1), "TOP_MM")
        .appendField("right mm")
        .appendField(new Blockly.FieldNumber(12, 0, 100, 1), "RIGHT_MM")
        .appendField("bottom mm")
        .appendField(new Blockly.FieldNumber(12, 0, 100, 1), "BOTTOM_MM")
        .appendField("left mm")
        .appendField(new Blockly.FieldNumber(12, 0, 100, 1), "LEFT_MM");
      this.appendStatementInput("CONTENT").setCheck(null).appendField("inside");
      this.setColour(200);
      this.setTooltip("Wrap content with padding inside the page.");
    },
  };

  Blockly.Blocks.print_border = {
    init() {
      this.appendDummyInput()
        .appendField("Border")
        .appendField("width mm")
        .appendField(new Blockly.FieldNumber(1, 0, 20, 0.5), "BORDER_MM")
        .appendField("color")
        .appendField(new Blockly.FieldTextInput("#cbd5e1"), "COLOR")
        .appendField("radius mm")
        .appendField(new Blockly.FieldNumber(4, 0, 50, 0.5), "RADIUS_MM");
      this.appendStatementInput("CONTENT").setCheck(null).appendField("inside");
      this.setColour(185);
      this.setTooltip("Draw a border around nested content.");
    },
  };

  Blockly.Blocks.print_size = {
    init() {
      this.appendDummyInput()
        .appendField("Size")
        .appendField("width mm")
        .appendField(new Blockly.FieldNumber(120, 0, 1000, 1), "WIDTH_MM")
        .appendField("height mm")
        .appendField(new Blockly.FieldNumber(120, 0, 1000, 1), "HEIGHT_MM");
      this.appendStatementInput("CONTENT").setCheck(null).appendField("inside");
      this.setColour(170);
      this.setTooltip("Constrain the width and height of nested content.");
    },
  };

  Blockly.Blocks.print_flex = {
    init() {
      this.appendDummyInput()
        .appendField("Flex")
        .appendField(
          new Blockly.FieldDropdown([
            ["row", "row"],
            ["column", "column"],
          ]),
          "DIRECTION",
        )
        .appendField("gap mm")
        .appendField(new Blockly.FieldNumber(4, 0, 50, 0.5), "GAP_MM")
        .appendField("wrap")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "WRAP")
        .appendField("justify")
        .appendField(
          new Blockly.FieldDropdown([
            ["start", "start"],
            ["center", "center"],
            ["space-between", "space-between"],
          ]),
          "JUSTIFY",
        )
        .appendField("align")
        .appendField(
          new Blockly.FieldDropdown([
            ["start", "start"],
            ["center", "center"],
            ["stretch", "stretch"],
          ]),
          "ALIGN",
        );
      this.appendStatementInput("CONTENT").setCheck(null).appendField("inside");
      this.setColour(145);
      this.setTooltip("Lay out child blocks in a flex row or column.");
    },
  };

  Blockly.Blocks.print_picture = {
    init() {
      this.appendDummyInput()
        .appendField("Picture")
        .appendField(
          new Blockly.FieldDropdown(() => getAvailablePhotoOptions()),
          "PHOTO_ID",
        )
        .appendField("fit")
        .appendField(
          new Blockly.FieldDropdown([
            ["cover", "cover"],
            ["contain", "contain"],
            ["fill", "fill"],
          ]),
          "FIT",
        )
        .appendField("ratio")
        .appendField(
          new Blockly.FieldDropdown([
            ["auto", "auto"],
            ["1:1", "1/1"],
            ["4:5", "4/5"],
            ["3:2", "3/2"],
            ["16:9", "16/9"],
          ]),
          "ASPECT_RATIO",
        )
        .appendField("caption")
        .appendField(new Blockly.FieldTextInput(""), "CAPTION");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(28);
      this.setTooltip("Render a photo from the manager.");
    },
  };

  Blockly.Blocks.print_foreach = {
    init() {
      this.appendDummyInput()
        .appendField("For each photo as")
        .appendField(new Blockly.FieldTextInput("item"), "VARIABLE_NAME");
      this.appendStatementInput("CONTENT").setCheck(null).appendField("render");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(18);
      this.setTooltip("Repeat nested content for every photo in the manager.");
    },
  };
}

export function getPageSize(settings: PageSettings) {
  switch (settings.paperSize) {
    case "Letter":
      return { widthMm: 215.9, heightMm: 279.4 };
    case "A5":
      return { widthMm: 148, heightMm: 210 };
    case "Custom":
      return { widthMm: settings.widthMm, heightMm: settings.heightMm };
    case "A4":
    default:
      return { widthMm: 210, heightMm: 297 };
  }
}

function cloneChildren(
  parentBlock: Blockly.Block,
  inputName: string,
  photos: UploadedPhoto[],
): DocumentNode[] {
  const firstChild = parentBlock.getInputTargetBlock(inputName);
  const children: DocumentNode[] = [];
  let current = firstChild;

  while (current) {
    const childNode = blockToNode(current, photos);

    if (childNode) {
      children.push(childNode);
    }

    current = current.getNextBlock();
  }

  return children;
}

function blockToNode(
  block: Blockly.Block,
  photos: UploadedPhoto[],
): DocumentNode | null {
  switch (block.type) {
    case "print_page": {
      const paperSize = block.getFieldValue(
        "PAPER_SIZE",
      ) as PageSettings["paperSize"];
      const size = getPageSize({
        paperSize,
        widthMm:
          Number(block.getFieldValue("WIDTH_MM")) ||
          DEFAULT_PAGE_SETTINGS.widthMm,
        heightMm:
          Number(block.getFieldValue("HEIGHT_MM")) ||
          DEFAULT_PAGE_SETTINGS.heightMm,
      });

      return {
        type: "page",
        settings: {
          paperSize,
          widthMm: size.widthMm,
          heightMm: size.heightMm,
        },
        children: cloneChildren(block, "CONTENT", photos),
      };
    }

    case "print_margins": {
      return {
        type: "margins",
        topMm: Number(block.getFieldValue("TOP_MM")) || 0,
        rightMm: Number(block.getFieldValue("RIGHT_MM")) || 0,
        bottomMm: Number(block.getFieldValue("BOTTOM_MM")) || 0,
        leftMm: Number(block.getFieldValue("LEFT_MM")) || 0,
        children: cloneChildren(block, "CONTENT", photos),
      };
    }

    case "print_border": {
      return {
        type: "border",
        widthMm: Number(block.getFieldValue("BORDER_MM")) || 0,
        color: block.getFieldValue("COLOR") || "#cbd5e1",
        radiusMm: Number(block.getFieldValue("RADIUS_MM")) || 0,
        children: cloneChildren(block, "CONTENT", photos),
      };
    }

    case "print_size": {
      return {
        type: "size",
        widthMm: Number(block.getFieldValue("WIDTH_MM")) || null,
        heightMm: Number(block.getFieldValue("HEIGHT_MM")) || null,
        children: cloneChildren(block, "CONTENT", photos),
      };
    }

    case "print_flex": {
      return {
        type: "flex",
        direction:
          (block.getFieldValue("DIRECTION") as FlexNode["direction"]) || "row",
        gapMm: Number(block.getFieldValue("GAP_MM")) || 0,
        wrap: block.getFieldValue("WRAP") === "TRUE",
        justify:
          (block.getFieldValue("JUSTIFY") as FlexNode["justify"]) || "start",
        align: (block.getFieldValue("ALIGN") as FlexNode["align"]) || "start",
        children: cloneChildren(block, "CONTENT", photos),
      };
    }

    case "print_picture": {
      return {
        type: "picture",
        photoId: block.getFieldValue("PHOTO_ID") || "__current__",
        fit: (block.getFieldValue("FIT") as PictureNode["fit"]) || "cover",
        aspectRatio:
          (block.getFieldValue("ASPECT_RATIO") as PictureNode["aspectRatio"]) ||
          "auto",
        caption: block.getFieldValue("CAPTION") || "",
      };
    }

    case "print_foreach": {
      return {
        type: "foreach",
        variableName: block.getFieldValue("VARIABLE_NAME") || "item",
        children: cloneChildren(block, "CONTENT", photos),
      };
    }

    default:
      return null;
  }
}

export function buildDocumentTree(
  workspace: Blockly.WorkspaceSvg | null,
  photos: UploadedPhoto[],
): DocumentTree {
  if (!workspace) {
    return {
      type: "page",
      settings: DEFAULT_PAGE_SETTINGS,
      children: [],
    };
  }

  const pageBlock = workspace
    .getTopBlocks(false)
    .find((block) => block.type === "print_page");

  if (!pageBlock) {
    return {
      type: "page",
      settings: DEFAULT_PAGE_SETTINGS,
      children: [],
    };
  }

  const tree = blockToNode(pageBlock, photos);

  if (tree && tree.type === "page") {
    return tree;
  }

  return {
    type: "page",
    settings: DEFAULT_PAGE_SETTINGS,
    children: [],
  };
}

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function createDemoPhoto(
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

export function createStarterPhotos(): UploadedPhoto[] {
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

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

export function toYaml(value: unknown, depth = 0): string {
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

export function buildSnapshot(
  document: DocumentTree,
  photos: UploadedPhoto[],
  workspace: unknown,
): WorkspaceSnapshot {
  return {
    document,
    pictures: photos.map(({ id, name, sizeLabel }) => ({
      id,
      name,
      sizeLabel,
    })),
    workspace,
  };
}
