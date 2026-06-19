import type {
  PageBlock,
  ElementBlockType,
  ContainerBlock,
  ImageElementBlock,
} from "../print-types";

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
  return <div>page ({childrenHtml})</div>;
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
  return <div>container ({childrenHtml})</div>;
}

function ImageBlockComponent({ block }: { block: ImageElementBlock }) {
  return <div>image ({block.inputs?.IMAGE?.block.fields.IMAGE_URL})</div>;
}
