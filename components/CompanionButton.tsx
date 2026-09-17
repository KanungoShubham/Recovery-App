"use client";

import Link from "next/link";
import { Icon, paths } from "./icons";

export function CompanionButton() {
  return (
    <Link
      href="/companion"
      aria-label="AI Companion"
      className="absolute bottom-[86px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-floating active:opacity-85"
    >
      <Icon path={paths.bot} className="h-6 w-6" />
    </Link>
  );
}
