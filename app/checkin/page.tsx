"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, paths } from "@/components/icons";
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

  function skip() {
    router.back();
  }

  return (
    <div className="flex h-full flex-col bg-primary">
      <div className="flex items-center justify-between px-5 pt-[max(16px,env(safe-area-inset-top))]">
        <span className="text-[12px] font-bold uppercase tracking-wide text-white/70">
          AI Companion
        </span>
        <button
          onClick={skip}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white active:opacity-70"
        >
          <Icon path={paths.x} className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-2 text-center">
        {mood ? (
          <span className="text-[56px] leading-none">{MOODS.find((m) => m.id === mood)!.emoji}</span>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-white">
            <Icon path={paths.bot} className="h-8 w-8" />
          </div>
        )}
        <h1 className="mt-4 text-[22px] font-bold text-white">
          {mood ? MOODS.find((m) => m.id === mood)!.label : "How are you feeling right now?"}
        </h1>
        {!mood && (
          <p className="mt-1 text-[13px] text-white/70">Tap the feeling closest to how you feel today.</p>
        )}
      </div>

      <div className="rounded-t-[28px] bg-body px-5 pb-6 pt-6">
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
            <p className="text-[14px] font-semibold leading-5 text-ink">{FOLLOWUPS[mood].prompt}</p>
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

        <button
          onClick={skip}
          className="mt-4 flex h-11 w-full items-center justify-center text-[13px] font-semibold text-gray-helper active:opacity-70"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
