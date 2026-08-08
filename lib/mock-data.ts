/* ------------------------------------------------------------------ */
/*  Mock datasets for the Creator PA dashboard.                        */
/*  Pure UI data — no backend, all values are serializable.            */
/* ------------------------------------------------------------------ */

export type Platform = "YouTube" | "Instagram" | "TikTok" | "Email";

export type InboxTag =
  | "high-budget"
  | "needs-info"
  | "gifting"
  | "spam";

export type EmailStatus = "unread" | "read" | "approved" | "declined";

export interface InboxEmail {
  id: string;
  sender: string;
  senderEmail: string;
  company: string;
  initials: string;
  subject: string;
  snippet: string;
  body: string;
  tag: InboxTag;
  confidence: number;
  platform: Platform;
  detectedBudget?: number;
  proposedDeliverables: string[];
  aiRecommendation: string;
  aiDraft: string;
  receivedAt: string;
  status: EmailStatus;
}

export type DealStage =
  | "conversation"
  | "rate-lock"
  | "deliverable"
  | "payment-due"
  | "completed";

export type DealStatus =
  | "Active"
  | "Review"
  | "Uploaded"
  | "Invoiced"
  | "Paid"
  | "Closed";

export interface Deal {
  id: string;
  brand: string;
  initials: string;
  value: number;
  platform: Platform;
  stage: DealStage;
  status: DealStatus;
  deadline: string;
  deliverables: string;
  lastActivity: string;
}

export type CalendarEventType = "brand-call" | "review" | "auto-reply";

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  dayOffset: number;
  startHour: number;
  startMinute: number;
  durationMin: number;
  brand?: string;
}

export interface CreatorProfile {
  name: string;
  handle: string;
  initials: string;
  followers: number;
  followerLabel: string;
  niche: string;
}

/* ----------------------------- Metadata ----------------------------- */

export const TAG_META: Record<
  InboxTag,
  { label: string; dot: string; pill: string }
> = {
  "high-budget": {
    label: "High Budget · Qualified",
    dot: "bg-accent-primary",
    pill: "border border-l-2 border-l-accent-primary border-[#333333] bg-accent-primary-soft text-accent-primary",
  },
  "needs-info": {
    label: "Needs Info",
    dot: "bg-[#a0a0a0]",
    pill: "border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]",
  },
  gifting: {
    label: "Product Gifting · Low Budget",
    dot: "bg-[#a0a0a0]",
    pill: "border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]",
  },
  spam: {
    label: "Spam",
    dot: "bg-[#a0a0a0]",
    pill: "border border-l-2 border-l-[#a0a0a0] border-[#333333] bg-[#1e1e1e] text-[#a0a0a0]",
  },
};

export const STAGES: { id: DealStage; label: string; short: string }[] = [
  { id: "conversation", label: "In Conversation", short: "Conversation" },
  { id: "rate-lock", label: "Contract / Rate Lock", short: "Rate Lock" },
  { id: "deliverable", label: "Deliverable Pending", short: "Deliverable" },
  { id: "payment-due", label: "Payment Due", short: "Payment Due" },
  { id: "completed", label: "Completed", short: "Completed" },
];

export const STAGE_ORDER: DealStage[] = STAGES.map((s) => s.id);

export const PLATFORM_META: Record<
  Platform,
  { label: string; className: string }
> = {
  YouTube: {
    label: "YouTube",
    className: "border-[#333333] bg-[#282828] text-[#c2c2c2]",
  },
  Instagram: {
    label: "Instagram",
    className: "border-[#333333] bg-[#282828] text-[#c2c2c2]",
  },
  TikTok: {
    label: "TikTok",
    className: "border-[#333333] bg-[#282828] text-[#c2c2c2]",
  },
  Email: {
    label: "Email",
    className: "border-[#333333] bg-[#282828] text-[#a0a0a0]",
  },
};

export const EVENT_TYPE_META: Record<
  CalendarEventType,
  { label: string; chip: string; dot: string }
> = {
  "brand-call": {
    label: "Brand Call",
    chip: "border-[#333333] bg-[#282828] text-[#c2c2c2]",
    dot: "bg-[#a0a0a0]",
  },
  review: {
    label: "Content Review",
    chip: "border-[#333333] bg-[#282828] text-[#c2c2c2]",
    dot: "bg-[#a0a0a0]",
  },
  "auto-reply": {
    label: "Scheduled Auto-Reply",
    chip: "border-[#333333] bg-[#282828] text-[#c2c2c2]",
    dot: "bg-[#a0a0a0]",
  },
};

/* ----------------------------- Profile ----------------------------- */

export const creatorProfile: CreatorProfile = {
  name: "Jay Patel",
  handle: "@jayastu",
  initials: "JP",
  followers: 284_000,
  followerLabel: "284K",
  niche: "Tech & Design",
};

/* ------------------------------ Inbox ------------------------------ */

export const inboxEmails: InboxEmail[] = [
  {
    id: "em-01",
    sender: "Maya Chen",
    senderEmail: "maya@loopfinance.io",
    company: "Loop Finance",
    initials: "LF",
    subject: "YouTube Integration Partnership — $6,500",
    snippet:
      "We'd love a 90-second integrated segment in your next upload. Rates are fully flexible for the right creator.",
    body: `Hi Jay,

Your recent video on "the tools that run my desk" did incredibly well on our radar. Loop Finance is building a cashflow product for freelancers and we think your audience is a perfect match.

Proposal outline:
- One 90-second integrated segment in your next core upload
- Product mention + swipe file delivered to your viewers
- Roughly 3-4 minutes of context (you shape the narrative, we stay out of the edit)
- License for 60 days across YouTube + IG clips

Budget is open. We can move to a signed IO within 48 hours of agreement.

Would love to send over a kit + some reference videos from creators we've worked with.

Best,
Maya`,
    tag: "high-budget",
    confidence: 94,
    platform: "YouTube",
    detectedBudget: 6500,
    proposedDeliverables: [
      "90s integrated segment",
      "Product mention + swipe file",
      "60-day license (YouTube + IG clips)",
    ],
    aiRecommendation:
      "Request rate card baseline ($2,500) + media kit, then counter at $7,500 with clips priced separately at $1,200.",
    aiDraft: `Hi Maya,

Thanks so much for the thoughtful note — really appreciate the detail.

To get us moving fast, here's what I'd need to firm up a proposal:

1. My current media kit + rate card (attached below)
2. A baseline rate for a 90-second integrated segment: $2,500
3. Clips / extended usage for IG: priced at $1,200

If that range works for you, I can have a signed IO back to you within 24 hours. Also happy to chat through reference videos — I can share recent integrations that fit your positioning.

Looking forward to building this one together.

Best,
Jay`,
    receivedAt: "12m ago",
    status: "unread",
  },
  {
    id: "em-02",
    sender: "Aisha Khan",
    senderEmail: "aisha@astercoffee.com",
    company: "Aster Coffee Co.",
    initials: "AC",
    subject: "Spring campaign — Instagram story + post",
    snippet:
      "Our brand is launching a limited roast and we want authentic creator energy, not ads.",
    body: `Hello Jay,

We're a specialty coffee roaster launching a limited "Slow Mornings" roast in three weeks.

We'd like:
- 1 grid post + 2 story sequences across a week
- Wholesale coffee sent to you in advance
- Creative freedom — we trust your voice entirely

We have a real budget for this campaign (not gifting), and can share the number once we hear your rate card.

Warm regards,
Aisha`,
    tag: "high-budget",
    confidence: 88,
    platform: "Instagram",
    detectedBudget: 2800,
    proposedDeliverables: [
      "1 grid post",
      "2 story sequences (1 week)",
      "Wholesale product in advance",
    ],
    aiRecommendation:
      "Budget detected ~$2,800. Baseline is above your $2,000 minimum — send media kit and propose a $3,200 all-in bundle.",
    aiDraft: `Hi Aisha,

Love the Slow Mornings concept — that's exactly the kind of campaign I like to get behind.

Sharing my media kit + rate card now. For a grid post + two story sequences across a week I typically run $3,200, which includes one round of revisions and usage for 30 days.

If that fits, I can lock a placeholder in my calendar this week.

Best,
Jay`,
    receivedAt: "1h ago",
    status: "unread",
  },
  {
    id: "em-03",
    sender: "Danielle Roy",
    senderEmail: "danielle@bloomskin.co",
    company: "Bloom Skincare",
    initials: "BS",
    subject: "Creator collab — gifting first, paid later?",
    snippet:
      "We currently work with creators on a gifting basis, but your rates may change that.",
    body: `Hi Jay,

We love your content and would love to send you the full Bloom routine to try.

Current programs:
- Gifting program: full product bundle, no fee
- Paid creators: we open a small number of paid slots each quarter — budget is flexible but not confirmed for this cycle

If you're interested in the gifting route, we can ship this week. If you have a rate card, feel free to share — it may unlock a paid slot.

Thanks,
Danielle`,
    tag: "needs-info",
    confidence: 76,
    platform: "Email",
    proposedDeliverables: ["Full product bundle (gifting)"],
    aiRecommendation:
      "Ambiguous budget. Ask for a paid-slot rate range before committing — baseline $2,500 + media kit. Do not accept gifting at this stage.",
    aiDraft: `Hi Danielle,

Thanks for reaching out — the Bloom line looks right in my wheelhouse.

A few quick notes:
1. I've attached my media kit + rate card for reference
2. My baseline for paid integration work is $2,500
3. Happy to try the products, but I'd want a paid slot confirmed before any commitment

If you can share the range for this quarter's paid creators, I'll tell you immediately if we're aligned.

Best,
Jay`,
    receivedAt: "3h ago",
    status: "unread",
  },
  {
    id: "em-04",
    sender: "Tom Brandt",
    senderEmail: "tom@fitfuel.co",
    company: "FitFuel Snacks",
    initials: "FF",
    subject: "Free samples + unboxing content?",
    snippet:
      "No budget this quarter, but we'd love to get our protein bars in your hands.",
    body: `Hey Jay,

Our new chocolate protein bars are flying off shelves.

We don't have paid budget this quarter, but we'd love to send you a starter box (12 bars) for an honest unboxing or review slot in one of your videos or stories.

Let us know your address and we'll ship today.

Cheers,
Tom`,
    tag: "gifting",
    confidence: 91,
    platform: "YouTube",
    proposedDeliverables: ["Unboxing / review slot (12 bars)"],
    aiRecommendation:
      "Product-only gifting, no budget. Auto-decline under your $500 threshold — respond politely and offer to revisit next quarter.",
    aiDraft: `Hi Tom,

Thanks for thinking of me — the bars sound great.

Right now I'm focused on paid partnerships only, so I'll pass on this one. Keep me on your list for the next quarter and I'll happily review whatever you're launching then.

Best,
Jay`,
    receivedAt: "5h ago",
    status: "unread",
  },
  {
    id: "em-05",
    sender: "Nina Adeyemi",
    senderEmail: "nina@techflow.dev",
    company: "TechFlow",
    initials: "TF",
    subject: "TikTok series idea — open to rates?",
    snippet:
      "We want to test a short-form series. Deliverables are loose, but the idea has legs.",
    body: `Hello,

TechFlow is piloting short-form video with 3 creators. The series concept: "a day in the life of a shipped feature."

We don't have concrete deliverables yet, but we're scouting creators who'd be interested before we build the brief. What would you charge for a 4-part series?

— Nina`,
    tag: "needs-info",
    confidence: 64,
    platform: "TikTok",
    proposedDeliverables: ["4-part short-form series (TBD)"],
    aiRecommendation:
      "No budget yet, vague deliverables. Ask for campaign budget + deliverables before quoting. Offer $1,800/part baseline with a series discount.",
    aiDraft: `Hi Nina,

A day-in-the-life-of-a-shipped-feature series is genuinely a fun format.

Before I quote, two quick things would help:
1. Rough campaign budget for the pilot
2. Deliverable expectations per part (duration, cadence, revisions)

For reference, my baseline for short-form series work is $1,800/part, with a 10% series discount at 4+ parts.

Happy to sketch a format with you once I have those details.

Best,
Jay`,
    receivedAt: "Yesterday",
    status: "read",
  },
  {
    id: "em-06",
    sender: "Marcus Lee",
    senderEmail: "support@getrichfast-crypto.io",
    company: "—",
    initials: "GR",
    subject: "HUGE opportunity — earn $10K/week 🚀",
    snippet:
      "Dear creator, we pay 10% commission on every referral. No effort required.",
    body: `Dear Creator,

Congratulations! We've selected your channel for our exclusive promotion.

Earn $10,000 per week promoting our platform. Zero effort. Just post the link we give you. Wire transfer within 48 hours.

No contracts. No questions. Act now before slots fill up!!

Sincerely,
Marcus`,
    tag: "spam",
    confidence: 99,
    platform: "Email",
    proposedDeliverables: [],
    aiRecommendation:
      "Confidence 99% spam. Flagged and archived — no response drafted. Add sender to blocklist.",
    aiDraft: "",
    receivedAt: "Yesterday",
    status: "unread",
  },
  {
    id: "em-07",
    sender: "Sofia Marchetti",
    senderEmail: "sofia@wanderlabs.com",
    company: "Wander Travel",
    initials: "WT",
    subject: "2026 creator partnership — 6-month program",
    snippet:
      "Budget approved for a long-term creator program. We'd like to talk annual rates.",
    body: `Hi Jay,

Wander is launching a 6-month creator program for 2026 and your name is at the top of our list.

The shape:
- 1 long-form video per month (6 total)
- 2 story sequences per video
- One trip fully funded + production covered
- Annualized budget already approved

We'd like to talk total-program pricing and a rate that rewards a long-term relationship. Can we book 20 minutes this week?

Best,
Sofia`,
    tag: "high-budget",
    confidence: 96,
    platform: "YouTube",
    detectedBudget: 12000,
    proposedDeliverables: [
      "6 long-form videos (monthly)",
      "2 story sequences each",
      "1 fully funded trip",
    ],
    aiRecommendation:
      "Strong multi-month deal. Detected ~$12,000/yr. Propose $15,000 annual program with trip expenses on top; book a call via Cal.com.",
    aiDraft: `Hi Sofia,

A 6-month program with funded travel is exactly the kind of partnership I love to say yes to.

Sharing my media kit now. For a 6-video program I'd propose:

- 6 long-form videos: $12,000
- 2 story sequences per video: $3,000
- Total: $15,000 (trip + production covered separately)

I have space to book a 20-minute call this week — here's my Cal.com link. Looking forward to it.

Best,
Jay`,
    receivedAt: "Yesterday",
    status: "read",
  },
  {
    id: "em-08",
    sender: "Leo Park",
    senderEmail: "leo@kibosocks.com",
    company: "Kibo Socks",
    initials: "KS",
    subject: "Socks for your socks drawer 😄",
    snippet:
      "We can offer $150 + free socks for one story. Low commitment, high vibes.",
    body: `Hey Jay,

We make the most comfortable socks in the world. Seriously.

Offer: $150 + 3 free pairs for a 24-hour story mention. No other deliverables.

Let us know!

Leo`,
    tag: "gifting",
    confidence: 82,
    platform: "Instagram",
    detectedBudget: 150,
    proposedDeliverables: ["24-hour story mention"],
    aiRecommendation:
      "$150 is below your $500 minimum. Auto-decline with a friendly note and a rate-card nudge.",
    aiDraft: `Hi Leo,

Appreciate the offer — but my minimum for a story mention is $500, so I'll have to pass at $150.

If the budget flexes, happy to revisit. Keep the socks for someone with more ankle real estate than me.

Best,
Jay`,
    receivedAt: "2d ago",
    status: "read",
  },
];

/* ------------------------------- Deals ------------------------------ */

export const deals: Deal[] = [
  {
    id: "de-01",
    brand: "Wander Travel",
    initials: "WT",
    value: 15000,
    platform: "YouTube",
    stage: "conversation",
    status: "Active",
    deadline: "Jun 30",
    deliverables: "6 videos · 2 stories each",
    lastActivity: "2h ago",
  },
  {
    id: "de-02",
    brand: "Loop Finance",
    initials: "LF",
    value: 7500,
    platform: "YouTube",
    stage: "conversation",
    status: "Active",
    deadline: "Jul 12",
    deliverables: "90s integration · IG clips",
    lastActivity: "45m ago",
  },
  {
    id: "de-03",
    brand: "Aster Coffee Co.",
    initials: "AC",
    value: 3200,
    platform: "Instagram",
    stage: "rate-lock",
    status: "Review",
    deadline: "Jul 05",
    deliverables: "1 post · 2 story sequences",
    lastActivity: "3h ago",
  },
  {
    id: "de-04",
    brand: "Bloom Skincare",
    initials: "BS",
    value: 2500,
    platform: "Email",
    stage: "rate-lock",
    status: "Review",
    deadline: "Jul 09",
    deliverables: "TBD pending media kit",
    lastActivity: "Yesterday",
  },
  {
    id: "de-05",
    brand: "Frame Audio",
    initials: "FA",
    value: 4800,
    platform: "TikTok",
    stage: "deliverable",
    status: "Uploaded",
    deadline: "Jul 18",
    deliverables: "4-part series",
    lastActivity: "1d ago",
  },
  {
    id: "de-06",
    brand: "Plain Goods",
    initials: "PG",
    value: 2100,
    platform: "Instagram",
    stage: "deliverable",
    status: "Review",
    deadline: "Jul 21",
    deliverables: "Reel + story bundle",
    lastActivity: "2d ago",
  },
  {
    id: "de-07",
    brand: "Northwind App",
    initials: "NA",
    value: 5900,
    platform: "YouTube",
    stage: "payment-due",
    status: "Invoiced",
    deadline: "Aug 02",
    deliverables: "Sponsored tutorial",
    lastActivity: "3d ago",
  },
  {
    id: "de-08",
    brand: "Craft & Co.",
    initials: "CC",
    value: 1750,
    platform: "TikTok",
    stage: "payment-due",
    status: "Invoiced",
    deadline: "Aug 05",
    deliverables: "2 short-form videos",
    lastActivity: "4d ago",
  },
  {
    id: "de-09",
    brand: "Sunrise Fitness",
    initials: "SF",
    value: 3600,
    platform: "YouTube",
    stage: "completed",
    status: "Paid",
    deadline: "Done",
    deliverables: "60s integration",
    lastActivity: "1w ago",
  },
  {
    id: "de-10",
    brand: "Kibo Socks",
    initials: "KS",
    value: 150,
    platform: "Instagram",
    stage: "completed",
    status: "Closed",
    deadline: "Done",
    deliverables: "Story mention (declined)",
    lastActivity: "1w ago",
  },
];

/* ------------------------------ Calendar ---------------------------- */

export const calendarWeek = [
  { dayOffset: 0, label: "Mon" },
  { dayOffset: 1, label: "Tue" },
  { dayOffset: 2, label: "Wed" },
  { dayOffset: 3, label: "Thu" },
  { dayOffset: 4, label: "Fri" },
  { dayOffset: 5, label: "Sat" },
  { dayOffset: 6, label: "Sun" },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "ev-01",
    title: "Wander Travel — kickoff call",
    type: "brand-call",
    dayOffset: 0,
    startHour: 10,
    startMinute: 0,
    durationMin: 30,
    brand: "Wander Travel",
  },
  {
    id: "ev-02",
    title: "Auto-reply: rate card sent",
    type: "auto-reply",
    dayOffset: 0,
    startHour: 14,
    startMinute: 30,
    durationMin: 15,
    brand: "Bloom Skincare",
  },
  {
    id: "ev-03",
    title: "Aster Coffee — rate negotiation",
    type: "brand-call",
    dayOffset: 1,
    startHour: 11,
    startMinute: 0,
    durationMin: 45,
    brand: "Aster Coffee Co.",
  },
  {
    id: "ev-04",
    title: "Draft review: Frame Audio series",
    type: "review",
    dayOffset: 2,
    startHour: 9,
    startMinute: 30,
    durationMin: 60,
    brand: "Frame Audio",
  },
  {
    id: "ev-05",
    title: "Auto-reply: media kit dispatched",
    type: "auto-reply",
    dayOffset: 2,
    startHour: 16,
    startMinute: 0,
    durationMin: 15,
    brand: "Loop Finance",
  },
  {
    id: "ev-06",
    title: "Northwind — payment follow-up",
    type: "brand-call",
    dayOffset: 3,
    startHour: 13,
    startMinute: 0,
    durationMin: 30,
    brand: "Northwind App",
  },
  {
    id: "ev-07",
    title: "Content review: Plain Goods reel",
    type: "review",
    dayOffset: 4,
    startHour: 10,
    startMinute: 30,
    durationMin: 45,
    brand: "Plain Goods",
  },
  {
    id: "ev-08",
    title: "Auto-reply: decline gifting",
    type: "auto-reply",
    dayOffset: 5,
    startHour: 12,
    startMinute: 0,
    durationMin: 15,
    brand: "Kibo Socks",
  },
];

/* ----------------------------- Preferences -------------------------- */

export interface RateCard {
  minDedicated: number;
  minIntegration: number;
  defaultIntegrationRate: number;
  currency: string;
}

export const rateCard: RateCard = {
  minDedicated: 2500,
  minIntegration: 1200,
  defaultIntegrationRate: 1500,
  currency: "USD",
};

export interface AutomationRule {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export const automationRules: AutomationRule[] = [
  {
    id: "rule-1",
    label: "Auto-decline product-only gifting",
    description: "Decline offers under $500 with a polite, templated reply.",
    enabled: true,
  },
  {
    id: "rule-2",
    label: "Auto-send media kit",
    description: "Dispatch media kit + rate card when detected budget is above $1,000.",
    enabled: true,
  },
  {
    id: "rule-3",
    label: "Auto-request rate card",
    description: "Ask senders for their budget when none is detected.",
    enabled: false,
  },
  {
    id: "rule-4",
    label: "Auto-book calls",
    description: "Offer Cal.com slots to senders with high-budget intent.",
    enabled: true,
  },
];

export interface ConnectedAccount {
  id: string;
  name: string;
  detail: string;
  connected: boolean;
}

export const connectedAccounts: ConnectedAccount[] = [
  {
    id: "acc-1",
    name: "Gmail",
    detail: "jayastu.studio@gmail.com · last synced 4 min ago",
    connected: true,
  },
  {
    id: "acc-2",
    name: "Cal.com",
    detail: "cal.com/jayastu · booking link active",
    connected: true,
  },
  {
    id: "acc-3",
    name: "YouTube",
    detail: "Connected via Gmail · 4.2K subscribers synced",
    connected: true,
  },
];

/* ------------------------------ Plans ------------------------------ */

export type PlanTier = "basic" | "premium";

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface PlanMeta {
  id: PlanTier;
  name: string;
  price: number;
  tagline: string;
  highlight: boolean;
  emailLimit: number | null;
  features: PlanFeature[];
}

export const PLAN_META: Record<PlanTier, PlanMeta> = {
  basic: {
    id: "basic",
    name: "Basic",
    price: 30,
    tagline: "For creators getting started with brand work.",
    highlight: false,
    emailLimit: 100,
    features: [
      { label: "100 emails processed / month", included: true },
      { label: "Standard AI vetting", included: true },
      { label: "Basic rate matrix", included: true },
      { label: "Gmail + Cal.com integrations", included: true },
      { label: "Advanced kanban + forecasts", included: false },
      { label: "Priority auto-replies", included: false },
      { label: "Custom media kit hosting", included: false },
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 80,
    tagline: "For creators running a serious sponsorship pipeline.",
    highlight: true,
    emailLimit: null,
    features: [
      { label: "Unlimited emails processed", included: true },
      { label: "Advanced vetting + sentiment", included: true },
      { label: "Full rate matrix + negotiation", included: true },
      { label: "Advanced kanban + forecasts", included: true },
      { label: "Priority auto-replies", included: true },
      { label: "Custom media kit hosting", included: true },
    ],
  },
};

export const PLAN_ORDER: PlanTier[] = ["basic", "premium"];

export interface AccountUsage {
  tier: PlanTier;
  emailsUsed: number;
  cycle: string;
}

export const initialUsage: AccountUsage = {
  tier: "basic",
  emailsUsed: 84,
  cycle: "Jul 6 – Aug 5",
};

export function usagePercent(
  emailsUsed: number,
  limit: number | null
): number {
  if (limit === null) return 0;
  return Math.min(100, Math.round((emailsUsed / limit) * 100));
}

export function isAtLimit(emailsUsed: number, limit: number | null): boolean {
  return limit !== null && emailsUsed >= limit;
}
