"use client";

export function OnboardingProgress({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <div className="px-5 pt-[max(16px,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold uppercase tracking-wide text-primary">{label}</p>
        <p className="text-[11px] font-semibold text-gray-helper">
          Step {step} of {total}
        </p>
      </div>
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-gray-medium"}`}
          />
        ))}
      </div>
    </div>
  );
}
