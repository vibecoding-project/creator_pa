"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Zap,
  Sparkles,
  Banknote,
  Flame,
  Check,
  Target,
  Lock,
  Inbox,
  Layers,
  CalendarDays,
  Settings,
  ThumbsUp,
  Pencil,
  OctagonX,
  Handshake,
  Star,
  Bot,
  FileText,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Warm Obsidian & Muted Neutral palette (Palette 2)                   */
/*  Surfaces: #121212 page · #1e1e1e cards · #282828 hover/active      */
/*  Borders: #333333 · Buttons: #222222 / #383838                      */
/*  Text: #f0f0f0 / #a0a0a0 · Fill: #666666                            */
/*  Status: accent strip (active) · gray strip #a0a0a0 (pending)       */
/*  The active accent color is user-selectable (see AccentProvider)    */
/*  Sharp edges everywhere — no corner radius, no neon, no glow.        */
/* ------------------------------------------------------------------ */

type HubNavId = "inbox" | "deals" | "calendar" | "settings";

const NAV_ITEMS: {
  id: HubNavId;
  label: string;
  href: string;
  icon: typeof Inbox;
  badge?: number;
}[] = [
  { id: "inbox", label: "INBOX & VETTING", href: "/inbox", icon: Inbox, badge: 3 },
  { id: "deals", label: "DEALS PIPELINE", href: "/deals", icon: Layers, badge: 8 },
  { id: "calendar", label: "CALENDAR", href: "/calendar", icon: CalendarDays },
  { id: "settings", label: "SETTINGS", href: "/settings", icon: Settings },
];

type HubBadge = "high-budget" | "needs-info" | "gifting";

const BADGE_META: Record<
  HubBadge,
  { label: string; className: string; dot: string }
> = {
  "high-budget": {
    label: "HIGH BUDGET",
    className:
      "border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft text-accent-primary",
    dot: "bg-accent-primary",
  },
  "needs-info": {
    label: "NEEDS INFO",
    className:
      "border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]",
    dot: "bg-[#a0a0a0]",
  },
  gifting: {
    label: "PRODUCT GIFTING",
    className:
      "border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]",
    dot: "bg-[#a0a0a0]",
  },
};

interface HubEmail {
  id: string;
  sender: string;
  initials: string;
  company: string;
  email: string;
  subject: string;
  time: string;
  badge: HubBadge;
  summary: string;
}

const EMAILS: HubEmail[] = [
  {
    id: "h-01",
    sender: "Sarah Mitchell",
    initials: "SM",
    company: "Lumina Skincare",
    email: "sarah@luminaskincare.co",
    subject: "Q3 skincare collab — budget secured",
    time: "12m ago",
    badge: "high-budget",
    summary:
      "Hey, the m-other an email concepts to adiplacing elit, and draft and bring your content and thus chanage for your hair.",
  },
  {
    id: "h-02",
    sender: "Daniel Reyes",
    initials: "DR",
    company: "Pulse Fitness",
    email: "daniel@pulsefit.app",
    subject: "App sponsorship — need your rate card",
    time: "2h ago",
    badge: "needs-info",
    summary:
      "Hi there, we're launching our fitness app next month and your audience fits perfectly. Could you share your rate card and media kit before we lock in a number?",
  },
  {
    id: "h-03",
    sender: "Ava Thompson",
    initials: "AT",
    company: "Brewly Coffee",
    email: "ava@brewlycoffee.com",
    subject: "Free coffee bundle for an unboxing",
    time: "5h ago",
    badge: "gifting",
    summary:
      "We'd love to send you our full tasting box for an honest unboxing or story — no budget this quarter, just great coffee.",
  },
];

const MILESTONES = [
  {
    title: "MEDIA KIT CONNECTED",
    icon: FileText,
    state: "done" as const,
  },
  {
    title: "10 AI REPLIES SENT",
    icon: Bot,
    state: "done" as const,
  },
  {
    title: "CLOSE A $1k DEAL",
    icon: Target,
    state: "progress" as const,
    value: "3/5 DEALS",
    progress: 60,
  },
  {
    title: "UNLOCK LEVEL 3: NEGOTIATION PRO",
    icon: Lock,
    state: "locked" as const,
    value: "75% TO UNLOCK",
    progress: 75,
  },
];

const ACHIEVEMENTS = [
  {
    title: "FAST RESPONDER",
    icon: Zap,
    subtitle: "Replied to 10 deals within 1 hour",
    xp: "+50 XP",
  },
  {
    title: "DEAL MAKER",
    icon: Handshake,
    subtitle: "Closed your first $1,000+ sponsorship",
    xp: "+100 XP",
  },
  {
    title: "BRAND FAVORITE",
    icon: Star,
    subtitle: "Invited back by 3 returning brands",
    xp: "+75 XP",
  },
];

/* ------------------------------------------------------------------ */

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: typeof Trophy;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <Icon className="size-4 text-[#a0a0a0]" />
        <div>
          <h2 className="font-heading text-[11px] font-bold tracking-[0.22em] text-[#f0f0f0] uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-[#a0a0a0]">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ------------------------- Animated progress ------------------------ */

function AnimatedProgress({
  value,
  className,
  muted = false,
}: {
  value: number;
  className?: string;
  muted?: boolean;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setWidth(value));
    });
    return () => cancelAnimationFrame(t);
  }, [value]);

  return (
    <div
      className={cn(
        "relative h-2.5 w-full overflow-hidden bg-[#282828]",
        className
      )}
    >
      <div
        className={cn(
          "h-full transition-all duration-1000 ease-out",
          muted ? "bg-[#666666]" : "bg-accent-primary"
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

/* ------------------------------- Header ----------------------------- */

function HubHeader() {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <div className="grid size-11 shrink-0 place-items-center rounded-none bg-[#282828] ring-1 ring-[#383838]">
          <Trophy className="size-6 text-[#f0f0f0]" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold tracking-[0.14em] text-[#f0f0f0] sm:text-xl">
            CREATOR SPONSORSHIP HUB
          </h1>
          <p className="mt-0.5 text-xs text-[#a0a0a0]">
            Your brand-deal command center
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-none border border-[#333333] bg-[#1e1e1e] px-3 py-2">
          <Zap className="size-4 text-[#f0f0f0]" />
          <span className="text-xs font-semibold text-[#f0f0f0]">
            LEVEL 1/0
          </span>
        </div>
        <div className="w-44">
          <div className="flex items-center justify-between text-[10px] font-medium">
            <span className="tracking-[0.14em] text-[#a0a0a0] uppercase">
              XP Progress
            </span>
            <span className="tabular-nums text-[#a0a0a0]">240 / 500</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden bg-[#282828]">
            <div className="h-full w-[48%] bg-accent-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}

/* --------------------------- Gamification --------------------------- */

function RevenueGoalCard() {
  return (
    <div className="rounded-none border border-[#333333] bg-[#1e1e1e] p-6 transition-colors hover:border-[#3a3a3a]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#a0a0a0] uppercase">
          Monthly Revenue Goal
        </p>
        <span className="grid size-8 place-items-center rounded-none bg-[#282828] text-[#a0a0a0] ring-1 ring-[#383838]">
          <Banknote className="size-4" />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
        <span className="font-heading text-2xl font-bold text-[#f0f0f0] sm:text-3xl">
          $14,500
        </span>
        <span className="text-base text-[#a0a0a0]">/</span>
        <span className="text-base text-[#a0a0a0]">$ 20,000</span>
        <span className="ml-1 inline-flex items-center border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent-primary">
          SECURED
        </span>
      </div>

      <div className="mt-5">
        <AnimatedProgress value={72.5} />
        <div className="mt-2.5 flex items-center justify-between text-[11px]">
          <span className="tabular-nums text-[#a0a0a0]">72.5% secured</span>
          <span className="text-[#a0a0a0]">$5,500 to goal</span>
        </div>
      </div>
    </div>
  );
}

function StreakCard() {
  return (
    <div className="rounded-none border border-[#333333] bg-[#1e1e1e] p-6 transition-colors hover:border-[#3a3a3a]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#a0a0a0] uppercase">
          Active Streak
        </p>
        <span className="inline-flex items-center gap-1 rounded-none border border-[#333333] bg-[#282828] px-2.5 py-1 text-[10px] font-semibold text-[#a0a0a0]">
          <Zap className="size-3 text-[#f0f0f0]" />
          250 XP
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-none bg-[#282828] ring-1 ring-[#383838]">
          <Flame className="size-6 text-[#a0a0a0]" fill="currentColor" />
        </span>
        <p className="font-heading text-xl font-bold text-[#f0f0f0] sm:text-2xl">
          5 DAYS INBOX ZERO
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[#a0a0a0]">
        You cleared your inbox before noon, 5 days running. Your daily
        check-in resets at 9:00 AM — keep it alive to hit{" "}
        <span className="text-[#f0f0f0]">Level 2</span> next week.
      </p>
    </div>
  );
}

function GamificationSection() {
  return (
    <section className="space-y-4">
      <SectionHeading
        icon={Trophy}
        title="Your Creator Partnership Journey"
        subtitle="Track revenue, stay consistent, and level up your sponsorship game."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <RevenueGoalCard />
        <StreakCard />
      </div>
    </section>
  );
}

/* ------------------------------ Milestones -------------------------- */

function MilestoneCard({
  title,
  icon: Icon,
  state,
  value,
  progress,
}: (typeof MILESTONES)[number]) {
  const done = state === "done";
  const active = state !== "locked";

  return (
    <div
      className={cn(
        "flex flex-col border border-[#333333] bg-[#1e1e1e] p-5 transition-colors hover:border-[#3a3a3a]",
        "border-l-2",
        active ? "border-l-accent-primary" : "border-l-[#a0a0a0]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-none ring-1 ring-[#383838]",
            done
              ? "bg-accent-primary-soft text-accent-primary"
              : "bg-[#282828] text-[#f0f0f0]"
          )}
        >
          {done ? (
            <Check className="size-6" strokeWidth={3} />
          ) : (
            <Icon className="size-5" />
          )}
        </span>
        <span
          className={cn(
            "border border-l-2 border-[#333333] px-2 py-0.5 text-[9px] font-bold tracking-[0.14em] uppercase",
            active ? "border-l-accent-primary" : "border-l-[#a0a0a0]",
            active
              ? "bg-accent-primary-soft text-accent-primary"
              : "bg-[#1e1e1e] text-[#a0a0a0]"
          )}
        >
          {done ? "Completed" : state === "progress" ? "In progress" : "Locked"}
        </span>
      </div>

      <p className="mt-4 text-[11px] leading-snug font-bold tracking-[0.12em] text-[#f0f0f0] uppercase">
        {title}
      </p>

      {(state === "progress" || state === "locked") && (
        <div className="mt-auto pt-4">
          <p className="text-sm font-bold tabular-nums text-[#f0f0f0]">
            {value}
          </p>
          <AnimatedProgress
            value={progress ?? 0}
            muted={state === "locked"}
            className="mt-2 h-1.5"
          />
        </div>
      )}
    </div>
  );
}

function MilestonesSection() {
  return (
    <section className="space-y-4">
      <SectionHeading
        icon={Target}
        title="Your Progress"
        subtitle="Four steps to becoming a negotiation pro."
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {MILESTONES.map((m) => (
          <MilestoneCard key={m.title} {...m} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- Inbox ------------------------------ */

function InboxNav({
  active,
  onSelect,
}: {
  active: HubNavId;
  onSelect: (id: HubNavId) => void;
}) {
  return (
    <nav className="flex flex-row gap-1.5 overflow-x-auto p-3 scrollbar-none lg:flex-col lg:overflow-visible">
      {NAV_ITEMS.map((item) => {
        const selected = item.id === active;
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => onSelect(item.id)}
            className={cn(
              "group relative flex shrink-0 items-center gap-2.5 rounded-none px-3 py-2.5 text-[11px] font-semibold tracking-[0.08em] transition-colors",
              selected
                ? "bg-[#282828] text-[#f0f0f0]"
                : "bg-transparent text-[#a0a0a0] hover:bg-[#1e1e1e] hover:text-[#f0f0f0]"
            )}
          >
            {selected && (
              <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-none bg-accent-primary" />
            )}
            <item.icon
              className={cn(
                "size-4 shrink-0",
                selected
                  ? "text-[#f0f0f0]"
                  : "text-[#a0a0a0] group-hover:text-[#f0f0f0]"
              )}
            />
            <span className="whitespace-nowrap">{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "ml-auto rounded-none px-1.5 py-px text-[9px] font-bold tabular-nums",
                  selected
                    ? "bg-[#333333] text-[#c2c2c2]"
                    : "bg-[#282828] text-[#a0a0a0]"
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function InboxList({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="flex min-h-0 flex-col bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-[#333333] px-5 py-4">
        <h3 className="font-heading text-[13px] font-bold tracking-[0.12em] text-[#f0f0f0] uppercase">
          Inbox &amp; Vetting
        </h3>
        <span className="inline-flex items-center gap-1 rounded-none border border-[#333333] bg-[#282828] px-2 py-0.5 text-[10px] font-semibold text-[#a0a0a0]">
          <Sparkles className="size-3 text-[#f0f0f0]" />
          AI VETTED
        </span>
      </div>

      <div className="flex min-h-0 flex-col overflow-y-auto scrollbar-slim">
        {EMAILS.map((email) => {
          const meta = BADGE_META[email.badge];
          const selected = email.id === selectedId;
          return (
            <button
              key={email.id}
              onClick={() => onSelect(email.id)}
              className={cn(
                "group border-b border-[#333333]/70 bg-[#121212] px-5 py-4 text-left transition-colors",
                selected
                  ? "bg-[#282828]"
                  : "hover:bg-[#1e1e1e]"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-none text-[11px] font-bold text-[#f0f0f0] ring-1 ring-[#4a4a4a]",
                    "bg-[#333333]"
                  )}
                >
                  {email.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] font-semibold text-[#f0f0f0]">
                      {email.company}
                    </p>
                    <span className="shrink-0 text-[10px] text-[#a0a0a0] tabular-nums">
                      {email.time}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-[#c2c2c2]">
                    {email.subject}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-none border px-2 py-0.5 text-[10px] font-bold tracking-wide",
                        meta.className
                      )}
                    >
                      <span className={cn("size-1.5 rounded-none", meta.dot)} />
                      {meta.label}
                    </span>
                    {selected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#a0a0a0]">
                        <ChevronRight className="size-3" />
                        Reviewing
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-[#333333] bg-[#1e1e1e] px-5 py-3">
        <span className="text-[11px] text-[#a0a0a0]">
          {EMAILS.length} actionable emails
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#a0a0a0]">
          <ShieldCheck className="size-3.5 text-[#f0f0f0]" />
          Spam filtered
        </span>
      </div>
    </section>
  );
}

/* ------------------------------ Detail ------------------------------ */

type ActionState = "idle" | "approved" | "edited" | "declined";

const ACTION_BUTTON =
  "flex h-12 w-full items-center justify-center gap-2 border border-[#383838] bg-[#222222] text-sm font-bold text-[#f0f0f0] transition-colors hover:border-[#444444] hover:bg-[#2e2e2e] active:scale-[0.99]";

const APPROVE_BUTTON =
  "flex h-12 w-full items-center justify-center gap-2 border border-accent-primary bg-accent-primary text-sm font-bold text-accent-primary-contrast transition-colors hover:border-accent-primary-strong hover:bg-accent-primary-strong active:scale-[0.99]";

function ActionDetail({
  email,
  action,
  onAction,
}: {
  email: HubEmail;
  action: ActionState;
  onAction: (state: ActionState) => void;
}) {
  const meta = BADGE_META[email.badge];

  if (action !== "idle") {
    const done = action === "approved";
    const text =
      action === "approved"
        ? "Draft approved — reply is queued to send."
        : action === "edited"
          ? "Draft opened in the editor for your tweaks."
          : "Deal declined — brand moved out of pipeline.";
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <span
          className={cn(
            "grid size-12 place-items-center rounded-none bg-[#282828] ring-1 ring-[#383838]",
            done ? "text-[#f0f0f0]" : "text-[#a0a0a0]"
          )}
        >
          {done ? (
            <Check className="size-6" strokeWidth={3} />
          ) : action === "declined" ? (
            <OctagonX className="size-6" />
          ) : (
            <Pencil className="size-5" />
          )}
        </span>
        <p className="font-heading text-sm font-bold text-[#f0f0f0] uppercase">
          {action === "approved"
            ? "Approved"
            : action === "declined"
              ? "Declined"
              : "Editing"}
        </p>
        <p className="text-xs text-[#a0a0a0]">{text}</p>
        <button
          onClick={() => onAction("idle")}
          className="mt-1 text-[11px] font-semibold text-[#a0a0a0] transition-colors hover:text-[#f0f0f0]"
        >
          Back to review
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e]">
      {/* Sender */}
      <div className="border-b border-[#333333] px-5 py-4">
        <p className="text-[10px] font-bold tracking-[0.18em] text-[#a0a0a0] uppercase">
          Sender
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-none bg-[#333333] text-[13px] font-bold text-[#f0f0f0] ring-1 ring-[#4a4a4a]">
            {email.initials}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-[#f0f0f0]">
                {email.sender}
              </p>
              <span
                className={cn(
                  "hidden rounded-none border px-1.5 py-px text-[9px] font-bold tracking-wide sm:inline-flex",
                  meta.className
                )}
              >
                {meta.label}
              </span>
            </div>
            <p className="truncate text-xs text-[#a0a0a0]">{email.email}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-none bg-[#282828] text-[#f0f0f0] ring-1 ring-[#383838]">
            <Sparkles className="size-3.5" />
          </span>
          <p className="text-[10px] font-bold tracking-[0.18em] text-[#a0a0a0] uppercase">
            Summary
          </p>
        </div>
        <div className="rounded-none border border-[#333333] bg-[#121212] p-4">
          <p className="text-[13px] leading-relaxed text-[#a0a0a0]">
            {email.summary}
          </p>
        </div>
        <p className="text-[11px] leading-relaxed text-[#a0a0a0]">
          AI flagged this as{" "}
          <span className="font-semibold text-[#f0f0f0]">
            {meta.label.toLowerCase()}
          </span>{" "}
          — review the draft below and approve, edit, or decline.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-2.5 border-t border-[#333333] px-5 py-4">
        <p className="text-[10px] font-bold tracking-[0.18em] text-[#a0a0a0] uppercase">
          AI Actions
        </p>
        <button onClick={() => onAction("approved")} className={APPROVE_BUTTON}>
          <ThumbsUp className="size-4.5 text-accent-primary-contrast" />
          APPROVE DRAFT
        </button>
        <button onClick={() => onAction("edited")} className={ACTION_BUTTON}>
          <Pencil className="size-4.5 text-[#a0a0a0]" />
          EDIT DRAFT
        </button>
        <button onClick={() => onAction("declined")} className={ACTION_BUTTON}>
          <OctagonX className="size-4.5 text-[#a0a0a0]" />
          DECLINE
        </button>
      </div>
    </div>
  );
}

function SplitView() {
  const [activeNav, setActiveNav] = useState<HubNavId>("inbox");
  const [selectedId, setSelectedId] = useState(EMAILS[0].id);
  const [action, setAction] = useState<ActionState>("idle");

  const email = EMAILS.find((e) => e.id === selectedId) ?? EMAILS[0];

  return (
    <section className="space-y-4">
      <SectionHeading
        icon={Inbox}
        title="Inbox & Vetting"
        subtitle="Let the AI sort the noise — you only see what matters."
        action={
          <span className="hidden items-center gap-1.5 rounded-none border border-[#333333] bg-[#1e1e1e] px-3 py-1 text-[10px] font-bold tracking-wide text-[#a0a0a0] uppercase sm:inline-flex">
            <Sparkles className="size-3 text-[#f0f0f0]" />
            AI Assistant active
          </span>
        }
      />

      <div className="grid overflow-hidden rounded-none border border-[#333333] bg-[#121212] lg:grid-cols-[210px_minmax(0,1fr)_minmax(0,420px)]">
        <div className="border-b border-[#333333] bg-[#121212] lg:border-r lg:border-b-0">
          <InboxNav active={activeNav} onSelect={setActiveNav} />
        </div>
        <div className="border-b border-[#333333] lg:border-r lg:border-b-0">
          <InboxList selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <ActionDetail
          key={email.id}
          email={email}
          action={action}
          onAction={setAction}
        />
      </div>
    </section>
  );
}

/* ---------------------------- Achievements --------------------------- */

function AchievementsSection() {
  return (
    <section className="space-y-4">
      <SectionHeading
        icon={Star}
        title="Achievements Unlocked"
        subtitle="Milestones your hustle earned along the way."
        action={
          <span className="inline-flex items-center gap-1 rounded-none border border-[#333333] bg-[#282828] px-2.5 py-1 text-[10px] font-bold text-[#a0a0a0]">
            <Zap className="size-3 text-[#f0f0f0]" />
            XP
          </span>
        }
      />
      <div className="grid gap-5 sm:grid-cols-3">
        {ACHIEVEMENTS.map((a) => (
          <div
            key={a.title}
            className="rounded-none border border-[#333333] bg-[#1e1e1e] p-5 transition-colors hover:border-[#3a3a3a]"
          >
            <div className="flex items-start justify-between">
              <span className="grid size-10 place-items-center rounded-none bg-[#282828] text-[#a0a0a0] ring-1 ring-[#383838]">
                <a.icon className="size-5" />
              </span>
              <span className="border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft px-2 py-0.5 text-[9px] font-bold tracking-[0.14em] text-accent-primary uppercase">
                Unlocked
              </span>
            </div>
            <p className="mt-4 text-[12px] font-bold tracking-[0.12em] text-[#f0f0f0] uppercase">
              {a.title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#a0a0a0]">
              {a.subtitle}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-[#333333] pt-3">
              <span className="text-[10px] text-[#a0a0a0]">Reward</span>
              <span className="text-[11px] font-bold text-[#a0a0a0] tabular-nums">
                {a.xp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function HubView() {
  return (
    <div className="min-h-dvh bg-[#121212] text-[#c2c2c2]">
      <div className="mx-auto w-full max-w-[1400px] space-y-10 px-5 py-8 sm:px-8 sm:py-10">
        <HubHeader />
        <GamificationSection />
        <MilestonesSection />
        <div className="h-px bg-[#333333]" />
        <SplitView />
        <AchievementsSection />
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-[#333333] pt-6 text-[11px] text-[#a0a0a0] sm:flex-row">
          <p>CREATOR SPONSORSHIP HUB · Level 1/0 · 240/500 XP</p>
          <p className="flex items-center gap-1.5">
            <Sparkles className="size-3 text-[#f0f0f0]" />
            AI pre-vetted every inbox · Stay on the streak
          </p>
        </footer>
      </div>
    </div>
  );
}
