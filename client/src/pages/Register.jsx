import { useState } from "react";
import { RiArrowLeftSLine, RiArrowRightLine, RiUserAddLine } from "@remixicon/react";

import { AppShell } from "../components/AppShell";
import { registerPatient, registerPatientProfile, requestPatientOtp } from "../lib/api";

const initialForm = {
  abhaNumber: "",
  abhaAddress: "",
  aadhaarLastFour: "",
  fullName: "",
  dateOfBirth: "",
  gender: "",
  mobileNumber: "",
  email: "",
  preferredLanguage: "hi",
  villageOrCity: "",
  district: "",
  state: "",
  pincode: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  heightCm: "",
  weightKg: "",
  bloodGroup: "",
  otp: "",
  consent: false,
};

const states = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Delhi",
  "Goa",
  "Gujarat",
  "Karnataka",
  "Kerala",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

const languages = [
  ["hi", "Hindi"],
  ["en", "English"],
  ["bn", "Bengali"],
  ["gu", "Gujarati"],
  ["mr", "Marathi"],
  ["te", "Telugu"],
  ["ta", "Tamil"],
  ["kn", "Kannada"],
  ["ml", "Malayalam"],
  ["pa", "Punjabi"],
  ["or", "Odia"],
];

const genderOptions = [
  ["male", "Male"],
  ["female", "Female"],
  ["other", "Other"],
  ["prefer_not_to_say", "Prefer not to say"],
];

const relationshipOptions = [
  "Parent",
  "Spouse",
  "Sibling",
  "Child",
  "Relative",
  "Friend",
  "Other",
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

function Field({
  label,
  name,
  form,
  setForm,
  required = false,
  type = "text",
  options,
  ...props
}) {
  const updateField = (event) => {
    const { name: fieldName, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value,
    }));
  };

  return (
    <div className="mt-4">
      <label className="block text-xs font-semibold text-[#143337] mb-1.5" htmlFor={name}>
        {label}
        {required && <span className="text-[#e06a3b]"> *</span>}
      </label>

      {options ? (
        <select
          id={name}
          name={name}
          className="h-11 w-full rounded-xl border border-[#d1e2dc] bg-white px-3.5 text-sm text-[#143337] outline-none transition-colors focus:border-[#0c5e5b] focus:ring-2 focus:ring-[#0c5e5b]/20"
          required={required}
          value={form[name] || ""}
          onChange={updateField}
          {...props}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => {
            const value = Array.isArray(option) ? option[0] : option;
            const text = Array.isArray(option) ? option[1] : option;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          className="h-11 w-full rounded-xl border border-[#d1e2dc] bg-white px-3.5 text-sm text-[#143337] placeholder:text-[#94a9af] outline-none transition-colors focus:border-[#0c5e5b] focus:ring-2 focus:ring-[#0c5e5b]/20 disabled:bg-[#f2f6f4] disabled:text-[#7f999d]"
          type={type}
          required={required}
          value={form[name] || ""}
          onChange={updateField}
          {...props}
        />
      )}
    </div>
  );
}

function FormSection({ title, description, children }) {
  return (
    <section className="mt-6 rounded-[22px] border border-[#e8f1ed] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-baseline justify-between gap-4 border-b border-[#edf4f1] pb-3.5 max-sm:block">
        <h2 className="text-base font-bold text-[#143337]">{title}</h2>
        {description && <p className="text-xs text-[#5d7c80] max-sm:mt-1">{description}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}

export function Register({ session, go, onAuthenticated }) {
  const searchParams = new URLSearchParams(window.location.search);
  const isAddingProfile = searchParams.get("add") === "1";
  const paramIdentifier = searchParams.get("identifier") || "";
  const hasLoginOtp = Boolean(paramIdentifier) && !isAddingProfile;

  const [form, setForm] = useState(() => {
    let initialMobile = session?.user?.phone || "";
    let initialEmail = session?.user?.email || "";
    if (paramIdentifier) {
      if (paramIdentifier.includes("@")) {
        initialEmail = paramIdentifier;
      } else {
        initialMobile = paramIdentifier.replace(/\D/g, "").slice(-10);
      }
    }
    return {
      ...initialForm,
      mobileNumber: initialMobile,
      email: initialEmail,
    };
  });

  const [otpRequested, setOtpRequested] = useState(hasLoginOtp);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    const contactValue = form.mobileNumber || form.email;
    if (!contactValue) {
      setError("Please enter your mobile number or email address.");
      return;
    }

    setBusy(true);

    try {
      if (!otpRequested) {
        await requestPatientOtp(contactValue, isAddingProfile ? "profile_add" : undefined);
        setOtpRequested(true);
        return;
      }
      const payload = {
        ...form,
        identifier: contactValue,
      };
      const result = isAddingProfile
        ? await registerPatientProfile(payload)
        : await registerPatient(payload);
      onAuthenticated(result);
      go("/profiles");
    } catch (reason) {
      setError(reason.message || "Failed to complete registration. Please verify your details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell go={go}>
      <form className="mx-auto my-6 mb-20 max-w-[880px]" onSubmit={submit}>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-[#0c5e5b] transition-colors hover:text-[#084341] cursor-pointer"
            onClick={() => go("/")}
          >
            <RiArrowLeftSLine className="size-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to welcome</span>
          </button>
          <button
            type="button"
            className="text-xs font-semibold text-[#5d7c80] hover:text-[#0c5e5b] cursor-pointer"
            onClick={() => go("/login")}
          >
            Already have an account?{" "}
            <span className="font-bold text-[#0c5e5b] underline">Sign in</span>
          </button>
        </div>

        <div className="mt-5 mb-8">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-[#0c5e5b] uppercase">
            <RiUserAddLine className="size-4" />
            <span>PATIENT REGISTRATION</span>
          </div>
          <h1 className="text-[clamp(2.4rem,4.5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[#143337]">
            Patient Registration
          </h1>
          <p className="mt-2 text-base text-[#5d7c80]">
            Create your digital patient profile to begin using MediKiosk and access OPD services.
          </p>
        </div>

        {error && (
          <div className="my-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Identity Information */}
        <FormSection
          title="Identity information"
          description="Optional details help keep your medical records connected."
        >
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-3">
            <Field
              label="ABHA number"
              name="abhaNumber"
              form={form}
              setForm={setForm}
              placeholder="12-3456-7890-1234"
            />
            <Field
              label="ABHA address"
              name="abhaAddress"
              form={form}
              setForm={setForm}
              placeholder="name@abdm"
            />
            <Field
              label="Aadhaar last 4 digits"
              name="aadhaarLastFour"
              form={form}
              setForm={setForm}
              inputMode="numeric"
              maxLength="4"
              placeholder="e.g. 1234"
            />
          </div>
        </FormSection>

        {/* Personal Details */}
        <FormSection
          title="Personal details"
          description="Required information for your hospital patient record."
        >
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <Field
              label="Full name"
              name="fullName"
              form={form}
              setForm={setForm}
              required
              placeholder="Enter your full name"
            />
            <Field
              label="Date of birth"
              name="dateOfBirth"
              form={form}
              setForm={setForm}
              required
              type="date"
            />
            <Field
              label="Mobile number"
              name="mobileNumber"
              form={form}
              setForm={setForm}
              required
              inputMode="numeric"
              maxLength="10"
              pattern="[6-9][0-9]{9}"
              placeholder="10-digit mobile number"
            />
            <Field
              label="Email address"
              name="email"
              form={form}
              setForm={setForm}
              type="email"
              placeholder="you@example.com"
            />
            <Field
              label="Gender"
              name="gender"
              form={form}
              setForm={setForm}
              required
              options={genderOptions}
            />
            <Field
              label="Preferred language"
              name="preferredLanguage"
              form={form}
              setForm={setForm}
              required
              options={languages}
            />
          </div>
        </FormSection>

        {/* Address */}
        <FormSection title="Address">
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <Field
              label="Village / City"
              name="villageOrCity"
              form={form}
              setForm={setForm}
              required
              placeholder="City or village"
            />
            <Field
              label="District"
              name="district"
              form={form}
              setForm={setForm}
              required
              placeholder="District"
            />
            <Field
              label="State"
              name="state"
              form={form}
              setForm={setForm}
              required
              options={states}
            />
            <Field
              label="PIN code"
              name="pincode"
              form={form}
              setForm={setForm}
              required
              inputMode="numeric"
              maxLength="6"
              pattern="[0-9]{6}"
              placeholder="6-digit PIN code"
            />
          </div>
        </FormSection>

        {/* Emergency Contact */}
        <FormSection
          title="Emergency contact"
          description="Someone we can reach if you need extra support."
        >
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-3">
            <Field
              label="Contact name"
              name="emergencyContactName"
              form={form}
              setForm={setForm}
              required
              placeholder="Relative or friend name"
            />
            <Field
              label="Relationship"
              name="emergencyContactRelationship"
              form={form}
              setForm={setForm}
              required
              options={relationshipOptions}
            />
            <Field
              label="Phone number"
              name="emergencyContactPhone"
              form={form}
              setForm={setForm}
              required
              inputMode="numeric"
              maxLength="10"
              pattern="[6-9][0-9]{9}"
              placeholder="10-digit phone"
            />
          </div>
        </FormSection>

        {/* Basic Health Info */}
        <FormSection
          title="Basic health information"
          description="Optional details for future consultations."
        >
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-3">
            <Field
              label="Height in cm"
              name="heightCm"
              form={form}
              setForm={setForm}
              placeholder="e.g. 165"
            />
            <Field
              label="Weight in kg"
              name="weightKg"
              form={form}
              setForm={setForm}
              placeholder="e.g. 62"
            />
            <Field
              label="Blood group"
              name="bloodGroup"
              form={form}
              setForm={setForm}
              options={bloodGroups}
            />
          </div>
        </FormSection>

        {/* Account Verification */}
        <FormSection
          title="Verify your account"
          description="Check your backend server console for the 6-digit OTP code."
        >
          <Field
            label="Six-digit OTP"
            name="otp"
            form={form}
            setForm={setForm}
            required={otpRequested}
            inputMode="numeric"
            maxLength="6"
            pattern="[0-9]{6}"
            placeholder={otpRequested ? "Enter the printed OTP" : "Request an OTP first"}
            disabled={!otpRequested}
          />
        </FormSection>

        {/* Consent Checkbox */}
        <label className="mt-6 flex items-start gap-3 rounded-2xl border border-[#d1e2dc] bg-white p-4 text-xs leading-relaxed text-[#5d7c80]">
          <input
            required
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 rounded border-[#d1e2dc] text-[#0c5e5b] accent-[#0c5e5b] cursor-pointer"
            checked={form.consent}
            onChange={(event) =>
              setForm((currentForm) => ({
                ...currentForm,
                consent: event.target.checked,
              }))
            }
          />
          <span>
            I agree to the use of my personal and health information for receiving MediKiosk
            healthcare services under Ayushman Bharat Digital Mission (ABDM) guidelines.
          </span>
        </label>

        {/* Submit */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={busy}
            className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0c5e5b] px-8 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#084341] cursor-pointer disabled:opacity-60"
          >
            {busy ? "Please wait..." : otpRequested ? "Complete Registration" : "Send OTP"}
            <RiArrowRightLine className="size-4" />
          </button>
        </div>
      </form>
    </AppShell>
  );
}
