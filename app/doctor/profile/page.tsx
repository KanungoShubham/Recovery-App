"use client";

import { useRouter } from "next/navigation";
import { DoctorBottomNav } from "@/components/DoctorBottomNav";
import { Icon, paths } from "@/components/icons";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function DoctorProfilePage() {
  const router = useRouter();
  const { state, reset } = useStore();
  const { push } = useToast();

  const profile = state.doctorProfile;
  const initials = (profile.fullName || "Doctor")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleLogout() {
    push({ kind: "info", title: "Signed out", message: "See you soon, doctor." });
    reset();
    window.setTimeout(() => router.replace("/"), 400);
  }

  function notify(label: string) {
    push({ kind: "info", title: label, message: "Demo only — no backend connected." });
  }

  const approvedCount = state.planApprovals.filter((p) => p.status === "approved").length;
  const repliedCount = state.patientQueries.filter((q) => q.replied).length;

  const rows: { icon: string; label: string; sub: string }[] = [
    { icon: paths.activity, label: "Metrics & data", sub: `${approvedCount} plans approved · ${repliedCount} queries replied` },
    { icon: paths.bell, label: "Notifications", sub: "Strong vibration for SOS & reminders" },
    { icon: paths.chatBubble, label: "Chat history", sub: "Past conversations with patients" },
    { icon: paths.settings, label: "Settings & preferences", sub: "Availability, time slots, break hours" },
    { icon: paths.fileText, label: "Account & payment", sub: "For in-house consultations" },
    { icon: paths.alertOctagon, label: "Raise a ticket", sub: "Report an issue to CareBridge support" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="rounded-b-3xl bg-ink px-5 pb-6 pt-[max(20px,env(safe-area-inset-top))] text-white">
          <h1 className="text-[20px] font-bold">Doctor Profile</h1>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 text-ink shadow-card">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-[16px] font-bold text-white">
              {initials || "DR"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold">Dr. {profile.fullName || "—"}</p>
              <p className="text-[12px] text-gray-helper">{profile.specialty || "Specialist"} · {profile.hospital || "—"}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Chip label={profile.regNumber || "Not verified"} />
                <Chip
                  label={profile.verified === "approved" ? "Verified" : "Verification pending"}
                  tone={profile.verified === "approved" ? "success" : "warning"}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4">
          <div className="grid grid-cols-3 gap-2.5">
            <Stat value="18" label="This week" />
            <Stat value="76" label="This month" />
            <Stat value="612" label="All time" />
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-medium bg-white shadow-card">
            {rows.map((row, i) => (
              <button
                key={row.label}
                onClick={() => notify(row.label)}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-body ${
                  i !== rows.length - 1 ? "border-b border-gray-medium" : ""
                }`}
              >
                <Icon path={row.icon} className="h-5 w-5 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-ink">{row.label}</p>
                  <p className="truncate text-[12px] text-gray-helper">{row.sub}</p>
                </div>
                <Icon path={paths.chevronRight} className="h-4 w-4 shrink-0 text-gray-helper" />
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-danger-border bg-danger-light text-[14px] font-semibold text-danger active:opacity-80"
          >
            <Icon path={paths.logout} className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
      <DoctorBottomNav />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-gray-medium bg-white p-3 text-center shadow-card">
      <p className="text-[18px] font-bold text-primary">{value}</p>
      <p className="mt-0.5 text-[10px] font-medium leading-3 text-gray-helper">{label}</p>
    </div>
  );
}

function Chip({ label, tone = "gray" }: { label: string; tone?: "gray" | "success" | "warning" }) {
  const styles =
    tone === "success"
      ? "bg-success-light text-success"
      : tone === "warning"
      ? "bg-warning-light text-warning"
      : "bg-gray-medium text-ink";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${styles}`}>{label}</span>;
}
