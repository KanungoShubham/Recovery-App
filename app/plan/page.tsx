"use client";

import { useState } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { ActionCard } from "@/components/ActionCard";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

type View = "daily" | "weekly" | "monthly";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PlanPage() {
  const { state, toggleAction } = useStore();
  const { push } = useToast();
  const [view, setView] = useState<View>("daily");

  const completed = state.actions.filter((a) => a.completed).length;

  function handleToggle(id: string) {
    const title = toggleAction(id);
    if (title) push({ kind: "success", title: "Nice work!", message: `${title} marked complete.` });
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Recovery Plan" subtitle={`Day ${state.day} · ${state.procedure}`} showBack={false} />

      <div className="px-5">
        <div className="flex gap-2 rounded-xl bg-gray-medium/50 p-1">
          {(["daily", "weekly", "monthly"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`h-10 flex-1 rounded-lg text-[13px] font-semibold capitalize transition-colors ${
                view === v ? "bg-white text-primary shadow-card" : "text-gray-helper"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {view === "daily" && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-ink">Today's plan</h2>
              <span className="text-[12px] font-medium text-gray-helper">
                {completed}/{state.actions.length} done
              </span>
            </div>
            <div className="space-y-3">
              {state.actions.map((a) => (
                <Link key={a.id} href={`/action/${a.id}`} className="block">
                  <ActionCard item={a} onToggle={() => handleToggle(a.id)} />
                </Link>
              ))}
            </div>
          </>
        )}

        {view === "weekly" && (
          <div className="space-y-3">
            {WEEKDAYS.map((day, i) => {
              const isToday = i === 0;
              const dayDone = isToday ? completed : Math.min(state.actions.length, Math.max(0, state.actions.length - i));
              return (
                <div
                  key={day}
                  className={`flex items-center gap-3 rounded-2xl border p-3.5 shadow-card ${
                    isToday ? "border-primary/30 bg-primary/5" : "border-gray-medium bg-white"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl ${
                      isToday ? "bg-primary text-white" : "bg-body text-ink"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase leading-3">{day}</span>
                    <span className="text-[13px] font-bold leading-4">{i + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-ink">
                      {isToday ? "Today" : `${state.actions.length} tasks scheduled`}
                    </p>
                    <p className="text-[12px] text-gray-helper">
                      {dayDone}/{state.actions.length} tasks {isToday ? "completed" : i < 1 ? "completed" : "planned"}
                    </p>
                  </div>
                  <Icon path={paths.chevronRight} className="h-4 w-4 shrink-0 text-gray-helper" />
                </div>
              );
            })}
          </div>
        )}

        {view === "monthly" && (
          <div>
            <div className="rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
              <p className="mb-3 text-[13px] font-bold text-ink">
                Recovery progress — Day {state.day} of 42
              </p>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-medium">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, Math.round((state.day / 42) * 100))}%` }}
                />
              </div>
              <p className="mt-2 text-[12px] text-gray-helper">
                {Math.min(100, Math.round((state.day / 42) * 100))}% through your recovery plan
              </p>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }).map((_, i) => {
                const dayNum = i + 1;
                const status = dayNum < state.day ? "done" : dayNum === state.day ? "today" : "upcoming";
                return (
                  <div
                    key={i}
                    className={`flex aspect-square items-center justify-center rounded-lg text-[11px] font-semibold ${
                      status === "done"
                        ? "bg-success-light text-success"
                        : status === "today"
                        ? "bg-primary text-white"
                        : "bg-white border border-gray-medium text-gray-helper"
                    }`}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-center text-[11px] text-gray-helper">
              Green = completed · Blue = today · Grey = upcoming
            </p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
