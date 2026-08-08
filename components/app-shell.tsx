"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  Layers,
  CalendarDays,
  Settings2,
  Plus,
  ChevronsLeft,
  ChevronsRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/brand-mark";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { creatorProfile } from "@/lib/mock-data";
import { PlanProvider } from "@/components/billing/plan-store";
import { UsageBar } from "@/components/billing/usage-bar";
import { PricingModal } from "@/components/billing/pricing-modal";

const NAV_ITEMS = [
  { href: "/inbox", label: "Inbox / Vetting", icon: Inbox, badge: 5 },
  { href: "/deals", label: "Sponsorship Deals", icon: Layers, badge: 8 },
  { href: "/calendar", label: "Calendar & Appointments", icon: CalendarDays },
  { href: "/settings", label: "Settings / Matrix", icon: Settings2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <PlanProvider>
      <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      {/* ---------------- Sidebar ---------------- */}
      <aside
        data-collapsed={collapsed}
        className={cn(
          "relative z-20 flex h-full shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200 ease-out",
          collapsed ? "w-[68px]" : "w-60"
        )}
      >
        {/* Brand row */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 px-3">
          <BrandMark />
          <div
            className={cn(
              "min-w-0 flex-1 transition-opacity duration-150",
              collapsed && "pointer-events-none opacity-0"
            )}
          >
            <p className="truncate text-[13px] font-semibold tracking-tight">
              Studio
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              creator assistant
            </p>
          </div>
          <button
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "grid size-7 shrink-0 cursor-pointer place-items-center rounded-none text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-4" />
            )}
          </button>
        </div>

        {/* Quick action */}
        <div className="px-3 pb-4 pt-1">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger
                render={
            <Link
              href="/deals?new=1"
              className="grid size-8 w-full place-items-center rounded-none border border-accent-primary bg-accent-primary text-accent-primary-contrast transition-colors hover:border-accent-primary-strong hover:bg-accent-primary-strong active:scale-[0.97]"
            >
              <Plus className="size-4" />
            </Link>
                }
              />
              <TooltipContent side="right">Add manual deal</TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/deals?new=1"
              className="flex h-8 items-center justify-center gap-1.5 rounded-none border border-accent-primary bg-accent-primary text-xs font-medium text-accent-primary-contrast transition-all hover:border-accent-primary-strong hover:bg-accent-primary-strong active:translate-y-px"
            >
              <Plus className="size-4" />
              Add Manual Deal
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const link = (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={cn(
                  "group relative flex h-8 items-center gap-2.5 rounded-none px-2 text-[13px] transition-colors",
                  active
                    ? "bg-accent-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                {active && (
                  <span className="absolute -left-3 h-4 w-0.5 rounded-none bg-accent-primary" />
                )}
                <item.icon
                  className="size-4 shrink-0 text-current"
                  strokeWidth={active ? 2.25 : 2}
                />
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-none bg-foreground/10 px-1.5 py-px text-[10px] font-medium text-muted-foreground tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
            return collapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      className={cn(
                        "relative flex h-8 items-center justify-center rounded-none transition-colors",
                        active
                          ? "bg-accent-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {active && (
                        <span className="absolute -left-3 h-4 w-0.5 rounded-none bg-accent-primary" />
                      )}
                      <item.icon className="size-4" strokeWidth={active ? 2.25 : 2} />
                    </Link>
                  }
                />
                <TooltipContent side="right">
                  {item.label}
                  {item.badge ? ` · ${item.badge} new` : ""}
                </TooltipContent>
              </Tooltip>
            ) : (
              link
            );
          })}
        </nav>

        {/* Usage / quota */}
        {!collapsed && (
          <div className="mx-3 mb-2">
            <UsageBar variant="sidebar" />
          </div>
        )}

        {/* Creator profile */}
        <div
          className={cn(
            "mx-3 mb-3 mt-2 flex items-center gap-2.5 rounded-none border border-border bg-muted/30 px-2.5 py-2",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-[#333333] text-[11px] font-semibold text-[#f0f0f0]">
              {creatorProfile.initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium leading-tight">
                  {creatorProfile.name}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {creatorProfile.handle}
                </p>
              </div>
              <span
                className="flex shrink-0 items-center gap-1 rounded-none bg-foreground/10 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground"
                title={`${creatorProfile.followers.toLocaleString()} followers`}
              >
                <Users className="size-2.5" />
                {creatorProfile.followerLabel}
              </span>
            </>
          )}
        </div>
      </aside>

      {/* ---------------- Main ---------------- */}
      <main className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-10 h-full overflow-y-auto scrollbar-slim">
          {children}
        </div>
      </main>

      <PricingModal />
    </div>
    </PlanProvider>
  );
}
