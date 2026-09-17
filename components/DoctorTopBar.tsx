"use client";

import Link from "next/link";
import { Icon, paths } from "./icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export function DoctorTopBar() {
  const { state } = useStore();
  const { push } = useToast();
  const name = state.doctorProfile.fullName || "Doctor";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const verified = state.doctorProfile.verified === "approved";

  return (
    <div className="flex items-center justify-between px-5 pb-4 pt-[max(16px,env(safe-area-inset-top))]">
      <Link href="/doctor/profile" className="flex items-center gap-3 active:opacity-70">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white">
          {initials || "DR"}
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-[16px] font-bold leading-5 text-ink">
            Dr. {name.split(" ").slice(-1)[0] || "Doctor"}
            {verified && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success text-white">
                <Icon path={paths.check} className="h-2.5 w-2.5" />
              </span>
            )}
          </p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-helper">
            {state.doctorProfile.specialty || "Specialist"}
          </p>
        </div>
      </Link>
      <button
        onClick={() => push({ kind: "info", title: "Notifications", message: "You're all caught up." })}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary active:opacity-70"
        aria-label="Notifications"
      >
        <Icon path={paths.bell} className="h-4 w-4" />
      </button>
    </div>
  );
}
