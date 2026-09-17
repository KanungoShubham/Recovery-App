"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function LoginPage() {
  const router = useRouter();
  const { state, verifyAccount } = useStore();
  const { push } = useToast();

  const [tab, setTab] = useState<"otp" | "password">("otp");
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function afterLogin() {
    verifyAccount(phone || email);
    const hasAccount =
      (state.role === "patient" || state.role === "caregiver") && state.onboarded;
    const isDoctor = state.role === "doctor" && state.doctorOnboarded;

    push({ kind: "success", title: "Welcome back!", message: "You're logged in." });
    if (isDoctor) router.push("/doctor/dashboard");
    else if (hasAccount) router.push("/dashboard");
    else router.push("/onboarding/role");
  }

  function sendOtp() {
    if (phone.replace(/\D/g, "").length < 10) return;
    setCodeSent(true);
    push({ kind: "info", title: "Code sent", message: `We sent a code to ${phone}.` });
  }

  function submitOtp() {
    if (code.trim().length !== 6) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      afterLogin();
    }, 800);
  }

  function submitPassword() {
    if (!email.trim() || password.length < 6) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      afterLogin();
    }, 800);
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Log in" subtitle="Session expired? Log back in with OTP or your password." />

      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
        <div className="mb-5 flex gap-2 rounded-xl bg-gray-medium/50 p-1">
          <button
            onClick={() => setTab("otp")}
            className={`h-10 flex-1 rounded-lg text-[13px] font-semibold transition-colors ${
              tab === "otp" ? "bg-white text-primary shadow-card" : "text-gray-helper"
            }`}
          >
            Log in with OTP
          </button>
          <button
            onClick={() => setTab("password")}
            className={`h-10 flex-1 rounded-lg text-[13px] font-semibold transition-colors ${
              tab === "password" ? "bg-white text-primary shadow-card" : "text-gray-helper"
            }`}
          >
            Password
          </button>
        </div>

        {tab === "otp" ? (
          <>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink">Phone number</label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-medium bg-white px-4 focus-within:border-primary">
              <span className="text-[15px] font-medium text-gray-helper">+91</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="numeric"
                placeholder="98765 43210"
                className="h-12 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-gray-helper"
              />
            </div>

            {!codeSent ? (
              <button
                onClick={sendOtp}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white active:opacity-90"
              >
                Send code
              </button>
            ) : (
              <>
                <label className="mb-1.5 mt-4 block text-[13px] font-semibold text-ink">6-digit code</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  type="tel"
                  inputMode="numeric"
                  placeholder="000000"
                  className="h-14 w-full rounded-xl border border-gray-medium bg-white px-4 text-center text-[22px] font-bold tracking-[0.5em] text-ink outline-none focus:border-primary"
                />
              </>
            )}
          </>
        ) : (
          <>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink">Email address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="mb-4 h-12 w-full rounded-xl border border-gray-medium bg-white px-4 text-[15px] text-ink outline-none placeholder:text-gray-helper focus:border-primary"
            />
            <label className="mb-1.5 block text-[13px] font-semibold text-ink">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Your password"
              className="h-12 w-full rounded-xl border border-gray-medium bg-white px-4 text-[15px] text-ink outline-none placeholder:text-gray-helper focus:border-primary"
            />
          </>
        )}
      </div>

      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={tab === "otp" ? submitOtp : submitPassword}
          disabled={submitting || (tab === "otp" ? code.trim().length !== 6 : !email.trim() || password.length < 6)}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90 disabled:opacity-40"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </div>
    </div>
  );
}
