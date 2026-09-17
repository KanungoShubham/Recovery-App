"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { PatientTopBar } from "@/components/PatientTopBar";
import { ActionCard } from "@/components/ActionCard";
import { CompanionButton } from "@/components/CompanionButton";
import { Icon, paths } from "@/components/icons";
import { useStore, type ActionItem } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { plantEmoji } from "@/lib/plant";

export default function DashboardPage() {
  const router = useRouter();
  const { state, toggleAction, markMissed, addReminder } = useStore();
  const { push } = useToast();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!state.onboarded && !state.role) {
      router.replace("/");
    }
  }, [state.onboarded, state.role, router]);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const t = window.setTimeout(() => {
      push({
        kind: "reminder",
        title: "Time for wound dressing",
        message: "Change your dressing and keep the area dry.",
      });
      addReminder({
        title: "Time for wound dressing",
        message: "Change your dressing and keep the area dry.",
        kind: "reminder",
      });
    }, 4000);
    return () => window.clearTimeout(t);
  }, [push, addReminder]);

  const focus = useMemo(
    () => state.actions.find((a) => !a.completed),
    [state.actions]
  );
  const rest = useMemo(
    () => state.actions.filter((a) => a.id !== focus?.id),
    [state.actions, focus]
  );

  function handleTaken(id: string) {
    const title = toggleAction(id);
    if (title) {
      push({ kind: "success", title: "Nice work!", message: `${title} marked complete.` });
    }
  }

  function handleMissed(id: string) {
    const title = markMissed(id);
    if (title) {
      push({ kind: "warning", title: "Marked as missed", message: `${title} — let your care team know if you need help.` });
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="overflow-y-auto pb-4">
        <PatientTopBar name={state.name} />

        <div className="flex items-center gap-2.5 px-5 pb-4">
          <Link
            href="/streak/choose"
            className="flex flex-1 items-center gap-2.5 rounded-2xl border border-gray-medium bg-white px-3.5 py-2.5 shadow-card active:opacity-80"
          >
            <span className="text-[22px] leading-none">{plantEmoji(state.streak.plant, state.streak.days)}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-ink">
                {state.streak.plant ? state.streak.plantName : "Choose your plant"}
              </p>
              <p className="text-[11px] text-gray-helper">{state.streak.days} day streak</p>
            </div>
          </Link>
          <Link
            href="/ask-doctor"
            className="flex h-[52px] items-center gap-1.5 rounded-2xl bg-primary/10 px-3.5 text-primary active:opacity-80"
          >
            <Icon path={paths.chatBubble} className="h-4 w-4" />
            <span className="text-[12px] font-bold">Ask Doctor</span>
          </Link>
        </div>

        <div className="px-5">
          {focus ? (
            <FocusCard
              key={focus.id}
              action={focus}
              onTaken={() => handleTaken(focus.id)}
              onMissed={() => handleMissed(focus.id)}
            />
          ) : (
            <div className="rounded-3xl bg-success-light p-6 text-center shadow-card">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
                <Icon path={paths.check} className="h-6 w-6" />
              </div>
              <p className="mt-3 text-[16px] font-bold text-ink">All done for today!</p>
              <p className="mt-1 text-[13px] text-gray-helper">
                Great job staying on top of your recovery plan.
              </p>
            </div>
          )}
        </div>

        {rest.length > 0 && (
          <div className="px-5 pt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-ink">Rest of today's plan</h2>
              <span className="text-[12px] font-medium text-gray-helper">
                {state.actions.filter((a) => a.completed).length}/{state.actions.length} done
              </span>
            </div>
            <div className="space-y-3">
              {rest.map((a) => (
                <Link key={a.id} href={`/action/${a.id}`} className="block">
                  <ActionCard item={a} onToggle={() => handleTaken(a.id)} />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="px-5 pt-6">
          <div className="rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-light text-warning">
                <Icon path={paths.calendar} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">Next appointment</p>
                <p className="text-[12px] text-gray-helper">
                  {state.doctor.name} · {state.doctor.nextVisit}
                </p>
              </div>
              <Link href="/care-team" className="text-[12px] font-semibold text-primary">
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
      <CompanionButton />
      <BottomNav />
    </div>
  );
}

function FocusCard({
  action,
  onTaken,
  onMissed,
}: {
  action: ActionItem;
  onTaken: () => void;
  onMissed: () => void;
}) {
  const { push } = useToast();
  const items = action.items ?? [{ id: action.id, label: action.subtitle, dose: "" }];

  return (
    <div className="overflow-hidden rounded-3xl shadow-floating">
      <div className="rounded-t-3xl bg-ink px-5 py-3 text-center">
        <p className="text-[12px] font-bold uppercase tracking-wide text-white/90">
          {action.meta}
        </p>
      </div>
      <div className="bg-white p-5">
        {action.missed ? (
          <>
            <p className="text-center text-[20px] font-bold leading-7 text-ink">
              {action.title} wasn't recorded
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {items.map((it) => (
                <span
                  key={it.id}
                  className="flex items-center gap-1 rounded-full bg-success-light px-3 py-1.5 text-[12px] font-semibold text-success"
                >
                  <Icon path={paths.pill} className="h-3.5 w-3.5" />
                  {it.dose ? `${it.dose} ${it.label}` : it.label}
                </span>
              ))}
            </div>
            <div className="mt-5 border-t border-gray-medium pt-4">
              <div className="flex gap-3">
                <button
                  onClick={onMissed}
                  className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-primary text-[14px] font-semibold text-primary active:opacity-80"
                >
                  <Icon path={paths.x} className="h-4 w-4" />
                  Missed
                </button>
                <button
                  onClick={onTaken}
                  className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary text-[14px] font-semibold text-white active:opacity-90"
                >
                  <Icon path={paths.check} className="h-4 w-4" />
                  Taken
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-center text-[20px] font-bold leading-7 text-ink">{action.title}</p>
            <div className="mt-3 flex justify-center">
              <span className="flex items-center gap-1 rounded-full bg-success-light px-3 py-1.5 text-[12px] font-semibold text-success">
                <Icon path={paths.pill} className="h-3.5 w-3.5" />
                {items.length} {action.type === "medication" ? (items.length === 1 ? "Tablet" : "Tablets") : items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="mt-4 divide-y divide-gray-medium border-t border-gray-medium">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon path={paths.pill} className="h-5 w-5" />
                  </div>
                  {it.dose && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-success-light px-2 py-0.5 text-[11px] font-semibold text-success">
                      1
                    </span>
                  )}
                  <p className="flex-1 text-[14px] font-medium text-ink">{it.label}</p>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-gray-medium" />
                </div>
              ))}
            </div>

            <button
              onClick={onTaken}
              className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90"
            >
              <Icon path={paths.check} className="h-5 w-5" />
              {action.type === "medication" ? "Taken" : "Mark complete"}
            </button>
            <div className="mt-3 flex items-center justify-center gap-4">
              <button
                onClick={() =>
                  push({
                    kind: "info",
                    title: "Need help?",
                    message: "Connecting you with your care team.",
                  })
                }
                className="text-center text-[13px] font-medium text-gray-helper active:opacity-70"
              >
                Need help identifying them?
              </button>
              <span className="h-3 w-px bg-gray-medium" />
              <button
                onClick={onMissed}
                className="text-center text-[13px] font-medium text-danger active:opacity-70"
              >
                Didn't take this?
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
