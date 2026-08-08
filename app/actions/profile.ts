"use server";

import { createClient } from "@/lib/supabase/server";

export interface ProfileRecord {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  selected_theme: string;
  created_at: string;
}

export type ProfileMutationState = {
  ok: boolean;
  error?: string;
};

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getProfile(): Promise<ProfileRecord | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, selected_theme, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  return data as ProfileRecord;
}

export async function updateProfile(
  formData: FormData
): Promise<ProfileMutationState> {
  if (!isSupabaseConfigured()) return { ok: true };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Not authenticated" };

  const fullName = String(formData.get("full_name") ?? "").trim();
  const theme = String(formData.get("selected_theme") ?? "").trim();

  const patch: { full_name?: string; selected_theme?: string } = {};
  if (fullName) patch.full_name = fullName;
  if (theme) patch.selected_theme = theme;

  if (Object.keys(patch).length === 0) return { ok: true };

  // Scoped to the authenticated user's own row; RLS (auth.uid() = id)
  // enforces the same condition server-side.
  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
