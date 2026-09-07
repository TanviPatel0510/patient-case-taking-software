import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Mic,
  Hand,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Volume2,
} from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";

const COMMON_SYMPTOMS = [
  "Fever & Chills",
  "Persistent Cough",
  "Headache / Migraine",
  "Sore Throat",
  "Shortness of Breath",
  "Stomach Pain",
  "Joint / Body Ache",
  "Fatigue & Weakness",
  "Nausea / Vomiting",
  "Skin Rash",
];

export function NewCase() {
  const navigate = useNavigate();

  const [inputMode, setInputMode] = useState("guided"); // "guided" or "voice"
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState("1-3 days");
  const [severity, setSeverity] = useState("Moderate");
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState(null);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `CAS-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedCaseId(generatedId);
    }, 1200);
  };

  return (
    <DashboardLayout title="New Clinical Case Intake">
      <div className="mx-auto max-w-4xl space-y-6">
        {submittedCaseId ? (
          /* Case Created Success Card */
          <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
              <CheckCircle2 className="size-9" />
            </div>
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              CASE INTAKE RECORDED
            </span>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              Case Successfully Created
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              Your intake information has been securely captured and queued for physician consultation.
            </p>

            <div className="my-6 mx-auto max-w-sm rounded-xl bg-gray-50 p-4 border border-gray-100 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Case ID:</span>
                <strong className="font-mono text-gray-900">{submittedCaseId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recorded Symptoms:</span>
                <strong className="text-gray-900 truncate max-w-[200px]">
                  {selectedSymptoms.length > 0 ? selectedSymptoms.join(", ") : "Recorded via intake"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Waiting Time:</span>
                <strong className="text-[#0c5e5b]">~10-15 Minutes</strong>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/patient/case-history")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0c5e5b] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#084341] cursor-pointer"
              >
                View in Case History
                <ArrowRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmittedCaseId(null);
                  setSelectedSymptoms([]);
                  setDescription("");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Create Another Case
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Intro Header */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-[#e2f2ef] text-[#0c5e5b] shadow-xs">
                    <PlusCircle className="size-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Start New Case Consultation
                    </h1>
                    <p className="mt-1 text-xs text-gray-500">
                      Provide current symptoms and health complaints for preliminary triage and doctor consultation.
                    </p>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-medium self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setInputMode("guided")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
                      inputMode === "guided"
                        ? "bg-white text-gray-900 font-bold shadow-2xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Hand className="size-3.5" />
                    Touch / Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("voice")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
                      inputMode === "voice"
                        ? "bg-[#0c5e5b] text-white font-bold shadow-2xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Mic className="size-3.5" />
                    Voice Intake
                  </button>
                </div>
              </div>
            </div>

            {/* Voice Mode Banner */}
            {inputMode === "voice" && (
              <div className="rounded-2xl border border-teal-200 bg-[#eef7f5] p-6 text-center shadow-2xs">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#0c5e5b] text-white mb-3 shadow-md">
                  <Mic className={`size-8 ${isRecording ? "animate-pulse text-red-300" : ""}`} />
                </div>
                <h3 className="text-lg font-bold text-[#143840]">
                  {isRecording ? "Listening to your voice..." : "Voice-Assisted Case Taking"}
                </h3>
                <p className="mt-1 text-xs text-gray-600 max-w-md mx-auto">
                  Speak comfortably in Hindi, English, or your preferred language. MediKiosk AI will transcribe and extract your symptoms automatically.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRecording(!isRecording)}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer ${
                      isRecording
                        ? "bg-red-600 hover:bg-red-700 animate-pulse"
                        : "bg-[#0c5e5b] hover:bg-[#084341]"
                    }`}
                  >
                    <Mic className="size-4" />
                    {isRecording ? "Stop & Transcribe" : "Start Speaking"}
                  </button>
                </div>
              </div>
            )}

            {/* Common Symptoms Selection */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <label className="text-sm font-bold text-gray-900">
                  Select Primary Symptoms
                </label>
                <span className="text-xs text-gray-400">
                  Select one or more
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {COMMON_SYMPTOMS.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#0c5e5b] bg-[#e2f2ef] text-[#0c5e5b] shadow-2xs"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {isSelected && "✓ "}
                      {symptom}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity & Duration Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Symptom Severity */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Symptom Severity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Mild", "Moderate", "Severe"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSeverity(level)}
                      className={`rounded-xl border py-2.5 text-xs font-semibold transition cursor-pointer ${
                        severity === level
                          ? level === "Severe"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-[#0c5e5b] bg-[#e2f2ef] text-[#0c5e5b]"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptom Duration */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  How long have you had symptoms?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["< 24 Hours", "1-3 days", "> 1 Week"].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`rounded-xl border py-2.5 text-xs font-semibold transition cursor-pointer ${
                        duration === dur
                          ? "border-[#0c5e5b] bg-[#e2f2ef] text-[#0c5e5b]"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Freeform Notes / Description */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
              <label htmlFor="case-notes" className="block text-sm font-bold text-gray-900 mb-2">
                Additional Notes or Description (Optional)
              </label>
              <textarea
                id="case-notes"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe specific discomfort, triggers, or medicines already taken..."
                className="w-full rounded-xl border border-gray-200 p-3.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#0c5e5b] focus:outline-hidden focus:ring-1 focus:ring-[#0c5e5b]"
              />
            </div>

            {/* Submit Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/patient/dashboard")}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0c5e5b] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#084341] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  "Processing Intake..."
                ) : (
                  <>
                    <span>Submit & Queue Case</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

export default NewCase;
