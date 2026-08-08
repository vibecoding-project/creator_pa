"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  PLAN_META,
  initialUsage,
  isAtLimit,
  usagePercent,
  type PlanTier,
} from "@/lib/mock-data";

interface PlanState {
  tier: PlanTier;
  emailsUsed: number;
  cycle: string;
  limit: number | null;
  percent: number;
  nearLimit: boolean;
  locked: boolean;
  setTier: (tier: PlanTier) => void;
  consumeEmail: () => void;
  simulateCap: () => void;
  upgradeOpen: boolean;
  openUpgrade: () => void;
  closeUpgrade: () => void;
}

const PlanContext = createContext<PlanState | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [usage, setUsage] = useState(initialUsage);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const limit = PLAN_META[usage.tier].emailLimit;
  const percent = usagePercent(usage.emailsUsed, limit);
  const locked = isAtLimit(usage.emailsUsed, limit);
  const nearLimit = limit !== null && percent >= 80 && !locked;

  const prevLocked = useRef(locked);
  useEffect(() => {
    if (locked && !prevLocked.current) setUpgradeOpen(true);
    prevLocked.current = locked;
  }, [locked]);

  const setTier = useCallback((tier: PlanTier) => {
    setUsage((prev) => ({ ...prev, tier }));
  }, []);

  const consumeEmail = useCallback(() => {
    setUsage((prev) => {
      const cap = PLAN_META[prev.tier].emailLimit;
      if (cap !== null && prev.emailsUsed >= cap) return prev;
      return { ...prev, emailsUsed: prev.emailsUsed + 1 };
    });
  }, []);

  const simulateCap = useCallback(() => {
    setUsage((prev) => {
      const cap = PLAN_META[prev.tier].emailLimit;
      if (cap === null) return prev;
      return { ...prev, emailsUsed: cap };
    });
    setUpgradeOpen(true);
  }, []);

  const openUpgrade = useCallback(() => setUpgradeOpen(true), []);
  const closeUpgrade = useCallback(() => setUpgradeOpen(false), []);

  const value = useMemo<PlanState>(
    () => ({
      tier: usage.tier,
      emailsUsed: usage.emailsUsed,
      cycle: usage.cycle,
      limit,
      percent,
      nearLimit,
      locked,
      setTier,
      consumeEmail,
      simulateCap,
      upgradeOpen,
      openUpgrade,
      closeUpgrade,
    }),
    [
      usage,
      limit,
      percent,
      nearLimit,
      locked,
      setTier,
      consumeEmail,
      simulateCap,
      upgradeOpen,
      openUpgrade,
      closeUpgrade,
    ]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within a PlanProvider");
  return ctx;
}
