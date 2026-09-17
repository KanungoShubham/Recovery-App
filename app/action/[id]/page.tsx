"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

const TYPE_LABEL: Record<string, string> = {
  medication: "Medication",
  wound: "Wound care",
  exercise: "Exercise",
  appointment: "Appointment",
  checkin: "Check-in",
};

export default function ActionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { state, toggleAction } = useStore();
  const { push } = useToast();

  const item = useMemo(
    () => state.actions.find((a) => a.id === params.id),
    [state.actions, params.id]
  );

  if (!item) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Not found" />
        <p className="px-5 text-[14px] text-gray-helper">This task no longer exists.</p>
      </div>
    );
  }

  function handleComplete() {
    if (!item) return;
    const wasIncomplete = !item.completed;
    const completedTitle = toggleAction(item.id);
    if (wasIncomplete && completedTitle) {
      push({ kind: "success", title: "Nice work!", message: `${completedTitle} marked complete.` });
    } else {
      push({ kind: "info", title: "Marked as not done", message: item.title });
    }
    router.push("/dashboard");
  }

  return (
    <div className="flex h-full flex-col">
      <Header title={TYPE_LABEL[item.type]} onBack={() => router.push("/dashboard")} />
      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
        <div className="rounded-2xl border border-gray-medium bg-white p-5 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon path={paths.pill} className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-[20px] font-bold leading-6 text-ink">{item.title}</h2>
          <p className="mt-2 text-[14px] leading-5 text-gray-helper">{item.subtitle}</p>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-body px-3 py-2">
            <Icon path={paths.calendar} className="h-4 w-4 text-primary" />
            <span className="text-[13px] font-medium text-ink">Scheduled for {item.time}</span>
          </div>

          <div
            className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2 ${
              item.completed ? "bg-success-light text-success" : "bg-warning-light text-warning"
            }`}
          >
            <Icon path={item.completed ? paths.check : paths.bell} className="h-4 w-4" />
            <span className="text-[13px] font-semibold">
              {item.completed ? "Completed today" : "Not completed yet"}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-primary/5 p-4">
          <p className="text-[13px] font-semibold text-primary">Instructions</p>
          <p className="mt-1 text-[12px] leading-5 text-gray-helper">
            Follow your care team's instructions closely. If you experience
            unusual pain, swelling, or fever, contact your doctor right away.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={handleComplete}
          className={`flex h-14 w-full items-center justify-center rounded-2xl text-[16px] font-semibold text-white shadow-floating active:opacity-90 ${
            item.completed ? "bg-gray-helper" : "bg-primary"
          }`}
        >
          {item.completed ? "Mark as not done" : "Mark as complete"}
        </button>
      </div>
    </div>
  );
}
