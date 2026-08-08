"use server";

import { createClient } from "@/lib/supabase/server";
import {
  deals as seedDeals,
  type Deal,
  type DealStage,
  type DealStatus,
} from "@/lib/mock-data";
import {
  isBadgeType,
  isDealDbStatus,
  toDbStatus,
  toUiDeal,
  UI_STATUS_BY_STAGE,
} from "@/lib/deal-mapping";

export type {
  BadgeType,
  DealDbStatus,
  SponsorshipDeal,
} from "@/lib/deal-mapping";

export interface NewDealInput {
  brand: string;
  value: number;
  stage: DealStage;
  deadline?: string;
  deliverables?: string;
}

export type DealMutationState = {
  ok: boolean;
  error?: string;
};

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
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

/* ------------------------------------------------------------------ */
/*  Session helpers                                                    */
/* ------------------------------------------------------------------ */

export async function getCurrentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Reads                                                              */
/* ------------------------------------------------------------------ */

export async function getDeals(): Promise<Deal[]> {
  // Demo mode: no Supabase configured — show the seed pipeline.
  if (!isSupabaseConfigured()) return seedDeals;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Should never happen (proxy protects these routes) — never leak mock
  // data to an unauthenticated request.
  if (!user) return [];

  const { data, error } = await supabase
    .from("sponsorship_deals")
    .select("id, user_id, brand_name, deal_amount, status, badge_type, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // RLS blocks or any other query failure → return an empty state rather
  // than mock rows. The row-level policies already scope the query to
  // auth.uid() = user_id; the explicit filter is defense in depth.
  if (error || !data) return [];

  return data.map(toUiDeal);
}

/* ------------------------------------------------------------------ */
/*  Writes                                                            */
/* ------------------------------------------------------------------ */

export async function createDeal(input: NewDealInput): Promise<Deal | null> {
  // Demo mode: no Supabase configured — return a local optimistic deal.
  if (!isSupabaseConfigured()) return fallbackDeal(input);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

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

  // Null means the insert was rejected (e.g. RLS policy violation) — the
  // caller should roll back its optimistic update.
  if (error || !data) return null;

  return toUiDeal(data);
}

export async function updateDealStatus(
  id: string,
  stage: DealStage,
  status: DealStatus
): Promise<DealMutationState> {
  if (!isSupabaseConfigured()) return { ok: true };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("sponsorship_deals")
    .update({ status: toDbStatus(stage, status) })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateDeal(
  dealId: string,
  formData: FormData
): Promise<DealMutationState> {
  if (!isSupabaseConfigured()) return { ok: true };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Not authenticated" };

  const brandName = String(formData.get("brand_name") ?? "").trim();
  const amountRaw = String(formData.get("deal_amount") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const badgeRaw = String(formData.get("badge_type") ?? "").trim();

  const patch: Record<string, string | number | null> = {};
  if (brandName) patch.brand_name = brandName;
  const amount = Number(amountRaw);
  if (amountRaw !== "" && !Number.isNaN(amount) && amount >= 0) {
    patch.deal_amount = amount;
  }
  if (isDealDbStatus(status)) patch.status = status;
  if (isBadgeType(badgeRaw)) patch.badge_type = badgeRaw;
  else if (badgeRaw === "") patch.badge_type = null;

  if (Object.keys(patch).length === 0) return { ok: true };

  // Update is scoped to both id AND user_id; RLS enforces the same
  // condition server-side.
  const { error } = await supabase
    .from("sponsorship_deals")
    .update(patch)
    .eq("id", dealId)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteDeal(dealId: string): Promise<DealMutationState> {
  if (!isSupabaseConfigured()) return { ok: true };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("sponsorship_deals")
    .delete()
    .eq("id", dealId)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
