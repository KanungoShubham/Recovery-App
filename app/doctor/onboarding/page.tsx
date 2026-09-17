"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

type Stage = "form" | "credentials" | "verifying" | "approved";

const LANGUAGES = ["English", "Hindi", "Spanish", "French"];

export default function DoctorOnboardingPage() {
  const router = useRouter();
  const { completeDoctorOnboarding } = useStore();
  const { push } = useToast();

  const [stage, setStage] = useState<Stage>("form");
  const [fullName, setFullName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [hospital, setHospital] = useState("");
  const [language, setLanguage] = useState("English");
  const [uploaded, setUploaded] = useState(false);

  const formValid = fullName.trim() && regNumber.trim() && specialty.trim() && hospital.trim();

  function submitForm() {
    if (!formValid) return;
    completeDoctorOnboarding({ fullName, regNumber, specialty, hospital, language });
    setStage("credentials");
  }

  function uploadCredentials() {
    setUploaded(true);
    push({ kind: "success", title: "Credentials uploaded", message: "Medical license and ID verification submitted." });
    setStage("verifying");
    window.setTimeout(() => {
      setStage("approved");
      push({
        kind: "success",
        title: "Profile verified!",
        message: "Approved by the CareBridge clinical team.",
      });
    }, 2600);
  }

  function enter() {
    router.push("/doctor/dashboard");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-[max(24px,env(safe-area-inset-top))]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white">
            <Icon path={paths.medkit} className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-ink">Doctor Registration</h1>
            <p className="text-[13px] text-gray-helper">Join CareBridge as a verified clinician.</p>
          </div>
        </div>

        {stage === "form" && (
          <div className="rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
            <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Dr. Aditi Mehta" />
            <Field label="Medical registration number" value={regNumber} onChange={setRegNumber} placeholder="MCI-1234567" />
            <Field label="Speciality" value={specialty} onChange={setSpecialty} placeholder="Orthopedic Surgeon" />
            <Field label="Practice / hospital" value={hospital} onChange={setHospital} placeholder="St. Mary's Hospital" />
            <div className="mb-1.5">
              <label className="mb-1.5 block text-[13px] font-semibold text-ink">Preferred language</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      language === l ? "bg-primary text-white" : "bg-body text-gray-helper"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={submitForm}
              disabled={!formValid}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white active:opacity-90 disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {stage === "credentials" && (
          <div className="rounded-2xl border border-gray-medium bg-white p-5 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon path={paths.upload} className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[15px] font-bold text-ink">Upload professional credentials</p>
            <p className="mt-1 text-[13px] leading-5 text-gray-helper">
              Medical license, PAN card or Aadhaar card for identity &amp; credential verification.
            </p>
            <button
              onClick={uploadCredentials}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[14px] font-bold text-white active:opacity-90"
            >
              <Icon path={paths.upload} className="h-4 w-4" />
              Upload Documents
            </button>
          </div>
        )}

        {stage === "verifying" && (
          <div className="rounded-2xl border border-gray-medium bg-white p-6 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning-light text-warning">
              <Icon path={paths.clipboardList} className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[15px] font-bold text-ink">Profile status: Verification pending</p>
            <p className="mt-1 text-[13px] leading-5 text-gray-helper">
              Your profile is being verified &amp; authenticated by the CareBridge team. This usually
              takes a few minutes.
            </p>
          </div>
        )}

        {stage === "approved" && (
          <div className="rounded-2xl border border-success/30 bg-success-light p-6 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
              <Icon path={paths.check} className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[15px] font-bold text-ink">Profile status: Approved</p>
            <p className="mt-1 text-[13px] leading-5 text-gray-helper">
              You're verified and ready to start reviewing patient recovery plans.
            </p>
            <button
              onClick={enter}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white shadow-floating active:opacity-90"
            >
              Enter Doctor Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-gray-medium bg-white px-3 text-[14px] text-ink outline-none placeholder:text-gray-helper focus:border-primary"
      />
    </div>
  );
}
