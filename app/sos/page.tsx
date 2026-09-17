"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

type Stage = "confirm" | "connecting" | "call" | "review" | "ended";

export default function SosPage() {
  const router = useRouter();
  const { state } = useStore();
  const { push } = useToast();

  const [stage, setStage] = useState<Stage>("confirm");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(false);

  useEffect(() => {
    if (stage !== "call") return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [stage]);

  function trigger() {
    setStage("connecting");
    push({ kind: "danger", title: "SOS call request sent", message: "Alerting a doctor who has treated you before." });
    window.setTimeout(() => {
      setStage("call");
      push({ kind: "success", title: "Doctor connected", message: `${state.doctor.name} accepted your call.` });
    }, 2200);
  }

  function endCall() {
    setStage("ended");
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  if (stage === "confirm") {
    return (
      <div className="flex h-full flex-col bg-danger">
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-white">
            <Icon path={paths.alertOctagon} className="h-10 w-10" />
          </div>
          <h1 className="mt-5 text-[24px] font-bold text-white">Trigger SOS?</h1>
          <p className="mt-2 text-[14px] leading-5 text-white/85">
            This will immediately connect you with an available doctor and notify your caregiver.
            Only use this for urgent medical concerns.
          </p>
        </div>
        <div className="px-6 pb-[max(24px,env(safe-area-inset-bottom))]">
          <button
            onClick={trigger}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-white text-[16px] font-bold text-danger shadow-floating active:opacity-90"
          >
            Call for help now
          </button>
          <button
            onClick={() => router.back()}
            className="mt-3 flex h-12 w-full items-center justify-center text-[14px] font-semibold text-white/85 active:opacity-70"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (stage === "connecting") {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-ink px-8 text-center">
        <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-white/10 text-white">
          <Icon path={paths.phone} className="h-9 w-9" />
        </div>
        <p className="mt-5 text-[18px] font-bold text-white">Connecting you to a doctor...</p>
        <p className="mt-1 text-[13px] text-white/60">Forwarded automatically if unanswered in 30s</p>
      </div>
    );
  }

  if (stage === "ended") {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-body px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-light text-success">
          <Icon path={paths.check} className="h-8 w-8" />
        </div>
        <p className="mt-4 text-[18px] font-bold text-ink">Call ended</p>
        <p className="mt-1 text-[13px] leading-5 text-gray-helper">
          A summary was sent to your caregiver and added to your recovery record.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white active:opacity-90"
        >
          Back to home
        </button>
      </div>
    );
  }

  // call + review
  return (
    <div className="flex h-full flex-col bg-ink text-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-[28px] font-bold">
          {state.doctor.name.split(" ").map((n) => n[0]).slice(-2).join("")}
        </div>
        <p className="mt-4 text-[18px] font-bold">{state.doctor.name}</p>
        <p className="text-[13px] text-white/60">{state.doctor.specialty}</p>
        <p className="mt-2 text-[13px] font-mono text-white/80">{mm}:{ss}</p>

        {stage === "review" && (
          <div className="mt-6 w-full rounded-2xl bg-white/10 p-4 text-left">
            <p className="text-[13px] font-bold text-white">Consult & review</p>
            <p className="mt-1 text-[13px] leading-5 text-white/80">
              "Based on what you've described, please rest and monitor your symptoms. I'm sending
              a note to your care team — reach out again if it gets worse."
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => push({ kind: "info", title: "Connecting to hospital", message: "Sharing your recovery record with the nearest partner hospital." })}
                className="flex h-10 w-full items-center justify-center rounded-xl bg-white/15 text-[12px] font-semibold text-white active:opacity-80"
              >
                Connect me to a hospital
              </button>
              <button
                onClick={() => push({ kind: "danger", title: "108 Emergency triggered", message: "Emergency services have been notified with your location." })}
                className="flex h-10 w-full items-center justify-center rounded-xl bg-danger text-[12px] font-semibold text-white active:opacity-80"
              >
                Trigger 108 emergency
              </button>
            </div>
          </div>
        )}

        {stage === "call" && (
          <button
            onClick={() => setStage("review")}
            className="mt-6 text-[12px] font-semibold text-white/70 underline active:opacity-70"
          >
            Doctor is reviewing your case...
          </button>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 px-6 pb-[max(28px,env(safe-area-inset-bottom))]">
        <button
          onClick={() => setMuted((m) => !m)}
          className={`flex h-14 w-14 items-center justify-center rounded-full ${muted ? "bg-white text-ink" : "bg-white/15 text-white"}`}
          aria-label="Mute"
        >
          <Icon path={paths.bell} className="h-5 w-5" />
        </button>
        <button
          onClick={endCall}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-danger text-white active:opacity-90"
          aria-label="End call"
        >
          <Icon path={paths.phone} className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCamera((c) => !c)}
          className={`flex h-14 w-14 items-center justify-center rounded-full ${camera ? "bg-white text-ink" : "bg-white/15 text-white"}`}
          aria-label="Camera"
        >
          <Icon path={paths.camera} className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
