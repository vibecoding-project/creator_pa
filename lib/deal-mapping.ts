import { type Deal, type DealStage, type DealStatus } from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/*  Shared DB <-> UI mapping for sponsorship deals.                    */
/*  Pure functions only (no server/client APIs) so it can be imported  */
/*  from both "use server" actions and client components/hooks.        */
/* ------------------------------------------------------------------ */

export type DealDbStatus = "INBOX" | "IN_PROGRESS" | "CLOSED_WIN" | "DECLINED";

export type BadgeType = "HIGH BUDGET" | "NEEDS INFO" | "GIFTING";

export interface SponsorshipDeal {
  id: string;
  user_id: string;
  brand_name: string;
  deal_amount: number;
  status: DealDbStatus;
  badge_type: BadgeType | null;
  created_at: string;
}

const DB_STATUS_TO_STAGE: Record<DealDbStatus, DealStage> = {
  INBOX: "conversation",
  IN_PROGRESS: "rate-lock",
  CLOSED_WIN: "completed",
  DECLINED: "completed",
};

export const UI_STATUS_BY_STAGE: Record<DealStage, DealStatus> = {
  conversation: "Active",
  "rate-lock": "Review",
  deliverable: "Uploaded",
  "payment-due": "Invoiced",
  completed: "Paid",
};

const BADGE_DELIVERABLES: Record<BadgeType, string> = {
  "HIGH BUDGET": "High-budget partnership",
  "NEEDS INFO": "Needs more info",
  GIFTING: "Gifting arrangement",
};

const DEAL_DB_STATUSES: DealDbStatus[] = [
  "INBOX",
  "IN_PROGRESS",
  "CLOSED_WIN",
  "DECLINED",
];

const BADGE_TYPES: BadgeType[] = ["HIGH BUDGET", "NEEDS INFO", "GIFTING"];

export function isDealDbStatus(value: string): value is DealDbStatus {
  return (DEAL_DB_STATUSES as string[]).includes(value);
}

export function isBadgeType(value: string): value is BadgeType {
  return (BADGE_TYPES as string[]).includes(value);
}

export function toDbStatus(
  stage: DealStage,
  status: DealStatus
): DealDbStatus {
  if (status === "Closed") return "DECLINED";
  if (stage === "completed") return "CLOSED_WIN";
  return "IN_PROGRESS";
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function toUiDeal(row: SponsorshipDeal): Deal {
  const stage = DB_STATUS_TO_STAGE[row.status];
  const status =
    row.status === "DECLINED" ? "Closed" : UI_STATUS_BY_STAGE[stage];
  return {
    id: row.id,
    brand: row.brand_name,
    initials: row.brand_name.slice(0, 2).toUpperCase(),
    value: row.deal_amount,
    platform: "Email",
    stage,
    status,
    deadline: "TBD",
    deliverables: row.badge_type ? BADGE_DELIVERABLES[row.badge_type] : "—",
    lastActivity: timeAgo(row.created_at),
  };
}

/**
 * Safe conversion for Realtime payloads (`payload.new` / `payload.old`),
 * which arrive as plain objects and may be empty on some event types.
 * Returns null when the payload cannot be mapped to a deal.
 */
export function rowToDeal(row: unknown): Deal | null {
  if (!row || typeof row !== "object") return null;
  const candidate = row as Partial<SponsorshipDeal>;
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.brand_name !== "string"
  ) {
    return null;
  }
  return toUiDeal(row as SponsorshipDeal);
}
