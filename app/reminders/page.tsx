"use client";

import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore, type ReminderItem } from "@/lib/store";
import { useToast } from "@/lib/toast";

const KIND_META: Record<ReminderItem["kind"], { bg: string; fg: string; icon: string }> = {
  success: { bg: "bg-success-light", fg: "text-success", icon: paths.check },
  info: { bg: "bg-primary/10", fg: "text-primary", icon: paths.calendar },
  warning: { bg: "bg-warning-light", fg: "text-warning", icon: paths.bell },
  reminder: { bg: "bg-primary/10", fg: "text-primary", icon: paths.bell },
};

const SAMPLE_PUSHES: { title: string; message: string; kind: ReminderItem["kind"] }[] = [
  { title: "Medication reminder", message: "Amoxicillin 500mg is due now.", kind: "reminder" },
  { title: "Appointment in 1 hour", message: "Dr. Mehta · City Hospital, Room 4B", kind: "info" },
  { title: "Great progress!", message: "You've completed 5 days in a row.", kind: "success" },
];

export default function RemindersPage() {
  const { state, markAllRead, addReminder } = useStore();
  const { push } = useToast();

  function sendTestPush() {
    const sample = SAMPLE_PUSHES[Math.floor(Math.random() * SAMPLE_PUSHES.length)];
    push(sample);
    addReminder(sample);
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        title="Reminders"
        subtitle={`${state.reminders.filter((r) => !r.read).length} unread`}
        right={
          <button
            onClick={markAllRead}
            className="mt-1.5 text-[12px] font-semibold text-primary active:opacity-70"
          >
            Mark all read
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-2">
        <button
          onClick={sendTestPush}
          className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-[13px] font-semibold text-primary active:opacity-80"
        >
          <Icon path={paths.send} className="h-4 w-4" />
          Simulate a push notification
        </button>

        <div className="space-y-2.5">
          {state.reminders.map((r) => {
            const meta = KIND_META[r.kind];
            return (
              <div
                key={r.id}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 shadow-card ${
                  r.read ? "border-gray-medium bg-white" : "border-primary/30 bg-primary/5"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.bg} ${meta.fg}`}>
                  <Icon path={meta.icon} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[14px] font-semibold leading-5 text-ink">{r.title}</p>
                    {!r.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 text-[12px] leading-5 text-gray-helper">{r.message}</p>
                  <p className="mt-1 text-[11px] font-medium text-gray-helper">{r.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
