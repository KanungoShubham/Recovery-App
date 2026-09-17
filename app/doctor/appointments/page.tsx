"use client";

import { DoctorBottomNav } from "@/components/DoctorBottomNav";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function DoctorAppointmentsPage() {
  const { state, setAppointmentStatus } = useStore();
  const { push } = useToast();

  function approve(id: string) {
    const name = setAppointmentStatus(id, "approved");
    if (name) push({ kind: "success", title: "Appointment approved", message: `Added to ${name}'s task cards.` });
  }

  function reject(id: string) {
    const name = setAppointmentStatus(id, "rejected");
    if (name) push({ kind: "info", title: "Appointment rejected", message: `${name} has been notified.` });
  }

  const requested = state.appointments.filter((a) => a.kind === "requested" && a.status === "pending");
  const scheduled = state.appointments.filter((a) => !(a.kind === "requested" && a.status === "pending"));

  return (
    <div className="flex h-full flex-col">
      <Header title="Appointments" subtitle="Requests & scheduled consultations" showBack={false} />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {requested.length > 0 && (
          <>
            <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-gray-helper">
              Requested by patients
            </p>
            <div className="mb-6 space-y-2.5">
              {requested.map((a) => (
                <div key={a.id} className="rounded-2xl border border-warning/30 bg-warning-light/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning text-white">
                      <Icon path={paths.calendar} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-ink">{a.patientName}</p>
                      <p className="text-[12px] text-gray-helper">{a.reason}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-warning">{a.time}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => reject(a.id)}
                      className="flex h-10 flex-1 items-center justify-center rounded-xl border border-gray-medium bg-white text-[13px] font-semibold text-ink active:opacity-80"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approve(a.id)}
                      className="flex h-10 flex-1 items-center justify-center rounded-xl bg-primary text-[13px] font-semibold text-white active:opacity-90"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-gray-helper">
          Schedule
        </p>
        <div className="space-y-2.5">
          {scheduled.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-gray-medium bg-white p-3.5 shadow-card">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon path={paths.calendar} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">{a.patientName}</p>
                <p className="truncate text-[12px] text-gray-helper">{a.reason}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[12px] font-semibold text-ink">{a.time}</p>
                <span
                  className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                    a.status === "approved" ? "bg-success-light text-success" : "bg-danger-light text-danger"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            </div>
          ))}
          {scheduled.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-medium bg-white/60 p-4 text-center text-[13px] text-gray-helper">
              No scheduled appointments yet.
            </div>
          )}
        </div>
      </div>
      <DoctorBottomNav />
    </div>
  );
}
