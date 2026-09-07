import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Monitor,
  Settings,
  ArrowRight,
  Activity,
  Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DashboardLayout } from "../../components/DashboardLayout";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const adminName = user?.fullName || user?.name || "Administrator";

  return (
    <DashboardLayout title="System Administration">
      <div className="space-y-6">
        {/* Banner */}
        <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-2xs sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#e2f2ef] text-[#0c5e5b] shadow-xs">
                <ShieldCheck className="size-7" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[0.7rem] font-bold text-[#0c5e5b] uppercase tracking-wider">
                  SYSTEM ADMINISTRATION
                </span>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                  Welcome, {adminName}
                </h1>
                <p className="mt-0.5 text-xs text-gray-500">
                  Manage hospital staff permissions, monitor connected MediKiosk terminals, and audit security events.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0c5e5b] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#084341] cursor-pointer"
            >
              <span>Manage Staff</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Action Modules */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div
            onClick={() => navigate("/admin/users")}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs hover:border-[#0c5e5b] transition-all cursor-pointer"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#e2f2ef] text-[#0c5e5b]">
                <Users className="size-6" />
              </div>
              <h2 className="mt-4 text-base font-bold text-gray-900 group-hover:text-[#0c5e5b]">
                User & Role Management
              </h2>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Configure doctor credentials, triage nurse assignments, and patient account access.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#0c5e5b]">
              <span>Manage Users</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/kiosks")}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs hover:border-[#0c5e5b] transition-all cursor-pointer"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#e2f2ef] text-[#0c5e5b]">
                <Monitor className="size-6" />
              </div>
              <h2 className="mt-4 text-base font-bold text-gray-900 group-hover:text-[#0c5e5b]">
                Kiosk Terminals
              </h2>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Monitor online heartbeat, telemetry, sensor calibrations, and kiosk uptime.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#0c5e5b]">
              <span>Monitor Kiosks</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/settings")}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs hover:border-[#0c5e5b] transition-all cursor-pointer"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#e2f2ef] text-[#0c5e5b]">
                <Settings className="size-6" />
              </div>
              <h2 className="mt-4 text-base font-bold text-gray-900 group-hover:text-[#0c5e5b]">
                System Configurations
              </h2>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                ABDM gateway endpoints, SMS OTP service keys, and regional clinical dictionary settings.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#0c5e5b]">
              <span>Open Settings</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
