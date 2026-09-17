"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";

type Msg = { id: string; from: "user" | "bot"; text: string };

const PROMPT_CHIPS = [
  "I don't understand this instruction",
  "I don't have the medicine",
  "I'm feeling unwell",
  "I need someone's help",
  "Check in on how I'm feeling",
  "Ask about a missed action",
];

const BOT_REPLIES: Record<string, string> = {
  "I don't understand this instruction":
    "No worries — let me explain it simply. Which part is confusing? You can also tap the task card for step-by-step details.",
  "I don't have the medicine":
    "I've flagged this to your caregiver and pharmacy contact. In the meantime, avoid skipping — I can help you find alternatives if needed.",
  "I'm feeling unwell":
    "I'm sorry to hear that. Let's do a quick check-in so I can understand how you're feeling and get you the right support.",
  "I need someone's help":
    "I've notified your caregiver. If this is urgent, use the SOS button so a doctor can reach you right away.",
  "Ask about a missed action":
    "That's okay — missing one task won't break your streak. Want me to reschedule it or mark it as skipped?",
};

export default function CompanionPage() {
  const router = useRouter();
  const { state } = useStore();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m0",
      from: "bot",
      text: `Hi ${state.name.split(" ")[0] || "there"}, I'm your recovery companion. How can I help today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    if (!text.trim()) return;

    if (text === "Check in on how I'm feeling") {
      setMessages((m) => [...m, { id: `u${Date.now()}`, from: "user", text }]);
      window.setTimeout(() => router.push("/checkin"), 400);
      return;
    }

    const userMsg: Msg = { id: `u${Date.now()}`, from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    window.setTimeout(() => {
      const reply =
        BOT_REPLIES[text] ??
        "Got it — I've noted that. Your care team can follow up if this needs more attention.";
      setMessages((m) => [...m, { id: `b${Date.now()}`, from: "bot", text: reply }]);
    }, 600);
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="AI Companion" subtitle="Always here to help" onBack={() => router.back()} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-3">
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-5 ${
                  m.from === "user"
                    ? "rounded-br-md bg-primary text-white"
                    : "rounded-bl-md bg-white text-ink shadow-card"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-medium bg-white px-5 pt-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-3">
          {PROMPT_CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => send(c)}
              className="shrink-0 whitespace-nowrap rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[12px] font-semibold text-primary active:opacity-70"
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pb-[max(12px,env(safe-area-inset-bottom))]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Type a message..."
            className="h-11 flex-1 rounded-full border border-gray-medium bg-body px-4 text-[14px] text-ink outline-none focus:border-primary"
          />
          <button
            onClick={() => send(input)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white active:opacity-90"
            aria-label="Send"
          >
            <Icon path={paths.send} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
