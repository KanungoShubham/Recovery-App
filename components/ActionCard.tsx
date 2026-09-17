"use client";

import type { ActionItem } from "@/lib/store";
import { Icon, paths } from "./icons";

const TYPE_META: Record<
  ActionItem["type"],
  { icon: string; bg: string; fg: string }
> = {
  medication: { icon: paths.pill, bg: "bg-primary/10", fg: "text-primary" },
  wound: { icon: paths.bandage, bg: "bg-danger-light", fg: "text-danger" },
  exercise: { icon: paths.activity, bg: "bg-success-light", fg: "text-success" },
  appointment: { icon: paths.calendar, bg: "bg-warning-light", fg: "text-warning" },
  checkin: { icon: paths.heart, bg: "bg-primary/10", fg: "text-primary" },
};

export function ActionCard({
  item,
  onToggle,
}: {
  item: ActionItem;
  onToggle: (id: string) => void;
}) {
  const meta = TYPE_META[item.type];
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-3 shadow-card transition-colors ${
        item.completed ? "border-gray-medium bg-white/60" : "border-gray-medium bg-white"
      }`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.fg}`}>
        <Icon path={meta.icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[14px] font-semibold leading-5 ${
            item.completed ? "text-gray-helper line-through" : "text-ink"
          }`}
        >
          {item.title}
        </p>
        <p className="mt-0.5 truncate text-[12px] leading-4 text-gray-helper">
          {item.subtitle}
        </p>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-primary">
          {item.time}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(item.id);
        }}
        aria-label={item.completed ? "Mark as not done" : "Mark as done"}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors active:opacity-70 ${
          item.completed
            ? "border-success bg-success text-white"
            : "border-gray-medium bg-white text-transparent"
        }`}
      >
        <Icon path={paths.check} className="h-4 w-4" />
      </button>
    </div>
  );
}
