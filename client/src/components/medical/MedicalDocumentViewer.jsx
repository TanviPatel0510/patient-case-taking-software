import { RiDeleteBinLine, RiFileTextLine } from "@remixicon/react";
import { Button } from "../ui/button";

export function MedicalDocumentViewer({ document, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#d1e2dc] bg-white px-3 py-2 text-xs">
      <a className="flex min-w-0 items-center gap-2 text-[#0c5e5b] hover:underline" href={document.fileUrl} target="_blank" rel="noreferrer">
        <RiFileTextLine className="size-4 shrink-0" />
        <span className="truncate">{document.originalFileName}</span>
      </a>
      {onDelete && <Button type="button" variant="ghost" aria-label={`Delete ${document.originalFileName}`} className="grid size-7 shrink-0 place-items-center rounded-full p-0 text-[#8a5555] hover:bg-red-50 hover:text-red-700 cursor-pointer" onClick={() => onDelete(document._id)}>
        <RiDeleteBinLine className="size-4" />
      </Button>}
    </div>
  );
}