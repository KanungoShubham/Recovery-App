"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { plantEmoji } from "@/lib/plant";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDischargeDate(day: number) {
  const d = new Date(Date.now() - Math.max(day - 1, 0) * 86400000);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const { state, reset } = useStore();
  const { push } = useToast();

  const completed = state.actions.filter((a) => a.completed).length;
  const pct = state.actions.length
    ? Math.round((completed / state.actions.length) * 100)
    : 0;
  const initials = (state.name || "Guest User")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleLogout() {
    push({ kind: "info", title: "Signed out", message: "See you soon!" });
    reset();
    window.setTimeout(() => router.replace("/"), 400);
  }

  function notify(label: string) {
    push({ kind: "info", title: label, message: "Demo only — no backend connected." });
  }

  const sections: {
    heading: string;
    rows: { icon: string; label: string; sub: string; href?: string }[];
  }[] = [
    {
      heading: "My Information",
      rows: [
        { icon: paths.user, label: "Personal Information", sub: "Name, contact, date of birth" },
        { icon: paths.fileText, label: "Recovery Information", sub: `${state.procedure} · Day ${state.day}` },
      ],
    },
    {
      heading: "My Care",
      rows: [
        { icon: paths.medkit, label: "Hospital & Care Team", sub: `${state.doctor.specialty}`, href: "/care-team" },
        {
          icon: paths.heart,
          label: "Caregiver Circle",
          sub: state.caregivers.map((c) => c.name).join(", ") || "Add a caregiver",
          href: "/care-team",
        },
      ],
    },
    {
      heading: "My Health Information",
      rows: [
        { icon: paths.fileText, label: "Medical Documents", sub: "1 document on record" },
        { icon: paths.clipboardList, label: "Recovery Reports", sub: `${pct}% of today's plan completed`, href: "/plan" },
      ],
    },
    {
      heading: "Preferences",
      rows: [
        { icon: paths.chatBubble, label: "Language & Communication", sub: "English · Text + Voice" },
        { icon: paths.settings, label: "Privacy & Access", sub: "Manage who can see your info" },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="rounded-b-3xl bg-ink px-5 pb-6 pt-[max(20px,env(safe-area-inset-top))] text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-bold">My Profile</h1>
            <div className="flex gap-2">
              <Link
                href="/reminders"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 active:opacity-70"
              >
                <Icon path={paths.bell} className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 text-ink shadow-card">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-[18px] font-bold text-white">
              {initials || "GU"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold">{state.name || "Guest User"}</p>
              <p className="text-[12px] text-gray-helper">Recovering at home</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Chip label={`Day ${state.day}`} />
                <Chip label={`${pct}% Tasks Done`} tone="success" />
                <Chip label="Free Plan" tone="primary" />
              </div>
            </div>
            <button
              onClick={() => notify("Edit profile")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white active:opacity-80"
            >
              <Icon path={paths.edit} className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-center justify-between rounded-2xl border border-gray-medium bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon path={paths.medkit} className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-helper">
                  Discharge Date
                </p>
                <p className="text-[14px] font-semibold text-ink">{formatDischargeDate(state.day)}</p>
              </div>
            </div>
            <span className="rounded-full bg-warning-light px-2.5 py-1 text-[11px] font-bold text-warning">
              {state.day - 1 <= 0 ? "Today" : `${state.day - 1} days ago`}
            </span>
          </div>

          <Link
            href={state.streak.plant ? "/streak/grow" : "/streak/choose"}
            className="mt-3 flex items-center gap-3 rounded-2xl border border-gray-medium bg-white p-4 shadow-card active:opacity-80"
          >
            <span className="text-[32px] leading-none">{plantEmoji(state.streak.plant, state.streak.days)}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-ink">
                {state.streak.plant ? state.streak.plantName : "Choose your recovery plant"}
              </p>
              <p className="text-[12px] text-gray-helper">
                {state.streak.days} day streak · grows as you complete your plan
              </p>
            </div>
            <Icon path={paths.chevronRight} className="h-4 w-4 shrink-0 text-gray-helper" />
          </Link>

          {sections.map((section) => (
            <div key={section.heading} className="mt-6">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-helper">
                {section.heading}
              </p>
              <div className="overflow-hidden rounded-2xl border border-gray-medium bg-white shadow-card">
                {section.rows.map((row, i) => {
                  const rowClass = `flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-body ${
                    i !== section.rows.length - 1 ? "border-b border-gray-medium" : ""
                  }`;
                  const rowContent = (
                    <>
                      <Icon path={row.icon} className="h-5 w-5 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-ink">{row.label}</p>
                        <p className="truncate text-[12px] text-gray-helper">{row.sub}</p>
                      </div>
                      <Icon path={paths.chevronRight} className="h-4 w-4 shrink-0 text-gray-helper" />
                    </>
                  );
                  return row.href ? (
                    <Link key={row.label} href={row.href} className={rowClass}>
                      {rowContent}
                    </Link>
                  ) : (
                    <button key={row.label} onClick={() => notify(row.label)} className={rowClass}>
                      {rowContent}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={handleLogout}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-danger-border bg-danger-light text-[14px] font-semibold text-danger active:opacity-80"
          >
            <Icon path={paths.logout} className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function Chip({ label, tone = "gray" }: { label: string; tone?: "gray" | "success" | "primary" }) {
  const styles =
    tone === "success"
      ? "bg-success-light text-success"
      : tone === "primary"
      ? "bg-primary/10 text-primary"
      : "bg-gray-medium text-ink";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${styles}`}>{label}</span>
  );
}
