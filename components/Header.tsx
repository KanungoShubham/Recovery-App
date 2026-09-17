"use client";

import { useRouter } from "next/navigation";
import { Icon, paths } from "./icons";

export function Header({
  title,
  subtitle,
  onBack,
  showBack = true,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="flex items-start justify-between px-5 pb-2 pt-[max(16px,env(safe-area-inset-top))]">
      <div className="flex items-start gap-3">
        {showBack && (
          <button
            onClick={() => (onBack ? onBack() : router.back())}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-card active:opacity-70"
            aria-label="Back"
          >
            <Icon path={paths.chevronLeft} className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-[20px] font-bold leading-6 text-ink">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-[13px] leading-5 text-gray-helper">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}
