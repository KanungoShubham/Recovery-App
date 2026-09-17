"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";

export default function PhoneEntryPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const valid = phone.replace(/\D/g, "").length >= 10;

  function sendOtp() {
    if (!valid) return;
    router.push(`/auth/otp?phone=${encodeURIComponent(phone)}&mode=signup`);
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Enter your phone number" subtitle="We'll send a one-time code to verify it's you" />

      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
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
        <p className="mt-3 text-[12px] leading-5 text-gray-helper">
          By continuing you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>

      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={sendOtp}
          disabled={!valid}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90 disabled:opacity-40"
        >
          Send code
        </button>
      </div>
    </div>
  );
}
