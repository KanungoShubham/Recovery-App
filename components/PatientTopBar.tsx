"use client";

import Link from "next/link";
import { Icon, paths } from "./icons";
import { useToast } from "@/lib/toast";

function greetingWord() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function PatientTopBar({ name }: { name: string }) {
  const { push } = useToast();
  const firstName = name.split(" ")[0] || "there";
  const initial = firstName.charAt(0).toUpperCase() || "P";

  return (
    <div className="flex items-center justify-between px-5 pb-4 pt-[max(16px,env(safe-area-inset-top))]">
      <Link href="/profile" className="flex items-center gap-3 active:opacity-70">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-[16px] font-bold text-white">
          {initial}
        </div>
        <div>
          <p className="text-[16px] font-bold leading-5 text-ink">
            {greetingWord()}, {firstName}!
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-gray-helper">
            <Icon path={paths.user} className="h-3 w-3" />
            Patient
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={() => push({ kind: "info", title: "Recovery Plan", message: "Opening your plan overview." })}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-success-light text-success active:opacity-70"
          aria-label="Plan"
        >
          <Icon path={paths.leaf} className="h-4 w-4" />
        </button>
        <button
          onClick={() => push({ kind: "info", title: "Care Circle", message: "Manage who supports your recovery." })}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary active:opacity-70"
          aria-label="Care circle"
        >
          <Icon path={paths.userPlus} className="h-4 w-4" />
        </button>
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-medium/60 text-ink active:opacity-70"
          aria-label="Profile menu"
        >
          <Icon path={paths.menu} className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
