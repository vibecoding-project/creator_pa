"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Shield,
  Plug,
  Mail,
  CalendarDays,
  MonitorPlay,
  Check,
  Copy,
  Sparkles,
  Save,
  SlidersHorizontal,
  Crown,
  Flame,
  Lock,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAccent } from "@/components/accent-provider";
import {
  rateCard as seedRateCard,
  automationRules as seedRules,
  connectedAccounts as seedAccounts,
  PLAN_META,
  type AutomationRule,
  type ConnectedAccount,
} from "@/lib/mock-data";
import { usePlan } from "@/components/billing/plan-store";
import { UsageBar } from "@/components/billing/usage-bar";

/* ------------------------------------------------------------------ */

export function SettingsView() {
  const [rate, setRate] = useState({ ...seedRateCard });
  const [rules, setRules] = useState<AutomationRule[]>(seedRules);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(seedAccounts);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const { tier, emailsUsed, limit, cycle, locked, setTier, simulateCap } =
    usePlan();
  const plan = PLAN_META[tier];
  const unlimited = limit === null;
  const { accent, setAccent, presets } = useAccent();

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2200);
    return () => clearTimeout(t);
  }, [saved]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const toggleRule = (id: string) =>
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );

  const toggleAccount = (id: string) =>
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, connected: !a.connected } : a))
    );

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-6 pb-16">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg font-semibold tracking-tight">
              Preference Matrix
            </h1>
            <span className="rounded-none bg-[#282828] px-2 py-0.5 text-[10px] font-medium text-[#a0a0a0]">
              sets your AI&apos;s bounds
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Everything here shapes every recommendation, draft, and auto-action.
          </p>
        </div>
        <Button
          size="sm"
          variant="accent"
          onClick={() => setSaved(true)}
        >
          <Save />
          Save changes
        </Button>
      </header>

      <div className="mt-6 space-y-5">
        {/* Appearance & theme */}
        <Section
          icon={<Palette className="size-4" />}
          title="Appearance & Theme"
          description="Pick a single accent color. It threads through nav highlights, primary buttons, progress fills, and key status badges."
        >
          <div className="flex flex-wrap items-start gap-4">
            {presets.map((p) => {
              const active = p.id === accent;
              return (
                <button
                  key={p.id}
                  onClick={() => setAccent(p.id)}
                  aria-pressed={active}
                  aria-label={`Set accent to ${p.name}`}
                  className="group flex w-14 flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "grid size-9 w-full place-items-center rounded-none border transition-colors",
                      active
                        ? "border-foreground ring-1 ring-foreground"
                        : "border-[#333333] group-hover:border-[#4a4a4a]"
                    )}
                    style={{ backgroundColor: p.hex }}
                  >
                    {active && (
                      <Check
                        className="size-4"
                        style={{ color: p.on }}
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Applied instantly across the studio — no reload needed.
          </p>
        </Section>

        {/* AI operating bounds summary */}
        <div className="relative border border-[#333333] bg-[#1e1e1e] p-4">
          <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#f0f0f0] uppercase">
              <SlidersHorizontal className="size-3.5" />
              Operating bounds
            </span>
            <span className="text-[12px] text-muted-foreground">
              Min dedicated{" "}
              <strong className="font-medium text-foreground">$2,500</strong> · Min
              integration <strong className="font-medium text-foreground">$1,200</strong> ·{" "}
              <strong className="font-medium text-foreground">
                {rules.filter((r) => r.enabled).length}
              </strong>{" "}
              of {rules.length} rules live
            </span>
            <span className="ml-auto flex items-center gap-1 text-[12px] text-[#a0a0a0]">
              <Sparkles className="size-3.5" />
              Applied to 8 inbox items
            </span>
          </div>
        </div>

        {/* Plan & usage */}
        <Section
          icon={<Sparkles className="size-4" />}
          title="Plan & Usage"
          description="Your tier sets the email allowance and which AI features stay unlocked."
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-medium">
                Studio {plan.name}
                <span className="text-muted-foreground">
                  {" "}
                  · ${plan.price}/month
                </span>
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {unlimited
                  ? "Unlimited emails this cycle"
                  : `${emailsUsed} of ${limit} emails processed · ${cycle}`}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "text-[12px] font-medium",
                  tier === "basic" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Basic
              </span>
              <Switch
                checked={tier === "premium"}
                onCheckedChange={(checked) =>
                  setTier(checked ? "premium" : "basic")
                }
                aria-label="Toggle between Basic and Premium plan"
              />
              <span
                className={cn(
                  "flex items-center gap-1 text-[12px] font-medium",
                  tier === "premium"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Crown className="size-3" />
                Premium
              </span>
            </div>
          </div>

          <UsageBar variant="banner" className="mt-4" />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={simulateCap}
              disabled={tier === "premium"}
            >
              <Flame className="size-3.5" />
              Simulate hitting the cap
            </Button>
            <Link href="/app/settings/billing">
              <Button variant="ghost" size="sm">
                <CreditCard className="size-3.5" />
                View billing &amp; plans
              </Button>
            </Link>
          </div>
          {locked && (
            <p className="mt-3 flex items-center gap-1.5 rounded-none border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] px-3 py-2 text-[12px] text-[#a0a0a0]">
              <Lock className="size-3.5 shrink-0" />
              Cap reached — automated replies are paused. Upgrade to Premium to
              resume.
            </p>
          )}
        </Section>

        {/* Rate card */}
        <Section
          icon={<CreditCard className="size-4" />}
          title="Rate Card Settings"
          description="Floor rates the AI enforces when it vets incoming deals. Offers below these get flagged."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rate-dedicated" className="mb-1.5 block text-[12px] font-medium">
                Minimum dedicated post rate
              </label>
              <MoneyInput
                id="rate-dedicated"
                value={rate.minDedicated}
                onChange={(v) => setRate((r) => ({ ...r, minDedicated: v }))}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                One long-form / dedicated video.
              </p>
            </div>
            <div>
              <label htmlFor="rate-integration" className="mb-1.5 block text-[12px] font-medium">
                Minimum integration rate
              </label>
              <MoneyInput
                id="rate-integration"
                value={rate.minIntegration}
                onChange={(v) => setRate((r) => ({ ...r, minIntegration: v }))}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Segment or integrated mention within a video.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-none border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft px-3 py-2.5">
            <Sparkles className="size-3.5 shrink-0 text-accent-primary" />
            <p className="text-[12px] text-muted-foreground">
              The AI auto-sends this rate card to senders with a detected budget above{" "}
              <strong className="font-medium text-[#a0a0a0]">$1,000</strong>.
            </p>
          </div>
        </Section>

        {/* Automated rules */}
        <Section
          icon={<Shield className="size-4" />}
          title="Automated Rules"
          description="Toggle what the AI does without asking you first."
        >
          <div className={cn("space-y-1", locked && "pointer-events-none opacity-50")}>
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center gap-3 rounded-none px-2 py-2.5 transition-colors hover:bg-muted/40"
              >
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                  id={`rule-${rule.id}`}
                  disabled={locked}
                />
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`rule-${rule.id}`}
                    className="block cursor-pointer text-[13px] font-medium"
                  >
                    {rule.label}
                  </label>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                    {rule.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 border-none",
                    rule.enabled
                      ? "border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft text-accent-primary"
                      : "border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]"
                  )}
                >
                  {rule.enabled ? "Active" : "Off"}
                </Badge>
              </div>
            ))}
          </div>
          {locked && (
            <p className="mt-2 flex items-center gap-1.5 rounded-none border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] px-3 py-2 text-[12px] text-[#a0a0a0]">
              <Lock className="size-3.5 shrink-0" />
              Automated rules are locked while the cap is reached. Upgrade to
              re-enable.
            </p>
          )}
        </Section>

        {/* Connected accounts */}
        <Section
          icon={<Plug className="size-4" />}
          title="Connected Accounts"
          description="What the assistant can see and act on."
        >
          <div className="space-y-2">
            {accounts.map((acc) => (
              <AccountRow
                key={acc.id}
                account={acc}
                copied={copied}
                onToggle={() => toggleAccount(acc.id)}
                onCopy={() => setCopied(true)}
              />
            ))}
          </div>
        </Section>
      </div>

      {/* Save toast */}
      <div
        data-visible={saved}
        aria-live="polite"
        className={cn(
          "fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-none border border-l-2 border-l-accent-primary border-[#333333] bg-[#1e1e1e] px-3.5 py-2.5 text-[13px] text-[#a0a0a0] shadow-lg backdrop-blur transition-all duration-200",
          saved
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <Check className="size-4" />
        Preferences saved — bounds updated
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-none border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-none bg-foreground/5 text-muted-foreground">
          {icon}
        </span>
        <div>
          <h2 className="text-[14px] font-medium">{title}</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MoneyInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-muted-foreground">
        $
      </span>
      <Input
        id={id}
        type="number"
        min={0}
        value={value || ""}
        placeholder="0"
        onChange={(e) => onChange(Number(e.target.value))}
        className="pl-7 tabular-nums"
      />
    </div>
  );
}

const ACCOUNT_ICONS: Record<string, React.ReactNode> = {
  "acc-1": <Mail className="size-4" />,
  "acc-2": <CalendarDays className="size-4" />,
  "acc-3": <MonitorPlay className="size-4" />,
};

function AccountRow({
  account,
  copied,
  onToggle,
  onCopy,
}: {
  account: ConnectedAccount;
  copied: boolean;
  onToggle: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-none border border-border px-3 py-3 transition-colors hover:border-[#383838]">
      <span className="grid size-8 shrink-0 place-items-center rounded-none bg-foreground/5 text-muted-foreground">
        {ACCOUNT_ICONS[account.id]}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-medium">{account.name}</p>
          <span
            className={cn(
              "flex items-center gap-1 text-[10px] font-medium",
              account.connected ? "text-[#a0a0a0]" : "text-muted-foreground"
            )}
          >
              <span
                className={cn(
                  "size-1.5 rounded-none",
                  account.connected ? "bg-accent-primary" : "bg-muted-foreground"
                )}
              />
            {account.connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{account.detail}</p>
      </div>
      {account.id === "acc-2" && (
        <Button variant="outline" size="xs" onClick={onCopy} className="shrink-0">
          {copied ? <Check className="size-3 text-[#a0a0a0]" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
      )}
      <Button
        variant="ghost"
        size="xs"
        onClick={onToggle}
        className={cn(
          "shrink-0 text-muted-foreground",
          account.connected
            ? "hover:text-[#f0f0f0]"
            : "text-[#a0a0a0] hover:bg-[#282828]"
        )}
      >
        {account.connected ? "Disconnect" : "Reconnect"}
      </Button>
    </div>
  );
}
