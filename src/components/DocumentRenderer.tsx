import type { ReactNode } from "react";
import type {
  BorderNode,
  DocumentNode,
  FlexNode,
  ForeachNode,
  MarginsNode,
  PageNode,
  PictureNode,
  SizeNode,
  UploadedPhoto,
} from "../print-types";
import { getPageSize } from "../print-utils";

type DocumentRendererProps = {
  node: DocumentNode;
  photos: UploadedPhoto[];
  currentPhoto?: UploadedPhoto | null;
};

function renderChildren(
  children: DocumentNode[],
  photos: UploadedPhoto[],
  currentPhoto?: UploadedPhoto | null,
): ReactNode {
  return children.map((child, index) => (
    <DocumentRenderer
      key={`${child.type}-${index}`}
      node={child}
      photos={photos}
      currentPhoto={currentPhoto}
    />
  ));
}

function PageRenderer({
  node,
  photos,
}: {
  node: PageNode;
  photos: UploadedPhoto[];
}) {
  const pageSize = getPageSize(node.settings);

  return (
    <article
      className="mx-auto overflow-hidden rounded-[24px] border border-slate-200 bg-white text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.18)] print:rounded-none print:border-0 print:shadow-none"
      style={{
        width: `${pageSize.widthMm}mm`,
        minHeight: `${pageSize.heightMm}mm`,
      }}
    >
      <header className="border-b border-slate-200 px-8 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
              Printable page
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              {node.settings.paperSize} document
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This page is assembled from a Blockly document tree.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs text-slate-500">
            <div>{node.settings.paperSize}</div>
            <div className="mt-1 font-medium text-slate-900">
              {photos.length} photos available
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-4 p-4">
        {renderChildren(node.children, photos)}
      </div>
    </article>
  );
}

function MarginsRenderer({
  node,
  photos,
  currentPhoto,
}: {
  node: MarginsNode;
  photos: UploadedPhoto[];
  currentPhoto?: UploadedPhoto | null;
}) {
  return (
    <div
      className="space-y-4"
      style={{
        paddingTop: `${node.topMm}mm`,
        paddingRight: `${node.rightMm}mm`,
        paddingBottom: `${node.bottomMm}mm`,
        paddingLeft: `${node.leftMm}mm`,
      }}
    >
      {renderChildren(node.children, photos, currentPhoto)}
    </div>
  );
}

function BorderRenderer({
  node,
  photos,
  currentPhoto,
}: {
  node: BorderNode;
  photos: UploadedPhoto[];
  currentPhoto?: UploadedPhoto | null;
}) {
  return (
    <div
      className="space-y-4"
      style={{
        border: `${Math.max(0.5, node.widthMm)}mm solid ${node.color}`,
        borderRadius: `${node.radiusMm}mm`,
        padding: `${Math.max(1, node.widthMm)}mm`,
      }}
    >
      {renderChildren(node.children, photos, currentPhoto)}
    </div>
  );
}

function SizeRenderer({
  node,
  photos,
  currentPhoto,
}: {
  node: SizeNode;
  photos: UploadedPhoto[];
  currentPhoto?: UploadedPhoto | null;
}) {
  const style: React.CSSProperties = {};

  if (node.widthMm !== null) {
    style.width = `${node.widthMm}mm`;
  }

  if (node.heightMm !== null) {
    style.minHeight = `${node.heightMm}mm`;
  }

  return (
    <div className="space-y-4" style={style}>
      {renderChildren(node.children, photos, currentPhoto)}
    </div>
  );
}

function FlexRenderer({
  node,
  photos,
  currentPhoto,
}: {
  node: FlexNode;
  photos: UploadedPhoto[];
  currentPhoto?: UploadedPhoto | null;
}) {
  return (
    <div
      className="space-y-4"
      style={{
        display: "flex",
        flexDirection: node.direction,
        flexWrap: node.wrap ? "wrap" : "nowrap",
        gap: `${node.gapMm}mm`,
        justifyContent:
          node.justify === "space-between" ? "space-between" : node.justify,
        alignItems:
          node.align === "start"
            ? "flex-start"
            : node.align === "center"
              ? "center"
              : "stretch",
      }}
    >
      {renderChildren(node.children, photos, currentPhoto)}
    </div>
  );
}

function PictureRenderer({
  node,
  photos,
  currentPhoto,
}: {
  node: PictureNode;
  photos: UploadedPhoto[];
  currentPhoto?: UploadedPhoto | null;
}) {
  const resolvedPhoto =
    node.photoId === "__current__"
      ? (currentPhoto ?? photos[0] ?? null)
      : (photos.find((photo) => photo.id === node.photoId) ?? null);

  if (!resolvedPhoto) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
        No photo selected.
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <div
        className="bg-slate-100"
        style={{
          aspectRatio:
            node.aspectRatio === "auto" ? undefined : node.aspectRatio,
        }}
      >
        <img
          src={resolvedPhoto.url}
          alt={node.caption || resolvedPhoto.name}
          className="h-full w-full object-cover"
          style={{ objectFit: node.fit }}
        />
      </div>
      <figcaption className="space-y-1 p-3">
        <p className="text-sm font-medium text-slate-900">
          {node.caption || resolvedPhoto.name}
        </p>
        <p className="text-xs text-slate-500">
          Fit: {node.fit} · Aspect: {node.aspectRatio}
        </p>
      </figcaption>
    </figure>
  );
}

function ForeachRenderer({
  node,
  photos,
}: {
  node: ForeachNode;
  photos: UploadedPhoto[];
}) {
  return (
    <section className="space-y-3">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
        >
          <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            <span>{node.variableName}</span>
            <span>{index + 1}</span>
          </div>
          {renderChildren(node.children, photos, photo)}
        </div>
      ))}
      {photos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
          No photos available for the loop.
        </div>
      ) : null}
    </section>
  );
}

export function DocumentRenderer({
  node,
  photos,
  currentPhoto,
}: DocumentRendererProps) {
  switch (node.type) {
    case "page":
      return <PageRenderer node={node} photos={photos} />;
    case "margins":
      return (
        <MarginsRenderer
          node={node}
          photos={photos}
          currentPhoto={currentPhoto}
        />
      );
    case "border":
      return (
        <BorderRenderer
          node={node}
          photos={photos}
          currentPhoto={currentPhoto}
        />
      );
    case "size":
      return (
        <SizeRenderer node={node} photos={photos} currentPhoto={currentPhoto} />
      );
    case "flex":
      return (
        <FlexRenderer node={node} photos={photos} currentPhoto={currentPhoto} />
      );
    case "picture":
      return (
        <PictureRenderer
          node={node}
          photos={photos}
          currentPhoto={currentPhoto}
        />
      );
    case "foreach":
      return <ForeachRenderer node={node} photos={photos} />;
    default:
      return null;
  }
}
