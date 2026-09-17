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
      if (raw) setState(JSON.parse(raw));
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
