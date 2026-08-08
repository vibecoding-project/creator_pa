"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Sparkles,
  Plus,
  Video,
  FileCheck2,
  Bot,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  calendarEvents as seedEvents,
  calendarWeek,
  EVENT_TYPE_META,
  type CalendarEvent,
  type CalendarEventType,
} from "@/lib/mock-data";

const TYPE_ICON: Record<CalendarEventType, React.ReactNode> = {
  "brand-call": <Video className="size-3" />,
  review: <FileCheck2 className="size-3" />,
  "auto-reply": <Bot className="size-3" />,
};

function getTodayIndex() {
  return (new Date().getDay() + 6) % 7; // Mon = 0
}

function fmtTime(h: number, m: number) {
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}

function rangeLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

/* ------------------------------------------------------------------ */

export function CalendarView() {
  const todayIdx = getTodayIndex();
  const monday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - todayIdx);
    return d;
  }, [todayIdx]);

  const [events, setEvents] = useState<CalendarEvent[]>(seedEvents);
  const [autoBooking, setAutoBooking] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const weekDates = calendarWeek.map((day) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + day.dayOffset);
    return d;
  });

  const startLabel = rangeLabel(weekDates[0]);
  const endLabel = rangeLabel(weekDates[6]);
  const weekRange =
    startLabel.split(" ")[0] === endLabel.split(" ")[0]
      ? startLabel
      : `${startLabel} – ${endLabel}`;

  const selected = events.find((e) => e.id === selectedId) ?? null;
  const todaysEvents = events
    .filter((e) => e.dayOffset === todayIdx)
    .sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute));

  const addEvent = (ev: CalendarEvent) => setEvents((prev) => [...prev, ev]);

  return (
    <div className="flex h-full flex-col">
      {/* Page header */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-lg font-semibold tracking-tight">
              Calendar &amp; Appointments
            </h1>
            <div className="flex items-center gap-1 rounded-none border border-border px-1 py-0.5">
              <ChevronLeft className="size-3.5 text-muted-foreground" />
              <span className="min-w-[104px] text-center text-[12px] font-medium text-muted-foreground tabular-nums">
                {weekRange}
              </span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {events.length} events this week · 3 brand calls · 2 reviews
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-2 rounded-none border px-3 py-1.5 transition-colors",
              autoBooking
                ? "border-l-2 border-l-accent-primary border-[#333333] bg-[#1e1e1e]"
                : "border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e]"
            )}
          >
            <span
              className={cn(
                "relative flex size-2",
                autoBooking && "has-data-[pulse]"
              )}
            >
              <span
                className={cn(
                  "relative inline-flex size-2 rounded-none",
                  autoBooking ? "bg-accent-primary" : "bg-[#a0a0a0]"
                )}
              />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-medium">
                {autoBooking ? "Auto-booking active" : "Auto-booking paused"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {autoBooking ? "New invites self-book" : "Invites wait in inbox"}
              </p>
            </div>
            <Switch
              checked={autoBooking}
              onCheckedChange={setAutoBooking}
              size="sm"
              aria-label="Toggle auto-booking"
            />
          </div>
          <Button size="sm" variant="accent" onClick={() => setDialogOpen(true)}>
            <Plus />
            New Appointment
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="min-h-0 flex-1 border-t border-border">
        <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[1fr_300px]">
          {/* Week grid */}
          <section className="min-h-0 overflow-auto p-4 scrollbar-slim">
            <div className="grid h-full min-w-[840px] grid-cols-7 gap-px overflow-hidden rounded-none border border-border bg-[#282828]/40">
              {calendarWeek.map((day, i) => {
                const isToday = i === todayIdx;
                const date = weekDates[i];
                const dayEvents = events
                  .filter((e) => e.dayOffset === day.dayOffset)
                  .sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute));
                return (
                  <div key={day.dayOffset} className="flex flex-col bg-background">
                    <div
                      className={cn(
                        "flex items-center justify-center gap-1.5 border-b border-border py-2.5",
                        isToday && "bg-muted/40"
                      )}
                    >
                      <span className={cn("text-[11px] font-medium", isToday ? "text-foreground" : "text-muted-foreground")}>
                        {day.label}
                      </span>
                      <span
                        className={cn(
                          "grid size-5 place-items-center rounded-none text-[11px] font-medium tabular-nums",
                          isToday
                            ? "bg-[#f0f0f0] text-[#121212]"
                            : "text-muted-foreground"
                        )}
                      >
                        {date.getDate()}
                      </span>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col gap-2 p-2">
                      {dayEvents.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center rounded-none border border-dashed border-border/70 text-[10px] text-muted-foreground/40">
                          Open
                        </div>
                      ) : (
                        dayEvents.map((ev) => (
                          <EventChip
                            key={ev.id}
                            event={ev}
                            selected={ev.id === selectedId}
                            onClick={() => setSelectedId(ev.id)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="min-h-0 space-y-4 overflow-y-auto border-t border-border p-4 scrollbar-slim lg:border-t-0 lg:border-l">
            {/* Auto-booking explainer */}
            <div className="rounded-none border border-border bg-muted/20 p-4">
              <p className="flex items-center gap-1.5 text-[12px] font-medium">
                <Sparkles className="size-3.5 text-[#f0f0f0]" />
                How auto-booking works
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                Qualified senders get a Cal.com link. Calls land on open slots and your AI
                drafts a summary before you show up.
              </p>
              <div className="mt-3 space-y-2">
                <StatLine icon={<CalendarClock className="size-3.5" />} label="Open slots this week" value="6" />
                <StatLine icon={<Bot className="size-3.5" />} label="Auto-replies queued" value="3" />
                <StatLine icon={<Video className="size-3.5" />} label="Calls booked" value="4" />
              </div>
            </div>

            {/* Today */}
            <div>
              <p className="flex items-center gap-1.5 text-[12px] font-medium">
                <CalendarDays className="size-3.5 text-muted-foreground" />
                Today&apos;s agenda
              </p>
              <div className="mt-2 space-y-2">
                {todaysEvents.length === 0 ? (
                  <p className="text-[12px] text-muted-foreground">No events today. Enjoy the quiet.</p>
                ) : (
                  todaysEvents.map((ev) => {
                    const meta = EVENT_TYPE_META[ev.type];
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedId(ev.id)}
                        className={cn(
                          "w-full rounded-none border border-border bg-muted/20 px-3 py-2.5 text-left transition-colors hover:border-[#383838]",
                          selectedId === ev.id && "border-[#383838] bg-muted/40"
                        )}
                      >
                        <p className="text-[12px] font-medium">{ev.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <span className={cn("size-1.5 rounded-none", meta.dot)} />
                          {fmtTime(ev.startHour, ev.startMinute)} · {meta.label}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected event */}
            {selected && (
              <div className="rounded-none border border-[#333333] bg-[#1e1e1e] p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#f0f0f0] uppercase">
                  <Sparkles className="size-3" />
                  Event detail
                </p>
                <p className="mt-2 text-[13px] font-medium">{selected.title}</p>
                <div className="mt-2 space-y-1.5 text-[12px] text-muted-foreground">
                  <p>
                    {fmtTime(selected.startHour, selected.startMinute)} —{" "}
                    {fmtTime(
                      selected.startHour +
                        Math.floor((selected.startMinute + selected.durationMin) / 60),
                      (selected.startMinute + selected.durationMin) % 60
                    )}
                  </p>
                  {selected.brand && <p>Brand · {selected.brand}</p>}
                </div>
                <Button size="xs" variant="outline" className="mt-3 text-[11px]">
                  Open notes
                </Button>
              </div>
            )}
          </aside>
        </div>
      </div>

      <NewAppointmentDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={addEvent} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StatLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function EventChip({
  event,
  selected,
  onClick,
}: {
  event: CalendarEvent;
  selected: boolean;
  onClick: () => void;
}) {
  const meta = EVENT_TYPE_META[event.type];
  return (
    <button
      onClick={onClick}
      data-selected={selected}
      className={cn(
        "group w-full rounded-none border px-2.5 py-2 text-left transition-all",
        meta.chip,
        selected && "ring-1 ring-foreground/20"
      )}
    >
      <p className="flex items-center gap-1 text-[11px] font-semibold text-current">
        {TYPE_ICON[event.type]}
        {fmtTime(event.startHour, event.startMinute)}
      </p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug font-medium text-foreground/90">
        {event.title}
      </p>
      {event.brand && (
        <p className="mt-0.5 truncate text-[10px] text-current opacity-70">{event.brand}</p>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */

function NewAppointmentDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdd: (ev: CalendarEvent) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<CalendarEventType>("brand-call");
  const [day, setDay] = useState<number>(getTodayIndex());
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("30");

  const canSubmit = title.trim().length > 0 && /^\d{1,2}:\d{2}$/.test(time);

  const submit = () => {
    if (!canSubmit) return;
    const [h, m] = time.split(":").map(Number);
    onAdd({
      id: `ev-${Date.now()}`,
      title: title.trim(),
      type,
      dayOffset: day,
      startHour: h,
      startMinute: m,
      durationMin: Number(duration),
    });
    setTitle("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New appointment</DialogTitle>
          <DialogDescription>Block time for a call, a review, or a scheduled reply.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="ev-title">Title</Label>
            <Input id="ev-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Loop Finance — kickoff" autoFocus />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as CalendarEventType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand-call">Brand Call</SelectItem>
                <SelectItem value="review">Content Review</SelectItem>
                <SelectItem value="auto-reply">Scheduled Auto-Reply</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Day</Label>
              <Select value={String(day)} onValueChange={(v) => setDay(Number(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {calendarWeek.map((d, i) => (
                    <SelectItem key={d.dayOffset} value={String(i)}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ev-time">Time</Label>
              <Input id="ev-time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="10:00" />
            </div>
            <div>
              <Label>Length</Label>
              <Select value={duration} onValueChange={(v) => setDuration(v ?? "30")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter showCloseButton>
          <Button variant="accent" onClick={submit} disabled={!canSubmit}>
            <Plus />
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
