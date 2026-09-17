"use client";

import { useState } from "react";
import Link from "next/link";
import { DoctorBottomNav } from "@/components/DoctorBottomNav";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";

const STATUS_LABEL: Record<string, string> = {
  pending: "Approval pending",
  info_needed: "Need more information",
  approved: "Approved",
  rejected: "Rejected",
};

export default function DoctorQueuePage() {
  const { state } = useStore();
  const [tab, setTab] = useState<"plans" | "queries">("plans");

  return (
    <div className="flex h-full flex-col">
      <Header title="Active Tickets" subtitle="Plan approvals & patient queries" showBack={false} />

      <div className="px-5">
        <div className="flex gap-2 rounded-xl bg-gray-medium/50 p-1">
          <button
            onClick={() => setTab("plans")}
            className={`h-10 flex-1 rounded-lg text-[13px] font-semibold transition-colors ${
              tab === "plans" ? "bg-white text-primary shadow-card" : "text-gray-helper"
            }`}
          >
            Plan Approvals ({state.planApprovals.filter((p) => p.status !== "approved" && p.status !== "rejected").length})
          </button>
          <button
            onClick={() => setTab("queries")}
            className={`h-10 flex-1 rounded-lg text-[13px] font-semibold transition-colors ${
              tab === "queries" ? "bg-white text-primary shadow-card" : "text-gray-helper"
            }`}
          >
            Queries ({state.patientQueries.filter((q) => !q.replied).length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {tab === "plans" ? (
          <div className="space-y-2.5">
            {state.planApprovals.map((p) => (
              <Link key={p.id} href={`/doctor/queue/plan/${p.id}`} className="block">
                <div className="rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          p.priority === "P0" ? "bg-danger text-white" : "bg-warning text-white"
                        }`}
                      >
                        {p.priority}
                      </span>
                      <p className="text-[14px] font-bold text-ink">{p.patientName}</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-gray-helper">{p.submittedAgo}</span>
                  </div>
                  <p className="mt-1 text-[12px] leading-5 text-gray-helper">{p.condition}</p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      p.status === "pending"
                        ? "bg-warning-light text-warning"
                        : p.status === "info_needed"
                        ? "bg-danger-light text-danger"
                        : p.status === "approved"
                        ? "bg-success-light text-success"
                        : "bg-gray-medium text-ink"
                    }`}
                  >
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {state.patientQueries.map((q) => (
              <Link key={q.id} href={`/doctor/queue/query/${q.id}`} className="block">
                <div className="rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          q.urgency === "P0" ? "bg-danger text-white" : "bg-warning text-white"
                        }`}
                      >
                        {q.urgency}
                      </span>
                      <p className="text-[14px] font-bold text-ink">{q.patientName}</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-gray-helper">{q.time}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-gray-helper">{q.message}</p>
                  <span
                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      q.replied ? "bg-success-light text-success" : "bg-warning-light text-warning"
                    }`}
                  >
                    <Icon path={q.replied ? paths.check : paths.chatBubble} className="h-3 w-3" />
                    {q.replied ? "Replied" : "Awaiting reply"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <DoctorBottomNav />
    </div>
  );
}
