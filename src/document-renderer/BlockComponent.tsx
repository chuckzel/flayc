import type {
  PageBlock,
  ElementBlockType,
  ContainerBlock,
  ImageElementBlock,
} from "../print-types";
import { getStyleFromBlocks } from "./css-generator";

type BlockComponentProps = {
  block: PageBlock | ElementBlockType;
};

export function BlockComponent({ block }: BlockComponentProps) {
  if (block.disabledReasons && block.disabledReasons.length > 0) {
    return null;
  }
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
    aspectRatio: `${block.fields.WIDTH} / ${block.fields.HEIGHT}`,
  } as React.CSSProperties;
  return (
    <div className="bg-white text-black" style={style}>
      {childrenHtml}
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
  return (
    <div className="justify-center align-center flex flex-1" style={style}>
      {childrenHtml}
    </div>
  );
}

function ImageBlockComponent({ block }: { block: ImageElementBlock }) {
  const imgBlock = block.inputs?.IMAGE?.block;
  const src = imgBlock?.disabledReasons
    ? undefined
    : imgBlock?.fields.IMAGE_URL;
  return <img className="w-full h-full flex-1" src={src} alt="Image" />;
}
