"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function OtpPage() {
  return (
    <Suspense fallback={null}>
      <OtpPageInner />
    </Suspense>
  );
}

function OtpPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";
  const { state, verifyAccount } = useStore();
  const { push } = useToast();

  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const valid = code.trim().length === 6;

  function verify() {
    if (!valid) return;
    setVerifying(true);
    window.setTimeout(() => {
      verifyAccount(phone);
      setVerifying(false);

      const isReturningUser =
        state.role === "patient" || state.role === "caregiver"
          ? state.onboarded
          : false;

      if (isReturningUser) {
        push({ kind: "success", title: "Welcome back!", message: "You're logged in." });
        router.push("/dashboard");
      } else {
        push({ kind: "success", title: "Number verified", message: "Let's set up your account." });
        router.push("/onboarding/role");
      }
    }, 900);
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Verify your number" subtitle={`Enter the 6-digit code sent to +91 ${phone || "your phone"}`} />

      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">6-digit code</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          type="tel"
          inputMode="numeric"
          placeholder="000000"
          className="h-14 w-full rounded-xl border border-gray-medium bg-white px-4 text-center text-[24px] font-bold tracking-[0.5em] text-ink outline-none focus:border-primary"
        />
        <button
          onClick={() => push({ kind: "info", title: "Code resent", message: `A new code was sent to +91 ${phone}.` })}
          className="mt-4 w-full text-center text-[13px] font-semibold text-primary active:opacity-70"
        >
          Resend code
        </button>
      </div>

      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={verify}
          disabled={!valid || verifying}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90 disabled:opacity-40"
        >
          {verifying ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
