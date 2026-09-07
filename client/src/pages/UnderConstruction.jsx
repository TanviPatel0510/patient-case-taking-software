import { useNavigate, useLocation } from "react-router-dom";
import { Construction, ArrowLeft, LayoutDashboard, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getRoleDashboardPath } from "../constants/roles";
import { DashboardLayout } from "../components/DashboardLayout";

/**
 * Reusable Under Construction dummy page.
 * Used for modules and sub-pages not yet implemented.
 */
export function UnderConstruction({
  title = "Page Under Construction",
  description = "This clinical module is currently under active development and will be available in an upcoming release.",
  moduleName,
  wrapInLayout = true,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const dashboardPath = getRoleDashboardPath(user?.role);

  // Derive readable module name from pathname if not provided
  const derivedModuleName =
    moduleName ||
    location.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.replace(/[-_]/g, " "))
      .join(" / ")
      .toUpperCase();

  const content = (
    <div className="flex min-h-[500px] flex-col items-center justify-center text-center px-4">
      <div className="relative mb-6">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-[#e2f2ef] text-[#0c5e5b] shadow-inner">
          <Construction className="size-10 stroke-[1.75]" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs">
          <Clock className="size-4" />
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800">
        <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
        {derivedModuleName || "FEATURE IN PROGRESS"}
      </span>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">
        {description}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0c5e5b] cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Go Back
        </button>

        <button
          type="button"
          onClick={() => navigate(dashboardPath)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0c5e5b] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#084341] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0c5e5b] cursor-pointer"
        >
          <LayoutDashboard className="size-4" />
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  if (wrapInLayout) {
    return <DashboardLayout title="Under Construction">{content}</DashboardLayout>;
  }

  return content;
}

export default UnderConstruction;
