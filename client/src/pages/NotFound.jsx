import { useNavigate } from "react-router-dom";
import { RiHome4Line, RiQuestionLine } from "@remixicon/react";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/ui/button";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <section className="mx-auto my-16 max-w-[500px] px-4 text-center">
        <div className="rounded-3xl border border-[#d1e2dc] bg-white/90 p-10 shadow-[0_20px_50px_rgba(12,94,91,.06)] backdrop-blur-md">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-[#e2f2ef] text-[#0c5e5b]">
            <RiQuestionLine className="size-8" />
          </span>
          <span className="text-xs font-bold tracking-widest text-[#0c5e5b] uppercase">
            404 Error
          </span>
          <h1 className="mt-2 text-2xl font-bold text-[#142a30]">Page Not Found</h1>
          <p className="mt-2 text-sm text-[#556e72]">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0c5e5b] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#084341] cursor-pointer"
            onClick={() => navigate("/")}
          >
            <RiHome4Line className="size-4" />
            Back to Home
          </Button>
        </div>
      </section>
    </AppShell>
  );
}

export default NotFound;
