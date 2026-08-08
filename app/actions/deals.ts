"use server";

import { createClient } from "@/lib/supabase/server";
import {
  deals as seedDeals,
  type Deal,
  type DealStage,
  type DealStatus,
} from "@/lib/mock-data";

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

export interface NewDealInput {
  brand: string;
  value: number;
  stage: DealStage;
  deadline?: string;
  deliverables?: string;
}

const DB_STATUS_TO_STAGE: Record<DealDbStatus, DealStage> = {
  INBOX: "conversation",
  IN_PROGRESS: "rate-lock",
  CLOSED_WIN: "completed",
  DECLINED: "completed",
};

const UI_STATUS_BY_STAGE: Record<DealStage, DealStatus> = {
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

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function toDbStatus(stage: DealStage, status: DealStatus): DealDbStatus {
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

function toUiDeal(row: SponsorshipDeal): Deal {
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

function fallbackDeal(input: NewDealInput): Deal {
  const brand = input.brand.trim();
  return {
    id: `de-${Date.now()}`,
    brand,
    initials: brand.slice(0, 2).toUpperCase(),
    value: input.value,
    platform: "Email",
    stage: input.stage,
    status: UI_STATUS_BY_STAGE[input.stage],
    deadline: input.deadline?.trim() || "TBD",
    deliverables: input.deliverables?.trim() || "TBD",
    lastActivity: "just now",
  };
}

export async function getDeals(): Promise<Deal[]> {
  if (!isSupabaseConfigured()) return seedDeals;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sponsorship_deals")
    .select("id, user_id, brand_name, deal_amount, status, badge_type, created_at")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return seedDeals;

  return data.map(toUiDeal);
}

export async function createDeal(input: NewDealInput): Promise<Deal> {
  if (!isSupabaseConfigured()) return fallbackDeal(input);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return fallbackDeal(input);

  const { data, error } = await supabase
    .from("sponsorship_deals")
    .insert({
      user_id: user.id,
      brand_name: input.brand.trim(),
      deal_amount: input.value,
      status: toDbStatus(input.stage, UI_STATUS_BY_STAGE[input.stage]),
      badge_type: null,
    })
    .select("id, user_id, brand_name, deal_amount, status, badge_type, created_at")
    .single();

  if (error || !data) return fallbackDeal(input);

  return toUiDeal(data);
}

export async function updateDealStatus(
  id: string,
  stage: DealStage,
  status: DealStatus
): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };

  const supabase = await createClient();
  const { error } = await supabase
    .from("sponsorship_deals")
    .update({ status: toDbStatus(stage, status) })
    .eq("id", id);

  return { ok: !error };
}
