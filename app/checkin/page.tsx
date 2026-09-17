"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useStore, type Mood } from "@/lib/store";
import { useToast } from "@/lib/toast";

const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: "great", emoji: "😊", label: "Calm / Good" },
  { id: "okay", emoji: "🙂", label: "Okay" },
  { id: "worried", emoji: "😟", label: "Worried" },
  { id: "uncomfortable", emoji: "😣", label: "Uncomfortable" },
  { id: "low", emoji: "😔", label: "Low" },
  { id: "overwhelmed", emoji: "😫", label: "Overwhelmed" },
];

const FOLLOWUPS: Record<Mood, { prompt: string; options: string[] }> = {
  great: { prompt: "That's good to hear.", options: ["Add an optional note", "Done"] },
  okay: {
    prompt: "Anything you'd like help with?",
    options: ["No, I'm okay", "I have a question", "Something feels different"],
  },
  worried: {
    prompt: "What's worrying you?",
    options: ["My symptoms", "My recovery progress", "Medication or treatment", "Upcoming appointment", "Something else"],
  },
  uncomfortable: {
    prompt: "What are you experiencing?",
    options: ["Pain", "Nausea", "Dizziness", "Difficulty moving", "Other"],
  },
  low: {
    prompt: "Would you like some support?",
    options: ["Talk to my caregiver", "Contact my doctor", "Tell the Companion", "Not right now"],
  },
  overwhelmed: {
    prompt: "Let's focus only on what needs your attention now.",
    options: ["Show primary action", "Ask someone for help", "Pause non-essential reminders"],
  },
};

const REINFORCEMENT: Record<Mood, string> = {
  great: "Glad you're feeling good — keep up the great work!",
  okay: "Thanks for checking in. We're here if anything changes.",
  worried: "Thanks for sharing — your care team has been made aware.",
  uncomfortable: "Noted. If it gets worse, use SOS any time.",
  low: "You're not alone in this — support has been notified.",
  overwhelmed: "Let's take it one step at a time. Non-essential reminders paused.",
};

export default function CheckInPage() {
  const router = useRouter();
  const { recordCheckIn } = useStore();
  const { push } = useToast();
  const [mood, setMood] = useState<Mood | null>(null);

  function finish() {
    if (!mood) return;
    recordCheckIn(mood);
    push({ kind: "success", title: "Check-in saved", message: REINFORCEMENT[mood] });
    router.back();
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="AI Companion" subtitle="How are you feeling right now?" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
        {!mood ? (
          <div className="grid grid-cols-2 gap-3">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-medium bg-white p-5 shadow-card active:opacity-80"
              >
                <span className="text-[32px] leading-none">{m.emoji}</span>
                <span className="text-[13px] font-semibold text-ink">{m.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-medium bg-white p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[28px] leading-none">{MOODS.find((m) => m.id === mood)!.emoji}</span>
              <p className="text-[15px] font-bold text-ink">{MOODS.find((m) => m.id === mood)!.label}</p>
            </div>
            <p className="text-[14px] leading-5 text-ink">{FOLLOWUPS[mood].prompt}</p>
            <div className="mt-4 space-y-2">
              {FOLLOWUPS[mood].options.map((opt) => (
                <button
                  key={opt}
                  onClick={finish}
                  className="flex h-11 w-full items-center justify-start rounded-xl border border-gray-medium bg-body px-4 text-left text-[13px] font-medium text-ink active:opacity-80"
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMood(null)}
              className="mt-4 w-full text-center text-[12px] font-semibold text-gray-helper active:opacity-70"
            >
              Back to moods
            </button>
          </div>
        )}
      </div>

      {mood && (
        <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
          <button
            onClick={finish}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-gray-medium text-[13px] font-semibold text-ink active:opacity-80"
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
}
