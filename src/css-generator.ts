import type { StyleBlockType } from "./print-types";

export function getStyleFromBlocks(
  blockRoot: StyleBlockType | undefined,
): React.CSSProperties {
  const style: React.CSSProperties = {};

  function isValidCSSProperty(
    property: string,
  ): property is keyof React.CSSProperties {
    return property in document.documentElement.style;
  }
  function applyStyleBlock(block: StyleBlockType) {
    if (block.disabledReasons && block.disabledReasons.length > 0) {
      return;
    }
    switch (block.type) {
      case "style_border":
        style.border = `${block.fields.WIDTH}px solid ${block.fields.COLOR}`;
        break;
      case "style_padding":
        style.padding = `${block.fields.WIDTH}px`;
        break;
      case "style_custom": {
        const property = block.fields.PROPERTY;
        const value = block.fields.VALUE;

        if (!isValidCSSProperty(property)) {
          console.warn(`Ignoring invalid CSS property: ${property}`);
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
