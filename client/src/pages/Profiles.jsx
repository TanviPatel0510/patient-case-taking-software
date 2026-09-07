import { useState } from "react";
import { RiArrowRightLine, RiLogoutBoxRLine, RiUserAddLine, RiUserLine } from "@remixicon/react";

import { AppShell } from "../components/AppShell";
import { Button } from "../components/ui/button";
import { selectPatientProfile } from "../lib/api";

export function Profiles({ session, go, onSelected, signOut }) {
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const profiles = session?.profiles || [];

  const chooseProfile = async (patientId) => {
    setBusyId(patientId);
    setError("");
    try {
      const result = await selectPatientProfile(patientId);
      onSelected(result);
      go("/patient/dashboard");
    } catch (reason) {
      setError(reason.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <AppShell go={go}>
      <section className="mx-auto my-12 max-w-[840px] px-4">
        <div className="flex items-end justify-between gap-6 max-[760px]:flex-col max-[760px]:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0c5e5b]/20 bg-[#e2f2ef]/70 px-3.5 py-1 text-[0.72rem] font-black tracking-[0.14em] text-[#0c5e5b] uppercase">
              <RiUserLine className="size-3.5" />
              PROFILE SELECTION
            </span>
            <h1 className="my-4 text-[clamp(2.5rem,5vw,4.2rem)] font-extrabold leading-[0.98] tracking-tight text-[#142a30]">
              Who are you <em className="font-serif italic text-[#0c5e5b]">continuing as?</em>
            </h1>
            <p className="text-sm text-[#556e72]">Choose the patient profile for this medical session.</p>
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

        {error && <div className="my-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">{error}</div>}

        <div className="mt-8 grid gap-3.5">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className="group grid w-full grid-cols-[52px_1fr_auto] items-center gap-4 rounded-2xl border border-[#d1e2dc] bg-white/90 p-4.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0c5e5b] hover:shadow-md cursor-pointer disabled:opacity-60"
              disabled={Boolean(busyId)}
              onClick={() => chooseProfile(profile.id)}
            >
              <span className="grid size-12 place-items-center rounded-xl bg-[#e2f2ef] text-[#0c5e5b] transition-transform duration-200 group-hover:scale-105">
                <RiUserLine className="size-6" />
              </span>
              <span>
                <strong className="block text-base font-bold text-[#142a30]">{profile.fullName}</strong>
                <small className="mt-0.5 block text-xs font-medium text-[#556e72]">
                  {profile.relation === "self" ? "Self (Primary Account)" : profile.relation || "Patient profile"}
                  {profile.age ? ` · ${profile.age} years` : ""}
                </small>
              </span>
              <span className="grid size-8 place-items-center rounded-full bg-[#f1f5f3] text-[#556e72] transition-colors group-hover:bg-[#0c5e5b] group-hover:text-white">
                {busyId === profile.id ? "..." : <RiArrowRightLine className="size-4" />}
              </span>
            </button>
          ))}
        </div>

        <Button
          className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0c5e5b] px-7 py-3 text-xs font-bold text-white shadow-[0_4px_16px_rgba(12,94,91,.25)] hover:bg-[#084341] cursor-pointer"
          onClick={() => go(`/register?add=1&identifier=${encodeURIComponent(session?.user?.phone || session?.user?.email || "")}`)}
        >
          <RiUserAddLine className="size-4" />
          Add Dependent / Family Profile
        </Button>
      </section>
    </AppShell>
  );
}
