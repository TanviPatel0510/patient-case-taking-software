import { useNavigate } from "react-router-dom";
import {
  Monitor,
  UserPlus,
  Activity,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Volume2,
} from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";

export function KioskDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Kiosk Terminal Intake">
      <div className="space-y-6">
        {/* Kiosk Hero Banner */}
        <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-2xs sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#e2f2ef] text-[#0c5e5b] shadow-xs">
                <Monitor className="size-7" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[0.7rem] font-bold text-[#0c5e5b] uppercase tracking-wider">
                  SELF-SERVICE CLINICAL KIOSK
                </span>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                  Kiosk Terminal #04 (OPD Reception)
                </h1>
                <p className="mt-0.5 text-xs text-gray-500">
                  Ready for patient check-in, ABHA identity verification, and multi-lingual case-taking.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex size-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-semibold text-emerald-700">Terminal Online</span>
            </div>
          </div>
        </div>

        {/* Quick Kiosk Actions Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Action 1: New Patient Registration */}
          <div
            onClick={() => navigate("/kiosk/register")}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs hover:border-[#0c5e5b] transition-all cursor-pointer"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#e2f2ef] text-[#0c5e5b]">
                <UserPlus className="size-6" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-[#0c5e5b]">
                New Patient Registration & ABHA Link
              </h2>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                Register walk-in patients using Aadhaar/Mobile OTP to generate or link their ABHA health account.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#0c5e5b]">
              <span>Start Registration</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Action 2: Quick Vitals Assessment */}
          <div
            onClick={() => navigate("/kiosk/vitals")}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs hover:border-[#0c5e5b] transition-all cursor-pointer"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#e2f2ef] text-[#0c5e5b]">
                <Activity className="size-6" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-[#0c5e5b]">
                Kiosk Vitals & Screening
              </h2>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                Connect hardware sensors (Blood Pressure, SpO2, Digital Stethoscope, Thermometer) for automated screening.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#0c5e5b]">
              <span>Start Screening</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default KioskDashboard;
