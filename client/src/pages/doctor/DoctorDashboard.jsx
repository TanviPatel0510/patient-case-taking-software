import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  ClipboardList,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DashboardLayout } from "../../components/DashboardLayout";

export function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const person = user?.doctor || user?.user || user || {};
  const doctorName = person?.fullName || person?.name || "Physician";

  return (
    <DashboardLayout title="Physician Workspace">
      <div className="space-y-6">
        {/* Doctor Banner */}
        <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-2xs sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#e2f2ef] text-[#0c5e5b] shadow-xs">
                <Stethoscope className="size-7" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[0.7rem] font-bold text-[#0c5e5b] uppercase tracking-wider">
                  CLINICAL OPD STATION
                </span>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                  Welcome back, Dr. {doctorName}
                </h1>
                <p className="mt-0.5 text-xs text-gray-500">
                  Department: <strong className="text-gray-800">{person.department || "General Medicine"}</strong> • Room: <strong className="text-gray-800">{person.roomNumber || "OPD-3"}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/doctor/queue")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0c5e5b] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#084341] cursor-pointer"
            >
              <span>Call Next Patient</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Clinical OPD Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Patients in Queue</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-[#0c5e5b]">
                <Users className="size-4" />
              </div>
            </div>
            <strong className="mt-2 block text-2xl font-bold text-gray-900">7 Waiting</strong>
            <span className="mt-1 block text-[0.7rem] text-emerald-600 font-medium">Avg wait time: 8 mins</span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Completed Today</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle className="size-4" />
              </div>
            </div>
            <strong className="mt-2 block text-2xl font-bold text-gray-900">14 Consults</strong>
            <span className="mt-1 block text-[0.7rem] text-gray-400">Target: 25 / session</span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Pending Reviews</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock className="size-4" />
              </div>
            </div>
            <strong className="mt-2 block text-2xl font-bold text-gray-900">3 Lab Reports</strong>
            <span className="mt-1 block text-[0.7rem] text-amber-600 font-medium">Action required</span>
          </div>
        </div>

        {/* Quick Access Modules */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div
            onClick={() => navigate("/doctor/queue")}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs hover:border-[#0c5e5b] transition-all cursor-pointer"
          >
            <div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#e2f2ef] text-[#0c5e5b]">
                <Users className="size-5" />
              </div>
              <h2 className="mt-4 text-base font-bold text-gray-900 group-hover:text-[#0c5e5b]">
                Consultation Queue
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Manage prioritized patient queue with pre-consultation vitals and triage summaries.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#0c5e5b]">
              <span>Open Queue</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          <div
            onClick={() => navigate("/doctor/patients")}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs hover:border-[#0c5e5b] transition-all cursor-pointer"
          >
            <div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#e2f2ef] text-[#0c5e5b]">
                <ClipboardList className="size-5" />
              </div>
              <h2 className="mt-4 text-base font-bold text-gray-900 group-hover:text-[#0c5e5b]">
                Patient Health Records (ABDM)
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Lookup longitudinal patient history, linked ABHA profiles, and electronic prescriptions.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#0c5e5b]">
              <span>Lookup Records</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorDashboard;
