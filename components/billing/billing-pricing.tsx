"use client";

import { Check, Crown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLAN_META, PLAN_ORDER, type PlanTier } from "@/lib/mock-data";
import { usePlan } from "@/components/billing/plan-store";

export function PricingGrid({ onSelect }: { onSelect: (tier: PlanTier) => void }) {
  const { tier } = usePlan();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PLAN_ORDER.map((id) => (
        <PlanCard
          key={id}
          plan={PLAN_META[id]}
          isCurrent={tier === id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function PlanCard({
  plan,
  isCurrent,
  onSelect,
}: {
  plan: (typeof PLAN_META)["basic"];
  isCurrent: boolean;
  onSelect: (tier: PlanTier) => void;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-none border p-4",
        plan.highlight
          ? "border border-accent-primary/40 bg-accent-primary/5"
          : "border-border bg-card"
      )}
    >
      {plan.highlight && (
        <span className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-none border border-accent-primary/60 bg-accent-primary-soft px-2 py-0.5 text-[10px] font-semibold text-accent-primary">
          <Crown className="size-3" />
          Most Popular
        </span>
      )}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold">{plan.name}</p>
        {isCurrent && (
          <Badge
            variant="outline"
            className="border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft text-accent-primary"
          >
            Current plan
          </Badge>
        )}
      </div>
      <p className="mt-2 flex items-baseline gap-1">
        <span className="font-heading text-2xl font-semibold tracking-tight">
          ${plan.price}
        </span>
        <span className="text-[12px] text-muted-foreground">/month</span>
      </p>
      <p className="mt-1 text-[12px] text-muted-foreground">{plan.tagline}</p>
      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((feature) => (
          <li
            key={feature.label}
            className={cn(
              "flex items-start gap-2 text-[12px]",
              feature.included
                ? "text-foreground/85"
                : "text-muted-foreground/50 line-through"
            )}
          >
            {feature.included ? (
              <Check className="mt-px size-3.5 shrink-0 text-accent-primary" />
            ) : (
              <X className="mt-px size-3.5 shrink-0 text-muted-foreground/50" />
            )}
            {feature.label}
          </li>
        ))}
      </ul>
      <Button
        size="sm"
        variant={isCurrent ? "outline" : plan.highlight ? "accent" : "outline"}
        disabled={isCurrent}
        onClick={() => onSelect(plan.id)}
        className="mt-4 w-full"
      >
        {isCurrent ? (
          "Current plan"
        ) : plan.highlight ? (
          <>
            <Crown className="size-3.5" />
            Go Premium
          </>
        ) : (
          "Switch to Basic"
        )}
      </Button>
    </div>
  );
}
