"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { PLANTS, plantStage, plantEmoji, type PlantKind } from "@/lib/plant";

const STAGE_LABELS = ["Seedling", "Sprouting", "Growing", "Flourishing"];
const STAGE_DAYS = [0, 3, 7, 14];

export default function GrowPlantPage() {
  const router = useRouter();
  const { state, hydrated } = useStore();

  useEffect(() => {
    if (hydrated && !state.streak.plant) router.replace("/streak/choose");
  }, [hydrated, state.streak.plant, router]);

  if (!hydrated || !state.streak.plant) return null;

  const plant = state.streak.plant as PlantKind;
  const days = state.streak.days;
  const stage = plantStage(days);
  const isMax = stage === STAGE_DAYS.length - 1;
  const nextThreshold = isMax ? STAGE_DAYS[stage] : STAGE_DAYS[stage + 1];
  const prevThreshold = STAGE_DAYS[stage];
  const progressPct = isMax
    ? 100
    : Math.min(100, Math.round(((days - prevThreshold) / (nextThreshold - prevThreshold)) * 100));

  return (
    <div className="flex h-full flex-col">
      <Header title={state.streak.plantName || PLANTS[plant].label} subtitle="Your recovery plant" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="rounded-3xl border border-gray-medium bg-white p-6 text-center shadow-card">
          <span className="text-[72px] leading-none">{plantEmoji(plant, days)}</span>
          <p className="mt-3 text-[16px] font-bold text-ink">
            {STAGE_LABELS[stage]} · Day {days}
          </p>
          <p className="mt-1 text-[12px] text-gray-helper">{PLANTS[plant].meaning}</p>

          <div className="mt-5">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-medium">
              <div className="h-full rounded-full bg-success transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-gray-helper">
              {isMax
                ? "Fully grown — keep going to maintain your streak!"
                : `${nextThreshold - days > 0 ? nextThreshold - days : 0} day${
                    nextThreshold - days === 1 ? "" : "s"
                  } to ${STAGE_LABELS[stage + 1]}`}
            </p>
          </div>
        </div>

        <p className="mb-2 mt-6 text-[13px] font-bold uppercase tracking-wide text-gray-helper">
          Growth milestones
        </p>
        <div className="overflow-hidden rounded-2xl border border-gray-medium bg-white shadow-card">
          {STAGE_LABELS.map((label, i) => {
            const reached = days >= STAGE_DAYS[i];
            return (
              <div
                key={label}
                className={`flex items-center gap-3 px-4 py-3.5 ${
                  i !== STAGE_LABELS.length - 1 ? "border-b border-gray-medium" : ""
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[16px] ${
                    reached ? "bg-success-light" : "bg-gray-medium/60"
                  }`}
                >
                  {reached ? PLANTS[plant].stages[i] : "🔒"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[14px] font-semibold ${reached ? "text-ink" : "text-gray-helper"}`}>{label}</p>
                  <p className="text-[12px] text-gray-helper">Day {STAGE_DAYS[i]}+</p>
                </div>
                {reached && <Icon path={paths.check} className="h-4 w-4 shrink-0 text-success" />}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => router.push("/streak/choose")}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-xl border border-gray-medium bg-white text-[13px] font-semibold text-ink active:opacity-80"
        >
          Choose a different plant
        </button>
      </div>
    </div>
  );
}
