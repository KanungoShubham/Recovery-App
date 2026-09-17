export const PLANTS = {
  monstera: { label: "Monstera", meaning: "Grows for healthy lungs", stages: ["🌱", "🌿", "🪴", "🌳"] },
  succulent: { label: "Succulent", meaning: "Grows for steady hydration & habits", stages: ["🌱", "🌵", "🪴", "🌵"] },
  bonsai: { label: "Bonsai", meaning: "Grows for patience & consistency", stages: ["🌱", "🌿", "🪴", "🎍"] },
} as const;

export type PlantKind = keyof typeof PLANTS;

export function plantStage(days: number) {
  if (days >= 14) return 3;
  if (days >= 7) return 2;
  if (days >= 3) return 1;
  return 0;
}

export function plantEmoji(kind: PlantKind | null, days: number) {
  if (!kind) return "🌱";
  return PLANTS[kind].stages[plantStage(days)];
}
