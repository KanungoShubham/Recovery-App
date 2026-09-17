"use client";

import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="flex h-full flex-col bg-primary">
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden pb-6 pt-[max(24px,env(safe-area-inset-top))]">
        <Image
          src="/images/mascot-wave.png"
          alt="Recovery Companion mascot"
          width={260}
          height={260}
          priority
          className="relative z-10 h-auto w-[58%] max-w-[240px] drop-shadow-xl"
        />
      </div>

      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div className="rounded-[28px] bg-body px-6 pb-7 pt-8 shadow-2xl">
          <h1 className="text-[28px] font-bold leading-9 text-ink">
            Your recovery,
            <br />
            organized.
          </h1>
          <p className="mt-2 text-[14px] leading-5 text-gray-helper">
            Turn your discharge instructions into a simple recovery journey.
          </p>

          <Link
            href="/auth/phone"
            className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90"
          >
            Get started
          </Link>
          <Link
            href="/auth/login"
            className="mt-4 flex h-11 w-full items-center justify-center text-[14px] font-semibold text-primary active:opacity-70"
          >
            I already have an account
          </Link>
          <Link
            href="/doctor/entry"
            className="mt-2 flex h-8 w-full items-center justify-center text-[12px] font-medium text-gray-helper active:opacity-70"
          >
            Are you a doctor or clinician?&nbsp;<span className="font-bold text-primary">Sign in here</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
