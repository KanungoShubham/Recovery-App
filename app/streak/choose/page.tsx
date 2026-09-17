"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { PLANTS, type PlantKind } from "@/lib/plant";

export default function ChoosePlantPage() {
  const router = useRouter();
  const { choosePlant } = useStore();
  const { push } = useToast();
  const [selected, setSelected] = useState<PlantKind | null>(null);
  const [name, setName] = useState("");

  function confirm() {
    if (!selected) return;
    choosePlant(selected, name.trim() || PLANTS[selected].label);
    push({
      kind: "success",
      title: "Your plant is growing!",
      message: `${name.trim() || PLANTS[selected].label} will grow as you complete your recovery plan.`,
    });
    router.back();
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Choose your plant" subtitle="It grows as you stay on track" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(PLANTS) as PlantKind[]).map((key) => {
            const p = PLANTS[key];
            const active = selected === key;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 bg-white p-4 shadow-card active:opacity-80 ${
                  active ? "border-primary" : "border-transparent"
                }`}
              >
                <span className="text-[36px] leading-none">{p.stages[2]}</span>
                <span className="text-[12px] font-bold text-ink">{p.label}</span>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-5 rounded-2xl bg-primary/5 p-4">
            <p className="text-[13px] font-semibold text-primary">{PLANTS[selected].meaning}</p>
            <label className="mb-1.5 mt-4 block text-[13px] font-semibold text-ink">
              Name your plant (optional)
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={PLANTS[selected].label}
              className="h-11 w-full rounded-xl border border-gray-medium bg-white px-3 text-[14px] outline-none focus:border-primary"
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={confirm}
          disabled={!selected}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90 disabled:opacity-40"
        >
          Start growing
        </button>
      </div>
    </div>
  );
}
