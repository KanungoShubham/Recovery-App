"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore, type Role } from "@/lib/store";

const ROLES: { id: Exclude<Role, "doctor" | null>; title: string; desc: string; icon: string }[] = [
  { id: "patient", title: "Patient", desc: "Track your own recovery journey", icon: paths.heart },
  { id: "caregiver", title: "Caregiver", desc: "Support a patient through recovery", icon: paths.users },
];

export default function RolePage() {
  const router = useRouter();
  const { setRole } = useStore();
  const [selected, setSelected] = useState<"patient" | "caregiver" | null>(null);

  function choose(id: "patient" | "caregiver") {
    setSelected(id);
  }

  function proceed() {
    if (!selected) return;
    setRole(selected);
    router.push(selected === "patient" ? "/onboarding/setup" : "/onboarding/caregiver-setup");
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Who's using the app?" subtitle="Choose how you'll continue" showBack={false} />
      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-6 pt-3">
        {ROLES.map((r) => {
          const active = selected === r.id;
          return (
            <button
              key={r.id}
              onClick={() => choose(r.id)}
              className={`w-full rounded-2xl border-2 bg-white p-4 text-left shadow-card transition-colors ${
                active ? "border-primary" : "border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon path={r.icon} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold text-ink">{r.title}</p>
                  <p className="text-[13px] leading-5 text-gray-helper">{r.desc}</p>
                </div>
                {active && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Icon path={paths.check} className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={proceed}
          disabled={!selected}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90 disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
