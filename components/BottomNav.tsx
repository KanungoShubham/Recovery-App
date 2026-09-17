"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { Icon, paths } from "./icons";

export function BottomNav() {
  const pathname = usePathname();
  const { state } = useStore();
  const { push } = useToast();
  const unread = state.reminders.filter((r) => !r.read).length;

  const NAV_ITEMS = [
    {
      key: "sos",
      label: "SOS",
      icon: paths.alertOctagon,
      color: "text-danger",
      onClick: () =>
        push({
          kind: "danger",
          title: "SOS alert sent",
          message: "Your care team and emergency contact have been notified.",
        }),
    },
    { key: "ask", label: "Ask", icon: paths.chatBubble, href: "/reminders" },
    { key: "plan", label: "Plan", icon: paths.clipboardList, href: "/dashboard" },
    { key: "consult", label: "Consult", icon: paths.medkit, href: "/care-team" },
    { key: "home", label: "Home", icon: paths.home, href: "/dashboard" },
  ] as const;

  return (
    <nav className="border-t border-gray-medium bg-white/95 px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="flex items-center justify-between">
        {NAV_ITEMS.map((item) => {
          const active = "href" in item && item.href === "/dashboard"
            ? pathname === "/dashboard" && item.key === "home"
            : "href" in item && pathname?.startsWith(item.href);
          const iconColor =
            item.key === "sos" ? "text-danger" : active ? "text-primary" : "text-gray-helper";
          const content = (
            <>
              <div className="relative">
                <Icon path={item.icon} className={`h-6 w-6 ${iconColor}`} />
                {item.key === "ask" && unread > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  item.key === "sos" ? "text-danger" : active ? "text-primary" : "text-gray-helper"
                }`}
              >
                {item.label}
              </span>
            </>
          );

          if ("href" in item) {
            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 active:opacity-70"
              >
                {content}
              </Link>
            );
          }
          return (
            <button
              key={item.key}
              onClick={item.onClick}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 active:opacity-70"
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
