"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PLAN_META } from "@/lib/mock-data";
import { usePlan } from "@/components/billing/plan-store";
import { PricingGrid } from "@/components/billing/billing-pricing";
import { UsageBar } from "@/components/billing/usage-bar";

const INVOICES = [
  { id: "INV-0024", date: "Jul 6, 2026", amount: 30, status: "Paid" },
  { id: "INV-0023", date: "Jun 6, 2026", amount: 30, status: "Paid" },
  { id: "INV-0022", date: "May 6, 2026", amount: 30, status: "Paid" },
];

export function BillingView() {
  const { tier, setTier, emailsUsed, limit, percent, cycle, locked } = usePlan();
  const plan = PLAN_META[tier];
  const unlimited = limit === null;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-6 pb-16">
      <Link
        href="/app/settings"
        className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to settings
      </Link>

      <header className="mt-3 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg font-semibold tracking-tight">
              Billing &amp; Plan
            </h1>
            <span
              className={cn(
                "rounded-none px-2 py-0.5 text-[10px] font-medium",
                plan.highlight
                  ? "bg-[#282828] text-[#f0f0f0]"
                  : "bg-foreground/5 text-muted-foreground"
              )}
            >
              {plan.name} · ${plan.price}/mo
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Your current plan and what you get. Switching takes effect
            immediately.
          </p>
        </div>
      </header>

      {/* Usage summary */}
      <section className="mt-6 rounded-none border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[14px] font-medium">Usage this cycle</h2>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {cycle}
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-muted-foreground">Emails processed</span>
            <span className="font-medium tabular-nums">
              {unlimited
                ? `${emailsUsed} · unlimited`
                : `${emailsUsed} / ${limit}`}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-none bg-[#282828]">
            <div
              className="h-full rounded-none bg-accent-primary transition-all"
              style={{ width: unlimited ? "100%" : `${percent}%` }}
            />
          </div>
          {locked && (
            <p className="mt-2 text-[12px] text-[#a0a0a0]">
              Cap reached — automated replies are paused until you upgrade.
            </p>
          )}
        </div>
        {!unlimited && (
          <div className="mt-3">
            <UsageBar variant="banner" />
          </div>
        )}
      </section>

      {/* Plans */}
      <section className="mt-5">
        <h2 className="text-[14px] font-medium">Plans</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          Pick the tier that fits your pipeline.
        </p>
        <div className="mt-3">
          <PricingGrid onSelect={setTier} />
        </div>
      </section>

      {/* Payment method */}
      <section className="mt-5 rounded-none border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-none bg-foreground/5 text-muted-foreground">
            <CreditCard className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[14px] font-medium">Payment method</h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Visa ending in 4242 · expires 09/28
            </p>
          </div>
          <Button variant="outline" size="xs">
            Update
          </Button>
        </div>
      </section>

      {/* Invoices */}
      <section className="mt-5 rounded-none border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-none bg-foreground/5 text-muted-foreground">
            <ReceiptText className="size-4" />
          </span>
          <h2 className="text-[14px] font-medium">Invoices</h2>
        </div>
        <ul className="mt-3 divide-y divide-border/60">
          {INVOICES.map((invoice) => (
            <li
              key={invoice.id}
              className="flex items-center justify-between py-2.5 text-[12px]"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium tabular-nums">{invoice.id}</span>
                <span className="text-muted-foreground">{invoice.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium tabular-nums">
                  ${invoice.amount.toFixed(2)}
                </span>
                <span className="border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft px-1.5 py-px text-[10px] font-medium text-accent-primary">
                  {invoice.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
