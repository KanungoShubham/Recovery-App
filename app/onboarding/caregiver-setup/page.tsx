"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PatientTopBar } from "@/components/PatientTopBar";
import { PreferencesStep } from "@/components/PreferencesStep";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

type Stage = "add" | "confirm" | "waiting" | "synced";

export default function CaregiverSetupPage() {
  return (
    <Suspense fallback={null}>
      <CaregiverSetupPageInner />
    </Suspense>
  );
}

function CaregiverSetupPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get("name") ?? "";
  const { completeOnboarding, linkPatient, confirmPatientSync, setPreferences } = useStore();
  const { push } = useToast();

  const [showPrefs, setShowPrefs] = useState(true);
  const [stage, setStage] = useState<Stage>("add");
  const [mode, setMode] = useState<"qr" | "id">("id");
  const [patientId, setPatientId] = useState("");

  function findPatient() {
    if (!patientId.trim() && mode === "id") return;
    linkPatient("Julie Fernandez");
    setStage("confirm");
  }

  function confirm() {
    setStage("waiting");
    push({
      kind: "info",
      title: "Invitation sent",
      message: "Waiting for Julie to approve the sync.",
    });
    window.setTimeout(() => {
      confirmPatientSync();
      setStage("synced");
      push({ kind: "success", title: "Sync approved!", message: "You're now connected to Julie's recovery plan." });
    }, 2600);
  }

  function finish() {
    completeOnboarding(name, "", "");
    router.push("/dashboard");
  }

  if (showPrefs) {
    return (
      <PreferencesStep
        name={name}
        onDone={(prefs) => {
          setPreferences(prefs);
          setShowPrefs(false);
        }}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PatientTopBar name={name || "there"} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <h1 className="text-[20px] font-bold text-ink">Add the patient you're supporting</h1>
        <p className="mt-1 text-[13px] leading-5 text-gray-helper">
          Scan their QR code or enter their patient ID to connect.
        </p>

        {stage === "add" && (
          <div className="mt-6">
            <div className="mb-4 flex gap-2 rounded-xl bg-gray-medium/50 p-1">
              <button
                onClick={() => setMode("qr")}
                className={`h-10 flex-1 rounded-lg text-[13px] font-semibold transition-colors ${
                  mode === "qr" ? "bg-white text-primary shadow-card" : "text-gray-helper"
                }`}
              >
                Scan QR code
              </button>
              <button
                onClick={() => setMode("id")}
                className={`h-10 flex-1 rounded-lg text-[13px] font-semibold transition-colors ${
                  mode === "id" ? "bg-white text-primary shadow-card" : "text-gray-helper"
                }`}
              >
                Enter ID
              </button>
            </div>

            {mode === "qr" ? (
              <button
                onClick={findPatient}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-10 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon path={paths.clipboardList} className="h-6 w-6" />
                </div>
                <p className="text-[14px] font-semibold text-ink">Tap to scan patient's QR code</p>
                <p className="text-[12px] text-gray-helper">Ask the patient to open their profile QR</p>
              </button>
            ) : (
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">Patient ID</label>
                <input
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="e.g. RC-2049"
                  className="h-12 w-full rounded-xl border border-gray-medium bg-white px-4 text-[15px] outline-none focus:border-primary"
                />
                <button
                  onClick={findPatient}
                  disabled={!patientId.trim()}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white active:opacity-90 disabled:opacity-40"
                >
                  Find patient
                </button>
              </div>
            )}
          </div>
        )}

        {stage === "confirm" && (
          <div className="mt-6 rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
            <p className="mb-3 text-[13px] font-bold uppercase tracking-wide text-gray-helper">
              Confirm patient profile
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-white">
                JF
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-ink">Julie Fernandez</p>
                <p className="text-[12px] text-gray-helper">Status: Waiting for sync</p>
              </div>
            </div>
            <button
              onClick={confirm}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white active:opacity-90"
            >
              Send sync request
            </button>
          </div>
        )}

        {stage === "waiting" && (
          <div className="mt-6 rounded-2xl border border-gray-medium bg-white p-6 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning-light text-warning">
              <Icon path={paths.clipboardList} className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[15px] font-bold text-ink">Patient waits for sync approval</p>
            <p className="mt-1 text-[13px] leading-5 text-gray-helper">
              Julie has been notified to approve the sync. This usually takes a moment.
            </p>
          </div>
        )}

        {stage === "synced" && (
          <div className="mt-6 rounded-2xl border border-success/30 bg-success-light p-6 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
              <Icon path={paths.check} className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[15px] font-bold text-ink">Synced!</p>
            <p className="mt-1 text-[13px] leading-5 text-gray-helper">
              You can now track Julie's daily progress, action cards, and support her recovery.
            </p>
            <button
              onClick={finish}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white shadow-floating active:opacity-90"
            >
              Go to dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
