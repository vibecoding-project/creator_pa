"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/components/billing/plan-store";
import { PricingGrid } from "@/components/billing/billing-pricing";

export function PricingModal() {
  const { upgradeOpen, closeUpgrade, locked, setTier } = usePlan();

  const select = (tier: Parameters<typeof setTier>[0]) => {
    setTier(tier);
    closeUpgrade();
  };

  return (
    <Dialog
      open={upgradeOpen}
      onOpenChange={(open) => {
        if (!open) closeUpgrade();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {locked ? "Cap reached — pick a plan" : "Upgrade Studio"}
          </DialogTitle>
          <DialogDescription>
            {locked
              ? "You've processed all of this cycle's email allowance. Automated replies stay paused until you upgrade or the cap resets."
              : "Pick a plan. Switching applies instantly — this is a mock, so no real charge."}
          </DialogDescription>
        </DialogHeader>
        <PricingGrid onSelect={select} />
        <DialogFooter>
          <Button variant="ghost" onClick={closeUpgrade}>
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
