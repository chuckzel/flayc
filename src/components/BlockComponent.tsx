import type {
  PageBlock,
  ElementBlockType,
  ContainerBlock,
  ImageElementBlock,
} from "../print-types";
import { getStyleFromBlocks } from "../css-generator";

type BlockComponentProps = {
  block: PageBlock | ElementBlockType;
};

export function BlockComponent({ block }: BlockComponentProps) {
  switch (block.type) {
    case "page":
      return <PageBlockComponent block={block} />;
    case "element_container":
      return <ContainerBlockComponent block={block} />;
    case "element_image":
      return <ImageBlockComponent block={block} />;
    default:
      return null;
  }
}

function PageBlockComponent({ block }: { block: PageBlock }) {
  const childrenHtml = [];
  for (
    let child = block.inputs?.CHILDREN?.block;
    child;
    child = child?.next?.block
  ) {
    childrenHtml.push(<BlockComponent key={child.id} block={child} />);
  }
  const style = {
    color: "black",
    aspectRatio: `${block.fields.WIDTH} / ${block.fields.HEIGHT}`,
  } as React.CSSProperties;
  return (
    <div className="bg-white" style={style}>
      page ({childrenHtml})
    </div>
  );
}

function ContainerBlockComponent({ block }: { block: ContainerBlock }) {
  const childrenHtml = [];
  for (
    let child = block.inputs?.CHILDREN?.block;
    child;
    child = child?.next?.block
  ) {
    childrenHtml.push(<BlockComponent key={child.id} block={child} />);
  }
  const style = getStyleFromBlocks(block.inputs?.STYLES?.block);
  return <div style={style}>container ({childrenHtml})</div>;
}

function ImageBlockComponent({ block }: { block: ImageElementBlock }) {
  return <img src={block.inputs?.IMAGE?.block.fields.IMAGE_URL} alt="Image" />;
}
