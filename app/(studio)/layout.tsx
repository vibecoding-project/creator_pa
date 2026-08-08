import type { User } from "@supabase/supabase-js";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();
    user = sessionUser;
  } catch {
    // Not configured or session read failed — render without user details.
  }

  return <AppShell user={user}>{children}</AppShell>;
}
