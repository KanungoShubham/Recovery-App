"use client";

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

const DATES = ["Today", "Tomorrow", "Wed, 18 Sep", "Thu, 19 Sep"];
const SLOTS = ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM", "5:00 PM"];

export default function ConsultPage() {
  const { state, requestAppointment } = useStore();
  const { push } = useToast();

  const [booking, setBooking] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function confirmBooking() {
    if (!date || !slot) return;
    requestAppointment(`${date}, ${slot}`, "Consultation requested by patient");
    setConfirmed(true);
    push({ kind: "success", title: "Appointment requested", message: `${date} at ${slot} — awaiting doctor confirmation.` });
  }

  function reset() {
    setBooking(false);
    setDate(null);
    setSlot(null);
    setConfirmed(false);
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Consult" subtitle="Book or manage appointments" showBack={false} />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {!booking ? (
          <>
            <div className="rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-white">
                  {state.doctor.name.split(" ").map((n) => n[0]).slice(-2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-ink">{state.doctor.name}</p>
                  <p className="text-[12px] text-gray-helper">{state.doctor.specialty}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-body px-3 py-2">
                <Icon path={paths.calendar} className="h-4 w-4 text-primary" />
                <span className="text-[12px] font-medium text-ink">Next visit: {state.doctor.nextVisit}</span>
              </div>
              <button
                onClick={() => setBooking(true)}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[13px] font-bold text-white active:opacity-90"
              >
                <Icon path={paths.plus} className="h-4 w-4" />
                Book an appointment
              </button>
            </div>

            <p className="mb-2 mt-6 text-[13px] font-bold uppercase tracking-wide text-gray-helper">
              Your appointments
            </p>
            <div className="space-y-2.5">
              {state.appointments.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-medium bg-white/60 p-4 text-center text-[13px] text-gray-helper">
                  No appointments yet.
                </div>
              )}
              {state.appointments.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-gray-medium bg-white p-3.5 shadow-card">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon path={paths.calendar} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-ink">{a.time}</p>
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
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : confirmed ? (
          <div className="mt-4 rounded-2xl border border-success/30 bg-success-light p-6 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
              <Icon path={paths.check} className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[15px] font-bold text-ink">Appointment scheduled</p>
            <p className="mt-1 text-[13px] leading-5 text-gray-helper">
              {date}, {slot} with {state.doctor.name}. You'll get a reminder 1 day and 1 hour before.
            </p>
            <button
              onClick={reset}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-[13px] font-bold text-white active:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="mt-2">
            <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-gray-helper">Pick a date</p>
            <div className="mb-5 flex flex-wrap gap-2">
              {DATES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDate(d)}
                  className={`rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                    date === d ? "bg-primary text-white" : "bg-white border border-gray-medium text-ink"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-gray-helper">Pick a time slot</p>
            <div className="flex flex-wrap gap-2">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                    slot === s ? "bg-primary text-white" : "bg-white border border-gray-medium text-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {booking && !confirmed && (
        <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
          <button
            onClick={confirmBooking}
            disabled={!date || !slot}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90 disabled:opacity-40"
          >
            Confirm appointment
          </button>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
