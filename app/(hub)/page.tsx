import type { Metadata } from "next";
import { HubView } from "@/components/hub/hub-view";

export const metadata: Metadata = {
  title: "Creator Sponsorship Hub",
  description:
    "Your gamified brand-deal command center — vet inboxes, track revenue goals, and level up your sponsorship pipeline.",
};

export default function HubPage() {
  return <HubView />;
}
