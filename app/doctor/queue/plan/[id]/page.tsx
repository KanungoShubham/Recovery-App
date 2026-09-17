"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function PlanApprovalDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { state, setPlanStatus } = useStore();
  const { push } = useToast();
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState<"info" | "reject" | null>(null);

  const plan = useMemo(
    () => state.planApprovals.find((p) => p.id === params.id),
    [state.planApprovals, params.id]
  );

  if (!plan) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Not found" />
        <p className="px-5 text-[14px] text-gray-helper">This ticket no longer exists.</p>
      </div>
    );
  }

  function approve() {
    setPlanStatus(plan!.id, "approved");
    push({
      kind: "success",
      title: "Plan approved",
      message: `${plan!.patientName}'s recovery plan is now visible to them.`,
    });
    router.push("/doctor/queue");
  }

  function requestInfo() {
    if (!note.trim()) return;
    setPlanStatus(plan!.id, "info_needed");
    push({
      kind: "warning",
      title: "Clarification requested",
      message: `Sent to ${plan!.patientName} — additional details required.`,
    });
    router.push("/doctor/queue");
  }

  function reject() {
    if (!note.trim()) return;
    setPlanStatus(plan!.id, "rejected");
    push({
      kind: "danger",
      title: "Plan rejected",
      message: `${plan!.patientName} has been notified with your reason.`,
    });
    router.push("/doctor/queue");
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Plan Approval" subtitle={plan.patientName} onBack={() => router.push("/doctor/queue")} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-[16px] font-bold text-white">
              {plan.patientName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-ink">{plan.patientName}</p>
              <p className="text-[12px] text-gray-helper">Age {plan.age} · {plan.condition}</p>
            </div>
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                plan.priority === "P0" ? "bg-danger text-white" : "bg-warning text-white"
              }`}
            >
              {plan.priority}
            </span>
          </div>
        </div>

        <p className="mb-2 mt-5 text-[13px] font-bold uppercase tracking-wide text-gray-helper">
          Attached Documents
        </p>
        <div className="space-y-2">
          {plan.documents.map((doc) => (
            <button
              key={doc}
              onClick={() => push({ kind: "info", title: "Opening document", message: doc })}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-medium bg-white px-3.5 py-3 text-left active:bg-body"
            >
              <Icon path={paths.fileText} className="h-4 w-4 text-primary" />
              <span className="flex-1 truncate text-[13px] font-medium text-ink">{doc}</span>
              <Icon path={paths.chevronRight} className="h-4 w-4 text-gray-helper" />
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-primary/5 p-4">
          <p className="flex items-center gap-1.5 text-[13px] font-bold text-primary">
            <Icon path={paths.activity} className="h-4 w-4" />
            AI Generated Holistic Recovery Plan
          </p>
          <p className="mt-1.5 text-[12px] leading-5 text-gray-helper">{plan.aiSummary}</p>
          <button
            onClick={() => push({ kind: "info", title: "Regenerating with AI", message: "Building an updated plan draft." })}
            className="mt-3 text-[12px] font-semibold text-primary active:opacity-70"
          >
            Regenerate with AI
          </button>
        </div>

        {showNote && (
          <div className="mt-5 rounded-2xl border border-gray-medium bg-white p-4">
            <p className="text-[13px] font-semibold text-ink">
              {showNote === "info" ? "What additional information is needed?" : "Reason for rejection"}
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Type your note to the patient..."
              className="mt-2 w-full resize-none rounded-xl border border-gray-medium bg-body px-3 py-2 text-[13px] outline-none focus:border-primary"
            />
            <button
              onClick={showNote === "info" ? requestInfo : reject}
              disabled={!note.trim()}
              className={`mt-3 flex h-11 w-full items-center justify-center rounded-xl text-[13px] font-bold text-white active:opacity-90 disabled:opacity-40 ${
                showNote === "info" ? "bg-warning" : "bg-danger"
              }`}
            >
              Send to patient
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={approve}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90"
        >
          <Icon path={paths.check} className="h-5 w-5" />
          Approve Plan
        </button>
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => setShowNote(showNote === "info" ? null : "info")}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-warning text-[13px] font-semibold text-warning active:opacity-80"
          >
            Ask clarification
          </button>
          <button
            onClick={() => setShowNote(showNote === "reject" ? null : "reject")}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-danger text-[13px] font-semibold text-danger active:opacity-80"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
