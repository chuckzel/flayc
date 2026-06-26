import type { PageBlock, UploadedPhoto, WorkspaceState } from "../print-types";
import { BlockComponent } from "./BlockComponent";
import { DocumentContext } from "./contexts";

type PrintableSheetProps = {
  workspaceState: WorkspaceState | null;
  assets: UploadedPhoto[];
};

export function PrintableSheet({
  workspaceState,
  assets,
}: PrintableSheetProps) {
  const pageBlock = workspaceState?.blocks?.blocks.find(
    (block): block is PageBlock =>
      block.type === "page" && !block.disabledReasons,
  );
  if (!pageBlock) {
    return <EmptyTreePlaceholder />;
  }
  return (
    <DocumentContext value={{ assets }}>
      <BlockComponent block={pageBlock} />
    </DocumentContext>
  );
}

function EmptyTreePlaceholder() {
  return (
    <article className="mx-auto w-full max-w-[210mm] overflow-hidden rounded-[24px] border border-slate-200 bg-white text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.18)] print:max-w-none print:rounded-none print:border-0 print:shadow-none">
      <div className="px-8 py-12 text-center text-sm text-slate-500">
        Create a Page block in Blockly to render a printable document.
      </div>
    </article>
  );
}
