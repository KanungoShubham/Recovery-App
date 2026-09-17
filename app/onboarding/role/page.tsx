"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore, type Role } from "@/lib/store";
import { useToast } from "@/lib/toast";

const ROLES: { id: Exclude<Role, null>; title: string; desc: string; icon: string }[] = [
  { id: "doctor", title: "Doctor", desc: "Verify and guide patient recovery plans", icon: paths.fileText },
  { id: "patient", title: "Patient", desc: "Track your own recovery journey", icon: paths.heart },
  { id: "caregiver", title: "Caregiver", desc: "Support a patient through recovery", icon: paths.users },
];

export default function RolePage() {
  return (
    <Suspense fallback={null}>
      <RolePageInner />
    </Suspense>
  );
}

function RolePageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const isLogin = params.get("mode") === "login";
  const { state, setRole, completeDoctorOnboarding } = useStore();
  const { push } = useToast();
  const [selected, setSelected] = useState<Exclude<Role, null> | null>(null);

  function choose(id: Exclude<Role, null>) {
    setSelected(id);
  }

  function proceed(action: "signup" | "login") {
    if (!selected) return;
    setRole(selected);
    if (action === "login") {
      push({
        kind: "success",
        title: "Welcome back!",
        message: `Logged in as ${selected}.`,
      });
      if (selected === "doctor") {
        if (!state.doctorOnboarded) {
          completeDoctorOnboarding(
            {
              fullName: "Aditi Mehta",
              regNumber: "MCI-1234567",
              specialty: "Orthopedic Surgeon",
              hospital: "St. Mary's Hospital",
              language: "English",
            },
            "approved"
          );
        }
        router.push("/doctor/dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push(`/onboarding/signup?role=${selected}`);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Who's using the app?" subtitle="Choose how you'll continue" />
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
              </div>
              {active && (
                <div className="mt-3 flex gap-2 pl-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      proceed("signup");
                    }}
                    className="flex h-11 flex-1 items-center justify-center rounded-xl bg-primary text-[14px] font-semibold text-white active:opacity-90"
                  >
                    Sign up
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      proceed("login");
                    }}
                    className="flex h-11 flex-1 items-center justify-center rounded-xl bg-gray-medium text-[14px] font-semibold text-ink active:opacity-80"
                  >
                    Log in
                  </button>
                </div>
              )}
            </button>
          );
        })}
        {isLogin && (
          <p className="pt-2 text-center text-[12px] text-gray-helper">
            Pick a role above, then tap "Log in" to continue with demo data.
          </p>
        )}
      </div>
    </div>
  );
}
