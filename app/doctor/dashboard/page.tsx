"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DoctorTopBar } from "@/components/DoctorTopBar";
import { DoctorBottomNav } from "@/components/DoctorBottomNav";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { state } = useStore();
  const { push } = useToast();

  useEffect(() => {
    if (state.role === "doctor" && !state.doctorOnboarded) {
      router.replace("/doctor/onboarding");
    }
  }, [state.role, state.doctorOnboarded, router]);

  const pendingPlans = state.planApprovals.filter((p) => p.status === "pending" || p.status === "info_needed");
  const openQueries = state.patientQueries.filter((q) => !q.replied);
  const requestedAppts = state.appointments.filter((a) => a.status === "pending");

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pb-4">
        <DoctorTopBar />

        <div className="px-5">
          <div className="grid grid-cols-3 gap-2.5">
            <Stat label="Weekly" value="18" sub="Consults" />
            <Stat label="Monthly" value="76" sub="Consults" />
            <Stat label="All time" value="612" sub="Consults" />
          </div>

          <button
            onClick={() =>
              push({ kind: "danger", title: "SOS line active", message: "You'll be notified instantly if a patient triggers SOS." })
            }
            className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-danger px-4 py-3.5 text-left text-white shadow-card active:opacity-90"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Icon path={paths.alertOctagon} className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold">SOS line</p>
              <p className="text-[12px] text-white/85">No active emergency calls right now</p>
            </div>
          </button>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-ink">Active Tickets</h2>
            <Link href="/doctor/queue" className="text-[12px] font-semibold text-primary">
              View all
            </Link>
          </div>

          <div className="mt-3 space-y-2.5">
            {pendingPlans.slice(0, 2).map((p) => (
              <Link key={p.id} href={`/doctor/queue/plan/${p.id}`} className="block">
                <TicketRow
                  priority={p.priority}
                  title={`Plan approval — ${p.patientName}`}
                  sub={p.condition}
                  time={p.submittedAgo}
                  icon={paths.clipboardList}
                />
              </Link>
            ))}
            {openQueries.slice(0, 2).map((q) => (
              <Link key={q.id} href={`/doctor/queue/query/${q.id}`} className="block">
                <TicketRow
                  priority={q.urgency}
                  title={`Query — ${q.patientName}`}
                  sub={q.message}
                  time={q.time}
                  icon={paths.chatBubble}
                />
              </Link>
            ))}
            {pendingPlans.length === 0 && openQueries.length === 0 && (
              <EmptyRow text="No open tickets. You're all caught up." />
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-ink">Appointments</h2>
            <Link href="/doctor/appointments" className="text-[12px] font-semibold text-primary">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-2.5">
            {requestedAppts.length === 0 && state.appointments.length === 0 && (
              <EmptyRow text="No appointments scheduled." />
            )}
            {state.appointments.slice(0, 2).map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-gray-medium bg-white p-3.5 shadow-card">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon path={paths.calendar} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-ink">{a.patientName}</p>
                  <p className="truncate text-[12px] text-gray-helper">{a.reason}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    a.status === "approved"
                      ? "bg-success-light text-success"
                      : a.status === "rejected"
                      ? "bg-danger-light text-danger"
                      : "bg-warning-light text-warning"
                  }`}
                >
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DoctorBottomNav />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-gray-medium bg-white p-3 text-center shadow-card">
      <p className="text-[18px] font-bold text-ink">{value}</p>
      <p className="text-[10px] font-medium text-gray-helper">{sub}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-primary">{label}</p>
    </div>
  );
}

function TicketRow({
  priority,
  title,
  sub,
  time,
  icon,
}: {
  priority: "P0" | "P1";
  title: string;
  sub: string;
  time: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-medium bg-white p-3.5 shadow-card">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          priority === "P0" ? "bg-danger-light text-danger" : "bg-warning-light text-warning"
        }`}
      >
        <Icon path={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
              priority === "P0" ? "bg-danger text-white" : "bg-warning text-white"
            }`}
          >
            {priority}
          </span>
          <p className="truncate text-[14px] font-semibold text-ink">{title}</p>
        </div>
        <p className="mt-0.5 truncate text-[12px] text-gray-helper">{sub}</p>
      </div>
      <span className="shrink-0 text-[11px] font-medium text-gray-helper">{time}</span>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-medium bg-white/60 p-4 text-center text-[13px] text-gray-helper">
      {text}
    </div>
  );
}
