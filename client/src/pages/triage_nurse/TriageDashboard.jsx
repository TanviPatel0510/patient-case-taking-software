import { useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Users,
  Activity,
  ArrowRight,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DashboardLayout } from "../../components/DashboardLayout";

export function TriageDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const nurseName = user?.fullName || user?.name || "Triage Nurse";

  return (
    <DashboardLayout title="Triage Station">
      <div className="space-y-6">
        {/* Banner */}
        <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-2xs sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#e2f2ef] text-[#0c5e5b] shadow-xs">
                <HeartPulse className="size-7" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[0.7rem] font-bold text-[#0c5e5b] uppercase tracking-wider">
                  EMERGENCY & OPD TRIAGE DESK
                </span>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                  Welcome, Nurse {nurseName}
                </h1>
                <p className="mt-0.5 text-xs text-gray-500">
                  Assess patient severity, record initial vital parameters, and route to appropriate physician OPDs.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/triage_nurse/queue")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0c5e5b] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#084341] cursor-pointer"
            >
              <span>View Triage Queue</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Action Modules */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div
            onClick={() => navigate("/triage_nurse/queue")}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs hover:border-[#0c5e5b] transition-all cursor-pointer"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#e2f2ef] text-[#0c5e5b]">
                <Users className="size-6" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-[#0c5e5b]">
                Incoming Patient Queue
              </h2>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                Prioritize incoming walk-ins by acuity (Red / Yellow / Green triage categories).
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#0c5e5b]">
              <span>Open Queue</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          <div
            onClick={() => navigate("/triage_nurse/vitals")}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs hover:border-[#0c5e5b] transition-all cursor-pointer"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#e2f2ef] text-[#0c5e5b]">
                <Activity className="size-6" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-[#0c5e5b]">
                Vital Signs Recorder
              </h2>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                Capture blood pressure, pulse, SpO2, body temperature, and pain score.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#0c5e5b]">
              <span>Record Vitals</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TriageDashboard;
