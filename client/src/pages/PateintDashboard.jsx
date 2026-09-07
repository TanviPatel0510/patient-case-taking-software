import {
  RiArrowRightLine,
  RiHeartPulseLine,
  RiLogoutBoxRLine,
  RiStethoscopeLine,
  RiUserLine,
} from "@remixicon/react";

import { AppShell } from "../components/AppShell";

const languageNames = {
  hi: "Hindi",
  en: "English",
  bn: "Bengali",
  mr: "Marathi",
  te: "Telugu",
  ta: "Tamil",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  or: "Odia",
};

export function PatientDashboard({ session, go, signOut }) {
  // Extract active patient details from session
  const patient =
    session?.patient ||
    session?.profiles?.[0] ||
    session?.user ||
    {};

  const emergencyContact =
    patient?.demographics?.emergencyContact ||
    patient?.emergencyContact ||
    {};

  const medicalProfile =
    patient?.medicalProfile ||
    {};

  const fullName =
    patient?.fullName ||
    session?.user?.fullName ||
    "Patient";

  const age = patient?.age ? `${patient.age} Years` : "Not added";

  const gender = patient?.gender
    ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1).replace("_", " ")
    : "Not specified";

  const languageCode =
    patient?.preferredLanguage ||
    patient?.preferences?.preferredLanguage ||
    "hi";
  const language = languageNames[languageCode] || languageCode;

  const abhaStatus =
    patient?.abhaStatus ||
    (patient?.identity?.isAbhaVerified ? "Verified" : "Not Verified");

  return (
    <AppShell go={go}>
      <section className="mx-auto w-full max-w-[1180px] py-4 pb-16">
        {/* Top Header Controls (Logout / Switch Profile) */}
        <div className="mb-4 flex items-center justify-end gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0c5e5b] hover:underline cursor-pointer"
            onClick={() => go("/profiles")}
          >
            <RiUserLine className="size-4" />
            <span>Switch profile</span>
          </button>
          <span className="text-xs text-[#d1e2dc]">|</span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5d7c80] hover:text-[#0c5e5b] cursor-pointer"
            onClick={signOut}
          >
            <RiLogoutBoxRLine className="size-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Top Dark Patient Banner */}
        <div className="w-full rounded-[20px] bg-[#143840] px-8 py-5 shadow-sm text-white">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 items-center">
            {/* Column 1: Patient Name */}
            <div>
              <span className="block text-[0.68rem] font-bold tracking-[0.14em] text-[#789d9e] uppercase">
                PATIENT NAME
              </span>
              <strong className="mt-1 block text-base font-bold text-white truncate">
                {fullName}
              </strong>
            </div>

            {/* Column 2: Age */}
            <div>
              <span className="block text-[0.68rem] font-bold tracking-[0.14em] text-[#789d9e] uppercase">
                AGE
              </span>
              <strong className="mt-1 block text-base font-bold text-white">
                {age}
              </strong>
            </div>

            {/* Column 3: Gender */}
            <div>
              <span className="block text-[0.68rem] font-bold tracking-[0.14em] text-[#789d9e] uppercase">
                GENDER
              </span>
              <strong className="mt-1 block text-base font-bold text-white">
                {gender}
              </strong>
            </div>

            {/* Column 4: Language */}
            <div>
              <span className="block text-[0.68rem] font-bold tracking-[0.14em] text-[#789d9e] uppercase">
                LANGUAGE
              </span>
              <strong className="mt-1 block text-base font-bold text-white">
                {language}
              </strong>
            </div>

            {/* Column 5: ABHA Status */}
            <div>
              <span className="block text-[0.68rem] font-bold tracking-[0.14em] text-[#789d9e] uppercase">
                ABHA STATUS
              </span>
              <strong className="mt-1 block text-base font-bold text-[#4fd1c5]">
                {abhaStatus}
              </strong>
            </div>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card 1: Start AI Health Consultation */}
          <div className="flex flex-col justify-between rounded-[22px] border border-[#d2e7e2] bg-[#e3f3f0] p-8 shadow-xs">
            <div>
              {/* Icon */}
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#0c5e5b] text-white shadow-xs">
                <RiHeartPulseLine className="size-6" />
              </div>

              {/* Eyebrow */}
              <div className="mt-5 text-[0.72rem] font-bold tracking-[0.14em] text-[#0c5e5b] uppercase">
                YOUR NEXT STEP
              </div>

              {/* Title */}
              <h2 className="mt-2 text-[1.85rem] font-bold leading-[1.15] tracking-tight text-[#143840]">
                Start AI Health
                <br />
                Consultation
              </h2>

              {/* Subtext */}
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5d7c80]">
                Tell us about your symptoms using your voice or by touching the screen.
              </p>
            </div>

            {/* Action Row */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                className="flex h-12 items-center gap-2 rounded-xl bg-[#143840] px-6 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0c252b] cursor-pointer"
                onClick={() => alert("AI consultation module starting...")}
              >
                <span>Start conversation</span>
                <RiArrowRightLine className="size-4" />
              </button>
              <span className="text-xs text-[#5d7c80]">
                Voice or touch input available
              </span>
            </div>
          </div>

          {/* Card 2: My Health Profile */}
          <div className="rounded-[22px] border border-[#e8f1ed] bg-white p-7 shadow-xs sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#143840]">
                My health profile
              </h3>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#0c5e5b] hover:underline cursor-pointer"
                onClick={() => go("/profiles")}
              >
                <span>View profile</span>
                <RiArrowRightLine className="size-4" />
              </button>
            </div>

            {/* 2x2 Grid */}
            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <span className="block text-xs font-semibold text-[#143840]">
                  Height
                </span>
                <span className="mt-1 block text-xs text-[#7f999d]">
                  {medicalProfile?.heightCm ? `${medicalProfile.heightCm} cm` : "Not added"}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#143840]">
                  Weight
                </span>
                <span className="mt-1 block text-xs text-[#7f999d]">
                  {medicalProfile?.weightKg ? `${medicalProfile.weightKg} kg` : "Not added"}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#143840]">
                  Blood group
                </span>
                <span className="mt-1 block text-xs text-[#7f999d]">
                  {medicalProfile?.bloodGroup || "Not added"}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#143840]">
                  Conditions
                </span>
                <span className="mt-1 block text-xs text-[#7f999d]">
                  {medicalProfile?.chronicConditions?.length
                    ? medicalProfile.chronicConditions.join(", ")
                    : "None added"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Previous Consultations */}
          <div className="rounded-[22px] border border-[#e8f1ed] bg-white p-7 shadow-xs sm:p-8">
            <h3 className="text-base font-bold text-[#143840]">
              Previous consultations
            </h3>
            <div className="mt-3.5 border-b border-[#edf4f1]" />

            <div className="flex flex-col items-center justify-center py-9 text-center">
              <RiStethoscopeLine className="mb-2.5 size-7 text-[#0c5e5b]" />
              <strong className="block text-sm font-bold text-[#143840]">
                No previous consultations
              </strong>
              <span className="mt-1 block text-xs text-[#7f999d]">
                Your completed consultations will appear here.
              </span>
            </div>
          </div>

          {/* Card 4: Emergency Information */}
          <div className="rounded-[22px] border border-[#e8f1ed] bg-white p-7 shadow-xs sm:p-8">
            <h3 className="text-base font-bold text-[#143840]">
              Emergency information
            </h3>
            <div className="mt-3.5 border-b border-[#edf4f1]" />

            <div className="py-4 text-left">
              <strong className="block text-sm font-bold text-[#143840]">
                {emergencyContact?.name || "No contact specified"}
              </strong>
              <span className="mt-1 block text-xs text-[#5d7c80]">
                {emergencyContact?.relationship || "Relative"}
              </span>
              <span className="mt-0.5 block text-xs text-[#5d7c80]">
                {emergencyContact?.phone || "Phone not provided"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
export default PatientDashboard;
