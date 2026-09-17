"use client";

import { useState } from "react";
import { PatientTopBar } from "./PatientTopBar";
import type { AppState } from "@/lib/store";

type Prefs = AppState["preferences"];

const TOGGLES: { key: keyof Prefs; label: string; desc: string }[] = [
  { key: "largeText", label: "Large text", desc: "Bigger font size across the app" },
  { key: "voiceMode", label: "Voice mode", desc: "Hear instructions read aloud" },
  { key: "screenReader", label: "Screen reader mode", desc: "Optimized for assistive tech" },
  { key: "strongVibration", label: "Strong vibration", desc: "For reminders and alerts" },
];

export function PreferencesStep({
  name,
  onDone,
}: {
  name: string;
  onDone: (prefs: Prefs) => void;
}) {
  const [prefs, setPrefs] = useState<Prefs>({
    largeText: false,
    voiceMode: false,
    screenReader: false,
    strongVibration: true,
  });

  function toggle(key: keyof Prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div className="flex h-full flex-col">
      <PatientTopBar name={name || "there"} />
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <h1 className="text-[20px] font-bold text-ink">Set your preferences</h1>
        <p className="mt-1 text-[13px] leading-5 text-gray-helper">
          Optional accessibility settings — you can change these anytime.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-medium bg-white shadow-card">
          {TOGGLES.map((t, i) => (
            <div
              key={t.key}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i !== TOGGLES.length - 1 ? "border-b border-gray-medium" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">{t.label}</p>
                <p className="text-[12px] text-gray-helper">{t.desc}</p>
              </div>
              <button
                onClick={() => toggle(t.key)}
                aria-label={t.label}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  prefs[t.key] ? "bg-primary" : "bg-gray-medium"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    prefs[t.key] ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={() => onDone(prefs)}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90"
        >
          Continue
        </button>
        <button
          onClick={() => onDone(prefs)}
          className="mt-3 flex h-10 w-full items-center justify-center text-[13px] font-semibold text-gray-helper active:opacity-70"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
