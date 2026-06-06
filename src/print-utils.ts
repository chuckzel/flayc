import * as Blockly from "blockly/core";
import {
  DEFAULT_LAYOUT,
  type LayoutSettings,
  type UploadedPhoto,
  type WorkspaceSnapshot,
} from "./print-types";

const BLOCKS = Blockly.Blocks as Record<string, unknown>;

export function registerPrintBlocks() {
  if (BLOCKS.page_layout) {
    return;
  }

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

export function readLayout(
  workspace: Blockly.WorkspaceSvg | null,
): LayoutSettings {
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

export function buildSnapshot(
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
