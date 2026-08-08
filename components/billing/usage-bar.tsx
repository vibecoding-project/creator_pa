"use client";

import { Crown, Gauge, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/components/billing/plan-store";

export function UsageBar({
  variant = "sidebar",
  className,
}: {
  variant?: "sidebar" | "banner";
  className?: string;
}) {
  const { emailsUsed, limit, percent, nearLimit, locked, cycle, openUpgrade } =
    usePlan();
  const unlimited = limit === null;

  if (variant === "banner" && (unlimited || (!nearLimit && !locked))) {
    return null;
  }

  if (variant === "sidebar") {
    return (
      <div
        className={cn(
          "rounded-none border border-border bg-muted/30 px-3 py-2.5",
          className
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            <Gauge className="size-3" />
            Email allowance
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
            {unlimited ? "Unlimited" : `${emailsUsed}/${limit}`}
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden bg-[#282828]">
          <div
            className="h-full bg-accent-primary transition-all"
            style={{ width: unlimited ? "100%" : `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {unlimited ? (
            <span className="flex items-center gap-1 text-[#a0a0a0]">
              <Crown className="size-2.5" />
              Premium · unlimited processing
            </span>
          ) : (
            <>
              {cycle} · {percent}% used
              {locked && " · cap reached"}
            </>
          )}
        </p>
        {(nearLimit || locked) && (
          <Button
            size="xs"
            variant="accent"
            onClick={openUpgrade}
            className="mt-2 w-full"
          >
            <Crown className="size-3" />
            {locked ? "Unlock with Premium" : "Upgrade plan"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-none border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] px-3.5 py-2.5",
        className
      )}
    >
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#a0a0a0] uppercase">
        <TrendingDown className="size-3.5" />
        {locked ? "Email cap reached" : "Email allowance running low"}
      </span>
      <span className="text-[12px] text-muted-foreground">
        {emailsUsed} of {limit} emails processed this cycle · {percent}% used
        {locked && " · automated replies paused"}
      </span>
      <Button
        size="sm"
        variant="accent"
        onClick={openUpgrade}
        className="ml-auto"
      >
        <Crown className="size-3.5" />
        Upgrade plan
      </Button>
    </div>
  );
}
