"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PatientTopBar } from "@/components/PatientTopBar";
import { BottomNav } from "@/components/BottomNav";
import { PreferencesStep } from "@/components/PreferencesStep";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

type Stage = "idle" | "uploading" | "review" | "details" | "ready";

export default function SetupPage() {
  return (
    <Suspense fallback={null}>
      <SetupPageInner />
    </Suspense>
  );
}

function SetupPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get("name") ?? "";
  const { completeOnboarding, setPreferences } = useStore();
  const { push } = useToast();

  const [showPrefs, setShowPrefs] = useState(true);
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState("");
  const [procedure, setProcedure] = useState("");

  function startUpload() {
    setStage("uploading");
    window.setTimeout(() => {
      setFileName("Medical Document.pdf");
      setStage("review");
      push({
        kind: "success",
        title: "Records received",
        message: "Your doctor is reviewing your medical records.",
      });
      window.setTimeout(() => {
        setStage("details");
        push({
          kind: "warning",
          title: "Additional details needed",
          message: "Your doctor needs a bit more information.",
        });
      }, 3000);
    }, 1400);
  }

  function submitDetails() {
    if (!procedure.trim()) return;
    setStage("ready");
    push({
      kind: "reminder",
      title: "Recovery plan approved!",
      message: "Your day-to-day plan is ready to go.",
    });
  }

  function finish() {
    completeOnboarding(name, procedure || "Knee Replacement Surgery", "");
    push({
      kind: "reminder",
      title: `Welcome, ${name.split(" ")[0] || "there"}!`,
      message: "Your recovery plan for today is ready.",
    });
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
        <h1 className="text-[20px] font-bold text-ink">Recovery Plan Setup</h1>
        <p className="mt-1 text-[13px] leading-5 text-gray-helper">
          Lorem ipsum fames etiam lectus nibh et posuere rhoncus sit?
        </p>

        <div className="mt-6">
          <Step
            icon={paths.upload}
            state={stage === "idle" || stage === "uploading" ? "active" : "done"}
            connector
          >
            <p className="text-[15px] font-bold text-ink">Upload Medical Records</p>
            {(stage === "idle" || stage === "uploading") && (
              <>
                <p className="mt-2 text-[13px] leading-5 text-gray-helper">
                  Add your medical details or sync via ABHA. Recovery Companion turns
                  your prescriptions into smart daily reminders, vital tracking
                  prompts, and progress milestones.
                </p>
                <button
                  onClick={startUpload}
                  disabled={stage === "uploading"}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[14px] font-bold text-white active:opacity-90 disabled:opacity-60"
                >
                  <Icon path={paths.upload} className="h-4 w-4" />
                  {stage === "uploading" ? "Uploading..." : "Upload Document"}
                </button>
                <p className="mt-2 text-center text-[11px] text-gray-helper">
                  PDF, JPG or PNG · up to 150 MB
                </p>
              </>
            )}
            {(stage === "review" || stage === "details" || stage === "ready") && (
              <>
                <div className="mt-1 flex items-center gap-3 rounded-xl bg-body px-3 py-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger-light text-danger">
                    <Icon path={paths.fileText} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">{fileName}</p>
                    <p className="text-[11px] text-gray-helper">150 MB</p>
                  </div>
                  <Icon path={paths.check} className="h-4 w-4 shrink-0 text-success" />
                </div>
                <button
                  onClick={() => push({ kind: "info", title: "Documents", message: fileName })}
                  className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-[13px] font-bold text-white active:opacity-90"
                >
                  View Documents
                </button>
              </>
            )}
          </Step>

          <Step
            icon={paths.clipboardList}
            state={stage === "review" ? "active" : stage === "details" || stage === "ready" ? "done" : "idle"}
            connector
          >
            <p className="text-[15px] font-bold text-ink">Recovery Plan Preparation</p>
            {stage === "review" && (
              <p className="mt-2 text-[13px] leading-5 text-gray-helper">
                Your medical records are currently being reviewed by your doctor.
                Once approved, your personalized recovery schedule, alerts, and
                vital milestones will automatically activate.
              </p>
            )}
          </Step>

          <Step
            icon={paths.fileText}
            state={stage === "details" ? "active" : stage === "ready" ? "done" : "idle"}
            connector
          >
            <p className="text-[15px] font-bold text-ink">Additional Details Needed</p>
            {stage === "details" && (
              <>
                <p className="mt-2 text-[13px] leading-5 text-gray-helper">
                  Your doctor reviewed your initial submission but needs a few more
                  details before approving your Recovery plan.
                </p>
                <input
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  placeholder="e.g. Appendectomy, fracture..."
                  className="mt-3 h-11 w-full rounded-xl border border-gray-medium bg-white px-3 text-[14px] text-ink outline-none focus:border-primary"
                />
                <button
                  onClick={submitDetails}
                  disabled={!procedure.trim()}
                  className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-[13px] font-bold text-white active:opacity-90 disabled:opacity-40"
                >
                  Add Details
                </button>
              </>
            )}
          </Step>

          <Step icon={paths.check} state={stage === "ready" ? "active" : "idle"}>
            <p className="text-[15px] font-bold text-ink">Plan Ready, All Set</p>
            {stage === "ready" && (
              <>
                <p className="mt-2 text-[13px] leading-5 text-gray-helper">
                  Your recovery plan is approved and ready. We'll guide you through
                  each day, one step at a time.
                </p>
                <button
                  onClick={finish}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white shadow-floating active:opacity-90"
                >
                  Enter my recovery plan
                </button>
              </>
            )}
          </Step>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function Step({
  icon,
  state,
  connector,
  children,
}: {
  icon: string;
  state: "idle" | "active" | "done";
  connector?: boolean;
  children: React.ReactNode;
}) {
  const badgeStyle =
    state === "done"
      ? "bg-warning text-white"
      : state === "active"
      ? "bg-warning text-white"
      : "bg-gray-medium text-gray-helper";

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${badgeStyle}`}>
          <Icon path={state === "done" ? paths.check : icon} className="h-5 w-5" />
        </div>
        {connector && <div className="mt-1 w-0.5 flex-1 rounded-full bg-gray-medium" style={{ minHeight: 24 }} />}
      </div>
      <div
        className={`mb-4 flex-1 rounded-2xl border p-4 ${
          state === "active" ? "border-primary/20 bg-white shadow-card" : "border-gray-medium bg-white/60"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
