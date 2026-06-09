import type { DocumentTree, UploadedPhoto } from "../print-types";
import { DocumentRenderer } from "./DocumentRenderer";

type PrintableSheetProps = {
  document: DocumentTree | null;
  photos: UploadedPhoto[];
};

export function PrintableSheet({ document, photos }: PrintableSheetProps) {
  if (!document) {
    return (
      <article className="mx-auto w-full max-w-[210mm] overflow-hidden rounded-[24px] border border-slate-200 bg-white text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.18)] print:max-w-none print:rounded-none print:border-0 print:shadow-none">
        <div className="px-8 py-12 text-center text-sm text-slate-500">
          Create a Page block in Blockly to render a printable document.
        </div>
      </article>
    );
  }

  return <DocumentRenderer node={document} photos={photos} />;
}
