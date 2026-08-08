"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ACCENT_IDS,
  ACCENT_MAP,
  ACCENTS,
  DEFAULT_ACCENT,
  type AccentId,
} from "@/lib/accents";

const STORAGE_KEY = "creator-hub.accent";

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function readStoredAccent(): AccentId {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved && (ACCENT_IDS as string[]).includes(saved)
    ? (saved as AccentId)
    : DEFAULT_ACCENT;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

interface AccentContextValue {
  accent: AccentId;
  setAccent: (id: AccentId) => void;
  presets: typeof ACCENTS;
}

const AccentContext = createContext<AccentContextValue | null>(null);

export function AccentProvider({ children }: { children: ReactNode }) {
  const accent = useSyncExternalStore(
    subscribe,
    readStoredAccent,
    () => DEFAULT_ACCENT
  );

  const setAccent = useCallback((id: AccentId) => {
    localStorage.setItem(STORAGE_KEY, id);
    emitChange();
  }, []);

  const preset = ACCENT_MAP[accent];

  const value = useMemo(
    () => ({ accent, setAccent, presets: ACCENTS }),
    [accent, setAccent]
  );

  return (
    <AccentContext.Provider value={value}>
      <div
        style={
          {
            "--accent-primary": preset.hex,
            "--accent-primary-strong": preset.strong,
            "--accent-primary-soft": preset.soft,
            "--accent-primary-contrast": preset.on,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error("useAccent must be used within AccentProvider");
  return ctx;
}
