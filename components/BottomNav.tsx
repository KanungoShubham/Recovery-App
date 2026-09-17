"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, paths } from "./icons";

const NAV_ITEMS = [
  { key: "sos", label: "SOS", icon: paths.alertOctagon, href: "/sos" },
  { key: "ask", label: "Ask", icon: paths.chatBubble, href: "/ask-doctor" },
  { key: "plan", label: "Plan", icon: paths.clipboardList, href: "/plan" },
  { key: "consult", label: "Consult", icon: paths.medkit, href: "/consult" },
  { key: "home", label: "Home", icon: paths.home, href: "/dashboard" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-gray-medium bg-white/95 px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="flex items-center justify-between">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const isSos = item.key === "sos";
          const iconColor = isSos ? "text-danger" : active ? "text-primary" : "text-gray-helper";
          const labelColor = isSos ? "text-danger" : active ? "text-primary" : "text-gray-helper";

          return (
            <Link
              key={item.key}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 active:opacity-70"
            >
              <Icon path={item.icon} className={`h-6 w-6 ${iconColor}`} />
              <span className={`text-[10px] font-medium ${labelColor}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
