import {
  RiArrowRightLine,
  RiHeartPulseLine,
  RiLogoutBoxRLine,
  RiStethoscopeLine,
} from "@remixicon/react";

import { AppShell } from "../components/AppShell";
import { Button } from "../components/ui/button";

const roleLabels = {
  patient: "Patient",
  doctor: "Doctor",
  triage_nurse: "Triage nurse",
  admin: "Administrator",
  kiosk: "Kiosk",
};

function EmptyDashboard({ go }) {
  return (
    <AppShell go={go}>
      <section className="grid min-h-[520px] place-items-center text-center">
        <div className="rounded-3xl border border-[#d1e2dc] bg-white/90 p-10 shadow-[0_20px_50px_rgba(12,94,91,.08)] backdrop-blur-md">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-[#e2f2ef] text-[#0c5e5b]">
            <RiStethoscopeLine className="size-8" />
          </span>
          <h1 className="text-2xl font-bold text-[#142a30]">Login to continue</h1>
          <p className="mt-2 text-sm text-[#556e72]">Please login to access your role-specific clinical portal.</p>
          <Button
            className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#0c5e5b] px-7 py-3 text-xs font-bold text-white shadow-md hover:bg-[#084341] cursor-pointer"
            onClick={() => go("/login")}
          >
            Go to Login
            <RiArrowRightLine className="size-4" />
          </Button>
        </div>
      </section>
    </AppShell>
  );
}

export function RoleDashboard({ session, go, signOut }) {
  if (!session) {
    return <EmptyDashboard go={go} />;
  }

  const role = session.role || "patient";
  const person = session.patient || session.user;
  const roleLabel = roleLabels[role] || role;
  const name = person?.fullName || person?.name || roleLabel;

  return (
    <AppShell go={go}>
      <section className="py-12 pb-20">
        <div className="flex items-end justify-between gap-5 max-[760px]:flex-col max-[760px]:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0c5e5b]/20 bg-[#e2f2ef]/70 px-3.5 py-1 text-[0.72rem] font-black tracking-[0.14em] text-[#0c5e5b] uppercase">
              {roleLabel} WORKSPACE
            </span>
            <h1 className="my-4 mb-0 text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] tracking-tight text-[#142a30]">
              Welcome, <em className="font-serif italic text-[#0c5e5b]">{name.split(" ")[0]}</em>
            </h1>
            <p className="mt-2 text-base text-[#556e72]">
              Your {roleLabel.toLowerCase()} clinical session is active.
            </p>
          </div>

          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border border-[#d1e2dc] bg-white px-5 py-2 text-xs font-bold text-[#0c5e5b] shadow-xs hover:bg-[#e2f2ef] cursor-pointer"
            onClick={signOut}
          >
            <RiLogoutBoxRLine className="size-4" />
            Logout
          </Button>
        </div>

        <article className="mx-auto mt-12 max-w-[640px] rounded-3xl border border-[#d1e2dc] bg-white/90 p-10 shadow-[0_20px_50px_rgba(12,94,91,.09)] backdrop-blur-md max-[760px]:p-6">
          <span className="mb-6 grid size-12 place-items-center rounded-2xl bg-[#e2f2ef] text-[#0c5e5b]">
            {role === "doctor" ? <RiStethoscopeLine className="size-6" /> : <RiHeartPulseLine className="size-6" />}
          </span>
          <span className="text-[0.7rem] font-black tracking-[0.15em] text-[#0c5e5b] uppercase">
            {role === "doctor" ? "PHYSICIAN CONSOLE" : "WORKSPACE OVERVIEW"}
          </span>
          <h2 className="my-3 text-3xl font-bold tracking-tight text-[#142a30]">
            Welcome to your
            <br />
            <em className="font-serif italic text-[#0c5e5b]">dashboard.</em>
          </h2>

          {role === "doctor" && person?.specialization && (
            <div className="my-4 rounded-xl border border-[#d1e2dc] bg-[#f7fbf9] p-4 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[#556e72]">
                <div>
                  <span className="block font-medium">Department:</span>
                  <strong className="text-[#142a30]">{person.department || "General"}</strong>
                </div>
                <div>
                  <span className="block font-medium">Specialization:</span>
                  <strong className="text-[#142a30]">{person.specialization}</strong>
                </div>
                {person.roomNumber && (
                  <div>
                    <span className="block font-medium">OPD Room:</span>
                    <strong className="text-[#142a30]">{person.roomNumber}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="max-w-md text-sm leading-relaxed text-[#556e72]">
            This is your role-aware {roleLabel.toLowerCase()} dashboard. Consultation queues, case-taking intake, and clinical diagnosis modules will be activated here.
          </p>
          <Button
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0c5e5b] px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#084341] cursor-pointer"
            onClick={() => go("/")}
          >
            Return to Home
            <RiArrowRightLine className="size-4" />
          </Button>
        </article>
      </section>
    </AppShell>
  );
}
