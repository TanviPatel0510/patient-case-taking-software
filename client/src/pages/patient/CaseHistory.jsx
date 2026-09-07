import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderClock,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  User,
  Stethoscope,
  ChevronRight,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";

const INITIAL_CASES = [
  {
    id: "CAS-892104",
    date: "12 Feb 2026",
    time: "10:30 AM",
    doctor: "Dr. A. K. Verma",
    specialty: "General Medicine",
    chiefComplaint: "High fever (102°F) and severe dry cough",
    status: "Completed",
    diagnosis: "Acute Viral Upper Respiratory Infection",
    prescriptionCount: 3,
  },
  {
    id: "CAS-741209",
    date: "28 Jan 2026",
    time: "03:15 PM",
    doctor: "Dr. Sneha Joshi",
    specialty: "Pulmonology",
    chiefComplaint: "Seasonal wheezing and nighttime chest tightness",
    status: "Follow-up",
    diagnosis: "Bronchial Hyperresponsiveness / Mild Asthma",
    prescriptionCount: 2,
  },
  {
    id: "CAS-610283",
    date: "04 Nov 2025",
    time: "11:00 AM",
    doctor: "MediKiosk Tele-OPD",
    specialty: "Primary Triage",
    chiefComplaint: "Routine vital check and dietary counseling",
    status: "Completed",
    diagnosis: "Pre-hypertension - Dietary advisory provided",
    prescriptionCount: 1,
  },
];

export function CaseHistory() {
  const navigate = useNavigate();

  const [cases] = useState(INITIAL_CASES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  const filteredCases = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Case History">
      <div className="space-y-6">
        {/* Header Intro Banner */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#e2f2ef] text-[#0c5e5b] shadow-xs">
                <FolderClock className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Case & Consultation History
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                  Review your past clinical intake sessions, physician diagnoses, and medical prescriptions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/patient/new-case")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0c5e5b] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#084341] cursor-pointer"
            >
              <PlusCircle className="size-4" />
              Start New Case
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past cases by ID, doctor, or symptoms..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-[#0c5e5b] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0c5e5b]"
            />
          </div>
        </div>

        {/* Case List Table / Cards */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredCases.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs">
                No matching case history found.
              </div>
            ) : (
              filteredCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0c5e5b]">
                        {caseItem.id}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {caseItem.date}, {caseItem.time}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.68rem] font-bold ${
                          caseItem.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-gray-900">
                      {caseItem.chiefComplaint}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Stethoscope className="size-3.5 text-gray-400" />
                        {caseItem.doctor} ({caseItem.specialty})
                      </span>
                      <span>•</span>
                      <span className="text-gray-600">
                        Rx: <strong className="text-gray-800">{caseItem.prescriptionCount} medicines</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setSelectedCase(caseItem)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 cursor-pointer"
                    >
                      <Eye className="size-3.5" />
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Case Detail Modal / Preview */}
        {selectedCase && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
            onClick={() => setSelectedCase(null)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0c5e5b]">
                    {selectedCase.id}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-bold text-emerald-700">
                    {selectedCase.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-gray-700">
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[0.65rem] font-bold">
                    CHIEF COMPLAINT
                  </span>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">
                    {selectedCase.chiefComplaint}
                  </p>
                </div>

                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[0.65rem] font-bold">
                    PHYSICIAN DIAGNOSIS
                  </span>
                  <p className="mt-0.5 font-medium text-gray-900 bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
                    {selectedCase.diagnosis}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-1">
                  <div>
                    <span className="text-gray-400 block text-[0.65rem] font-bold">CONSULTING DOCTOR</span>
                    <strong className="text-gray-900">{selectedCase.doctor}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[0.65rem] font-bold">DATE & TIME</span>
                    <span className="text-gray-900">{selectedCase.date}, {selectedCase.time}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="rounded-xl bg-[#0c5e5b] px-4 py-2 text-xs font-semibold text-white hover:bg-[#084341] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CaseHistory;
