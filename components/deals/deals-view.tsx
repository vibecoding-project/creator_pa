"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  LayoutGrid,
  Rows3,
  CalendarClock,
  MoreVertical,
  ArrowRight,
  Check,
  Timer,
  CircleDollarSign,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createDeal, updateDealStatus } from "@/app/actions/deals";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  STAGES,
  STAGE_ORDER,
  PLATFORM_META,
  type Deal,
  type DealStage,
  type Platform,
  type DealStatus,
} from "@/lib/mock-data";

const COLUMN_META: Record<DealStage, { dot: string; icon: React.ReactNode }> = {
  conversation: { dot: "bg-[#a0a0a0]", icon: null },
  "rate-lock": { dot: "bg-[#a0a0a0]", icon: null },
  deliverable: { dot: "bg-[#a0a0a0]", icon: null },
  "payment-due": { dot: "bg-[#a0a0a0]", icon: null },
  completed: { dot: "bg-[#a0a0a0]", icon: null },
};

const STATUS_STYLE: Record<DealStatus, string> = {
  Active:
    "border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft text-accent-primary",
  Review:
    "border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]",
  Uploaded:
    "border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]",
  Invoiced:
    "border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]",
  Paid: "border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft text-accent-primary",
  Closed:
    "border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]",
};

function statusForStage(stage: DealStage): DealStatus {
  switch (stage) {
    case "conversation":
      return "Active";
    case "rate-lock":
      return "Review";
    case "deliverable":
      return "Uploaded";
    case "payment-due":
      return "Invoiced";
    case "completed":
      return "Paid";
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/* ------------------------------------------------------------------ */

export function DealsView({
  autoOpenNew,
  initialDeals,
}: {
  autoOpenNew: boolean;
  initialDeals: Deal[];
}) {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [view, setView] = useState<"board" | "table">("board");
  const [dialogOpen, setDialogOpen] = useState(autoOpenNew);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const active = deals.filter((d) => d.stage !== "completed");
    const paymentDue = deals.filter((d) => d.stage === "payment-due");
    const completed = deals.filter((d) => d.stage === "completed");
    return {
      activeValue: active.reduce((s, d) => s + d.value, 0),
      dueValue: paymentDue.reduce((s, d) => s + d.value, 0),
      completedCount: completed.length,
      dueCount: paymentDue.length,
    };
  }, [deals]);

  const moveDeal = (id: string, stage: DealStage) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              stage,
              status: statusForStage(stage),
              deadline:
                stage === "completed"
                  ? "Done"
                  : d.deadline === "Done"
                    ? "Aug 15"
                    : d.deadline,
            }
          : d
      )
    );
    void updateDealStatus(id, stage, statusForStage(stage));
  };

  const addDeal = async (deal: Deal) => {
    setDeals((prev) => [deal, ...prev]);
    const created = await createDeal({
      brand: deal.brand,
      value: deal.value,
      stage: deal.stage,
      deadline: deal.deadline,
      deliverables: deal.deliverables,
    });
    setDeals((prev) =>
      prev.map((d) => (d.id === deal.id ? created : d))
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Page header */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <h1 className="font-heading text-lg font-semibold tracking-tight">
            Sponsorship Pipeline
          </h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {deals.length} deals tracked · {stats.activeValue >= 10000 ? "strong" : "healthy"} pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-none border border-border p-0.5">
            <button
              onClick={() => setView("board")}
              data-active={view === "board"}
              aria-label="Board view"
              className={cn(
                "grid size-7 cursor-pointer place-items-center rounded-none transition-colors",
                view === "board"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              onClick={() => setView("table")}
              data-active={view === "table"}
              aria-label="Table view"
              className={cn(
                "grid size-7 cursor-pointer place-items-center rounded-none transition-colors",
                view === "table"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Rows3 className="size-3.5" />
            </button>
          </div>
          <Button
            size="sm"
            variant="accent"
            onClick={() => setDialogOpen(true)}
          >
            <Plus />
            New Deal
          </Button>
        </div>
      </header>

      {/* Stats strip */}
      <div className="grid shrink-0 grid-cols-3 gap-3 px-6 pb-4">
        <Stat
          icon={<CircleDollarSign className="size-3.5" />}
          label="Active pipeline"
          value={formatCurrency(stats.activeValue)}
          accent="text-[#f0f0f0]"
        />
        <Stat
          icon={<Timer className="size-3.5" />}
          label={`Payment due (${stats.dueCount})`}
          value={formatCurrency(stats.dueValue)}
          accent="text-[#f0f0f0]"
        />
        <Stat
          icon={<Trophy className="size-3.5" />}
          label="Completed"
          value={`${stats.completedCount} deals`}
          accent="text-[#f0f0f0]"
        />
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 border-t border-border px-6 pt-4 pb-4">
        {view === "board" ? (
          <Board
            deals={deals}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMove={moveDeal}
          />
        ) : (
          <TableView
            deals={deals}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMove={moveDeal}
          />
        )}
      </div>

      <AddDealDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) router.replace("/deals");
        }}
        onAdd={addDeal}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-none border border-border bg-muted/20 px-4 py-3">
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-none bg-foreground/5", accent)}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className={cn("font-heading text-[15px] font-semibold tabular-nums", accent)}>
          {value}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------- Board ------------------------------ */

function Board({
  deals,
  selectedId,
  onSelect,
  onMove,
}: {
  deals: Deal[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, s: DealStage) => void;
}) {
  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-2 scrollbar-slim">
      {STAGES.map((stage) => {
        const columnDeals = deals.filter((d) => d.stage === stage.id);
        const total = columnDeals.reduce((s, d) => s + d.value, 0);
        const meta = COLUMN_META[stage.id];
        return (
          <section key={stage.id} className="flex w-72 shrink-0 flex-col rounded-none border border-border bg-muted/10">
            {/* Column header */}
            <div className="flex items-center gap-2 px-3 pt-3 pb-2">
              <span className={cn("size-1.5 rounded-none", meta.dot)} />
              <h3 className="min-w-0 flex-1 truncate text-[13px] font-medium">
                {stage.label}
              </h3>
              <span className="rounded-none bg-foreground/10 px-1.5 py-px text-[10px] font-medium text-muted-foreground tabular-nums">
                {columnDeals.length}
              </span>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {total > 0 ? formatCurrency(total) : ""}
              </span>
            </div>

            {/* Cards */}
            <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-2.5 pb-2.5 scrollbar-slim">
              {columnDeals.length === 0 ? (
                <div className="rounded-none border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground/60">
                  Drop a deal here
                </div>
              ) : (
                columnDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    selected={deal.id === selectedId}
                    onSelect={onSelect}
                    onMove={onMove}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function DealCard({
  deal,
  selected,
  onSelect,
  onMove,
}: {
  deal: Deal;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, s: DealStage) => void;
}) {
  const platform = PLATFORM_META[deal.platform];
  const idx = STAGE_ORDER.indexOf(deal.stage);
  const next = STAGE_ORDER[idx + 1];

  return (
    <div
      onClick={() => onSelect(deal.id)}
      data-selected={selected}
      className={cn(
        "group cursor-pointer rounded-none border border-border bg-card p-3 transition-all hover:border-[#383838]",
        selected && "ring-1 ring-foreground/20"
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="grid size-8 shrink-0 place-items-center rounded-none bg-[#333333] text-[11px] font-bold text-[#f0f0f0]">
          {deal.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{deal.brand}</p>
          <span className={cn("inline-flex items-center gap-1 rounded-none border px-1.5 py-px text-[10px] font-medium", STATUS_STYLE[deal.status])}>
            <span
              className={cn(
                "size-1 rounded-none",
                deal.status === "Paid" || deal.status === "Closed" ? "bg-current opacity-60" : "animate-pulse bg-current opacity-70"
              )}
            />
            {deal.status}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Actions for ${deal.brand}`}
                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 data-open:opacity-100"
              />
            }
          >
            <MoreVertical className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Move to stage</DropdownMenuLabel>
            {STAGES.map((s) => (
              <DropdownMenuItem
                key={s.id}
                disabled={s.id === deal.stage}
                onClick={() => onMove(deal.id, s.id)}
              >
                {s.id === deal.stage && <Check className="size-3.5" />}
                <span className={cn(s.id === deal.stage && "pl-1.5")}>{s.short}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!next}
              onClick={() => next && onMove(deal.id, next)}
            >
              <ArrowRight className="size-3.5" />
              Advance {next ? `→ ${STAGES[idx + 1].short}` : "— complete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mt-3 font-heading text-[17px] font-semibold tabular-nums">
        {formatCurrency(deal.value)}
      </p>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className={cn("inline-flex items-center rounded-none border px-1.5 py-px text-[10px] font-medium", platform.className)}>
          {deal.platform}
        </span>
        <Badge variant="outline" className="border-border text-[10px] text-muted-foreground">
          <CalendarClock className="size-3" />
          {deal.deadline}
        </Badge>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <p className="truncate text-[11px] text-muted-foreground">{deal.deliverables}</p>
      </div>
    </div>
  );
}

/* ------------------------------- Table ------------------------------ */

function TableView({
  deals,
  selectedId,
  onSelect,
  onMove,
}: {
  deals: Deal[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, s: DealStage) => void;
}) {
  return (
    <div className="h-full overflow-auto rounded-none border border-border scrollbar-slim">
      <table className="w-full border-collapse text-[13px]">
        <thead className="sticky top-0 z-10 bg-background">
          <tr className="border-b border-border text-left text-[11px] text-muted-foreground uppercase">
            <th className="px-4 py-3 font-medium">Brand</th>
            <th className="px-4 py-3 font-medium">Value</th>
            <th className="px-4 py-3 font-medium">Platform</th>
            <th className="px-4 py-3 font-medium">Stage</th>
            <th className="px-4 py-3 font-medium">Deadline</th>
            <th className="px-4 py-3 font-medium">Deliverables</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => {
            const platform = PLATFORM_META[deal.platform];
            return (
              <tr
                key={deal.id}
                onClick={() => onSelect(deal.id)}
                data-selected={deal.id === selectedId}
                className={cn(
                  "group cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/30",
                  deal.id === selectedId && "bg-muted/40"
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-6 shrink-0 place-items-center rounded bg-[#333333] text-[10px] font-bold text-[#f0f0f0]">
                      {deal.initials}
                    </div>
                    <span className="font-medium">{deal.brand}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">{formatCurrency(deal.value)}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center rounded-none border px-1.5 py-px text-[10px] font-medium", platform.className)}>
                    {deal.platform}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Select value={deal.stage} onValueChange={(v) => onMove(deal.id, v as DealStage)}>
                    <SelectTrigger size="sm" className="w-fit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-muted-foreground tabular-nums">{deal.deadline}</td>
                <td className="max-w-[220px] truncate px-4 py-3 text-muted-foreground">{deal.deliverables}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center gap-1 rounded-none border px-1.5 py-px text-[10px] font-medium", STATUS_STYLE[deal.status])}>
                    <span className={cn("size-1 rounded-none", (deal.status === "Paid" || deal.status === "Closed") ? "bg-current opacity-60" : "animate-pulse bg-current opacity-70")} />
                    {deal.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------- Add dialog ---------------------------- */

function AddDealDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (deal: Deal) => void;
}) {
  const [brand, setBrand] = useState("");
  const [value, setValue] = useState("");
  const [platform, setPlatform] = useState<Platform>("YouTube");
  const [stage, setStage] = useState<DealStage>("conversation");
  const [deadline, setDeadline] = useState("");
  const [deliverables, setDeliverables] = useState("");

  const reset = () => {
    setBrand("");
    setValue("");
    setPlatform("YouTube");
    setStage("conversation");
    setDeadline("");
    setDeliverables("");
  };

  const canSubmit = brand.trim().length > 0 && Number(value) > 0;

  const submit = () => {
    if (!canSubmit) return;
    onAdd({
      id: `de-${Date.now()}`,
      brand: brand.trim(),
      initials: brand.trim().slice(0, 2).toUpperCase(),
      value: Number(value),
      platform,
      stage,
      status: statusForStage(stage),
      deadline: deadline.trim() || "TBD",
      deliverables: deliverables.trim() || "TBD",
      lastActivity: "just now",
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add manual deal</DialogTitle>
          <DialogDescription>
            Log a deal you brought in outside the inbox. It drops straight into your pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label htmlFor="deal-brand">Brand</Label>
            <Input
              id="deal-brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Notion"
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="deal-value">Deal value ($)</Label>
            <Input
              id="deal-value"
              type="number"
              min={0}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="2,500"
            />
          </div>
          <div>
            <Label>Platform</Label>
            <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Stage</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as DealStage)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="deal-deadline">Deadline</Label>
            <Input
              id="deal-deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Aug 15"
            />
          </div>
          <div>
            <Label htmlFor="deal-deliverables">Deliverables</Label>
            <Input
              id="deal-deliverables"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder="1 video · 2 stories"
            />
          </div>
        </div>

        <DialogFooter showCloseButton>
          <Button variant="accent" onClick={submit} disabled={!canSubmit}>
            <Plus />
            Add to pipeline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
