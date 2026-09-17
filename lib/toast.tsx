"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

export type ToastKind = "success" | "info" | "warning" | "danger" | "reminder";

export type ToastInput = {
  title: string;
  message?: string;
  kind?: ToastKind;
  durationMs?: number;
};

type ToastItem = ToastInput & { id: number; leaving?: boolean };

type ToastContextValue = {
  push: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const KIND_STYLES: Record<
  ToastKind,
  { bg: string; ring: string; icon: string; iconBg: string }
> = {
  success: {
    bg: "bg-white",
    ring: "ring-success/15",
    icon: "M5 13l4 4L19 7",
    iconBg: "bg-success text-white",
  },
  info: {
    bg: "bg-white",
    ring: "ring-primary/15",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    iconBg: "bg-primary text-white",
  },
  warning: {
    bg: "bg-white",
    ring: "ring-warning/15",
    icon: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
    iconBg: "bg-warning text-white",
  },
  danger: {
    bg: "bg-white",
    ring: "ring-danger/15",
    icon: "M6 18L18 6M6 6l12 12",
    iconBg: "bg-danger text-white",
  },
  reminder: {
    bg: "bg-white",
    ring: "ring-primary/15",
    icon: "M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0",
    iconBg: "bg-primary text-white",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const push = useCallback(
    (toast: ToastInput) => {
      const id = ++idRef.current;
      const item: ToastItem = { kind: "info", durationMs: 3200, ...toast, id };
      setToasts((prev) => [...prev, item]);
      window.setTimeout(() => remove(id), item.durationMs);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-3 pt-[max(14px,env(safe-area-inset-top))]">
        {toasts.map((t) => {
          const style = KIND_STYLES[t.kind ?? "info"];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto w-full max-w-[400px] rounded-2xl ${style.bg} ring-1 ${style.ring} shadow-floating px-3 py-3 flex items-start gap-3 ${t.leaving ? "animate-toast-out" : "animate-toast-in"}`}
              role="status"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d={style.icon} />
                </svg>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[14px] font-semibold text-ink leading-5">
                  {t.title}
                </p>
                {t.message && (
                  <p className="mt-0.5 text-[13px] text-gray-helper leading-5">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="shrink-0 text-gray-helper active:opacity-60"
                aria-label="Dismiss"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
