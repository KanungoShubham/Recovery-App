"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

const QUERY_TYPES = [
  "Clarify an instruction",
  "Report a problem/side effect",
  "Request plan change",
  "Ask about missed action",
  "General recovery question",
];

export default function AskDoctorPage() {
  const router = useRouter();
  const { submitQuery } = useStore();
  const { push } = useToast();
  const [type, setType] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function send() {
    if (!type || !message.trim()) return;
    submitQuery(type, message.trim());
    setSent(true);
    push({
      kind: "success",
      title: "Query sent",
      message: "Status: Delivered — your doctor typically replies within a few hours.",
    });
    window.setTimeout(() => router.push("/care-team"), 1200);
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Ask Doctor" subtitle="Send a question to your care team" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-gray-helper">
          Query type
        </p>
        <div className="flex flex-wrap gap-2">
          {QUERY_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-3 py-2 text-[12px] font-semibold transition-colors ${
                type === t ? "bg-primary text-white" : "bg-white border border-gray-medium text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <p className="mb-1.5 mt-5 text-[13px] font-semibold text-ink">Your message</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Type, or use a suggested question..."
          className="w-full resize-none rounded-xl border border-gray-medium bg-white px-3 py-2.5 text-[13px] outline-none focus:border-primary"
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => push({ kind: "info", title: "Voice input", message: "Demo only — no backend connected." })}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-medium bg-white text-[12px] font-semibold text-ink active:opacity-80"
          >
            <Icon path={paths.phone} className="h-4 w-4 text-primary" />
            Speak
          </button>
          <button
            onClick={() => push({ kind: "info", title: "Attach", message: "Demo only — no backend connected." })}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-medium bg-white text-[12px] font-semibold text-ink active:opacity-80"
          >
            <Icon path={paths.fileText} className="h-4 w-4 text-primary" />
            Attach
          </button>
        </div>
      </div>

      <div className="border-t border-gray-medium bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={send}
          disabled={!type || !message.trim() || sent}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90 disabled:opacity-40"
        >
          <Icon path={paths.send} className="h-5 w-5" />
          {sent ? "Sent" : "Send to doctor"}
        </button>
      </div>
    </div>
  );
}
