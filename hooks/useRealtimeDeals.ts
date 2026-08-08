"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { rowToDeal } from "@/lib/deal-mapping";
import type { Deal } from "@/lib/mock-data";

const SCHEMA = "public";
const TABLE = "sponsorship_deals";

/**
 * Live dashboard data for the current user's sponsorship deals.
 *
 * Subscribes to postgres_changes (INSERT / UPDATE / DELETE) on
 * `sponsorship_deals` filtered by the active user_id, then:
 *   - merges each event into local state for an instant UI update, and
 *   - calls `router.refresh()` so server-rendered data (RSC cache) is
 *     revalidated to match.
 *
 * Realtime respects the table's RLS policies, so only changes to rows the
 * user can SELECT (auth.uid() = user_id) are delivered. The subscription
 * channel is torn down on unmount to avoid leaking websockets.
 */
export function useRealtimeDeals(
  initialDeals: Deal[],
  userId: string | null
) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  if (supabaseRef.current === null) {
    supabaseRef.current = createClient();
  }

  useEffect(() => {
    // Demo mode (no Supabase configured) or no session → static data.
    if (!userId) return;

    const filter = `user_id=eq.${userId}`;

    const channel = supabaseRef
      .current!.channel("realtime-deals")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: SCHEMA, table: TABLE, filter },
        (payload) => {
          const deal = rowToDeal(payload.new);
          if (!deal) return;
          setDeals((prev) => [deal, ...prev.filter((d) => d.id !== deal.id)]);
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: SCHEMA, table: TABLE, filter },
        (payload) => {
          const deal = rowToDeal(payload.new);
          if (!deal) return;
          setDeals((prev) => prev.map((d) => (d.id === deal.id ? deal : d)));
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: SCHEMA, table: TABLE, filter },
        (payload) => {
          const id = (payload.old as { id?: string } | undefined)?.id;
          if (!id) return;
          setDeals((prev) => prev.filter((d) => d.id !== id));
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabaseRef.current?.removeChannel(channel);
    };
  }, [userId, router]);

  return { deals, setDeals };
}
