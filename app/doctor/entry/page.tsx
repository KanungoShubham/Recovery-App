"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function DoctorEntryPage() {
  const router = useRouter();
  const { setRole, completeDoctorOnboarding } = useStore();
  const { push } = useToast();

  function signUp() {
    setRole("doctor");
    router.push("/doctor/onboarding");
  }

  function logIn() {
    setRole("doctor");
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
    push({ kind: "success", title: "Welcome back, Dr. Mehta!", message: "You're logged in." });
    router.push("/doctor/dashboard");
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Doctor & Clinician Access" subtitle="A separate, verified workspace for care teams" />

      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
        <div className="flex flex-col items-center rounded-2xl border border-gray-medium bg-white p-8 text-center shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
            <Icon path={paths.medkit} className="h-7 w-7" />
          </div>
          <p className="mt-4 text-[15px] font-bold text-ink">Recovery Companion for Clinicians</p>
          <p className="mt-1 text-[13px] leading-5 text-gray-helper">
            Review recovery plans, respond to patient queries, and manage appointments.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={signUp}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90"
        >
          Sign up as a doctor
        </button>
        <button
          onClick={logIn}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-gray-medium text-[14px] font-semibold text-ink active:opacity-80"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
