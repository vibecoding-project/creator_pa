"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  Search,
  RotateCw,
  Check,
  X,
  Zap,
  FileText,
  Banknote,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Send,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  inboxEmails,
  TAG_META,
  type InboxEmail,
  type InboxTag,
} from "@/lib/mock-data";
import { usePlan } from "@/components/billing/plan-store";
import { UsageBar } from "@/components/billing/usage-bar";

type Filter = "all" | InboxTag;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "high-budget", label: "Qualified" },
  { id: "needs-info", label: "Needs Info" },
  { id: "gifting", label: "Gifting" },
  { id: "spam", label: "Spam" },
];

const REC_POOL = [
  "Request rate card baseline ($2,500) and media kit before discussing scope.",
  "Detected budget is above your floor — counter with a bundled rate and lock a call slot.",
  "Ask for campaign budget and deliverable brief before quoting a firm number.",
  "Product-only offer under your $500 minimum — decline politely, keep the door open for next quarter.",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/* ------------------------------------------------------------------ */

export function InboxView() {
  const [emails, setEmails] = useState<InboxEmail[]>(inboxEmails);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(inboxEmails[0].id);
  const [syncing, setSyncing] = useState(false);

  const active = emails.filter(
    (e) => e.status === "unread" || e.status === "read"
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return active.filter((e) => {
      const matchesFilter = filter === "all" || e.tag === filter;
      const matchesQuery =
        !q ||
        e.sender.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [active, filter, query]);

  const selected =
    emails.find((e) => e.id === selectedId) ?? visible[0] ?? null;

  useEffect(() => {
    if (!syncing) return;
    const t = setTimeout(() => setSyncing(false), 1400);
    return () => clearTimeout(t);
  }, [syncing]);

  const resolve = (id: string, status: "approved" | "declined") => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: active.length,
      "high-budget": 0,
      "needs-info": 0,
      gifting: 0,
      spam: 0,
    };
    for (const e of active) c[e.tag]++;
    return c;
  }, [active]);

  return (
    <div className="flex h-full flex-col">
      {/* Page header */}
      <header className="flex shrink-0 items-center justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg font-semibold tracking-tight">
              Inbox &amp; Vetting
            </h1>
            <span className="border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft px-2 py-0.5 text-[10px] font-medium text-accent-primary">
              AI pre-vetted
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {active.length} actionable emails · 2 auto-replies scheduled today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSyncing(true)}
            disabled={syncing}
          >
            <RotateCw
              className={cn("size-3.5", syncing && "animate-spin")}
            />
            {syncing ? "Syncing…" : "Sync Gmail"}
          </Button>
        </div>
      </header>

      {/* Usage banner */}
      <div className="shrink-0 px-6 pb-3">
        <UsageBar variant="banner" />
      </div>

      {/* Split layout */}
      <div className="grid min-h-0 flex-1 grid-cols-1 border-t border-border lg:grid-cols-[340px_1fr]">
        {/* ------- Left: list ------- */}
        <section className="flex min-h-0 flex-col border-border lg:border-r">
          {/* Filter bar */}
          <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  data-active={filter === f.id}
                  className={cn(
                    "flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-none px-2.5 text-xs font-medium transition-colors",
                    filter === f.id
                      ? "bg-accent-primary-soft text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "rounded-none px-1.5 text-[10px] tabular-nums",
                      filter === f.id
                        ? "bg-foreground/10 text-foreground"
                        : "bg-foreground/5 text-muted-foreground"
                    )}
                  >
                    {counts[f.id]}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sender, brand, subject…"
                className="h-8 w-full rounded-none border border-border bg-muted/30 pr-3 pl-8 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#383838]"
              />
            </div>
          </div>

          {/* List */}
          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-slim">
            {visible.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <ShieldCheck className="size-6 text-muted-foreground/50" />
                <p className="text-[13px] text-muted-foreground">
                  Nothing here. The AI handled it.
                </p>
              </div>
            ) : (
              visible.map((email) => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  active={email.id === selected?.id}
                  onClick={() => setSelectedId(email.id)}
                />
              ))
            )}
          </div>

          {/* Footer stat */}
          <div className="flex shrink-0 items-center justify-between border-t border-border px-4 py-2.5">
            <span className="text-[11px] text-muted-foreground">
              {visible.length} of {active.length} shown
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#a0a0a0]">
              <Zap className="size-3" />
              {active.filter((e) => e.tag === "high-budget").length} qualified
            </span>
          </div>
        </section>

        {/* ------- Right: detail ------- */}
        <section className="min-h-0 flex-col lg:flex">
          {selected ? (
            <EmailDetail
              key={selected.id}
              email={selected}
              onApprove={() => resolve(selected.id, "approved")}
              onDecline={() => resolve(selected.id, "declined")}
              onNext={() => {
                const i = visible.findIndex((e) => e.id === selected.id);
                const next = visible[i + 1] ?? visible[0];
                if (next) setSelectedId(next.id);
              }}
            />
          ) : (
            <EmptyDetail />
          )}
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function EmailListItem({
  email,
  active,
  onClick,
}: {
  email: InboxEmail;
  active: boolean;
  onClick: () => void;
}) {
  const tag = TAG_META[email.tag];
  return (
    <button
      onClick={onClick}
      data-active={active}
      className={cn(
        "group w-full cursor-pointer border-b border-border/60 px-3 py-3 text-left transition-colors",
        active ? "bg-muted/60" : "hover:bg-muted/30"
      )}
    >
      <div className="flex items-start gap-2.5">
        <Avatar className="mt-0.5 size-8">
          <AvatarFallback className="bg-[#333333] text-[11px] font-semibold text-[#f0f0f0]">
            {email.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 truncate text-[13px] font-medium">
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-none",
                  email.status === "unread" ? tag.dot : "bg-transparent"
                )}
              />
              <span className="truncate">{email.company}</span>
            </p>
            <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
              {email.receivedAt}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[13px] text-foreground/90">
            {email.subject}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[12px] text-muted-foreground">
            {email.snippet}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-none border px-1.5 py-px text-[10px] font-medium",
                tag.pill
              )}
            >
              <span className={cn("size-1 rounded-none", tag.dot)} />
              {tag.label}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Sparkles className="size-2.5" />
              {email.confidence}%
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */

type ResolvedState = "idle" | "approved" | "declined";

function EmailDetail({
  email,
  onApprove,
  onDecline,
  onNext,
}: {
  email: InboxEmail;
  onApprove: () => void;
  onDecline: () => void;
  onNext: () => void;
}) {
  const [draft, setDraft] = useState(email.aiDraft);
  const [editing, setEditing] = useState(false);
  const [recIndex, setRecIndex] = useState(0);
  const [sending, setSending] = useState(false);
  const [resolved, setResolved] = useState<ResolvedState>("idle");
  const draftRef = useRef<HTMLTextAreaElement>(null);

  const { locked, openUpgrade, consumeEmail } = usePlan();

  const tag = TAG_META[email.tag];
  const isSpam = email.tag === "spam";

  const handleApprove = () => {
    if (locked) {
      openUpgrade();
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setResolved("approved");
      consumeEmail();
      onApprove();
    }, 900);
  };

  const handleDecline = () => {
    setResolved("declined");
    onDecline();
  };

  if (resolved !== "idle") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
        <div
          className={cn(
            "grid size-12 place-items-center rounded-none bg-[#282828] text-[#f0f0f0]",
            resolved === "approved"
              ? "text-[#f0f0f0]"
              : "text-[#a0a0a0]"
          )}
        >
          {resolved === "approved" ? (
            <Check className="size-5" />
          ) : (
            <X className="size-5" />
          )}
        </div>
        <div>
          <p className="font-heading text-base font-medium">
            {resolved === "approved" ? "Draft approved & sent" : "Deal declined"}
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {resolved === "approved"
              ? `Response sent to ${email.sender} on behalf of ${email.company}.`
              : `${email.company} has been moved out of your pipeline.`}
          </p>
        </div>
        <Button size="sm" onClick={onNext}>
          View next email
          <ArrowRight />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto scrollbar-slim">
      {/* Detail header */}
      <div className="shrink-0 border-b border-border px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading max-w-2xl text-[15px] leading-snug font-semibold tracking-tight">
            {email.subject}
          </h2>
          <span
            className={cn(
              "mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-none border px-2 py-0.5 text-[10px] font-medium",
              tag.pill
            )}
          >
            <span className={cn("size-1 rounded-none", tag.dot)} />
            {tag.label}
          </span>
        </div>

        {/* Sender row */}
        <div className="mt-3 flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-[#333333] text-xs font-semibold text-[#f0f0f0]">
              {email.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium">{email.sender}</p>
              <span className="text-[12px] text-muted-foreground">
                {email.company}
              </span>
            </div>
            <p className="truncate text-[12px] text-muted-foreground">
              {email.senderEmail}
            </p>
          </div>
        </div>

        {/* Fact pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="border-border text-muted-foreground">
            <FileText className="size-3" />
            {email.platform}
          </Badge>
          <Badge variant="outline" className="border-border text-muted-foreground">
            <Sparkles className="size-3 text-[#f0f0f0]" />
            {email.confidence}% confidence
          </Badge>
          {email.detectedBudget ? (
            <Badge
              variant="outline"
              className="border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft text-accent-primary"
            >
              <Banknote className="size-3" />
              {formatCurrency(email.detectedBudget)} detected
            </Badge>
          ) : (
            <Badge variant="outline" className="border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]">
              <AlertTriangle className="size-3" />
              No budget detected
            </Badge>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-5 px-6 py-5">
        {/* AI recommendation */}
        <div className="relative border border-[#333333] bg-[#1e1e1e] p-4">
          <div className="relative flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#f0f0f0] uppercase">
              <Sparkles className="size-3.5" />
              AI Assistant
            </p>
            <button
              onClick={() => setRecIndex((i) => (i + 1) % REC_POOL.length)}
              className="flex cursor-pointer items-center gap-1 rounded-none px-1.5 py-0.5 text-[11px] text-[#a0a0a0] transition-colors hover:bg-[#282828] hover:text-[#f0f0f0]"
            >
              <RefreshCw className="size-3" />
              Regenerate
            </button>
          </div>
          <p className="relative mt-2 text-[13px] leading-relaxed text-foreground/90">
            {REC_POOL[recIndex]}
          </p>
        </div>

        {/* Proposed deliverables */}
        {email.proposedDeliverables.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Proposed deliverables
            </p>
            <ul className="mt-2 space-y-1.5">
              {email.proposedDeliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-[13px] text-foreground/85"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-[#a0a0a0]" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Email body */}
        <div>
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Original email
          </p>
          <div className="mt-2 rounded-none border border-border bg-muted/20 p-4">
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-foreground/80">
              {email.body}
            </p>
          </div>
        </div>

        {/* Draft response */}
        {!isSpam ? (
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                <Send className="size-3" />
                Draft response
                <span className="border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft px-1.5 py-px text-[9px] font-medium text-accent-primary normal-case">
                  AI-written
                </span>
              </p>
              <button
                onClick={() => {
                  setEditing(true);
                  draftRef.current?.focus();
                }}
                className="cursor-pointer text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Edit draft
              </button>
            </div>
            <textarea
              ref={draftRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => setEditing(true)}
              rows={7}
              spellCheck={false}
              className="mt-2 w-full resize-none rounded-none border border-border bg-muted/20 p-4 text-[13px] leading-relaxed text-foreground/90 outline-none transition-colors focus:border-[#383838]"
            />
            {editing && (
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <p className="text-[11px] text-muted-foreground">
                  Draft persists until you approve or decline.
                </p>
                <button
                  onClick={() => setDraft(email.aiDraft)}
                  className="cursor-pointer text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Reset to AI version
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-start gap-2 border border-[#333333] bg-[#1e1e1e] p-4">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#a0a0a0]" />
            <div>
              <p className="text-[13px] font-medium text-[#a0a0a0]">
                Blocked as spam
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                Sender flagged at 99% confidence. Confirm to block and archive —
                no response is ever sent on your behalf.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action bar */}
      {locked && (
        <div className="flex shrink-0 items-center gap-2 border-t border-[#333333] bg-[#1e1e1e] px-6 py-2.5 text-[12px] text-[#a0a0a0]">
          <Lock className="size-3.5 shrink-0" />
          Automated replies are paused — your 100-email allowance is used up
          this cycle. Upgrade to keep sending.
        </div>
      )}
      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-6 py-3.5">
        <Button
          variant="ghost"
          size="sm"
          className="text-[#a0a0a0]"
          onClick={handleDecline}
        >
          {isSpam ? "Block & archive" : "Decline deal"}
        </Button>
        {!isSpam && (
          <Button
            size="sm"
            variant="accent"
            onClick={handleApprove}
            disabled={sending || draft.trim().length === 0}
            className={cn(
              locked && "border-[#383838] bg-[#333333]/50 text-[#a0a0a0] hover:border-[#444444] hover:bg-[#333333]/50"
            )}
          >
            {locked ? (
              <Lock className="size-3.5" />
            ) : sending ? (
              <RotateCw className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            {locked
              ? "Upgrade to reply"
              : sending
                ? "Sending…"
                : "Approve & Send"}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function EmptyDetail() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <div className="grid size-12 place-items-center rounded-none bg-muted">
        <Zap className="size-5 text-muted-foreground" />
      </div>
      <p className="text-[13px] text-muted-foreground">
        Select an email to review the AI recommendation.
      </p>
    </div>
  );
}
