export type AccentId = "emerald" | "indigo" | "amber" | "rose" | "mono";

export interface AccentPreset {
  id: AccentId;
  name: string;
  hex: string;
  strong: string;
  soft: string;
  on: string;
}

export const DEFAULT_ACCENT: AccentId = "emerald";

export const ACCENTS: AccentPreset[] = [
  {
    id: "emerald",
    name: "Emerald",
    hex: "#10b981",
    strong: "#34d399",
    soft: "#14261c",
    on: "#06281e",
  },
  {
    id: "indigo",
    name: "Indigo",
    hex: "#6366f1",
    strong: "#818cf8",
    soft: "#1b1d36",
    on: "#0e1029",
  },
  {
    id: "amber",
    name: "Amber",
    hex: "#f59e0b",
    strong: "#fbbf24",
    soft: "#2c2412",
    on: "#2a1c03",
  },
  {
    id: "rose",
    name: "Rose",
    hex: "#f43f5e",
    strong: "#fb7185",
    soft: "#33121c",
    on: "#2b0a12",
  },
  {
    id: "mono",
    name: "Monochrome",
    hex: "#f4f4f5",
    strong: "#ffffff",
    soft: "#26262a",
    on: "#18181b",
  },
];

export const ACCENT_IDS = ACCENTS.map((a) => a.id);

export const ACCENT_MAP = Object.fromEntries(
  ACCENTS.map((a) => [a.id, a])
) as Record<AccentId, AccentPreset>;
