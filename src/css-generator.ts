import type { StyleBlockType } from "./print-types";

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export function getStyleFromBlocks(
  blockRoot: StyleBlockType | undefined,
): React.CSSProperties {
  const style: React.CSSProperties = {};

  function isValidCSSProperty(
    property: string,
  ): property is keyof React.CSSProperties {
    if (typeof document === "undefined") {
      return true;
    }
    return property in document.documentElement.style;
  }

  function applyStyleBlock(block: StyleBlockType) {
    if (block.disabledReasons && block.disabledReasons.length > 0) {
      return;
    }
    switch (block.type) {
      case "style_border":
        style.border = `${block.fields.WIDTH}mm solid ${block.fields.COLOR}`;
        break;
      case "style_padding":
        style.padding = `${block.fields.WIDTH}mm`;
        break;
      case "style_size":
        if (block.fields.WIDTH > 0) {
          style.width = `${block.fields.WIDTH}mm`;
        }
        if (block.fields.HEIGHT > 0) {
          style.height = `${block.fields.HEIGHT}mm`;
        }
        break;
      case "style_grid":
        style.display = "grid";
        style.gridTemplateColumns = block.fields.CELL_WIDTH > 0
          ? `repeat(auto-fill, ${block.fields.CELL_WIDTH}mm)`
          : `repeat(auto-fill, minmax(0, 1fr))`;
        style.gridAutoRows = block.fields.CELL_HEIGHT > 0
          ? `${block.fields.CELL_HEIGHT}mm`
          : "auto";
        if (block.fields.GAP > 0) {
          style.gap = `${block.fields.GAP}mm`;
        }
        break;
      case "style_custom": {
        const rawProperty = block.fields.PROPERTY.trim();
        const value = block.fields.VALUE;

        // Convert kebab-case (e.g. flex-direction) to camelCase (e.g. flexDirection)
        const property = toCamelCase(rawProperty);

        if (!isValidCSSProperty(property)) {
          console.warn(`Ignoring invalid CSS property: ${rawProperty} (${property})`);
          break;
        }

        (style as Record<string, string>)[property] = value;
        break;
      }
    }
  }

  let currentBlock = blockRoot;
  while (currentBlock) {
    applyStyleBlock(currentBlock);
    currentBlock = currentBlock.next?.block;
  }
  return style;
}
