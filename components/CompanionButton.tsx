"use client";

import Link from "next/link";

export function CompanionButton() {
  return (
    <Link
      href="/checkin"
      aria-label="AI Companion check-in"
      className="absolute bottom-[86px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-2xl shadow-floating active:opacity-85"
    >
      <span>🤖</span>
    </Link>
  );
}
