"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function QueryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { state, replyQuery } = useStore();
  const { push } = useToast();
  const [reply, setReply] = useState("");

  const query = useMemo(
    () => state.patientQueries.find((q) => q.id === params.id),
    [state.patientQueries, params.id]
  );

  if (!query) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Not found" />
        <p className="px-5 text-[14px] text-gray-helper">This query no longer exists.</p>
      </div>
    );
  }

  function send() {
    if (!reply.trim()) return;
    replyQuery(query!.id);
    push({
      kind: "success",
      title: "Reply sent",
      message: `${query!.patientName} will be notified.`,
    });
    router.push("/doctor/queue");
  }

  function scheduleCall() {
    push({
      kind: "info",
      title: "Call scheduled",
      message: `A call with ${query!.patientName} has been added to your appointments.`,
    });
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Patient Query" subtitle={query.patientName} onBack={() => router.push("/doctor/queue")} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-white">
              {query.patientName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-ink">{query.patientName}</p>
              <p className="text-[11px] text-gray-helper">{query.time}</p>
            </div>
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                query.urgency === "P0" ? "bg-danger text-white" : "bg-warning text-white"
              }`}
            >
              {query.urgency}
            </span>
          </div>
          <p className="mt-3 rounded-xl bg-body px-3 py-2.5 text-[13px] leading-5 text-ink">
            {query.message}
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-primary/5 p-4">
          <p className="flex items-center gap-1.5 text-[13px] font-bold text-primary">
            <Icon path={paths.activity} className="h-4 w-4" />
            AI Summary
          </p>
          <p className="mt-1.5 text-[12px] leading-5 text-gray-helper">
            Patient reports post-op discomfort consistent with expected recovery timeline.
            No red-flag symptoms detected — recommend reassurance and monitoring guidance.
          </p>
        </div>

        <button
          onClick={scheduleCall}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-medium bg-white text-[13px] font-semibold text-ink active:opacity-80"
        >
          <Icon path={paths.phone} className="h-4 w-4 text-primary" />
          Schedule a call instead
        </button>

        <div className="mt-5">
          <label className="mb-1.5 block text-[13px] font-semibold text-ink">Your reply</label>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
            placeholder="Type your response to the patient..."
            className="w-full resize-none rounded-xl border border-gray-medium bg-white px-3 py-2.5 text-[13px] outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={send}
          disabled={!reply.trim() || query.replied}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90 disabled:opacity-40"
        >
          <Icon path={paths.send} className="h-5 w-5" />
          {query.replied ? "Already replied" : "Send reply"}
        </button>
      </div>
    </div>
  );
}
