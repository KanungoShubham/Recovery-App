"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function CareTeamPage() {
  const { state, inviteCaregiver } = useStore();
  const { push } = useToast();
  const [showInvite, setShowInvite] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [contactMode, setContactMode] = useState<"mobile" | "email">("mobile");
  const [contact, setContact] = useState("");

  function callDoctor() {
    push({ kind: "info", title: "Calling...", message: `${state.doctor.name} · ${state.doctor.phone}` });
  }

  const contactValid =
    contactMode === "mobile"
      ? contact.replace(/\D/g, "").length >= 10
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

  function sendInvite() {
    if (!name.trim() || !contactValid) return;
    const fullContact = contactMode === "mobile" ? `+91 ${contact.trim()}` : contact.trim();
    inviteCaregiver(name.trim(), relation.trim() || "Caregiver", fullContact);
    push({
      kind: "success",
      title: "Invite sent",
      message: `${name} will receive an invite via ${contactMode === "mobile" ? "SMS/WhatsApp" : "email"} at ${fullContact}.`,
    });
    setName("");
    setRelation("");
    setContact("");
    setShowInvite(false);
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Care Team" subtitle="Your doctor and support circle" />

      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-2">
        <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-gray-helper">
          Doctor
        </p>
        <div className="rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-[16px] font-bold text-white">
              {state.doctor.name.split(" ").map((n) => n[0]).slice(-2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-ink">{state.doctor.name}</p>
              <p className="text-[12px] text-gray-helper">{state.doctor.specialty}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-body px-3 py-2">
            <Icon path={paths.calendar} className="h-4 w-4 text-primary" />
            <span className="text-[12px] font-medium text-ink">Next visit: {state.doctor.nextVisit}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={callDoctor}
              className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary text-[13px] font-semibold text-white active:opacity-90"
            >
              <Icon path={paths.phone} className="h-4 w-4" />
              Call
            </button>
            <button
              onClick={() => push({ kind: "info", title: "Message sent", message: "Your care team will reply within 24 hours." })}
              className="flex h-11 flex-1 items-center justify-center rounded-xl bg-gray-medium text-[13px] font-semibold text-ink active:opacity-80"
            >
              Message
            </button>
          </div>
        </div>

        <div className="mt-6 mb-2 flex items-center justify-between">
          <p className="text-[13px] font-bold uppercase tracking-wide text-gray-helper">
            Caregivers
          </p>
          <button
            onClick={() => setShowInvite((v) => !v)}
            className="flex items-center gap-1 text-[12px] font-semibold text-primary active:opacity-70"
          >
            <Icon path={paths.plus} className="h-4 w-4" />
            Invite
          </button>
        </div>

        {showInvite && (
          <div className="mb-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Caregiver's name"
              className="mb-2 h-11 w-full rounded-xl border border-gray-medium bg-white px-3 text-[14px] outline-none focus:border-primary"
            />
            <input
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="Relationship (e.g. Son, Spouse)"
              className="mb-3 h-11 w-full rounded-xl border border-gray-medium bg-white px-3 text-[14px] outline-none focus:border-primary"
            />

            <div className="mb-2 flex gap-2 rounded-xl bg-white p-1">
              <button
                onClick={() => {
                  setContactMode("mobile");
                  setContact("");
                }}
                className={`h-9 flex-1 rounded-lg text-[12px] font-semibold transition-colors ${
                  contactMode === "mobile" ? "bg-primary text-white" : "text-gray-helper"
                }`}
              >
                Mobile number
              </button>
              <button
                onClick={() => {
                  setContactMode("email");
                  setContact("");
                }}
                className={`h-9 flex-1 rounded-lg text-[12px] font-semibold transition-colors ${
                  contactMode === "email" ? "bg-primary text-white" : "text-gray-helper"
                }`}
              >
                Email
              </button>
            </div>

            {contactMode === "mobile" ? (
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-gray-medium bg-white px-3 focus-within:border-primary">
                <span className="text-[14px] font-medium text-gray-helper">+91</span>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  className="h-11 w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-gray-helper"
                />
              </div>
            ) : (
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                type="email"
                placeholder="caregiver@example.com"
                className="mb-3 h-11 w-full rounded-xl border border-gray-medium bg-white px-3 text-[14px] outline-none focus:border-primary"
              />
            )}

            <button
              onClick={sendInvite}
              disabled={!name.trim() || !contactValid}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-primary text-[13px] font-semibold text-white active:opacity-90 disabled:opacity-40"
            >
              Send invite
            </button>
          </div>
        )}

        <div className="space-y-2.5">
          {state.caregivers.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-2xl border border-gray-medium bg-white p-3.5 shadow-card"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-light text-[13px] font-bold text-success">
                {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">{c.name}</p>
                <p className="truncate text-[12px] text-gray-helper">
                  {c.relation}
                  {c.contact ? ` · ${c.contact}` : ""}
                </p>
              </div>
              <span className="rounded-full bg-success-light px-2 py-1 text-[10px] font-bold uppercase text-success">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
