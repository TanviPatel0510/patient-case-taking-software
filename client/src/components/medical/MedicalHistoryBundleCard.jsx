import { MedicalDocumentViewer } from "./MedicalDocumentViewer";

const documentCategories = [
  ["Prescription", "prescription"],
  ["Medical Report", "report"],
  ["Summary", "summary"],
];

export function MedicalHistoryBundleCard({ bundle, onDelete }) {
  return (
    <article className="rounded-2xl border border-[#d1e2dc] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-[#142a30]">{bundle.title}</h3>
          <p className="mt-1 text-xs font-medium text-[#0c5e5b]">{bundle.bundleType} · {new Date(bundle.eventDate).toLocaleDateString()}</p>
        </div>
        <span className="rounded-full bg-[#e2f2ef] px-2.5 py-1 text-[0.68rem] font-bold text-[#0c5e5b]">{(bundle.documents || []).length} {(bundle.documents || []).length === 1 ? "document" : "documents"}</span>
      </div>
      {bundle.description && <p className="mt-3 text-sm leading-relaxed text-[#556e72]">{bundle.description}</p>}
      <div className="mt-4 grid gap-3">
        {documentCategories.map(([label, type]) => {
          const documents = (bundle.documents || []).filter((document) => document.documentType === type);

          return (
            <section key={type} className="rounded-xl border border-[#d1e2dc] bg-[#f7fbf9] p-3">
              <h4 className="text-xs font-bold text-[#142a30]">{label}</h4>
              {documents.length > 0 ? (
                <div className="mt-2 grid gap-2">
                  {documents.map((document) => <MedicalDocumentViewer key={document._id} document={document} onDelete={onDelete} />)}
                </div>
              ) : (
                <p className="mt-2 text-xs text-[#8a9b9d]">No documents added.</p>
              )}
            </section>
          );
        })}
      </div>
    </article>
  );
}