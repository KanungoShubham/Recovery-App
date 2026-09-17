"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { Icon, paths } from "./icons";

export function DoctorBottomNav() {
  const pathname = usePathname();
  const { state } = useStore();
  const openTickets =
    state.planApprovals.filter((p) => p.status === "pending" || p.status === "info_needed").length +
    state.patientQueries.filter((q) => !q.replied).length;

  const ITEMS = [
    { key: "dashboard", label: "Dashboard", icon: paths.home, href: "/doctor/dashboard" },
    { key: "queue", label: "Queue", icon: paths.clipboardList, href: "/doctor/queue" },
    { key: "appointments", label: "Appointments", icon: paths.calendar, href: "/doctor/appointments" },
    { key: "profile", label: "Profile", icon: paths.user, href: "/doctor/profile" },
  ];

  return (
    <nav className="border-t border-gray-medium bg-white/95 px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="flex items-center justify-between">
        {ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 active:opacity-70"
            >
              <div className="relative">
                <Icon
                  path={item.icon}
                  className={`h-6 w-6 ${active ? "text-primary" : "text-gray-helper"}`}
                />
                {item.key === "queue" && openTickets > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
                    {openTickets}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-gray-helper"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
