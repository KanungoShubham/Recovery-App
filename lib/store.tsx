"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Role = "doctor" | "patient" | "caregiver" | null;

export type ActionType = "medication" | "wound" | "appointment" | "exercise" | "checkin";

export type SubItem = { id: string; label: string; dose: string };

export type ActionItem = {
  id: string;
  type: ActionType;
  title: string;
  subtitle: string;
  time: string;
  meta: string;
  completed: boolean;
  missed: boolean;
  items?: SubItem[];
};

export type ReminderItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  kind: "success" | "info" | "warning" | "reminder";
};

export type Caregiver = { id: string; name: string; relation: string };

export type Mood = "great" | "okay" | "worried" | "uncomfortable" | "low" | "overwhelmed";

export type Streak = {
  days: number;
  plant: "monstera" | "succulent" | "bonsai" | null;
  plantName: string;
};

export type AskQuery = {
  id: string;
  type: string;
  message: string;
  time: string;
  status: "sent" | "delivered";
};

export type ApprovalStatus = "pending" | "approved" | "info_needed" | "rejected";

export type PlanApproval = {
  id: string;
  patientName: string;
  age: number;
  condition: string;
  submittedAgo: string;
  documents: string[];
  aiSummary: string;
  status: ApprovalStatus;
  priority: "P0" | "P1";
};

export type PatientQuery = {
  id: string;
  patientName: string;
  message: string;
  urgency: "P0" | "P1";
  time: string;
  replied: boolean;
};

export type DoctorAppointment = {
  id: string;
  patientName: string;
  time: string;
  kind: "requested" | "scheduled";
  reason: string;
  status: "pending" | "approved" | "rejected";
};

export type DoctorProfile = {
  fullName: string;
  regNumber: string;
  specialty: string;
  hospital: string;
  language: string;
  verified: "pending" | "approved" | "rejected";
};

export type AppState = {
  role: Role;
  onboarded: boolean;
  name: string;
  procedure: string;
  surgeryDate: string;
  day: number;
  actions: ActionItem[];
  reminders: ReminderItem[];
  caregivers: Caregiver[];
  doctor: { name: string; specialty: string; phone: string; nextVisit: string };
  doctorOnboarded: boolean;
  doctorProfile: DoctorProfile;
  planApprovals: PlanApproval[];
  patientQueries: PatientQuery[];
  appointments: DoctorAppointment[];
  streak: Streak;
  lastCheckIn: { mood: Mood; time: string } | null;
  askQueries: AskQuery[];
  preferences: { largeText: boolean; voiceMode: boolean; screenReader: boolean; strongVibration: boolean };
  caregiverLinkedPatient: { name: string; status: "pending" | "synced" } | null;
};

const DEFAULT_STATE: AppState = {
  role: null,
  onboarded: false,
  name: "",
  procedure: "Knee Replacement Surgery",
  surgeryDate: "",
  day: 4,
  actions: [
    {
      id: "a1",
      type: "medication",
      title: "Take your morning medicines",
      subtitle: "With food, before breakfast",
      time: "8:00 AM",
      meta: "8:00 AM · Before breakfast",
      completed: true,
      missed: false,
      items: [
        { id: "a1-1", label: "Magnesium", dose: "1 tablet" },
        { id: "a1-2", label: "Pandol", dose: "1 tablet" },
      ],
    },
    {
      id: "a2",
      type: "wound",
      title: "Change wound dressing",
      subtitle: "Keep the area clean and dry",
      time: "10:30 AM",
      meta: "10:30 AM · Wound care",
      completed: false,
      missed: false,
    },
    {
      id: "a3",
      type: "exercise",
      title: "Physiotherapy stretches",
      subtitle: "3 sets x 10 reps, gentle pace",
      time: "1:00 PM",
      meta: "1:00 PM · Mobility",
      completed: false,
      missed: false,
    },
    {
      id: "a4",
      type: "medication",
      title: "Take your afternoon medicines",
      subtitle: "After lunch, with water",
      time: "2:00 PM",
      meta: "2:00 PM · After lunch",
      completed: false,
      missed: false,
      items: [{ id: "a4-1", label: "Ibuprofen 200mg", dose: "1 tablet" }],
    },
    {
      id: "a5",
      type: "appointment",
      title: "Follow-up call with Dr. Mehta",
      subtitle: "Telehealth check-in",
      time: "5:30 PM",
      meta: "5:30 PM · Appointment",
      completed: false,
      missed: false,
    },
  ],
  reminders: [
    {
      id: "r1",
      title: "Time for your afternoon medication",
      message: "Ibuprofen 200mg — take with water",
      time: "2 min ago",
      read: false,
      kind: "reminder",
    },
    {
      id: "r2",
      title: "Wound care logged",
      message: "Great job staying on track today",
      time: "3 hr ago",
      read: true,
      kind: "success",
    },
    {
      id: "r3",
      title: "Appointment tomorrow",
      message: "Dr. Mehta — 10:00 AM, City Hospital",
      time: "5 hr ago",
      read: true,
      kind: "info",
    },
    {
      id: "r4",
      title: "Missed check-in yesterday",
      message: "Tap to log how you're feeling",
      time: "1 day ago",
      read: true,
      kind: "warning",
    },
  ],
  caregivers: [{ id: "c1", name: "Priya Sharma", relation: "Daughter" }],
  doctor: {
    name: "Dr. Aditi Mehta",
    specialty: "Orthopedic Surgeon",
    phone: "+1 (555) 019-2231",
    nextVisit: "Tomorrow, 10:00 AM",
  },
  doctorOnboarded: false,
  doctorProfile: {
    fullName: "",
    regNumber: "",
    specialty: "",
    hospital: "",
    language: "English",
    verified: "pending",
  },
  planApprovals: [
    {
      id: "pa1",
      patientName: "Julie Fernandez",
      age: 34,
      condition: "Knee Replacement Surgery — Day 4 recovery plan",
      submittedAgo: "12 min ago",
      documents: ["discharge-summary.pdf", "prescription.pdf"],
      aiSummary:
        "Patient recovering well post knee replacement. AI suggests medication schedule, wound care every 12h, and gradual physiotherapy over 6 weeks.",
      status: "pending",
      priority: "P0",
    },
    {
      id: "pa2",
      patientName: "Marcus Chen",
      age: 51,
      condition: "Appendectomy — Day 1 recovery plan",
      submittedAgo: "1 hr ago",
      documents: ["op-notes.pdf"],
      aiSummary:
        "Standard post-appendectomy plan generated. Pain management and incision care included. No conflicts detected in source documents.",
      status: "pending",
      priority: "P1",
    },
    {
      id: "pa3",
      patientName: "Ananya Rao",
      age: 28,
      condition: "Fracture (wrist) — Day 2 recovery plan",
      submittedAgo: "yesterday",
      documents: ["x-ray-report.pdf", "discharge-note.pdf"],
      aiSummary:
        "Cast care and pain schedule generated. Missing follow-up date for cast removal — needs clinician input.",
      status: "info_needed",
      priority: "P1",
    },
  ],
  patientQueries: [
    {
      id: "q1",
      patientName: "Julie Fernandez",
      message: "Is it normal to feel mild swelling around the knee after physiotherapy?",
      urgency: "P1",
      time: "8 min ago",
      replied: false,
    },
    {
      id: "q2",
      patientName: "Marcus Chen",
      message: "Sharp pain near the incision site, worse than yesterday. Should I be worried?",
      urgency: "P0",
      time: "25 min ago",
      replied: false,
    },
  ],
  appointments: [
    {
      id: "ap1",
      patientName: "Julie Fernandez",
      time: "Tomorrow, 10:00 AM",
      kind: "scheduled",
      reason: "Follow-up check-in",
      status: "approved",
    },
    {
      id: "ap2",
      patientName: "Ananya Rao",
      time: "Today, 4:30 PM",
      kind: "requested",
      reason: "Cast removal consultation requested by patient",
      status: "pending",
    },
  ],
  streak: { days: 3, plant: null, plantName: "" },
  lastCheckIn: null,
  askQueries: [],
  preferences: { largeText: false, voiceMode: false, screenReader: false, strongVibration: true },
  caregiverLinkedPatient: null,
};

type StoreValue = {
  state: AppState;
  setRole: (role: Role) => void;
  completeOnboarding: (name: string, procedure: string, surgeryDate: string) => void;
  toggleAction: (id: string) => string | null;
  markMissed: (id: string) => string | null;
  markAllRead: () => void;
  addReminder: (r: Omit<ReminderItem, "id" | "read" | "time">) => void;
  inviteCaregiver: (name: string, relation: string) => void;
  completeDoctorOnboarding: (profile: Omit<DoctorProfile, "verified">, verified?: DoctorProfile["verified"]) => void;
  setPlanStatus: (id: string, status: ApprovalStatus) => string | null;
  replyQuery: (id: string) => string | null;
  setAppointmentStatus: (id: string, status: "approved" | "rejected") => string | null;
  choosePlant: (plant: NonNullable<Streak["plant"]>, plantName: string) => void;
  recordCheckIn: (mood: Mood) => void;
  submitQuery: (type: string, message: string) => void;
  setPreferences: (p: Partial<AppState["preferences"]>) => void;
  linkPatient: (name: string) => void;
  confirmPatientSync: () => void;
  reset: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);
const STORAGE_KEY = "recovery-companion-state";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      setRole: (role) => setState((s) => ({ ...s, role })),
      completeOnboarding: (name, procedure, surgeryDate) =>
        setState((s) => ({
          ...s,
          name,
          procedure: procedure || s.procedure,
          surgeryDate,
          onboarded: true,
        })),
      toggleAction: (id) => {
        let title: string | null = null;
        setState((s) => ({
          ...s,
          actions: s.actions.map((a) => {
            if (a.id !== id) return a;
            if (!a.completed) title = a.title;
            return { ...a, completed: !a.completed, missed: false };
          }),
        }));
        return title;
      },
      markMissed: (id) => {
        let title: string | null = null;
        setState((s) => ({
          ...s,
          actions: s.actions.map((a) => {
            if (a.id !== id) return a;
            title = a.title;
            return { ...a, missed: true, completed: false };
          }),
        }));
        return title;
      },
      markAllRead: () =>
        setState((s) => ({
          ...s,
          reminders: s.reminders.map((r) => ({ ...r, read: true })),
        })),
      addReminder: (r) =>
        setState((s) => ({
          ...s,
          reminders: [
            {
              ...r,
              id: `r${Date.now()}`,
              read: false,
              time: "Just now",
            },
            ...s.reminders,
          ],
        })),
      inviteCaregiver: (name, relation) =>
        setState((s) => ({
          ...s,
          caregivers: [...s.caregivers, { id: `c${Date.now()}`, name, relation }],
        })),
      completeDoctorOnboarding: (profile, verified = "pending") =>
        setState((s) => ({
          ...s,
          doctorOnboarded: true,
          doctorProfile: { ...profile, verified },
        })),
      setPlanStatus: (id, status) => {
        let name: string | null = null;
        setState((s) => ({
          ...s,
          planApprovals: s.planApprovals.map((p) => {
            if (p.id !== id) return p;
            name = p.patientName;
            return { ...p, status };
          }),
        }));
        return name;
      },
      replyQuery: (id) => {
        let name: string | null = null;
        setState((s) => ({
          ...s,
          patientQueries: s.patientQueries.map((q) => {
            if (q.id !== id) return q;
            name = q.patientName;
            return { ...q, replied: true };
          }),
        }));
        return name;
      },
      setAppointmentStatus: (id, status) => {
        let name: string | null = null;
        setState((s) => ({
          ...s,
          appointments: s.appointments.map((a) => {
            if (a.id !== id) return a;
            name = a.patientName;
            return { ...a, status };
          }),
        }));
        return name;
      },
      choosePlant: (plant, plantName) =>
        setState((s) => ({ ...s, streak: { ...s.streak, plant, plantName } })),
      recordCheckIn: (mood) =>
        setState((s) => ({
          ...s,
          lastCheckIn: { mood, time: "Just now" },
          streak: { ...s.streak, days: s.streak.days + 1 },
        })),
      submitQuery: (type, message) =>
        setState((s) => ({
          ...s,
          askQueries: [
            { id: `aq${Date.now()}`, type, message, time: "Just now", status: "sent" },
            ...s.askQueries,
          ],
          patientQueries: [
            {
              id: `q${Date.now()}`,
              patientName: s.name || "Patient",
              message,
              urgency: "P1",
              time: "Just now",
              replied: false,
            },
            ...s.patientQueries,
          ],
        })),
      setPreferences: (p) =>
        setState((s) => ({ ...s, preferences: { ...s.preferences, ...p } })),
      linkPatient: (name) =>
        setState((s) => ({ ...s, caregiverLinkedPatient: { name, status: "pending" } })),
      confirmPatientSync: () =>
        setState((s) =>
          s.caregiverLinkedPatient
            ? { ...s, caregiverLinkedPatient: { ...s.caregiverLinkedPatient, status: "synced" } }
            : s
        ),
      reset: () => {
        setState(DEFAULT_STATE);
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {}
      },
    }),
    [state]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
